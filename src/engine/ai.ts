import {
  PlayerState,
  WeaponPickup,
  PowerUpPickup,
  FirePatch,
  GameMode,
  ArenaMap,
  AIDifficulty,
} from '../types/game';

interface AIInputs {
  left: boolean;
  right: boolean;
  jump: boolean;
  down: boolean;
  attack: boolean;
}

export function computeAIInputs(
  bot: PlayerState,
  allPlayers: PlayerState[],
  weaponPickups: WeaponPickup[],
  powerUpPickups: PowerUpPickup[],
  firePatches: FirePatch[],
  map: ArenaMap,
  gameMode: GameMode,
  difficulty: AIDifficulty = 'normal',
  safeZoneRadius?: number,
  safeZoneCenter?: { x: number; y: number }
): AIInputs {
  const inputs: AIInputs = {
    left: false,
    right: false,
    jump: false,
    down: false,
    attack: false,
  };

  if (!bot.isAlive) return inputs;

  // 1. Identify live enemies (respecting teams and infection status)
  const enemies = allPlayers.filter((p) => {
    if (p.id === bot.id || !p.isAlive) return false;
    if (gameMode === 'team_deathmatch') {
      return bot.team !== p.team;
    }
    if (gameMode === 'infection') {
      return !!bot.isInfected !== !!p.isInfected;
    }
    return true;
  });
  if (enemies.length === 0) return inputs;

  // Find closest enemy
  let closestEnemy: PlayerState | null = null;
  let minEnemyDist = Infinity;
  for (const enemy of enemies) {
    const dist = Math.hypot(enemy.x - bot.x, enemy.y - bot.y);
    if (dist < minEnemyDist) {
      minEnemyDist = dist;
      closestEnemy = enemy;
    }
  }

  // 2. Target destination determination
  let targetX = closestEnemy ? closestEnemy.x : bot.x;
  let targetY = closestEnemy ? closestEnemy.y : bot.y;

  // In Infection Mode: Uninfected survivors FLEE from zombies!
  if (gameMode === 'infection' && !bot.isInfected && closestEnemy) {
    const fleeDirection = bot.x >= closestEnemy.x ? 1 : -1;
    // Target a spot away from the zombie
    targetX = bot.x + fleeDirection * 350;
    // Keep within arena bounds
    targetX = Math.max(80, Math.min(map.width - 80, targetX));
    // If trapped at the arena edge, try to jump over or change elevation
    if (Math.abs(bot.x - closestEnemy.x) < 140) {
      inputs.jump = bot.isGrounded || bot.canDoubleJump;
    }
  }

  // Easy AI: Frequently wanders aimlessly or stands around daydreaming (Very Easy)
  if (difficulty === 'easy') {
    // 45% chance to wander or do nothing instead of chasing the enemy
    const wanderSeed = Math.sin(Date.now() * 0.002 + bot.id * 10);
    if (wanderSeed > 0.1) {
      targetX = bot.x + wanderSeed * 140;
    }
  }

  // If in Battle Royale and far from safe zone, prioritize safe zone!
  if (gameMode === 'battle_royale' && safeZoneCenter && safeZoneRadius !== undefined) {
    const distToCenter = Math.hypot(bot.x - safeZoneCenter.x, bot.y - safeZoneCenter.y);
    if (distToCenter > safeZoneRadius * 0.7) {
      // Hard bots rush inside, normal rush inside, easy bots wander sluggishly
      if (difficulty !== 'easy' || Math.random() < 0.6) {
        targetX = safeZoneCenter.x;
        targetY = safeZoneCenter.y;
      }
    }
  }

  // If King of the Hill and nobody is contesting or bot needs points, prioritize hill zone
  if (gameMode === 'king_of_the_hill' && map.hillZone) {
    const hillCenterX = map.hillZone.x + map.hillZone.width / 2;
    const hillCenterY = map.hillZone.y + map.hillZone.height / 2;
    const hillPriority = difficulty === 'hard' ? 0.85 : difficulty === 'normal' ? 0.6 : 0.25;
    if (Math.random() < hillPriority) {
      targetX = hillCenterX;
      targetY = hillCenterY;
    }
  }

  // Pickup seeking behavior
  if (difficulty !== 'easy') {
    // If unarmed or has only fists, check for nearby weapon pickups
    if (bot.weapon === 'fists' && weaponPickups.length > 0) {
      let bestPickup: WeaponPickup | null = null;
      let minPickDist = difficulty === 'hard' ? 450 : 260;
      for (const p of weaponPickups) {
        const d = Math.hypot(p.x - bot.x, p.y - bot.y);
        if (d < minPickDist) {
          minPickDist = d;
          bestPickup = p;
        }
      }
      if (bestPickup) {
        targetX = bestPickup.x;
        targetY = bestPickup.y;
      }
    }

    // Check for power-up pickups
    if (!bot.activePowerUp && powerUpPickups.length > 0 && Math.random() < (difficulty === 'hard' ? 0.8 : 0.4)) {
      let bestPower: PowerUpPickup | null = null;
      let minPowerDist = difficulty === 'hard' ? 400 : 220;
      for (const p of powerUpPickups) {
        const d = Math.hypot(p.x - bot.x, p.y - bot.y);
        if (d < minPowerDist) {
          minPowerDist = d;
          bestPower = p;
        }
      }
      if (bestPower) {
        targetX = bestPower.x;
        targetY = bestPower.y;
      }
    }
  }

  // 3. Movement towards targetX (Tuned per difficulty)
  const dx = targetX - bot.x;
  const dy = targetY - bot.y;

  // Move probability & threshold
  let moveProbability = 0.65; // normal: relaxed
  let moveDeadzone = 30;

  if (difficulty === 'easy') {
    moveProbability = 0.42; // very easy: moves sluggishly and hesitates constantly
    moveDeadzone = 45;
  } else if (difficulty === 'hard') {
    moveProbability = 0.90; // hard: responsive
    moveDeadzone = 20;
  }

  if (Math.abs(dx) > moveDeadzone) {
    if (Math.random() < moveProbability) {
      if (dx > 0) inputs.right = true;
      else inputs.left = true;
    }
  }

  // 4. Vertical navigation (jumping / dropping)
  let jumpProbability = 0.45; // normal
  if (difficulty === 'easy') jumpProbability = 0.22; // very clumsy jumping
  else if (difficulty === 'hard') jumpProbability = 0.72;

  if (dy < -40 && (bot.isGrounded || bot.canDoubleJump)) {
    inputs.jump = Math.random() < jumpProbability;
  } else if (dy > 55) {
    // Drop down through one-way platforms
    inputs.down = Math.random() < (difficulty === 'hard' ? 0.65 : difficulty === 'normal' ? 0.35 : 0.15);
  }

  // Jump if stuck against a wall or obstacle
  if (bot.isGrounded && Math.abs(bot.vx) < 0.5 && (inputs.left || inputs.right)) {
    inputs.jump = Math.random() < (difficulty === 'easy' ? 0.35 : 0.75);
  }

  // Avoid fire patches
  if (difficulty !== 'easy') {
    for (const patch of firePatches) {
      if (
        bot.x >= patch.x - 20 &&
        bot.x <= patch.x + patch.width + 20 &&
        Math.abs(bot.y + bot.height / 2 - patch.y) < 25
      ) {
        const avoidChance = difficulty === 'hard' ? 0.85 : 0.55;
        if (Math.random() < avoidChance) {
          inputs.jump = true;
          if (bot.x < patch.x + patch.width / 2) inputs.left = true;
          else inputs.right = true;
        }
      }
    }
  }

  // 5. Combat / Attack decision (Substantially weakened per request, easy is very easy)
  if (closestEnemy && closestEnemy.isAlive) {
    const enemyDx = closestEnemy.x - bot.x;
    const enemyDy = closestEnemy.y - bot.y;
    const enemyDist = Math.hypot(enemyDx, enemyDy);
    const facingEnemy = (bot.facing === 1 && enemyDx > 0) || (bot.facing === -1 && enemyDx < 0);

    // Difficulty multiplier for attack chance
    // Easy: ~0.10 chance (attacks rarely, misses often)
    // Normal: ~0.24 chance (very beatable and human-paced)
    // Hard: ~0.55 chance (active fighter)
    const attackMultiplier =
      difficulty === 'easy' ? 0.25 : difficulty === 'normal' ? 0.55 : 1.1;

    // In Infection Mode:
    if (gameMode === 'infection') {
      if (!bot.isInfected) {
        inputs.attack = false; // Survivors do not attack! Pure evasion.
      } else {
        // Zombie strike decision
        if (enemyDist < 60 && Math.abs(enemyDy) < 35 && facingEnemy && bot.attackCooldown <= 0) {
          inputs.attack = Math.random() < (difficulty === 'easy' ? 0.35 : difficulty === 'normal' ? 0.75 : 0.95);
        }
      }
      return inputs;
    }

    switch (bot.weapon) {
      case 'fists':
        if (enemyDist < (difficulty === 'easy' ? 36 : 44) && Math.abs(enemyDy) < 32 && facingEnemy) {
          inputs.attack = Math.random() < (0.24 * attackMultiplier);
        }
        break;
      case 'sword':
        if (enemyDist < (difficulty === 'easy' ? 50 : 66) && Math.abs(enemyDy) < 35 && facingEnemy) {
          inputs.attack = Math.random() < (0.26 * attackMultiplier);
        }
        break;
      case 'axe':
        if (enemyDist < (difficulty === 'easy' ? 54 : 70) && Math.abs(enemyDy) < 38 && facingEnemy) {
          inputs.attack = Math.random() < (0.28 * attackMultiplier);
        }
        break;
      case 'gun':
        if (enemyDist < (difficulty === 'easy' ? 300 : 440) && Math.abs(enemyDy) < 36 && facingEnemy) {
          inputs.attack = Math.random() < (0.22 * attackMultiplier);
        }
        break;
      case 'rocket':
        // Safe distance firing
        if (enemyDist > 140 && enemyDist < (difficulty === 'easy' ? 360 : 480) && Math.abs(enemyDy) < 45 && facingEnemy) {
          inputs.attack = Math.random() < (0.18 * attackMultiplier);
        }
        break;
      case 'rope':
        if (enemyDist > 80 && enemyDist < (difficulty === 'easy' ? 240 : 340) && Math.abs(enemyDy) < 36 && facingEnemy) {
          inputs.attack = Math.random() < (0.22 * attackMultiplier);
        }
        break;
      case 'magnet':
        if (enemyDist < (difficulty === 'easy' ? 140 : 220)) {
          inputs.attack = Math.random() < (0.20 * attackMultiplier);
        }
        break;
    }
  }

  return inputs;
}
