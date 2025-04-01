document.addEventListener('DOMContentLoaded', function() {
    const battleData = GameStorage.getBattleData();
    if (!battleData) {
        window.location.href = '../html/arena.html';
        return;
    }
    
    const combatSystem = new CombatSystem(battleData.player, battleData.enemy);
    
    // Игровой цикл (для будущих расширений)
    let lastTime = 0;
    function gameLoop(timestamp) {
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;
        
        // Здесь можно обновлять состояние игры
        // combatSystem.update(deltaTime / 1000);
        
        requestAnimationFrame(gameLoop);
    }
    
    requestAnimationFrame(gameLoop);
});