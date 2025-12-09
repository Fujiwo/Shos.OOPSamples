"""
オセロゲームのオブジェクト指向プログラミング実装例
"""
from abc import ABC, abstractmethod
from typing import List, Tuple, Optional
import random


class Disc:
    """石の状態を表す定数クラス"""
    EMPTY = 0
    BLACK = 1
    WHITE = 2


class Board:
    """ゲームボードを管理するクラス"""
    
    def __init__(self, size: int = 8):
        """
        Args:
            size: ボードのサイズ（デフォルト8×8）
        """
        self._size = size
        self._grid = [[Disc.EMPTY for _ in range(size)] for _ in range(size)]
        self._initialize_board()
    
    def _initialize_board(self) -> None:
        """初期配置を設定（中央に黒白2個ずつ）"""
        mid = self._size // 2
        self._grid[mid - 1][mid - 1] = Disc.WHITE
        self._grid[mid - 1][mid] = Disc.BLACK
        self._grid[mid][mid - 1] = Disc.BLACK
        self._grid[mid][mid] = Disc.WHITE
    
    def get_disc(self, row: int, col: int) -> int:
        """指定位置の石を取得"""
        return self._grid[row][col]
    
    def set_disc(self, row: int, col: int, disc: int) -> None:
        """指定位置に石を配置"""
        self._grid[row][col] = disc
    
    def is_valid_position(self, row: int, col: int) -> bool:
        """位置がボード内かチェック"""
        return 0 <= row < self._size and 0 <= col < self._size
    
    def get_valid_moves(self, color: int) -> List[Tuple[int, int]]:
        """指定色の合法手リストを取得"""
        valid_moves = []
        for row in range(self._size):
            for col in range(self._size):
                if self._is_valid_move(row, col, color):
                    valid_moves.append((row, col))
        return valid_moves
    
    def _is_valid_move(self, row: int, col: int, color: int) -> bool:
        """指定位置に石を置けるかチェック"""
        if self._grid[row][col] != Disc.EMPTY:
            return False
        
        opponent = Disc.WHITE if color == Disc.BLACK else Disc.BLACK
        directions = [(-1, -1), (-1, 0), (-1, 1), (0, -1), 
                     (0, 1), (1, -1), (1, 0), (1, 1)]
        
        for dr, dc in directions:
            if self._can_flip_in_direction(row, col, dr, dc, color, opponent):
                return True
        
        return False
    
    def _can_flip_in_direction(self, row: int, col: int, dr: int, dc: int, 
                               color: int, opponent: int) -> bool:
        """指定方向に石を反転できるかチェック"""
        r, c = row + dr, col + dc
        found_opponent = False
        
        while self.is_valid_position(r, c):
            if self._grid[r][c] == opponent:
                found_opponent = True
            elif self._grid[r][c] == color and found_opponent:
                return True
            else:
                break
            r, c = r + dr, c + dc
        
        return False
    
    def flip_discs(self, row: int, col: int, color: int) -> None:
        """石を配置して反転処理を実行"""
        self._grid[row][col] = color
        opponent = Disc.WHITE if color == Disc.BLACK else Disc.BLACK
        directions = [(-1, -1), (-1, 0), (-1, 1), (0, -1), 
                     (0, 1), (1, -1), (1, 0), (1, 1)]
        
        for dr, dc in directions:
            if self._can_flip_in_direction(row, col, dr, dc, color, opponent):
                self._flip_in_direction(row, col, dr, dc, color, opponent)
    
    def _flip_in_direction(self, row: int, col: int, dr: int, dc: int, 
                          color: int, opponent: int) -> None:
        """指定方向の石を反転"""
        r, c = row + dr, col + dc
        
        while self.is_valid_position(r, c) and self._grid[r][c] == opponent:
            self._grid[r][c] = color
            r, c = r + dr, c + dc
    
    def count_discs(self, color: int) -> int:
        """指定色の石の数をカウント"""
        count = 0
        for row in self._grid:
            count += row.count(color)
        return count
    
    def get_size(self) -> int:
        """ボードのサイズを取得"""
        return self._size


class Player(ABC):
    """プレイヤーの基底クラス（抽象クラス）"""
    
    def __init__(self, color: int, name: str):
        """
        Args:
            color: プレイヤーの石の色
            name: プレイヤー名
        """
        self._color = color
        self._name = name
    
    @abstractmethod
    def get_move(self, board: Board) -> Optional[Tuple[int, int]]:
        """次の手を取得（抽象メソッド）"""
        pass
    
    def get_color(self) -> int:
        """石の色を取得"""
        return self._color
    
    def get_name(self) -> str:
        """プレイヤー名を取得"""
        return self._name


class HumanPlayer(Player):
    """人間プレイヤークラス"""
    
    def get_move(self, board: Board) -> Optional[Tuple[int, int]]:
        """ユーザーからの入力を取得"""
        valid_moves = board.get_valid_moves(self._color)
        
        if not valid_moves:
            return None
        
        print(f"\n合法手: {valid_moves}")
        
        while True:
            try:
                row = int(input("行を入力 (0-7): "))
                col = int(input("列を入力 (0-7): "))
                
                if (row, col) in valid_moves:
                    return (row, col)
                else:
                    print("その位置には置けません。合法手から選んでください。")
            except (ValueError, IndexError):
                print("無効な入力です。0-7の数字を入力してください。")


class CPUPlayer(Player):
    """CPUプレイヤークラス"""
    
    def get_move(self, board: Board) -> Optional[Tuple[int, int]]:
        """合法手から最適な手を選択"""
        valid_moves = board.get_valid_moves(self._color)
        
        if not valid_moves:
            return None
        
        # 簡易的な評価：角を優先、次に辺、それ以外はランダム
        corner_moves = [(r, c) for r, c in valid_moves 
                       if (r, c) in [(0, 0), (0, 7), (7, 0), (7, 7)]]
        
        if corner_moves:
            return random.choice(corner_moves)
        
        # 評価値を計算して最良の手を選択
        best_move = None
        best_score = -1
        
        for move in valid_moves:
            score = self._evaluate_move(board, move[0], move[1])
            if score > best_score:
                best_score = score
                best_move = move
        
        return best_move
    
    def _evaluate_move(self, board: Board, row: int, col: int) -> int:
        """手の評価値を計算（簡易版）"""
        # 角は高評価
        if (row, col) in [(0, 0), (0, 7), (7, 0), (7, 7)]:
            return 100
        
        # 角の隣は低評価
        if (row, col) in [(0, 1), (1, 0), (1, 1),
                         (0, 6), (1, 6), (1, 7),
                         (6, 0), (6, 1), (7, 1),
                         (6, 6), (6, 7), (7, 6)]:
            return 1
        
        # 辺は中評価
        if row == 0 or row == 7 or col == 0 or col == 7:
            return 50
        
        # その他は基本評価
        return 10


class OthelloGame:
    """オセロゲーム全体を管理するクラス"""
    
    def __init__(self, player1: Player, player2: Player):
        """
        Args:
            player1: プレイヤー1（黒）
            player2: プレイヤー2（白）
        """
        self._board = Board()
        self._player1 = player1
        self._player2 = player2
        self._current_player = player1
    
    def play(self) -> None:
        """ゲームのメインループ"""
        consecutive_passes = 0
        
        while not self.is_game_over():
            valid_moves = self._board.get_valid_moves(self._current_player.get_color())
            
            if not valid_moves:
                print(f"\n{self._current_player.get_name()}はパスです。")
                consecutive_passes += 1
                self.switch_turn()
                
                if consecutive_passes >= 2:
                    break
                continue
            
            consecutive_passes = 0
            move = self._current_player.get_move(self._board)
            
            if move:
                self.make_move(move[0], move[1])
                self.switch_turn()
    
    def make_move(self, row: int, col: int) -> bool:
        """指定位置に石を置く"""
        valid_moves = self._board.get_valid_moves(self._current_player.get_color())
        
        if (row, col) not in valid_moves:
            return False
        
        self._board.flip_discs(row, col, self._current_player.get_color())
        return True
    
    def switch_turn(self) -> None:
        """手番を交代"""
        self._current_player = (self._player2 if self._current_player == self._player1 
                               else self._player1)
    
    def is_game_over(self) -> bool:
        """ゲーム終了判定"""
        black_moves = self._board.get_valid_moves(Disc.BLACK)
        white_moves = self._board.get_valid_moves(Disc.WHITE)
        return not black_moves and not white_moves
    
    def get_winner(self) -> Optional[Player]:
        """勝者を判定"""
        black_count = self._board.count_discs(Disc.BLACK)
        white_count = self._board.count_discs(Disc.WHITE)
        
        if black_count > white_count:
            return self._player1 if self._player1.get_color() == Disc.BLACK else self._player2
        elif white_count > black_count:
            return self._player1 if self._player1.get_color() == Disc.WHITE else self._player2
        else:
            return None
    
    def get_board(self) -> Board:
        """ボードを取得"""
        return self._board
    
    def get_current_player(self) -> Player:
        """現在のプレイヤーを取得"""
        return self._current_player


class GameView:
    """ゲームの表示と入力を処理するクラス"""
    
    def __init__(self, game: OthelloGame):
        """
        Args:
            game: 表示対象のゲーム
        """
        self._game = game
    
    def display_board(self) -> None:
        """ボードを表示"""
        board = self._game.get_board()
        size = board.get_size()
        
        print("\n  ", end="")
        for i in range(size):
            print(f" {i}", end="")
        print()
        
        for row in range(size):
            print(f" {row} ", end="")
            for col in range(size):
                disc = board.get_disc(row, col)
                if disc == Disc.BLACK:
                    print("●", end=" ")
                elif disc == Disc.WHITE:
                    print("○", end=" ")
                else:
                    print("･", end=" ")
            print()
    
    def display_message(self, message: str) -> None:
        """メッセージを表示"""
        print(f"\n{message}")
    
    def show_result(self) -> None:
        """ゲーム結果を表示"""
        board = self._game.get_board()
        black_count = board.count_discs(Disc.BLACK)
        white_count = board.count_discs(Disc.WHITE)
        
        self.display_board()
        print("\n" + "=" * 40)
        print("ゲーム終了！")
        print(f"黒: {black_count}個")
        print(f"白: {white_count}個")
        
        winner = self._game.get_winner()
        if winner:
            print(f"\n{winner.get_name()}の勝利！")
        else:
            print("\n引き分け！")
        print("=" * 40)


def main():
    """メイン関数"""
    print("=" * 40)
    print("オセロゲーム")
    print("=" * 40)
    
    # プレイヤーを作成
    player1 = HumanPlayer(Disc.BLACK, "プレイヤー（黒）")
    player2 = CPUPlayer(Disc.WHITE, "CPU（白）")
    
    # ゲームを開始
    game = OthelloGame(player1, player2)
    view = GameView(game)
    
    # ゲームループ
    while not game.is_game_over():
        view.display_board()
        current = game.get_current_player()
        view.display_message(f"{current.get_name()}のターン")
        
        board = game.get_board()
        black_count = board.count_discs(Disc.BLACK)
        white_count = board.count_discs(Disc.WHITE)
        print(f"現在の石数 - 黒: {black_count}個, 白: {white_count}個")
        
        valid_moves = board.get_valid_moves(current.get_color())
        
        if not valid_moves:
            view.display_message(f"{current.get_name()}はパスです。")
            game.switch_turn()
            continue
        
        move = current.get_move(board)
        
        if move:
            if game.make_move(move[0], move[1]):
                view.display_message(f"{current.get_name()}が ({move[0]}, {move[1]}) に配置しました。")
                game.switch_turn()
    
    # 結果を表示
    view.show_result()


if __name__ == "__main__":
    main()
