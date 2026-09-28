const Platforms = {
    list: [],

    init() {
        this.list = [];
    },

    spawn(x, y, endX, endY, speed) {
        this.list.push({
            x, y,
            w: TILE * 2,    // 2 tiles wide
            h: 30,
            startX: x, startY: y,
            endX, endY,
            speed: speed || 50,
            t: 0,           // 0→1 interpolation
            direction: 1,   // 1=forward, -1=back
            prevX: x, prevY: y,
        });
    },

    update(dt) {
        for (const p of this.list) {
            p.prevX = p.x;
            p.prevY = p.y;

            // Move along path
            p.t += p.direction * p.speed * dt / Math.max(1,
                Math.sqrt((p.endX - p.startX) ** 2 + (p.endY - p.startY) ** 2));

            if (p.t >= 1) { p.t = 1; p.direction = -1; }
            if (p.t <= 0) { p.t = 0; p.direction = 1; }

            p.x = p.startX + (p.endX - p.startX) * p.t;
            p.y = p.startY + (p.endY - p.startY) * p.t;

            const deltaX = p.x - p.prevX;
            const deltaY = p.y - p.prevY;

            // Carry player if standing on platform
            const playerBottom = Player.y + Player.h;
            const platTop = p.y;
            if (Player.vy >= 0 &&
                playerBottom >= platTop - 2 && playerBottom <= platTop + 8 &&
                Player.x + Player.w > p.x && Player.x < p.x + p.w
            ) {
                Player.x += deltaX;
                Player.y = platTop - Player.h;
                Player.vy = 0;
                Player.onGround = true;
            }
        }
    },

    draw(ctx) {
        for (const p of this.list) {
            const img = Images.weightChained;
            if (img && img.complete) {
                const dx = Math.round(p.x - Camera.x);
                const dy = Math.round(p.y - Camera.y);
                ctx.drawImage(img, dx, dy, p.w, p.h);
            } else {
                // Fallback: draw colored rectangle
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(
                    Math.round(p.x - Camera.x),
                    Math.round(p.y - Camera.y),
                    p.w, p.h);
            }
        }
    },
};
