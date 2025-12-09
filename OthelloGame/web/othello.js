/**
 * オセロゲームのオブジェクト指向プログラミング実装例
 */

/**
 * 石の状態を表す定数クラス
 */
class Disc {
    static EMPTY = 0;
    static BLACK = 1;
    static WHITE = 2;
}

/**
 * ゲームボードを管理するクラス
 */
class Board {
    /**
     * @param {number} size - ボードのサイズ（デフォルト8×8）
     */
    constructor(size = 8) {
        this._size = size;
        this._grid = Array(size).fill(null).map(() => Array(size).fill(Disc.EMPTY));
        this._initializeBoard();
    }

    /**
     * 初期配置を設定（中央に黒白2個ずつ）
     */
    _initializeBoard() {
        const mid = Math.floor(this._size / 2);
        this._grid[mid - 1][mid - 1] = Disc.WHITE;
        this._grid[mid - 1][mid] = Disc.BLACK;
        this._grid[mid][mid - 1] = Disc.BLACK;
        this._grid[mid][mid] = Disc.WHITE;
    }

    /**
     * 指定位置の石を取得
     * @param {number} row - 行
     * @param {number} col - 列
     * @returns {number} 石の状態
     */
    getDisc(row, col) {
        return this._grid[row][col];
    }

    /**
     * 指定位置に石を配置
     * @param {number} row - 行
     * @param {number} col - 列
     * @param {number} disc - 石の色
     */
    setDisc(row, col, disc) {
        this._grid[row][col] = disc;
    }

    /**
     * 位置がボード内かチェック
     * @param {number} row - 行
     * @param {number} col - 列
     * @returns {boolean} ボード内ならtrue
     */
    isValidPosition(row, col) {
        return row >= 0 && row < this._size && col >= 0 && col < this._size;
    }

    /**
     * 指定色の合法手リストを取得
     * @param {number} color - 石の色
     * @returns {Array} 合法手の配列
     */
    getValidMoves(color) {
        const validMoves = [];
        for (let row = 0; row < this._size; row++) {
            for (let col = 0; col < this._size; col++) {
                if (this._isValidMove(row, col, color)) {
                    validMoves.push([row, col]);
                }
            }
        }
        return validMoves;
    }

    /**
     * 指定位置に石を置けるかチェック
     * @param {number} row - 行
     * @param {number} col - 列
     * @param {number} color - 石の色
     * @returns {boolean} 置けるならtrue
     */
    _isValidMove(row, col, color) {
        if (this._grid[row][col] !== Disc.EMPTY) {
            return false;
        }

        const opponent = color === Disc.BLACK ? Disc.WHITE : Disc.BLACK;
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1],  [1, 0],  [1, 1]
        ];

        for (const [dr, dc] of directions) {
            if (this._canFlipInDirection(row, col, dr, dc, color, opponent)) {
                return true;
            }
        }

        return false;
    }

    /**
     * 指定方向に石を反転できるかチェック
     * @param {number} row - 開始行
     * @param {number} col - 開始列
     * @param {number} dr - 行方向
     * @param {number} dc - 列方向
     * @param {number} color - 自分の色
     * @param {number} opponent - 相手の色
     * @returns {boolean} 反転できるならtrue
     */
    _canFlipInDirection(row, col, dr, dc, color, opponent) {
        let r = row + dr;
        let c = col + dc;
        let foundOpponent = false;

        while (this.isValidPosition(r, c)) {
            if (this._grid[r][c] === opponent) {
                foundOpponent = true;
            } else if (this._grid[r][c] === color && foundOpponent) {
                return true;
            } else {
                break;
            }
            r += dr;
            c += dc;
        }

        return false;
    }

    /**
     * 石を配置して反転処理を実行
     * @param {number} row - 行
     * @param {number} col - 列
     * @param {number} color - 石の色
     */
    flipDiscs(row, col, color) {
        this._grid[row][col] = color;
        const opponent = color === Disc.BLACK ? Disc.WHITE : Disc.BLACK;
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1],  [1, 0],  [1, 1]
        ];

        for (const [dr, dc] of directions) {
            if (this._canFlipInDirection(row, col, dr, dc, color, opponent)) {
                this._flipInDirection(row, col, dr, dc, color, opponent);
            }
        }
    }

    /**
     * 指定方向の石を反転
     * @param {number} row - 開始行
     * @param {number} col - 開始列
     * @param {number} dr - 行方向
     * @param {number} dc - 列方向
     * @param {number} color - 自分の色
     * @param {number} opponent - 相手の色
     */
    _flipInDirection(row, col, dr, dc, color, opponent) {
        let r = row + dr;
        let c = col + dc;

        while (this.isValidPosition(r, c) && this._grid[r][c] === opponent) {
            this._grid[r][c] = color;
            r += dr;
            c += dc;
        }
    }

    /**
     * 指定色の石の数をカウント
     * @param {number} color - 石の色
     * @returns {number} 石の数
     */
    countDiscs(color) {
        let count = 0;
        for (const row of this._grid) {
            count += row.filter(disc => disc === color).length;
        }
        return count;
    }

    /**
     * ボードのサイズを取得
     * @returns {number} サイズ
     */
    getSize() {
        return this._size;
    }
}

/**
 * プレイヤーの基底クラス
 */
class Player {
    /**
     * @param {number} color - プレイヤーの石の色
     * @param {string} name - プレイヤー名
     */
    constructor(color, name) {
        this._color = color;
        this._name = name;
    }

    /**
     * 次の手を取得（サブクラスでオーバーライド）
     * @param {Board} board - ゲームボード
     * @returns {Array|null} [row, col] または null
     */
    getMove(board) {
        throw new Error('getMove() must be implemented by subclass');
    }

    /**
     * 石の色を取得
     * @returns {number} 色
     */
    getColor() {
        return this._color;
    }

    /**
     * プレイヤー名を取得
     * @returns {string} 名前
     */
    getName() {
        return this._name;
    }
}

/**
 * CPUプレイヤークラス
 */
class CPUPlayer extends Player {
    /**
     * 合法手から最適な手を選択
     * @param {Board} board - ゲームボード
     * @returns {Array|null} [row, col] または null
     */
    getMove(board) {
        const validMoves = board.getValidMoves(this._color);

        if (validMoves.length === 0) {
            return null;
        }

        // 角を優先
        const corners = [[0, 0], [0, 7], [7, 0], [7, 7]];
        for (const [row, col] of validMoves) {
            if (corners.some(([cr, cc]) => cr === row && cc === col)) {
                return [row, col];
            }
        }

        // 評価値を計算して最良の手を選択
        let bestMove = null;
        let bestScore = -1;

        for (const [row, col] of validMoves) {
            const score = this._evaluateMove(board, row, col);
            if (score > bestScore) {
                bestScore = score;
                bestMove = [row, col];
            }
        }

        return bestMove;
    }

    /**
     * 手の評価値を計算（簡易版）
     * @param {Board} board - ゲームボード
     * @param {number} row - 行
     * @param {number} col - 列
     * @returns {number} 評価値
     */
    _evaluateMove(board, row, col) {
        // 角は高評価
        if ((row === 0 || row === 7) && (col === 0 || col === 7)) {
            return 100;
        }

        // 角の隣は低評価
        const badPositions = [
            [0, 1], [1, 0], [1, 1],
            [0, 6], [1, 6], [1, 7],
            [6, 0], [6, 1], [7, 1],
            [6, 6], [6, 7], [7, 6]
        ];

        for (const [br, bc] of badPositions) {
            if (row === br && col === bc) {
                return 1;
            }
        }

        // 辺は中評価
        if (row === 0 || row === 7 || col === 0 || col === 7) {
            return 50;
        }

        // その他は基本評価
        return 10;
    }
}

/**
 * オセロゲーム全体を管理するクラス
 */
class OthelloGame {
    /**
     * @param {Player} player1 - プレイヤー1（黒）
     * @param {Player} player2 - プレイヤー2（白）
     */
    constructor(player1, player2) {
        this._board = new Board();
        this._player1 = player1;
        this._player2 = player2;
        this._currentPlayer = player1;
        this._gameOver = false;
    }

    /**
     * 指定位置に石を置く
     * @param {number} row - 行
     * @param {number} col - 列
     * @returns {boolean} 成功したらtrue
     */
    makeMove(row, col) {
        const validMoves = this._board.getValidMoves(this._currentPlayer.getColor());
        
        const isValid = validMoves.some(([r, c]) => r === row && c === col);
        if (!isValid) {
            return false;
        }

        this._board.flipDiscs(row, col, this._currentPlayer.getColor());
        return true;
    }

    /**
     * 手番を交代
     */
    switchTurn() {
        this._currentPlayer = this._currentPlayer === this._player1 
            ? this._player2 
            : this._player1;
    }

    /**
     * ゲーム終了判定
     * @returns {boolean} ゲーム終了ならtrue
     */
    isGameOver() {
        if (this._gameOver) {
            return true;
        }

        const blackMoves = this._board.getValidMoves(Disc.BLACK);
        const whiteMoves = this._board.getValidMoves(Disc.WHITE);
        this._gameOver = blackMoves.length === 0 && whiteMoves.length === 0;
        
        return this._gameOver;
    }

    /**
     * 勝者を判定
     * @returns {Player|null} 勝者または引き分けの場合null
     */
    getWinner() {
        const blackCount = this._board.countDiscs(Disc.BLACK);
        const whiteCount = this._board.countDiscs(Disc.WHITE);

        if (blackCount > whiteCount) {
            return this._player1.getColor() === Disc.BLACK ? this._player1 : this._player2;
        } else if (whiteCount > blackCount) {
            return this._player1.getColor() === Disc.WHITE ? this._player1 : this._player2;
        } else {
            return null;
        }
    }

    /**
     * ボードを取得
     * @returns {Board} ボード
     */
    getBoard() {
        return this._board;
    }

    /**
     * 現在のプレイヤーを取得
     * @returns {Player} 現在のプレイヤー
     */
    getCurrentPlayer() {
        return this._currentPlayer;
    }

    /**
     * ゲームをリセット
     */
    reset() {
        this._board = new Board();
        this._currentPlayer = this._player1;
        this._gameOver = false;
    }
}

/**
 * ゲームの表示と入力を処理するクラス
 */
class GameView {
    /**
     * @param {OthelloGame} game - 表示対象のゲーム
     * @param {HTMLCanvasElement} canvas - 描画用キャンバス
     */
    constructor(game, canvas) {
        this._game = game;
        this._canvas = canvas;
        this._ctx = canvas.getContext('2d');
        this._cellSize = canvas.width / game.getBoard().getSize();
        this._showHints = false;
        
        this._setupEventListeners();
    }

    /**
     * イベントリスナーを設定
     */
    _setupEventListeners() {
        this._canvas.addEventListener('click', (event) => {
            this._handleClick(event);
        });
    }

    /**
     * クリックイベントを処理
     * @param {MouseEvent} event - クリックイベント
     */
    _handleClick(event) {
        if (this._game.isGameOver()) {
            return;
        }

        const rect = this._canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const col = Math.floor(x / this._cellSize);
        const row = Math.floor(y / this._cellSize);

        const board = this._game.getBoard();
        const currentPlayer = this._game.getCurrentPlayer();

        // 人間のターンのみ処理
        if (currentPlayer instanceof CPUPlayer) {
            return;
        }

        const validMoves = board.getValidMoves(currentPlayer.getColor());
        const isValid = validMoves.some(([r, c]) => r === row && c === col);

        if (isValid) {
            this._game.makeMove(row, col);
            this.update();
            
            // CPUのターン
            setTimeout(() => {
                this._processCPUTurn();
            }, 500);
        }
    }

    /**
     * CPUのターンを処理
     */
    _processCPUTurn() {
        if (this._game.isGameOver()) {
            this.showResult();
            return;
        }

        const currentPlayer = this._game.getCurrentPlayer();
        
        if (currentPlayer instanceof CPUPlayer) {
            const board = this._game.getBoard();
            const validMoves = board.getValidMoves(currentPlayer.getColor());

            if (validMoves.length === 0) {
                this.displayMessage(`${currentPlayer.getName()}はパスです`);
                this._game.switchTurn();
                
                // 次もCPUならさらに処理
                setTimeout(() => {
                    this._processCPUTurn();
                }, 1000);
                return;
            }

            const move = currentPlayer.getMove(board);
            if (move) {
                this._game.makeMove(move[0], move[1]);
                this.update();
                
                // まだゲームが続くなら次のターンへ
                if (!this._game.isGameOver()) {
                    setTimeout(() => {
                        this._processCPUTurn();
                    }, 500);
                } else {
                    this.showResult();
                }
            }
        }
    }

    /**
     * ボードを描画
     */
    displayBoard() {
        const board = this._game.getBoard();
        const size = board.getSize();

        // 背景（緑色のボード）
        this._ctx.fillStyle = '#228B22';
        this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);

        // グリッド線
        this._ctx.strokeStyle = '#000';
        this._ctx.lineWidth = 2;

        for (let i = 0; i <= size; i++) {
            // 縦線
            this._ctx.beginPath();
            this._ctx.moveTo(i * this._cellSize, 0);
            this._ctx.lineTo(i * this._cellSize, this._canvas.height);
            this._ctx.stroke();

            // 横線
            this._ctx.beginPath();
            this._ctx.moveTo(0, i * this._cellSize);
            this._ctx.lineTo(this._canvas.width, i * this._cellSize);
            this._ctx.stroke();
        }

        // 石を描画
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                const disc = board.getDisc(row, col);
                if (disc !== Disc.EMPTY) {
                    this._drawDisc(row, col, disc);
                }
            }
        }

        // ヒントを表示
        if (this._showHints) {
            const currentPlayer = this._game.getCurrentPlayer();
            const validMoves = board.getValidMoves(currentPlayer.getColor());
            
            for (const [row, col] of validMoves) {
                this._drawHint(row, col);
            }
        }
    }

    /**
     * 石を描画
     * @param {number} row - 行
     * @param {number} col - 列
     * @param {number} color - 色
     */
    _drawDisc(row, col, color) {
        const x = col * this._cellSize + this._cellSize / 2;
        const y = row * this._cellSize + this._cellSize / 2;
        const radius = this._cellSize / 2 - 5;

        this._ctx.beginPath();
        this._ctx.arc(x, y, radius, 0, Math.PI * 2);
        
        if (color === Disc.BLACK) {
            this._ctx.fillStyle = '#000';
        } else {
            this._ctx.fillStyle = '#FFF';
        }
        
        this._ctx.fill();
        this._ctx.strokeStyle = '#333';
        this._ctx.lineWidth = 1;
        this._ctx.stroke();
    }

    /**
     * ヒントを描画
     * @param {number} row - 行
     * @param {number} col - 列
     */
    _drawHint(row, col) {
        const x = col * this._cellSize + this._cellSize / 2;
        const y = row * this._cellSize + this._cellSize / 2;
        const radius = 5;

        this._ctx.beginPath();
        this._ctx.arc(x, y, radius, 0, Math.PI * 2);
        this._ctx.fillStyle = 'rgba(255, 255, 0, 0.7)';
        this._ctx.fill();
    }

    /**
     * 表示を更新
     */
    update() {
        this.displayBoard();
        this.updateScores();
        this.updateTurnIndicator();
        
        if (this._game.isGameOver()) {
            this.showResult();
        }
    }

    /**
     * スコアを更新
     */
    updateScores() {
        const board = this._game.getBoard();
        const blackCount = board.countDiscs(Disc.BLACK);
        const whiteCount = board.countDiscs(Disc.WHITE);

        document.getElementById('blackCount').textContent = blackCount;
        document.getElementById('whiteCount').textContent = whiteCount;
    }

    /**
     * ターン表示を更新
     */
    updateTurnIndicator() {
        const currentPlayer = this._game.getCurrentPlayer();
        const colorName = currentPlayer.getColor() === Disc.BLACK ? '黒' : '白';
        document.getElementById('turnMessage').textContent = `${colorName}のターン`;
    }

    /**
     * メッセージを表示
     * @param {string} message - メッセージ
     */
    displayMessage(message) {
        document.getElementById('messageDisplay').textContent = message;
    }

    /**
     * ゲーム結果を表示
     */
    showResult() {
        const board = this._game.getBoard();
        const blackCount = board.countDiscs(Disc.BLACK);
        const whiteCount = board.countDiscs(Disc.WHITE);

        let message = `ゲーム終了！ 黒: ${blackCount}個, 白: ${whiteCount}個\n`;

        const winner = this._game.getWinner();
        if (winner) {
            const colorName = winner.getColor() === Disc.BLACK ? '黒' : '白';
            message += `${colorName}の勝利！`;
        } else {
            message += '引き分け！';
        }

        this.displayMessage(message);
    }

    /**
     * ヒント表示を切り替え
     */
    toggleHints() {
        this._showHints = !this._showHints;
        this.displayBoard();
    }
}

// ゲームの初期化
let game;
let view;

/**
 * 新しいゲームを開始
 */
function startNewGame() {
    const player1 = new Player(Disc.BLACK, '黒');
    const player2 = new CPUPlayer(Disc.WHITE, 'CPU（白）');
    
    game = new OthelloGame(player1, player2);
    
    const canvas = document.getElementById('boardCanvas');
    view = new GameView(game, canvas);
    
    view.update();
    view.displayMessage('ゲーム開始！黒のターンです。');
}

// イベントリスナーの設定
document.addEventListener('DOMContentLoaded', () => {
    startNewGame();
    
    document.getElementById('newGameBtn').addEventListener('click', () => {
        startNewGame();
    });
    
    document.getElementById('hintBtn').addEventListener('click', () => {
        view.toggleHints();
    });
});
