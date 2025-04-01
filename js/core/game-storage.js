class Player {
    constructor(username, password) {
        this.username = username;
        this.password = password;
        this.gender = null;
        this.stats = {
            level: 1,
            experience: 0,
            health: 100,
            strength: 10,
            agility: 10,
            luck: 5
        };
        this.inventory = [];
        this.gold = 100;
        this.lastLogin = new Date().toISOString();
    }
}

class GameStorage {
    static getCurrentPlayer() {
        return JSON.parse(localStorage.getItem('currentPlayer'));
    }

    static setCurrentPlayer(player) {
        localStorage.setItem('currentPlayer', JSON.stringify(player));
    }

    static clearCurrentPlayer() {
        localStorage.removeItem('currentPlayer');
    }

    static playerExists(username) {
        const players = JSON.parse(localStorage.getItem('players')) || [];
        return players.some(p => p.username === username);
    }

    static getPlayerByCredentials(username, password) {
        const players = JSON.parse(localStorage.getItem('players')) || [];
        return players.find(p => p.username === username && p.password === password);
    }

    static savePlayer(player) {
        let players = JSON.parse(localStorage.getItem('players')) || [];
        const existingIndex = players.findIndex(p => p.username === player.username);
        
        if (existingIndex >= 0) {
            players[existingIndex] = player;
        } else {
            players.push(player);
        }
        
        localStorage.setItem('players', JSON.stringify(players));
    }

    static initializeNewPlayer(username, password) {
        return {
            username,
            password,
            gender: null,
            stats: {
                level: 1,
                experience: 0,
                health: 100,
                strength: 10,
                agility: 10,
                luck: 5
            },
            inventory: [],
            gold: 100,
            lastLogin: new Date().toISOString()
        };
    }

    static setBattleData(data) {
        localStorage.setItem('battleData', JSON.stringify(data));
    }

    static getBattleData() {
        const data = localStorage.getItem('battleData');
        return data ? JSON.parse(data) : null;
    }

    static clearBattleData() {
        localStorage.removeItem('battleData');
    }
    
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GameStorage, Player };
} else {
    window.GameStorage = GameStorage;
    window.Player = Player;
}