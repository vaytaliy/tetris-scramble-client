import React from 'react';
import io from 'socket.io-client';

let socket = io();
let timeout;

function tryJoinPublicRoom() {
    socket.emit('publicRoom');
}

socket.on('attemptPublicReconnect', () => {
    console.log('trying to find players..');
    clearTimeout(timeout);
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

const App = () => {
    return (
        <div>
            This is the root container for other components
            <button onClick={tryJoinPublicRoom()}>Test connect</button>
        </div>
    )
}

export default App;