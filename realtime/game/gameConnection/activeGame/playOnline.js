//[TBD] - that is any online game
// the functionality should not limit only to 1v1 random player but:

// should also work with player vs invited player
// offline practice mode
// 1v1 in tournaments



const playGame = (socket, sockets, roomId) => {

    //everything related to game logic itself goes in here

    console.log('now the game is officially running!');


    socket.on('disconnect', () => {
        console.log('handle the game on disconnect!');
    })

}

module.exports = playGame;