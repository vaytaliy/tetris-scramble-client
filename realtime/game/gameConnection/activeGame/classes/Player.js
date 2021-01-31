// [TBD] move player class here
// main purpose of the player is to calculate next position of blocks, check for collisions
// player class will notify manager if some validation didnt go through and game manager will act upon it
const { MAX_SPEED, INITIAL_SPEED } = require('../../../constants');

class Player {

    constructor(socket, io, roomId, gameManager) {
        this.speed = INITIAL_SPEED;
        this.iteration = MAX_SPEED;
        this.xOffset = 0;               // either -1, 0 or 1
        this.speedupFlag = false;
        this.timer;
        this.testYposition = 0;
        this.socket = socket;
        this.io = io;
        this.roomId = roomId;
        this.timeout;
        this.timeoutRefreshRate = INITIAL_SPEED;
        this.gameManager = gameManager; //player uses game manager to generate next blocks, send remaining time and etc
        this.rowsInGame = 20; // move to game mgr
        this.gameIsRunning = true;
    }

    update() {                              //<--- any associated update logic and validations
        if (this.testYposition < (this.rowsInGame * 20) - 20) { // rows in game should be handled by game manager
            this.testYposition += 20;       //[TBD] this should be replaced to row number, because we dont want to depend on size of game canvas!
        }

        if (!this.speedupFlag) {
            this.timeoutRefreshRate = this.speed;
        } else {
            this.timeoutRefreshRate = this.speed / 2;
        }

        this.speedupFlag = false;
        this.runTick();
    }

    runTick() {
        this.timeout = setTimeout(() => {  //<--- messages to the client
            this.io.of("/").to(this.roomId).emit('game-update-tick', { position: this.testYposition, socketId: this.socket.id });
            this.update();
        }, this.timeoutRefreshRate) // [TBD] to track game length should substract this value from total ms to change remaining game counter or track timer in game manager separately (better option)        
    }
}

module.exports = Player;