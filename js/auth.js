document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const messageEl = document.getElementById('auth-message');

    // Проверяем, есть ли сохраненный игрок
    const player = Storage.getPlayer();
    if (player) {
        // Если игрок есть, перенаправляем в главное меню
        window.location.href = 'main-menu.html';
    }

    loginBtn.addEventListener('click', function() {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!username || !password) {
            showMessage('Заполните все поля');
            return;
        }

        const player = Storage.getPlayerByCredentials(username, password);
        if (player) {
            Storage.setCurrentPlayer(player);
            window.location.href = 'gender-select.html';
        } else {
            showMessage('Неверное имя пользователя или пароль');
        }
    });

    registerBtn.addEventListener('click', function() {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!username || !password) {
            showMessage('Заполните все поля');
            return;
        }

        if (Storage.playerExists(username)) {
            showMessage('Игрок с таким именем уже существует');
            return;
        }

        // Создаем нового игрока
        const newPlayer = {
            username,
            password,
            gender: null,
            inventory: [],
            stats: {
                level: 1,
                exp: 0,
                wins: 0,
                losses: 0
            }
        };

        Storage.savePlayer(newPlayer);
        Storage.setCurrentPlayer(newPlayer);
        window.location.href = 'gender-select.html';
    });

    function showMessage(msg) {
        messageEl.textContent = msg;
        setTimeout(() => messageEl.textContent = '', 3000);
    }
});