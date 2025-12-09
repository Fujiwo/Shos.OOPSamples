/**
 * Role Playing Game のオブジェクト指向プログラミング実装例
 */

/**
 * キャラクターの基底クラス
 */
class Character {
    constructor(name, hitPoints, attackPower) {
        this._name = name;
        this._maxHitPoints = hitPoints;
        this._hitPoints = hitPoints;
        this._attackPower = attackPower;
    }

    getName() {
        return this._name;
    }

    getHitPoints() {
        return this._hitPoints;
    }

    getMaxHitPoints() {
        return this._maxHitPoints;
    }

    getAttackPower() {
        return this._attackPower;
    }

    isAlive() {
        return this._hitPoints > 0;
    }

    attack(target) {
        const damage = this._attackPower;
        target.takeDamage(damage);
        return damage;
    }

    takeDamage(damage) {
        this._hitPoints -= damage;
        if (this._hitPoints < 0) {
            this._hitPoints = 0;
        }
    }

    heal(amount) {
        this._hitPoints += amount;
        if (this._hitPoints > this._maxHitPoints) {
            this._hitPoints = this._maxHitPoints;
        }
    }
}

/**
 * プレイヤークラス
 */
class Player extends Character {
    constructor(name, hitPoints, attackPower) {
        super(name, hitPoints, attackPower);
        this._experience = 0;
        this._level = 1;
    }

    getExperience() {
        return this._experience;
    }

    getLevel() {
        return this._level;
    }

    gainExperience(exp) {
        this._experience += exp;
        
        const expNeeded = this._level * 100;
        if (this._experience >= expNeeded) {
            this.levelUp();
        }
    }

    levelUp() {
        this._level++;
        this._maxHitPoints += 10;
        this._hitPoints = this._maxHitPoints;
        this._attackPower += 5;
    }
}

/**
 * 敵クラス
 */
class Enemy extends Character {
    constructor(name, hitPoints, attackPower, expReward) {
        super(name, hitPoints, attackPower);
        this._expReward = expReward;
    }

    getExpReward() {
        return this._expReward;
    }
}

/**
 * 戦士クラス
 */
class Warrior extends Player {
    constructor(name) {
        super(name, 120, 20);
        this._icon = "🛡️";
    }

    getIcon() {
        return this._icon;
    }

    specialAbility(target) {
        const damage = this._attackPower * 2;
        target.takeDamage(damage);
        return { type: 'special', damage, message: 'パワーアタック！' };
    }
}

/**
 * 魔法使いクラス
 */
class Mage extends Player {
    constructor(name) {
        super(name, 80, 15);
        this._magicPower = 30;
        this._icon = "🔮";
    }

    getIcon() {
        return this._icon;
    }

    specialAbility(target) {
        const damage = this._magicPower;
        target.takeDamage(damage);
        return { type: 'special', damage, message: 'ファイアボール！' };
    }
}

/**
 * 盗賊クラス
 */
class Thief extends Player {
    constructor(name) {
        super(name, 90, 18);
        this._agility = 25;
        this._icon = "🗡️";
    }

    getIcon() {
        return this._icon;
    }

    attack(target) {
        if (Math.random() < 0.3) {
            // クリティカルヒット
            const damage = this._attackPower * 2;
            target.takeDamage(damage);
            return { type: 'critical', damage };
        } else {
            return { type: 'normal', damage: super.attack(target) };
        }
    }

    specialAbility(target) {
        const damage = this._attackPower * 3;
        target.takeDamage(damage);
        return { type: 'special', damage, message: 'アサシネイト！' };
    }
}

/**
 * ゲーム管理クラス
 */
class Game {
    constructor() {
        this.player = null;
        this.enemy = null;
        this.battleLog = [];
        this.currentEnemyIndex = 0;
        
        this.enemies = [
            { name: 'スライム', icon: '👾', hp: 30, attack: 10, exp: 50 },
            { name: 'ゴブリン', icon: '👺', hp: 50, attack: 15, exp: 80 },
            { name: 'オーク', icon: '😈', hp: 80, attack: 20, exp: 120 },
            { name: 'ドラゴン', icon: '🐉', hp: 150, attack: 30, exp: 200 }
        ];
    }

    selectCharacter(type) {
        const name = "勇者";
        switch(type) {
            case 'warrior':
                this.player = new Warrior(name);
                break;
            case 'mage':
                this.player = new Mage(name);
                break;
            case 'thief':
                this.player = new Thief(name);
                break;
        }
        
        this.startBattle();
    }

    startBattle() {
        this.battleLog = [];
        
        const enemyData = this.enemies[this.currentEnemyIndex];
        this.enemy = new Enemy(
            enemyData.name,
            enemyData.hp,
            enemyData.attack,
            enemyData.exp
        );
        this.enemy._icon = enemyData.icon;
        
        this.showScreen('battleScreen');
        this.updateUI();
        this.addLog(`${this.enemy.getName()}が現れた！`);
    }

    playerAttack() {
        if (!this.player.isAlive() || !this.enemy.isAlive()) return;
        
        const result = this.player.attack(this.enemy);
        let damage = result;
        let message = `${this.player.getName()}の攻撃！`;
        
        if (typeof result === 'object') {
            damage = result.damage;
            if (result.type === 'critical') {
                message += ' クリティカルヒット！';
            }
        }
        
        this.addLog(message, 'player');
        this.addLog(`${this.enemy.getName()}に${damage}のダメージ！`, 'player');
        
        this.shakeElement('enemy-panel');
        this.updateUI();
        
        if (!this.enemy.isAlive()) {
            this.victory();
            return;
        }
        
        setTimeout(() => this.enemyAttack(), 1000);
    }

    playerSpecialAbility() {
        if (!this.player.isAlive() || !this.enemy.isAlive()) return;
        
        const result = this.player.specialAbility(this.enemy);
        this.addLog(`${this.player.getName()}の必殺技: ${result.message}`, 'special');
        this.addLog(`${this.enemy.getName()}に${result.damage}のダメージ！`, 'special');
        
        this.shakeElement('enemy-panel');
        this.updateUI();
        
        if (!this.enemy.isAlive()) {
            this.victory();
            return;
        }
        
        setTimeout(() => this.enemyAttack(), 1000);
    }

    enemyAttack() {
        if (!this.player.isAlive() || !this.enemy.isAlive()) return;
        
        const damage = this.enemy.attack(this.player);
        this.addLog(`${this.enemy.getName()}の攻撃！`, 'enemy');
        this.addLog(`${this.player.getName()}に${damage}のダメージ！`, 'enemy');
        
        this.shakeElement('player-panel');
        this.updateUI();
        
        if (!this.player.isAlive()) {
            this.defeat();
        }
    }

    victory() {
        const exp = this.enemy.getExpReward();
        const oldLevel = this.player.getLevel();
        
        this.addLog(`${this.enemy.getName()}を倒した！`, 'special');
        this.addLog(`${exp}の経験値を獲得！`, 'special');
        
        this.player.gainExperience(exp);
        
        let message = `${this.enemy.getName()}を倒した！<br>${exp}の経験値を獲得！`;
        
        if (this.player.getLevel() > oldLevel) {
            this.addLog(`レベルアップ！ Lv.${this.player.getLevel()}`, 'special');
            message += `<br><br>*** レベルアップ！ ***<br>Lv.${this.player.getLevel()}<br>HP: ${this.player.getMaxHitPoints()}<br>攻撃力: ${this.player.getAttackPower()}`;
        }
        
        this.updateUI();
        
        setTimeout(() => {
            document.getElementById('resultTitle').textContent = '勝利！';
            document.getElementById('resultMessage').innerHTML = message;
            this.showScreen('resultScreen');
        }, 1500);
    }

    defeat() {
        this.addLog(`${this.player.getName()}は倒れた...`, 'special');
        
        setTimeout(() => {
            document.getElementById('resultTitle').textContent = '敗北...';
            document.getElementById('resultMessage').innerHTML = `${this.player.getName()}は倒れた...<br>もう一度挑戦しましょう！`;
            this.showScreen('resultScreen');
        }, 1500);
    }

    nextBattle() {
        if (this.currentEnemyIndex < this.enemies.length - 1) {
            this.currentEnemyIndex++;
            this.startBattle();
        } else {
            document.getElementById('resultTitle').textContent = 'おめでとう！';
            document.getElementById('resultMessage').innerHTML = 'すべての敵を倒しました！<br>ゲームクリア！';
        }
    }

    restart() {
        this.currentEnemyIndex = 0;
        this.player = null;
        this.enemy = null;
        this.battleLog = [];
        this.showScreen('characterSelection');
    }

    updateUI() {
        if (this.player) {
            document.getElementById('playerIcon').textContent = this.player.getIcon();
            document.getElementById('playerName').textContent = this.player.getName();
            document.getElementById('playerHp').textContent = this.player.getHitPoints();
            document.getElementById('playerMaxHp').textContent = this.player.getMaxHitPoints();
            document.getElementById('playerLevel').textContent = this.player.getLevel();
            document.getElementById('playerExp').textContent = this.player.getExperience();
        }
        
        if (this.enemy) {
            document.getElementById('enemyIcon').textContent = this.enemy._icon;
            document.getElementById('enemyName').textContent = this.enemy.getName();
            document.getElementById('enemyHp').textContent = this.enemy.getHitPoints();
            document.getElementById('enemyMaxHp').textContent = this.enemy.getMaxHitPoints();
        }
    }

    addLog(message, type = '') {
        const logDiv = document.getElementById('battleLog');
        const entry = document.createElement('div');
        entry.className = `log-entry ${type}`;
        entry.textContent = message;
        logDiv.appendChild(entry);
        logDiv.scrollTop = logDiv.scrollHeight;
    }

    shakeElement(className) {
        const element = document.querySelector(`.${className}`);
        if (element) {
            element.classList.add('shake');
            setTimeout(() => element.classList.remove('shake'), 500);
        }
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }
}

// グローバル変数としてゲームインスタンスを作成
let game;

document.addEventListener('DOMContentLoaded', () => {
    game = new Game();
});
