require('dotenv').config();

const models = require("../../database/models/index");
const JwtStrategy = require('passport-jwt').Strategy;

const socketStrategy = (new JwtStrategy({
    jwtFromRequest: () => {
        let token = null;
        if (this.token) {
            console.log(token);
        }
        return token;
    },
    secretOrKey: process.env.JWT_SECRET
},
    (jwtPayload, cb) => {
        return models.User.findOne({
            where: { id: jwtPayload }
        })
            .then(user => {
                return cb(null, user);
            })
            .catch(err => {
                return cb(err);
            });
    })
);

module.exports = socketStrategy;