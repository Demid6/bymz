document.addEventListener('DOMContentLoaded', function() {
    const player = Storage.getPlayer();
    
    if (!player) {
        window.location.href = 'index.html';
        return;
    }

    // Заполняем информацию о игроке
    document.getElementById('player-username').textContent = player.username;
    document.getElementById('player-level').textContent = `Уровень: ${player.stats.level}`;

    // Назначаем обработчики кнопок
    document.getElementById('profile-btn').addEventListener('click', function() {
        window.location.href = 'profile.html';
    });

    document.getElementById('shop-btn').addEventListener('click', function() {
        window.location.href = 'shop.html';
    });

    document.getElementById('arena-btn').addEventListener('click', function() {
        window.location.href = 'arena.html';
    });

    document.getElementById('guild-btn').addEventListener('click', function() {
        window.location.href = 'guild.html';
    });

    document.getElementById('logout-btn').addEventListener('click', function() {
        Storage.clearCurrentPlayer();
        window.location.href = 'index.html';
    });
});