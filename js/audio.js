const Audio_ = {
    sfxPool: {},
    currentMusic: null,
    musicVolume: 0.4,
    sfxVolume: 0.5,
    unlocked: false,

    init() {
        const unlock = () => {
            if (!this.unlocked) {
                this.unlocked = true;
                // Resume any pending music
                if (this.currentMusic && this.currentMusic.paused) {
                    this.currentMusic.play().catch(() => {});
                }
            }
        };
        window.addEventListener('keydown', unlock, { once: true });
        window.addEventListener('click', unlock, { once: true });
        window.addEventListener('touchstart', unlock, { once: true });
    },

    playSfx(key) {
        const src = Sounds[key];
        if (!src) return;
        if (!this.sfxPool[key]) {
            this.sfxPool[key] = [];
            for (let i = 0; i < 4; i++) {
                const a = new Audio(src.src);
                a.volume = this.sfxVolume;
                this.sfxPool[key].push(a);
            }
        }
        const pool = this.sfxPool[key];
        for (const a of pool) {
            if (a.paused || a.ended) {
                a.currentTime = 0;
                a.play().catch(() => {});
                return;
            }
        }
        pool[0].currentTime = 0;
        pool[0].play().catch(() => {});
    },

    playMusic(key) {
        const m = Music[key];
        if (!m) return;
        if (this.currentMusic === m && !m.paused) return;
        this.stopMusic();
        m.volume = this.musicVolume;
        m.currentTime = 0;
        m.play().catch(() => {});
        this.currentMusic = m;
    },

    stopMusic() {
        if (this.currentMusic) {
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
        }
        this.currentMusic = null;
    },
};
