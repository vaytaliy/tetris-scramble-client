//main
require('dotenv').config();

const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const http = require('http').createServer(app);
const cors = require('cors');
const io = require('socket.io')(http, {
  cors: {
      origin: process.env.REACT_CLIENT_ORIGIN,
      methods: ['GET', 'POST']
  }
});
const bodyParser = require('body-parser');
const passport = require('./routes/authorization/passport');
const registration = require('./routes/registration');
const login = require('./routes/login');
const user = require('./routes/user');
const { Sequelize } = require('sequelize');
const hub = require('./realtime/hub');
const sequelize = new Sequelize(process.env.DATABASE_URL);

try {
  sequelize.authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
    });

} catch (error) {
  console.error('Unable to connect to the database:', error);
}

const port = process.env.PORT || 8079;
app.use(cors({ origin: process.env.REACT_CLIENT_ORIGIN, credentials: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: ['application/json', 'text/plain'] }));
app.use(cookieParser());

// Instantiates passport settings.
app.use(passport.initialize());
app.use(passport.session());

//initialize hub that accepts socket connections
hub(io); 

// Base route for the initial version of endpoints. 
// If extension is evere needed into v2, this will smoothly allow phasing over.
const baseRoute = '/api/v1';

app.use(`${baseRoute}/auth`, registration);
app.use(`${baseRoute}/auth`, login);

// Routes below require token authorization.
// Without providing a token an Unauthorized response is given.
app.use(`${baseRoute}/user`, passport.authenticate('jwt', { session: false }), user);

http.listen(port, () => {
  console.log(`listening on port ${port}`);
});
