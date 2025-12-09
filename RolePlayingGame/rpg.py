"""
Role Playing Game のオブジェクト指向プログラミング実装例
"""
from abc import ABC, abstractmethod
import random


class Character(ABC):
    """キャラクターの基底クラス（抽象クラス）"""
    
    def __init__(self, name: str, hit_points: int, attack_power: int):
        """
        Args:
            name: キャラクター名
            hit_points: HP
            attack_power: 攻撃力
        """
        self._name = name
        self._max_hit_points = hit_points
        self._hit_points = hit_points
        self._attack_power = attack_power
    
    def get_name(self) -> str:
        """名前を取得"""
        return self._name
    
    def get_hit_points(self) -> int:
        """現在のHPを取得"""
        return self._hit_points
    
    def get_max_hit_points(self) -> int:
        """最大HPを取得"""
        return self._max_hit_points
    
    def get_attack_power(self) -> int:
        """攻撃力を取得"""
        return self._attack_power
    
    def is_alive(self) -> bool:
        """生存確認"""
        return self._hit_points > 0
    
    def attack(self, target: 'Character') -> int:
        """攻撃する"""
        damage = self._attack_power
        print(f"{self._name} の攻撃！")
        target.take_damage(damage)
        return damage
    
    def take_damage(self, damage: int) -> None:
        """ダメージを受ける"""
        self._hit_points -= damage
        if self._hit_points < 0:
            self._hit_points = 0
        print(f"{self._name} は {damage} のダメージを受けた！ (残りHP: {self._hit_points})")
    
    def heal(self, amount: int) -> None:
        """回復する"""
        self._hit_points += amount
        if self._hit_points > self._max_hit_points:
            self._hit_points = self._max_hit_points
        print(f"{self._name} は {amount} 回復した！ (HP: {self._hit_points})")


class Player(Character):
    """プレイヤークラス"""
    
    def __init__(self, name: str, hit_points: int, attack_power: int):
        super().__init__(name, hit_points, attack_power)
        self._experience = 0
        self._level = 1
    
    def get_experience(self) -> int:
        """経験値を取得"""
        return self._experience
    
    def get_level(self) -> int:
        """レベルを取得"""
        return self._level
    
    def gain_experience(self, exp: int) -> None:
        """経験値を獲得"""
        self._experience += exp
        print(f"{self._name} は {exp} の経験値を獲得した！")
        
        # レベルアップ判定（100経験値でレベルアップ）
        exp_needed = self._level * 100
        if self._experience >= exp_needed:
            self.level_up()
    
    def level_up(self) -> None:
        """レベルアップ"""
        self._level += 1
        self._max_hit_points += 10
        self._hit_points = self._max_hit_points
        self._attack_power += 5
        print(f"*** {self._name} はレベル {self._level} に上がった！ ***")
        print(f"    HP: {self._max_hit_points}, 攻撃力: {self._attack_power}")


class Enemy(Character):
    """敵クラス"""
    
    def __init__(self, name: str, hit_points: int, attack_power: int, exp_reward: int):
        """
        Args:
            name: 敵の名前
            hit_points: HP
            attack_power: 攻撃力
            exp_reward: 倒された時の経験値報酬
        """
        super().__init__(name, hit_points, attack_power)
        self._exp_reward = exp_reward
    
    def get_exp_reward(self) -> int:
        """経験値報酬を取得"""
        return self._exp_reward
    
    def take_damage(self, damage: int) -> None:
        """ダメージを受ける"""
        super().take_damage(damage)
        if not self.is_alive():
            print(f"{self._name} を倒した！")


class Warrior(Player):
    """戦士クラス"""
    
    def __init__(self, name: str):
        # 戦士は高いHPと攻撃力
        super().__init__(name, hit_points=120, attack_power=20)
    
    def special_ability(self, target: Character) -> None:
        """特殊能力: 強力な一撃"""
        print(f"{self._name} の必殺技: パワーアタック！")
        damage = self._attack_power * 2
        target.take_damage(damage)


class Mage(Player):
    """魔法使いクラス"""
    
    def __init__(self, name: str):
        # 魔法使いは低めのHPだが魔法攻撃が可能
        super().__init__(name, hit_points=80, attack_power=15)
        self._magic_power = 30
    
    def special_ability(self, target: Character) -> None:
        """特殊能力: 魔法攻撃"""
        print(f"{self._name} の必殺技: ファイアボール！")
        damage = self._magic_power
        target.take_damage(damage)


class Thief(Player):
    """盗賊クラス"""
    
    def __init__(self, name: str):
        # 盗賊は素早く、クリティカルヒットが出やすい
        super().__init__(name, hit_points=90, attack_power=18)
        self._agility = 25
    
    def attack(self, target: Character) -> int:
        """攻撃（クリティカルヒットの可能性あり）"""
        if random.random() < 0.3:  # 30%の確率でクリティカル
            print(f"{self._name} のクリティカルヒット！")
            damage = self._attack_power * 2
            target.take_damage(damage)
            return damage
        else:
            return super().attack(target)
    
    def special_ability(self, target: Character) -> None:
        """特殊能力: 確定クリティカル"""
        print(f"{self._name} の必殺技: アサシネイト！")
        damage = self._attack_power * 3
        target.take_damage(damage)


def battle(player: Player, enemy: Enemy) -> bool:
    """戦闘シミュレーション"""
    print(f"\n===== 戦闘開始: {player.get_name()} vs {enemy.get_name()} =====\n")
    
    turn = 0
    while player.is_alive() and enemy.is_alive():
        turn += 1
        print(f"--- ターン {turn} ---")
        
        # プレイヤーの攻撃
        player.attack(enemy)
        
        if not enemy.is_alive():
            break
        
        # 敵の攻撃
        enemy.attack(player)
        
        print()
    
    # 戦闘結果
    if player.is_alive():
        print(f"\n*** {player.get_name()} の勝利！ ***\n")
        exp = enemy.get_exp_reward()
        player.gain_experience(exp)
        return True
    else:
        print(f"\n*** {player.get_name()} は倒れた... ***\n")
        return False


def main():
    """メイン関数"""
    print("=== Role Playing Game のデモ ===\n")
    
    # プレイヤーキャラクターの作成
    print("職業を選択してください:")
    print("1. 戦士 (Warrior)")
    print("2. 魔法使い (Mage)")
    print("3. 盗賊 (Thief)")
    
    # デモでは戦士を選択
    warrior = Warrior("勇者")
    print(f"\n{warrior.get_name()} を作成しました！")
    print(f"職業: 戦士")
    print(f"HP: {warrior.get_hit_points()}")
    print(f"攻撃力: {warrior.get_attack_power()}")
    
    # 敵キャラクターの作成
    slime = Enemy("スライム", hit_points=30, attack_power=10, exp_reward=50)
    
    # 戦闘1
    if battle(warrior, slime):
        print(f"現在のレベル: {warrior.get_level()}")
        print(f"経験値: {warrior.get_experience()}")
    
    # 回復
    warrior.heal(50)
    
    # 敵キャラクター2
    print("\n" + "="*50)
    goblin = Enemy("ゴブリン", hit_points=50, attack_power=15, exp_reward=80)
    
    # 戦闘2
    if battle(warrior, goblin):
        print(f"現在のレベル: {warrior.get_level()}")
        print(f"経験値: {warrior.get_experience()}")
    
    # 特殊能力のデモ
    print("\n" + "="*50)
    print("\n=== 特殊能力のデモ ===\n")
    
    # 各職業のキャラクターを作成
    mage = Mage("魔法使い")
    thief = Thief("盗賊")
    
    # テスト用の敵
    dragon = Enemy("ドラゴン", hit_points=200, attack_power=25, exp_reward=200)
    
    print(f"{mage.get_name()} の特殊能力:")
    mage.special_ability(dragon)
    
    print(f"\n{thief.get_name()} の特殊能力:")
    thief.special_ability(dragon)
    
    print(f"\n{warrior.get_name()} の特殊能力:")
    warrior.special_ability(dragon)


if __name__ == "__main__":
    main()
