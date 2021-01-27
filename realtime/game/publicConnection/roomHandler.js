const { v4: uuidv4 } = require('uuid');
const [trackRoom, handleRoom] = require('../../roomSets');

module.exports = {
    disconnectRoom(socket, io) {
        // socket.on('disconnect', () => {          <-- may not need this function and just handle this case inside a game
        //     if (socket.matchMakingOk) {
        //         handleDisconnectOnMatchmaking(socket.activeRoom);
        //     }
        // })

        // function handleDisconnectOnMatchmaking(exitedSocketRoom) {
        //     io.in(exitedSocketRoom).emit('opponent-quit', { message: "opponent exited the game" }) // tell socket in that room to handle disconnection of the opponent                //if room is 0, then it is cleaned from Set automatically
        //     console.log('broken conn');                                                         // handle disconnection if somebody left abruptly
        // }
    },

    async initPublicGame(io) {
        let roomId = 'pbg-' + uuidv4();
        const socketIds = await io.of('/').in('publicRoom').allSockets();
        const sockets = new Set();

        
        //this below is probably the best way to get clients from room....
        //[TBD] repeats 10000 times in code, must add/redo in helper function

        await socketIds.forEach(async socketId => {
            let foundSocket = await io.of('/').in('publicRoom').sockets.get(socketId);
            sockets.add(foundSocket);
        })

        sockets.forEach(socket => {

            //let socket = await io.of('/').in('publicRoom').sockets.get(socket1);

            socket.leave('publicRoom');
            //console.log(socket.id);
            socket.join(roomId); //<-- public room abbrev
            socket.user.activeRooms.add(roomId); //setting a room id with random uuid
            trackRoom('pbg', roomId);
           
            socket.matchMakingOk = true;        //property to check if disconnect was on matchmaking
        })
        io.of('/').in(roomId).emit('matchmaking-success', { sockets, roomId });
        console.log('Created room:' + roomId);
        let tst = await io.of('/').in(roomId).allSockets();
        console.log(`Ready to play, room size: ${tst.size}`)

        return [sockets, roomId];
    }
}