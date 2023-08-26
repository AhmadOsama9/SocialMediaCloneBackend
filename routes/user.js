const express = require("express");
const passport = require("../passport");
const User = require("../models/userModel");
const Profile = require("../models/profileModel");
const UserActivity = require("../models/userActivityModel");

const { 
    signupUser, 
    loginUser,
    googleLogin,
    googleSignup
} = require("../controllers/userController");

const router = express.Router();

router.post("/login", loginUser);
router.post("/signup", signupUser);

router.get(
    "/auth/google/signup",
    passport.authenticate("google-signup", { scope: ["email"] })
);

router.get(
    "/auth/google/signup/callback",
    passport.authenticate("google-signup", {failureRedirect: "http://localhost:5173/"}),
    googleSignup
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
