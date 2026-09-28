const HUD = {
    draw(ctx) {
        ctx.save();

        // === Lives (hearts) - top left (up to 5) ===
        for (let i = 0; i < 5; i++) {
            const key = i < Player.lives ? 'heartFull' : 'heartEmpty';
            const img = Images[key];
            if (img && img.complete) {
                ctx.drawImage(img, 15 + i * 40, 12, 34, 30);
            }
        }

        // === Score - top center ===
        this.drawNumber(ctx, Player.score, CANVAS_W / 2, 15);

        // === Stars - top right ===
        const starImg = Images.energyStarGold;
        if (starImg && starImg.complete) {
            drawFrame(ctx, starImg, STAR_ANIM.frameW, STAR_ANIM.frameH, 0,
                      CANVAS_W - 130, 12, false);
        }
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 24px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`${Player.starsCollected}/${Player.starsTotal}`,
                     CANVAS_W - 95, 38);

        // === LEGO counter - below hearts ===
        if (Player.legoCount > 0 || (typeof Powerups !== 'undefined' && Powerups.isActive('magnete_lego'))) {
            const legoImg = Images.legoBrick_red;
            if (legoImg && legoImg.complete) {
                ctx.drawImage(legoImg, 15, 50, 24, 24);
            }
            ctx.fillStyle = '#FF9800';
            ctx.font = 'bold 18px monospace';
            ctx.textAlign = 'left';
            ctx.fillText(`${Player.legoCount}/50`, 44, 68);
        }

        // === Active power-up indicator - below LEGO ===
        if (typeof Powerups !== 'undefined' && Powerups.active) {
            const pu = Powerups.active;
            const def = Powerups.TYPES[pu.type];
            const puImg = Images[def.imgKey];
            const puY = Player.legoCount > 0 ? 82 : 50;

            if (puImg && puImg.complete) {
                // Icon (first frame)
                ctx.drawImage(puImg, 0, 0, 32, 32, 15, puY, 28, 28);
            }

            // Timer bar
            if (pu.timer > 0) {
                const maxDur = Powerups.TYPES[pu.type].duration;
                const frac = pu.timer / maxDur;
                ctx.fillStyle = '#333';
                ctx.fillRect(48, puY + 8, 80, 12);
                ctx.fillStyle = frac > 0.3 ? '#00E676' : '#FF5722';
                ctx.fillRect(48, puY + 8, 80 * frac, 12);
                ctx.strokeStyle = '#fff';
                ctx.strokeRect(48, puY + 8, 80, 12);
            } else {
                // "Until damage" indicator
                ctx.fillStyle = '#00E676';
                ctx.font = '12px monospace';
                ctx.textAlign = 'left';
                ctx.fillText('ATTIVO', 48, puY + 20);
            }
        }

        ctx.restore();
    },

    drawNumber(ctx, number, centerX, y) {
        const str = String(number).padStart(6, '0');
        const digitW = 22;
        const totalW = str.length * digitW;
        let x = centerX - totalW / 2;

        for (const ch of str) {
            const img = Images['hud_' + ch];
            if (img && img.complete) {
                ctx.drawImage(img, x, y, 20, 26);
            }
            x += digitW;
        }
    },
};
