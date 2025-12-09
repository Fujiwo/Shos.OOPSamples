"""
図書管理システムのオブジェクト指向プログラミング実装例
"""
from datetime import datetime
from typing import List, Optional


class Book:
    """書籍クラス"""
    
    def __init__(self, isbn: str, title: str, author: str):
        """
        Args:
            isbn: ISBN番号
            title: タイトル
            author: 著者
        """
        self._isbn = isbn
        self._title = title
        self._author = author
        self._is_available = True
    
    def get_isbn(self) -> str:
        """ISBN番号を取得"""
        return self._isbn
    
    def get_title(self) -> str:
        """タイトルを取得"""
        return self._title
    
    def get_author(self) -> str:
        """著者を取得"""
        return self._author
    
    def is_available(self) -> bool:
        """貸出可能かチェック"""
        return self._is_available
    
    def set_available(self, available: bool) -> None:
        """貸出可否を設定"""
        self._is_available = available


class Member:
    """利用者クラス"""
    
    def __init__(self, member_id: str, name: str):
        """
        Args:
            member_id: 会員ID
            name: 名前
        """
        self._member_id = member_id
        self._name = name
        self._loan_history: List['LoanRecord'] = []
    
    def get_id(self) -> str:
        """会員IDを取得"""
        return self._member_id
    
    def get_name(self) -> str:
        """名前を取得"""
        return self._name
    
    def add_loan_record(self, record: 'LoanRecord') -> None:
        """貸出記録を追加"""
        self._loan_history.append(record)
    
    def get_loan_history(self) -> List['LoanRecord']:
        """貸出履歴を取得"""
        return self._loan_history.copy()


class LoanRecord:
    """貸出記録クラス"""
    
    def __init__(self, book: Book, member: Member):
        """
        Args:
            book: 貸出書籍
            member: 借りた利用者
        """
        self._book = book
        self._member = member
        self._loan_date = datetime.now()
        self._return_date: Optional[datetime] = None
    
    def return_book(self) -> None:
        """書籍を返却"""
        self._return_date = datetime.now()
        self._book.set_available(True)
    
    def is_returned(self) -> bool:
        """返却済みかチェック"""
        return self._return_date is not None
    
    def get_book(self) -> Book:
        """書籍を取得"""
        return self._book
    
    def get_member(self) -> Member:
        """利用者を取得"""
        return self._member
    
    def get_loan_date(self) -> datetime:
        """貸出日を取得"""
        return self._loan_date


class Library:
    """図書館クラス"""
    
    def __init__(self):
        self._books: List[Book] = []
        self._members: List[Member] = []
        self._loan_records: List[LoanRecord] = []
    
    def add_book(self, book: Book) -> None:
        """書籍を登録"""
        self._books.append(book)
    
    def add_member(self, member: Member) -> None:
        """利用者を登録"""
        self._members.append(member)
    
    def loan_book(self, isbn: str, member_id: str) -> bool:
        """書籍を貸出"""
        book = self._find_book(isbn)
        member = self._find_member(member_id)
        
        if not book or not member:
            return False
        
        if not book.is_available():
            return False
        
        record = LoanRecord(book, member)
        self._loan_records.append(record)
        member.add_loan_record(record)
        book.set_available(False)
        return True
    
    def return_book(self, isbn: str) -> bool:
        """書籍を返却"""
        for record in reversed(self._loan_records):
            if (record.get_book().get_isbn() == isbn and 
                not record.is_returned()):
                record.return_book()
                return True
        return False
    
    def search_books(self, keyword: str) -> List[Book]:
        """書籍を検索"""
        keyword = keyword.lower()
        return [book for book in self._books 
                if keyword in book.get_title().lower() or 
                   keyword in book.get_author().lower()]
    
    def get_available_books(self) -> List[Book]:
        """貸出可能な書籍を取得"""
        return [book for book in self._books if book.is_available()]
    
    def get_books(self) -> List[Book]:
        """全書籍を取得"""
        return self._books.copy()
    
    def get_members(self) -> List[Member]:
        """全利用者を取得"""
        return self._members.copy()
    
    def _find_book(self, isbn: str) -> Optional[Book]:
        """ISBN番号で書籍を検索"""
        for book in self._books:
            if book.get_isbn() == isbn:
                return book
        return None
    
    def _find_member(self, member_id: str) -> Optional[Member]:
        """会員IDで利用者を検索"""
        for member in self._members:
            if member.get_id() == member_id:
                return member
        return None


class LibraryView:
    """図書館表示クラス（View層）"""
    
    def __init__(self, library: Library):
        """
        Args:
            library: 表示対象の図書館
        """
        self._library = library
    
    def display_books(self) -> None:
        """書籍一覧を表示"""
        books = self._library.get_books()
        print("\n" + "=" * 70)
        print("蔵書一覧")
        print("=" * 70)
        for book in books:
            status = "貸出可" if book.is_available() else "貸出中"
            print(f"[{book.get_isbn()}] {book.get_title()} - {book.get_author()} ({status})")
        print("=" * 70)
    
    def display_members(self) -> None:
        """利用者一覧を表示"""
        members = self._library.get_members()
        print("\n利用者一覧:")
        for member in members:
            print(f"  [{member.get_id()}] {member.get_name()}")


def main():
    """メイン関数"""
    print("=" * 70)
    print("図書管理システム")
    print("=" * 70)
    
    # 図書館を作成
    library = Library()
    view = LibraryView(library)
    
    # 書籍を登録
    library.add_book(Book("978-4-01-234567-8", "吾輩は猫である", "夏目漱石"))
    library.add_book(Book("978-4-02-345678-9", "坊っちゃん", "夏目漱石"))
    library.add_book(Book("978-4-03-456789-0", "人間失格", "太宰治"))
    library.add_book(Book("978-4-04-567890-1", "雪国", "川端康成"))
    
    # 利用者を登録
    library.add_member(Member("M001", "田中太郎"))
    library.add_member(Member("M002", "佐藤花子"))
    
    # 書籍一覧を表示
    view.display_books()
    
    # 利用者一覧を表示
    view.display_members()
    
    # 貸出処理
    print("\n--- 貸出処理 ---")
    if library.loan_book("978-4-01-234567-8", "M001"):
        print("「吾輩は猫である」を田中太郎さんに貸出しました。")
    
    # 貸出後の書籍一覧を表示
    view.display_books()
    
    # 返却処理
    print("\n--- 返却処理 ---")
    if library.return_book("978-4-01-234567-8"):
        print("「吾輩は猫である」が返却されました。")
    
    # 返却後の書籍一覧を表示
    view.display_books()
    
    # 検索
    print("\n--- 検索結果（キーワード: '夏目'）---")
    results = library.search_books("夏目")
    for book in results:
        print(f"  {book.get_title()} - {book.get_author()}")


if __name__ == "__main__":
    main()
