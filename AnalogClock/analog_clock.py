"""
アナログ時計のオブジェクト指向プログラミング実装例
"""
from abc import ABC, abstractmethod
from datetime import datetime
import math


class Hand(ABC):
    """針の基底クラス（抽象クラス）"""
    
    def __init__(self, speed: float):
        """
        Args:
            speed: 回転速度（度/秒）
        """
        self._angle = 0.0
        self._speed = speed
    
    @abstractmethod
    def rotate(self, seconds: float) -> None:
        """針を回転させる"""
        pass
    
    def get_angle(self) -> float:
        """現在の角度を取得"""
        return self._angle
    
    def set_angle(self, angle: float) -> None:
        """角度を設定（0-360度に正規化）"""
        self._angle = angle % 360


class HourHand(Hand):
    """時針クラス"""
    
    def __init__(self):
        # 12時間で360度回転: 360/(12*60*60) = 0.00833...度/秒
        super().__init__(speed=360 / (12 * 60 * 60))
    
    def rotate(self, seconds: float) -> None:
        """時針を回転させる"""
        self._angle = (self._angle + self._speed * seconds) % 360


class MinuteHand(Hand):
    """分針クラス"""
    
    def __init__(self):
        # 60分で360度回転: 360/(60*60) = 0.1度/秒
        super().__init__(speed=360 / (60 * 60))
    
    def rotate(self, seconds: float) -> None:
        """分針を回転させる"""
        self._angle = (self._angle + self._speed * seconds) % 360


class SecondHand(Hand):
    """秒針クラス"""
    
    def __init__(self):
        # 60秒で360度回転: 360/60 = 6度/秒
        super().__init__(speed=360 / 60)
    
    def rotate(self, seconds: float) -> None:
        """秒針を回転させる"""
        self._angle = (self._angle + self._speed * seconds) % 360


class ClockFace:
    """時計盤クラス"""
    
    def __init__(self):
        """時計盤を初期化"""
        self._hands = []
        self._hour_hand = HourHand()
        self._minute_hand = MinuteHand()
        self._second_hand = SecondHand()
        
        self.add_hand(self._hour_hand)
        self.add_hand(self._minute_hand)
        self.add_hand(self._second_hand)
    
    def add_hand(self, hand: Hand) -> None:
        """針を追加"""
        self._hands.append(hand)
    
    def set_time(self, hour: int, minute: int, second: int) -> None:
        """時刻を設定"""
        # 12時間表記に変換
        hour = hour % 12
        
        # 各針の角度を計算（12時が0度、時計回り）
        self._hour_hand.set_angle(30 * hour + 0.5 * minute + 0.5 * second / 60)
        self._minute_hand.set_angle(6 * minute + 0.1 * second)
        self._second_hand.set_angle(6 * second)
    
    def update(self, seconds: float = 1.0) -> None:
        """すべての針を更新"""
        for hand in self._hands:
            hand.rotate(seconds)
    
    def display(self) -> None:
        """時計の状態を表示"""
        print(f"時針: {self._hour_hand.get_angle():.1f}度")
        print(f"分針: {self._minute_hand.get_angle():.1f}度")
        print(f"秒針: {self._second_hand.get_angle():.1f}度")
        
        # 時刻に変換して表示
        hour = int(self._hour_hand.get_angle() / 30) % 12
        minute = int(self._minute_hand.get_angle() / 6) % 60
        second = int(self._second_hand.get_angle() / 6) % 60
        print(f"時刻: {hour:02d}:{minute:02d}:{second:02d}")


def main():
    """メイン関数"""
    print("=== アナログ時計のデモ ===\n")
    
    # 時計を作成
    clock = ClockFace()
    
    # 現在時刻を設定
    now = datetime.now()
    clock.set_time(now.hour, now.minute, now.second)
    
    print("現在時刻:")
    clock.display()
    
    print("\n--- 5秒後 ---")
    clock.update(5)
    clock.display()
    
    print("\n--- さらに10秒後 ---")
    clock.update(10)
    clock.display()


if __name__ == "__main__":
    main()
