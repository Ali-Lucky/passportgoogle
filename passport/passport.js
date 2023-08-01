// passportConfig.js

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use(
    new GoogleStrategy(
        {
            clientID: "1035544981012-d7j6k5s9nh1883e10empg8hi3221r8a1.apps.googleusercontent.com",
            clientSecret: "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",
            callbackURL: "http://localhost:4000/auth/google/callback",
            passReqToCallback: true // Pass the req object to the callback function
        },
        (req, accessToken, refreshToken, profile, next) => {
            console.log('My profile', profile._json.email);
            User.findOne({ email: profile._json.email })
                .then((user) => {
                    if (user) {
                        console.log('User already registered', user);
                        next(null, user);
                    } else {
                        User.create({
                            name: profile.displayName,
                            googleId: profile.id,
                            email: profile._json.email
                        })
                            .then((user) => {
                                console.log('User registered', user);
                                // Save the session manually
                                req.session.save(() => {
                                    next(null, user);
                                });
                            })
                            .catch(err => console.log(err))
                    }
                })
            // next();
        }
    )
);

module.exports = passport;
