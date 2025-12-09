# Shos.OOPSamples
Object Oriented Programming Samples for beginners

## 概要

このリポジトリは、工学部の学生向けのオブジェクト指向プログラミング（OOP）教材です。
プログラミングに不慣れな学生でも理解しやすいように、身近な題材を用いた実例とクラス図を提供しています。

## 題材

### 1. [アナログ時計 (Analog Clock)](./AnalogClock/)
- 時計盤と針の関係を学ぶ
- 継承とコンポジションの理解
- **主なクラス**: `ClockFace`, `Hand`, `HourHand`, `MinuteHand`, `SecondHand`

### 2. [電卓 (Calculator)](./Calculator/)
- 演算子の抽象化を学ぶ
- Strategyパターンの理解
- **主なクラス**: `Calculator`, `Display`, `CalculationEngine`, `Operator`, `Addition`, `Subtraction`, `Multiplication`, `Division`

### 3. [Role Playing Game (RPG)](./RolePlayingGame/)
- キャラクターの階層構造を学ぶ
- ポリモーフィズムの理解
- **主なクラス**: `Character`, `Player`, `Enemy`, `Warrior`, `Mage`, `Thief`

## 各フォルダの構成

各題材のフォルダには以下のファイルが含まれています：

```
📁 [題材名]/
├── 📄 問題.md          # 問題集（課題の説明）
├── 📄 解答.md          # 解答集（クラス図と設計の説明）
├── 🐍 *.py            # Python実装
├── 🌐 index.html      # HTML/CSS/JavaScript実装
├── 💅 style.css       # スタイルシート
└── 📜 *.js            # JavaScriptコード
```

## 使い方

### 問題に取り組む

1. 各フォルダの `問題.md` を読む
2. クラス図を設計する
3. 自分でコードを実装してみる
4. `解答.md` で設計を確認
5. サンプルコードを参照

### Pythonコードの実行

```bash
cd AnalogClock
python analog_clock.py
```

### Web版の実行

各フォルダの `index.html` をブラウザで開いてください。

## 学習のポイント

### オブジェクト指向の基本概念

1. **カプセル化 (Encapsulation)**
   - データとメソッドをクラスにまとめる
   - アクセス制御（public, private, protected）

2. **継承 (Inheritance)**
   - 共通機能を基底クラスにまとめる
   - コードの再利用性を高める

3. **ポリモーフィズム (Polymorphism)**
   - 同じインターフェースで異なる実装
   - 柔軟なコード設計

4. **抽象化 (Abstraction)**
   - 複雑さを隠して本質を表現
   - 抽象クラスとインターフェース

### クラス間の関係

- **継承 (Inheritance)**: is-a の関係
- **コンポジション (Composition)**: has-a の関係（強い所有）
- **集約 (Aggregation)**: has-a の関係（弱い所有）
- **関連 (Association)**: uses-a の関係

## 対象者

- プログラミング初学者
- オブジェクト指向を学びたい学生
- 工学部の学生

## ライセンス

MIT License
