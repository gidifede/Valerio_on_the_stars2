const Background = {
    layers: [],

    setWorld(worldName) {
        this.layers = [];
        const WORLDS = {
            forest: [
                { img: 'forestBack', speed: 0.1 },
                { img: 'forestMid',  speed: 0.3 },
            ],
            castle: [
                { img: 'castleBack',  speed: 0.1 },
                { img: 'castleBgMid', speed: 0.3 },
                { img: 'castleFront', speed: 0.5 },
            ],
            space: [
                { img: 'spaceBack',  speed: 0.05 },
                { img: 'spaceMid',   speed: 0.2 },
                { img: 'spaceFront', speed: 0.4 },
            ],
            lego_world: [
                { img: 'legoBack',  speed: 0.1 },
                { img: 'legoMid',   speed: 0.3 },
                { img: 'legoFront', speed: 0.5 },
            ],
        };
        this.layers = WORLDS[worldName] || [];
    },

    draw(ctx) {
        for (const layer of this.layers) {
            const img = Images[layer.img];
            if (!img || !img.complete) continue;

            const parallaxX = Camera.x * layer.speed;
            const iw = img.width;
            const ih = img.height;

            // Scale to fill canvas height
            const scale = CANVAS_H / ih;
            const sw = iw * scale;

            // Tile horizontally
            const startX = -(parallaxX * scale) % sw;
            for (let x = startX - sw; x < CANVAS_W + sw; x += sw) {
                ctx.drawImage(img, x, 0, sw, CANVAS_H);
            }
        }
    },
};
