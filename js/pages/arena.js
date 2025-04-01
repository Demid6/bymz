document.addEventListener('DOMContentLoaded', function() {
    const player = GameStorage.getCurrentPlayer();
    if (!player) {
        window.location.href = '../html/login.html';
        return;
    }

    // Элементы интерфейса
    const roomsContainer = document.getElementById('rooms-container');
    const battleRoom = document.getElementById('battle-room');
    const backBtn = document.getElementById('arena-back-btn');
    const createRoomBtn = document.getElementById('create-room-btn');
    const startBattleBtn = document.getElementById('start-battle-btn');
    const leaveRoomBtn = document.getElementById('leave-room-btn');
    const roomsList = document.getElementById('rooms-list');
    const availableAbilities = document.querySelector('.available-abilities');
    const selectedAbilities = document.querySelectorAll('.ability-slot');

    // Пример данных комнат
    const mockRooms = [
        { 
            id: 'room1', 
            name: 'Пещера новичков', 
            players: 2, 
            maxPlayers: 4,
            levelRange: "1-10"
        },
        { 
            id: 'room2', 
            name: 'Арена чемпионов', 
            players: 3, 
            maxPlayers: 4,
            levelRange: "20+"
        }
    ];

    // Способности игрока
    const abilities = [
        { id: 1, name: "Атака", icon: "⚔️", type: "attack" },
        { id: 2, name: "Защита", icon: "🛡️", type: "defense" },
        { id: 3, name: "Лечение", icon: "❤️", type: "heal" },
        { id: 4, name: "Крит", icon: "🔥", type: "critical" },
        { id: 5, name: "Уклон", icon: "🌀", type: "dodge" }
    ];

    // Инициализация арены
    initArena();

    // Обработчики событий
    backBtn.addEventListener('click', () => window.location.href = '../html/main-menu.html');
    createRoomBtn.addEventListener('click', createRoom);
    leaveRoomBtn.addEventListener('click', leaveRoom);
    startBattleBtn.addEventListener('click', startBattle);

    function initArena() {
        renderRooms(mockRooms);
        setupAbilityDragAndDrop();
    }

    function setupAbilityDragAndDrop() {
        // Создаем доступные способности
        abilities.forEach(ability => {
            const abilityEl = document.createElement('div');
            abilityEl.className = 'ability-item';
            abilityEl.dataset.id = ability.id;
            abilityEl.dataset.name = ability.name;
            abilityEl.dataset.type = ability.type;
            abilityEl.innerHTML = ability.icon;
            abilityEl.title = ability.name;
            abilityEl.draggable = true;
            
            abilityEl.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', ability.id);
            });
            
            availableAbilities.appendChild(abilityEl);
        });

        // Настройка слотов для способностей
        selectedAbilities.forEach(slot => {
            slot.addEventListener('dragover', (e) => {
                e.preventDefault();
            });
            
            slot.addEventListener('drop', (e) => {
                e.preventDefault();
                const abilityId = e.dataTransfer.getData('text/plain');
                const ability = abilities.find(a => a.id == abilityId);
                
                if (ability) {
                    slot.innerHTML = ability.icon;
                    slot.dataset.abilityId = ability.id;
                    slot.dataset.abilityType = ability.type;
                    slot.classList.add('filled');
                    slot.title = ability.name;
                }
            });
            
            slot.addEventListener('click', () => {
                if (slot.classList.contains('filled')) {
                    slot.innerHTML = '';
                    slot.removeAttribute('data-ability-id');
                    slot.removeAttribute('data-ability-type');
                    slot.classList.remove('filled');
                    slot.title = '';
                }
            });
        });
    }

    function renderRooms(rooms) {
        roomsList.innerHTML = rooms.length ? '' : '<p class="empty-message">Нет доступных комнат</p>';
        
        rooms.forEach(room => {
            const roomEl = document.createElement('div');
            roomEl.className = 'room-card';
            roomEl.innerHTML = `
                <div class="room-info">
                    <h3>${room.name}</h3>
                    <p>Уровни: ${room.levelRange}</p>
                    <p>Игроков: ${room.players}/${room.maxPlayers}</p>
                    ${room.host ? `<p>Создатель: ${room.host}</p>` : ''}
                </div>
                <button class="join-room-btn" 
                        data-room-id="${room.id}"
                        ${room.players >= room.maxPlayers ? 'disabled' : ''}>
                    ${room.players >= room.maxPlayers ? 'Заполнено' : 'Войти'}
                </button>
            `;
            
            if (room.players < room.maxPlayers) {
                roomEl.querySelector('.join-room-btn').addEventListener('click', () => joinRoom(room));
            }
            
            roomsList.appendChild(roomEl);
        });
    }

    function createRoom() {
        joinRoom({
            id: 'room_' + Date.now(),
            name: `${player.username}'s Room`,
            players: 1,
            maxPlayers: 4,
            levelRange: player.stats.level + '+',
            host: player.username
        });
    }

    function joinRoom(room) {
        roomsContainer.style.display = 'none';
        battleRoom.style.display = 'block';
        
        // Очистка и добавление игрока
        document.querySelectorAll('.player-slot').forEach(slot => slot.innerHTML = '');
        
        const playerSlot = document.getElementById('player-slot-1');
        playerSlot.innerHTML = `
            <img src="../assets/images/player_${player.gender}.png" alt="${player.username}">
            <div class="player-info">
                <h4>${player.username}</h4>
                <p>Ур. ${player.stats.level}</p>
                <p>Здоровье: ${player.stats.health}</p>
            </div>
        `;
        playerSlot.classList.add('current-player');
        
        // Добавление противников
        if (room.players > 1) {
            addMockOpponents(room.players - 1);
        }
    }

    function addMockOpponents(count) {
        const mockNames = ["Bobrito bandito", "Krakodilo banbordino", "Shpianino golubino", "Shampanzini bananini"];
        
        for (let i = 2; i <= count + 1; i++) {
            const slot = document.getElementById(`player-slot-${i}`);
            const name = mockNames[i-2];
            const gender = Math.random() > 0.5 ? 'male' : 'female';
            
            slot.innerHTML = `
                <img src="../assets/images/player_${gender}.png" alt="${name}">
                <div class="player-info">
                    <h4>${name}</h4>
                    <p>Ур. ${Math.floor(Math.random() * 10) + 1}</p>
                    <p>Здоровье: ${Math.floor(Math.random() * 50) + 50}</p>
                </div>
            `;
        }
    }

    function leaveRoom() {
        roomsContainer.style.display = 'block';
        battleRoom.style.display = 'none';
    }

    function startBattle() {
        // Проверяем, что выбраны способности
        const selected = Array.from(selectedAbilities)
            .filter(slot => slot.classList.contains('filled'))
            .map(slot => ({
                id: slot.dataset.abilityId,
                type: slot.dataset.abilityType,
                name: slot.title
            }));
        
        if (selected.length === 0) {
            alert('Выберите хотя бы одну способность для боя!');
            return;
        }
        
        // Получаем случайного противника
    const enemies = Array.from(document.querySelectorAll('.player-slot:not(.current-player)'))
    .filter(el => el.innerHTML.trim() !== '');

    if (enemies.length === 0) {
        alert('Нет противников для боя!');
        return;
    }

    const enemySlot = enemies[Math.floor(Math.random() * enemies.length)];
    const enemy = {
        name: enemySlot.querySelector('h4').textContent,
        level: parseInt(enemySlot.querySelector('p').textContent.replace('Ур. ', '')),
        health: 50 + Math.floor(Math.random() * 50),
        maxHealth: 50 + Math.floor(Math.random() * 50),
        attack: 10 + Math.floor(Math.random() * 10),
        image: enemySlot.querySelector('img').src
    };

    // Сохраняем данные для боя
    GameStorage.setBattleData({
        player: {
            ...player,
            selectedAbilities: selected,
            image: `../assets/images/player_${player.gender}.png`
        },
        enemy
    });

    // Переходим на экран боя
    window.location.href = '../html/battle-screen.html';
    }
});