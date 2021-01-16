//main
const express = require('express');
const app = express();
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const http = require('http').createServer(app);
const cors = require('cors');
const path = require('path');
const io = require('socket.io')(http);
const socketGame = require('./gameConnection/publicConnection/publicConnection');
const bodyParser = require('body-parser');
const { hashPassword, comparePassword } = require('./middleware/encrypt');

const passport = require('passport');
//const CookieStrategy = require('passport-cookie');//dont need
const LocalStrategy = require('passport-local').Strategy;
//const { createProxyMiddleware } = require('http-proxy-middleware');

const registration = require('./routes/registration');
const login = require('./routes/login');


require('dotenv').config();
app.use(express.static(path.join(__dirname, 'client/build')));

//====Set up of environment variables====
// set env allowed origin 


//const serverurl = process.env.SERVER_URL || 'localhost';
const port = process.env.PORT || 8079;
const allowedOrigin = process.env.ALLOWED_ORIGIN || `localhost:${port}`;
//=======================================
//app.use('**', createProxyMiddleware({ target: allowedOrigin, changeOrigin: true }));
const db = require('./db/index');
//app.use(cors());
app.use(cors({origin: allowedOrigin, credentials: true}));
//app.use(cors({ origin: allowedOrigin, credentials: true}));
// app.use(express.urlencoded({
//     extended: false
// }));

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({type: ['application/json', 'text/plain']}));

app.use(cookieParser());
app.use(cookieSession({
    name: 'session',
    keys: [process.env.KEY1 + ''],
    maxAge: 1000 * 60 * 24 * 10,
}))

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user.user_id);
});

passport.deserializeUser(async (id, done) => {
    const searchRes = await db.queryTable('SELECT * FROM registered_users WHERE user_id = $1', [id])
    const user = searchRes.rows[0];
    console.log('deserialized');
    done(null, user);
});

passport.use(new LocalStrategy({
}, async (username, password, done) => {
    try {
        const searchRes = await db.queryTable('SELECT * FROM registered_users WHERE username = $1', [username])
        const user = searchRes.rows[0];
        if (!user) {
            console.log('no such user');
            return done('null', false, { message: 'User does not exist' });
        } else {
            const isValid = await comparePassword(password, user.password);
            console.log(isValid);
            if (isValid) {
                console.log('valid');
                return done(null, user);
            } else {
                return done(null, false, { message: 'Incorrect password' });
            }
        }
    } catch (err) {
        console.log(err.message);
    }
}))

socketGame.socketConnection(io); //global socketio object with all data carried by it



app.get('/game', (req, res) => {
    res.render('gamepage.ejs');      //ejs wont be used, react instead
});

app.get('/', (req, res) => {
    console.log(req.user);
    if (!req.user) {
        respUser = 'none'
    } else {
        respUser = req.user.username;
    }
    res.json({ message: 'ok', code: 200, user: respUser });
})

//[TBD]add middleware that checks new user already exists/ checks to validate user name, passwords etc
app.use(registration);
app.use(login);


http.listen(port, () => {
    console.log(`listening on port ${port}`);
});
