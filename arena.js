import { PowerBar } from './power-bar.js';

class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this.players = [];
        this.currentPlayerIndex = 0;
        this.walls = {};
    }

    preload() {
        this.load.setBaseURL('assets/');
        this.load.image('background', 'background.png');
        this.load.image('weapon', 'weapon.png');
        this.load.image('bullet', 'bullet.png');
        this.load.image('explosion', 'explosion.png');
        this.load.spritesheet('healthbar', 'healthbar.png', { frameWidth: 100, frameHeight: 10 });

        const savedData = JSON.parse(localStorage.getItem('gameData'));
        const gender = savedData?.character?.gender || 'male';
        this.load.image('player', `player_${gender}.png`);
        this.load.image('ant_queen', 'ant_queen.png');
    }

    create() {
        // Создаем фон
        this.add.image(400, 300, 'background').setDisplaySize(800, 600);
        
        // Настраиваем границы мира
        this.physics.world.setBounds(-50, -50, 900, 700);
        
        // Создаем невидимые стены
        this.createInvisibleWalls();
        
        // Создаем платформы
        this.createPlatforms();
        
        // Создаем игроков
        this.createPlayers();
        
        // Настраиваем управление
        this.setupControls();
        
        // Создаем PowerBar
        this.powerBar = new PowerBar(this, {
            x: this.cameras.main.width / 2,
            y: 50,
            width: 300
        });
        
        // Настраиваем камеру
        this.cameras.main.startFollow(this.players[0].sprite, true, 0.1, 0.1);
        
        // Настраиваем кнопки интерфейса
        this.setupUI();
    }

    createInvisibleWalls() {
        const wallThickness = 50;
        const color = 0x000000;
        
        // Левая стена
        this.walls.left = this.add.rectangle(-wallThickness/2, 300, wallThickness, 600, color, 0)
            .setOrigin(0.5, 0.5);
        this.physics.add.existing(this.walls.left, true);
        
        // Правая стена
        this.walls.right = this.add.rectangle(800 + wallThickness/2, 300, wallThickness, 600, color, 0)
            .setOrigin(0.5, 0.5);
        this.physics.add.existing(this.walls.right, true);
        
        // Верхняя стена
        this.walls.top = this.add.rectangle(400, -wallThickness/2, 900, wallThickness, color, 0)
            .setOrigin(0.5, 0.5);
        this.physics.add.existing(this.walls.top, true);
    }

    createPlatforms() {
        // Основная земля
        this.ground = this.add.rectangle(400, 580, 800, 40, 0x8B4513);
        this.physics.add.existing(this.ground, true);
        
        // Дополнительные платформы
        this.platforms = [
            this.add.rectangle(200, 450, 150, 30, 0xA0522D),
            this.add.rectangle(600, 400, 200, 30, 0xA0522D),
            this.add.rectangle(400, 300, 180, 30, 0xA0522D)
        ];
        this.platforms.forEach(plat => this.physics.add.existing(plat, true));
    }

    createPlayers() {
        const savedData = JSON.parse(localStorage.getItem('gameData')) || {};
        
        // Игрок
        this.players.push(this.createPlayer(200, 500, 'player', savedData.character?.name || 'Player', true));
        
        // Враг
        this.players.push(this.createPlayer(600, 500, 'ant_queen', 'Ant Queen', false));
        
        // Коллизии с платформами
        [this.ground, ...this.platforms].forEach(platform => {
            this.players.forEach(player => {
                this.physics.add.collider(player.sprite, platform);
            });
        });
    }

    createPlayer(x, y, texture, name, isPlayer) {
        const sprite = this.physics.add.sprite(x, y, texture)
            .setCollideWorldBounds(true)
            .setBounce(0.2)
            .setGravityY(800)
            .setDragX(600)
            .setDisplaySize(60, 80)
            .setSize(40, 60)
            .setOffset(10, 20);

        const weapon = isPlayer ? this.createWeapon(sprite) : null;

        return {
            name,
            sprite,
            weapon,
            isPlayer,
            health: 100,
            power: 10,
            angle: isPlayer ? 45 : 135,
            flipX: !isPlayer,
            isCharging: false,
            healthBar: this.createHealthBar(sprite)
        };
    }

    createWeapon(playerSprite) {
        const weapon = this.add.sprite(25, -15, 'weapon')
            .setScale(0.5)
            .setOrigin(0.5, 0.5);
        playerSprite.addChild(weapon);
        return weapon;
    }

    createHealthBar(playerSprite) {
        return this.add.sprite(
            playerSprite.x,
            playerSprite.y - 50,
            'healthbar'
        ).setFrame(10).setDepth(10);
    }

    setupControls() {
        this.keys = this.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            up: Phaser.Input.Keyboard.KeyCodes.UP,
            down: Phaser.Input.Keyboard.KeyCodes.DOWN,
            shoot: Phaser.Input.Keyboard.KeyCodes.SPACE
        });

        // Мобильные контролы
        this.setupMobileControls();
    }

    setupMobileControls() {
        const setKeyState = (key, state) => {
            if (this.keys[key]) {
                this.keys[key].isDown = state;
            }
        };

        document.getElementById('btn-left').addEventListener('touchstart', () => setKeyState('left', true));
        document.getElementById('btn-left').addEventListener('touchend', () => setKeyState('left', false));
        document.getElementById('btn-right').addEventListener('touchstart', () => setKeyState('right', true));
        document.getElementById('btn-right').addEventListener('touchend', () => setKeyState('right', false));
        document.getElementById('btn-jump').addEventListener('touchstart', () => setKeyState('up', true));
        document.getElementById('btn-jump').addEventListener('touchend', () => setKeyState('up', false));
        
        const shootBtn = document.getElementById('btn-shoot');
        shootBtn.addEventListener('touchstart', () => this.startCharging());
        shootBtn.addEventListener('touchend', () => this.stopCharging());
    }

    setupUI() {
        document.getElementById('restart-btn').addEventListener('click', () => {
            this.scene.restart();
            document.getElementById('game-overlay').classList.remove('active');
        });
        
        document.getElementById('menu-btn').addEventListener('click', () => {
            window.location.href = 'menu.html';
        });
    }

    startCharging() {
        if (this.players[this.currentPlayerIndex].isPlayer) {
            this.players[this.currentPlayerIndex].isCharging = true;
        }
    }

    stopCharging() {
        const player = this.players[this.currentPlayerIndex];
        if (player.isPlayer && player.isCharging) {
            player.isCharging = false;
            this.fireWeapon();
        }
    }

    fireWeapon() {
        const player = this.players[this.currentPlayerIndex];
        if (!player.isPlayer) return;

        const bullet = this.physics.add.sprite(
            player.weapon.getWorldTransformMatrix().tx,
            player.weapon.getWorldTransformMatrix().ty,
            'bullet'
        ).setScale(0.3);

        const angle = player.flipX ? 180 - player.angle : player.angle;
        const rad = Phaser.Math.DegToRad(angle);
        
        bullet.setVelocity(
            Math.cos(rad) * player.power * 3,
            Math.sin(rad) * player.power * 3
        );

        player.power = 10;
        
        // Коллизии пули
        this.players.forEach(target => {
            if (target !== player) {
                this.physics.add.collider(bullet, target.sprite, () => {
                    this.handleDamage(player, target, player.power);
                    bullet.destroy();
                });
            }
        });
        
        [this.ground, ...this.platforms, this.walls.left, this.walls.right, this.walls.top].forEach(obj => {
            this.physics.add.collider(bullet, obj, () => {
                bullet.destroy();
            });
        });
    }

    update() {
        this.players.forEach(player => {
            // Обновление оружия
            if (player.weapon) {
                player.weapon.setFlipX(player.flipX);
                player.weapon.setRotation(Phaser.Math.DegToRad(player.angle));
                player.weapon.setPosition(
                    player.flipX ? -25 : 25,
                    -15
                );
            }
            
            // Обновление здоровья
            player.healthBar.setPosition(player.sprite.x, player.sprite.y - 50);
            player.healthBar.setFrame(Math.floor(player.health / 10));
            
            // Управление
            if (player === this.players[this.currentPlayerIndex]) {
                this.handlePlayerInput(player);
            }
            
            // Границы
            player.sprite.x = Phaser.Math.Clamp(player.sprite.x, 30, 770);
            player.sprite.y = Phaser.Math.Clamp(player.sprite.y, 30, 570);
        });
        
        // PowerBar
        const currentPlayer = this.players[this.currentPlayerIndex];
        if (currentPlayer.isCharging) {
            currentPlayer.power = Phaser.Math.Clamp(currentPlayer.power + 0.5, 10, 100);
            this.powerBar.update(currentPlayer.power / 100);
        } else {
            this.powerBar.update(0);
        }
    }

    handlePlayerInput(player) {
        const { body } = player.sprite;
        
        if (this.keys.left.isDown) {
            body.setVelocityX(-200);
            player.flipX = true;
        } else if (this.keys.right.isDown) {
            body.setVelocityX(200);
            player.flipX = false;
        } else {
            body.setVelocityX(0);
        }

        if (this.keys.up.isDown) {
            player.angle = Phaser.Math.Clamp(player.angle + 1, 0, 180);
        } else if (this.keys.down.isDown) {
            player.angle = Phaser.Math.Clamp(player.angle - 1, 0, 180);
        }
    }

    handleDamage(attacker, target, damage) {
        target.health -= damage;
        
        if (target.health <= 0) {
            target.health = 0;
            this.endGame(attacker);
        } else {
            this.switchToNextPlayer();
        }
    }

    switchToNextPlayer() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        this.cameras.main.startFollow(this.players[this.currentPlayerIndex].sprite);
    }

    endGame(winner) {
        document.getElementById('game-result').textContent = 
            winner.isPlayer ? 'ПОБЕДА!' : 'ПОРАЖЕНИЕ!';
        document.getElementById('winner-name').textContent = `Победитель: ${winner.name}`;
        document.getElementById('game-overlay').classList.add('active');
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            debug: false,
            fixedStep: true
        }
    },
    scene: [GameScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

function initGame() {
    try {
        const savedData = JSON.parse(localStorage.getItem('gameData'));
        if (!savedData?.character) {
            window.location.href = 'index.html';
            return;
        }

        const game = new Phaser.Game(config);
        window.game = game;

        game.events.on('ERROR', (error) => {
            console.error('Phaser Error:', error);
        });

    } catch (error) {
        console.error('Game initialization failed:', error);
        alert('Ошибка при запуске: ' + error.message);
        window.location.href = 'index.html';
    }
}

window.addEventListener('DOMContentLoaded', initGame);