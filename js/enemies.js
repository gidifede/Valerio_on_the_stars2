const Enemies = {
    list: [],
    projectiles: [],  // fireballs from Poker

    TYPES: {
        slime: {
            w: 50, h: 28, speed: 60,
            frames: ['slimeWalk1', 'slimeWalk2'], deadFrame: 'slimeDead', fps: 4,
        },
        snail: {
            w: 54, h: 31, speed: 30,
            frames: ['snailWalk1', 'snailWalk2'], deadFrame: 'snailShell', fps: 3,
        },
        fly: {
            w: 50, h: 32, speed: 80,
            frames: ['flyFly1', 'flyFly2'], deadFrame: 'flyDead', fps: 6,
            flying: true,       // no gravity, sine wave on Y
        },
        blocker: {
            w: 60, h: 70, speed: 0,
            frames: ['blockerSad'], deadFrame: 'blockerSad', fps: 1,
            stationary: true, activationRange: 200, chargeSpeed: 180, chargeDuration: 0.8,
        },
        poker: {
            w: 56, h: 64, speed: 0,
            frames: ['pokerMad'], deadFrame: 'pokerSad', fps: 1,
            stationary: true, shootInterval: 3.0,
        },
        fish: {
            w: 52, h: 28, speed: 0,
            frames: ['fishSwim1', 'fishSwim2'], deadFrame: 'fishDead', fps: 4,
            jumping: true, jumpInterval: 2.5, jumpForce: -600,
        },
    },

    init() {
        this.list = [];
        this.projectiles = [];
    },

    spawn(type, x, y, patrolLeft, patrolRight) {
        const def = this.TYPES[type];
        if (!def) return;
        this.list.push({
            type, x, y,
            w: def.w, h: def.h,
            vx: def.stationary || def.jumping ? 0 : def.speed,
            vy: 0,
            onGround: false,
            fellOffWorld: false,
            patrolLeft, patrolRight,
            alive: true,
            deadTimer: 0,
            animTimer: 0,
            animFrame: 0,
            facingRight: true,
            // Fly: base Y for sine wave
            baseY: y,
            flyTimer: 0,
            // Blocker: charge state
            charging: false, chargeTimer: 0, activated: false,
            // Poker: shoot timer
            shootTimer: def.shootInterval || 0,
            // Fish: jump timer + home position
            jumpTimer: def.jumpInterval || 0,
            homeX: x, homeY: y,
            hidden: !!def.jumping,  // fish starts hidden below liquid
        });
    },

    update(dt) {
        for (const e of this.list) {
            if (!e.alive) {
                e.deadTimer += dt;
                continue;
            }

            const def = this.TYPES[e.type];

            // ---- Type-specific logic ----
            if (def.flying) {
                this._updateFly(e, def, dt);
            } else if (def.stationary && e.type === 'blocker') {
                this._updateBlocker(e, def, dt);
            } else if (def.stationary && e.type === 'poker') {
                this._updatePoker(e, def, dt);
            } else if (def.jumping) {
                this._updateFish(e, def, dt);
            } else {
                this._updatePatrol(e, def, dt);
            }

            // Animation
            e.animTimer += dt;
            if (e.animTimer >= 1 / def.fps) {
                e.animTimer -= 1 / def.fps;
                e.animFrame = (e.animFrame + 1) % def.frames.length;
            }

            // Collision with player (skip hidden fish)
            if (e.hidden) continue;
            if (!Player.invincible && rectsOverlap(
                Player.x, Player.y, Player.w, Player.h,
                e.x, e.y, e.w, e.h
            )) {
                const playerBottom = Player.y + Player.h;
                const enemyTop = e.y;
                if (Player.vy > 0 && playerBottom - Player.vy * dt < enemyTop + 10) {
                    e.alive = false;
                    Player.bounce();
                    Player.score += 200;
                    Audio_.playSfx('stomp');
                    if (typeof Particles !== 'undefined') Particles.emit(e.x + e.w / 2, e.y + e.h / 2, 8, '#ffffff', 120);
                } else {
                    Player.takeDamage();
                }
            }
        }

        // Update projectiles
        this._updateProjectiles(dt);

        // Cleanup dead
        this.list = this.list.filter(e => e.alive || e.deadTimer < 0.5);
    },

    // --- Patrol (slime, snail) ---
    _updatePatrol(e, def, dt) {
        e.x += e.vx * dt;
        if (e.x <= e.patrolLeft)        { e.x = e.patrolLeft;         e.vx = def.speed;  e.facingRight = true; }
        if (e.x + e.w >= e.patrolRight) { e.x = e.patrolRight - e.w;  e.vx = -def.speed; e.facingRight = false; }
        // Gravity
        e.vy += GRAVITY * dt;
        e.y += e.vy * dt;
        this._groundCheck(e);
    },

    // --- Fly (sine wave, no gravity) ---
    _updateFly(e, def, dt) {
        e.flyTimer += dt;
        e.x += e.vx * dt;
        if (e.x <= e.patrolLeft)        { e.x = e.patrolLeft;         e.vx = def.speed;  e.facingRight = true; }
        if (e.x + e.w >= e.patrolRight) { e.x = e.patrolRight - e.w;  e.vx = -def.speed; e.facingRight = false; }
        e.y = e.baseY + Math.sin(e.flyTimer * 2) * 40;
    },

    // --- Blocker (dormant → charges when player near) ---
    _updateBlocker(e, def, dt) {
        const distX = Math.abs((Player.x + Player.w / 2) - (e.x + e.w / 2));
        const distY = Math.abs((Player.y + Player.h / 2) - (e.y + e.h / 2));
        const dist = Math.sqrt(distX * distX + distY * distY);

        if (e.charging) {
            e.chargeTimer -= dt;
            e.x += e.vx * dt;
            if (e.chargeTimer <= 0) {
                e.charging = false;
                e.vx = 0;
            }
        } else if (dist < def.activationRange) {
            if (!e.activated) {
                e.activated = true;
                e.charging = true;
                e.chargeTimer = def.chargeDuration;
                e.facingRight = Player.x > e.x;
                e.vx = e.facingRight ? def.chargeSpeed : -def.chargeSpeed;
            }
        } else {
            e.activated = false;
        }

        // Gravity
        e.vy += GRAVITY * dt;
        e.y += e.vy * dt;
        this._groundCheck(e);
    },

    // --- Poker (stationary, shoots fireballs) ---
    _updatePoker(e, def, dt) {
        e.shootTimer -= dt;
        e.facingRight = Player.x > e.x;
        if (e.shootTimer <= 0) {
            e.shootTimer = def.shootInterval;
            // Spawn fireball toward player
            const dx = Player.x - e.x;
            const dy = Player.y - e.y;
            const len = Math.sqrt(dx * dx + dy * dy) || 1;
            const speed = 200;
            this.projectiles.push({
                x: e.x + e.w / 2 - 36,
                y: e.y + e.h / 2 - 36,
                vx: (dx / len) * speed,
                vy: (dy / len) * speed,
                w: 72, h: 72,
                life: 3.0,
            });
        }
        // Gravity
        e.vy += GRAVITY * dt;
        e.y += e.vy * dt;
        this._groundCheck(e);
    },

    // --- Fish (jumps from water periodically) ---
    _updateFish(e, def, dt) {
        e.jumpTimer -= dt;
        if (e.hidden) {
            if (e.jumpTimer <= 0) {
                e.hidden = false;
                e.vy = def.jumpForce;
                e.jumpTimer = def.jumpInterval;
                e.facingRight = Player.x > e.x;
            }
        } else {
            // Gravity while in air
            e.vy += GRAVITY * dt;
            e.y += e.vy * dt;
            // Return to hidden when falling back below home
            if (e.y >= e.homeY) {
                e.y = e.homeY;
                e.vy = 0;
                e.hidden = true;
                e.jumpTimer = def.jumpInterval;
            }
        }
    },

    _groundCheck(e) {
        const bottomRow = Math.floor((e.y + e.h) / TILE);
        const leftCol = Math.floor(e.x / TILE);
        const rightCol = Math.floor((e.x + e.w - 1) / TILE);
        e.onGround = false;
        for (let col = leftCol; col <= rightCol; col++) {
            if (Tilemap.isSolid(col, bottomRow) && !Tilemap.isOneWay(col, bottomRow)) {
                e.y = bottomRow * TILE - e.h;
                e.vy = 0;
                e.onGround = true;
                break;
            }
        }
    },

    // --- Projectiles (fireballs) ---
    _updateProjectiles(dt) {
        for (const p of this.projectiles) {
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.life -= dt;

            // Stomp: player lands on top → destroy fireball
            if (Player.vy > 0 && rectsOverlap(
                Player.x, Player.y, Player.w, Player.h,
                p.x, p.y, p.w, p.h
            )) {
                const playerBottom = Player.y + Player.h;
                const fireTop = p.y;
                if (playerBottom - Player.vy * dt < fireTop + p.h * 0.4) {
                    p.life = 0;
                    Player.bounce();
                    Audio_.playSfx('stomp');
                    continue;
                }
            }

            // Hit player (side/bottom collision)
            if (!Player.invincible && rectsOverlap(
                Player.x, Player.y, Player.w, Player.h,
                p.x, p.y, p.w, p.h
            )) {
                Player.takeDamage();
                p.life = 0;
            }

            // Hit solid tile
            const col = Math.floor((p.x + p.w / 2) / TILE);
            const row = Math.floor((p.y + p.h / 2) / TILE);
            if (Tilemap.isSolid(col, row) && !Tilemap.isOneWay(col, row)) {
                p.life = 0;
            }
        }
        this.projectiles = this.projectiles.filter(p => p.life > 0);
    },

    draw(ctx) {
        // Draw enemies
        for (const e of this.list) {
            if (e.hidden) continue;
            const def = this.TYPES[e.type];
            let imgKey;

            if (!e.alive) {
                imgKey = def.deadFrame;
            } else if (e.type === 'blocker') {
                imgKey = e.activated ? 'blockerMad' : 'blockerSad';
            } else {
                imgKey = def.frames[e.animFrame];
            }

            const img = Images[imgKey];
            if (!img || !img.complete) continue;

            const dx = Math.round(e.x - Camera.x);
            const dy = Math.round(e.y - Camera.y);

            ctx.save();
            if (!e.alive) ctx.globalAlpha = 1 - e.deadTimer * 2;
            if (!e.facingRight) {
                ctx.translate(dx + e.w, dy);
                ctx.scale(-1, 1);
                ctx.drawImage(img, 0, 0, e.w, e.h);
            } else {
                ctx.drawImage(img, dx, dy, e.w, e.h);
            }
            ctx.restore();
        }

        // Draw projectiles (fireballs)
        for (const p of this.projectiles) {
            const img = Images.fireball;
            if (!img || !img.complete) continue;
            ctx.drawImage(img, Math.round(p.x - Camera.x), Math.round(p.y - Camera.y), p.w, p.h);
        }
    },
};
