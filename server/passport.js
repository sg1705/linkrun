var config        = require('config');
var passport      = require('passport');
var GoogleStrategy  = require('passport-google-oauth20').Strategy;
class Passport {

    setupPassport() {
        console.log('setting up passport');
        /**
         * PassportJS Google strategy specifics
         * Assumes you've inputted your OAuth service credentials in the
         * /config/default.json or production file as necessary.
         */
        passport.use(
            new GoogleStrategy({
                clientID         : config.get('oauthCredentials.google.id'),
                clientSecret     : config.get('oauthCredentials.google.secret'),
                callbackURL      : config.get('oauthCallbacks.googleCallbackUrl'),
                passReqToCallback: true

            },            
            function(request, accessToken, refreshToken, profile, done) {
                console.log(refreshToken);
                return done(null, profile);
            })
        );

        // used to serialize the user for the session
        passport.serializeUser(function(user, callback) {
            console.log('serialize user');
            callback(null, user);
        });
        // used to deserialize the user
        passport.deserializeUser(function(id, callback) {
            console.log('deserializing');
            callback(null, id);
        });
    }
}

module.exports = Passport;