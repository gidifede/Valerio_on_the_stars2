// ========== BOOT ==========
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

Input.init();
Audio_.init();

// Load assets then start
loadAssets(
    (loaded, total) => {
        // Draw loading progress
        ctx.fillStyle = '#111';
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        ctx.fillStyle = '#fff';
        ctx.font = '20px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`Caricamento... ${loaded}/${total}`, CANVAS_W / 2, CANVAS_H / 2);
        // Progress bar
        const barW = 300;
        const barH = 20;
        const bx = (CANVAS_W - barW) / 2;
        const by = CANVAS_H / 2 + 20;
        ctx.strokeStyle = '#555';
        ctx.strokeRect(bx, by, barW, barH);
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(bx, by, barW * (loaded / total), barH);
    },
    () => {
        Game.start();
        requestAnimationFrame(gameLoop);
    }
);

// ========== GAME LOOP ==========
let lastTime = 0;

function gameLoop(timestamp) {
    const dt = Math.min((timestamp - lastTime) / 1000, MAX_DT);
    lastTime = timestamp;

    Game.update(dt);
    Game.draw(ctx, dt);

    Input.clearJustPressed();
    requestAnimationFrame(gameLoop);
}
