/**
 * 電卓のオブジェクト指向プログラミング実装例
 */

/**
 * 演算子の基底クラス
 */
class Operator {
    /**
     * 演算を実行
     * @param {number} a - 第一オペランド
     * @param {number} b - 第二オペランド
     * @returns {number} 演算結果
     */
    execute(a, b) {
        throw new Error("execute() must be implemented");
    }

    /**
     * 演算子の記号を返す
     * @returns {string} 演算子記号
     */
    symbol() {
        throw new Error("symbol() must be implemented");
    }
}

/**
 * 加算演算子
 */
class Addition extends Operator {
    execute(a, b) {
        return a + b;
    }

    symbol() {
        return "+";
    }
}

/**
 * 減算演算子
 */
class Subtraction extends Operator {
    execute(a, b) {
        return a - b;
    }

    symbol() {
        return "-";
    }
}

/**
 * 乗算演算子
 */
class Multiplication extends Operator {
    execute(a, b) {
        return a * b;
    }

    symbol() {
        return "×";
    }
}

/**
 * 除算演算子
 */
class Division extends Operator {
    execute(a, b) {
        if (b === 0) {
            throw new Error("0で除算することはできません");
        }
        return a / b;
    }

    symbol() {
        return "÷";
    }
}

/**
 * ディスプレイクラス
 */
class Display {
    constructor(elementId) {
        this._element = document.getElementById(elementId);
        this._value = "0";
    }

    /**
     * 値を設定
     * @param {string} value - 表示する値
     */
    setValue(value) {
        this._value = value;
        this._element.textContent = value;
    }

    /**
     * 値を取得
     * @returns {string} 現在の表示値
     */
    getValue() {
        return this._value;
    }

    /**
     * クリア
     */
    clear() {
        this.setValue("0");
    }
}

/**
 * 計算エンジンクラス
 */
class CalculationEngine {
    constructor() {
        this._currentValue = 0;
        this._previousValue = 0;
        this._currentOperator = null;
    }

    /**
     * オペランドを設定
     * @param {number} value - 設定する値
     */
    setOperand(value) {
        this._currentValue = value;
    }

    /**
     * 演算子を設定
     * @param {Operator} operator - 設定する演算子
     */
    setOperator(operator) {
        this._previousValue = this._currentValue;
        this._currentOperator = operator;
        this._currentValue = 0;
    }

    /**
     * 計算を実行
     * @returns {number} 計算結果
     */
    calculate() {
        if (this._currentOperator === null) {
            return this._currentValue;
        }

        try {
            const result = this._currentOperator.execute(
                this._previousValue,
                this._currentValue
            );
            this._previousValue = result;
            this._currentValue = result;
            return result;
        } catch (error) {
            throw error;
        }
    }

    /**
     * リセット
     */
    reset() {
        this._currentValue = 0;
        this._previousValue = 0;
        this._currentOperator = null;
    }
}

/**
 * 電卓クラス
 */
class Calculator {
    constructor(displayElementId) {
        this._display = new Display(displayElementId);
        this._engine = new CalculationEngine();
        this._inputBuffer = "";
        this._waitingForOperand = false;

        // 演算子のマッピング
        this._operators = {
            '+': new Addition(),
            '-': new Subtraction(),
            '*': new Multiplication(),
            '/': new Division()
        };
    }

    /**
     * 数字を入力
     * @param {string} number - 入力する数字
     */
    inputNumber(number) {
        if (this._waitingForOperand) {
            this._inputBuffer = "";
            this._waitingForOperand = false;
        }

        // 既に小数点がある場合は無視
        if (number === "." && this._inputBuffer.includes(".")) {
            return;
        }

        // 先頭の0を置き換え（小数点以外）
        if (this._inputBuffer === "0" && number !== ".") {
            this._inputBuffer = number;
        } else {
            this._inputBuffer += number;
        }

        this._display.setValue(this._inputBuffer);
    }

    /**
     * 演算子を入力
     * @param {string} operatorSymbol - 演算子記号
     */
    inputOperator(operatorSymbol) {
        if (!(operatorSymbol in this._operators)) {
            console.error(`不明な演算子: ${operatorSymbol}`);
            return;
        }

        if (this._inputBuffer) {
            const value = parseFloat(this._inputBuffer);
            this._engine.setOperand(value);
        }

        const operator = this._operators[operatorSymbol];
        this._engine.setOperator(operator);
        this._waitingForOperand = true;
    }

    /**
     * 計算を実行
     */
    calculate() {
        if (this._inputBuffer) {
            const value = parseFloat(this._inputBuffer);
            this._engine.setOperand(value);
        }

        try {
            const result = this._engine.calculate();
            this._display.setValue(String(result));
            this._inputBuffer = String(result);
            this._waitingForOperand = true;
        } catch (error) {
            this._display.setValue(`エラー: ${error.message}`);
            setTimeout(() => this.clear(), 2000);
        }
    }

    /**
     * クリア
     */
    clear() {
        this._display.clear();
        this._engine.reset();
        this._inputBuffer = "";
        this._waitingForOperand = false;
    }

    /**
     * 表示値を取得
     * @returns {string} 現在の表示値
     */
    getDisplayValue() {
        return this._display.getValue();
    }
}

// グローバル変数として電卓インスタンスを作成
let calculator;

// ページ読み込み時に初期化
document.addEventListener('DOMContentLoaded', () => {
    calculator = new Calculator('display');
});
