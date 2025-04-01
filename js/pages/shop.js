document.addEventListener('DOMContentLoaded', function() {
    const player = Storage.getPlayer();
    if (!player) {
        window.location.href = 'index.html';
        return;
    }

    // Загружаем предметы магазина
    const shopItems = {
        clothes: [
            { id: 'cloth1', name: 'Кожаный доспех', price: 100, image: 'assets/images/clothes/leather_armor.png' },
            { id: 'cloth2', name: 'Стальная броня', price: 250, image: 'assets/images/clothes/steel_armor.png' },
            // Другие предметы одежды
        ],
        weapons: [
            { id: 'weapon1', name: 'Меч', price: 150, image: 'assets/images/weapons/sword.png' },
            { id: 'weapon2', name: 'Топор', price: 120, image: 'assets/images/weapons/axe.png' },
            // Другие виды оружия
        ],
        accessories: [
            { id: 'acc1', name: 'Кольцо силы', price: 200, image: 'assets/images/accessories/ring.png' },
            { id: 'acc2', name: 'Амулет', price: 180, image: 'assets/images/accessories/amulet.png' },
            // Другие аксессуары
        ]
    };

    const characterDisplay = document.getElementById('character-display');
    const itemsContainer = document.getElementById('items-container');
    const categoryBtns = document.querySelectorAll('.category-btn');
    const backBtn = document.getElementById('back-btn');

    // Отображаем персонажа
    renderCharacter();

    // Обработчики кнопок категорий
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            renderItems(this.dataset.category);
        });
    });

    // Показываем первую категорию
    renderItems('clothes');

    // Назад в главное меню
    backBtn.addEventListener('click', function() {
        window.location.href = 'main-menu.html';
    });

    function renderCharacter() {
        characterDisplay.innerHTML = `
            <img src="assets/images/${player.gender}-character.png" alt="Ваш персонаж">
            <div class="equipped-items">
                ${player.inventory.filter(item => item.equipped).map(item => `
                    <img src="${item.image}" alt="${item.name}" class="equipped-item">
                `).join('')}
            </div>
        `;
    }

    function renderItems(category) {
        itemsContainer.innerHTML = '';
        
        shopItems[category].forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'shop-item';
            itemEl.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p>Цена: ${item.price} золота</p>
                <button class="buy-btn" data-id="${item.id}">Купить</button>
            `;
            
            itemsContainer.appendChild(itemEl);
            
            // Проверяем, есть ли уже этот предмет у игрока
            if (player.inventory.some(i => i.id === item.id)) {
                const btn = itemEl.querySelector('.buy-btn');
                btn.textContent = 'Куплено';
                btn.disabled = true;
            }
        });

        // Обработчики кнопок покупки
        document.querySelectorAll('.buy-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = this.dataset.id;
                const category = document.querySelector('.category-btn.active').dataset.category;
                const item = shopItems[category].find(i => i.id === itemId);
                
                // Здесь можно добавить проверку на достаточно денег
                
                // Добавляем предмет в инвентарь
                player.inventory.push({
                    ...item,
                    equipped: false
                });
                
                // Сохраняем игрока
                Storage.savePlayer(player);
                Storage.setCurrentPlayer(player);
                
                // Обновляем отображение
                renderItems(category);
                renderCharacter();
            });
        });
    }
});