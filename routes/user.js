const express = require("express");
const passport = require("../passport");
const User = require("../models/userModel");
const Profile = require("../models/profileModel");
const UserActivity = require("../models/userActivityModel");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET_JWT, { expiresIn: "3d" });
};

const { 
    signupUser, 
    loginUser,
    googleLogin,
    getUserToken,
    getUserInfo,
} = require("../controllers/userController");

const router = express.Router();

router.post("/login", loginUser);
router.post("/signup", signupUser);

router.get("/usertoken", getUserToken);
router.get("/userinfo", getUserInfo);

router.get(
    "/auth/google/signup",
    passport.authenticate("google-signup", { scope: ["email"] })
);
router.get(
    "/auth/google/signup/callback",
    passport.authenticate("google-signup", { failureRedirect: "http://localhost:5173/" }),
    async (req, res) => {
        try {
            if (!req.user || !req.user.emails || !req.user.emails[0].value) {
                console.error('Missing or invalid user data');
                res.status(400).json({ error: 'Missing or invalid user data' });
                return;
            }
            const email  = req.user.emails[0].value;         

            async function handleAsyncOperations() {

                const user = await User.googleSignup(email, "user");

                const userProfile = await Profile.create({
                    user: user._id,
                    nickname: "",
                    bio: "",
                });
                if (!userProfile) {
                    throw Error("Failed to create a profile");
                }
    
                const userActivity = await UserActivity.create({
                    user: user._id,
                });
                if (!userActivity) {
                    throw Error("Failed to create a userActivity");
                }
    
                const token = createToken(user._id);
                user.jwt = token;
    
                const redirectURL = `http://localhost:5173/signupcallback?email=${email}&token=${token}&role=${"user"}&userId=${user._id}`;
                res.redirect(redirectURL);
            }
    
            await handleAsyncOperations();
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
);

router.get(
    "/auth/google/login",
    passport.authenticate("google-login", { scope: ["email"] })
);
router.get(
    "/auth/google/login/callback",
    passport.authenticate("google-login", { failureRedirect: "http://localhost:5173/" }),
    googleLogin
);

module.exports = router;
