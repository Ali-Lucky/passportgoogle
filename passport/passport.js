const passport = require("passport");
const User = require("../models/user");

var GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id)
        .then(user => {
            done(null, user);
        })
        .catch(err => {
            done(err, null);
        });
});


passport.use(
    new GoogleStrategy(
        {
            clientID: "1035544981012-d7j6k5s9nh1883e10empg8hi3221r8a1.apps.googleusercontent.com",
            clientSecret: "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",
            callbackURL: "http://localhost:4000/auth/google/callback",
        },
        (accessToken, refreshToken, profile, next) => {
            console.log("MY PROFILE", profile._json.email);
            User.findOne({ email: profile._json.email }).then((user) => {
                if (user) {
                    console.log("User already exits in DB", user);
                    next(null, user);
                    // cookietoken()
                } else {
                    User.create({
                        name: profile.displayName,
                        googleId: profile.id,
                        email: profile._json.email
                    })
                        .then((user) => {
                            console.log("New User", user);
                            next(null, user);
                            // cookietoken()
                        })
                        .catch((err) => console.log(err));
                }
            });

            //   next();
        }
    )
);
