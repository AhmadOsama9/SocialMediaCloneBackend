const express = require("express");
const passport = require("../passport");
const User = require("../models/userModel");
const Profile = require("../models/profileModel");
const UserActivity = require("../models/userActivityModel");

const { 
    signupUser, 
    loginUser,
    googleLogin,
} = require("../controllers/userController");

const router = express.Router();

router.post("/login", loginUser);
router.post("/signup", signupUser);

router.get("/auth/google/signup", (req, res, next) => {
    passport.authenticate("google-signup", { scope: ["email"] })(req, res, next);
});

router.get(
    "/auth/google/signup/callback", (req, res, next) => {
    passport.authenticate("google-signup", { failureRedirect: "http://localhost:5173/" }),
    async function (req, res) {
        console.log("It enters the googleSignup that being called through callback of googleSignup");
        try {
            const profile = req.user;

            if (!profile || !profile.emails || !profile.emails[0] || !profile.emails[0].value) {
                return res.status(400).json({ error: "Google profile or email not found" });
            }

            const email = profile.emails[0].value;

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

            const user = await User.googleSignup(email, "user");

            const token = createToken(user._id);

            res.status(200).json({ email, token, role: 'user', userId: user._id });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }(req, res, next);
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
