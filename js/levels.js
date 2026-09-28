// ========== LEVEL DEFINITIONS ==========
// Tile legend:
//   GRASS (World 1): G=top C=center L=cliffL R=cliffR  H/h/l/r=half platforms  D=dirt
//   CASTLE (World 2): A=top a=center [=cliffL ]=cliffR  B/b/e/f=half platforms
//   STONE (World 3):  O=top o=center {=cliffL }=cliffR  P/p/q/m=half platforms  X=wall
//   LIQUIDS: W=waterTop w=water V=lavaTop v=lava
//   SPECIAL: S=spikes T=trampoline ?=powerup block   (space)=empty
//
// PHYSICS CONSTRAINTS (TILE=70, GRAVITY=1200, jumpForce=-520):
//   Max jump height  ≈ 113px ≈ 1.6 tiles  → platforms max 1 tile above ground
//   Max jump distance ≈ 217px ≈ 3.1 tiles  → gaps max 2 tiles (child-friendly)
//   Half-platforms are ONE_WAY: no horizontal blocking, land from above only

const LEVELS = {

    // ======================= WORLD 1 — FORESTA INCANTATA =======================

    '1-1': {
        name: 'Sentiero delle Lucciole',
        world: 'forest',
        music: 'level1',
        starsTotal: 3,
        // 60 columns x 12 rows — ground at row 9, platforms at row 8
        tiles: [
            //           1111111111222222222233333333334444444444555555555
            // 0123456789012345678901234567890123456789012345678901234567890
            '                                                            ',  // 0
            '                                                            ',  // 1
            '                                                            ',  // 2
            '                                                            ',  // 3
            '                                                            ',  // 4
            '                                                            ',  // 5
            '                                                            ',  // 6
            '                                                            ',  // 7
            '        lhr                lhr                  lhr         ',  // 8  (platforms for stars)
            'LGGGG  GGGGG  GGGGG  GGG  GGGG  GGGGG  GGG  GGGGGGGGG  GGGGR',  // 9  (ground)
            'CCCCC  CCCCC  CCCCC  CCC  CCCC  CCCCC  CCC  CCCCCCCCC  CCCCC',  // 10 (fill)
            '                                                            ',  // 11
        ],
        playerSpawn: { col: 2, row: 8 },
        enemies: [
            ['slime', 15, 8, 14, 18],
            ['snail', 22, 8, 21, 23],
            ['slime', 34, 8, 32, 36],
            ['snail', 40, 8, 39, 41],
            ['slime', 45, 8, 44, 47],
            ['slime', 56, 8, 55, 59],
        ],
        collectibles: [
            ['star', 9, 8],
            ['star', 28, 8],
            ['star', 49, 8],
            ['coinGold', 15, 8],  ['coinGold', 17, 8],
            ['coinGold', 33, 8],  ['coinGold', 35, 8],
            ['coinGold', 44, 8],  ['coinGold', 46, 8],
            ['coinSilver', 55, 8], ['coinSilver', 57, 8],
        ],
        checkpoints: [ [21, 8], [40, 8] ],
        exit: { col: 57, row: 8 },
        trampolines: [],
        platforms: [],
        powerups: [],
    },

    '1-2': {
        name: 'Cuore della Foresta',
        world: 'forest',
        music: 'level1',
        starsTotal: 3,
        // 70 columns x 12 rows — ground at row 9, platforms at row 8
        tiles: [
            //           1111111111222222222233333333334444444444555555555566666666
            // 01234567890123456789012345678901234567890123456789012345678901234567890
            '                                                                      ',  // 0
            '                                                                      ',  // 1
            '                                                                      ',  // 2
            '                                                                      ',  // 3
            '                                                                      ',  // 4
            '                                                                      ',  // 5
            '                                                                      ',  // 6
            '                                          ?                           ',  // 7  (? block)
            '        lhr                  lhr                       lhr            ',  // 8  (platforms)
            'LGGGG  GGGGG  GGGGGGGGGG  GGGGG  GGGGG  GGGGG  GGGG  GGGGGGGGG  GGGGGR',  // 9
            'CCCCC  CCCCC  CCCCCCCCCC  CCCCC  CCCCC  CCCCC  CCCC  CCCCCCCCC  CCCCCC',  // 10
            '                                                                      ',  // 11
        ],
        playerSpawn: { col: 2, row: 8 },
        enemies: [
            ['slime', 15, 8, 14, 23],
            ['fly',   28, 6, 24, 34],
            ['snail', 35, 8, 33, 37],
            ['fly',   48, 6, 44, 54],
            ['slime', 57, 8, 53, 61],
        ],
        collectibles: [
            ['star', 9, 8],
            ['star', 30, 8],
            ['star', 56, 8],
            ['coinGold', 16, 8],   ['coinGold', 18, 8],
            ['coinGold', 35, 8],   ['coinGold', 37, 8],
            ['coinGold', 57, 8],   ['coinGold', 59, 8],
            ['coinSilver', 44, 8], ['coinSilver', 46, 8],
            ['legoBrick', 27, 8],  ['legoBrick', 53, 8],
        ],
        checkpoints: [ [26, 8], [48, 8] ],
        exit: { col: 67, row: 8 },
        trampolines: [],
        platforms: [],
        powerups: [
            ['salto_stellare', 42, 7],
        ],
    },

    // ======================= WORLD 2 — CASTELLO OSCURO =======================

    '2-1': {
        name: 'Le Mura Esterne',
        world: 'castle',
        music: 'level2',
        starsTotal: 3,
        // 65 columns x 12 rows — ground at row 9, platforms at row 8
        tiles: [
            //           1111111111222222222233333333334444444444555555555566666
            // 012345678901234567890123456789012345678901234567890123456789012345
            '                                                                 ',  // 0
            '                                                                 ',  // 1
            '                                                                 ',  // 2
            '                                                                 ',  // 3
            '                                                                 ',  // 4
            '                                                                 ',  // 5
            '                                                                 ',  // 6
            '   ?                                                             ',  // 7  (? block)
            '         efb                 efb                  efb            ',  // 8  (platforms)
            '[AAAA  AAAAA  AAAAA  AAAA  AAAAA  AAAAA  AAAA  AAAAAAAAAA  AAAAA]',  // 9
            'aaaaaa aaaaa  aaaaa  aaaa  aaaaa  aaaaa  aaaa  aaaaaaaaaa  aaaaaa',  // 10
            '                                                                 ',  // 11
        ],
        playerSpawn: { col: 2, row: 8 },
        enemies: [
            ['blocker', 16, 8, 14, 18],
            ['snail',   22, 8, 21, 24],
            ['blocker', 28, 8, 27, 31],
            ['snail',   36, 8, 34, 38],
            ['blocker', 50, 8, 47, 53],
        ],
        collectibles: [
            ['star', 10, 8],
            ['star', 30, 8],
            ['star', 51, 8],
            ['coinGold', 8, 8],    ['coinGold', 12, 8],
            ['coinGold', 22, 8],   ['coinGold', 24, 8],
            ['coinSilver', 36, 8], ['coinSilver', 38, 8],
            ['legoBrick', 16, 8],  ['legoBrick', 28, 8],
            ['legoBrick', 42, 8],  ['legoBrick', 48, 8],
        ],
        checkpoints: [ [18, 8], [42, 8] ],
        exit: { col: 62, row: 8 },
        trampolines: [],
        platforms: [
            [22, 8, 28, 8, 40],
            [42, 8, 48, 8, 50],
        ],
        powerups: [
            ['scudo_robotico', 3, 7],
        ],
    },

    '2-2': {
        name: 'La Torre del Fantasma',
        world: 'castle',
        music: 'level2',
        starsTotal: 3,
        // 70 columns x 14 rows — ground at row 9, lava at rows 11-12
        tiles: [
            //           1111111111222222222233333333334444444444555555555566666666
            // 01234567890123456789012345678901234567890123456789012345678901234567890
            '                                                                      ',  // 0
            '                                                                      ',  // 1
            '                                                                      ',  // 2
            '                                                                      ',  // 3
            '                                                                      ',  // 4
            '                                                                      ',  // 5
            '                                                                      ',  // 6
            '                                        ?                             ',  // 7  (? block)
            '          efb                 efb                       efb           ',  // 8  (platforms)
            '[AAAA  AAAAAAA  AAAAA  AAAAA  AAAAA  AAAAAAA  AAAAA  AAAAAAAAA  AAAAA]',  // 9
            'aaaaa  aaaaaaa  aaaaa  aaaaa  aaaaa  aaaaaaa  aaaaa  aaaaaaaaa  aaaaaa',  // 10
            'VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV',  // 11
            'vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv',  // 12
            '                                                                      ',  // 13
        ],
        playerSpawn: { col: 2, row: 8 },
        enemies: [
            ['poker',   12, 8, 7, 13],
            ['snail',   18, 8, 16, 20],
            ['poker',   32, 8, 30, 34],
            ['blocker', 40, 8, 37, 43],
            ['poker',   48, 8, 46, 50],
            ['snail',   58, 8, 53, 61],
        ],
        collectibles: [
            ['star', 11, 8],
            ['star', 31, 8],
            ['star', 57, 8],
            ['coinGold', 8, 8],    ['coinGold', 18, 8],
            ['coinGold', 25, 8],   ['coinGold', 34, 8],
            ['coinSilver', 42, 8], ['coinSilver', 48, 8],
            ['legoBrick', 24, 8],  ['legoBrick', 38, 8],
            ['legoBrick', 50, 8],  ['legoBrick', 58, 8],
            ['legoBrick', 60, 8],
        ],
        checkpoints: [ [24, 8], [48, 8] ],
        exit: { col: 67, row: 8 },
        trampolines: [],
        platforms: [
            [22, 8, 28, 8, 45],
        ],
        powerups: [
            ['gravita_ridotta', 40, 7],
        ],
    },

    // ======================= WORLD 3 — MONDO LEGO SPAZIALE =======================

    '3-1': {
        name: 'Costruzioni tra le Stelle',
        world: 'lego_world',
        music: 'level3',
        starsTotal: 3,
        // 65 columns x 14 rows — ground at row 9, water at rows 11-12
        tiles: [
            //           1111111111222222222233333333334444444444555555555566666
            // 012345678901234567890123456789012345678901234567890123456789012345
            '                                                                 ',  // 0
            '                                                                 ',  // 1
            '                                                                 ',  // 2
            '                                                                 ',  // 3
            '                                                                 ',  // 4
            '                                                                 ',  // 5
            '                                                                 ',  // 6
            '   ?                                                             ',  // 7  (? block)
            '         qpm                 qpm                  qpm            ',  // 8  (platforms)
            '{OOOO  OOOOO  OOOOO  OOOO  OOOOO  OOOOO  OOOO  OOOOOOOOOO  OOOOO}',  // 9
            'ooooo  ooooo  ooooo  oooo  ooooo  ooooo  oooo  oooooooooo  oooooo',  // 10
            'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',  // 11
            'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',  // 12
            '                                                                 ',  // 13
        ],
        playerSpawn: { col: 2, row: 8 },
        enemies: [
            ['snail', 8,  8, 7, 11],
            ['fly',   20, 6, 14, 26],
            ['snail', 28, 8, 27, 31],
            ['fly',   40, 6, 34, 48],
            ['snail', 50, 8, 47, 53],
        ],
        collectibles: [
            ['star', 10, 8],
            ['star', 30, 8],
            ['star', 51, 8],
            ['legoBrick', 8, 8],   ['legoBrick', 10, 8],
            ['legoBrick', 16, 8],  ['legoBrick', 22, 8],
            ['legoBrick', 28, 8],  ['legoBrick', 34, 8],
            ['legoBrick', 41, 8],  ['legoBrick', 42, 8],
            ['legoBrick', 48, 8],  ['legoBrick', 52, 8],
            ['coinGold', 36, 8],   ['coinGold', 54, 8],
        ],
        checkpoints: [ [22, 8], [44, 8] ],
        exit: { col: 62, row: 8 },
        trampolines: [],
        platforms: [
            [22, 8, 28, 8, 40],
        ],
        powerups: [
            ['magnete_lego', 3, 7],
        ],
    },

    '3-2': {
        name: 'La Base Galattica',
        world: 'lego_world',
        music: 'level3',
        starsTotal: 3,
        // 80 columns x 14 rows — ground at row 9, water at rows 11-12
        tiles: [
            //           1111111111222222222233333333334444444444555555555566666666667777777
            // 0123456789012345678901234567890123456789012345678901234567890123456789012345678901
            '                                                                                ',  // 0
            '                                                                                ',  // 1
            '                                                                                ',  // 2
            '                                                                                ',  // 3
            '                                                                                ',  // 4
            '                                                                                ',  // 5
            '                                                                                ',  // 6
            '                            ?                                                   ',  // 7  (? block)
            '          qpm                      qpm                             qpm          ',  // 8  (platforms)
            '{OOOOO  OOOOO  OOOOO  OOO  OOOO  OOOOO  OOO  OOOOO  OOOOO  OOO  OOOOOOOO  OOOOO}',  // 9
            'oooooo  ooooo  ooooo  ooo  oooo  ooooo  ooo  ooooo  ooooo  ooo  oooooooo  oooooo',  // 10
            'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',  // 11
            'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',  // 12
            '                                                                                ',  // 13
        ],
        playerSpawn: { col: 2, row: 8 },
        enemies: [
            ['slime',   10, 8, 8, 12],
            ['fly',     20, 6, 15, 26],
            ['poker',   28, 8, 27, 30],
            ['blocker', 36, 8, 33, 37],
            ['fly',     48, 6, 45, 55],
            ['poker',   54, 8, 52, 56],
            ['blocker', 60, 8, 59, 61],
            ['snail',   68, 8, 64, 71],
        ],
        collectibles: [
            ['star', 11, 8],
            ['star', 36, 8],
            ['star', 68, 8],
            ['legoBrick', 8, 8],   ['legoBrick', 16, 8],
            ['legoBrick', 18, 8],  ['legoBrick', 22, 8],
            ['legoBrick', 30, 8],  ['legoBrick', 34, 8],
            ['legoBrick', 40, 8],  ['legoBrick', 46, 8],
            ['legoBrick', 48, 8],  ['legoBrick', 56, 8],
            ['legoBrick', 60, 8],  ['legoBrick', 66, 8],
            ['coinGold', 24, 8],   ['coinGold', 42, 8],
            ['coinGold', 52, 8],   ['coinGold', 70, 8],
        ],
        checkpoints: [ [24, 8], [48, 8] ],
        exit: { col: 77, row: 8 },
        trampolines: [],
        platforms: [
            [22, 8, 28, 8, 45],
            [50, 8, 58, 8, 50],
        ],
        powerups: [
            ['gravita_ridotta', 28, 7],
        ],
    },
    // ======================= BOSS ARENAS =======================

    '1-B': {
        name: 'Guardiano della Foresta',
        world: 'forest',
        music: 'level1',
        starsTotal: 0,
        isBoss: true,
        boss: { type: 'grande_slime', col: 15, row: 8 },
        // 20 columns x 12 rows — enclosed arena
        tiles: [
            'LGGGGGGGGGGGGGGGGGGR',  // 0
            'C                  C',  // 1
            'C                  C',  // 2
            'C                  C',  // 3
            'C                  C',  // 4
            'C                  C',  // 5
            'C                  C',  // 6
            'C      lhr         C',  // 7
            'C            lhr   C',  // 8
            'CGGGGGGGGGGGGGGGGGGC',  // 9
            'CCCCCCCCCCCCCCCCCCCC',  // 10
            '                    ',  // 11
        ],
        playerSpawn: { col: 2, row: 8 },
        enemies: [],
        collectibles: [],
        checkpoints: [],
        exit: { col: 10, row: 8 },
        trampolines: [],
        platforms: [],
        powerups: [],
    },

    '2-B': {
        name: 'Guardiano del Castello',
        world: 'castle',
        music: 'level2',
        starsTotal: 0,
        isBoss: true,
        boss: { type: 'poker_infuocato', col: 16, row: 8 },
        // 20 columns x 14 rows — castle arena with platforms
        tiles: [
            '[AAAAAAAAAAAAAAAAAA]',  // 0
            'a                  a',  // 1
            'a                  a',  // 2
            'a                  a',  // 3
            'a                  a',  // 4
            'a  efb        efb  a',  // 5
            'a     efb  efb     a',  // 6
            'a       efb        a',  // 7
            'a  efb        efb  a',  // 8
            'aAAAAA        AAAAaa',  // 9
            'aaaaaa        aaaaaa',  // 10
            'aaaaaa VVVVVV aaaaaa',  // 11
            'aaaaaa vvvvvv aaaaaa',  // 12
            '                    ',  // 13
        ],
        playerSpawn: { col: 2, row: 8 },
        enemies: [],
        collectibles: [],
        checkpoints: [],
        exit: { col: 3, row: 8 },
        trampolines: [],
        platforms: [],
        powerups: [],
    },

    '3-B': {
        name: 'Megatron Corrotto',
        world: 'lego_world',
        music: 'level3',
        starsTotal: 0,
        isBoss: true,
        boss: { type: 'megatron_corrotto', col: 15, row: 8 },
        // 20 columns x 14 rows — stone arena with platforms
        tiles: [
            '{OOOOOOOOOOOOOOOOOO}',  // 0
            'o                  o',  // 1
            'o                  o',  // 2
            'o                  o',  // 3
            'o                  o',  // 4
            'o                  o',  // 5
            'o     qpm          o',  // 6
            'o            qpm   o',  // 7
            'o   qpm            o',  // 8
            'oOOOOOOOOOOOOOOOOOOo',  // 9
            'oooooooooooooooooooo',  // 10
            'WWWWWWWWWWWWWWWWWWWW',  // 11
            'wwwwwwwwwwwwwwwwwwww',  // 12
            '                    ',  // 13
        ],
        playerSpawn: { col: 2, row: 8 },
        enemies: [],
        collectibles: [],
        checkpoints: [],
        exit: { col: 10, row: 8 },
        trampolines: [],
        platforms: [],
        powerups: [],
    },
};

// ========== LEVEL LOADER ==========

function loadLevel(levelId) {
    const data = LEVELS[levelId];
    if (!data) { console.error('Level not found:', levelId); return; }

    // Parse tiles - convert string rows to arrays
    const parsedTiles = data.tiles.map(row => {
        const arr = [];
        for (let i = 0; i < row.length; i++) {
            arr.push(row[i] === ' ' ? 0 : row[i]);
        }
        return arr;
    });

    // Ensure all rows same length
    const maxCols = Math.max(...parsedTiles.map(r => r.length));
    for (const row of parsedTiles) {
        while (row.length < maxCols) row.push(0);
    }

    Tilemap.load({ tiles: parsedTiles });
    Camera.init(Tilemap.worldWidth(), Tilemap.worldHeight());
    Background.setWorld(data.world);

    // Spawn player
    const px = data.playerSpawn.col * TILE;
    const py = data.playerSpawn.row * TILE - Player.h;
    Player.init(px, py);
    Player.starsTotal = data.starsTotal;

    // Spawn enemies
    Enemies.init();
    for (const [type, col, row, pl, pr] of data.enemies) {
        Enemies.spawn(type,
            col * TILE, row * TILE - Enemies.TYPES[type].h,
            pl * TILE, pr * TILE);
    }

    // Spawn collectibles
    Collectibles.init();
    for (const [type, col, row] of data.collectibles) {
        const def = type === 'star' ? { w: 32, h: 32 } : { w: 40, h: 40 };
        Collectibles.spawn(type,
            col * TILE + (TILE - def.w) / 2,
            row * TILE - def.h);
    }

    // Spawn checkpoints & exit
    LevelObjects.init();
    for (const [col, row] of data.checkpoints) {
        LevelObjects.spawnCheckpoint(col * TILE, row * TILE);
    }
    LevelObjects.spawnExit(data.exit.col * TILE, data.exit.row * TILE);

    // Spawn trampolines
    Hazards.init();
    if (data.trampolines) {
        for (const [col, row] of data.trampolines) {
            Hazards.spawnTrampoline(col * TILE, row * TILE);
        }
    }

    // Spawn moving platforms
    Platforms.init();
    if (data.platforms) {
        for (const [sc, sr, ec, er, speed] of data.platforms) {
            Platforms.spawn(sc * TILE, sr * TILE, ec * TILE, er * TILE, speed);
        }
    }

    // Init powerups (actual spawning happens when ? blocks are hit)
    Powerups.init();

    // Init particles
    if (typeof Particles !== 'undefined') Particles.init();

    // Spawn boss if boss level
    if (typeof Boss !== 'undefined') Boss.init();
    if (data.isBoss && data.boss && typeof Boss !== 'undefined') {
        const bdef = Boss.TYPES[data.boss.type];
        Boss.spawn(data.boss.type,
            data.boss.col * TILE,
            data.boss.row * TILE - (bdef ? bdef.h : 0));
    }

    // Start music
    Audio_.playMusic(data.music);
}
