const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const User = require("../models/userModel");

passport.use(
    "google-signup",
    new GoogleStrategy(
        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: "/auth/google/signup/callback",
            scope: ["email"], // Only request email access
        },
        async function (accessToken, refreshToken, profile, callback) {
            try {
                callback(null, profile.emails[0].value); // Use the first email
            } catch (error) {
                callback(error, null);
            }
        }
    )
);

passport.use(
    "google-login",
    new GoogleStrategy(
        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: "/auth/google/login/callback",
            scope: ["email"], // Only request email access
        },
        async function (accessToken, refreshToken, profile, callback) {
            try {
                callback(null, profile.emails[0].value); // Use the first email
            } catch (error) {
                callback(error, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser(async (email, done) => {
    try {
        const user = await User.findOne({ email });
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;
