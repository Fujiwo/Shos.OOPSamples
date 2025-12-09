"""
エレベーター制御のオブジェクト指向プログラミング実装例
"""
from enum import Enum
from typing import List
import time


class Direction(Enum):
    """エレベーターの移動方向"""
    UP = "上昇"
    DOWN = "下降"
    IDLE = "停止"


class Elevator:
    """エレベータークラス"""
    
    def __init__(self, max_floor: int = 10):
        """
        Args:
            max_floor: 最上階
        """
        self._current_floor = 1
        self._direction = Direction.IDLE
        self._door_open = False
        self._max_floor = max_floor
    
    def move_to_floor(self, target_floor: int) -> None:
        """指定階に移動"""
        if target_floor == self._current_floor:
            return
        
        # 方向を設定
        if target_floor > self._current_floor:
            self._direction = Direction.UP
        else:
            self._direction = Direction.DOWN
        
        # 移動
        while self._current_floor != target_floor:
            if self._direction == Direction.UP:
                self._current_floor += 1
            else:
                self._current_floor -= 1
            
            print(f"  {self._current_floor}階通過...")
            time.sleep(0.5)
        
        self._direction = Direction.IDLE
        print(f"  {self._current_floor}階に到着！")
    
    def open_door(self) -> None:
        """ドアを開く"""
        if not self._door_open:
            self._door_open = True
            print("  ドアが開きました。")
    
    def close_door(self) -> None:
        """ドアを閉じる"""
        if self._door_open:
            self._door_open = False
            print("  ドアが閉まりました。")
    
    def get_current_floor(self) -> int:
        """現在階を取得"""
        return self._current_floor
    
    def get_direction(self) -> Direction:
        """移動方向を取得"""
        return self._direction
    
    def is_door_open(self) -> bool:
        """ドアが開いているかチェック"""
        return self._door_open


class Request:
    """エレベーター呼び出しリクエスト"""
    
    def __init__(self, floor: int, direction: Direction = Direction.IDLE):
        """
        Args:
            floor: 目的階
            direction: 呼び出し方向
        """
        self._floor = floor
        self._direction = direction
    
    def get_floor(self) -> int:
        """目的階を取得"""
        return self._floor
    
    def get_direction(self) -> Direction:
        """方向を取得"""
        return self._direction


class ElevatorController:
    """エレベーター制御システム"""
    
    def __init__(self, elevator: Elevator):
        """
        Args:
            elevator: 制御対象のエレベーター
        """
        self._elevator = elevator
        self._requests: List[Request] = []
    
    def add_request(self, request: Request) -> None:
        """リクエストを追加"""
        # 重複チェック
        for r in self._requests:
            if r.get_floor() == request.get_floor():
                return
        
        self._requests.append(request)
        print(f"\nリクエスト追加: {request.get_floor()}階")
    
    def process_requests(self) -> None:
        """リクエストを処理"""
        while self._requests:
            next_floor = self._get_next_floor()
            
            if next_floor is not None:
                print(f"\n{next_floor}階に向かいます...")
                self._elevator.move_to_floor(next_floor)
                self._elevator.open_door()
                time.sleep(1)
                self._elevator.close_door()
                
                # 処理済みリクエストを削除
                self._requests = [r for r in self._requests 
                                 if r.get_floor() != next_floor]
    
    def _get_next_floor(self) -> int:
        """次に向かう階を決定"""
        if not self._requests:
            return None
        
        current_floor = self._elevator.get_current_floor()
        direction = self._elevator.get_direction()
        
        # 同じ方向のリクエストを優先
        if direction == Direction.UP:
            # 現在階より上で最も近い階
            upper_floors = [r.get_floor() for r in self._requests 
                          if r.get_floor() > current_floor]
            if upper_floors:
                return min(upper_floors)
        elif direction == Direction.DOWN:
            # 現在階より下で最も近い階
            lower_floors = [r.get_floor() for r in self._requests 
                          if r.get_floor() < current_floor]
            if lower_floors:
                return max(lower_floors)
        
        # 最も近い階を選択
        closest = min(self._requests, 
                     key=lambda r: abs(r.get_floor() - current_floor))
        return closest.get_floor()
    
    def get_elevator(self) -> Elevator:
        """エレベーターを取得"""
        return self._elevator


class ElevatorView:
    """エレベーター表示クラス（View層）"""
    
    def __init__(self, controller: ElevatorController):
        """
        Args:
            controller: 表示対象の制御システム
        """
        self._controller = controller
    
    def display_status(self) -> None:
        """現在の状態を表示"""
        elevator = self._controller.get_elevator()
        
        print("\n" + "=" * 50)
        print("エレベーター状態")
        print("=" * 50)
        print(f"現在階: {elevator.get_current_floor()}階")
        print(f"方向: {elevator.get_direction().value}")
        print(f"ドア: {'開' if elevator.is_door_open() else '閉'}")
        print("=" * 50)


def main():
    """メイン関数"""
    print("=" * 50)
    print("エレベーター制御システム")
    print("=" * 50)
    
    # システムを構築
    elevator = Elevator(max_floor=10)
    controller = ElevatorController(elevator)
    view = ElevatorView(controller)
    
    # 初期状態を表示
    view.display_status()
    
    # リクエストを追加
    controller.add_request(Request(5))
    controller.add_request(Request(3))
    controller.add_request(Request(7))
    controller.add_request(Request(2))
    
    # リクエストを処理
    controller.process_requests()
    
    # 最終状態を表示
    view.display_status()


if __name__ == "__main__":
    main()
