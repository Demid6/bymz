class Storage {
    static getPlayers() {
        const players = localStorage.getItem('boomz_players');
        return players ? JSON.parse(players) : [];
    }

    static savePlayers(players) {
        localStorage.setItem('boomz_players', JSON.stringify(players));
    }

    static playerExists(username) {
        const players = this.getPlayers();
        return players.some(p => p.username === username);
    }

    static getPlayerByCredentials(username, password) {
        const players = this.getPlayers();
        return players.find(p => p.username === username && p.password === password);
    }

    static savePlayer(player) {
        const players = this.getPlayers();
        const existingIndex = players.findIndex(p => p.username === player.username);
        
        if (existingIndex >= 0) {
            players[existingIndex] = player;
        } else {
            players.push(player);
        }
        
        this.savePlayers(players);
    }

    static getPlayer() {
        const currentPlayer = localStorage.getItem('boomz_current_player');
        return currentPlayer ? JSON.parse(currentPlayer) : null;
    }

    static setCurrentPlayer(player) {
        localStorage.setItem('boomz_current_player', JSON.stringify(player));
    }

    static clearCurrentPlayer() {
        localStorage.removeItem('boomz_current_player');
    }
}