/**
 * 図書管理システムのオブジェクト指向プログラミング実装例
 */

class Book {
    constructor(isbn, title, author) {
        this._isbn = isbn;
        this._title = title;
        this._author = author;
        this._isAvailable = true;
    }
    
    getIsbn() { return this._isbn; }
    getTitle() { return this._title; }
    getAuthor() { return this._author; }
    isAvailable() { return this._isAvailable; }
    setAvailable(available) { this._isAvailable = available; }
}

class Member {
    constructor(memberId, name) {
        this._memberId = memberId;
        this._name = name;
        this._loanHistory = [];
    }
    
    getId() { return this._memberId; }
    getName() { return this._name; }
    addLoanRecord(record) { this._loanHistory.push(record); }
    getLoanHistory() { return [...this._loanHistory]; }
}

class LoanRecord {
    constructor(book, member) {
        this._book = book;
        this._member = member;
        this._loanDate = new Date();
        this._returnDate = null;
    }
    
    returnBook() {
        this._returnDate = new Date();
        this._book.setAvailable(true);
    }
    
    isReturned() { return this._returnDate !== null; }
    getBook() { return this._book; }
    getMember() { return this._member; }
}

class Library {
    constructor() {
        this._books = [];
        this._members = [];
        this._loanRecords = [];
    }
    
    addBook(book) {
        this._books.push(book);
    }
    
    addMember(member) {
        this._members.push(member);
    }
    
    loanBook(isbn, memberId) {
        const book = this._findBook(isbn);
        const member = this._findMember(memberId);
        
        if (!book || !member || !book.isAvailable()) {
            return false;
        }
        
        const record = new LoanRecord(book, member);
        this._loanRecords.push(record);
        member.addLoanRecord(record);
        book.setAvailable(false);
        return true;
    }
    
    returnBook(isbn) {
        for (let i = this._loanRecords.length - 1; i >= 0; i--) {
            const record = this._loanRecords[i];
            if (record.getBook().getIsbn() === isbn && !record.isReturned()) {
                record.returnBook();
                return true;
            }
        }
        return false;
    }
    
    searchBooks(keyword) {
        keyword = keyword.toLowerCase();
        return this._books.filter(book =>
            book.getTitle().toLowerCase().includes(keyword) ||
            book.getAuthor().toLowerCase().includes(keyword)
        );
    }
    
    getBooks() { return [...this._books]; }
    getMembers() { return [...this._members]; }
    
    _findBook(isbn) {
        return this._books.find(book => book.getIsbn() === isbn);
    }
    
    _findMember(memberId) {
        return this._members.find(member => member.getId() === memberId);
    }
}

class LibraryView {
    constructor(library) {
        this._library = library;
        this._booksList = document.getElementById('booksList');
        this._resultsList = document.getElementById('resultsList');
        this._searchInput = document.getElementById('searchInput');
        this._searchBtn = document.getElementById('searchBtn');
        
        this._setupEventListeners();
        this.displayBooks();
    }
    
    _setupEventListeners() {
        this._searchBtn.addEventListener('click', () => this._handleSearch());
        this._searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this._handleSearch();
            }
        });
    }
    
    _handleSearch() {
        const keyword = this._searchInput.value.trim();
        if (keyword) {
            const results = this._library.searchBooks(keyword);
            this._displaySearchResults(results);
        }
    }
    
    displayBooks() {
        this._booksList.innerHTML = '';
        const books = this._library.getBooks();
        
        books.forEach(book => {
            const bookDiv = this._createBookElement(book);
            this._booksList.appendChild(bookDiv);
        });
    }
    
    _displaySearchResults(books) {
        this._resultsList.innerHTML = '';
        
        if (books.length === 0) {
            this._resultsList.innerHTML = '<p>検索結果がありません。</p>';
            return;
        }
        
        books.forEach(book => {
            const bookDiv = this._createBookElement(book);
            this._resultsList.appendChild(bookDiv);
        });
    }
    
    _createBookElement(book) {
        const div = document.createElement('div');
        div.className = 'book-item';
        
        const statusClass = book.isAvailable() ? 'available' : 'unavailable';
        const statusText = book.isAvailable() ? '貸出可' : '貸出中';
        
        div.innerHTML = `
            <div class="book-title">${book.getTitle()}</div>
            <div class="book-author">${book.getAuthor()}</div>
            <span class="book-status ${statusClass}">${statusText}</span>
        `;
        
        return div;
    }
}

// アプリケーションの初期化
function initApp() {
    const library = new Library();
    
    // サンプルデータ
    library.addBook(new Book("978-4-01-234567-8", "吾輩は猫である", "夏目漱石"));
    library.addBook(new Book("978-4-02-345678-9", "坊っちゃん", "夏目漱石"));
    library.addBook(new Book("978-4-03-456789-0", "人間失格", "太宰治"));
    library.addBook(new Book("978-4-04-567890-1", "雪国", "川端康成"));
    library.addBook(new Book("978-4-05-678901-2", "こころ", "夏目漱石"));
    
    library.addMember(new Member("M001", "田中太郎"));
    library.addMember(new Member("M002", "佐藤花子"));
    
    // 1冊貸出状態にする
    library.loanBook("978-4-01-234567-8", "M001");
    
    const view = new LibraryView(library);
}

document.addEventListener('DOMContentLoaded', initApp);
