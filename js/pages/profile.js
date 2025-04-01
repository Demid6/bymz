document.addEventListener('DOMContentLoaded', function() {
    const player = GameStorage.getCurrentPlayer();
    if (!player) {
        window.location.href = 'login.html';
        return;
    }

    // Элементы DOM
    const elements = {
        username: document.getElementById('player-username'),
        level: document.getElementById('player-level'),
        gender: document.getElementById('player-gender'),
        gold: document.getElementById('player-gold'),
        health: document.getElementById('player-health'),
        strength: document.getElementById('player-strength'),
        agility: document.getElementById('player-agility'),
        luck: document.getElementById('player-luck'),
        avatar: document.getElementById('player-avatar-img'),
        inventory: document.getElementById('inventory-list'),
        backBtn: document.getElementById('back-btn'),
        logoutBtn: document.getElementById('logout-btn'),
        progressBar: document.getElementById('level-progress'),
        expInfo: document.getElementById('exp-info'),
        battleHistory: document.getElementById('battle-history')
    };

    // Загрузка данных профиля
    function loadProfileData() {
        // Основная информация
        elements.username.textContent = player.username;
        elements.gender.textContent = `Пол: ${player.gender === 'male' ? 'Мужской' : 'Женский'}`;
        elements.gold.textContent = `Золото: ${player.gold}`;
        
        // Характеристики
        elements.health.textContent = `Здоровье: ${player.stats.health}`;
        elements.strength.textContent = `Сила: ${player.stats.strength}`;
        elements.agility.textContent = `Ловкость: ${player.stats.agility}`;
        elements.luck.textContent = `Удача: ${player.stats.luck}`;
        
        // Уровень и прогресс
        updateLevelInfo();
        
        // Аватар
        updateAvatar();
        
        // Инвентарь
        updateInventory();
        
        // История боев
        updateBattleHistory();
    }

    // Обновление информации об уровне
    function updateLevelInfo() {
        const currentLevel = player.stats.level;
        const currentExp = player.stats.experience;
        const expNeeded = currentLevel * 100;
        const progressPercent = (currentExp / expNeeded) * 100;
        
        elements.level.textContent = `Уровень: ${currentLevel}`;
        elements.progressBar.style.width = `${progressPercent}%`;
        elements.expInfo.textContent = `${currentExp}/${expNeeded} опыта`;
    }

    // Обновление аватара
    function updateAvatar() {
        const avatarPath = player.gender === 'male' 
            ? 'assets/images/avatar_male.png' 
            : 'assets/images/avatar_female.png';
        elements.avatar.src = avatarPath;
        
        // Добавляем класс для анимации при смене аватара
        elements.avatar.classList.add('avatar-change');
        setTimeout(() => {
            elements.avatar.classList.remove('avatar-change');
        }, 500);
    }

    // Обновление инвентаря
    function updateInventory() {
        elements.inventory.innerHTML = '';
        
        if (player.inventory.length === 0) {
            elements.inventory.innerHTML = '<li class="empty">Инвентарь пуст</li>';
            return;
        }
        
        player.inventory.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'inventory-item';
            li.dataset.itemId = item.id;
            
            li.innerHTML = `
                <span class="item-name ${item.equipped ? 'equipped' : ''}">${item.name}</span>
                <span class="item-type">${item.type}</span>
                <div class="item-actions">
                    ${item.equippable ? `<button class="equip-btn" data-index="${index}">${item.equipped ? 'Снять' : 'Экипировать'}</button>` : ''}
                    ${item.usable ? `<button class="use-btn" data-index="${index}">Использовать</button>` : ''}
                    <button class="sell-btn" data-index="${index}">Продать</button>
                </div>
            `;
            
            elements.inventory.appendChild(li);
        });
        
        // Добавляем обработчики для кнопок
        document.querySelectorAll('.equip-btn').forEach(btn => {
            btn.addEventListener('click', handleEquipItem);
        });
        
        document.querySelectorAll('.use-btn').forEach(btn => {
            btn.addEventListener('click', handleUseItem);
        });
        
        document.querySelectorAll('.sell-btn').forEach(btn => {
            btn.addEventListener('click', handleSellItem);
        });
    }

    // Обновление истории боев
    function updateBattleHistory() {
        if (!player.battleHistory || player.battleHistory.length === 0) {
            elements.battleHistory.innerHTML = '<li class="empty">История боев пуста</li>';
            return;
        }
        
        elements.battleHistory.innerHTML = '';
        player.battleHistory.slice(0, 5).forEach(battle => {
            const li = document.createElement('li');
            li.className = battle.won ? 'battle-won' : 'battle-lost';
            
            const opponentName = battle.opponent || 'Неизвестный противник';
            const result = battle.won ? 'Победа' : 'Поражение';
            const date = new Date(battle.date).toLocaleDateString();
            
            li.innerHTML = `
                <span class="battle-result">${result}</span>
                <span class="battle-opponent">vs ${opponentName}</span>
                <span class="battle-date">${date}</span>
                <span class="battle-reward">+${battle.reward || 0} золота</span>
            `;
            
            elements.battleHistory.appendChild(li);
        });
    }

    // Обработчики действий с предметами
    function handleEquipItem(e) {
        const index = e.target.dataset.index;
        const item = player.inventory[index];
        
        if (item.equipped) {
            // Снимаем предмет
            unequipItem(index);
        } else {
            // Экипируем предмет
            equipItem(index);
        }
        
        GameStorage.savePlayer(player);
        updateInventory();
        loadProfileData(); // Обновляем характеристики
    }

    function equipItem(index) {
        const item = player.inventory[index];
        
        // Сначала снимаем все предметы того же типа
        player.inventory.forEach((i, idx) => {
            if (i.equippable && i.type === item.type && i.equipped) {
                unequipItem(idx);
            }
        });
        
        // Экипируем выбранный предмет
        item.equipped = true;
        
        // Применяем бонусы
        if (item.bonuses) {
            Object.keys(item.bonuses).forEach(stat => {
                player.stats[stat] += item.bonuses[stat];
            });
        }
        
        showMessage(`Предмет "${item.name}" экипирован`, 'success');
    }

    function unequipItem(index) {
        const item = player.inventory[index];
        item.equipped = false;
        
        // Убираем бонусы
        if (item.bonuses) {
            Object.keys(item.bonuses).forEach(stat => {
                player.stats[stat] -= item.bonuses[stat];
            });
        }
        
        showMessage(`Предмет "${item.name}" снят`, 'info');
    }

    function handleUseItem(e) {
        const index = e.target.dataset.index;
        const item = player.inventory[index];
        
        if (confirm(`Использовать "${item.name}"?`)) {
            // Применяем эффект
            if (item.effect) {
                applyItemEffect(item.effect);
            }
            
            // Удаляем предмет (если одноразовый)
            if (item.consumable) {
                player.inventory.splice(index, 1);
            }
            
            GameStorage.savePlayer(player);
            updateInventory();
            loadProfileData();
            
            showMessage(`Предмет "${item.name}" использован`, 'success');
        }
    }

    function applyItemEffect(effect) {
        if (effect.type === 'heal') {
            player.stats.health = Math.min(
                player.stats.health + effect.value, 
                100 + (player.stats.level * 10)
            );
        } else if (effect.type === 'buff') {
            player.stats[effect.stat] += effect.value;
            // Можно добавить временный бафф с таймером
        }
    }

    function handleSellItem(e) {
        const index = e.target.dataset.index;
        const item = player.inventory[index];
        
        if (confirm(`Продать "${item.name}" за ${item.price || 10} золота?`)) {
            player.gold += item.price || 10;
            
            // Если предмет был экипирован, сначала снимаем
            if (item.equipped) {
                unequipItem(index);
            }
            
            player.inventory.splice(index, 1);
            GameStorage.savePlayer(player);
            updateInventory();
            loadProfileData();
            
            showMessage(`Предмет продан за ${item.price || 10} золота`, 'success');
        }
    }

    // Вспомогательные функции
    function showMessage(text, type) {
        const messageEl = document.createElement('div');
        messageEl.className = `message ${type}`;
        messageEl.textContent = text;
        
        const container = document.querySelector('.profile-container');
        container.prepend(messageEl);
        
        setTimeout(() => {
            messageEl.remove();
        }, 3000);
    }

    // Инициализация
    elements.backBtn.addEventListener('click', () => {
        window.location.href = 'main-menu.html';
    });

    elements.logoutBtn.addEventListener('click', () => {
        GameStorage.clearCurrentPlayer();
        window.location.href = 'index.html';
    });

    loadProfileData();
});