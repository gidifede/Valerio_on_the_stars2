const Game = {
    state: 'loading',  // loading, title, worldMap, levelIntro, playing, paused, gameover, levelComplete, bossIntro, bossFight, bossVictory, victory
    currentLevel: '1-1',
    highScore: 0,
    bossIntroTimer: 0,

    setState(newState) {
        this.state = newState;
    },

    start() {
        this.highScore = parseInt(localStorage.getItem('valeriostars_highscore') || '0', 10);
        this.setState('title');
        Audio_.playMusic('title');
    },

    startLevel() {
        loadLevel(this.currentLevel);
        const data = LEVELS[this.currentLevel];
        const worldNum = this.currentLevel.charAt(0);

        if (data.isBoss) {
            this.bossIntroTimer = 3.0;
            this.setState('bossIntro');
        } else {
            UI.startLevelIntro(data.name, worldNum);
            this.setState('levelIntro');
        }
    },

    levelComplete() {
        this.setState('levelComplete');
        Audio_.stopMusic();
        Audio_.playSfx('powerup');
        WorldMap.completeLevel(this.currentLevel, Player.starsCollected);
        this._updateHighScore();
    },

    bossComplete() {
        WorldMap.completeLevel(this.currentLevel, 0);
        this._updateHighScore();
        Audio_.stopMusic();
    },

    restartLevel() {
        this.startLevel();
    },

    _updateHighScore() {
        if (Player.score > this.highScore) {
            this.highScore = Player.score;
            localStorage.setItem('valeriostars_highscore', String(this.highScore));
        }
    },

    update(dt) {
        // Update transitions
        if (typeof Transition !== 'undefined') {
            Transition.update(dt);
            if (Transition.isActive()) return;
        }

        switch (this.state) {
            case 'title':
                if (Input.enter()) {
                    Audio_.stopMusic();
                    WorldMap.init();
                    this.setState('worldMap');
                }
                break;

            case 'worldMap':
                WorldMap.update(dt);
                break;

            case 'levelIntro':
                break;

            case 'playing':
                if (Input.pause()) {
                    this.setState('paused');
                    break;
                }

                Player.update(dt);
                Camera.follow(Player.centerX(), Player.centerY(), dt);
                Enemies.update(dt);
                Collectibles.update(dt);
                LevelObjects.update(dt);
                Hazards.update(dt);
                Platforms.update(dt);
                Powerups.update(dt);
                if (typeof Particles !== 'undefined') Particles.update(dt);
                break;

            case 'paused':
                if (Input.pause()) {
                    const data = LEVELS[this.currentLevel];
                    this.setState(data && data.isBoss ? 'bossFight' : 'playing');
                }
                break;

            case 'gameover':
                if (Input.enter()) {
                    this.restartLevel();
                }
                if (Input.escape()) {
                    this.setState('worldMap');
                }
                break;

            case 'levelComplete':
                if (Input.enter()) {
                    this.setState('worldMap');
                }
                break;

            case 'bossIntro':
                this.bossIntroTimer -= dt;
                if (this.bossIntroTimer <= 0) {
                    this.setState('bossFight');
                }
                break;

            case 'bossFight':
                if (Input.pause()) {
                    this.setState('paused');
                    break;
                }
                Player.update(dt);
                Camera.follow(Player.centerX(), Player.centerY(), dt);
                if (typeof Boss !== 'undefined') Boss.update(dt);
                Enemies.update(dt);
                if (typeof Particles !== 'undefined') Particles.update(dt);
                break;

            case 'bossVictory':
                if (typeof Particles !== 'undefined') Particles.update(dt);
                if (Input.enter()) {
                    if (WorldMap.allBossesDefeated()) {
                        this.setState('victory');
                        Audio_.playMusic('ending');
                    } else {
                        this.setState('worldMap');
                    }
                }
                break;

            case 'victory':
                if (typeof Particles !== 'undefined') Particles.update(dt);
                if (Input.enter()) {
                    Audio_.stopMusic();
                    this.setState('title');
                    Audio_.playMusic('title');
                }
                break;
        }
    },

    draw(ctx, dt) {
        ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

        switch (this.state) {
            case 'loading':
                ctx.fillStyle = '#111';
                ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
                ctx.fillStyle = '#fff';
                ctx.font = '24px monospace';
                ctx.textAlign = 'center';
                ctx.fillText('Caricamento...', CANVAS_W / 2, CANVAS_H / 2);
                break;

            case 'title':
                UI.drawTitle(ctx);
                break;

            case 'worldMap':
                WorldMap.draw(ctx);
                break;

            case 'levelIntro':
                this.drawGameWorld(ctx);
                if (UI.drawLevelIntro(ctx, dt)) {
                    this.setState('playing');
                }
                break;

            case 'playing':
                this.drawGameWorld(ctx);
                if (typeof Particles !== 'undefined') Particles.draw(ctx);
                HUD.draw(ctx);
                break;

            case 'paused':
                this.drawGameWorld(ctx);
                if (typeof Particles !== 'undefined') Particles.draw(ctx);
                HUD.draw(ctx);
                UI.drawPause(ctx);
                break;

            case 'gameover':
                this.drawGameWorld(ctx);
                UI.drawGameOver(ctx);
                break;

            case 'levelComplete':
                this.drawGameWorld(ctx);
                UI.drawLevelComplete(ctx);
                break;

            case 'bossIntro':
                this.drawGameWorld(ctx);
                if (typeof Boss !== 'undefined') Boss.draw(ctx);
                UI.drawBossIntro(ctx, this.bossIntroTimer);
                break;

            case 'bossFight':
                this.drawGameWorld(ctx);
                if (typeof Boss !== 'undefined') {
                    Boss.draw(ctx);
                    Boss.drawHUD(ctx);
                }
                if (typeof Particles !== 'undefined') Particles.draw(ctx);
                HUD.draw(ctx);
                break;

            case 'bossVictory':
                this.drawGameWorld(ctx);
                if (typeof Particles !== 'undefined') Particles.draw(ctx);
                UI.drawBossVictory(ctx);
                break;

            case 'victory':
                UI.drawVictory(ctx);
                break;
        }

        // Draw transition overlay on top
        if (typeof Transition !== 'undefined') Transition.draw(ctx);
    },

    drawGameWorld(ctx) {
        Background.draw(ctx);
        Tilemap.draw(ctx);
        Platforms.draw(ctx);
        LevelObjects.draw(ctx);
        Hazards.draw(ctx);
        Collectibles.draw(ctx);
        Powerups.draw(ctx);
        Enemies.draw(ctx);
        Player.draw(ctx);
    },
};
