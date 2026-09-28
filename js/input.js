const Input = {
    keys: {},
    justPressed: {},
    isTouchDevice: false,

    init() {
        window.addEventListener('keydown', (e) => {
            if (!this.keys[e.code]) {
                this.justPressed[e.code] = true;
            }
            this.keys[e.code] = true;
            if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
                e.preventDefault();
            }
        });
        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        this._initTouch();
    },

    _initTouch() {
        // Detect touch capability
        if (!('ontouchstart' in window || navigator.maxTouchPoints > 0)) return;
        this.isTouchDevice = true;

        // Show touch controls
        const tc = document.getElementById('touchControls');
        if (tc) tc.classList.add('visible');

        // Map buttons to virtual key codes
        const btnMap = {
            btnLeft:   'ArrowLeft',
            btnRight:  'ArrowRight',
            btnJump:   'Space',
            btnAction: 'Enter',
        };

        for (const [id, code] of Object.entries(btnMap)) {
            const btn = document.getElementById(id);
            if (!btn) continue;

            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                if (!this.keys[code]) {
                    this.justPressed[code] = true;
                }
                this.keys[code] = true;
                btn.classList.add('pressed');
            }, { passive: false });

            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.keys[code] = false;
                btn.classList.remove('pressed');
            }, { passive: false });

            btn.addEventListener('touchcancel', (e) => {
                e.preventDefault();
                this.keys[code] = false;
                btn.classList.remove('pressed');
            }, { passive: false });
        }

        // Prevent scrolling/zooming on the whole page
        document.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
    },

    isDown(code) {
        return !!this.keys[code];
    },

    wasPressed(code) {
        return !!this.justPressed[code];
    },

    consumePress(code) {
        if (this.justPressed[code]) {
            this.justPressed[code] = false;
            return true;
        }
        return false;
    },

    clearJustPressed() {
        this.justPressed = {};
    },

    left()  { return this.isDown('ArrowLeft')  || this.isDown('KeyA'); },
    right() { return this.isDown('ArrowRight') || this.isDown('KeyD'); },
    up()    { return this.isDown('ArrowUp')    || this.isDown('KeyW'); },
    jump()  { return this.consumePress('Space') || this.consumePress('ArrowUp') || this.consumePress('KeyW'); },
    enter() { return this.consumePress('Enter'); },
    pause() { return this.consumePress('KeyP'); },
    escape(){ return this.consumePress('Escape'); },
};
