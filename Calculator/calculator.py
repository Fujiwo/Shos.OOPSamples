"""
電卓のオブジェクト指向プログラミング実装例
"""
from abc import ABC, abstractmethod


class Operator(ABC):
    """演算子の基底クラス（抽象クラス）"""
    
    @abstractmethod
    def execute(self, a: float, b: float) -> float:
        """演算を実行"""
        pass
    
    @abstractmethod
    def symbol(self) -> str:
        """演算子の記号を返す"""
        pass


class Addition(Operator):
    """加算演算子"""
    
    def execute(self, a: float, b: float) -> float:
        return a + b
    
    def symbol(self) -> str:
        return "+"


class Subtraction(Operator):
    """減算演算子"""
    
    def execute(self, a: float, b: float) -> float:
        return a - b
    
    def symbol(self) -> str:
        return "-"


class Multiplication(Operator):
    """乗算演算子"""
    
    def execute(self, a: float, b: float) -> float:
        return a * b
    
    def symbol(self) -> str:
        return "×"


class Division(Operator):
    """除算演算子"""
    
    def execute(self, a: float, b: float) -> float:
        if b == 0:
            raise ValueError("0で除算することはできません")
        return a / b
    
    def symbol(self) -> str:
        return "÷"


class Display:
    """ディスプレイクラス"""
    
    def __init__(self):
        self._value = "0"
    
    def set_value(self, value: str) -> None:
        """値を設定"""
        self._value = value
    
    def get_value(self) -> str:
        """値を取得"""
        return self._value
    
    def clear(self) -> None:
        """クリア"""
        self._value = "0"
    
    def show(self) -> None:
        """表示"""
        print(f"表示: {self._value}")


class CalculationEngine:
    """計算エンジンクラス"""
    
    def __init__(self):
        self._current_value = 0.0
        self._previous_value = 0.0
        self._current_operator = None
    
    def set_operand(self, value: float) -> None:
        """オペランドを設定"""
        self._current_value = value
    
    def set_operator(self, operator: Operator) -> None:
        """演算子を設定"""
        self._previous_value = self._current_value
        self._current_operator = operator
        self._current_value = 0.0
    
    def calculate(self) -> float:
        """計算を実行"""
        if self._current_operator is None:
            return self._current_value
        
        try:
            result = self._current_operator.execute(
                self._previous_value, 
                self._current_value
            )
            self._previous_value = result
            self._current_value = result
            return result
        except ValueError as e:
            raise e
    
    def reset(self) -> None:
        """リセット"""
        self._current_value = 0.0
        self._previous_value = 0.0
        self._current_operator = None


class Calculator:
    """電卓クラス"""
    
    def __init__(self):
        self._display = Display()
        self._engine = CalculationEngine()
        self._input_buffer = ""
        self._waiting_for_operand = False
        
        # 演算子のマッピング
        self._operators = {
            '+': Addition(),
            '-': Subtraction(),
            '*': Multiplication(),
            '/': Division()
        }
    
    def input_number(self, number: str) -> None:
        """数字を入力"""
        if self._waiting_for_operand:
            self._input_buffer = ""
            self._waiting_for_operand = False
        
        if number == "." and "." in self._input_buffer:
            return  # 既に小数点がある場合は無視
        
        if self._input_buffer == "0" and number != ".":
            self._input_buffer = number
        else:
            self._input_buffer += number
        
        self._display.set_value(self._input_buffer)
    
    def input_operator(self, operator_symbol: str) -> None:
        """演算子を入力"""
        if operator_symbol not in self._operators:
            print(f"エラー: 不明な演算子 '{operator_symbol}'")
            return
        
        if self._input_buffer:
            value = float(self._input_buffer)
            self._engine.set_operand(value)
        
        operator = self._operators[operator_symbol]
        self._engine.set_operator(operator)
        self._waiting_for_operand = True
    
    def calculate(self) -> float:
        """計算を実行"""
        if self._input_buffer:
            value = float(self._input_buffer)
            self._engine.set_operand(value)
        
        try:
            result = self._engine.calculate()
            self._display.set_value(str(result))
            self._input_buffer = str(result)
            self._waiting_for_operand = True
            return result
        except ValueError as e:
            self._display.set_value(f"エラー: {e}")
            self.clear()
            raise e
    
    def clear(self) -> None:
        """クリア"""
        self._display.clear()
        self._engine.reset()
        self._input_buffer = ""
        self._waiting_for_operand = False
    
    def get_display_value(self) -> str:
        """表示値を取得"""
        return self._display.get_value()
    
    def show_display(self) -> None:
        """ディスプレイを表示"""
        self._display.show()


def main():
    """メイン関数"""
    print("=== 電卓のデモ ===\n")
    
    calc = Calculator()
    
    # 例1: 10 + 5 = 15
    print("計算: 10 + 5")
    calc.input_number("1")
    calc.input_number("0")
    calc.show_display()
    
    calc.input_operator("+")
    
    calc.input_number("5")
    calc.show_display()
    
    calc.calculate()
    calc.show_display()
    print()
    
    # 例2: 20 - 8 = 12
    print("計算: 20 - 8")
    calc.clear()
    calc.input_number("2")
    calc.input_number("0")
    calc.input_operator("-")
    calc.input_number("8")
    calc.calculate()
    calc.show_display()
    print()
    
    # 例3: 6 × 7 = 42
    print("計算: 6 × 7")
    calc.clear()
    calc.input_number("6")
    calc.input_operator("*")
    calc.input_number("7")
    calc.calculate()
    calc.show_display()
    print()
    
    # 例4: 15 ÷ 3 = 5
    print("計算: 15 ÷ 3")
    calc.clear()
    calc.input_number("1")
    calc.input_number("5")
    calc.input_operator("/")
    calc.input_number("3")
    calc.calculate()
    calc.show_display()
    print()
    
    # 例5: 0での除算エラー
    print("計算: 10 ÷ 0 (エラーのテスト)")
    calc.clear()
    calc.input_number("1")
    calc.input_number("0")
    calc.input_operator("/")
    calc.input_number("0")
    try:
        calc.calculate()
    except ValueError:
        pass
    calc.show_display()


if __name__ == "__main__":
    main()
