export class PowerBar {
    constructor(scene, options) {
        this.scene = scene;
        this.bar = scene.add.graphics();
        this.bg = scene.add.graphics();
        this.options = {
            x: 400,
            y: 30,
            width: 300,
            height: 20,
            ...options
        };
        this.draw();
    }

    draw() {
        this.bg.clear();
        this.bg.fillStyle(0x000000, 0.5);
        this.bg.fillRect(
            this.options.x - this.options.width/2,
            this.options.y,
            this.options.width,
            this.options.height
        );
        this.bg.lineStyle(2, 0xffffff, 1);
        this.bg.strokeRect(
            this.options.x - this.options.width/2,
            this.options.y,
            this.options.width,
            this.options.height
        );
    }

    update(percent) {
        percent = Phaser.Math.Clamp(percent, 0, 1);
        this.bar.clear();
        
        let color;
        if (percent < 0.5) {
            color = Phaser.Display.Color.Interpolate.ColorWithColor(
                Phaser.Display.Color.ValueToColor(0x00ff00),
                Phaser.Display.Color.ValueToColor(0xffff00),
                100,
                percent * 200
            );
        } else {
            color = Phaser.Display.Color.Interpolate.ColorWithColor(
                Phaser.Display.Color.ValueToColor(0xffff00),
                Phaser.Display.Color.ValueToColor(0xff0000),
                100,
                (percent - 0.5) * 200
            );
        }
        
        const colorInt = Phaser.Display.Color.GetColor(color.r, color.g, color.b);
        this.bar.fillStyle(colorInt, 1);
        this.bar.fillRect(
            this.options.x - this.options.width/2,
            this.options.y,
            this.options.width * percent,
            this.options.height
        );
    }

    destroy() {
        this.bar.destroy();
        this.bg.destroy();
    }
}