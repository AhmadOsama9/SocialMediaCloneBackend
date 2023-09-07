const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const axios = require("axios");

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
        done(null, user);
});

async function verifyGoogleToken(accessToken) {
    try {
      // Make an HTTP GET request to Google's tokeninfo endpoint
      const response = await axios.get(`https://oauth2.googleapis.com/tokeninfo?access_token=${accessToken}`);
        console.log("The response.data.aud is: ", response.data.aud);
      // Check if the response contains the required fields
      if (response.data.aud && response.data.aud === process.env.CLIENT_ID) {
        // The token is valid and intended for your application
        return true;
      } else {
        // The token is not valid for your application
        return false;
      }
    } catch (error) {
      // An error occurred while verifying the token
      console.error('Error verifying Google token:', error);
      return false;
    }
}

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
            const tokenValid = await verifyGoogleToken(accessToken);
            if (!tokenValid) {
                console.error("Invalid access token");
                return done(new Error("Invalid access token"), null);
            }

            return done(null, accessToken, profile);
        }
    )
);

module.exports = passport;
