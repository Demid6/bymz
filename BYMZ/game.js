const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 0 } }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

function preload() {
    // Загрузка ассетов (добавьте свои файлы в assets/)
    this.load.image('player', 'assets/player.png');
}

function create() {
    console.log("Scene created!"); // Проверка инициализации сцены
    
    // Добавьте тестовый текст
    this.add.text(100, 100, "BYMZ Game Loaded", { 
        font: "32px Arial", 
        fill: "#ff0000" 
    });
    
    // Проверка загрузки изображения
    if(!this.textures.exists('player')) {
        console.error("Player texture not loaded!");
    } else {
        this.player = this.physics.add.sprite(400, 300, 'player');
        this.cursors = this.input.keyboard.createCursorKeys();
    }
}

function update() {
    // Управление
    if (this.cursors.left.isDown) this.player.setVelocityX(-200);
    else if (this.cursors.right.isDown) this.player.setVelocityX(200);
    else this.player.setVelocityX(0);

    if (this.cursors.up.isDown) this.player.setVelocityY(-200);
    else if (this.cursors.down.isDown) this.player.setVelocityY(200);
    else this.player.setVelocityY(0);
}