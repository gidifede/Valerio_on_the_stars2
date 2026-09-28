const Collectibles = {
    items: [],

    init() {
        this.items = [];
    },

    spawn(type, x, y) {
        const defs = {
            star:       { w: 32, h: 32, imgKey: 'energyStarGold', animated: true, points: 500 },
            coinGold:   { w: 40, h: 40, imgKey: 'coinGold',       animated: false, points: 50 },
            coinSilver: { w: 40, h: 40, imgKey: 'coinSilver',     animated: false, points: 25 },
            coinBronze: { w: 40, h: 40, imgKey: 'coinBronze',     animated: false, points: 10 },
            legoBrick:  { w: 40, h: 40, imgKey: null,              animated: false, points: 100, isLego: true },
        };
        const def = defs[type];
        if (!def) return;
        // Cycle LEGO colors for variety
        const legoKey = def.isLego ? LEGO_COLORS[this.items.length % LEGO_COLORS.length] : null;

        this.items.push({
            type,
            x, y,
            w: def.w,
            h: def.h,
            imgKey: legoKey || def.imgKey,
            animated: def.animated,
            points: def.points,
            isLego: !!def.isLego,
            collected: false,
            animTimer: 0,
            animFrame: 0,
            bobTimer: Math.random() * Math.PI * 2,
        });
    },

    update(dt) {
        const magnetActive = typeof Powerups !== 'undefined' && Powerups.isActive('magnete_lego');

        for (const item of this.items) {
            if (item.collected) continue;

            // Bob animation
            item.bobTimer += dt * 3;

            // Star frame animation
            if (item.animated) {
                item.animTimer += dt;
                if (item.animTimer >= 1 / STAR_ANIM.fps) {
                    item.animTimer -= 1 / STAR_ANIM.fps;
                    item.animFrame = (item.animFrame + 1) % STAR_ANIM.count;
                }
            }

            // Magnet attraction (LEGO bricks and coins)
            if (magnetActive && !item.animated) {
                const dx = (Player.x + Player.w / 2) - (item.x + item.w / 2);
                const dy = (Player.y + Player.h / 2) - (item.y + item.h / 2);
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150 && dist > 0) {
                    const pull = 300 * dt / dist;
                    item.x += dx * pull;
                    item.y += dy * pull;
                }
            }

            // Collision with player
            if (rectsOverlap(
                Player.x, Player.y, Player.w, Player.h,
                item.x, item.y, item.w, item.h
            )) {
                item.collected = true;
                Player.score += item.points;

                if (item.type === 'star') {
                    Player.starsCollected++;
                    Audio_.playSfx('star');
                    if (typeof Particles !== 'undefined') Particles.emit(item.x + item.w / 2, item.y + item.h / 2, 10, '#FFD700', 150);
                } else if (item.isLego) {
                    Player.legoCount++;
                    if (Player.legoCount >= 50) {
                        Player.legoCount -= 50;
                        Player.lives = Math.min(Player.lives + 1, 5);
                    }
                    Audio_.playSfx('coin');
                } else {
                    Audio_.playSfx('coin');
                }
            }
        }

        this.items = this.items.filter(i => !i.collected);
    },

    draw(ctx) {
        for (const item of this.items) {
            if (item.collected) continue;

            const bobY = Math.sin(item.bobTimer) * 4;
            const dx = item.x - Camera.x;
            const dy = item.y - Camera.y + bobY;

            if (item.animated) {
                // Draw animated star from spritesheet
                drawFrame(ctx, Images[item.imgKey],
                          STAR_ANIM.frameW, STAR_ANIM.frameH,
                          item.animFrame, dx, dy, false);
            } else {
                const img = Images[item.imgKey];
                if (img && img.complete) {
                    ctx.drawImage(img, dx, dy, item.w, item.h);
                }
            }
        }
    },
};

// ========== CHECKPOINTS & EXIT ==========
const LevelObjects = {
    checkpoints: [],
    exit: null,
    exitOpen: false,

    init() {
        this.checkpoints = [];
        this.exit = null;
        this.exitOpen = false;
    },

    spawnCheckpoint(x, y) {
        this.checkpoints.push({ x, y, w: 70, h: 70, activated: false });
    },

    spawnExit(x, y) {
        this.exit = { x, y, w: 70, h: 140 };
    },

    update(dt) {
        // Check checkpoint activation
        for (const cp of this.checkpoints) {
            if (cp.activated) continue;
            if (rectsOverlap(Player.x, Player.y, Player.w, Player.h,
                             cp.x, cp.y, cp.w, cp.h)) {
                cp.activated = true;
                Player.checkpointX = cp.x;
                Player.checkpointY = cp.y - Player.h + cp.h;
                Audio_.playSfx('checkpoint');
            }
        }

        // Check exit - door opens when all stars collected
        this.exitOpen = Player.starsCollected >= Player.starsTotal;

        if (this.exit && this.exitOpen) {
            if (rectsOverlap(Player.x, Player.y, Player.w, Player.h,
                             this.exit.x, this.exit.y, this.exit.w, this.exit.h)) {
                Game.levelComplete();
            }
        }
    },

    draw(ctx) {
        // Checkpoints
        for (const cp of this.checkpoints) {
            const imgKey = cp.activated ? 'flagGreen2' : 'flagGreen';
            const img = Images[imgKey];
            if (img && img.complete) {
                ctx.drawImage(img, cp.x - Camera.x, cp.y - Camera.y, cp.w, cp.h);
            }
        }

        // Exit door
        if (this.exit) {
            const topKey = this.exitOpen ? 'doorOpenTop' : 'doorClosedTop';
            const midKey = this.exitOpen ? 'doorOpenMid' : 'doorClosedMid';
            const topImg = Images[topKey];
            const midImg = Images[midKey];
            const dx = this.exit.x - Camera.x;
            const dy = this.exit.y - Camera.y;
            if (topImg && topImg.complete) ctx.drawImage(topImg, dx, dy, 70, 70);
            if (midImg && midImg.complete) ctx.drawImage(midImg, dx, dy + 70, 70, 70);

            // Indicator if not open
            if (!this.exitOpen) {
                ctx.fillStyle = 'rgba(255,50,50,0.8)';
                ctx.font = '14px monospace';
                ctx.textAlign = 'center';
                ctx.fillText(`★ ${Player.starsCollected}/${Player.starsTotal}`, dx + 35, dy - 10);
            }
        }
    },
};
