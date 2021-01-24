const { disconnectRoom, initGame } = require('./roomHandler');
const playOnline = require('../gameConnection/activeGame/playOnline')

const checkSameUserHasAlreadyConnected = async (io, connectedSocket, roomName) => { // <-- this function can be reused for other types of gamemodes
    let socketIds = io.sockets.adapter.rooms.get(roomName);
    //const socketIds = io.sockets.adapter.rooms.get(roomName).sockets;
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

    if (!socket.user.isActiveSession) {
        socket.emit('session-active-in-another-tab');
        return;
    }

    let res = await checkSameUserHasAlreadyConnected(io, socket, 'publicRoom');
    console.log('The same player is trying to connect twice');
    
    if (res) {
        socket.emit('only-one-game-at-a-time');     // <-- comment out this piece of code to be able to test multiple connections
        return;                                     // otherwise you will only be able to connect to a game once
    }

    let publicRoom = io.sockets.adapter.rooms.get('publicRoom');
    let publicRoomSize = 0; //if room doesnt exist its size is 0

    if (publicRoom) {
        publicRoomSize = publicRoom.size;      //if room exists get real size
    }
    console.log(publicRoomSize);

    if (publicRoomSize <= 1) {
        socket.join('publicRoom');
    }

    publicRoomSize = io.sockets.adapter.rooms.get('publicRoom').size; //update size after connection

    if (publicRoomSize === 1) {    //wait new connection
        console.log('clients in public room', io.sockets.adapter.rooms.get('publicRoom'))
        console.log('searching for players...');
        socket.emit('attempt-random-game-reconnect', { message: "searching for players" });
    }

    else if (publicRoomSize === 2) {
        console.log('Public room is full', io.sockets.adapter.rooms.get('publicRoom'))
        const [connectedSockets, roomId] = initGame(io); //server takes control of initializing the game for players from public room
        playOnline(connectedSockets, roomId);
    }
}


module.exports = handlePublicConnection;