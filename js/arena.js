document.addEventListener('DOMContentLoaded', function() {
    const player = Storage.getPlayer();
    if (!player) {
        window.location.href = 'index.html';
        return;
    }

    const roomsContainer = document.getElementById('rooms-container');
    const battleRoom = document.getElementById('battle-room');
    const backBtn = document.getElementById('arena-back-btn');
    const createRoomBtn = document.getElementById('create-room-btn');
    const startBattleBtn = document.getElementById('start-battle-btn');
    const leaveRoomBtn = document.getElementById('leave-room-btn');
    const roomsList = document.querySelector('.rooms-list');

    // Пример данных о комнатах (в реальном приложении это бы приходило с сервера)
    const rooms = [
        { id: 'room1', name: 'Комната новичков', players: 1, maxPlayers: 4 },
        { id: 'room2', name: 'Профессионалы', players: 3, maxPlayers: 4 },
        { id: 'room3', name: 'Средний уровень', players: 2, maxPlayers: 4 }
    ];

    // Отображаем список комнат
    renderRooms();

    // Назад в главное меню
    backBtn.addEventListener('click', function() {
        window.location.href = 'main-menu.html';
    });

    // Создать комнату
    createRoomBtn.addEventListener('click', function() {
        const newRoom = {
            id: 'room' + Date.now(),
            name: 'Комната ' + player.username,
            players: 1,
            maxPlayers: 4
        };
        
        rooms.push(newRoom);
        joinRoom(newRoom);
    });

    // Покинуть комнату
    leaveRoomBtn.addEventListener('click', function() {
        roomsContainer.style.display = 'block';
        battleRoom.style.display = 'none';
    });

    function renderRooms() {
        roomsList.innerHTML = '';
        
        rooms.forEach(room => {
            const roomEl = document.createElement('div');
            roomEl.className = 'room-item';
            roomEl.innerHTML = `
                <h3>${room.name}</h3>
                <p>Игроков: ${room.players}/${room.maxPlayers}</p>
                <button class="join-room-btn" data-room-id="${room.id}">
                    ${room.players === room.maxPlayers ? 'Комната заполнена' : 'Присоединиться'}
                </button>
            `;
            
            roomsList.appendChild(roomEl);
            
            const joinBtn = roomEl.querySelector('.join-room-btn');
            if (room.players === room.maxPlayers) {
                joinBtn.disabled = true;
            } else {
                joinBtn.addEventListener('click', function() {
                    joinRoom(room);
                });
            }
        });
    }

    function joinRoom(room) {
        roomsContainer.style.display = 'none';
        battleRoom.style.display = 'block';
        
        // Очищаем слоты
        for (let i = 1; i <= 4; i++) {
            const slot = document.getElementById(`player-slot-${i}`);
            slot.innerHTML = '';
            slot.className = 'player-slot';
        }
        
        // Добавляем текущего игрока в первый слот
        const playerSlot = document.getElementById('player-slot-1');
        playerSlot.innerHTML = `
            <img src="assets/images/${player.gender}-character.png" alt="${player.username}">
            <p>${player.username}</p>
        `;
        playerSlot.classList.add('current-player');
        
        // В реальном приложении здесь бы подгружались другие игроки
    }
});