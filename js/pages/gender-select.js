document.addEventListener('DOMContentLoaded', function() {
    const maleBtn = document.getElementById('male-btn');
    const femaleBtn = document.getElementById('female-btn');
    const welcomeMessage = document.getElementById('welcome-message');
    
    const player = GameStorage.getCurrentPlayer();
    if (!player) {
        window.location.href = 'index.html';
        return;
    }

    if (player.username) {
        welcomeMessage.textContent = `${player.username}, выберите пол персонажа`;
    }

    maleBtn.addEventListener('click', () => selectGender('male'));
    femaleBtn.addEventListener('click', () => selectGender('female'));

    function selectGender(gender) {
        player.gender = gender;
        GameStorage.savePlayer(player);
        GameStorage.setCurrentPlayer(player);
        window.location.href = 'main-menu.html';
    }
});