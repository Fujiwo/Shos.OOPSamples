# 図書管理システム - 解答

## クラス図

```mermaid
classDiagram
    class Book {
        -str isbn
        -str title
        -str author
        -bool is_available
        +__init__(isbn: str, title: str, author: str)
        +get_isbn() str
        +get_title() str
        +get_author() str
        +is_available() bool
        +set_available(available: bool)
    }
    
    class Member {
        -str member_id
        -str name
        -List~LoanRecord~ loan_history
        +__init__(member_id: str, name: str)
        +get_id() str
        +get_name() str
        +add_loan_record(record: LoanRecord)
        +get_loan_history() List~LoanRecord~
    }
    
    class LoanRecord {
        -Book book
        -Member member
        -datetime loan_date
        -datetime return_date
        +__init__(book: Book, member: Member)
        +return_book()
        +is_returned() bool
        +get_book() Book
        +get_member() Member
    }
    
    class Library {
        -List~Book~ books
        -List~Member~ members
        -List~LoanRecord~ loan_records
        +add_book(book: Book)
        +add_member(member: Member)
        +loan_book(isbn: str, member_id: str) bool
        +return_book(isbn: str) bool
        +search_books(keyword: str) List~Book~
        +get_available_books() List~Book~
    }
    
    class LibraryView {
        -Library library
        +display_books()
        +display_members()
        +display_loan_records()
    }
    
    LoanRecord --> Book : borrows
    LoanRecord --> Member : borrowed_by
    Member o-- LoanRecord : has
    Library o-- Book : manages
    Library o-- Member : manages
    Library o-- LoanRecord : tracks
    LibraryView --> Library : uses
```

## クラス設計の説明

### 各クラスの役割

#### Book（書籍）
- **責務**: 書籍情報を管理
- **プロパティ**: ISBN、タイトル、著者、貸出可否

#### Member（利用者）
- **責務**: 利用者情報と貸出履歴を管理
- **プロパティ**: 会員ID、名前、貸出履歴

#### LoanRecord（貸出記録）
- **責務**: 貸出と返却の記録を管理
- **プロパティ**: 書籍、利用者、貸出日、返却日

#### Library（図書館）
- **責務**: 蔵書と貸出を総合管理
- **メソッド**: 書籍登録、利用者登録、貸出、返却、検索

#### LibraryView（表示）
- **責務**: 図書館情報の表示（View層）

## 設計のポイント

### Model-View分離
- **Model層**: Book, Member, LoanRecord, Library
- **View層**: LibraryView

### 実装例
- Python実装: `library.py`
- Web実装: `web/index.html`, `web/library.js`, `web/style.css`
