//main
const express = require('express');
const app = express();
//const cookieSession = require('cookie-session');
//const cookieParser = require('cookie-parser');
const http = require('http').createServer(app);
const cors = require('cors');
const io = require('socket.io')(http);

require('dotenv').config();

app.use(express.static('public'));

app.use(cors());
app.use(express.urlencoded({
    extended: false
}));

const serverurl = process.env.SERVER_URL || 'localhost';
const port = process.env.PORT || 8079;


app.get('/game', (req, res) => {
    res.render('gamepage.ejs');      //ejs wont be used, react instead
});

app.get('/', (req, res) => {
    res.render('landingpage.ejs');
})

io.on('connection', socket => {
    console.log('somebody has connected');

    socket.on('publicRoom', handlePublicConnection);
    socket.on('initGame', initGame);


    socket.on('disconnect', () => {

        if (socket.matchMakingOk) {
            handleDisconnectOnMatchmaking(socket.activeRoom);
        }
    })

    function handleDisconnectOnMatchmaking(exitedSocketRoom) {
        io.in(exitedSocketRoom).emit('opponentQuit', { message: "opponent exited the game" }) // tell socket in that room to handle disconnection of the opponent
        console.log('broken conn');                                                         // handle disconnection if somebody left abruptly
    }

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
            io.in('publicRoom').emit('matchmakingSuccess', { message: "connected to the game successfully", roomId: socket.id });
        }
    }

    function initGame(socketid) {
        socket.activeRoom = socketid;       //property needed to notify another client on disconnect
        socket.matchMakingOk = true;        //property to check if disconnect was on matchmaking
        socket.leave('publicRoom');
        if (io.sockets.adapter.rooms.get(socketid).size < 2) {
            socket.join(socketid);
            console.log(`Ready to play, room size: ${io.sockets.adapter.rooms.get(socketid).size}`)
        }
    }

});

http.listen(port, () => {
    console.log(`listening on port ${port}, server address: ${serverurl}`);
});