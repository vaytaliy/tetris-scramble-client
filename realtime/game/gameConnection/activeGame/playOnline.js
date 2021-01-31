//[TBD] - that is any online game
// the functionality should not limit only to 1v1 random player but:

// should also work with player vs invited player
// offline practice mode
// 1v1 in tournaments

//const { indexOf, forEach } = require('../../../roomSets'); WTF
const GameManager = require('./classes/GameManager');
const Player = require('./classes/Player');


// this set provides easy access to all players, because in here you only handle 1 of those players
const players = new Set();
let gameManager;


const playGame = (socket, sockets, roomId, io, options) => {

    //initial setup section

    console.log('now the game is officially running!');

    gameManager = new GameManager(io, options.timer, options.rounds, options.isRanked, roomId);

    sockets.forEach(socket => {
        let player = new Player(socket, io, roomId, gameManager);
        players.add(player);
        console.log('the id is ' + socket.id);

        gameManager.players.set(socket.id, player);

        //events listeners

        socket.on('input-listen-update', (data) => {
            //[TBD]
            //update player data based on inputs
            //The player that will be handled
            let player = gameManager.players.get(socket.id);
            console.log('speeding up' + socket.id);
            if (player && data && data.speedUpKeyPressed) {
                player.speedupFlag = true;
            }
        })

        socket.on('disconnect', () => {
            console.log('handle the game on disconnect!');
            //socket.to(roomId).emit('rage-quit', { socket });  //<--- that might not be the best, must handle with game manager
            players.forEach(player => {
                player.gameIsRunning = false;
                clearTimeout(gameManager.timeout)
                clearTimeout(player.timeout);
            })
        })
    });

    //updates section

    gameManager.trackGameTimer();

    gameManager.players.forEach(player => {
        player.update();
    })
}

module.exports = playGame;