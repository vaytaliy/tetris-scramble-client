const { v4: uuidv4 } = require('uuid');

module.exports = {
    disconnectRoom(socket, io) {
        socket.on('disconnect', () => {
            if (socket.matchMakingOk) {
                handleDisconnectOnMatchmaking(socket.activeRoom);
            }
        })

        function handleDisconnectOnMatchmaking(exitedSocketRoom) {
            io.in(exitedSocketRoom).emit('opponent-quit', { message: "opponent exited the game" }) // tell socket in that room to handle disconnection of the opponent                //if room is 0, then it is cleaned from Set automatically
            console.log('broken conn');                                                         // handle disconnection if somebody left abruptly
        }
    },

    initGame(io) {
        let roomId = 'pbg-' + uuidv4();
        const sockets = io.of('/').in('publicRoom').sockets;    // [TBD] this is wrong, create helper functions (see helperFunctions.js);

        sockets.forEach(socket => {
            socket.leave('publicRoom');
            console.log(socket.id);
            socket.join(roomId); //<-- public room abbrev
            socket.activeRoom = roomId; //setting a room id with random uuid
            socket.matchMakingOk = true;        //property to check if disconnect was on matchmaking
        })
        io.of('/').in(roomId).emit('matchmaking-success', {sockets, roomId});
        console.log('Created room:' + roomId);
        console.log(`Ready to play, room size: ${io.sockets.adapter.rooms.get(roomId).size}`)
   
        return [sockets, roomId];
    }
}