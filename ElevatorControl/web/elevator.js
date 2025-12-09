/**
 * エレベーター制御のオブジェクト指向プログラミング実装例
 */

class Direction {
    static UP = "UP";
    static DOWN = "DOWN";
    static IDLE = "IDLE";
}

class Elevator {
    constructor(maxFloor = 10) {
        this._currentFloor = 1;
        this._direction = Direction.IDLE;
        this._doorOpen = false;
        this._maxFloor = maxFloor;
        this._isMoving = false;
    }
    
    async moveToFloor(targetFloor) {
        if (targetFloor === this._currentFloor || this._isMoving) {
            return;
        }
        
        this._isMoving = true;
        
        if (targetFloor > this._currentFloor) {
            this._direction = Direction.UP;
        } else {
            this._direction = Direction.DOWN;
        }
        
        while (this._currentFloor !== targetFloor) {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            if (this._direction === Direction.UP) {
                this._currentFloor++;
            } else {
                this._currentFloor--;
            }
            
            if (this.onFloorChange) {
                this.onFloorChange(this._currentFloor);
            }
        }
        
        this._direction = Direction.IDLE;
        this._isMoving = false;
    }
    
    async openDoor() {
        if (!this._doorOpen) {
            this._doorOpen = true;
            if (this.onDoorChange) {
                this.onDoorChange(true);
            }
        }
    }
    
    async closeDoor() {
        if (this._doorOpen) {
            this._doorOpen = false;
            if (this.onDoorChange) {
                this.onDoorChange(false);
            }
        }
    }
    
    getCurrentFloor() { return this._currentFloor; }
    getDirection() { return this._direction; }
    isDoorOpen() { return this._doorOpen; }
    isMoving() { return this._isMoving; }
}

class Request {
    constructor(floor) {
        this._floor = floor;
    }
    
    getFloor() { return this._floor; }
}

class ElevatorController {
    constructor(elevator) {
        this._elevator = elevator;
        this._requests = [];
        this._isProcessing = false;
    }
    
    addRequest(request) {
        const floor = request.getFloor();
        
        if (this._requests.some(r => r.getFloor() === floor)) {
            return;
        }
        
        this._requests.push(request);
        
        if (!this._isProcessing) {
            this.processRequests();
        }
    }
    
    async processRequests() {
        this._isProcessing = true;
        
        while (this._requests.length > 0) {
            const nextFloor = this._getNextFloor();
            
            if (nextFloor !== null) {
                await this._elevator.moveToFloor(nextFloor);
                await this._elevator.openDoor();
                await new Promise(resolve => setTimeout(resolve, 1000));
                await this._elevator.closeDoor();
                
                this._requests = this._requests.filter(r => r.getFloor() !== nextFloor);
            }
        }
        
        this._isProcessing = false;
    }
    
    _getNextFloor() {
        if (this._requests.length === 0) {
            return null;
        }
        
        const currentFloor = this._elevator.getCurrentFloor();
        
        const closest = this._requests.reduce((prev, curr) => {
            const prevDist = Math.abs(prev.getFloor() - currentFloor);
            const currDist = Math.abs(curr.getFloor() - currentFloor);
            return currDist < prevDist ? curr : prev;
        });
        
        return closest.getFloor();
    }
    
    getElevator() { return this._elevator; }
    getRequests() { return [...this._requests]; }
}

class ElevatorView {
    constructor(controller) {
        this._controller = controller;
        this._elevatorElement = document.getElementById('elevator');
        this._currentFloorDisplay = document.getElementById('currentFloor');
        this._directionDisplay = document.getElementById('direction');
        this._doorStatusDisplay = document.getElementById('doorStatus');
        this._statusDisplay = document.getElementById('statusDisplay');
        this._floorButtonsContainer = document.getElementById('floorButtons');
        
        this._setupElevatorCallbacks();
        this._setupFloorButtons();
        this.updateDisplay();
    }
    
    _setupElevatorCallbacks() {
        const elevator = this._controller.getElevator();
        
        elevator.onFloorChange = (floor) => {
            this.updateDisplay();
            this._animateElevator(floor);
        };
        
        elevator.onDoorChange = (isOpen) => {
            this._updateDoorStatus(isOpen);
        };
    }
    
    _setupFloorButtons() {
        for (let i = 10; i >= 1; i--) {
            const btn = document.createElement('button');
            btn.className = 'floor-btn';
            btn.textContent = `${i}F`;
            btn.dataset.floor = i;
            
            btn.addEventListener('click', () => {
                this._handleFloorRequest(i);
            });
            
            this._floorButtonsContainer.appendChild(btn);
        }
    }
    
    _handleFloorRequest(floor) {
        const request = new Request(floor);
        this._controller.addRequest(request);
        this.updateDisplay();
    }
    
    _animateElevator(floor) {
        const maxFloor = 10;
        const shaftHeight = 400;
        const elevatorHeight = 60;
        const bottomPosition = ((floor - 1) / (maxFloor - 1)) * (shaftHeight - elevatorHeight);
        
        this._elevatorElement.style.bottom = `${bottomPosition}px`;
    }
    
    _updateDoorStatus(isOpen) {
        this._doorStatusDisplay.textContent = isOpen ? '🚪🔓' : '🚪🔒';
    }
    
    updateDisplay() {
        const elevator = this._controller.getElevator();
        const requests = this._controller.getRequests();
        
        this._currentFloorDisplay.textContent = `${elevator.getCurrentFloor()}F`;
        
        const direction = elevator.getDirection();
        if (direction === Direction.UP) {
            this._directionDisplay.textContent = '↑';
        } else if (direction === Direction.DOWN) {
            this._directionDisplay.textContent = '↓';
        } else {
            this._directionDisplay.textContent = '↕';
        }
        
        let status = `現在階: ${elevator.getCurrentFloor()}階\n`;
        status += `状態: ${elevator.isMoving() ? '移動中' : '停止中'}\n`;
        status += `ドア: ${elevator.isDoorOpen() ? '開' : '閉'}\n`;
        
        if (requests.length > 0) {
            status += `\n待機中のリクエスト:\n`;
            requests.forEach(r => {
                status += `  - ${r.getFloor()}階\n`;
            });
        }
        
        this._statusDisplay.textContent = status;
        
        this._updateFloorButtons(requests);
    }
    
    _updateFloorButtons(requests) {
        const buttons = this._floorButtonsContainer.querySelectorAll('.floor-btn');
        buttons.forEach(btn => {
            const floor = parseInt(btn.dataset.floor);
            if (requests.some(r => r.getFloor() === floor)) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
}

// アプリケーションの初期化
function initApp() {
    const elevator = new Elevator(10);
    const controller = new ElevatorController(elevator);
    const view = new ElevatorView(controller);
}

document.addEventListener('DOMContentLoaded', initApp);
