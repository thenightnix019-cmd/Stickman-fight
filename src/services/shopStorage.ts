import { PlayerWallet } from '../types/shop';

const WALLET_KEY = 'stick_arena_player_wallet_v1';

export const DEFAULT_WALLET: PlayerWallet = {
  coins: 200, // starting balance for testing
  gems: 10,  // starting balance for testing
  purchasedHats: [],
  purchasedSkins: [],
  purchasedShoes: [],
  equippedHat: null,
  equippedSkin: null,
  equippedShoes: null,
  redeemedCodes: [],
};

export function loadWallet(): PlayerWallet {
  try {
    const raw = localStorage.getItem(WALLET_KEY);
    if (!raw) return { ...DEFAULT_WALLET };
    const parsed = JSON.parse(raw);
    return {
      coins: typeof parsed.coins === 'number' ? parsed.coins : DEFAULT_WALLET.coins,
      gems: typeof parsed.gems === 'number' ? parsed.gems : DEFAULT_WALLET.gems,
      purchasedHats: Array.isArray(parsed.purchasedHats) ? parsed.purchasedHats : [],
      purchasedSkins: Array.isArray(parsed.purchasedSkins) ? parsed.purchasedSkins : [],
      purchasedShoes: Array.isArray(parsed.purchasedShoes) ? parsed.purchasedShoes : [],
      equippedHat: parsed.equippedHat || null,
      equippedSkin: parsed.equippedSkin || null,
      equippedShoes: parsed.equippedShoes || null,
      redeemedCodes: Array.isArray(parsed.redeemedCodes) ? parsed.redeemedCodes : [],
    };
  } catch (err) {
    console.error('Failed to load wallet', err);
    return { ...DEFAULT_WALLET };
  }
}

export function saveWallet(wallet: PlayerWallet) {
  try {
    localStorage.setItem(WALLET_KEY, JSON.stringify(wallet));
  } catch (err) {
    console.error('Failed to save wallet', err);
  }
}

export interface PromoCodeConfig {
  coins: number;
  gems: number;
  message: string;
}

export const PROMO_CODES: Record<string, PromoCodeConfig> = {
  niiro: {
    coins: 2000,
    gems: 100,
    message: 'مبروك! تم تفعيل كود niiro وحصلت على 100 جوهرة و 2000 نقود بنجاح!',
  },
  zero: {
    coins: 0,
    gems: 1000,
    message: 'مبروك! تم تفعيل كود zero وحصلت على 1000 جوهرة بنجاح!',
  },
  mr001: {
    coins: 3000,
    gems: 500,
    message: 'مبروك! تم تفعيل كود mr001 وحصلت على 500 جوهرة و 3000 نقود بنجاح!',
  },
  thenightnix: {
    coins: 5000,
    gems: 1000,
    message: 'مبروك! تم تفعيل كود thenightnix وحصلت على 1000 جوهرة و 5000 نقود بنجاح!',
  },
};

/**
 * Validates and activates promo codes:
 * - "niiro": 100 gems & 2000 coins
 * - "zero": 1000 gems & 0 coins
 * - "mr001": 500 gems & 3000 coins
 * - "thenightnix": 1000 gems & 5000 coins
 */
export function redeemPromoCode(inputCode: string): {
  success: boolean;
  message: string;
  newWallet?: PlayerWallet;
  coinsAwarded?: number;
  gemsAwarded?: number;
} {
  const normalized = inputCode.trim().toLowerCase();
  const currentWallet = loadWallet();
  const redeemedList = currentWallet.redeemedCodes || [];

  const promo = PROMO_CODES[normalized];

  if (promo) {
    if (redeemedList.includes(normalized)) {
      return {
        success: false,
        message: 'لقد قمت بتفعيل هذا الكود مسبقاً!',
      };
    }

    const updated: PlayerWallet = {
      ...currentWallet,
      coins: currentWallet.coins + promo.coins,
      gems: currentWallet.gems + promo.gems,
      redeemedCodes: [...redeemedList, normalized],
    };

    saveWallet(updated);
    return {
      success: true,
      message: promo.message,
      newWallet: updated,
      coinsAwarded: promo.coins,
      gemsAwarded: promo.gems,
    };
  }

  // Any other code is invalid
  return {
    success: false,
    message: 'هذا الكود غير صحيح، تأكد من كتابته بشكل سليم!',
  };
}

/**
 * Claims free recharge bonus from YouTube channel support (+1000 coins, +100 gems)
 */
export function claimYoutubeRecharge(): {
  success: boolean;
  message: string;
  newWallet: PlayerWallet;
  coinsAwarded: number;
  gemsAwarded: number;
} {
  const currentWallet = loadWallet();
  const coinsAwarded = 1000;
  const gemsAwarded = 100;

  const updated: PlayerWallet = {
    ...currentWallet,
    coins: currentWallet.coins + coinsAwarded,
    gems: currentWallet.gems + gemsAwarded,
  };

  saveWallet(updated);
  return {
    success: true,
    message: 'تم شحن رصيد مجاني بنجاح! +1000 نقود و +100 جوهرة',
    newWallet: updated,
    coinsAwarded,
    gemsAwarded,
  };
}

/**
 * Awards standard round completion reward: +50 Coins and +1 Gem!
 */
export function awardRoundRewards(isWinnerBonus: boolean = false): {
  earnedCoins: number;
  earnedGems: number;
  newWallet: PlayerWallet;
} {
  const current = loadWallet();
  const earnedCoins = isWinnerBonus ? 75 : 50; // 50 coins guaranteed per round, 75 if won
  const earnedGems = isWinnerBonus ? 2 : 1;    // 1 gem guaranteed per round, 2 if won

  const updated: PlayerWallet = {
    ...current,
    coins: current.coins + earnedCoins,
    gems: current.gems + earnedGems,
  };

  saveWallet(updated);
  return { earnedCoins, earnedGems, newWallet: updated };
}
