const Powerups = {
    items: [],         // spawned in level
    active: null,      // { type, timer } or null

    TYPES: {
        magnete_lego:    { duration: 10, imgKey: 'magnete_lego' },
        salto_stellare:  { duration: -1, imgKey: 'salto_stellare' },   // -1 = until damage
        scudo_robotico:  { duration: 5,  imgKey: 'scudo_robotico' },
        gravita_ridotta: { duration: 8,  imgKey: 'gravita_ridotta' },
    },

    init() {
        this.items = [];
        this.active = null;
    },

    spawn(type, x, y) {
        this.items.push({
            type, x, y,
            w: 40, h: 40,
            vy: -100,          // gentle pop up from ? block
            floatY: y,         // target float position (set when pop finishes)
            rising: true,      // true during initial pop-up
            bobTimer: Math.random() * Math.PI * 2,
            collected: false,
        });
    },

    update(dt) {
        // Update spawned items
        for (const item of this.items) {
            if (item.collected) continue;

            // Pop up then float in place (never falls off)
            if (item.rising) {
                item.vy += GRAVITY * 0.5 * dt; // gentle deceleration
                item.y += item.vy * dt;
                if (item.vy >= 0) {
                    // Reached peak — lock float position
                    item.rising = false;
                    item.floatY = item.y;
                }
            } else {
                item.bobTimer += dt * 3;
            }

            // Player pickup
            const drawY = item.rising ? item.y : item.floatY + Math.sin(item.bobTimer) * 4;
            if (rectsOverlap(
                Player.x, Player.y, Player.w, Player.h,
                item.x, drawY, item.w, item.h
            )) {
                item.collected = true;
                this.activate(item.type);
                Audio_.playSfx('powerup');
            }
        }
        this.items = this.items.filter(i => !i.collected);

        // Update active powerup timer
        if (this.active) {
            if (this.active.timer > 0) {
                this.active.timer -= dt;
                if (this.active.timer <= 0) {
                    this.deactivate();
                }
            }
            // timer === -1 means "until damage" (salto_stellare)
        }
    },

    activate(type) {
        const def = this.TYPES[type];
        if (!def) return;

        // Deactivate previous if any
        this.deactivate();

        this.active = { type, timer: def.duration };

        // Apply immediate effects
        if (type === 'scudo_robotico') {
            Player.invincible = true;
            Player.invTimer = def.duration;
        }
        if (type === 'salto_stellare') {
            Player.maxJumps = 2;
        }
    },

    deactivate() {
        if (!this.active) return;
        const type = this.active.type;

        // Remove effects
        if (type === 'scudo_robotico') {
            Player.invincible = false;
            Player.invTimer = 0;
        }
        if (type === 'salto_stellare') {
            Player.maxJumps = 1;
        }

        this.active = null;
    },

    // Called when player takes damage (removes salto_stellare)
    onPlayerDamage() {
        if (this.active && this.active.type === 'salto_stellare') {
            this.deactivate();
        }
    },

    isActive(type) {
        return this.active && this.active.type === type;
    },

    draw(ctx) {
        for (const item of this.items) {
            if (item.collected) continue;
            const def = this.TYPES[item.type];
            const img = Images[def.imgKey];
            if (!img || !img.complete) continue;

            const bobY = item.rising ? 0 : Math.sin(item.bobTimer) * 4;
            // Draw first frame of powerup spritesheet (32x32 from 128x32)
            const sx = 0, sy = 0;
            const posY = item.rising ? item.y : item.floatY;
            ctx.drawImage(img,
                sx, sy, POWERUP_ANIM.frameW, POWERUP_ANIM.frameH,
                Math.round(item.x - Camera.x),
                Math.round(posY + bobY - Camera.y),
                item.w, item.h);
        }
    },
};
