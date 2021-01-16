const { v4: uuidv4 } = require('uuid');

module.exports = {
    disconnectRoom(socket, io) {
        socket.on('disconnect', () => {
            if (socket.matchMakingOk) {
                handleDisconnectOnMatchmaking(socket.activeRoom);
            }
        })

        function handleDisconnectOnMatchmaking(exitedSocketRoom) {
            io.in(exitedSocketRoom).emit('opponentQuit', { message: "opponent exited the game" }) // tell socket in that room to handle disconnection of the opponent                //if room is 0, then it is cleaned from Set automatically
            console.log('broken conn');                                                         // handle disconnection if somebody left abruptly
        }
    },

    initGame(io) {
        let newRoomId = uuidv4();
        const sockets = io.of('/').in('publicRoom').sockets;

        sockets.forEach(socket => {
            socket.leave('publicRoom');
            socket.join(newRoomId);
            socket.activeRoom = newRoomId; //setting a room id with random uuid
            socket.matchMakingOk = true;        //property to check if disconnect was on matchmaking
        })
        io.of('/').in(newRoomId).emit('matchmakingSuccess');
        console.log('Created room:' + newRoomId);
        console.log(`Ready to play, room size: ${io.sockets.adapter.rooms.get(newRoomId).size}`)
   
        return [sockets, newRoomId];
    }
}