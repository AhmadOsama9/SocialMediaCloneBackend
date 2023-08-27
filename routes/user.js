const express = require("express");
const passport = require("../passport");
const User = require("../models/userModel");
const Profile = require("../models/profileModel");
const UserActivity = require("../models/userActivityModel");

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
    (req, res) => {
        console.log("It enters the googleSignup that being called through callback of googleSignup");
        try {
            const { email } = req.user.emails[0].value;
    
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
    
            //I think about returning a password that being changed
            //after being used once, that will make sure that even
            //if they copied the same url it won't work
    
            const redirectURL = `http://localhost:5173/signupcallback?email=${email}&token=${token}&role=${"user"}&userId=${user._id}`;
            res.redirect(redirectURL);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
)
  
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
