export class ControlManager {
    constructor(scene) {
        this.scene = scene;
        this.setupControls();
    }

    setupControls() {
        this.keys = this.scene.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            jump: Phaser.Input.Keyboard.KeyCodes.W,
            shoot: Phaser.Input.Keyboard.KeyCodes.SPACE
        });
    }

    update(player) {
        const { body } = player.sprite;
        const { controls } = GameState.data;

        // Движение
        if (controls.left || this.keys.left.isDown) {
            body.setVelocityX(-200);
            player.sprite.setFlipX(true);
        } else if (controls.right || this.keys.right.isDown) {
            body.setVelocityX(200);
            player.sprite.setFlipX(false);
        } else {
            body.setVelocityX(0);
        }

        // Прыжок
        if ((controls.jump || this.keys.jump.isDown) && body.onFloor()) {
            body.setVelocityY(-400);
        }
    }
}