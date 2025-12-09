/**
 * お絵描きアプリのオブジェクト指向プログラミング実装例
 */

/**
 * 図形の基底クラス
 */
class Shape {
    /**
     * @param {string} color - 図形の色
     * @param {number} lineWidth - 線の太さ
     */
    constructor(color = "black", lineWidth = 2) {
        this._color = color;
        this._lineWidth = lineWidth;
    }

    /**
     * 図形を描画（サブクラスでオーバーライド）
     * @param {CanvasRenderingContext2D} ctx - 描画コンテキスト
     */
    draw(ctx) {
        throw new Error('draw() must be implemented by subclass');
    }

    /**
     * 色を取得
     * @returns {string} 色
     */
    getColor() {
        return this._color;
    }

    /**
     * 線の太さを取得
     * @returns {number} 線の太さ
     */
    getLineWidth() {
        return this._lineWidth;
    }
}

/**
 * 直線クラス
 */
class Line extends Shape {
    /**
     * @param {number} startX - 開始X座標
     * @param {number} startY - 開始Y座標
     * @param {number} endX - 終了X座標
     * @param {number} endY - 終了Y座標
     * @param {string} color - 線の色
     * @param {number} lineWidth - 線の太さ
     */
    constructor(startX, startY, endX, endY, color = "black", lineWidth = 2) {
        super(color, lineWidth);
        this._startX = startX;
        this._startY = startY;
        this._endX = endX;
        this._endY = endY;
    }

    /**
     * 直線を描画
     * @param {CanvasRenderingContext2D} ctx - 描画コンテキスト
     */
    draw(ctx) {
        ctx.beginPath();
        ctx.moveTo(this._startX, this._startY);
        ctx.lineTo(this._endX, this._endY);
        ctx.strokeStyle = this._color;
        ctx.lineWidth = this._lineWidth;
        ctx.lineCap = 'round';
        ctx.stroke();
    }
}

/**
 * 円クラス
 */
class Circle extends Shape {
    /**
     * @param {number} centerX - 中心X座標
     * @param {number} centerY - 中心Y座標
     * @param {number} radius - 半径
     * @param {string} color - 線の色
     * @param {number} lineWidth - 線の太さ
     */
    constructor(centerX, centerY, radius, color = "black", lineWidth = 2) {
        super(color, lineWidth);
        this._centerX = centerX;
        this._centerY = centerY;
        this._radius = radius;
    }

    /**
     * 円を描画
     * @param {CanvasRenderingContext2D} ctx - 描画コンテキスト
     */
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this._centerX, this._centerY, this._radius, 0, Math.PI * 2);
        ctx.strokeStyle = this._color;
        ctx.lineWidth = this._lineWidth;
        ctx.stroke();
    }
}

/**
 * 四角形クラス
 */
class Rectangle extends Shape {
    /**
     * @param {number} x - 左上X座標
     * @param {number} y - 左上Y座標
     * @param {number} width - 幅
     * @param {number} height - 高さ
     * @param {string} color - 線の色
     * @param {number} lineWidth - 線の太さ
     */
    constructor(x, y, width, height, color = "black", lineWidth = 2) {
        super(color, lineWidth);
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
    }

    /**
     * 四角形を描画
     * @param {CanvasRenderingContext2D} ctx - 描画コンテキスト
     */
    draw(ctx) {
        ctx.beginPath();
        ctx.rect(this._x, this._y, this._width, this._height);
        ctx.strokeStyle = this._color;
        ctx.lineWidth = this._lineWidth;
        ctx.stroke();
    }
}

/**
 * パス（フリーハンド）クラス
 */
class Path extends Shape {
    /**
     * @param {string} color - 線の色
     * @param {number} lineWidth - 線の太さ
     */
    constructor(color = "black", lineWidth = 2) {
        super(color, lineWidth);
        this._points = [];
    }

    /**
     * 座標点を追加
     * @param {number} x - X座標
     * @param {number} y - Y座標
     */
    addPoint(x, y) {
        this._points.push({ x, y });
    }

    /**
     * パスを描画
     * @param {CanvasRenderingContext2D} ctx - 描画コンテキスト
     */
    draw(ctx) {
        if (this._points.length < 2) {
            return;
        }

        ctx.beginPath();
        ctx.moveTo(this._points[0].x, this._points[0].y);
        
        for (let i = 1; i < this._points.length; i++) {
            ctx.lineTo(this._points[i].x, this._points[i].y);
        }
        
        ctx.strokeStyle = this._color;
        ctx.lineWidth = this._lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
    }
}

/**
 * 描画ツールの基底クラス
 */
class Tool {
    /**
     * @param {string} color - 描画色
     * @param {number} lineWidth - 線の太さ
     */
    constructor(color = "black", lineWidth = 2) {
        this._color = color;
        this._lineWidth = lineWidth;
    }

    /**
     * マウス押下時の処理
     * @param {number} x - X座標
     * @param {number} y - Y座標
     */
    onPress(x, y) {
        throw new Error('onPress() must be implemented by subclass');
    }

    /**
     * ドラッグ時の処理
     * @param {number} x - X座標
     * @param {number} y - Y座標
     */
    onDrag(x, y) {
        throw new Error('onDrag() must be implemented by subclass');
    }

    /**
     * マウス離した時の処理
     * @param {number} x - X座標
     * @param {number} y - Y座標
     * @returns {Shape} 作成された図形
     */
    onRelease(x, y) {
        throw new Error('onRelease() must be implemented by subclass');
    }

    /**
     * 色を設定
     * @param {string} color - 色
     */
    setColor(color) {
        this._color = color;
    }

    /**
     * 線の太さを設定
     * @param {number} lineWidth - 線の太さ
     */
    setLineWidth(lineWidth) {
        this._lineWidth = lineWidth;
    }
}

/**
 * ペンツールクラス
 */
class PenTool extends Tool {
    constructor(color = "black", lineWidth = 2) {
        super(color, lineWidth);
        this._currentPath = null;
    }

    /**
     * マウス押下時：新しいパスを開始
     */
    onPress(x, y) {
        this._currentPath = new Path(this._color, this._lineWidth);
        this._currentPath.addPoint(x, y);
    }

    /**
     * ドラッグ時：座標を追加
     */
    onDrag(x, y) {
        if (this._currentPath) {
            this._currentPath.addPoint(x, y);
        }
    }

    /**
     * マウス離した時：パスを完成
     */
    onRelease(x, y) {
        if (this._currentPath) {
            this._currentPath.addPoint(x, y);
        }
        return this._currentPath;
    }

    /**
     * 現在のパスを取得（リアルタイム描画用）
     */
    getCurrentPath() {
        return this._currentPath;
    }
}

/**
 * 直線ツールクラス
 */
class LineTool extends Tool {
    constructor(color = "black", lineWidth = 2) {
        super(color, lineWidth);
        this._startX = 0;
        this._startY = 0;
    }

    /**
     * マウス押下時：開始点を記録
     */
    onPress(x, y) {
        this._startX = x;
        this._startY = y;
    }

    /**
     * ドラッグ時：何もしない
     */
    onDrag(x, y) {
        // プレビュー表示は省略
    }

    /**
     * マウス離した時：直線を作成
     */
    onRelease(x, y) {
        return new Line(this._startX, this._startY, x, y, this._color, this._lineWidth);
    }
}

/**
 * 円ツールクラス
 */
class CircleTool extends Tool {
    constructor(color = "black", lineWidth = 2) {
        super(color, lineWidth);
        this._startX = 0;
        this._startY = 0;
    }

    /**
     * マウス押下時：中心点を記録
     */
    onPress(x, y) {
        this._startX = x;
        this._startY = y;
    }

    /**
     * ドラッグ時：何もしない
     */
    onDrag(x, y) {
        // プレビュー表示は省略
    }

    /**
     * マウス離した時：円を作成
     */
    onRelease(x, y) {
        const dx = x - this._startX;
        const dy = y - this._startY;
        const radius = Math.sqrt(dx * dx + dy * dy);
        return new Circle(this._startX, this._startY, radius, this._color, this._lineWidth);
    }
}

/**
 * 四角形ツールクラス
 */
class RectangleTool extends Tool {
    constructor(color = "black", lineWidth = 2) {
        super(color, lineWidth);
        this._startX = 0;
        this._startY = 0;
    }

    /**
     * マウス押下時：開始点を記録
     */
    onPress(x, y) {
        this._startX = x;
        this._startY = y;
    }

    /**
     * ドラッグ時：何もしない
     */
    onDrag(x, y) {
        // プレビュー表示は省略
    }

    /**
     * マウス離した時：四角形を作成
     */
    onRelease(x, y) {
        const width = x - this._startX;
        const height = y - this._startY;
        return new Rectangle(this._startX, this._startY, width, height, this._color, this._lineWidth);
    }
}

/**
 * 描画キャンバスクラス
 */
class DrawingCanvas {
    /**
     * @param {number} width - キャンバスの幅
     * @param {number} height - キャンバスの高さ
     */
    constructor(width = 800, height = 600) {
        this._shapes = [];
        this._width = width;
        this._height = height;
    }

    /**
     * 図形を追加
     * @param {Shape} shape - 追加する図形
     */
    addShape(shape) {
        if (shape) {
            this._shapes.push(shape);
        }
    }

    /**
     * すべての図形を削除
     */
    clear() {
        this._shapes = [];
    }

    /**
     * 図形リストを取得
     * @returns {Array<Shape>} 図形の配列
     */
    getShapes() {
        return [...this._shapes];
    }

    /**
     * 図形リストを設定
     * @param {Array<Shape>} shapes - 図形の配列
     */
    setShapes(shapes) {
        this._shapes = [...shapes];
    }
}

/**
 * 履歴管理クラス
 */
class History {
    constructor() {
        this._states = [[]];
        this._currentIndex = 0;
    }

    /**
     * 現在の状態を保存
     * @param {Array<Shape>} shapes - 図形の配列
     */
    saveState(shapes) {
        // 現在位置以降の履歴を削除
        this._states = this._states.slice(0, this._currentIndex + 1);
        // 新しい状態を追加
        this._states.push([...shapes]);
        this._currentIndex++;
    }

    /**
     * 1つ前の状態に戻る
     * @returns {Array<Shape>|null} 前の状態の図形配列
     */
    undo() {
        if (this.canUndo()) {
            this._currentIndex--;
            return [...this._states[this._currentIndex]];
        }
        return null;
    }

    /**
     * 1つ後の状態に進む
     * @returns {Array<Shape>|null} 次の状態の図形配列
     */
    redo() {
        if (this.canRedo()) {
            this._currentIndex++;
            return [...this._states[this._currentIndex]];
        }
        return null;
    }

    /**
     * 元に戻せるかチェック
     * @returns {boolean} 戻せるならtrue
     */
    canUndo() {
        return this._currentIndex > 0;
    }

    /**
     * やり直せるかチェック
     * @returns {boolean} やり直せるならtrue
     */
    canRedo() {
        return this._currentIndex < this._states.length - 1;
    }
}

/**
 * お絵描きアプリケーション管理クラス
 */
class DrawingApp {
    /**
     * @param {number} width - キャンバスの幅
     * @param {number} height - キャンバスの高さ
     */
    constructor(width = 800, height = 600) {
        this._canvas = new DrawingCanvas(width, height);
        this._currentTool = new PenTool();
        this._history = new History();
        this._currentColor = "black";
        this._lineWidth = 2;
    }

    /**
     * ツールを変更
     * @param {Tool} tool - 新しいツール
     */
    setTool(tool) {
        this._currentTool = tool;
        this._currentTool.setColor(this._currentColor);
        this._currentTool.setLineWidth(this._lineWidth);
    }

    /**
     * 色を変更
     * @param {string} color - 新しい色
     */
    setColor(color) {
        this._currentColor = color;
        if (this._currentTool) {
            this._currentTool.setColor(color);
        }
    }

    /**
     * 線の太さを変更
     * @param {number} width - 新しい線の太さ
     */
    setLineWidth(width) {
        this._lineWidth = width;
        if (this._currentTool) {
            this._currentTool.setLineWidth(width);
        }
    }

    /**
     * キャンバスをクリア
     */
    clearCanvas() {
        this._canvas.clear();
        this._history.saveState(this._canvas.getShapes());
    }

    /**
     * 元に戻す
     * @returns {boolean} 成功したらtrue
     */
    undo() {
        const shapes = this._history.undo();
        if (shapes !== null) {
            this._canvas.setShapes(shapes);
            return true;
        }
        return false;
    }

    /**
     * やり直し
     * @returns {boolean} 成功したらtrue
     */
    redo() {
        const shapes = this._history.redo();
        if (shapes !== null) {
            this._canvas.setShapes(shapes);
            return true;
        }
        return false;
    }

    /**
     * キャンバスを取得
     * @returns {DrawingCanvas} キャンバス
     */
    getCanvas() {
        return this._canvas;
    }

    /**
     * 現在のツールを取得
     * @returns {Tool} 現在のツール
     */
    getCurrentTool() {
        return this._currentTool;
    }

    /**
     * 履歴を保存
     */
    saveHistory() {
        this._history.saveState(this._canvas.getShapes());
    }
}

/**
 * 描画ビュークラス（View層）
 */
class DrawingView {
    /**
     * @param {DrawingApp} app - 管理するアプリケーション
     * @param {HTMLCanvasElement} canvas - 描画用キャンバス
     */
    constructor(app, canvas) {
        this._app = app;
        this._canvas = canvas;
        this._ctx = canvas.getContext('2d');
        this._isDrawing = false;

        this._setupEventListeners();
    }

    /**
     * イベントリスナーを設定
     */
    _setupEventListeners() {
        this._canvas.addEventListener('mousedown', (e) => this._onMouseDown(e));
        this._canvas.addEventListener('mousemove', (e) => this._onMouseMove(e));
        this._canvas.addEventListener('mouseup', (e) => this._onMouseUp(e));
        this._canvas.addEventListener('mouseleave', (e) => this._onMouseUp(e));
    }

    /**
     * マウス座標を取得
     * @param {MouseEvent} event - マウスイベント
     * @returns {object} x, y座標
     */
    _getMousePos(event) {
        const rect = this._canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    /**
     * マウス押下時
     */
    _onMouseDown(event) {
        this._isDrawing = true;
        const pos = this._getMousePos(event);
        const tool = this._app.getCurrentTool();
        tool.onPress(pos.x, pos.y);
    }

    /**
     * マウス移動時
     */
    _onMouseMove(event) {
        if (!this._isDrawing) {
            return;
        }

        const pos = this._getMousePos(event);
        const tool = this._app.getCurrentTool();
        tool.onDrag(pos.x, pos.y);

        // ペンの場合はリアルタイムで描画
        if (tool instanceof PenTool) {
            this.updateDisplay();
            const currentPath = tool.getCurrentPath();
            if (currentPath) {
                currentPath.draw(this._ctx);
            }
        }
    }

    /**
     * マウス離した時
     */
    _onMouseUp(event) {
        if (!this._isDrawing) {
            return;
        }

        this._isDrawing = false;
        const pos = this._getMousePos(event);
        const tool = this._app.getCurrentTool();
        const shape = tool.onRelease(pos.x, pos.y);

        const canvas = this._app.getCanvas();
        canvas.addShape(shape);
        this._app.saveHistory();

        this.updateDisplay();
    }

    /**
     * 表示を更新
     */
    updateDisplay() {
        // キャンバスをクリア
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

        // すべての図形を描画
        const canvas = this._app.getCanvas();
        const shapes = canvas.getShapes();

        for (const shape of shapes) {
            shape.draw(this._ctx);
        }
    }
}

// グローバル変数
let app;
let view;

/**
 * アプリケーションを初期化
 */
function initApp() {
    const canvas = document.getElementById('drawingCanvas');
    app = new DrawingApp(800, 600);
    view = new DrawingView(app, canvas);

    setupUI();
}

/**
 * UIイベントを設定
 */
function setupUI() {
    // ツールボタン
    document.getElementById('penBtn').addEventListener('click', () => {
        app.setTool(new PenTool());
        updateToolButtons('penBtn');
        updateCurrentToolLabel('ペン');
    });

    document.getElementById('lineBtn').addEventListener('click', () => {
        app.setTool(new LineTool());
        updateToolButtons('lineBtn');
        updateCurrentToolLabel('直線');
    });

    document.getElementById('circleBtn').addEventListener('click', () => {
        app.setTool(new CircleTool());
        updateToolButtons('circleBtn');
        updateCurrentToolLabel('円');
    });

    document.getElementById('rectangleBtn').addEventListener('click', () => {
        app.setTool(new RectangleTool());
        updateToolButtons('rectangleBtn');
        updateCurrentToolLabel('四角形');
    });

    // 色選択
    document.getElementById('colorPicker').addEventListener('change', (e) => {
        app.setColor(e.target.value);
    });

    // 線の太さ
    document.getElementById('lineWidth').addEventListener('input', (e) => {
        const width = parseInt(e.target.value);
        app.setLineWidth(width);
        document.getElementById('lineWidthValue').textContent = width;
    });

    // アクションボタン
    document.getElementById('clearBtn').addEventListener('click', () => {
        app.clearCanvas();
        view.updateDisplay();
    });

    document.getElementById('undoBtn').addEventListener('click', () => {
        if (app.undo()) {
            view.updateDisplay();
        }
    });

    document.getElementById('redoBtn').addEventListener('click', () => {
        if (app.redo()) {
            view.updateDisplay();
        }
    });
}

/**
 * ツールボタンのアクティブ状態を更新
 * @param {string} activeId - アクティブにするボタンのID
 */
function updateToolButtons(activeId) {
    const buttons = ['penBtn', 'lineBtn', 'circleBtn', 'rectangleBtn'];
    buttons.forEach(id => {
        const btn = document.getElementById(id);
        if (id === activeId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

/**
 * 現在のツール表示を更新
 * @param {string} toolName - ツール名
 */
function updateCurrentToolLabel(toolName) {
    document.getElementById('currentTool').textContent = toolName;
}

// DOMロード時に初期化
document.addEventListener('DOMContentLoaded', initApp);
