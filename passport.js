const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
        done(null, user);
});

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: "https://merngymprojectbackend.onrender.com/api/user/auth/google/callback",
            passReqToCallback: true,
            scope: ["email"], // Only request email access
        },
        async function (request, accessToken, refreshToken, profile, done) {
            const tokenValid = verifyGoogleToken(accessToken);
            if (!tokenValid) {
                console.error("Invalid access token");
                return done(new Error("Invalid access token"), null);
            }

            return done(null, accessToken, profile);
        }
    )
);

module.exports = passport;
