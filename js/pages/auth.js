document.addEventListener('DOMContentLoaded', function() {
    // Общие функции
    function showMessage(elementId, text, type) {
        const messageEl = document.getElementById(elementId);
        if (!messageEl) return;
        
        messageEl.textContent = text;
        messageEl.className = `message ${type}`;
    }

    // Логика для страницы входа
    if (document.getElementById('login-btn')) {
        document.getElementById('login-btn').addEventListener('click', handleLogin);
        document.getElementById('register-btn').addEventListener('click', () => {
            window.location.href = 'register.html';
        });
        document.getElementById('back-btn').addEventListener('click', () => {
            window.location.href = 'index.html';
        });

        function handleLogin() {
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            
            if (!username || !password) {
                showMessage('auth-message', 'Введите имя и пароль!', 'error');
                return;
            }
            
            const player = GameStorage.getPlayerByCredentials(username, password);
            
            if (player) {
                GameStorage.setCurrentPlayer(player);
                showMessage('auth-message', 'Добро пожаловать обратно, капитан!', 'success');
                
                setTimeout(() => {
                    window.location.href = player.gender ? 'main-menu.html' : 'gender-select.html';
                }, 1500);
            } else {
                showMessage('auth-message', 'Неверное имя или пароль!', 'error');
            }
        }
    }

    // Логика для страницы регистрации
    if (document.getElementById('register-btn') && document.getElementById('confirm-password')) {
        document.getElementById('register-btn').addEventListener('click', handleRegister);
        document.getElementById('back-btn').addEventListener('click', () => {
            window.location.href = 'index.html';
        });

        function handleRegister() {
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const shipName = document.getElementById('ship-name').value.trim();
            
            if (!username || !password || !confirmPassword || !shipName) {
                showMessage('auth-message', 'Все поля обязательны для заполнения!', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showMessage('auth-message', 'Пароли не совпадают!', 'error');
                return;
            }
            
            if (password.length < 6) {
                showMessage('auth-message', 'Пароль должен быть не менее 6 символов!', 'error');
                return;
            }
            
            if (GameStorage.playerExists(username)) {
                showMessage('auth-message', 'Капитан с таким именем уже существует!', 'error');
                return;
            }
            
            const player = GameStorage.initializeNewPlayer(username, password);
            player.shipName = shipName;
            player.gold = 1000;
            player.inventory = [
                { id: 'wooden_sword', type: 'weapon', name: 'Деревянный меч', equippable: true },
                { id: 'leather_armor', type: 'armor', name: 'Кожаный доспех', equippable: true }
            ];
            
            GameStorage.savePlayer(player);
            GameStorage.setCurrentPlayer(player);
            
            showMessage('auth-message', 'Регистрация успешна! Добро пожаловать на борт!', 'success');
            
            setTimeout(() => {
                window.location.href = 'gender-select.html';
            }, 2000);
        }
    }
});