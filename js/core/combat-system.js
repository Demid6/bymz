class CombatSystem {
    constructor(player, enemy) {
        this.player = player;
        this.enemy = enemy;
        this.currentTurn = 'player';
        this.currentPhase = 'aiming'; // 'aiming', 'charging', 'flying'
        this.aimAngle = 45;
        this.power = 0;
        this.chargeInterval = null;
        this.POWER_INCREMENT = 2;
        this.projectiles = [];
        this.platforms = [];
        
        this.battleField = document.querySelector('.battle-field');
        this.battleControls = document.getElementById('battle-controls');
        this.battleLog = document.getElementById('battle-log');
        this.returnBtn = document.getElementById('return-to-arena-btn');
        
        this.initBattle();
    }
    
    initBattle() {
        // Установка изображений и имен
        document.getElementById('player-image').style.backgroundImage = `url('${this.player.image}')`;
        document.getElementById('player-name').textContent = this.player.username;
        document.getElementById('enemy-image').style.backgroundImage = `url('${this.enemy.image}')`;
        document.getElementById('enemy-name').textContent = this.enemy.name;

        // Установка здоровья
        this.updateHealthBars();

        // Создание кнопок способностей
        this.player.selectedAbilities.forEach(ability => {
            const btn = document.createElement('button');
            btn.className = 'ability-btn';
            btn.innerHTML = `${ability.icon} ${ability.name}`;
            btn.dataset.type = ability.type;
            btn.addEventListener('click', () => this.performAction(ability.type));
            this.battleControls.appendChild(btn);
        });

        // Создание платформ
        this.createPlatforms();
        
        // Создание интерфейса прицеливания
        this.createAimInterface();
        
        // Логирование начала боя
        this.addLogEntry(`⚔️ Бой начинается: ${this.player.username} против ${this.enemy.name}!`, 'battle-start');
        
        // Обновление индикатора хода
        this.updateTurnIndicator();
        
        // Обработчики событий
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
        this.returnBtn.addEventListener('click', () => {
            window.location.href = '../html/arena.html';
        });
    }
    
    createPlatforms() {
        const platformsContainer = document.createElement('div');
        platformsContainer.className = 'ground-platforms';
        
        // Создаем 3-5 случайных платформ
        const platformCount = 3 + Math.floor(Math.random() * 3);
        const platformWidths = [150, 200, 250];
        
        for (let i = 0; i < platformCount; i++) {
            const platform = document.createElement('div');
            platform.className = 'platform';
            
            const width = platformWidths[Math.floor(Math.random() * platformWidths.length)];
            const height = 20 + Math.floor(Math.random() * 30);
            
            const maxLeft = this.battleField.offsetWidth - width;
            const left = Math.max(0, Math.floor(Math.random() * maxLeft));
            const bottom = 50 + Math.floor(Math.random() * 150);
            
            platform.style.width = `${width}px`;
            platform.style.height = `${height}px`;
            platform.style.left = `${left}px`;
            platform.style.bottom = `${bottom}px`;
            
            // Сохраняем данные платформы для коллизий
            this.platforms.push({
                element: platform,
                x: left,
                y: bottom,
                width: width,
                height: height
            });
            
            platformsContainer.appendChild(platform);
        }
        
        this.battleField.appendChild(platformsContainer);
    }
    
    createAimInterface() {
        const aimIndicator = document.createElement('div');
        aimIndicator.id = 'aim-indicator';
        document.querySelector('.player-combatant').appendChild(aimIndicator);
        
        const powerBar = document.createElement('div');
        powerBar.id = 'power-bar';
        powerBar.innerHTML = `
            <div class="power-container">
                <div class="power-level"></div>
            </div>
        `;
        document.querySelector('.player-combatant').appendChild(powerBar);
        
        const helpText = document.createElement('div');
        helpText.id = 'aim-help';
        helpText.innerHTML = `
            <p>↑/↓: Изменить угол</p>
            <p>Пробел: Зарядить и выстрелить</p>
        `;
        this.battleField.appendChild(helpText);
        
        this.startAimingPhase();
    }
    
    startAimingPhase() {
        this.currentPhase = 'aiming';
        this.aimAngle = 45;
        this.power = 0;
        
        document.getElementById('aim-indicator').style.display = 'block';
        document.getElementById('power-bar').style.display = 'none';
        document.getElementById('aim-help').style.display = 'block';
        
        this.updateAimIndicator();
    }
    
    startChargingPhase() {
        this.currentPhase = 'charging';
        this.power = 0;
        
        document.getElementById('aim-indicator').style.display = 'none';
        document.getElementById('power-bar').style.display = 'block';
        
        // Анимация заряда силы
        this.chargeInterval = setInterval(() => {
            this.power = Math.min(100, this.power + this.POWER_INCREMENT);
            document.querySelector('.power-level').style.width = `${this.power}%`;
            
            if (this.power >= 100) {
                clearInterval(this.chargeInterval);
                this.fireProjectile();
            }
        }, 50);
    }
    
    fireProjectile() {
        clearInterval(this.chargeInterval);
        this.currentPhase = 'flying';
        
        // Скрываем интерфейс прицеливания
        document.getElementById('power-bar').style.display = 'none';
        document.getElementById('aim-help').style.display = 'none';
        
        // Вычисляем урон на основе силы
        const damage = this.calculateDamage(this.player.stats.strength, this.power/100, 0.2);
        
        // Создаем снаряд
        this.createProjectile('player', 'enemy', damage, 'standard');
        
        // Логируем действие
        this.addLogEntry(`🎯 ${this.player.username} стреляет (${this.aimAngle}°, ${this.power}%)`);
    }
    
    updateAimIndicator() {
        const indicator = document.getElementById('aim-indicator');
        indicator.style.transform = `rotate(${-this.aimAngle}deg)`;
    }
    
    handleKeyDown(e) {
        if (this.currentTurn !== 'player') return;
        
        switch(e.key) {
            case 'ArrowUp':
                if (this.currentPhase === 'aiming') {
                    this.aimAngle = Math.min(85, this.aimAngle + 5);
                    this.updateAimIndicator();
                }
                break;
            case 'ArrowDown':
                if (this.currentPhase === 'aiming') {
                    this.aimAngle = Math.max(5, this.aimAngle - 5);
                    this.updateAimIndicator();
                }
                break;
            case ' ':
                if (this.currentPhase === 'aiming') {
                    this.startChargingPhase();
                }
                break;
        }
    }
    
    handleKeyUp(e) {
        if (e.key === ' ' && this.currentPhase === 'charging') {
            clearInterval(this.chargeInterval);
            this.fireProjectile();
        }
    }
    
    createProjectile(from, to, damage, type) {
        const fromElement = document.querySelector(`.${from}-combatant .character-image`);
        const toElement = document.querySelector(`.${to}-combatant .character-image`);
        
        const projectile = document.createElement('div');
        projectile.className = `projectile ${type}`;
        
        const fromRect = fromElement.getBoundingClientRect();
        const toRect = toElement.getBoundingClientRect();
        
        const startX = fromRect.left + fromRect.width/2;
        const startY = fromRect.top + fromRect.height/2;
        
        // Рассчитываем траекторию с учетом угла и силы
        const angleRad = this.aimAngle * Math.PI / 180;
        const distance = 300 * (this.power / 100); // Макс дистанция
        
        const endX = startX + Math.cos(angleRad) * distance;
        const endY = startY - Math.sin(angleRad) * distance;
        
        projectile.style.left = `${startX}px`;
        projectile.style.top = `${startY}px`;
        
        document.body.appendChild(projectile);
        
        // Анимация полета снаряда
        projectile.style.setProperty('--end-x', `${endX - startX}px`);
        projectile.style.setProperty('--end-y', `${endY - startY}px`);
        
        projectile.classList.add('flying');
        
        setTimeout(() => {
            projectile.remove();
            
            // Эффект попадания
            const hitEffect = document.createElement('div');
            hitEffect.className = 'hit-effect';
            hitEffect.style.left = `${endX}px`;
            hitEffect.style.top = `${endY}px`;
            document.body.appendChild(hitEffect);
            
            setTimeout(() => hitEffect.remove(), 500);
            
            // Применение урона
            if (to === 'enemy') {
                this.enemy.health -= damage;
                
                if (this.enemy.health <= 0) {
                    this.enemy.health = 0;
                    this.updateHealthBars();
                    setTimeout(() => this.endBattle(true), 1000);
                    return;
                }
            } else {
                this.player.stats.health -= damage;
                
                if (this.player.stats.health <= 0) {
                    this.player.stats.health = 0;
                    this.updateHealthBars();
                    setTimeout(() => this.endBattle(false), 1000);
                    return;
                }
            }
            
            this.updateHealthBars();
            
            if (to === 'enemy') {
                setTimeout(() => this.enemyTurn(), 1000);
            }
        }, 1000);
    }
    
    performAction(action) {
        // Блокируем кнопки на время анимации
        document.querySelectorAll('.ability-btn').forEach(btn => btn.disabled = true);
        
        let playerDamage = 0;
        let enemyDamage = 0;
        let message = '';
        
        const playerImg = document.getElementById('player-image');
        playerImg.classList.add('attacking');

        switch(action) {
            case 'attack':
                playerDamage = this.calculateDamage(this.player.stats.strength, 0.8, 0.4);
                message = `💥 ${this.player.username} стреляет (${playerDamage} урона)`;
                this.createProjectile('player', 'enemy', playerDamage, 'standard');
                break;
                
            case 'critical':
                playerDamage = this.calculateDamage(this.player.stats.strength, 1.5, 0.8);
                message = `🔥 ${this.player.username} наносит критический удар (${playerDamage} урона)!`;
                this.createProjectile('player', 'enemy', playerDamage, 'critical');
                break;
                
            case 'defense':
                playerDamage = this.calculateDamage(this.player.stats.strength, 0.3, 0.2);
                enemyDamage = this.calculateDamage(this.enemy.attack, 0.3, 0.2);
                message = `🛡️ ${this.player.username} защищается и контратакует (${playerDamage} урона)`;
                this.createProjectile('player', 'enemy', playerDamage, 'defensive');
                break;
                
            case 'heal':
                const healAmount = Math.floor(this.player.stats.strength * 0.5);
                this.player.stats.health = Math.min(100, this.player.stats.health + healAmount);
                this.addLogEntry(`❤️ ${this.player.username} восстанавливает ${healAmount} здоровья!`, 'heal');
                this.updateHealthBars();
                
                // Эффект лечения
                const healEffect = document.createElement('div');
                healEffect.className = 'heal-effect';
                document.querySelector('.player-combatant').appendChild(healEffect);
                setTimeout(() => healEffect.remove(), 1000);
                
                setTimeout(() => this.enemyTurn(), 1500);
                return;
        }

        this.addLogEntry(message);
        setTimeout(() => {
            playerImg.classList.remove('attacking');
            if (action !== 'heal') {
                setTimeout(() => this.enemyTurn(), 1000);
            }
        }, 500);
    }
    
    enemyTurn() {
        document.querySelectorAll('.ability-btn').forEach(btn => btn.disabled = true);
        
        const enemyImg = document.getElementById('enemy-image');
        enemyImg.classList.add('attacking');
        
        setTimeout(() => {
            const damage = this.calculateDamage(this.enemy.attack, 0.7, 0.6);
            this.addLogEntry(`💣 ${this.enemy.name} атакует (${damage} урона)`);
            
            this.createProjectile('enemy', 'player', damage, 'enemy');
            
            setTimeout(() => {
                enemyImg.classList.remove('attacking');
                document.querySelectorAll('.ability-btn').forEach(btn => btn.disabled = false);
                this.startAimingPhase();
            }, 500);
        }, 1000);
    }
    
    calculateDamage(base, multiplier, variance) {
        return Math.floor(base * (multiplier + Math.random() * variance));
    }
    
    updateHealthBars() {
        const playerHealthPercent = (this.player.stats.health / 100) * 100;
        const enemyHealthPercent = (this.enemy.health / this.enemy.maxHealth) * 100;
        
        document.getElementById('player-health').style.width = `${playerHealthPercent}%`;
        document.getElementById('enemy-health').style.width = `${enemyHealthPercent}%`;
        
        document.getElementById('player-health-text').textContent = `${this.player.stats.health}/100`;
        document.getElementById('enemy-health-text').textContent = `${this.enemy.health}/${this.enemy.maxHealth}`;
        
        // Анимация изменения здоровья
        if (playerHealthPercent < 30) {
            document.getElementById('player-health').classList.add('critical');
        } else {
            document.getElementById('player-health').classList.remove('critical');
        }
        
        if (enemyHealthPercent < 30) {
            document.getElementById('enemy-health').classList.add('critical');
        } else {
            document.getElementById('enemy-health').classList.remove('critical');
        }
    }
    
    endBattle(victory) {
        this.battleControls.style.display = 'none';
        this.returnBtn.style.display = 'block';
        
        if (victory) {
            const expGain = Math.floor(this.enemy.level * 10);
            this.player.stats.experience += expGain;
            
            // Эффект победы
            const victoryEffect = document.createElement('div');
            victoryEffect.className = 'victory-effect';
            document.querySelector('.player-combatant').appendChild(victoryEffect);
            
            this.addLogEntry(`🎉 ПОБЕДА! Вы получаете ${expGain} опыта!`, 'victory');
        } else {
            // Эффект поражения
            const defeatEffect = document.createElement('div');
            defeatEffect.className = 'defeat-effect';
            document.querySelector('.player-combatant').appendChild(defeatEffect);
            
            this.addLogEntry('☠️ Поражение! Вы чудом выжили...', 'defeat');
        }
        
        GameStorage.savePlayer(this.player);
    }
    
    addLogEntry(message, type = '') {
        const entry = document.createElement('div');
        entry.className = `log-entry ${type}`;
        entry.innerHTML = message;
        this.battleLog.appendChild(entry);
        this.battleLog.scrollTop = this.battleLog.scrollHeight;
    }
    
    updateTurnIndicator() {
        const indicator = document.getElementById('turn-indicator');
        if (this.currentTurn === 'player') {
            indicator.textContent = `Ваш ход (${this.player.username})`;
            indicator.style.color = '#4CAF50';
        } else {
            indicator.textContent = `Ход противника (${this.enemy.name})`;
            indicator.style.color = '#F44336';
        }
    }
}