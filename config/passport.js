const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../app/models/user');
const dotenv = require('dotenv');
dotenv.config();

module.exports = (passport) => {

    const opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = process.env.JWT_SECRET;

    passport.use(
        new JWTStrategy(opts, (jwt_payload, done) => {

            User.findOne({_id: jwt_payload._id}, (err, user) => {

                if (err)
                    return done(err, false);
                if (user)
                    return done(null, user);
                else
                    return done(null, false);
            });
        })
    );
}