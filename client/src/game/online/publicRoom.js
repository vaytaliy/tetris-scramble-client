import io from 'socket.io-client';

//handles online multiplayer connection
//with another random player looking for a game

const join = () => {
    let socket = io(process.env.REACT_APP_API_BASE_ADDRESS, {
        reconnectionDelayMax: 10000
    });
    let timeout;

    socket.emit('publicRoom');

    socket.on('attemptPublicReconnect', () => {
        console.log('trying to find players..');
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            socket.emit('publicRoom');
        }, 1000)
    })

    socket.on('matchmakingSuccess', () => {
        clearTimeout(timeout);
        console.log('success connect'); //from this point on game is handled from serverside. 
    })

    socket.on('opponentQuit', data => {
        console.log(data.message);
    })

    //must create another event to handle data updates

}

export default join;