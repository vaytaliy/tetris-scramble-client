const { disconnectRoom, initPublicGame } = require('./roomHandler');
const playGame = require('../gameConnection/activeGame/playOnline')

const checkSameUserHasAlreadyConnected = async (io, connectedSocket, roomName) => { // <-- this function can be reused for other types of gamemodes
    let socketIds = io.sockets.adapter.rooms.get(roomName); //<-- only this one properly retreives needed sockets
    let isFound = false;

    if (socketIds) {
        await socketIds.forEach(async element => {
            let foundSocket = await io.of('/').sockets.get(element);

            if (connectedSocket.id != foundSocket.id && connectedSocket.user.id == foundSocket.user.id) {
                isFound = true;
                return;
            }
        });
    }
    return isFound;
}

const handlePublicConnection = async (io, socket, user) => {

    if (socket && socket.user && !socket.user.isActiveSession) {
        socket.emit('session-active-in-another-tab');
        return;
    }

    let res = await checkSameUserHasAlreadyConnected(io, socket, 'publicRoom');
    //console.log('The same player is trying to connect twice');

    //if (res) {
    //    socket.emit('only-one-game-at-a-time');     // <-- comment out this piece of code to be able to test multiple connections
    //    return;                                     // otherwise you will only be able to connect to a game once
    //}

    let publicRoom = 0;

    if (await io.of('/').in('publicRoom').allSockets()) {
        publicRoom = await io.of('/').in('publicRoom').allSockets();
    }

    if (publicRoom) {
        publicRoomSize = publicRoom.size;      //if room exists get real size
    } else {
        publicRoomSize = 0
    }

    if (publicRoomSize <= 1) {          //if the room is empty or there is already someone
        socket.join('publicRoom');      
    }

    publicRoom = await io.of('/').in('publicRoom').allSockets(); //update size after connection
    publicRoomSize = publicRoom.size;

    if (publicRoomSize === 1) {    //wait new connection
        console.log('clients in public room', await io.of('/').in('publicRoom').allSockets())
        console.log('searching for players...');
        socket.emit('attempt-random-game-reconnect', { message: "searching for players" });
    }

    else if (publicRoomSize === 2) {
        console.log('Public room is full', await io.of('/').in('publicRoom').allSockets())
        const [connectedSockets, roomId] = await initPublicGame(io); //server takes control of initializing the game for players from public room
        playGame(socket, connectedSockets, roomId);
    }
}


module.exports = handlePublicConnection;