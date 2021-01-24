import axios from 'axios'; // might want to use axios for all requests later [TBD]
import React, { useState, useEffect } from 'react';
import Registration from './Registration';
import Login from './Login';
import io from 'socket.io-client';
//import join from '../game/online/publicRoom'; <-- test this by adding some button

// Root container for every other component/ component group.
//If you can - group components within one to avoid this component to become
//too lengty and too detailed
let socket;
let timeout;

const App = () => {

    const [activePlayers, setActivePlayers] = useState(0);

    useEffect(() => {
        join();
    }, []);

    const join = () => {

        socket = io(process.env.REACT_APP_API_BASE_ADDRESS, {
            reconnectionDelayMax: 10000,
            // auth: (cb) => {
            //     cb({
            //         token: localStorage['bearer-token']
            //     });
            // }
            query: {
                token: localStorage['bearer-token']
            }
        });

        console.log('connection with realtime server established');

        socket.on('testReceive', (data) => {
            console.log('received user..');
            console.log(data);
        })

        socket.on('receive-active-players', (data) => {     //gets active players now
            setActivePlayers(data.activePlayers);
        })

        setInterval(() => {
            socket.emit('get-active-players');
            console.log('counter update');
        }, 5000)

        socket.on('receive-current-person', (data) => {
            console.log(data);
        })

        socket.on('random-game-success', () => {
            clearTimeout(timeout);
            console.log('successfully connected to random duel') // <-- from this point on handling from the server
        })

        socket.on('only-one-game-at-a-time', () => {
            console.log('cant play more than 1 game at once!');
        })

        socket.on('attempt-random-game-reconnect', (data) => {
            console.log('trying to find players..')
            timeout = setTimeout(() => {
                socket.emit('request-random-game');
            }, 1000);
        })

        socket.on('session-active-in-another-tab', () => {
            clearTimeout(timeout);
            console.log('Session is active in another tab!');
        })

        socket.on('opponent-quit', () => {
            console.log('opponent has disconnected!')
        })

        socket.on('matchmaking-success', (data) => {
            console.log('opponent has been found successfully');
            console.log('The room is: ' + data.roomId);
        })
    }

    const getUser = () => {
        socket.emit('get-current-person');
    }

    const randomGame = () => {
        console.log('requested a game');
        socket.emit('request-random-game');
    }

    const setSessionHere = () => {
        socket.emit('set-session-to-current-tab');
    }

    // const getUser = async () => {
    //     const endpoint = `${process.env.REACT_APP_API_BASE_ADDRESS}/test`
    //     const res = await fetch(endpoint, {
    //         method: 'GET',
    //         mode: 'cors',
    //         headers: {
    //             'Accept': 'application/json, text/plain',
    //             'Content-Type': 'application/json',
    //         }
    //     });
    //     const payload = await res.json();
    //     console.log(payload);
    // }

    return (
        <div>
            {/* <button onClick={join}>Test connect</button> */}
            <button onClick={getUser}>Get user</button>
            <button onClick={randomGame}>Random duel</button>
            <button onClick={setSessionHere}>Set session here</button>
            <br />
            <div>Active players</div>
            <div>{activePlayers}</div>
            <Registration />
            <Login />
        </div>
    );
};

export default App;