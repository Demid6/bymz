export class RoundManager {
    constructor(scene) {
        this.scene = scene;
        this.timer = null;
    }

    startRound() {
        this.resetTimer();
        this.updateRoundDisplay();
    }

    resetTimer() {
        if (this.timer) this.timer.destroy();
        
        this.timer = this.scene.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });
    }

    updateTimer() {
        const roundInfo = document.getElementById('round-info');
        const timeLeft = parseInt(roundInfo.querySelector('#round-timer').textContent);
        
        if (timeLeft <= 1) {
            this.endTurn();
        } else {
            roundInfo.querySelector('#round-timer').textContent = timeLeft - 1;
        }
    }

    endTurn() {
        this.timer.destroy();
        this.scene.switchToNextPlayer();
    }

    updateRoundDisplay() {
        document.getElementById('round-number').textContent = 1;
        document.getElementById('round-timer').textContent = 30;
    }
}