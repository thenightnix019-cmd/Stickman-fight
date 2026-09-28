import {
  PlayerState,
  PlayerConfig,
  Platform,
  Projectile,
  WeaponPickup,
  PowerUpPickup,
  Particle,
  FloatingText,
  FirePatch,
  ActiveEvent,
  GameMode,
  ArenaMap,
  WeaponType,
  PowerUpType,
} from '../types/game';
import { SKINS, HATS, SHOES, ShopSkin } from '../types/shop';

export interface CameraState {
  x: number;
  y: number;
  zoom: number;
  shake: number;
}

export function renderGame(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  camera: CameraState,
  map: ArenaMap,
  players: PlayerState[],
  playerConfigs: PlayerConfig[],
  projectiles: Projectile[],
  weaponPickups: WeaponPickup[],
  powerUpPickups: PowerUpPickup[],
  particles: Particle[],
  floatingTexts: FloatingText[],
  firePatches: FirePatch[],
  activeEvent: ActiveEvent | null,
  gameMode: GameMode,
  safeZoneRadius: number,
  safeZoneCenter: { x: number; y: number },
  hillControllingPlayer: PlayerState | null
) {
  ctx.save();

  // Clear background
  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Apply Camera Transform (zoom, pan, shake)
  const shakeX = (Math.random() - 0.5) * camera.shake * 2;
  const shakeY = (Math.random() - 0.5) * camera.shake * 2;

  ctx.translate(canvasWidth / 2 + shakeX, canvasHeight / 2 + shakeY);
  ctx.scale(camera.zoom, camera.zoom);
  ctx.translate(-camera.x, -camera.y);

  // 1. Draw Map Background Gradient & Animated Breathing Glows ("اضاءة تزول وتعود")
  const bgGrad = ctx.createLinearGradient(0, 0, 0, map.height);
  bgGrad.addColorStop(0, map.theme.bgGradient[0]);
  bgGrad.addColorStop(1, map.theme.bgGradient[1]);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, map.width, map.height);

  // Animated Ambient Breathing Light Pools (Cyan, Amber, Purple glowing orbs that fade in and out)
  const animTime = Date.now() * 0.0015;
  const pulse1 = (Math.sin(animTime) + 1) * 0.5;
  const pulse2 = (Math.cos(animTime * 1.3) + 1) * 0.5;
  const pulse3 = (Math.sin(animTime * 0.8 + 2) + 1) * 0.5;

  ctx.save();
  // Orb 1: Cyan breathing glow
  const orb1Grad = ctx.createRadialGradient(
    map.width * 0.25 + Math.sin(animTime * 0.5) * 50,
    map.height * 0.35 + Math.cos(animTime * 0.4) * 30,
    10,
    map.width * 0.25,
    map.height * 0.35,
    280 + pulse1 * 80
  );
  orb1Grad.addColorStop(0, `rgba(6, 182, 212, ${0.12 + pulse1 * 0.12})`);
  orb1Grad.addColorStop(1, 'transparent');
  ctx.fillStyle = orb1Grad;
  ctx.fillRect(0, 0, map.width, map.height);

  // Orb 2: Amber / Orange breathing glow
  const orb2Grad = ctx.createRadialGradient(
    map.width * 0.75 + Math.cos(animTime * 0.6) * 60,
    map.height * 0.4 + Math.sin(animTime * 0.5) * 40,
    10,
    map.width * 0.75,
    map.height * 0.4,
    300 + pulse2 * 90
  );
  orb2Grad.addColorStop(0, `rgba(245, 158, 11, ${0.1 + pulse2 * 0.11})`);
  orb2Grad.addColorStop(1, 'transparent');
  ctx.fillStyle = orb2Grad;
  ctx.fillRect(0, 0, map.width, map.height);

  // Orb 3: Purple breathing energy pool
  const orb3Grad = ctx.createRadialGradient(
    map.width * 0.5,
    map.height * 0.7 + Math.sin(animTime * 0.7) * 30,
    10,
    map.width * 0.5,
    map.height * 0.7,
    350 + pulse3 * 100
  );
  orb3Grad.addColorStop(0, `rgba(168, 85, 247, ${0.11 + pulse3 * 0.1})`);
  orb3Grad.addColorStop(1, 'transparent');
  ctx.fillStyle = orb3Grad;
  ctx.fillRect(0, 0, map.width, map.height);
  ctx.restore();

  // Background Grid Lines
  ctx.strokeStyle = map.theme.gridColor;
  ctx.lineWidth = 1;
  const gridSize = 50;
  for (let x = 0; x <= map.width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, map.height);
    ctx.stroke();
  }
  for (let y = 0; y <= map.height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(map.width, y);
    ctx.stroke();
  }

  // Outer Arena Perimeter Border & Cyber Corner Accents
  ctx.save();
  ctx.strokeStyle = map.theme.platformBorder || '#38bdf8';
  ctx.lineWidth = 3;
  ctx.globalAlpha = 0.55;
  ctx.strokeRect(0, 0, map.width, map.height);

  const cornerLen = 50;
  ctx.lineWidth = 5;
  ctx.globalAlpha = 0.9;
  // Top-left
  ctx.beginPath();
  ctx.moveTo(0, cornerLen); ctx.lineTo(0, 0); ctx.lineTo(cornerLen, 0);
  ctx.stroke();
  // Top-right
  ctx.beginPath();
  ctx.moveTo(map.width - cornerLen, 0); ctx.lineTo(map.width, 0); ctx.lineTo(map.width, cornerLen);
  ctx.stroke();
  // Bottom-left
  ctx.beginPath();
  ctx.moveTo(0, map.height - cornerLen); ctx.lineTo(0, map.height); ctx.lineTo(cornerLen, map.height);
  ctx.stroke();
  // Bottom-right
  ctx.beginPath();
  ctx.moveTo(map.width - cornerLen, map.height); ctx.lineTo(map.width, map.height); ctx.lineTo(map.width, map.height - cornerLen);
  ctx.stroke();
  ctx.restore();

  // 2. Draw Healing Sanctuary / Hill Zone
  if (map.hillZone) {
    const hz = map.hillZone;
    const pulse = (Math.sin(Date.now() * 0.006) + 1) * 0.5;
    const isHeroMode = gameMode === 'the_hero';
    const healColor = isHeroMode ? '#10b981' : (hz.color || '#10b981');

    ctx.save();
    ctx.fillStyle = healColor;
    ctx.globalAlpha = 0.12 + pulse * 0.08;
    ctx.fillRect(hz.x, hz.y, hz.width, hz.height);

    ctx.strokeStyle = healColor;
    ctx.lineWidth = 2.5 + pulse * 1.5;
    ctx.globalAlpha = 0.75 + pulse * 0.25;
    ctx.shadowColor = healColor;
    ctx.shadowBlur = 10;
    ctx.setLineDash([8, 6]);
    ctx.strokeRect(hz.x, hz.y, hz.width, hz.height);
    ctx.setLineDash([]);

    // Healing crosses in corners
    const crossSize = 6;
    const drawCross = (cx: number, cy: number) => {
      ctx.beginPath();
      ctx.moveTo(cx - crossSize, cy); ctx.lineTo(cx + crossSize, cy);
      ctx.moveTo(cx, cy - crossSize); ctx.lineTo(cx, cy + crossSize);
      ctx.stroke();
    };
    drawCross(hz.x + 14, hz.y + 14);
    drawCross(hz.x + hz.width - 14, hz.y + 14);

    // Label
    ctx.shadowBlur = 0;
    ctx.fillStyle = healColor;
    ctx.font = '800 12px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    const labelText = isHeroMode
      ? 'HERO SANCTUARY (+5 HP/s)'
      : gameMode === 'king_of_the_hill'
      ? 'HILL ZONE (+3 HP/s & +1 PT/s)'
      : hz.name || 'HEALING SANCTUARY (+3 HP/s)';
    ctx.fillText(labelText, hz.x + hz.width / 2, hz.y - 8);
    ctx.restore();
  }

  // 3. Draw Platforms
  for (const plat of map.platforms) {
    drawPlatform(ctx, plat, map.theme);
  }

  // 4. Draw Fire Patches
  for (const patch of firePatches) {
    drawFirePatch(ctx, patch);
  }

  // 5. Draw Battle Royale Safe Zone & Storm
  if (gameMode === 'battle_royale') {
    drawSafeZone(ctx, map.width, map.height, safeZoneCenter, safeZoneRadius);
  }

  // 6. Draw Weapon Pickups
  for (const pickup of weaponPickups) {
    drawWeaponPickup(ctx, pickup);
  }

  // 7. Draw Power-Up Pickups
  for (const power of powerUpPickups) {
    drawPowerUpPickup(ctx, power);
  }

  // 8. Draw Projectiles
  for (const proj of projectiles) {
    drawProjectile(ctx, proj);
  }

  // 9. Draw Stick Figures
  for (const player of players) {
    const config = playerConfigs.find((c) => c.id === player.id);
    if (config && player.isAlive) {
      drawStickFigure(ctx, player, config, gameMode);
    }
  }

  // 10. Draw Particles
  for (const p of particles) {
    drawParticle(ctx, p);
  }

  // 11. Draw Floating Damage / Notification Texts
  for (const ft of floatingTexts) {
    drawFloatingText(ctx, ft);
  }

  // 12. Draw Wind Event Streaks
  if (activeEvent?.type === 'wind') {
    drawWindStreaks(ctx, map.width, map.height, activeEvent.param || 1);
  }

  // 13. Draw Earthquake Screen Dust
  if (activeEvent?.type === 'earthquake') {
    drawEarthquakeFissures(ctx, map.platforms);
  }

  ctx.restore();
}

function drawPlatform(
  ctx: CanvasRenderingContext2D,
  plat: Platform,
  theme: { platformColor: string; platformBorder: string; accentColor: string }
) {
  ctx.save();

  if (plat.oneWay) {
    // Floating bridge / perch
    ctx.fillStyle = theme.platformColor;
    ctx.fillRect(plat.x, plat.y, plat.width, plat.height);

    // Glowing top bar
    ctx.fillStyle = theme.platformBorder;
    ctx.fillRect(plat.x, plat.y, plat.width, 3);

    // Tech accents
    ctx.fillStyle = theme.accentColor;
    ctx.globalAlpha = 0.4;
    ctx.fillRect(plat.x + 8, plat.y + 4, plat.width - 16, 2);
  } else {
    // Solid block
    ctx.fillStyle = theme.platformColor;
    ctx.fillRect(plat.x, plat.y, plat.width, plat.height);

    ctx.strokeStyle = theme.platformBorder;
    ctx.lineWidth = 2;
    ctx.strokeRect(plat.x, plat.y, plat.width, plat.height);

    // Industrial diagonal stripes on bottom
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(plat.x, plat.y + 6, plat.width, plat.height - 6);
  }

  ctx.restore();
}

function drawFirePatch(ctx: CanvasRenderingContext2D, patch: FirePatch) {
  ctx.save();
  const time = Date.now() * 0.01;
  const numFlames = Math.floor(patch.width / 14);

  for (let i = 0; i < numFlames; i++) {
    const fx = patch.x + i * 14 + 7;
    const fy = patch.y;
    const flameH = 12 + Math.sin(time + i * 1.3) * 6;

    const grad = ctx.createLinearGradient(fx, fy, fx, fy - flameH);
    grad.addColorStop(0, '#f97316');
    grad.addColorStop(0.6, '#ef4444');
    grad.addColorStop(1, 'transparent');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(fx - 7, fy);
    ctx.quadraticCurveTo(fx + Math.sin(time + i) * 4, fy - flameH, fx + 7, fy);
    ctx.fill();
  }
  ctx.restore();
}

function drawSafeZone(
  ctx: CanvasRenderingContext2D,
  mapW: number,
  mapH: number,
  center: { x: number; y: number },
  radius: number
) {
  ctx.save();

  // Dark toxic vignette outside safe zone
  ctx.fillStyle = 'rgba(88, 28, 135, 0.4)'; // toxic purple
  ctx.beginPath();
  ctx.rect(0, 0, mapW, mapH);
  ctx.arc(center.x, center.y, radius, 0, Math.PI * 2, true);
  ctx.fill();

  // Safe Zone perimeter ring
  const pulse = Math.sin(Date.now() * 0.005) * 2;
  ctx.strokeStyle = '#c084fc';
  ctx.lineWidth = 3 + pulse;
  ctx.shadowColor = '#c084fc';
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

function drawStickFigure(
  ctx: CanvasRenderingContext2D,
  player: PlayerState,
  config: PlayerConfig,
  gameMode?: GameMode
) {
  ctx.save();

  // Respawn invulnerability blink
  if (player.invincibleTimer > 0 && Math.floor(Date.now() / 80) % 2 === 0) {
    ctx.globalAlpha = 0.4;
  }

  const isGiant = player.activePowerUp === 'giant';
  const scale = isGiant ? 1.6 : 1.0;
  const px = player.x;
  const py = player.y;

  ctx.translate(px, py);
  ctx.scale(scale * player.facing, scale);

  // Determine color based on gameMode / team / infection / equippedSkin
  let figureColor = config.color;
  let glowColor = config.glowColor;

  const equippedSkinData = !player.isInfected && config.equippedSkin
    ? SKINS.find((s) => s.id === config.equippedSkin)
    : null;

  if (equippedSkinData && !(gameMode === 'team_deathmatch' && player.team)) {
    figureColor = equippedSkinData.primaryColor;
    glowColor = equippedSkinData.glowColor;
  }

  if (player.isInfected) {
    figureColor = '#22c55e'; // Toxic Zombie Green
    glowColor = '#4ade80';
  } else if (gameMode === 'team_deathmatch' && player.team) {
    figureColor = player.team === 'red' ? '#ef4444' : '#3b82f6';
    glowColor = player.team === 'red' ? '#f87171' : '#60a5fa';
  }

  // 1. Giant Mode / Speed / Combo / Infection Auras
  if (player.isInfected) {
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.6)';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#22c55e';
    ctx.shadowBlur = 12;
    ctx.strokeRect(-16, -28, 32, 56);
  }

  if (player.activePowerUp === 'giant') {
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)';
    ctx.lineWidth = 4;
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 14;
    ctx.strokeRect(-18, -32, 36, 64);
  }

  if (player.activePowerUp === 'combo') {
    ctx.strokeStyle = 'rgba(236, 72, 153, 0.6)';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#ec4899';
    ctx.shadowBlur = 10;
    ctx.strokeRect(-16, -30, 32, 60);
  }

  // 2. Shield Bubble
  if (player.activePowerUp === 'shield' && player.shieldHp > 0) {
    ctx.save();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(0, 0, 34, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  // Draw Cape (from equipped skin) behind skeleton
  if (equippedSkinData?.hasCape && !player.isInfected) {
    ctx.save();
    const flutter = Math.sin(Date.now() * 0.01 + player.x * 0.05) * 3;
    const capeW = 14;
    ctx.fillStyle = equippedSkinData.capeColor || '#b91c1c';
    ctx.beginPath();
    ctx.moveTo(-2, -8);
    ctx.lineTo(2, -8);
    ctx.lineTo(-capeW + flutter, 18);
    ctx.lineTo(-capeW * 0.4 + flutter * 0.5, 18);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // 3. Stick Figure Skeleton
  ctx.strokeStyle = figureColor;
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = 6;

  // Head
  const headRadius = 9;
  const headY = -18;
  ctx.beginPath();
  ctx.arc(0, headY, headRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#0f172a';
  ctx.fill();
  ctx.stroke();

  // Eye (looking forward - red glowing eye if infected!)
  ctx.fillStyle = player.isInfected ? '#ef4444' : '#ffffff';
  ctx.beginPath();
  ctx.arc(3.5, headY - 1, player.isInfected ? 2.4 : 1.8, 0, Math.PI * 2);
  ctx.fill();

  // Draw Equipped Hat on Head
  if (config.equippedHat && !player.isInfected) {
    drawCosmeticHat(ctx, config.equippedHat, headY, headRadius);
  } else if (equippedSkinData && !player.isInfected) {
    // Draw Heroic Cowl / Tiara / Ears matching Justice League skin
    drawSkinHeadgear(ctx, equippedSkinData, headY, headRadius);
  }

  // Torso / Spine
  const spineTopY = headY + headRadius;
  const pelvisY = 8;
  ctx.beginPath();
  ctx.moveTo(0, spineTopY);
  ctx.lineTo(0, pelvisY);
  ctx.stroke();

  // Draw Jetpack on Player's back if equipped (twin cylinders + thruster flame)
  if (player.hasJetpack) {
    ctx.save();
    const jetpackX = -8;
    const jetpackY = (spineTopY + pelvisY) / 2 - 2;

    // Twin rocket tanks
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.3;
    ctx.shadowColor = '#0284c7';
    ctx.shadowBlur = 6;

    // Left & right cylinders
    ctx.beginPath();
    ctx.roundRect(jetpackX - 3.5, jetpackY - 8, 4.5, 14, 2);
    ctx.roundRect(jetpackX + 2.5, jetpackY - 8, 4.5, 14, 2);
    ctx.fill();
    ctx.stroke();

    // Harness strap across torso
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(jetpackX + 2, jetpackY - 2);
    ctx.lineTo(0, jetpackY - 2);
    ctx.stroke();

    // Twin booster nozzles
    ctx.fillStyle = '#475569';
    ctx.fillRect(jetpackX - 4, jetpackY + 5.5, 5.5, 2.5);
    ctx.fillRect(jetpackX + 2, jetpackY + 5.5, 5.5, 2.5);

    // Thruster plasma flames when flying
    if (player.isJetpacking) {
      const flameH = 9 + Math.sin(Date.now() * 0.03) * 4;
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 12;

      ctx.beginPath();
      ctx.moveTo(jetpackX - 3.5, jetpackY + 8);
      ctx.lineTo(jetpackX - 1.25, jetpackY + 8 + flameH);
      ctx.lineTo(jetpackX + 1, jetpackY + 8);
      ctx.moveTo(jetpackX + 2.5, jetpackY + 8);
      ctx.lineTo(jetpackX + 4.75, jetpackY + 8 + flameH);
      ctx.lineTo(jetpackX + 7, jetpackY + 8);
      ctx.fill();

      // White hot core
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(jetpackX - 2.5, jetpackY + 8);
      ctx.lineTo(jetpackX - 1.25, jetpackY + 8 + flameH * 0.5);
      ctx.lineTo(jetpackX, jetpackY + 8);
      ctx.moveTo(jetpackX + 3.5, jetpackY + 8);
      ctx.lineTo(jetpackX + 4.75, jetpackY + 8 + flameH * 0.5);
      ctx.lineTo(jetpackX + 6, jetpackY + 8);
      ctx.fill();
    }
    ctx.restore();
  }

  // Draw Skin Chest Emblem / Armor Plate
  if (equippedSkinData?.emblem && !player.isInfected) {
    drawSkinEmblem(ctx, equippedSkinData.emblem, (spineTopY + pelvisY) / 2);
  }

  // Legs (Walk cycle vs Jump splay)
  const legCycle = player.isGrounded
    ? Math.sin(player.walkFrame)
    : 0;

  // Left Leg (Back)
  const lKneeX = -4 - legCycle * 7;
  const lKneeY = pelvisY + 10;
  const lFootX = -7 - legCycle * 10;
  const lFootY = pelvisY + 20;

  ctx.beginPath();
  ctx.moveTo(0, pelvisY);
  ctx.lineTo(lKneeX, lKneeY);
  ctx.lineTo(lFootX, lFootY);
  ctx.stroke();

  // Right Leg (Front)
  const rKneeX = 4 + legCycle * 7;
  const rKneeY = pelvisY + 10;
  const rFootX = 7 + legCycle * 10;
  const rFootY = pelvisY + 20;

  ctx.beginPath();
  ctx.moveTo(0, pelvisY);
  ctx.lineTo(rKneeX, rKneeY);
  ctx.lineTo(rFootX, rFootY);
  ctx.stroke();

  // Draw Equipped Shoes on Feet (including 1000-gem RGB Chroma Boots!)
  if (config.equippedShoes && !player.isInfected) {
    drawCosmeticShoes(ctx, config.equippedShoes, lFootX, lFootY, rFootX, rFootY, player.isGrounded);
  }

  // Arms & Weapon Rendering
  const shoulderY = spineTopY + 3;
  let handX = 14;
  let handY = 2;

  if (player.isInfected) {
    // Creepy zombie reaching forward pose!
    handX = 16;
    handY = -6;
  } else if (player.isWallSliding) {
    // Parkour wall grip pose: hands braced against wall
    handX = 13;
    handY = -12;
  } else if (player.isAttacking) {
    // Attack swing pose
    handX = 18;
    handY = -4;
  } else if (!player.isGrounded) {
    // Air pose
    handX = 12;
    handY = -8;
  }

  // Arm
  ctx.beginPath();
  ctx.moveTo(0, shoulderY);
  ctx.lineTo(handX * 0.5, handY - 4);
  ctx.lineTo(handX, handY);
  ctx.stroke();

  // Draw Equipped Weapon in hand
  drawWeaponInHand(ctx, player.weapon, handX, handY, player.isAttacking);

  ctx.restore();

  // 4. Overhead Player Status (HP bar, Name tag, Weapon icon)
  drawOverheadHUD(ctx, player, config, isGiant, gameMode);
}

function drawWeaponInHand(
  ctx: CanvasRenderingContext2D,
  weapon: WeaponType,
  handX: number,
  handY: number,
  isAttacking: boolean
) {
  ctx.save();
  ctx.translate(handX, handY);

  if (weapon === 'sword') {
    const angle = isAttacking ? 0.35 : -0.7;
    ctx.rotate(angle);
    // Hilt
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(4, 0);
    ctx.stroke();
    // Guard
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(4, -4);
    ctx.lineTo(4, 4);
    ctx.stroke();
    // Blade
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(4, 0);
    ctx.lineTo(24, 0);
    ctx.stroke();
  } else if (weapon === 'axe') {
    const angle = isAttacking ? 0.45 : -0.65;
    ctx.rotate(angle);
    // Wooden haft
    ctx.strokeStyle = '#92400e';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(-5, 0);
    ctx.lineTo(19, 0);
    ctx.stroke();

    // Steel Battleaxe Blade
    ctx.fillStyle = '#cbd5e1';
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(12, -12);
    ctx.quadraticCurveTo(24, -9, 21, 0);
    ctx.quadraticCurveTo(24, 9, 12, 12);
    ctx.lineTo(13, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Golden axe collar & band
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(10, -3, 3.5, 6);
  } else if (weapon === 'gun') {
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 3;
    ctx.strokeRect(0, -3, 10, 4);
    ctx.fillStyle = '#334155';
    ctx.fillRect(2, 1, 3, 5); // handle
  } else if (weapon === 'rocket') {
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.moveTo(-6, -2);
    ctx.lineTo(16, -2);
    ctx.stroke();
    // Rocket tip
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(16, -5);
    ctx.lineTo(22, -2);
    ctx.lineTo(16, 1);
    ctx.fill();
  } else if (weapon === 'rope') {
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(4, 0, 4, 0, Math.PI * 1.5);
    ctx.stroke();
    // Hook claw
    ctx.strokeStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.moveTo(6, -2);
    ctx.lineTo(10, -4);
    ctx.lineTo(10, 4);
    ctx.stroke();
  } else if (weapon === 'magnet') {
    // Horseshoe magnet
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(6, 0, 6, Math.PI * 0.5, Math.PI * 1.5);
    ctx.stroke();
    // Magnet tips
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(6, -8, 4, 3);
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(6, 5, 4, 3);
  }

  ctx.restore();
}

function drawSkinEmblem(ctx: CanvasRenderingContext2D, emblem: string, centerY: number) {
  ctx.save();
  ctx.translate(0, centerY);

  if (emblem === 'bat') {
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.ellipse(0, 0, 4.5, 2.8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#020617';
    ctx.beginPath();
    ctx.moveTo(-3, 0);
    ctx.lineTo(-1.5, -1.8);
    ctx.lineTo(0, -0.5);
    ctx.lineTo(1.5, -1.8);
    ctx.lineTo(3, 0);
    ctx.lineTo(1.5, 1.2);
    ctx.lineTo(0, 0.4);
    ctx.lineTo(-1.5, 1.2);
    ctx.closePath();
    ctx.fill();
  } else if (emblem === 'super') {
    ctx.fillStyle = '#dc2626';
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -3);
    ctx.lineTo(3.5, -1.5);
    ctx.lineTo(2, 3);
    ctx.lineTo(-2, 3);
    ctx.lineTo(-3.5, -1.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (emblem === 'flash') {
    ctx.fillStyle = '#facc15';
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.moveTo(1, -3.5);
    ctx.lineTo(-2.5, 0);
    ctx.lineTo(0, 0);
    ctx.lineTo(-1, 3.5);
    ctx.lineTo(2.5, -0.2);
    ctx.lineTo(0, -0.2);
    ctx.closePath();
    ctx.fill();
  } else if (emblem === 'wonder') {
    // Wonder Woman Golden Eagle / Double-W
    ctx.fillStyle = '#fbbf24';
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.moveTo(-3.5, -2);
    ctx.lineTo(-1.5, 2.5);
    ctx.lineTo(0, -0.5);
    ctx.lineTo(1.5, 2.5);
    ctx.lineTo(3.5, -2);
    ctx.lineTo(2, -2);
    ctx.lineTo(1, 0.8);
    ctx.lineTo(0, -1);
    ctx.lineTo(-1, 0.8);
    ctx.lineTo(-2, -2);
    ctx.closePath();
    ctx.fill();
  } else if (emblem === 'lantern') {
    // Green Lantern Power Battery
    ctx.fillStyle = '#10b981';
    ctx.shadowColor = '#34d399';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(0, 0, 2.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, 1.4, 0, Math.PI * 2);
    ctx.fill();
  } else if (emblem === 'aquaman') {
    // Aquaman Atlantean A
    ctx.fillStyle = '#fbbf24';
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.moveTo(0, -3);
    ctx.lineTo(2.5, 2.5);
    ctx.lineTo(1.2, 2.5);
    ctx.lineTo(0, 0.5);
    ctx.lineTo(-1.2, 2.5);
    ctx.lineTo(-2.5, 2.5);
    ctx.closePath();
    ctx.fill();
  } else if (emblem === 'cyborg') {
    // Cyborg Cybernetic Reactor Core
    ctx.fillStyle = '#ef4444';
    ctx.shadowColor = '#f87171';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, 1.1, 0, Math.PI * 2);
    ctx.fill();
  } else if (emblem === 'justice') {
    // Cosmic Justice Sovereign Starburst
    ctx.fillStyle = '#fbbf24';
    ctx.shadowColor = '#c084fc';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(0, -3.5);
    ctx.lineTo(1.2, -1.2);
    ctx.lineTo(3.5, 0);
    ctx.lineTo(1.2, 1.2);
    ctx.lineTo(0, 3.5);
    ctx.lineTo(-1.2, 1.2);
    ctx.lineTo(-3.5, 0);
    ctx.lineTo(-1.2, -1.2);
    ctx.closePath();
    ctx.fill();
  } else if (emblem === 'spider') {
    ctx.fillStyle = '#020617';
    ctx.beginPath();
    ctx.arc(0, 0, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#020617';
    ctx.lineWidth = 0.8;
    ctx.stroke();
  } else if (emblem === 'reactor') {
    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, 1.2, 0, Math.PI * 2);
    ctx.fill();
  } else if (emblem === 'cyber') {
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 1.2;
    ctx.shadowColor = '#22d3ee';
    ctx.shadowBlur = 5;
    ctx.strokeRect(-3, -2, 6, 4);
  } else if (emblem === 'phoenix') {
    ctx.fillStyle = '#fbbf24';
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 7;
    ctx.beginPath();
    ctx.moveTo(0, -3.5);
    ctx.lineTo(3.5, 0);
    ctx.lineTo(0, 3);
    ctx.lineTo(-3.5, 0);
    ctx.closePath();
    ctx.fill();
  } else if (emblem === 'void') {
    ctx.fillStyle = '#c084fc';
    ctx.shadowColor = '#c084fc';
    ctx.shadowBlur = 9;
    ctx.beginPath();
    ctx.arc(0, 0, 2.2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawSkinHeadgear(
  ctx: CanvasRenderingContext2D,
  skin: ShopSkin,
  headY: number,
  headRadius: number
) {
  if (!skin) return;
  ctx.save();

  const emblem = skin.emblem;

  if (emblem === 'bat') {
    // Batman Cowl with Pointed Ears and Brow
    ctx.fillStyle = skin.primaryColor || '#0f172a';
    ctx.strokeStyle = skin.secondaryColor || '#f59e0b';
    ctx.lineWidth = 1;

    // Left Bat Ear
    ctx.beginPath();
    ctx.moveTo(-headRadius * 0.7, headY - headRadius * 0.4);
    ctx.lineTo(-headRadius * 0.9, headY - headRadius - 8);
    ctx.lineTo(-headRadius * 0.2, headY - headRadius * 0.8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Right Bat Ear
    ctx.beginPath();
    ctx.moveTo(headRadius * 0.2, headY - headRadius * 0.8);
    ctx.lineTo(headRadius * 0.9, headY - headRadius - 8);
    ctx.lineTo(headRadius * 0.7, headY - headRadius * 0.4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // White slit eye visor
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 4;
    ctx.fillRect(1, headY - 2, 5, 1.8);
  } else if (emblem === 'super') {
    // Superman Heroic Spit Curl hair
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(1, headY - headRadius);
    ctx.quadraticCurveTo(5, headY - headRadius - 3, 4, headY - headRadius + 4);
    ctx.stroke();

    // Glowing cyan/blue gaze
    ctx.fillStyle = '#60a5fa';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(3.5, headY - 1, 2.2, 0, Math.PI * 2);
    ctx.fill();
  } else if (emblem === 'flash') {
    // Flash Golden Lightning Ear Wings
    ctx.fillStyle = '#facc15';
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 0.8;
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 6;

    // Lightning bolt antenna on side of head
    ctx.beginPath();
    ctx.moveTo(-1, headY - 4);
    ctx.lineTo(-7, headY - 9);
    ctx.lineTo(-4, headY - 3);
    ctx.lineTo(-9, headY + 1);
    ctx.lineTo(-3, headY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (emblem === 'wonder') {
    // Wonder Woman Amazon Golden Tiara with Ruby Star
    ctx.fillStyle = '#fbbf24';
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 1;
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 6;

    // Curved Tiara Band
    ctx.beginPath();
    ctx.moveTo(-headRadius, headY - 2);
    ctx.quadraticCurveTo(0, headY - headRadius * 0.7, headRadius, headY - 2);
    ctx.lineTo(headRadius, headY - 5);
    ctx.lineTo(0, headY - headRadius - 2); // peak
    ctx.lineTo(-headRadius, headY - 5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Central Ruby Star
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(0, headY - headRadius + 1, 1.8, 0, Math.PI * 2);
    ctx.fill();
  } else if (emblem === 'lantern') {
    // Green Lantern Glowing Emerald Domino Mask
    ctx.fillStyle = '#047857';
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1.2;
    ctx.shadowColor = '#34d399';
    ctx.shadowBlur = 8;

    ctx.beginPath();
    ctx.ellipse(3, headY - 1, 6, 3.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(4, headY - 1, 1.5, 0, Math.PI * 2);
    ctx.fill();
  } else if (emblem === 'aquaman') {
    // Aquaman Golden Circlet / Trident Brow
    ctx.fillStyle = '#fbbf24';
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 1;
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 6;

    ctx.beginPath();
    ctx.moveTo(-headRadius, headY - 2);
    ctx.lineTo(-headRadius * 0.5, headY - headRadius - 1);
    ctx.lineTo(0, headY - 4);
    ctx.lineTo(headRadius * 0.5, headY - headRadius - 1);
    ctx.lineTo(headRadius, headY - 2);
    ctx.lineTo(0, headY - 1);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (emblem === 'cyborg') {
    // Cyborg Half-Face Titanium Plate & Glowing Red Bionic Eye
    ctx.fillStyle = '#64748b';
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;

    // Faceplate over side of head
    ctx.beginPath();
    ctx.arc(0, headY, headRadius + 0.5, -Math.PI * 0.3, Math.PI * 0.3);
    ctx.lineTo(0, headY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Glowing Crimson Bionic Optic Lens
    ctx.fillStyle = '#ef4444';
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(3.5, headY - 1, 2.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(4, headY - 1.5, 1.2, 0, Math.PI * 2);
    ctx.fill();
  } else if (emblem === 'justice') {
    // Cosmic Justice Sovereign Starburst Crown
    ctx.fillStyle = '#fbbf24';
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 1;
    ctx.shadowColor = '#c084fc';
    ctx.shadowBlur = 10;

    ctx.beginPath();
    ctx.moveTo(-headRadius * 0.8, headY - 3);
    ctx.lineTo(-headRadius * 0.4, headY - headRadius - 5);
    ctx.lineTo(0, headY - 3);
    ctx.lineTo(headRadius * 0.4, headY - headRadius - 5);
    ctx.lineTo(headRadius * 0.8, headY - 3);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#c084fc';
    ctx.beginPath();
    ctx.arc(0, headY - headRadius + 1, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawCosmeticHat(
  ctx: CanvasRenderingContext2D,
  hatId: string,
  headY: number,
  headRadius: number
) {
  ctx.save();

  if (hatId === 'cowboy_hat') {
    // Cowboy hat: brown curved brim and tall crown with gold badge
    ctx.fillStyle = '#78350f';
    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = 1;
    // Brim
    ctx.beginPath();
    ctx.ellipse(0, headY - headRadius + 1, 14, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Crown
    ctx.beginPath();
    ctx.moveTo(-6, headY - headRadius);
    ctx.lineTo(-5, headY - headRadius - 8);
    ctx.quadraticCurveTo(0, headY - headRadius - 10, 5, headY - headRadius - 8);
    ctx.lineTo(6, headY - headRadius);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Hat band
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-5.5, headY - headRadius - 2.5, 11, 2);
  } else if (hatId === 'ninja_bandana') {
    // Crimson ninja headband with forehead metal plate and flowing back ribbons
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(-headRadius - 1, headY - 4, headRadius * 2 + 2, 4);
    // Metal plate
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(-3.5, headY - 3.5, 7, 3);
    // Flowing knot ribbons in wind
    const flutter = Math.sin(Date.now() * 0.015) * 3;
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-headRadius, headY - 2);
    ctx.lineTo(-headRadius - 8, headY - 1 + flutter);
    ctx.moveTo(-headRadius, headY - 1);
    ctx.lineTo(-headRadius - 10, headY + 3 - flutter);
    ctx.stroke();
  } else if (hatId === 'viking_helmet') {
    // Steel dome helmet
    ctx.fillStyle = '#64748b';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(0, headY, headRadius + 1, Math.PI, 0);
    ctx.fill();
    ctx.stroke();
    // Horns
    ctx.fillStyle = '#fef08a';
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 1;
    // Left horn
    ctx.beginPath();
    ctx.moveTo(-6, headY - 4);
    ctx.quadraticCurveTo(-14, headY - 7, -12, headY - 15);
    ctx.quadraticCurveTo(-8, headY - 10, -4, headY - 8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Right horn
    ctx.beginPath();
    ctx.moveTo(6, headY - 4);
    ctx.quadraticCurveTo(14, headY - 7, 12, headY - 15);
    ctx.quadraticCurveTo(8, headY - 10, 4, headY - 8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (hatId === 'samurai_kabuto') {
    // Black lacquered helmet
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(0, headY, headRadius + 1.5, Math.PI, 0);
    ctx.fill();
    // Gold crescent moon crest
    ctx.fillStyle = '#fbbf24';
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, headY - headRadius - 2, 7, 0.2, Math.PI - 0.2, true);
    ctx.quadraticCurveTo(0, headY - headRadius + 2, 6, headY - headRadius - 1);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (hatId === 'cyber_visor') {
    // Glowing cyan neon visor across the eyes
    ctx.fillStyle = '#06b6d4';
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 10;
    ctx.fillRect(-2, headY - 3, headRadius + 4, 4.5);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, headY - 2, headRadius, 2);
  } else if (hatId === 'wizard_hat') {
    // Purple pointed wizard hat with stars
    ctx.fillStyle = '#581c87';
    ctx.strokeStyle = '#3b0764';
    ctx.lineWidth = 1;
    // Brim
    ctx.beginPath();
    ctx.ellipse(0, headY - headRadius + 1, 13, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Conical hat curving back
    ctx.beginPath();
    ctx.moveTo(-6, headY - headRadius);
    ctx.quadraticCurveTo(-2, headY - headRadius - 10, -7, headY - headRadius - 18);
    ctx.lineTo(2, headY - headRadius - 10);
    ctx.lineTo(6, headY - headRadius);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Gold star at tip
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(-7, headY - headRadius - 18, 2, 0, Math.PI * 2);
    ctx.fill();
  } else if (hatId === 'pirate_tricorne') {
    // 3-cornered black hat with skull & feather
    ctx.fillStyle = '#020617';
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-12, headY - headRadius + 2);
    ctx.lineTo(0, headY - headRadius - 7);
    ctx.lineTo(12, headY - headRadius + 2);
    ctx.quadraticCurveTo(0, headY - headRadius - 1, -12, headY - headRadius + 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // White skull
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, headY - headRadius - 2, 1.8, 0, Math.PI * 2);
    ctx.fill();
  } else if (hatId === 'celestial_crown') {
    // =========================================================================
    // 8TH SPECIAL HAT: LEGENDARY CROWN (التاج الأسطوري - الوحيدة المميزة بـ 50 جوهرة)
    // =========================================================================
    const now = Date.now();
    const pulse = Math.sin(now * 0.007);
    const glowSize = 16 + pulse * 8;

    // Glowing Solar Rays & Radiant Halo behind Crown
    ctx.save();
    ctx.strokeStyle = `rgba(251, 191, 36, ${0.4 + pulse * 0.25})`;
    ctx.lineWidth = 2;
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = glowSize;

    // Sunburst rays
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 6) * i - Math.PI / 1.2;
      const rayLen = 14 + Math.sin(now * 0.008 + i) * 3;
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * 7, headY - headRadius - 4 + Math.sin(angle) * 7);
      ctx.lineTo(Math.cos(angle) * rayLen, headY - headRadius - 4 + Math.sin(angle) * rayLen);
      ctx.stroke();
    }
    ctx.restore();

    // The Golden 5-point Crown
    ctx.fillStyle = '#fbbf24';
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 1.2;
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 12;

    ctx.beginPath();
    const baseCrownY = headY - headRadius + 1;
    ctx.moveTo(-8, baseCrownY);
    ctx.lineTo(-8, baseCrownY - 8);
    ctx.lineTo(-4, baseCrownY - 4);
    ctx.lineTo(0, baseCrownY - 11); // Center highest spire
    ctx.lineTo(4, baseCrownY - 4);
    ctx.lineTo(8, baseCrownY - 8);
    ctx.lineTo(8, baseCrownY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Radiant Central Ruby Gem & Emerald side gems
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(0, baseCrownY - 5, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(-5, baseCrownY - 3, 1.4, 0, Math.PI * 2);
    ctx.arc(5, baseCrownY - 3, 1.4, 0, Math.PI * 2);
    ctx.fill();

    // Sparkling divine tip
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, baseCrownY - 11, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawCosmeticShoes(
  ctx: CanvasRenderingContext2D,
  shoesId: string,
  lFootX: number,
  lFootY: number,
  rFootX: number,
  rFootY: number,
  isGrounded: boolean
) {
  if (shoesId === 'chroma_rgb_boots') {
    // =========================================================================
    // 1000 GEMS SPECIAL SHOES: CHROMA PRISM RGB BOOTS
    // "يشع الوان ويتغير لونه من لون الى اخر بشكل مميز"
    // Dynamic Spectrum Cycling Rainbow Color!
    // =========================================================================
    ctx.save();
    const now = Date.now();
    const hue = (now * 0.18) % 360;
    const chromaColor = `hsl(${hue}, 100%, 60%)`;
    const chromaGlow = `hsl(${hue}, 100%, 75%)`;

    ctx.shadowColor = chromaGlow;
    ctx.shadowBlur = 14;
    ctx.fillStyle = chromaColor;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;

    // Left Boot
    ctx.beginPath();
    ctx.roundRect(lFootX - 4, lFootY - 3, 9, 5, 2);
    ctx.fill();
    ctx.stroke();

    // Right Boot
    ctx.beginPath();
    ctx.roundRect(rFootX - 4, rFootY - 3, 9, 5, 2);
    ctx.fill();
    ctx.stroke();

    // Dynamic Rainbow Glow Soles
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(lFootX - 4, lFootY + 1, 9, 1.5);
    ctx.fillRect(rFootX - 4, rFootY + 1, 9, 1.5);

    // If moving or jumping: emit colorful rainbow spark trail dots!
    ctx.fillStyle = chromaGlow;
    ctx.beginPath();
    const spark1 = Math.sin(now * 0.02) * 4;
    const spark2 = Math.cos(now * 0.02) * 4;
    ctx.arc(lFootX - 5, lFootY + 4 + spark1, 1.8, 0, Math.PI * 2);
    ctx.arc(rFootX - 5, rFootY + 4 + spark2, 1.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

function drawOverheadHUD(
  ctx: CanvasRenderingContext2D,
  player: PlayerState,
  config: PlayerConfig,
  isGiant: boolean,
  gameMode?: GameMode
) {
  const topY = player.y - (isGiant ? 52 : 36);

  // Determine tag color & tag text (clean, no emojis)
  let tagColor = config.color;
  let tagSuffix = '';

  if (player.isInfected) {
    tagColor = '#22c55e';
    tagSuffix = ' [ZOMBIE]';
  } else if (gameMode === 'team_deathmatch' && player.team) {
    tagColor = player.team === 'red' ? '#ef4444' : '#3b82f6';
    tagSuffix = player.team === 'red' ? ' [RED]' : ' [BLUE]';
  } else if (gameMode === 'infection') {
    tagColor = '#38bdf8';
    tagSuffix = ' [SURVIVOR]';
  }

  // Human player distinct indicator
  if (config.type === 'human') {
    ctx.save();
    const bob = Math.sin(Date.now() * 0.008) * 2;
    ctx.fillStyle = '#38bdf8';
    ctx.font = '800 8.5px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 6;
    ctx.fillText('▼ YOU', player.x, topY - 26 + bob);
    ctx.restore();
  }

  // Player Name
  ctx.font = '700 11px "Outfit", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = tagColor;
  ctx.fillText(config.name + tagSuffix, player.x, topY - 14);

  // Health Bar Container
  const barW = 38;
  const barH = 5;
  const barX = player.x - barW / 2;
  const barY = topY - 10;

  // Jetpack Fuel Gauge Bar if equipped (shows 5s fuel countdown)
  if (player.hasJetpack && (player.jetpackFuel || 0) > 0) {
    const fuel = player.jetpackFuel || 0;
    const maxFuel = 5.0;
    const fuelRatio = Math.max(0, Math.min(1, fuel / maxFuel));
    const fuelBarW = 38;
    const fuelBarH = 3;
    const fuelBarX = player.x - fuelBarW / 2;
    const fuelBarY = barY - 6;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.fillRect(fuelBarX - 1, fuelBarY - 1, fuelBarW + 2, fuelBarH + 2);

    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(fuelBarX, fuelBarY, fuelBarW * fuelRatio, fuelBarH);

    ctx.font = '700 7px "JetBrains Mono", monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.textAlign = 'center';
    ctx.fillText(`JETPACK: ${fuel.toFixed(1)}s`, player.x, fuelBarY - 2);
  }

  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.fillRect(barX - 1, barY - 1, barW + 2, barH + 2);

  // Health Fill
  const hpRatio = Math.max(0, player.hp / player.maxHp);
  const hpColor = hpRatio > 0.5 ? '#10b981' : hpRatio > 0.25 ? '#f59e0b' : '#ef4444';
  ctx.fillStyle = hpColor;
  ctx.fillRect(barX, barY, barW * hpRatio, barH);

  // Weapon ammo pips if armed
  if (player.weapon !== 'fists' && player.maxAmmo > 0) {
    const ammoText = `${player.weapon.toUpperCase()} (${player.ammo})`;
    ctx.font = '600 9px "JetBrains Mono", monospace';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText(ammoText, player.x, barY + 12);
  } else if (gameMode === 'infection') {
    if (player.isInfected) {
      ctx.font = '700 9px "JetBrains Mono", monospace';
      if (player.attackCooldown > 0) {
        ctx.fillStyle = '#f59e0b';
        ctx.fillText(`STRIKE: ${player.attackCooldown.toFixed(1)}s`, player.x, barY + 13);
      } else {
        ctx.fillStyle = '#22c55e';
        ctx.fillText('STRIKE READY!', player.x, barY + 13);
      }
    } else {
      ctx.font = '600 8.5px sans-serif';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('EVADE & DODGE', player.x, barY + 13);
    }
  }
}

/* ========================================================================= */
/* REAL GRAPHICAL VECTOR PICKUP RENDERERS (NO EMOJIS!)                       */
/* ========================================================================= */

function drawWeaponPickup(ctx: CanvasRenderingContext2D, pickup: WeaponPickup) {
  ctx.save();
  const bob = Math.sin(Date.now() * 0.007 + pickup.x) * 4;
  ctx.translate(pickup.x, pickup.y + bob);

  // Pulsing ambient glow halo
  const pulse = (Math.sin(Date.now() * 0.008 + pickup.x) + 1) * 0.5;
  ctx.fillStyle = `rgba(251, 191, 36, ${0.14 + pulse * 0.14})`;
  ctx.beginPath();
  ctx.arc(0, 0, 22 + pulse * 4, 0, Math.PI * 2);
  ctx.fill();

  // Weapon badge frame
  ctx.fillStyle = '#0f172a';
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 1.8;
  ctx.shadowColor = '#fbbf24';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.roundRect(-16, -16, 32, 32, 8);
  ctx.fill();
  ctx.stroke();

  // Draw Real Vector Weapon Art
  ctx.shadowBlur = 0;
  drawWeaponVectorIcon(ctx, pickup.type);

  // Ammo / Type indicator badge
  ctx.font = '700 8px "JetBrains Mono", monospace';
  ctx.fillStyle = '#fbbf24';
  ctx.textAlign = 'center';
  ctx.fillText(pickup.type.toUpperCase(), 0, 25);

  ctx.restore();
}

function drawWeaponVectorIcon(ctx: CanvasRenderingContext2D, type: WeaponType) {
  ctx.save();
  if (type === 'sword') {
    ctx.rotate(-Math.PI / 4);
    // Blade
    ctx.fillStyle = '#f8fafc';
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-2, 2);
    ctx.lineTo(0, -13);
    ctx.lineTo(2, 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Crossguard
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-6, 2, 12, 2.5);
    // Hilt & Pommel
    ctx.fillStyle = '#475569';
    ctx.fillRect(-1.5, 4.5, 3, 5);
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(0, 10.5, 1.8, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === 'axe') {
    ctx.rotate(Math.PI / 6);
    // Wooden haft
    ctx.fillStyle = '#92400e';
    ctx.fillRect(-1.5, -11, 3, 22);
    // Steel axe blade
    ctx.fillStyle = '#cbd5e1';
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(1.5, -8);
    ctx.quadraticCurveTo(11, -11, 10, -1);
    ctx.quadraticCurveTo(11, 8, 1.5, 6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Gold collar
    ctx.fillStyle = '#facc15';
    ctx.fillRect(-2.5, -4, 5, 2.5);
  } else if (type === 'gun') {
    // Barrel & slide
    ctx.fillStyle = '#64748b';
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.fillRect(-8, -5, 16, 6);
    ctx.strokeRect(-8, -5, 16, 6);
    // Muzzle glow tip
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(8, -4, 2.5, 4);
    // Grip
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(-5, 1);
    ctx.lineTo(-2, 9);
    ctx.lineTo(3, 9);
    ctx.lineTo(1, 1);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (type === 'rocket') {
    ctx.rotate(-Math.PI / 4);
    // Body
    ctx.fillStyle = '#475569';
    ctx.fillRect(-3, -4, 6, 12);
    // Nosecone
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(-3, -4);
    ctx.lineTo(0, -11);
    ctx.lineTo(3, -4);
    ctx.closePath();
    ctx.fill();
    // Stabilization Fins
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.moveTo(-3, 4);
    ctx.lineTo(-7, 8);
    ctx.lineTo(-3, 8);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(3, 4);
    ctx.lineTo(7, 8);
    ctx.lineTo(3, 8);
    ctx.closePath();
    ctx.fill();
  } else if (type === 'rope') {
    // Ring mount
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, -6, 3, 0, Math.PI * 2);
    ctx.stroke();
    // Hook shaft
    ctx.beginPath();
    ctx.moveTo(0, -3);
    ctx.lineTo(0, 5);
    ctx.stroke();
    // Claws
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 5);
    ctx.quadraticCurveTo(-8, 5, -8, -1);
    ctx.moveTo(0, 5);
    ctx.quadraticCurveTo(8, 5, 8, -1);
    ctx.stroke();
  } else if (type === 'magnet') {
    // Horseshoe arc
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 1, 6.5, Math.PI, 0, true);
    ctx.stroke();
    // Red side & Blue side
    ctx.strokeStyle = '#3b82f6';
    ctx.beginPath();
    ctx.moveTo(6.5, 1);
    ctx.lineTo(6.5, -6);
    ctx.stroke();
    ctx.strokeStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(-6.5, 1);
    ctx.lineTo(-6.5, -6);
    ctx.stroke();
    // Silver contact poles
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(-8.5, -9, 4, 3);
    ctx.fillRect(4.5, -9, 4, 3);
  } else if (type === 'fists') {
    ctx.fillStyle = '#f59e0b';
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(-5, -6, 10, 12, 3);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#d97706';
    ctx.fillRect(-4, -1, 8, 2);
  }
  ctx.restore();
}

function drawPowerUpPickup(ctx: CanvasRenderingContext2D, power: PowerUpPickup) {
  ctx.save();
  const bob = Math.sin(Date.now() * 0.008 + power.x) * 5;
  ctx.translate(power.x, power.y + bob);

  const colors: Record<PowerUpType, { bg: string; border: string; glow: string; name: string }> = {
    giant: { bg: 'rgba(245, 158, 11, 0.25)', border: '#f59e0b', glow: '#fbbf24', name: 'GIANT' },
    speed: { bg: 'rgba(6, 182, 212, 0.25)', border: '#06b6d4', glow: '#22d3ee', name: 'SPEED' },
    shield: { bg: 'rgba(56, 189, 248, 0.25)', border: '#38bdf8', glow: '#7dd3fc', name: 'SHIELD' },
    combo: { bg: 'rgba(236, 72, 153, 0.25)', border: '#ec4899', glow: '#f472b6', name: 'COMBO' },
    jetpack: { bg: 'rgba(14, 165, 233, 0.3)', border: '#38bdf8', glow: '#0284c7', name: 'JETPACK (5s)' },
  };

  const theme = colors[power.type] || colors.shield;

  // Pulsing glow aura
  const pulse = (Math.sin(Date.now() * 0.01 + power.x) + 1) * 0.5;
  ctx.fillStyle = theme.bg;
  ctx.beginPath();
  ctx.arc(0, 0, 22 + pulse * 4, 0, Math.PI * 2);
  ctx.fill();

  // Diamond / Hex container
  ctx.fillStyle = '#090d16';
  ctx.strokeStyle = theme.border;
  ctx.lineWidth = 2.2;
  ctx.shadowColor = theme.glow;
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.moveTo(0, -17);
  ctx.lineTo(17, 0);
  ctx.lineTo(0, 17);
  ctx.lineTo(-17, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.shadowBlur = 0;
  // Real Vector Graphic (NO EMOJIS!)
  drawPowerUpVectorGraphic(ctx, power.type);

  // Label badge below
  ctx.font = '700 8px "JetBrains Mono", monospace';
  ctx.fillStyle = theme.border;
  ctx.textAlign = 'center';
  ctx.fillText(theme.name, 0, 26);

  ctx.restore();
}

function drawPowerUpVectorGraphic(ctx: CanvasRenderingContext2D, type: PowerUpType) {
  ctx.save();
  if (type === 'jetpack') {
    // Twin rocket cylinders with nozzles & blue plasma flame
    ctx.fillStyle = '#475569';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1;
    // Left tank
    ctx.beginPath();
    ctx.roundRect(-7, -8, 5, 14, 2);
    ctx.fill();
    ctx.stroke();
    // Right tank
    ctx.beginPath();
    ctx.roundRect(2, -8, 5, 14, 2);
    ctx.fill();
    ctx.stroke();
    // Center harness plate & power LED
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-2, -4, 4, 8);
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(0, 0, 1.3, 0, Math.PI * 2);
    ctx.fill();
    // Exhaust nozzles
    ctx.fillStyle = '#64748b';
    ctx.fillRect(-7.5, 6, 6, 2.5);
    ctx.fillRect(1.5, 6, 6, 2.5);
    // Cyan flame thrust
    const flameH = 4 + Math.sin(Date.now() * 0.02) * 2;
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(-6.5, 8.5); ctx.lineTo(-4.5, 8.5 + flameH); ctx.lineTo(-2.5, 8.5);
    ctx.moveTo(2.5, 8.5); ctx.lineTo(4.5, 8.5 + flameH); ctx.lineTo(6.5, 8.5);
    ctx.fill();
  } else if (type === 'shield') {
    // Holographic cyber buckler shield
    ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(0, -9);
    ctx.lineTo(8, -5);
    ctx.lineTo(6, 3);
    ctx.lineTo(0, 9);
    ctx.lineTo(-6, 3);
    ctx.lineTo(-8, -5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Energy core
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === 'speed') {
    // Electric cyber lightning bolt
    ctx.fillStyle = '#06b6d4';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(1, -9);
    ctx.lineTo(-6, 0);
    ctx.lineTo(0, 0);
    ctx.lineTo(-2, 9);
    ctx.lineTo(6, -1);
    ctx.lineTo(0, -1);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (type === 'giant') {
    // Golden 4-point titan star
    ctx.fillStyle = '#f59e0b';
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -9);
    ctx.lineTo(2.5, -2.5);
    ctx.lineTo(9, 0);
    ctx.lineTo(2.5, 2.5);
    ctx.lineTo(0, 9);
    ctx.lineTo(-2.5, 2.5);
    ctx.lineTo(-9, 0);
    ctx.lineTo(-2.5, -2.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (type === 'combo') {
    // Blazing combo flame
    ctx.fillStyle = '#ec4899';
    ctx.strokeStyle = '#f472b6';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, 8);
    ctx.quadraticCurveTo(-8, 5, -5, -2);
    ctx.quadraticCurveTo(-2, -3, 0, -8);
    ctx.quadraticCurveTo(4, -4, 5, -1);
    ctx.quadraticCurveTo(8, 4, 0, 8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
}

function drawProjectile(ctx: CanvasRenderingContext2D, proj: Projectile) {
  ctx.save();

  if (proj.type === 'bullet') {
    ctx.strokeStyle = proj.color;
    ctx.lineWidth = 3;
    ctx.shadowColor = proj.color;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(proj.x - proj.vx * 0.8, proj.y - proj.vy * 0.8);
    ctx.lineTo(proj.x, proj.y);
    ctx.stroke();
  } else if (proj.type === 'rocket') {
    ctx.save();
    ctx.translate(proj.x, proj.y);
    const angle = Math.atan2(proj.vy, proj.vx);
    ctx.rotate(angle);

    ctx.fillStyle = '#ea580c';
    ctx.fillRect(-8, -4, 16, 8);

    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.moveTo(8, -5);
    ctx.lineTo(14, 0);
    ctx.lineTo(8, 5);
    ctx.fill();

    ctx.restore();
  } else if (proj.type === 'rope_hook') {
    ctx.strokeStyle = proj.color;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(proj.x, proj.y, proj.radius, 0, Math.PI * 2);
    ctx.stroke();
  } else if (proj.type === 'magnet_pulse') {
    ctx.strokeStyle = proj.color;
    ctx.lineWidth = 3;
    ctx.globalAlpha = Math.max(0, proj.lifetime * 2.5);
    ctx.beginPath();
    ctx.arc(proj.x, proj.y, proj.radius, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

function drawParticle(ctx: CanvasRenderingContext2D, p: Particle) {
  ctx.save();
  ctx.globalAlpha = Math.max(0, p.alpha * (p.life / p.maxLife));

  if (p.type === 'ring') {
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * (1 - p.life / p.maxLife), 0, Math.PI * 2);
    ctx.stroke();
  } else {
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawFloatingText(ctx: CanvasRenderingContext2D, ft: FloatingText) {
  ctx.save();
  ctx.globalAlpha = Math.max(0, ft.alpha);
  ctx.font = `800 ${Math.round(14 * ft.scale)}px "Outfit", sans-serif`;
  ctx.textAlign = 'center';

  // Outline for readability
  ctx.strokeStyle = '#020617';
  ctx.lineWidth = 3;
  ctx.strokeText(ft.text, ft.x, ft.y);

  ctx.fillStyle = ft.color;
  ctx.fillText(ft.text, ft.x, ft.y);
  ctx.restore();
}

function drawWindStreaks(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  dir: number
) {
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1.5;
  const time = Date.now() * 0.003;

  for (let i = 0; i < 16; i++) {
    const y = ((i * 47 + time * 60) % height);
    const x = ((i * 123 + time * 450 * dir) % width + width) % width;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + dir * 60, y);
    ctx.stroke();
  }
  ctx.restore();
}

function drawEarthquakeFissures(ctx: CanvasRenderingContext2D, platforms: Platform[]) {
  ctx.save();
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.4;
  for (const plat of platforms) {
    if (!plat.oneWay) {
      ctx.beginPath();
      ctx.moveTo(plat.x + plat.width * 0.3, plat.y);
      ctx.lineTo(plat.x + plat.width * 0.35, plat.y + 12);
      ctx.lineTo(plat.x + plat.width * 0.33, plat.y + 24);
      ctx.stroke();
    }
  }
  ctx.restore();
}
