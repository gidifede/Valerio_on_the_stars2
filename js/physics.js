const Physics = {
    /**
     * Move an entity with gravity and tile collisions.
     * entity must have: x, y, w, h, vx, vy, onGround
     */
    update(e, dt) {
        // Apply gravity (halved if reduced gravity powerup active for player)
        let grav = GRAVITY;
        if (e === Player && typeof Powerups !== 'undefined' && Powerups.isActive('gravita_ridotta')) {
            grav *= 0.5;
        }
        e.vy += grav * dt;

        // Move X
        e.x += e.vx * dt;
        this.resolveX(e);

        // Move Y
        e.y += e.vy * dt;
        this.resolveY(e);

        // Fall out of world
        if (e.y > Tilemap.worldHeight() + 200) {
            e.fellOffWorld = true;
        }
    },

    resolveX(e) {
        const left   = Math.floor(e.x / TILE);
        const right  = Math.floor((e.x + e.w - 1) / TILE);
        const top    = Math.floor(e.y / TILE);
        const bottom = Math.floor((e.y + e.h - 1) / TILE);

        for (let row = top; row <= bottom; row++) {
            for (let col = left; col <= right; col++) {
                if (!Tilemap.isSolid(col, row)) continue;
                if (Tilemap.isOneWay(col, row)) continue; // one-way only blocks Y

                if (e.vx > 0) {
                    e.x = col * TILE - e.w;
                } else if (e.vx < 0) {
                    e.x = (col + 1) * TILE;
                }
                e.vx = 0;
            }
        }
    },

    resolveY(e) {
        const left   = Math.floor(e.x / TILE);
        const right  = Math.floor((e.x + e.w - 1) / TILE);
        const top    = Math.floor(e.y / TILE);
        // Use e.y + e.h (not -1) so that when perfectly aligned on a tile,
        // the ground row is still checked and onGround stays true every frame.
        const bottom = Math.floor((e.y + e.h) / TILE);

        e.onGround = false;

        for (let row = top; row <= bottom; row++) {
            for (let col = left; col <= right; col++) {
                if (!Tilemap.isSolid(col, row)) continue;

                if (Tilemap.isOneWay(col, row)) {
                    // One-way: only block when falling down onto top
                    if (e.vy <= 0) continue;
                    const tileTop = row * TILE;
                    const entityBottom = e.y + e.h;
                    // Only collide if entity was above the tile top last frame
                    if (entityBottom - e.vy * MAX_DT > tileTop + 4) continue;
                    e.y = tileTop - e.h;
                    e.vy = 0;
                    e.onGround = true;
                    continue;
                }

                if (e.vy > 0) {
                    e.y = row * TILE - e.h;
                    e.vy = 0;
                    e.onGround = true;
                } else if (e.vy < 0) {
                    e.y = (row + 1) * TILE;
                    e.vy = 0;
                    // "?" block hit from below
                    if (e === Player && Tilemap.getTile(col, row) === '?') {
                        if (Tilemap.breakBlock(col, row)) {
                            // Spawn powerup from level data
                            if (typeof Powerups !== 'undefined') {
                                const data = LEVELS[Game.currentLevel];
                                if (data && data.powerups) {
                                    for (const [type, pcol, prow] of data.powerups) {
                                        if (pcol === col && prow === row) {
                                            Powerups.spawn(type,
                                                col * TILE + (TILE - 40) / 2,
                                                (row + 1) * TILE);
                                        }
                                    }
                                }
                            }
                            Audio_.playSfx('hit');
                        }
                    }
                }
            }
        }
    },
};
