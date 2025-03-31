document.addEventListener('DOMContentLoaded', function() {
    const maleBtn = document.getElementById('male-btn');
    const femaleBtn = document.getElementById('female-btn');

    maleBtn.addEventListener('click', function() {
        selectGender('male');
    });

    femaleBtn.addEventListener('click', function() {
        selectGender('female');
    });

    function selectGender(gender) {
        const player = Storage.getPlayer();
        if (!player) {
            window.location.href = 'index.html';
            return;
        }

        player.gender = gender;
        Storage.savePlayer(player);
        Storage.setCurrentPlayer(player);
        
        window.location.href = 'main-menu.html';
    }
});