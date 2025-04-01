class Player {
    constructor(data) {
        this.username = data.username;
        this.password = data.password;
        this.gender = data.gender;
        this.stats = data.stats;
        this.inventory = data.inventory;
        this.gold = data.gold;
        this.lastLogin = data.lastLogin;
    }

    addItem(item) {
        this.inventory.push(item);
    }

    removeItem(itemId) {
        this.inventory = this.inventory.filter(item => item.id !== itemId);
    }

    addGold(amount) {
        this.gold += amount;
    }

    spendGold(amount) {
        if (this.gold >= amount) {
            this.gold -= amount;
            return true;
        }
        return false;
    }

    gainExperience(amount) {
        this.stats.experience += amount;
        // Проверка на повышение уровня
        const expNeeded = this.stats.level * 100;
        if (this.stats.experience >= expNeeded) {
            this.stats.level += 1;
            this.stats.experience -= expNeeded;
            return true; // Уровень повышен
        }
        return false;
    }
}