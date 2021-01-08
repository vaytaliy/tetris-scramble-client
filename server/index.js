//main
const express = require('express');
const app = express();
//const cookieSession = require('cookie-session');
//const cookieParser = require('cookie-parser');
const http = require('http').createServer(app);
const cors = require('cors');
const io = require('socket.io')(http);
const socketGame = require('./gameConnection/publicConnection/publicConnection');

require('dotenv').config();

app.use(express.static('public'));

app.use(cors());
app.use(express.urlencoded({
    extended: false
}));

socketGame.socketConnection(io); //global socketio object with all data carried by it

const serverurl = process.env.SERVER_URL || 'localhost';
const port = process.env.PORT || 8079;


app.get('/game', (req, res) => {
    res.render('gamepage.ejs');      //ejs wont be used, react instead
});

app.get('/', (req, res) => {
    res.render('landingpage.ejs');
})

http.listen(port, () => {
    console.log(`listening on port ${port}, server address: ${serverurl}`);
});