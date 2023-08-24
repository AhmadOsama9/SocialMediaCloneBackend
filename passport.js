const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");

passport.use(
    "google-signup",
    new GoogleStrategy(
        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: "http://localhost:5173/signup",
            passReqToCallback   : true,
            scope: ["email"], // Only request email access
        },
        async function (request, accessToken, refreshToken, profile, callback) {
            return callback(null, profile);
        }
    )
);

passport.use(
    "google-login",
    new GoogleStrategy(
        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: "https://merngymprojectbackend.onrender.com/api/user/auth/google/login/callback",
            passReqToCallback   : true,
            scope: ["email"], // Only request email access
        },
        async function (request, accessToken, refreshToken, profile, callback) {
            return callback(null, profile);
        }
    )
);


module.exports = passport;
