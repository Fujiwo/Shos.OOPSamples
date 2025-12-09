/**
 * アナログ時計のオブジェクト指向プログラミング実装例
 */

/**
 * 針の基底クラス
 */
class Hand {
    /**
     * @param {number} speed - 回転速度（度/秒）
     */
    constructor(speed) {
        this._angle = 0;
        this._speed = speed;
    }

    /**
     * 針を回転させる
     * @param {number} seconds - 経過秒数
     */
    rotate(seconds) {
        this._angle = (this._angle + this._speed * seconds) % 360;
    }

    /**
     * 現在の角度を取得
     * @returns {number} 角度（0-360度）
     */
    getAngle() {
        return this._angle;
    }

    /**
     * 角度を設定
     * @param {number} angle - 設定する角度
     */
    setAngle(angle) {
        this._angle = angle % 360;
    }
}

/**
 * 時針クラス
 */
class HourHand extends Hand {
    constructor() {
        // 12時間で360度回転: 360/(12*60*60) = 0.00833...度/秒
        super(360 / (12 * 60 * 60));
    }
}

/**
 * 分針クラス
 */
class MinuteHand extends Hand {
    constructor() {
        // 60分で360度回転: 360/(60*60) = 0.1度/秒
        super(360 / (60 * 60));
    }
}

/**
 * 秒針クラス
 */
class SecondHand extends Hand {
    constructor() {
        // 60秒で360度回転: 360/60 = 6度/秒
        super(360 / 60);
    }
}

/**
 * 時計盤クラス
 */
class ClockFace {
    constructor() {
        this._hands = [];
        this._hourHand = new HourHand();
        this._minuteHand = new MinuteHand();
        this._secondHand = new SecondHand();

        this.addHand(this._hourHand);
        this.addHand(this._minuteHand);
        this.addHand(this._secondHand);
    }

    /**
     * 針を追加
     * @param {Hand} hand - 追加する針
     */
    addHand(hand) {
        this._hands.push(hand);
    }

    /**
     * 時刻を設定
     * @param {number} hour - 時
     * @param {number} minute - 分
     * @param {number} second - 秒
     */
    setTime(hour, minute, second) {
        // 12時間表記に変換
        hour = hour % 12;

        // 各針の角度を計算（12時が0度、時計回り）
        this._hourHand.setAngle(30 * hour + 0.5 * minute + 0.5 * second / 60);
        this._minuteHand.setAngle(6 * minute + 0.1 * second);
        this._secondHand.setAngle(6 * second);
    }

    /**
     * すべての針を更新
     * @param {number} seconds - 経過秒数
     */
    update(seconds = 1) {
        for (const hand of this._hands) {
            hand.rotate(seconds);
        }
    }

    /**
     * キャンバスに時計を描画
     * @param {CanvasRenderingContext2D} ctx - キャンバスコンテキスト
     * @param {number} centerX - 中心X座標
     * @param {number} centerY - 中心Y座標
     * @param {number} radius - 半径
     */
    draw(ctx, centerX, centerY, radius) {
        // 時計盤の背景
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fill();

        // 外枠
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.stroke();

        // 目盛り
        this._drawMarkers(ctx, centerX, centerY, radius);

        // 針を描画
        this._drawHand(ctx, centerX, centerY, this._hourHand.getAngle(), radius * 0.5, 6, '#333');
        this._drawHand(ctx, centerX, centerY, this._minuteHand.getAngle(), radius * 0.7, 4, '#666');
        this._drawHand(ctx, centerX, centerY, this._secondHand.getAngle(), radius * 0.8, 2, '#e74c3c');

        // 中心の円
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
        ctx.fill();
    }

    /**
     * 目盛りを描画
     */
    _drawMarkers(ctx, centerX, centerY, radius) {
        for (let i = 0; i < 12; i++) {
            const angle = (i * 30 - 90) * Math.PI / 180;
            const x1 = centerX + Math.cos(angle) * radius * 0.85;
            const y1 = centerY + Math.sin(angle) * radius * 0.85;
            const x2 = centerX + Math.cos(angle) * radius * 0.95;
            const y2 = centerY + Math.sin(angle) * radius * 0.95;

            ctx.strokeStyle = '#333';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
    }

    /**
     * 針を描画
     */
    _drawHand(ctx, centerX, centerY, angle, length, width, color) {
        const radians = (angle - 90) * Math.PI / 180;
        const x = centerX + Math.cos(radians) * length;
        const y = centerY + Math.sin(radians) * length;

        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();
    }

    /**
     * 時刻を取得
     * @returns {Object} 時、分、秒を含むオブジェクト
     */
    getTime() {
        const hour = Math.floor(this._hourHand.getAngle() / 30) % 12;
        const minute = Math.floor(this._minuteHand.getAngle() / 6) % 60;
        const second = Math.floor(this._secondHand.getAngle() / 6) % 60;
        return { hour, minute, second };
    }

    /**
     * 各針の角度を取得
     * @returns {Object} 各針の角度
     */
    getAngles() {
        return {
            hour: this._hourHand.getAngle(),
            minute: this._minuteHand.getAngle(),
            second: this._secondHand.getAngle()
        };
    }
}

// メイン処理
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('clockCanvas');
    const ctx = canvas.getContext('2d');
    const timeDisplay = document.getElementById('timeDisplay');
    const angleDisplay = document.getElementById('angleDisplay');

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 180;

    // 時計を作成
    const clock = new ClockFace();

    // 初期化と更新処理
    function updateClock() {
        // 現在時刻を取得して設定
        const now = new Date();
        clock.setTime(now.getHours(), now.getMinutes(), now.getSeconds());

        // キャンバスをクリア
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 時計を描画
        clock.draw(ctx, centerX, centerY, radius);

        // 情報を表示
        const time = clock.getTime();
        const angles = clock.getAngles();

        timeDisplay.textContent = 
            `${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}:${String(time.second).padStart(2, '0')}`;
        
        angleDisplay.innerHTML = 
            `時針: ${angles.hour.toFixed(1)}°<br>` +
            `分針: ${angles.minute.toFixed(1)}°<br>` +
            `秒針: ${angles.second.toFixed(1)}°`;
    }

    // 初回描画
    updateClock();

    // 1秒ごとに更新
    setInterval(updateClock, 1000);
});
