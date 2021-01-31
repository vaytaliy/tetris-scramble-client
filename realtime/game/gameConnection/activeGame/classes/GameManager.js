// [TBD] move game manager class here
// game manager modifies each player on user events

class GameManager {         //[TBD] needs requirement clarifications

    constructor(io, timer, rounds, isRanked, roomId) {
        //  game type (ranked / not ranked)
        //  game length (in seconds)                //<--- things to consider adding
        //  number of rounds
        //  points of each player
        this.rounds = rounds;
        this.isRanked = isRanked;
        this.players = new Map();
        this.timer = timer; // hardcoded for now
        this.timeout;
        this.io = io;
        this.roomId = roomId;
    }

    trackGameTimer() {
        this.timeout = setTimeout(() => {
            if (this.timer > 0) {
                this.timer -= 1;
                this.io.of("/").to(this.roomId).emit("game-update-timer", { timer: this.timer });
                this.trackGameTimer();
            } else {
                clearTimeout(this.timeout);
                console.log('game timer is over, handle players!') // must clear timeouts for players!!!!
            }
        }, 1000)
    }
}

module.exports = GameManager;