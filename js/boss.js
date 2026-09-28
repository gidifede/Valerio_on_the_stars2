const Boss = {
    active: null,
    defeated: false,

    TYPES: {
        grande_slime: {
            hp: 5, w: 100, h: 56,
            frames: ['slimeWalk1', 'slimeWalk2'], deadFrame: 'slimeDead', fps: 4,
            name: 'Grande Slime',
        },
        poker_infuocato: {
            hp: 8, w: 112, h: 100,
            frames: ['pokerMad'], deadFrame: 'pokerSad', fps: 1,
            name: 'Poker Infuocato',
        },
        megatron_corrotto: {
            hp: 12, w: 96, h: 96,
            frames: ['megatron'], deadFrame: 'megatron', fps: 1,
            name: 'Megatron Corrotto',
        },
    },

    init() {
        this.active = null;
        this.defeated = false;
    },

    spawn(type, x, y) {
        const def = this.TYPES[type];
        if (!def) return;
        this.defeated = false;
        this.active = {
            type, x, y,
            w: def.w, h: def.h,
            vx: 0, vy: 0,
            hp: def.hp, maxHp: def.hp,
            alive: true,
            facingRight: false,
            animTimer: 0, animFrame: 0,
            // State machine
            state: 'idle',
            stateTimer: 1.5,
            // Phase tracking
            phase: 1,
            hitsThisPhase: 0,
            // Flash on damage
            flashTimer: 0,
            // Teleport (megatron)
            teleporting: false,
            // Shooting state
            _shotsFired: 0,
            _shotTimer: 0,
            _shotsTotal: 0,
        };
        this.defeatTimer = 0;
    },

    update(dt) {
        // Defeat timer (transition to bossVictory after delay)
        if (this.defeatTimer > 0) {
            this.defeatTimer -= dt;
            if (this.defeatTimer <= 0) {
                Game.setState('bossVictory');
            }
            return;
        }

        if (!this.active || !this.active.alive) return;
        const b = this.active;
        const def = this.TYPES[b.type];

        // Flash timer
        if (b.flashTimer > 0) b.flashTimer -= dt;

        // Animation
        b.animTimer += dt;
        if (b.animTimer >= 1 / def.fps) {
            b.animTimer -= 1 / def.fps;
            b.animFrame = (b.animFrame + 1) % def.frames.length;
        }

        // Face player
        if (b.state !== 'charge' && b.state !== 'stunned') {
            b.facingRight = Player.x > b.x;
        }

        // Type-specific AI
        switch (b.type) {
            case 'grande_slime':   this._updateSlime(b, def, dt); break;
            case 'poker_infuocato': this._updatePoker(b, def, dt); break;
            case 'megatron_corrotto': this._updateMegatron(b, def, dt); break;
        }

        // Gravity
        b.vy += GRAVITY * dt;
        b.y += b.vy * dt;
        this._groundCheck(b);

        // Stomp detection — generous top 50% zone for kid-friendly gameplay
        if (!Player.invincible && b.state !== 'dead') {
            if (rectsOverlap(Player.x, Player.y, Player.w, Player.h, b.x, b.y, b.w, b.h)) {
                const playerBottom = Player.y + Player.h;
                const bossTop = b.y;
                if (Player.vy > 0 && playerBottom < bossTop + b.h * 0.5) {
                    this.takeDamage();
                    Player.bounce();
                } else if (!Player.invincible) {
                    Player.takeDamage();
                }
            }
        }
    },

    // ---- Grande Slime AI ----
    _updateSlime(b, def, dt) {
        const jumpInterval = Math.max(1.0, 2.0 - (def.hp - b.hp) * 0.15);

        switch (b.state) {
            case 'idle':
                b.stateTimer -= dt;
                if (b.stateTimer <= 0) {
                    // Jump toward player
                    b.state = 'jump';
                    b.vy = -500;
                    b.vx = b.facingRight ? 200 : -200;
                }
                break;
            case 'jump':
                // Wait for landing
                if (b.vy >= 0 && b.y + b.h >= this._arenaFloor()) {
                    b.vx = 0;
                    b.state = 'land';
                    b.stateTimer = 0.3;
                    Camera.shake(6, 0.3);
                    // Spawn mini-slimes
                    Enemies.spawn('slime', b.x - 30, b.y, b.x - 100, b.x + b.w + 100);
                    Enemies.spawn('slime', b.x + b.w + 30, b.y, b.x - 100, b.x + b.w + 100);
                }
                break;
            case 'land':
                b.stateTimer -= dt;
                if (b.stateTimer <= 0) {
                    b.state = 'idle';
                    b.stateTimer = jumpInterval;
                }
                break;
        }
    },

    // ---- Poker Infuocato AI ----
    _updatePoker(b, def, dt) {
        const fireballCount = 3 + Math.floor((def.hp - b.hp) / 3);

        switch (b.state) {
            case 'idle':
                b.stateTimer -= dt;
                if (b.stateTimer <= 0) {
                    b.state = 'shoot';
                    b.stateTimer = 0.3 * fireballCount;
                    b._shotsFired = 0;
                    b._shotTimer = 0;
                    b._shotsTotal = fireballCount;
                }
                break;
            case 'shoot':
                b._shotTimer -= dt;
                if (b._shotTimer <= 0 && b._shotsFired < b._shotsTotal) {
                    b._shotTimer = 0.3;
                    b._shotsFired++;
                    // Spread fireballs
                    const dx = Player.x - b.x;
                    const dy = Player.y - b.y;
                    const len = Math.sqrt(dx * dx + dy * dy) || 1;
                    const spread = (b._shotsFired - Math.ceil(b._shotsTotal / 2)) * 0.2;
                    const speed = 220;
                    Enemies.projectiles.push({
                        x: b.x + b.w / 2 - 36,
                        y: b.y + b.h / 2 - 36,
                        vx: (dx / len) * speed + spread * (-dy / len) * speed * 0.5,
                        vy: (dy / len) * speed + spread * (dx / len) * speed * 0.5,
                        w: 72, h: 72, life: 3.0,
                    });
                }
                b.stateTimer -= dt;
                if (b.stateTimer <= 0) {
                    b.state = 'charge';
                    b.stateTimer = 1.2;
                    b.facingRight = Player.x > b.x;
                    b.vx = b.facingRight ? 280 : -280;
                }
                break;
            case 'charge':
                b.stateTimer -= dt;
                if (b.stateTimer <= 0) {
                    b.vx = 0;
                    b.state = 'stunned';
                    b.stateTimer = 2.0;
                }
                break;
            case 'stunned':
                b.stateTimer -= dt;
                if (b.stateTimer <= 0) {
                    b.state = 'idle';
                    b.stateTimer = 1.0;
                }
                break;
        }
    },

    // ---- Megatron Corrotto AI ----
    _updateMegatron(b, def, dt) {
        // Phase: 1 (HP 12-9), 2 (HP 8-5), 3 (HP 4-1)
        b.phase = b.hp > 8 ? 1 : b.hp > 4 ? 2 : 3;

        switch (b.state) {
            case 'idle':
                b.stateTimer -= dt;
                if (b.stateTimer <= 0) {
                    if (b.phase >= 3 && Math.random() < 0.4) {
                        // Teleport
                        b.state = 'teleport';
                        b.stateTimer = 0.5;
                        b.teleporting = true;
                    } else if (b.phase >= 2 && Math.random() < 0.5) {
                        b.state = 'charge';
                        b.stateTimer = 1.0;
                        b.facingRight = Player.x > b.x;
                        b.vx = b.facingRight ? 250 : -250;
                    } else {
                        b.state = 'shoot';
                        b.stateTimer = b.phase >= 3 ? 0.8 : 1.5;
                        b._shotsFired = 0;
                        b._shotTimer = 0;
                        b._shotsTotal = b.phase >= 3 ? 4 : 2;
                    }
                }
                break;
            case 'shoot':
                b._shotTimer -= dt;
                if (b._shotTimer <= 0 && b._shotsFired < b._shotsTotal) {
                    b._shotTimer = 0.4;
                    b._shotsFired++;
                    const dx = Player.x - b.x;
                    const dy = Player.y - b.y;
                    const len = Math.sqrt(dx * dx + dy * dy) || 1;
                    const speed = 200;
                    Enemies.projectiles.push({
                        x: b.x + b.w / 2 - 36,
                        y: b.y + b.h / 2 - 36,
                        vx: (dx / len) * speed,
                        vy: (dy / len) * speed,
                        w: 72, h: 72, life: 3.0,
                    });
                }
                b.stateTimer -= dt;
                if (b.stateTimer <= 0) {
                    b.state = 'idle';
                    b.stateTimer = 1.5;
                }
                break;
            case 'charge':
                b.stateTimer -= dt;
                if (b.stateTimer <= 0) {
                    b.vx = 0;
                    b.state = 'stunned';
                    b.stateTimer = 1.5;
                }
                break;
            case 'stunned':
                b.stateTimer -= dt;
                if (b.stateTimer <= 0) {
                    b.state = 'idle';
                    b.stateTimer = 1.0;
                }
                break;
            case 'teleport':
                b.stateTimer -= dt;
                if (b.stateTimer <= 0) {
                    // Move to random position in arena
                    b.x = 200 + Math.random() * (Tilemap.worldWidth() - 400 - b.w);
                    b.y = this._arenaFloor() - b.h - 100;
                    b.vy = 0;
                    b.teleporting = false;
                    b.state = 'shoot';
                    b.stateTimer = 0.8;
                    b._shotsFired = 0;
                    b._shotTimer = 0;
                    b._shotsTotal = 3;
                }
                break;
        }
    },

    _arenaFloor() {
        // All boss arenas have ground at row 9
        return 9 * TILE;
    },

    _groundCheck(b) {
        const bottomRow = Math.floor((b.y + b.h) / TILE);
        const leftCol = Math.floor(b.x / TILE);
        const rightCol = Math.floor((b.x + b.w - 1) / TILE);
        for (let col = leftCol; col <= rightCol; col++) {
            if (Tilemap.isSolid(col, bottomRow)) {
                b.y = bottomRow * TILE - b.h;
                b.vy = 0;
                break;
            }
        }
        // Clamp to arena walls
        if (b.x < TILE) b.x = TILE;
        if (b.x + b.w > Tilemap.worldWidth() - TILE) b.x = Tilemap.worldWidth() - TILE - b.w;
    },

    takeDamage() {
        if (!this.active || !this.active.alive) return;
        const b = this.active;

        b.hp--;
        b.flashTimer = 0.2;
        Camera.shake(8, 0.3);
        Particles.emit(b.x + b.w / 2, b.y + b.h / 2, 12, '#ff4444', 200);
        Audio_.playSfx('hit');

        if (b.hp <= 0) {
            this.defeat();
        }
    },

    defeat() {
        if (!this.active) return;
        const b = this.active;
        b.alive = false;
        this.defeated = true;

        Camera.shake(15, 0.8);
        Particles.emit(b.x + b.w / 2, b.y + b.h / 2, 30, '#ff8800', 300);
        Particles.emit(b.x + b.w / 2, b.y + b.h / 2, 20, '#ffff00', 250);
        Audio_.playSfx('explosion');

        Player.score += b.maxHp * 500;

        Game.bossComplete();
        this.defeatTimer = 1.5;
    },

    draw(ctx) {
        if (!this.active) return;
        const b = this.active;
        const def = this.TYPES[b.type];

        if (!b.alive) return;
        if (b.teleporting) return;

        const imgKey = def.frames[b.animFrame];
        const img = Images[imgKey];
        if (!img || !img.complete) return;

        const dx = Math.round(b.x - Camera.x);
        const dy = Math.round(b.y - Camera.y);

        ctx.save();

        // Damage flash
        if (b.flashTimer > 0) {
            ctx.globalAlpha = 0.5 + Math.sin(b.flashTimer * 40) * 0.5;
        }

        // Stunned visual: pulsing alpha
        if (b.state === 'stunned') {
            ctx.globalAlpha = 0.5 + Math.sin(Date.now() * 0.01) * 0.3;
        }

        // Red tint for Megatron Corrotto
        if (b.type === 'megatron_corrotto') {
            ctx.shadowColor = '#ff0000';
            ctx.shadowBlur = 10 + Math.sin(Date.now() * 0.005) * 5;
        }

        if (!b.facingRight) {
            ctx.translate(dx + b.w, dy);
            ctx.scale(-1, 1);
            ctx.drawImage(img, 0, 0, b.w, b.h);
        } else {
            ctx.drawImage(img, dx, dy, b.w, b.h);
        }

        ctx.restore();
    },

    drawHUD(ctx) {
        if (!this.active || !this.active.alive) return;
        const b = this.active;
        const def = this.TYPES[b.type];

        // Boss name
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 16px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(def.name, CANVAS_W / 2, 60);

        // Health bar
        const barW = 200, barH = 12;
        const barX = (CANVAS_W - barW) / 2;
        const barY = 68;
        const hpRatio = b.hp / b.maxHp;

        // Border
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(barX, barY, barW, barH);

        // Fill
        ctx.fillStyle = hpRatio > 0.5 ? '#44ff44' : hpRatio > 0.25 ? '#ffaa00' : '#ff3333';
        ctx.fillRect(barX + 1, barY + 1, (barW - 2) * hpRatio, barH - 2);
    },
};
