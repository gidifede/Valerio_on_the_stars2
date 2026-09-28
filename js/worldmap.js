const WorldMap = {
    worlds: [
        { name: 'Foresta Incantata', levels: ['1-1', '1-2'], boss: '1-B', color: '#4CAF50', icon: 'G' },
        { name: 'Castello Oscuro',   levels: ['2-1', '2-2'], boss: '2-B', color: '#9C27B0', icon: 'A' },
        { name: 'Mondo LEGO Spaziale', levels: ['3-1', '3-2'], boss: '3-B', color: '#2196F3', icon: 'O' },
    ],

    allLevels: ['1-1', '1-2', '1-B', '2-1', '2-2', '2-B', '3-1', '3-2', '3-B'],
    progress: {},       // { '1-1': { completed: false, stars: 0 } }
    selectedIndex: 0,
    pulseTimer: 0,
    cheatBuffer: '',
    cheatUnlocked: false,

    init() {
        this.selectedIndex = 0;
        this.pulseTimer = 0;
        this.cheatBuffer = '';
        for (const id of this.allLevels) {
            if (!this.progress[id]) {
                this.progress[id] = { completed: false, stars: 0 };
            }
        }
    },

    isUnlocked(levelId) {
        if (this.cheatUnlocked) return true;
        const idx = this.allLevels.indexOf(levelId);
        if (idx === 0) return true; // 1-1 always unlocked

        // Boss levels require both world levels completed + all 6 stars
        if (levelId.endsWith('-B')) {
            const world = this.worlds.find(w => w.boss === levelId);
            if (!world) return false;
            let totalStars = 0;
            for (const lid of world.levels) {
                if (!this.progress[lid] || !this.progress[lid].completed) return false;
                totalStars += this.progress[lid].stars || 0;
            }
            return totalStars >= 6; // All stars in both levels
        }

        const prev = this.allLevels[idx - 1];
        return this.progress[prev] && this.progress[prev].completed;
    },

    completeLevel(levelId, stars) {
        if (!this.progress[levelId]) this.progress[levelId] = {};
        this.progress[levelId].completed = true;
        this.progress[levelId].stars = Math.max(this.progress[levelId].stars || 0, stars);
    },

    getSelectedLevelId() {
        return this.allLevels[this.selectedIndex];
    },

    allBossesDefeated() {
        return this.worlds.every(w =>
            this.progress[w.boss] && this.progress[w.boss].completed
        );
    },

    update(dt) {
        this.pulseTimer += dt;

        // Cheat code: type "valerio" to unlock all levels
        for (const ch of 'abcdefghijklmnopqrstuvwxyz') {
            if (Input.wasPressed('Key' + ch.toUpperCase())) {
                this.cheatBuffer += ch;
                if (this.cheatBuffer.length > 7) this.cheatBuffer = this.cheatBuffer.slice(-7);
                if (this.cheatBuffer === 'valerio') {
                    this.cheatUnlocked = true;
                    this.cheatBuffer = '';
                    Audio_.playSfx('star');
                }
                break;
            }
        }

        if (Input.consumePress('ArrowRight') || Input.consumePress('KeyD')) {
            this.selectedIndex = Math.min(this.selectedIndex + 1, this.allLevels.length - 1);
        }
        if (Input.consumePress('ArrowLeft') || Input.consumePress('KeyA')) {
            this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
        }

        if (Input.consumePress('Enter')) {
            const id = this.getSelectedLevelId();
            if (this.isUnlocked(id)) {
                Game.currentLevel = id;
                Game.startLevel();
                return;
            }
        }

        if (Input.consumePress('Escape')) {
            Game.start();
        }
    },

    draw(ctx) {
        // Dark background
        ctx.fillStyle = '#0a0a2e';
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

        // Stars background
        for (let i = 0; i < 60; i++) {
            const sx = (i * 137 + 50) % CANVAS_W;
            const sy = (i * 97 + 30) % CANVAS_H;
            const brightness = 150 + Math.sin(this.pulseTimer * 2 + i) * 50;
            ctx.fillStyle = `rgb(${brightness},${brightness},${brightness + 20})`;
            ctx.fillRect(sx, sy, 2, 2);
        }

        // Title
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 36px monospace';
        ctx.fillText('SELEZIONA LIVELLO', CANVAS_W / 2, 60);

        // Draw nodes
        const nodeSpacing = 95;
        const startX = CANVAS_W / 2 - (this.allLevels.length - 1) * nodeSpacing / 2;
        const nodeY = 300;

        // Connection lines
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 3;
        for (let i = 0; i < this.allLevels.length - 1; i++) {
            ctx.beginPath();
            ctx.moveTo(startX + i * nodeSpacing, nodeY);
            ctx.lineTo(startX + (i + 1) * nodeSpacing, nodeY);
            ctx.stroke();
        }

        // Draw each level node
        for (let i = 0; i < this.allLevels.length; i++) {
            const id = this.allLevels[i];
            const x = startX + i * nodeSpacing;
            const unlocked = this.isUnlocked(id);
            const selected = i === this.selectedIndex;
            const completed = this.progress[id] && this.progress[id].completed;
            const stars = (this.progress[id] && this.progress[id].stars) || 0;
            const isBoss = id.endsWith('-B');

            // Find world for this level
            const world = this.worlds.find(w => w.levels.includes(id) || w.boss === id);

            // Node circle (bosses are larger)
            const baseRadius = isBoss ? 32 : 28;
            const radius = selected ? baseRadius + 7 : baseRadius;
            ctx.beginPath();
            ctx.arc(x, nodeY, radius, 0, Math.PI * 2);

            if (!unlocked) {
                ctx.fillStyle = '#333';
            } else if (completed) {
                ctx.fillStyle = world.color;
            } else {
                ctx.fillStyle = world.color + '88';
            }
            ctx.fill();

            // Boss pulsing border
            if (isBoss && unlocked && !completed) {
                ctx.strokeStyle = '#FF4444';
                ctx.lineWidth = 3 + Math.sin(this.pulseTimer * 5) * 2;
                ctx.stroke();
            }

            // Selection glow
            if (selected) {
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 3 + Math.sin(this.pulseTimer * 4) * 1;
                ctx.stroke();
            }

            // Level ID text
            ctx.fillStyle = unlocked ? '#fff' : '#666';
            ctx.font = isBoss ? 'bold 16px monospace' : 'bold 20px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(isBoss ? 'BOSS' : id, x, nodeY + 7);

            // Lock icon
            if (!unlocked) {
                ctx.fillStyle = '#888';
                ctx.font = '24px monospace';
                ctx.fillText('🔒', x, nodeY - 35);
            }

            // Stars below node (not for boss levels)
            if (unlocked && !isBoss) {
                ctx.font = '16px monospace';
                ctx.fillStyle = '#FFD700';
                const starText = '★'.repeat(stars) + '☆'.repeat(3 - stars);
                ctx.fillText(starText, x, nodeY + 55);
            }

            // Crown for completed bosses
            if (isBoss && completed) {
                ctx.fillStyle = '#FFD700';
                ctx.font = '20px monospace';
                ctx.fillText('👑', x, nodeY - 35);
            }
        }

        // World name for selected level
        const selId = this.getSelectedLevelId();
        const selWorld = this.worlds.find(w => w.levels.includes(selId) || w.boss === selId);
        if (selWorld) {
            ctx.fillStyle = selWorld.color;
            ctx.font = 'bold 24px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(selWorld.name, CANVAS_W / 2, 150);

            const levelData = LEVELS[selId];
            if (levelData) {
                ctx.fillStyle = '#ccc';
                ctx.font = '20px monospace';
                ctx.fillText(levelData.name, CANVAS_W / 2, 185);
            }
        }

        // Total stars
        let totalStars = 0;
        for (const id of this.allLevels) {
            totalStars += (this.progress[id] && this.progress[id].stars) || 0;
        }
        ctx.fillStyle = '#FFD700';
        ctx.font = '20px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`★ Totale: ${totalStars}/18`, CANVAS_W / 2, 440);

        // Instructions
        ctx.fillStyle = '#888';
        ctx.font = '16px monospace';
        ctx.fillText('← → Seleziona    INVIO Gioca    ESC Menu', CANVAS_W / 2, 550);

        // Locked message
        if (!this.isUnlocked(selId)) {
            ctx.fillStyle = '#FF6666';
            ctx.font = '18px monospace';
            if (selId.endsWith('-B')) {
                ctx.fillText('Raccogli tutte le stelle del mondo per sbloccare il Boss!', CANVAS_W / 2, 500);
            } else {
                ctx.fillText('Completa il livello precedente per sbloccare!', CANVAS_W / 2, 500);
            }
        }
    },
};
