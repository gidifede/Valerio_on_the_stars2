const UI = {
    titlePulse: 0,
    levelIntroTimer: 0,
    levelIntroText: '',

    drawTitle(ctx) {
        this.titlePulse += 0.03;

        // Background
        ctx.fillStyle = '#0a0a2e';
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

        // Stars background
        for (let i = 0; i < 60; i++) {
            const sx = (i * 137 + 50) % CANVAS_W;
            const sy = (i * 97 + 30) % CANVAS_H;
            const brightness = 150 + Math.sin(this.titlePulse + i) * 50;
            ctx.fillStyle = `rgb(${brightness},${brightness},${brightness + 20})`;
            ctx.fillRect(sx, sy, 2, 2);
        }

        // Title
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 52px monospace';
        ctx.fillText('VALERIO', CANVAS_W / 2, 200);
        ctx.fillStyle = '#87CEEB';
        ctx.font = 'bold 36px monospace';
        ctx.fillText('ON THE STARS', CANVAS_W / 2, 250);

        // Valerio portrait
        const vImg = Images.valerioPortrait;
        if (vImg && vImg.complete) {
            ctx.drawImage(vImg, CANVAS_W / 2 - 64, 275, 128, 128);
        }

        // Pulsing prompt
        const alpha = 0.5 + Math.sin(this.titlePulse * 3) * 0.5;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#fff';
        ctx.font = '22px monospace';
        ctx.fillText('PREMI INVIO', CANVAS_W / 2, 440);
        ctx.globalAlpha = 1;

        // High score
        if (Game.highScore > 0) {
            ctx.fillStyle = '#aaa';
            ctx.font = '18px monospace';
            ctx.fillText(`Record: ${Game.highScore}`, CANVAS_W / 2, 490);
        }

        // Controls
        ctx.fillStyle = '#888';
        ctx.font = '16px monospace';
        ctx.fillText('← → / A D  Muovi    ↑ / W / SPAZIO  Salta    P  Pausa', CANVAS_W / 2, 520);
    },

    levelIntroWorld: '1',

    startLevelIntro(text, worldNum) {
        this.levelIntroText = text;
        this.levelIntroWorld = worldNum || '1';
        this.levelIntroTimer = 2.0;
    },

    drawLevelIntro(ctx, dt) {
        this.levelIntroTimer -= dt;

        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

        const worldNames = { '1': 'FORESTA INCANTATA', '2': 'CASTELLO OSCURO', '3': 'MONDO LEGO SPAZIALE' };
        const worldColors = { '1': '#4CAF50', '2': '#9C27B0', '3': '#2196F3' };

        ctx.textAlign = 'center';
        ctx.fillStyle = worldColors[this.levelIntroWorld] || '#FFD700';
        ctx.font = 'bold 36px monospace';
        ctx.fillText(worldNames[this.levelIntroWorld] || 'MONDO ' + this.levelIntroWorld,
                     CANVAS_W / 2, CANVAS_H / 2 - 30);

        ctx.fillStyle = '#fff';
        ctx.font = '24px monospace';
        ctx.fillText(this.levelIntroText, CANVAS_W / 2, CANVAS_H / 2 + 20);

        return this.levelIntroTimer <= 0;
    },

    drawPause(ctx) {
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

        ctx.textAlign = 'center';
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 44px monospace';
        ctx.fillText('PAUSA', CANVAS_W / 2, CANVAS_H / 2 - 20);

        ctx.font = '20px monospace';
        ctx.fillStyle = '#aaa';
        ctx.fillText('Premi P per continuare', CANVAS_W / 2, CANVAS_H / 2 + 30);
    },

    drawGameOver(ctx) {
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

        ctx.textAlign = 'center';
        ctx.fillStyle = '#FF4444';
        ctx.font = 'bold 48px monospace';
        ctx.fillText('GAME OVER', CANVAS_W / 2, CANVAS_H / 2 - 50);

        ctx.fillStyle = '#FFD700';
        ctx.font = '24px monospace';
        ctx.fillText(`Punteggio: ${Player.score}`, CANVAS_W / 2, CANVAS_H / 2 + 10);

        ctx.fillStyle = '#fff';
        ctx.font = '20px monospace';
        ctx.fillText('INVIO = Riprova    ESC = Mappa', CANVAS_W / 2, CANVAS_H / 2 + 60);
    },

    drawLevelComplete(ctx) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

        ctx.textAlign = 'center';
        ctx.fillStyle = '#4CAF50';
        ctx.font = 'bold 44px monospace';
        ctx.fillText('LIVELLO COMPLETATO!', CANVAS_W / 2, CANVAS_H / 2 - 40);

        ctx.fillStyle = '#FFD700';
        ctx.font = '28px monospace';
        ctx.fillText(`★ ${Player.starsCollected}/${Player.starsTotal}`, CANVAS_W / 2, CANVAS_H / 2 + 10);

        ctx.fillStyle = '#fff';
        ctx.font = '24px monospace';
        ctx.fillText(`Punteggio: ${Player.score}`, CANVAS_W / 2, CANVAS_H / 2 + 50);

        const alpha = 0.5 + Math.sin(Date.now() / 300) * 0.5;
        ctx.globalAlpha = alpha;
        ctx.fillText('PREMI INVIO', CANVAS_W / 2, CANVAS_H / 2 + 100);
        ctx.globalAlpha = 1;
    },

    drawBossIntro(ctx, timer) {
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

        const worldNum = Game.currentLevel.charAt(0);
        const worldColors = { '1': '#4CAF50', '2': '#9C27B0', '3': '#2196F3' };

        ctx.textAlign = 'center';

        ctx.fillStyle = worldColors[worldNum] || '#FFD700';
        ctx.font = 'bold 28px monospace';
        ctx.fillText('GUARDIANO DEL MONDO ' + worldNum, CANVAS_W / 2, CANVAS_H / 2 - 60);

        const data = LEVELS[Game.currentLevel];
        if (data) {
            ctx.fillStyle = '#FF4444';
            ctx.font = 'bold 44px monospace';
            const scale = 1 + Math.sin(timer * 5) * 0.05;
            ctx.save();
            ctx.translate(CANVAS_W / 2, CANVAS_H / 2);
            ctx.scale(scale, scale);
            ctx.fillText(data.name.toUpperCase(), 0, 0);
            ctx.restore();
        }

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 60px monospace';
        ctx.fillText(Math.ceil(timer), CANVAS_W / 2, CANVAS_H / 2 + 80);
    },

    drawBossVictory(ctx) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

        ctx.textAlign = 'center';

        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 48px monospace';
        ctx.fillText('GUARDIANO SCONFITTO!', CANVAS_W / 2, CANVAS_H / 2 - 50);

        ctx.fillStyle = '#fff';
        ctx.font = '28px monospace';
        ctx.fillText(`Punteggio: ${Player.score}`, CANVAS_W / 2, CANVAS_H / 2 + 10);

        if (Game.highScore > 0) {
            ctx.fillStyle = '#aaa';
            ctx.font = '20px monospace';
            ctx.fillText(`Record: ${Game.highScore}`, CANVAS_W / 2, CANVAS_H / 2 + 45);
        }

        const alpha = 0.5 + Math.sin(Date.now() / 300) * 0.5;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#fff';
        ctx.font = '22px monospace';
        ctx.fillText('PREMI INVIO', CANVAS_W / 2, CANVAS_H / 2 + 100);
        ctx.globalAlpha = 1;
    },

    victoryTimer: 0,

    drawVictory(ctx) {
        this.victoryTimer += 0.02;

        ctx.fillStyle = '#0a0a2e';
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

        for (let i = 0; i < 100; i++) {
            const sx = (i * 137 + 50) % CANVAS_W;
            const sy = (i * 97 + 30) % CANVAS_H;
            const brightness = 150 + Math.sin(this.victoryTimer * 2 + i) * 100;
            ctx.fillStyle = `rgb(${brightness},${brightness},${brightness + 30})`;
            ctx.fillRect(sx, sy, 2, 2);
        }

        ctx.textAlign = 'center';

        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 56px monospace';
        const scale = 1 + Math.sin(this.victoryTimer * 3) * 0.03;
        ctx.save();
        ctx.translate(CANVAS_W / 2, 120);
        ctx.scale(scale, scale);
        ctx.fillText('VITTORIA!', 0, 0);
        ctx.restore();

        ctx.fillStyle = '#87CEEB';
        ctx.font = 'bold 28px monospace';
        ctx.fillText('HAI SALVATO MEGATRON!', CANVAS_W / 2, 180);

        const mImg = Images.megatron;
        if (mImg && mImg.complete) {
            ctx.drawImage(mImg, CANVAS_W / 2 - 48, 210, 96, 96);
        }

        let totalStars = 0;
        for (const id of WorldMap.allLevels) {
            totalStars += (WorldMap.progress[id] && WorldMap.progress[id].stars) || 0;
        }

        ctx.fillStyle = '#FFD700';
        ctx.font = '24px monospace';
        ctx.fillText(`Stelle: ${totalStars}/18`, CANVAS_W / 2, 350);

        ctx.fillStyle = '#fff';
        ctx.fillText(`Punteggio: ${Player.score}`, CANVAS_W / 2, 390);

        ctx.fillStyle = '#aaa';
        ctx.font = '20px monospace';
        ctx.fillText(`Record: ${Game.highScore}`, CANVAS_W / 2, 425);

        ctx.fillStyle = '#FF69B4';
        ctx.font = 'bold 32px monospace';
        ctx.fillText('GRAZIE VALERIO!', CANVAS_W / 2, 490);

        const alpha2 = 0.5 + Math.sin(this.victoryTimer * 4) * 0.5;
        ctx.globalAlpha = alpha2;
        ctx.fillStyle = '#fff';
        ctx.font = '22px monospace';
        ctx.fillText('PREMI INVIO', CANVAS_W / 2, 560);
        ctx.globalAlpha = 1;
    },
};
