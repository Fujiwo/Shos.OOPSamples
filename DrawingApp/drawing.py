"""
お絵描きアプリのオブジェクト指向プログラミング実装例
"""
from abc import ABC, abstractmethod
from typing import List, Tuple
import tkinter as tk
from tkinter import colorchooser


class Shape(ABC):
    """図形の基底クラス（抽象クラス）"""
    
    def __init__(self, color: str = "black", line_width: int = 2):
        """
        Args:
            color: 図形の色
            line_width: 線の太さ
        """
        self._color = color
        self._line_width = line_width
    
    @abstractmethod
    def draw(self, canvas: tk.Canvas) -> None:
        """図形を描画（抽象メソッド）"""
        pass
    
    def get_color(self) -> str:
        """色を取得"""
        return self._color
    
    def get_line_width(self) -> int:
        """線の太さを取得"""
        return self._line_width


class Line(Shape):
    """直線クラス"""
    
    def __init__(self, start_x: int, start_y: int, end_x: int, end_y: int, 
                 color: str = "black", line_width: int = 2):
        """
        Args:
            start_x, start_y: 開始座標
            end_x, end_y: 終了座標
            color: 線の色
            line_width: 線の太さ
        """
        super().__init__(color, line_width)
        self._start_x = start_x
        self._start_y = start_y
        self._end_x = end_x
        self._end_y = end_y
    
    def draw(self, canvas: tk.Canvas) -> None:
        """直線を描画"""
        canvas.create_line(self._start_x, self._start_y, 
                          self._end_x, self._end_y,
                          fill=self._color, width=self._line_width)


class Circle(Shape):
    """円クラス"""
    
    def __init__(self, center_x: int, center_y: int, radius: int,
                 color: str = "black", line_width: int = 2):
        """
        Args:
            center_x, center_y: 中心座標
            radius: 半径
            color: 線の色
            line_width: 線の太さ
        """
        super().__init__(color, line_width)
        self._center_x = center_x
        self._center_y = center_y
        self._radius = radius
    
    def draw(self, canvas: tk.Canvas) -> None:
        """円を描画"""
        x1 = self._center_x - self._radius
        y1 = self._center_y - self._radius
        x2 = self._center_x + self._radius
        y2 = self._center_y + self._radius
        canvas.create_oval(x1, y1, x2, y2, 
                          outline=self._color, width=self._line_width)


class Rectangle(Shape):
    """四角形クラス"""
    
    def __init__(self, x: int, y: int, width: int, height: int,
                 color: str = "black", line_width: int = 2):
        """
        Args:
            x, y: 左上座標
            width: 幅
            height: 高さ
            color: 線の色
            line_width: 線の太さ
        """
        super().__init__(color, line_width)
        self._x = x
        self._y = y
        self._width = width
        self._height = height
    
    def draw(self, canvas: tk.Canvas) -> None:
        """四角形を描画"""
        canvas.create_rectangle(self._x, self._y, 
                               self._x + self._width, self._y + self._height,
                               outline=self._color, width=self._line_width)


class Path(Shape):
    """フリーハンドのパスクラス"""
    
    def __init__(self, color: str = "black", line_width: int = 2):
        """
        Args:
            color: 線の色
            line_width: 線の太さ
        """
        super().__init__(color, line_width)
        self._points: List[Tuple[int, int]] = []
    
    def add_point(self, x: int, y: int) -> None:
        """座標点を追加"""
        self._points.append((x, y))
    
    def draw(self, canvas: tk.Canvas) -> None:
        """パスを描画"""
        if len(self._points) < 2:
            return
        
        for i in range(len(self._points) - 1):
            x1, y1 = self._points[i]
            x2, y2 = self._points[i + 1]
            canvas.create_line(x1, y1, x2, y2, 
                             fill=self._color, width=self._line_width)


class Tool(ABC):
    """描画ツールの基底クラス（抽象クラス）"""
    
    def __init__(self, color: str = "black", line_width: int = 2):
        """
        Args:
            color: 描画色
            line_width: 線の太さ
        """
        self._color = color
        self._line_width = line_width
    
    @abstractmethod
    def on_press(self, x: int, y: int) -> None:
        """マウス押下時の処理"""
        pass
    
    @abstractmethod
    def on_drag(self, x: int, y: int) -> None:
        """ドラッグ時の処理"""
        pass
    
    @abstractmethod
    def on_release(self, x: int, y: int, canvas) -> Shape:
        """マウス離した時の処理"""
        pass
    
    def set_color(self, color: str) -> None:
        """色を設定"""
        self._color = color
    
    def set_line_width(self, line_width: int) -> None:
        """線の太さを設定"""
        self._line_width = line_width


class PenTool(Tool):
    """ペンツールクラス"""
    
    def __init__(self, color: str = "black", line_width: int = 2):
        super().__init__(color, line_width)
        self._current_path: Path = None
    
    def on_press(self, x: int, y: int) -> None:
        """マウス押下時：新しいパスを開始"""
        self._current_path = Path(self._color, self._line_width)
        self._current_path.add_point(x, y)
    
    def on_drag(self, x: int, y: int) -> None:
        """ドラッグ時：座標を追加"""
        if self._current_path:
            self._current_path.add_point(x, y)
    
    def on_release(self, x: int, y: int, canvas) -> Shape:
        """マウス離した時：パスを完成"""
        if self._current_path:
            self._current_path.add_point(x, y)
        return self._current_path


class LineTool(Tool):
    """直線ツールクラス"""
    
    def __init__(self, color: str = "black", line_width: int = 2):
        super().__init__(color, line_width)
        self._start_x = 0
        self._start_y = 0
    
    def on_press(self, x: int, y: int) -> None:
        """マウス押下時：開始点を記録"""
        self._start_x = x
        self._start_y = y
    
    def on_drag(self, x: int, y: int) -> None:
        """ドラッグ時：何もしない（プレビュー表示は省略）"""
        pass
    
    def on_release(self, x: int, y: int, canvas) -> Shape:
        """マウス離した時：直線を作成"""
        return Line(self._start_x, self._start_y, x, y, 
                   self._color, self._line_width)


class CircleTool(Tool):
    """円ツールクラス"""
    
    def __init__(self, color: str = "black", line_width: int = 2):
        super().__init__(color, line_width)
        self._start_x = 0
        self._start_y = 0
    
    def on_press(self, x: int, y: int) -> None:
        """マウス押下時：中心点を記録"""
        self._start_x = x
        self._start_y = y
    
    def on_drag(self, x: int, y: int) -> None:
        """ドラッグ時：何もしない（プレビュー表示は省略）"""
        pass
    
    def on_release(self, x: int, y: int, canvas) -> Shape:
        """マウス離した時：円を作成"""
        dx = x - self._start_x
        dy = y - self._start_y
        radius = int((dx**2 + dy**2)**0.5)
        return Circle(self._start_x, self._start_y, radius,
                     self._color, self._line_width)


class RectangleTool(Tool):
    """四角形ツールクラス"""
    
    def __init__(self, color: str = "black", line_width: int = 2):
        super().__init__(color, line_width)
        self._start_x = 0
        self._start_y = 0
    
    def on_press(self, x: int, y: int) -> None:
        """マウス押下時：開始点を記録"""
        self._start_x = x
        self._start_y = y
    
    def on_drag(self, x: int, y: int) -> None:
        """ドラッグ時：何もしない（プレビュー表示は省略）"""
        pass
    
    def on_release(self, x: int, y: int, canvas) -> Shape:
        """マウス離した時：四角形を作成"""
        width = x - self._start_x
        height = y - self._start_y
        return Rectangle(self._start_x, self._start_y, width, height,
                        self._color, self._line_width)


class DrawingCanvas:
    """描画キャンバスクラス"""
    
    def __init__(self, width: int = 800, height: int = 600):
        """
        Args:
            width: キャンバスの幅
            height: キャンバスの高さ
        """
        self._shapes: List[Shape] = []
        self._width = width
        self._height = height
    
    def add_shape(self, shape: Shape) -> None:
        """図形を追加"""
        if shape:
            self._shapes.append(shape)
    
    def clear(self) -> None:
        """すべての図形を削除"""
        self._shapes.clear()
    
    def get_shapes(self) -> List[Shape]:
        """図形リストを取得"""
        return self._shapes.copy()
    
    def set_shapes(self, shapes: List[Shape]) -> None:
        """図形リストを設定（Undo/Redo用）"""
        self._shapes = shapes.copy()


class History:
    """履歴管理クラス"""
    
    def __init__(self):
        self._states: List[List[Shape]] = [[]]
        self._current_index = 0
    
    def save_state(self, shapes: List[Shape]) -> None:
        """現在の状態を保存"""
        # 現在位置以降の履歴を削除
        self._states = self._states[:self._current_index + 1]
        # 新しい状態を追加
        self._states.append(shapes.copy())
        self._current_index += 1
    
    def undo(self) -> List[Shape]:
        """1つ前の状態に戻る"""
        if self.can_undo():
            self._current_index -= 1
            return self._states[self._current_index].copy()
        return None
    
    def redo(self) -> List[Shape]:
        """1つ後の状態に進む"""
        if self.can_redo():
            self._current_index += 1
            return self._states[self._current_index].copy()
        return None
    
    def can_undo(self) -> bool:
        """元に戻せるかチェック"""
        return self._current_index > 0
    
    def can_redo(self) -> bool:
        """やり直せるかチェック"""
        return self._current_index < len(self._states) - 1


class DrawingApp:
    """お絵描きアプリケーション管理クラス"""
    
    def __init__(self, width: int = 800, height: int = 600):
        """
        Args:
            width: キャンバスの幅
            height: キャンバスの高さ
        """
        self._canvas = DrawingCanvas(width, height)
        self._current_tool: Tool = PenTool()
        self._history = History()
        self._current_color = "black"
        self._line_width = 2
    
    def set_tool(self, tool: Tool) -> None:
        """ツールを変更"""
        self._current_tool = tool
        self._current_tool.set_color(self._current_color)
        self._current_tool.set_line_width(self._line_width)
    
    def set_color(self, color: str) -> None:
        """色を変更"""
        self._current_color = color
        if self._current_tool:
            self._current_tool.set_color(color)
    
    def set_line_width(self, width: int) -> None:
        """線の太さを変更"""
        self._line_width = width
        if self._current_tool:
            self._current_tool.set_line_width(width)
    
    def clear_canvas(self) -> None:
        """キャンバスをクリア"""
        self._canvas.clear()
        self._history.save_state(self._canvas.get_shapes())
    
    def undo(self) -> bool:
        """元に戻す"""
        shapes = self._history.undo()
        if shapes is not None:
            self._canvas.set_shapes(shapes)
            return True
        return False
    
    def redo(self) -> bool:
        """やり直し"""
        shapes = self._history.redo()
        if shapes is not None:
            self._canvas.set_shapes(shapes)
            return True
        return False
    
    def get_canvas(self) -> DrawingCanvas:
        """キャンバスを取得"""
        return self._canvas
    
    def get_current_tool(self) -> Tool:
        """現在のツールを取得"""
        return self._current_tool
    
    def save_history(self) -> None:
        """履歴を保存"""
        self._history.save_state(self._canvas.get_shapes())


class DrawingView:
    """描画ビュークラス（View層）"""
    
    def __init__(self, app: DrawingApp):
        """
        Args:
            app: 管理するアプリケーション
        """
        self._app = app
        self._root = tk.Tk()
        self._root.title("お絵描きアプリ")
        
        self._setup_ui()
        self._is_drawing = False
    
    def _setup_ui(self) -> None:
        """UIを構築"""
        # ツールバー
        toolbar = tk.Frame(self._root, bg="lightgray")
        toolbar.pack(side=tk.TOP, fill=tk.X)
        
        # ツールボタン
        tk.Button(toolbar, text="ペン", command=self._use_pen).pack(side=tk.LEFT, padx=2, pady=2)
        tk.Button(toolbar, text="直線", command=self._use_line).pack(side=tk.LEFT, padx=2, pady=2)
        tk.Button(toolbar, text="円", command=self._use_circle).pack(side=tk.LEFT, padx=2, pady=2)
        tk.Button(toolbar, text="四角", command=self._use_rectangle).pack(side=tk.LEFT, padx=2, pady=2)
        
        tk.Label(toolbar, text=" | ", bg="lightgray").pack(side=tk.LEFT)
        
        # 色選択
        tk.Button(toolbar, text="色選択", command=self._choose_color).pack(side=tk.LEFT, padx=2, pady=2)
        
        tk.Label(toolbar, text=" | ", bg="lightgray").pack(side=tk.LEFT)
        
        # 操作ボタン
        tk.Button(toolbar, text="全消去", command=self._clear).pack(side=tk.LEFT, padx=2, pady=2)
        tk.Button(toolbar, text="元に戻す", command=self._undo).pack(side=tk.LEFT, padx=2, pady=2)
        tk.Button(toolbar, text="やり直し", command=self._redo).pack(side=tk.LEFT, padx=2, pady=2)
        
        # キャンバス
        self._canvas = tk.Canvas(self._root, bg="white", width=800, height=600)
        self._canvas.pack()
        
        # マウスイベント
        self._canvas.bind("<Button-1>", self._on_mouse_press)
        self._canvas.bind("<B1-Motion>", self._on_mouse_drag)
        self._canvas.bind("<ButtonRelease-1>", self._on_mouse_release)
    
    def _use_pen(self) -> None:
        """ペンツールを選択"""
        self._app.set_tool(PenTool())
    
    def _use_line(self) -> None:
        """直線ツールを選択"""
        self._app.set_tool(LineTool())
    
    def _use_circle(self) -> None:
        """円ツールを選択"""
        self._app.set_tool(CircleTool())
    
    def _use_rectangle(self) -> None:
        """四角形ツールを選択"""
        self._app.set_tool(RectangleTool())
    
    def _choose_color(self) -> None:
        """色を選択"""
        color = colorchooser.askcolor(title="色を選択")[1]
        if color:
            self._app.set_color(color)
    
    def _clear(self) -> None:
        """キャンバスをクリア"""
        self._app.clear_canvas()
        self.update_display()
    
    def _undo(self) -> None:
        """元に戻す"""
        if self._app.undo():
            self.update_display()
    
    def _redo(self) -> None:
        """やり直し"""
        if self._app.redo():
            self.update_display()
    
    def _on_mouse_press(self, event) -> None:
        """マウス押下時"""
        self._is_drawing = True
        tool = self._app.get_current_tool()
        tool.on_press(event.x, event.y)
    
    def _on_mouse_drag(self, event) -> None:
        """ドラッグ時"""
        if self._is_drawing:
            tool = self._app.get_current_tool()
            tool.on_drag(event.x, event.y)
            
            # ペンの場合はリアルタイムで描画
            if isinstance(tool, PenTool):
                self.update_display()
    
    def _on_mouse_release(self, event) -> None:
        """マウス離した時"""
        if self._is_drawing:
            self._is_drawing = False
            tool = self._app.get_current_tool()
            shape = tool.on_release(event.x, event.y, self._canvas)
            
            canvas = self._app.get_canvas()
            canvas.add_shape(shape)
            self._app.save_history()
            
            self.update_display()
    
    def update_display(self) -> None:
        """表示を更新"""
        self._canvas.delete("all")
        canvas = self._app.get_canvas()
        for shape in canvas.get_shapes():
            shape.draw(self._canvas)
    
    def run(self) -> None:
        """アプリケーションを実行"""
        self._root.mainloop()


def main():
    """メイン関数"""
    app = DrawingApp(800, 600)
    view = DrawingView(app)
    view.run()


if __name__ == "__main__":
    main()
