let socket = io();
let timeout;

function tryJoinPublicRoom() {
    socket.emit('publicRoom');
}

socket.on('attemptPublicReconnect', () => {
    console.log('trying to find players..');
    timeout = setTimeout(() => {
        socket.emit('publicRoom');
    }, 1000)
})

socket.on('matchmakingSuccess', data => {
    clearTimeout(timeout);
    console.log('success connect');
    socket.emit('initGame', data.roomId);
})

socket.on('opponentQuit', data => {
    console.log(data.message);
})

document.getElementById('testConn').addEventListener('click', () => {
    tryJoinPublicRoom();
})