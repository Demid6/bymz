// Хранилище "блокнот" для пользователей
const userDatabase = {};

// Элементы интерфейса
const authScreen = document.getElementById('auth-screen');
const gameScreen = document.getElementById('game-screen');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('login-btn');
const errorMsg = document.getElementById('error-msg');

// Обработчик входа
loginBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    
    if (!username || !password) {
        errorMsg.textContent = "Введите логин и пароль";
        return;
    }
    
    // Простая валидация
    if (password.length < 4) {
        errorMsg.textContent = "Пароль должен быть не менее 4 символов";
        return;
    }
    
    // Сохраняем в наш "блокнот"
    userDatabase[username] = password;
    console.log("Текущая база пользователей:", userDatabase);
    
    // Переходим к созданию персонажа
    startCharacterCreation(username);
});

function startCharacterCreation(username) {
    // Скрываем экран авторизации
    authScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    
    // Конфиг Phaser
    const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: 'game-screen',
        scene: {
            create: createCharacterCreationScene,
            update: update
        }
    };
    
    // Инициализация игры
    new Phaser.Game(config);
    
    function createCharacterCreationScene() {
        this.add.text(100, 100, `Создание персонажа для ${username}`, { 
            font: "32px Arial", 
            fill: "#ffffff" 
        });
        
        // Здесь можно добавить форму для выбора персонажа и никнейма
        // Например:
        this.add.text(100, 200, "Выберите класс персонажа:", { 
            font: "24px Arial", 
            fill: "#ffffff" 
        });
        
        // Пример кнопок выбора класса
        const classes = ["Воин", "Маг", "Лучник"];
        classes.forEach((cls, i) => {
            const btn = this.add.rectangle(150, 260 + i * 60, 200, 50, 0x4CAF50)
                .setInteractive();
            this.add.text(150, 260 + i * 60, cls, { 
                font: "20px Arial", 
                fill: "#ffffff" 
            }).setOrigin(0.5);
            
            btn.on('pointerdown', () => {
                console.log(`Выбран класс: ${cls}`);
                // Здесь можно перейти к следующему этапу игры
            });
        });
    }
    
    function update() {
        // Логика обновления
    }
}