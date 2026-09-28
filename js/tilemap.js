const Tilemap = {
    grid: [],       // 2D array of tile keys (or 0 for empty)
    cols: 0,
    rows: 0,

    // Map tile codes to image keys
    TILE_MAP: {
        // Grass (World 1)
        'G': 'grassMid',    'C': 'grassCenter',
        'L': 'grassLeft',   'R': 'grassRight',
        'H': 'grassHalf',   'h': 'grassHalfMid',
        'l': 'grassHalfLeft','r': 'grassHalfRight',
        'D': 'dirtCenter',
        // Castle (World 2)
        'A': 'castleMid',   'a': 'castleCenter',
        '[': 'castleLeft',  ']': 'castleRight',
        'B': 'castleHalf',  'b': 'castleHalfMid',
        'e': 'castleHalfLeft','f': 'castleHalfRight',
        // Stone (World 3)
        'O': 'stoneMid',    'o': 'stoneCenter',
        '{': 'stoneLeft',   '}': 'stoneRight',
        'P': 'stoneHalf',   'p': 'stoneHalfMid',
        'q': 'stoneHalfLeft','m': 'stoneHalfRight',
        'X': 'stoneWall',
        // Liquids
        'W': 'liquidWaterTop','w': 'liquidWater',
        'V': 'liquidLavaTop', 'v': 'liquidLava',
        // Hazards & special
        'S': 'spikes',
        'T': 'springboardUp',
        '?': 'buttonBlue',
    },

    // Solid tiles (for collision)
    SOLID: new Set([
        'G','C','L','R','H','h','l','r','D',           // grass
        'A','a','[',']','B','b','e','f',                // castle
        'O','o','{','}','P','p','q','m','X',            // stone
        '?',                                             // ? block
    ]),

    // One-way platforms (can jump through from below)
    ONE_WAY: new Set([
        'H','h','l','r',    // grass half
        'B','b','e','f',    // castle half
        'P','p','q','m',    // stone half
    ]),

    // Hazard tiles (damage on contact)
    HAZARD: new Set(['S', 'V', 'v']),

    // Liquid tiles (water slows, lava damages)
    LIQUID: new Set(['W', 'w', 'V', 'v']),

    // Broken "?" blocks tracked per level
    brokenBlocks: new Set(),

    load(levelData) {
        this.grid = levelData.tiles;
        this.rows = this.grid.length;
        this.cols = this.grid[0].length;
        this.brokenBlocks = new Set();
    },

    getTile(col, row) {
        if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) return 0;
        return this.grid[row][col];
    },

    isSolid(col, row) {
        const tile = this.getTile(col, row);
        // Broken "?" blocks are no longer solid
        if (tile === '?' && this.isBlockBroken(col, row)) return false;
        return this.SOLID.has(tile);
    },

    isOneWay(col, row) {
        return this.ONE_WAY.has(this.getTile(col, row));
    },

    isHazard(col, row) {
        return this.HAZARD.has(this.getTile(col, row));
    },

    isLiquid(col, row) {
        return this.LIQUID.has(this.getTile(col, row));
    },

    // Break a "?" block: replace with pressed sprite, return true if was unbroken
    breakBlock(col, row) {
        const key = col + ',' + row;
        if (this.brokenBlocks.has(key)) return false;
        if (this.getTile(col, row) !== '?') return false;
        this.brokenBlocks.add(key);
        return true;
    },

    isBlockBroken(col, row) {
        return this.brokenBlocks.has(col + ',' + row);
    },

    draw(ctx) {
        const startCol = Math.floor(Camera.x / TILE);
        const endCol = Math.ceil((Camera.x + CANVAS_W) / TILE);
        const startRow = Math.floor(Camera.y / TILE);
        const endRow = Math.ceil((Camera.y + CANVAS_H) / TILE);

        for (let row = startRow; row <= endRow && row < this.rows; row++) {
            for (let col = startCol; col <= endCol && col < this.cols; col++) {
                if (row < 0 || col < 0) continue;
                const tile = this.grid[row][col];
                if (!tile || tile === '0' || tile === ' ') continue;

                let imgKey = this.TILE_MAP[tile];
                if (!imgKey) continue;
                // Broken "?" blocks show pressed sprite
                if (tile === '?' && this.isBlockBroken(col, row)) {
                    imgKey = 'buttonBlue_pressed';
                }

                const img = Images[imgKey];
                if (!img || !img.complete) continue;

                const dx = col * TILE - Camera.x;
                const dy = row * TILE - Camera.y;
                ctx.drawImage(img, dx, dy, TILE, TILE);
            }
        }
    },

    worldWidth()  { return this.cols * TILE; },
    worldHeight() { return this.rows * TILE; },
};
