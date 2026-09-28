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

/**
 * Validates and activates promo codes:
 * Secret Code: "thenightnix" -> gives 1000 Gems and 5000 Coins for FREE!
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

  if (normalized === 'thenightnix') {
    if (redeemedList.includes('thenightnix')) {
      return {
        success: false,
        message: 'لقد قمت بتفعيل هذا الكود مسبقاً!',
      };
    }

    const updated: PlayerWallet = {
      ...currentWallet,
      coins: currentWallet.coins + 5000,
      gems: currentWallet.gems + 1000,
      redeemedCodes: [...redeemedList, 'thenightnix'],
    };

    saveWallet(updated);
    return {
      success: true,
      message: 'مبروك! تم تفعيل الكود بنجاح وحصلت على 1000 جوهرة و 5000 نقود مجاناً!',
      newWallet: updated,
      coinsAwarded: 5000,
      gemsAwarded: 1000,
    };
  }

  // Any other code is invalid
  return {
    success: false,
    message: 'هذا الكود خاطئ',
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
