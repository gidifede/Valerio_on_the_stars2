const Hazards = {
    trampolines: [],

    init() {
        this.trampolines = [];
    },

    spawnTrampoline(x, y) {
        this.trampolines.push({
            x, y, w: TILE, h: TILE,
            animTimer: 0,
            bouncing: false,
        });
    },

    update(dt) {
        for (const t of this.trampolines) {
            // Bounce animation cooldown
            if (t.bouncing) {
                t.animTimer -= dt;
                if (t.animTimer <= 0) t.bouncing = false;
            }

            // Check player landing on trampoline
            if (Player.vy > 0 && rectsOverlap(
                Player.x, Player.y, Player.w, Player.h,
                t.x, t.y, t.w, t.h
            )) {
                const playerBottom = Player.y + Player.h;
                const trampTop = t.y;
                if (playerBottom - Player.vy * MAX_DT < trampTop + 10) {
                    Player.vy = -750;   // super bounce
                    Player.onGround = false;
                    t.bouncing = true;
                    t.animTimer = 0.3;
                    Audio_.playSfx('powerup');
                }
            }
        }
    },

    draw(ctx) {
        for (const t of this.trampolines) {
            const imgKey = t.bouncing ? 'springboardDown' : 'springboardUp';
            const img = Images[imgKey];
            if (!img || !img.complete) continue;
            ctx.drawImage(img,
                Math.round(t.x - Camera.x),
                Math.round(t.y - Camera.y),
                t.w, t.h);
        }
    },
};
