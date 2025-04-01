document.addEventListener('DOMContentLoaded', function() {
    console.log("Страница загружена!");
    
    const progressBar = document.getElementById('progressBar');
    const skipButton = document.getElementById('skipButton');
    let progress = 0;
    let isWorking = true;

    // Функция завершения загрузки
    function completeLoading() {
        if (!isWorking) return;
        isWorking = false;
        
        console.log("Проверяем данные игрока...");
        const player = GameStorage.getCurrentPlayer();
        
        if (!player) {
            console.log("Перенаправляем на регистрацию");
            window.location.href = 'register.html';
        } else if (!player.gender) {
            console.log("Перенаправляем на выбор пола");
            window.location.href = 'gender-select.html';
        } else {
            console.log("Перенаправляем в меню");
            window.location.href = 'main-menu.html';
        }
    }

    // Анимация загрузки
    function updateProgress() {
        if (!isWorking) return;
        
        progress += 1;
        progressBar.style.width = progress + '%';
        
        if (progress >= 100) {
            completeLoading();
        } else {
            setTimeout(updateProgress, 30);
        }
    }

    // Обработчик кнопки "Пропустить"
    skipButton.addEventListener('click', completeLoading);
    
    // Запускаем процесс загрузки
    setTimeout(updateProgress, 500);
    
    // Автоматическое завершение через 5 секунд
    setTimeout(function() {
        if (isWorking) {
            console.log("Автоматическое завершение");
            completeLoading();
        }
    }, 5000);
});