const { disconnectRoom, initGame } = require('./roomHandler');
const playOnline = require('../activeGame/playOnline')

const socketConnection = (io) => {
    io.on('connection', socket => {
        console.log('somebody has connected');
        socket.on('publicRoom', handlePublicConnection);

        disconnectRoom(socket, io); // handle disconnect from room

        function handlePublicConnection() {
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
                socket.emit('attemptPublicReconnect', { message: "searching for players" });
            }

            else if (publicRoomSize === 2) {
                console.log('Public room is full', io.sockets.adapter.rooms.get('publicRoom'))
                const [connectedSockets, roomId] = initGame(io); //server takes control of initializing the game for players from public room
                playOnline(connectedSockets, roomId);
            }
        }
    });
}

module.exports = { socketConnection };