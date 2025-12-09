/**
 * チャットアプリのオブジェクト指向プログラミング実装例
 */

class User {
    static COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8", "#F7DC6F"];
    
    constructor(userId, username) {
        this._userId = userId;
        this._username = username;
        this._color = User.COLORS[Math.floor(Math.random() * User.COLORS.length)];
    }
    
    getId() { return this._userId; }
    getUsername() { return this._username; }
    getColor() { return this._color; }
}

class Message {
    static _idCounter = 0;
    
    constructor(sender, content) {
        this._messageId = `msg_${++Message._idCounter}`;
        this._sender = sender;
        this._content = content;
        this._timestamp = new Date();
    }
    
    getId() { return this._messageId; }
    getSender() { return this._sender; }
    getContent() { return this._content; }
    getTimestamp() { return this._timestamp; }
    
    formatTime() {
        return this._timestamp.toLocaleTimeString('ja-JP', { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        });
    }
}

class MessageHistory {
    constructor() {
        this._messages = [];
    }
    
    addMessage(message) {
        this._messages.push(message);
    }
    
    getMessages() {
        return [...this._messages];
    }
    
    searchMessages(keyword) {
        return this._messages.filter(msg => 
            msg.getContent().toLowerCase().includes(keyword.toLowerCase())
        );
    }
    
    clear() {
        this._messages = [];
    }
}

class ChatRoom {
    constructor() {
        this._users = [];
        this._history = new MessageHistory();
    }
    
    addUser(user) {
        if (!this._users.find(u => u.getId() === user.getId())) {
            this._users.push(user);
        }
    }
    
    removeUser(user) {
        this._users = this._users.filter(u => u.getId() !== user.getId());
    }
    
    sendMessage(user, content) {
        if (!this._users.find(u => u.getId() === user.getId())) {
            throw new Error("ユーザーが参加していません");
        }
        
        const message = new Message(user, content);
        this._history.addMessage(message);
        return message;
    }
    
    getMessages() {
        return this._history.getMessages();
    }
    
    getUsers() {
        return [...this._users];
    }
}

class ChatView {
    constructor(room, currentUser) {
        this._room = room;
        this._currentUser = currentUser;
        this._messagesContainer = document.getElementById('messagesContainer');
        this._messageInput = document.getElementById('messageInput');
        this._sendBtn = document.getElementById('sendBtn');
        this._usersList = document.getElementById('usersList');
        
        this._setupEventListeners();
        this.updateDisplay();
    }
    
    _setupEventListeners() {
        this._sendBtn.addEventListener('click', () => this._handleSendMessage());
        this._messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this._handleSendMessage();
            }
        });
    }
    
    _handleSendMessage() {
        const content = this._messageInput.value.trim();
        if (content) {
            this._room.sendMessage(this._currentUser, content);
            this._messageInput.value = '';
            this.updateDisplay();
        }
    }
    
    displayMessages() {
        this._messagesContainer.innerHTML = '';
        const messages = this._room.getMessages();
        
        messages.forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message';
            
            const sender = msg.getSender();
            messageDiv.innerHTML = `
                <div class="message-header">
                    <span class="message-sender" style="color: ${sender.getColor()}">
                        ${sender.getUsername()}
                    </span>
                    <span class="message-time">${msg.formatTime()}</span>
                </div>
                <div class="message-content">${msg.getContent()}</div>
            `;
            
            this._messagesContainer.appendChild(messageDiv);
        });
        
        this._messagesContainer.scrollTop = this._messagesContainer.scrollHeight;
    }
    
    displayUsers() {
        this._usersList.innerHTML = '';
        const users = this._room.getUsers();
        
        users.forEach(user => {
            const userDiv = document.createElement('div');
            userDiv.className = 'user-item';
            userDiv.style.borderLeft = `4px solid ${user.getColor()}`;
            userDiv.textContent = user.getUsername();
            this._usersList.appendChild(userDiv);
        });
    }
    
    updateDisplay() {
        this.displayMessages();
        this.displayUsers();
    }
}

// アプリケーションの初期化
function initApp() {
    const room = new ChatRoom();
    
    // デモユーザーを作成
    const currentUser = new User('user1', 'あなた');
    const user2 = new User('user2', '太郎');
    const user3 = new User('user3', '花子');
    
    room.addUser(currentUser);
    room.addUser(user2);
    room.addUser(user3);
    
    // サンプルメッセージ
    room.sendMessage(user2, "こんにちは！");
    room.sendMessage(user3, "みなさん、こんにちは！");
    
    const view = new ChatView(room, currentUser);
}

document.addEventListener('DOMContentLoaded', initApp);
