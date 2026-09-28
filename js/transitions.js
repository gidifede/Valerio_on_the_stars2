const Transition = {
    phase: 'none',      // 'none' | 'fadeOut' | 'fadeIn'
    progress: 0,
    duration: 0.4,
    callback: null,

    start(callback) {
        this.phase = 'fadeOut';
        this.progress = 0;
        this.callback = callback;
    },

    update(dt) {
        if (this.phase === 'none') return;

        this.progress += dt / this.duration;

        if (this.phase === 'fadeOut' && this.progress >= 1) {
            this.progress = 0;
            this.phase = 'fadeIn';
            if (this.callback) this.callback();
            this.callback = null;
        } else if (this.phase === 'fadeIn' && this.progress >= 1) {
            this.phase = 'none';
            this.progress = 0;
        }
    },

    draw(ctx) {
        if (this.phase === 'none') return;

        let alpha;
        if (this.phase === 'fadeOut') {
            alpha = this.progress;
        } else {
            alpha = 1 - this.progress;
        }
        ctx.fillStyle = 'rgba(0,0,0,' + clamp(alpha, 0, 1) + ')';
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    },

    isActive() {
        return this.phase !== 'none';
    },
};
