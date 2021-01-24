
//Main entry point for socketio
//import functions to branch any live events in here

require('dotenv').config();

const jwt = require('jsonwebtoken');
const models = require("../database/models/index");
const getPlayersCounter = require('./notification');
const handlePublicConnection = require('./game/publicConnection/publicConnection');

const getUser = (socket) => {
    let user = { id: 'none' };

    if (socket.user) {
        user = socket.user;
    }

    return user;
}

const clearActiveConnectionsExceptId = async (newActiveSocketId, io, id) => {

    let socketIds = await io.of('/').in(`activeConnections-${id}`).sockets;


    socketIds.forEach(async (socketId) => {

        let currentSocket = await io.of('/').in(`activeConnections-${id}`).sockets.get(socketId.id);
        currentSocket.user.isActiveSession = false;

        if (currentSocket.id !== newActiveSocketId) {
            currentSocket.emit('session-active-in-another-tab');
        }
    })
    try {
        const foundSocket = await io.of('/').in(`activeConnections-${id}`).sockets.get(newActiveSocketId);
        foundSocket.user.isActiveSession = true;
    } catch (err) {
        console.log(err.message);
    }
}

const findUser = (socket, deserializedId, io) => {
    models.User.findOne({
        where: { id: deserializedId }
    })
        .then(user => {
            const { id, username } = user;
            socket.user = { id, username, isActiveSession: false };
            socket.join(`activeConnections-${id}`); // <-- add socket to room of connections related to this specific user
            clearActiveConnectionsExceptId(socket.id, io, id);
        })
        .catch(err => {
            socket.user = { id: 'none' };
            console.log(err);
        });
}

const verifyAndFindUser = (token, socket, io) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, deserializedId) => {          //middleware that tries find user
        if (err) {
            console.log(err);
        } else {
            findUser(socket, deserializedId, io);
        }
    })
}

// user is checked for auth token on connection
// checking if the same person is on another tab already
// [TBD] need to handle ability to move session to the current tab (like in whatsapp web)

const hub = (io) => {

    io.use((socket, next) => {
        let token = socket.handshake.query.token;

        if (!token) {
            console.log('something went wrong with auth token parsing');
            next();
        }

        verifyAndFindUser(token, socket, io);
        next();
    })

    io.on('connection', socket => {

        socket.on('get-active-players', () => {
            const data = { activePlayers: Math.floor(Math.random() * 10) }; // [TBD] Move logic to notification.js
            socket.emit('receive-active-players', data);
        });

        socket.on('disconnect', () => {
            const user = getUser(socket);

            if (user.isActiveSession) {
                verifyAndFindUser(socket.handshake.query.token, socket, io)  //<-- update active tab
            }

            console.log(`The user ${user.username} disconnected`); // <-- [TBD] must send this notification to others if client was in a game on disconnect            
        });

        socket.on('get-current-person', () => {
            const user = getUser(socket);
            socket.emit('receive-current-person', user);
        });

        socket.on('set-session-to-current-tab', async () => { // <-- if another window with same token is open, move session to this window
            const user = getUser(socket);

            try {
                await clearActiveConnectionsExceptId(socket.id, io, user.id);
                // io.of('/').sockets.get(socket.id).isActiveSession = true;
            } catch (err) {
                console.log(err.message);
            }
        });

        socket.on('request-random-game', () => {
            const user = getUser(socket);
            handlePublicConnection(io, socket, user);
        });
    })
}

module.exports = hub;