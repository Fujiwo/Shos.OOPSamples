"""
チャットアプリのオブジェクト指向プログラミング実装例
"""
from datetime import datetime
from typing import List, Optional
import random


class User:
    """ユーザークラス"""
    
    COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8", "#F7DC6F"]
    
    def __init__(self, user_id: str, username: str):
        """
        Args:
            user_id: ユーザーID
            username: ユーザー名
        """
        self._user_id = user_id
        self._username = username
        self._color = random.choice(self.COLORS)
    
    def get_id(self) -> str:
        """ユーザーIDを取得"""
        return self._user_id
    
    def get_username(self) -> str:
        """ユーザー名を取得"""
        return self._username
    
    def get_color(self) -> str:
        """表示色を取得"""
        return self._color


class Message:
    """メッセージクラス"""
    
    _id_counter = 0
    
    def __init__(self, sender: User, content: str):
        """
        Args:
            sender: 送信者
            content: メッセージ内容
        """
        Message._id_counter += 1
        self._message_id = f"msg_{Message._id_counter}"
        self._sender = sender
        self._content = content
        self._timestamp = datetime.now()
    
    def get_id(self) -> str:
        """メッセージIDを取得"""
        return self._message_id
    
    def get_sender(self) -> User:
        """送信者を取得"""
        return self._sender
    
    def get_content(self) -> str:
        """メッセージ内容を取得"""
        return self._content
    
    def get_timestamp(self) -> datetime:
        """送信時刻を取得"""
        return self._timestamp
    
    def format_time(self) -> str:
        """時刻を整形して取得"""
        return self._timestamp.strftime("%H:%M:%S")


class MessageHistory:
    """メッセージ履歴クラス"""
    
    def __init__(self):
        self._messages: List[Message] = []
    
    def add_message(self, message: Message) -> None:
        """メッセージを追加"""
        self._messages.append(message)
    
    def get_messages(self) -> List[Message]:
        """すべてのメッセージを取得"""
        return self._messages.copy()
    
    def get_messages_by_user(self, user: User) -> List[Message]:
        """特定ユーザーのメッセージを取得"""
        return [msg for msg in self._messages 
                if msg.get_sender().get_id() == user.get_id()]
    
    def search_messages(self, keyword: str) -> List[Message]:
        """キーワードでメッセージを検索"""
        return [msg for msg in self._messages 
                if keyword.lower() in msg.get_content().lower()]
    
    def delete_message(self, message_id: str) -> bool:
        """メッセージを削除"""
        for i, msg in enumerate(self._messages):
            if msg.get_id() == message_id:
                self._messages.pop(i)
                return True
        return False
    
    def clear(self) -> None:
        """すべてのメッセージを削除"""
        self._messages.clear()


class ChatRoom:
    """チャットルームクラス"""
    
    def __init__(self):
        self._users: List[User] = []
        self._history = MessageHistory()
    
    def add_user(self, user: User) -> None:
        """ユーザーを追加"""
        if user not in self._users:
            self._users.append(user)
    
    def remove_user(self, user: User) -> None:
        """ユーザーを削除"""
        if user in self._users:
            self._users.remove(user)
    
    def send_message(self, user: User, content: str) -> Message:
        """メッセージを送信"""
        if user not in self._users:
            raise ValueError("ユーザーが参加していません")
        
        message = Message(user, content)
        self._history.add_message(message)
        return message
    
    def get_messages(self) -> List[Message]:
        """メッセージ一覧を取得"""
        return self._history.get_messages()
    
    def get_users(self) -> List[User]:
        """ユーザー一覧を取得"""
        return self._users.copy()
    
    def search_messages(self, keyword: str) -> List[Message]:
        """メッセージを検索"""
        return self._history.search_messages(keyword)


class ChatView:
    """チャット表示クラス（View層）"""
    
    def __init__(self, room: ChatRoom):
        """
        Args:
            room: 表示対象のチャットルーム
        """
        self._room = room
    
    def display_messages(self) -> None:
        """メッセージを表示"""
        messages = self._room.get_messages()
        
        if not messages:
            print("メッセージはありません。")
            return
        
        print("\n" + "=" * 60)
        print("メッセージ一覧")
        print("=" * 60)
        
        for msg in messages:
            sender = msg.get_sender()
            print(f"[{msg.format_time()}] {sender.get_username()}: {msg.get_content()}")
        
        print("=" * 60)
    
    def display_users(self) -> None:
        """ユーザーリストを表示"""
        users = self._room.get_users()
        
        print("\n参加ユーザー:")
        for user in users:
            print(f"  - {user.get_username()}")


def main():
    """メイン関数"""
    print("=" * 60)
    print("チャットアプリ")
    print("=" * 60)
    
    # チャットルームを作成
    room = ChatRoom()
    view = ChatView(room)
    
    # ユーザーを作成
    user1 = User("user1", "太郎")
    user2 = User("user2", "花子")
    user3 = User("user3", "次郎")
    
    # ユーザーを追加
    room.add_user(user1)
    room.add_user(user2)
    room.add_user(user3)
    
    # ユーザー一覧を表示
    view.display_users()
    
    # メッセージを送信
    room.send_message(user1, "こんにちは！")
    room.send_message(user2, "こんにちは、太郎さん！")
    room.send_message(user3, "みなさん、こんにちは！")
    room.send_message(user1, "今日はいい天気ですね。")
    room.send_message(user2, "本当ですね。散歩に行きたいです。")
    
    # メッセージ一覧を表示
    view.display_messages()
    
    # メッセージを検索
    print("\n検索結果（キーワード: 'こんにちは'）:")
    search_results = room.search_messages("こんにちは")
    for msg in search_results:
        print(f"  [{msg.format_time()}] {msg.get_sender().get_username()}: {msg.get_content()}")


if __name__ == "__main__":
    main()
