/* globals module, require */
/* use strict */

const passport= require('passport'),
    LocalStratey= require('passport-local'),
    crypto = require('crypto'),
    secret = require('./../config').cryptoSecret;
    // googleStrategy= require('./strategies/google-strategy');
function hash(password) {
    return crypto.createHmac('sha256', secret)
                   .update(password)
                   .digest('hex');
}
module.exports= function (app, data) {
    app.use(passport.initialize());
    app.use(passport.session());

    const Strategy = new LocalStratey((username, password, done) => {

        data.findUserByCredentials(username, hash(password))
            .then(user => {
                if (user) {
                    return done(null, user);
                }

                return done(null, false);
            })
            .catch(error => done(error, null));
    });
    passport.use(Strategy);
    passport.serializeUser((user, done) => {
        if (user) {
            done(null, user.id);
        }
    });
    passport.deserializeUser((id, done) => {
        data.findUserById(id)
            .then(user => {
                if (user) {
                    return done(null, user);
                }
                return done(null, false);
            })
            .catch(error => done (error, false));
    });
};