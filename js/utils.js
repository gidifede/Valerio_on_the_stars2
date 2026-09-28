// ========== CONSTANTS ==========
const CANVAS_W = 960;
const CANVAS_H = 640;
const TILE = 70;
const GRAVITY = 1200;
const MAX_DT = 0.05;

// ========== ASSET DEFINITIONS ==========
const ASSET_BASE = 'assets/';

const IMG_MANIFEST = {
    // Player
    valerio_sheet:  'sprites/valerio/valerio_spritesheet.png',

    // Enemies — Slime, Snail (M1)
    slimeWalk1:     'sprites/enemies/slimeWalk1.png',
    slimeWalk2:     'sprites/enemies/slimeWalk2.png',
    slimeDead:      'sprites/enemies/slimeDead.png',
    snailWalk1:     'sprites/enemies/snailWalk1.png',
    snailWalk2:     'sprites/enemies/snailWalk2.png',
    snailShell:     'sprites/enemies/snailShell.png',
    // Enemies — Fly, Blocker, Poker, Fish (M2)
    flyFly1:        'sprites/enemies/flyFly1.png',
    flyFly2:        'sprites/enemies/flyFly2.png',
    flyDead:        'sprites/enemies/flyDead.png',
    blockerMad:     'sprites/enemies/blockerMad.png',
    blockerSad:     'sprites/enemies/blockerSad.png',
    pokerMad:       'sprites/enemies/pokerMad.png',
    pokerSad:       'sprites/enemies/pokerSad.png',
    fishSwim1:      'sprites/enemies/fishSwim1.png',
    fishSwim2:      'sprites/enemies/fishSwim2.png',
    fishDead:       'sprites/enemies/fishDead.png',

    // Tiles — Grass (World 1)
    grassMid:       'tiles/grassMid.png',
    grassCenter:    'tiles/grassCenter.png',
    grassLeft:      'tiles/grassCliffLeft.png',
    grassRight:     'tiles/grassCliffRight.png',
    grassHillLeft:  'tiles/grassHillLeft.png',
    grassHillRight: 'tiles/grassHillRight.png',
    grassHalf:      'tiles/grassHalf.png',
    grassHalfLeft:  'tiles/grassHalfLeft.png',
    grassHalfRight: 'tiles/grassHalfRight.png',
    grassHalfMid:   'tiles/grassHalfMid.png',
    dirtCenter:     'tiles/grassCenter_rounded.png',
    // Tiles — Castle (World 2)
    castleMid:      'tiles/castleMid.png',
    castleCenter:   'tiles/castleCenter.png',
    castleLeft:     'tiles/castleCliffLeft.png',
    castleRight:    'tiles/castleCliffRight.png',
    castleHalf:     'tiles/castleHalf.png',
    castleHalfLeft: 'tiles/castleHalfLeft.png',
    castleHalfMid:  'tiles/castleHalfMid.png',
    castleHalfRight:'tiles/castleHalfRight.png',
    // Tiles — Stone (World 3)
    stoneMid:       'tiles/stoneMid.png',
    stoneCenter:    'tiles/stoneCenter.png',
    stoneLeft:      'tiles/stoneCliffLeft.png',
    stoneRight:     'tiles/stoneCliffRight.png',
    stoneHalf:      'tiles/stoneHalf.png',
    stoneHalfLeft:  'tiles/stoneHalfLeft.png',
    stoneHalfMid:   'tiles/stoneHalfMid.png',
    stoneHalfRight: 'tiles/stoneHalfRight.png',
    stoneWall:      'tiles/stoneWall.png',
    // Tiles — Liquids
    liquidWaterTop: 'tiles/liquidWaterTop_mid.png',
    liquidWater:    'tiles/liquidWater.png',
    liquidLavaTop:  'tiles/liquidLavaTop_mid.png',
    liquidLava:     'tiles/liquidLava.png',

    // Items
    coinGold:       'items/coinGold.png',
    coinSilver:     'items/coinSilver.png',
    coinBronze:     'items/coinBronze.png',
    flagGreen:      'items/flagGreen.png',
    flagGreen2:     'items/flagGreen2.png',
    doorClosedMid:  'tiles/door_closedMid.png',
    doorClosedTop:  'tiles/door_closedTop.png',
    doorOpenMid:    'tiles/door_openMid.png',
    doorOpenTop:    'tiles/door_openTop.png',
    spikes:         'items/spikes.png',
    springboardUp:  'items/springboardUp.png',
    springboardDown:'items/springboardDown.png',
    fireball:       'items/fireball.png',
    weightChained:  'items/weightChained.png',
    buttonBlue:     'items/buttonBlue.png',
    buttonBlue_pressed: 'items/buttonBlue_pressed.png',

    // Stars
    energyStarGold: 'collectibles/stars/energy_star_gold.png',

    // LEGO bricks
    legoBrick_blue:   'collectibles/lego/PNG/Default/Blue/brick_medium_2.png',
    legoBrick_red:    'collectibles/lego/PNG/Default/Red/brick_medium_2.png',
    legoBrick_yellow: 'collectibles/lego/PNG/Default/Yellow/brick_medium_2.png',
    legoBrick_white:  'collectibles/lego/PNG/Default/White/brick_medium_2.png',
    legoBrick_black:  'collectibles/lego/PNG/Default/Black/brick_medium_2.png',

    // Power-ups
    magnete_lego:    'powerups/magnete_lego.png',
    salto_stellare:  'powerups/salto_stellare.png',
    scudo_robotico:  'powerups/scudo_robotico.png',
    gravita_ridotta: 'powerups/gravita_ridotta.png',

    // HUD
    heartFull:      'hud/hud_heartFull.png',
    heartHalf:      'hud/hud_heartHalf.png',
    heartEmpty:     'hud/hud_heartEmpty.png',
    hudP1:          'hud/hud_p1.png',

    // Megatron
    megatron:       'sprites/megatron/Megatron_Felice_robot-spritesheet.png',

    // Valerio portrait (title screen)
    valerioPortrait: 'sprites/valerio/valerio_portrait.png',

    // Backgrounds — Forest (World 1)
    forestBack:     'backgrounds/forest/back.png',
    forestMid:      'backgrounds/forest/middle.png',
    bgGeneric:      'backgrounds/bg.png',
    // Backgrounds — Castle (World 2)
    castleBack:     'backgrounds/castle/castle_back.png',
    castleBgMid:    'backgrounds/castle/castle_mid.png',
    castleFront:    'backgrounds/castle/castle_front.png',
    // Backgrounds — Space (World 3)
    spaceBack:      'backgrounds/space/space_back.png',
    spaceMid:       'backgrounds/space/space_mid.png',
    spaceFront:     'backgrounds/space/space_front.png',
    // Backgrounds — LEGO World (World 3)
    legoBack:       'backgrounds/lego_world/lego_back.png',
    legoMid:        'backgrounds/lego_world/lego_mid.png',
    legoFront:      'backgrounds/lego_world/lego_front.png',
};

for (let i = 0; i <= 9; i++) {
    IMG_MANIFEST['hud_' + i] = 'hud/hud_' + i + '.png';
}

const SFX_MANIFEST = {
    hit:        'audio/sfx/hit.wav',
    explosion:  'audio/sfx/explosion.wav',
    powerup:    'audio/sfx/powerup.wav',
    death:      'audio/sfx/player-death.wav',
    jump:       'audio/sfx/jump.wav',
    land:       'audio/sfx/land.wav',
    star:       'audio/sfx/star.wav',
    coin:       'audio/sfx/coin.wav',
    checkpoint: 'audio/sfx/checkpoint.wav',
    stomp:      'audio/sfx/stomp.wav',
};

const MUSIC_MANIFEST = {
    title:  'audio/music/title.wav',
    level1: 'audio/music/level1.wav',
    level2: 'audio/music/level2.wav',
    level3: 'audio/music/level3.wav',
    ending: 'audio/music/ending.wav',
};

// ========== SPRITE FRAME DEFINITIONS ==========
// Valerio spritesheet: 14 frames, each 66x92
const VALERIO = {
    frameW: 66,
    frameH: 92,
    idle:  { start: 0, count: 2, fps: 4 },
    walk:  { start: 2, count: 8, fps: 12 },
    jump:  { start: 10, count: 2, fps: 6 },
    hurt:  { start: 12, count: 1, fps: 1 },
    duck:  { start: 13, count: 1, fps: 1 },
};

// Energy star: 8 frames, each 32x32
const STAR_ANIM = { frameW: 32, frameH: 32, count: 8, fps: 10 };

// Power-up sprites: 4 frames, each 32x32 (128x32 sheets)
const POWERUP_ANIM = { frameW: 32, frameH: 32, count: 4, fps: 6 };

// LEGO brick image keys (cycled for visual variety)
const LEGO_COLORS = ['legoBrick_blue', 'legoBrick_red', 'legoBrick_yellow', 'legoBrick_white', 'legoBrick_black'];

// ========== LOADED ASSETS ==========
const Images = {};
const Sounds = {};
const Music = {};

// ========== ASSET LOADER ==========
function loadAssets(onProgress, onComplete) {
    const totalItems = Object.keys(IMG_MANIFEST).length +
                       Object.keys(SFX_MANIFEST).length +
                       Object.keys(MUSIC_MANIFEST).length;
    let loaded = 0;

    function tick() {
        loaded++;
        if (onProgress) onProgress(loaded, totalItems);
        if (loaded >= totalItems && onComplete) onComplete();
    }

    // Images
    for (const [key, path] of Object.entries(IMG_MANIFEST)) {
        const img = new Image();
        img.onload = tick;
        img.onerror = () => { console.warn('Failed to load image:', path); tick(); };
        img.src = ASSET_BASE + path;
        Images[key] = img;
    }

    // Helper: load audio with timeout fallback (mobile may block preload)
    function loadAudio(audio, path) {
        let done = false;
        const finish = () => { if (!done) { done = true; tick(); } };
        audio.addEventListener('canplaythrough', finish, { once: true });
        audio.addEventListener('error', () => { console.warn('Failed to load audio:', path); finish(); }, { once: true });
        setTimeout(finish, 3000); // fallback: don't block loading on mobile
    }

    // SFX
    for (const [key, path] of Object.entries(SFX_MANIFEST)) {
        const audio = new Audio(ASSET_BASE + path);
        audio.preload = 'auto';
        loadAudio(audio, path);
        Sounds[key] = audio;
    }

    // Music
    for (const [key, path] of Object.entries(MUSIC_MANIFEST)) {
        const audio = new Audio(ASSET_BASE + path);
        audio.preload = 'auto';
        audio.loop = true;
        loadAudio(audio, path);
        Music[key] = audio;
    }
}

// ========== HELPERS ==========
function clamp(v, min, max) {
    return v < min ? min : v > max ? max : v;
}

function rectsOverlap(ax, ay, aw, ah, bx, by, bw, bh) {
    return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

function drawFrame(ctx, img, frameW, frameH, frameIndex, dx, dy, flipX) {
    const cols = Math.floor(img.width / frameW);
    const col = frameIndex % cols;
    const row = Math.floor(frameIndex / cols);
    ctx.save();
    if (flipX) {
        ctx.translate(dx + frameW, dy);
        ctx.scale(-1, 1);
        ctx.drawImage(img, col * frameW, row * frameH, frameW, frameH, 0, 0, frameW, frameH);
    } else {
        ctx.drawImage(img, col * frameW, row * frameH, frameW, frameH, dx, dy, frameW, frameH);
    }
    ctx.restore();
}
