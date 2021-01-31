import axios from 'axios'; // might want to use axios for all requests later [TBD]
import React, { useState, useEffect } from 'react';
import Registration from './Registration';
import Login from './Login';
import io from 'socket.io-client';
import '../styles/game.css';
import { parse } from 'uuid';
//import join from '../game/online/publicRoom'; <-- test this by adding some button

// Root container for every other component/ component group.
//If you can - group components within one to avoid this component to become
//too lengty and too detailed
let socket;
let timeout;
let canContinueMashingButtons = false;

const App = () => {

    const [activePlayers, setActivePlayers] = useState(0);
    const [elemPosition, setElemPosition] = useState(0); //purely for test purposes
    const [elemPosition2, setElemPosition2] = useState(0); //purely for test purposes 
    const [gameTimer, setGameTimer] = useState(0); 

    useEffect(() => {
        join();
    }, []);

    //must be moved to another file
    const onlineGame = (socket, data) => {
        const { sockets, roomId } = data;

        let positionY = 0;


        socket.on('game-update-tick', (data) => {
            console.log(data);
            canContinueMashingButtons = true;
            let newPos = elemPosition + parseInt(data.position);
            
            console.log(data.socketId, ':', socket.id)
            if (data.socketId == socket.id) {          
                setElemPosition(newPos);
            } else {
                setElemPosition2(newPos);
            }

            //TBD handle keypresses 
            console.log('game tick');
        })

        socket.on('game-update-timer', (data) => {
            setGameTimer(data.timer);
        })

    }

    const join = () => {

        // move this to online game function. And this request
        // should be sent on any press for precision regardless on where timeout is on the server atm
        document.addEventListener('keydown', (e) => {
            console.log(e.key);
            if (e.key === 'ArrowDown' && canContinueMashingButtons) {
                canContinueMashingButtons = false;
                socket.emit('input-listen-update', { speedUpKeyPressed: true })
            }
        })

        socket = io(process.env.REACT_APP_API_BASE_ADDRESS, {
            reconnectionDelayMax: 10000,
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
            onlineGame(socket, data);
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
            <div>Time remaining {gameTimer}</div>
            <div className='game'>
                <div className='field p1'>
                    {/* these cells and their quantities will be dynamically rendered */}
                    <div className='cell' style={{ left: 0, top: elemPosition }}></div>
                </div>
                <div className='field p2'>
                    <div className='cell' style={{ left: 0, top: elemPosition2 }}></div>
                </div>
            </div>
        </div>
    );
};

export default App;