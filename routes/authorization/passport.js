require('dotenv').config();

const { hashPassword, comparePassword } = require("../../middleware/encrypt");
const passport = require('passport');
const models = require("../../database/models/index");
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt;

// Sets up initial user/pass validation.
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (username, password, done) => {
    try {

        const user = await models.User.findOne({
            where: { username: username },
        });
        
        if (!user) {
            console.log(`User with username ${username} does not exist.`);
            return done('null', false);
        } else {
            const isValid = await comparePassword(password, user.password);
            if (isValid) {
                console.log('valid');
                return done(null, user);
            } else {
                return done(null, false);
            }
        }
    } catch (err) {
        console.log(err.message);
        return done(null, false);
    }
}));

passport.use(new JwtStrategy ({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey   : process.env.JWT_SECRET
},
function (jwtPayload, cb) {

    //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
    return models.User.findOne({
        where: { id: jwtPayload}
    })
    .then(user => {
        return cb(null, user);
    })
    .catch(err => {
        return cb(err);
    });
}
));

module.exports = passport;
