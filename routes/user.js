const express = require("express");
const passport = require("../passport");

const { 
    signupUser, 
    loginUser,
    google,
    getUserInfo,
    checkToken,
} = require("../controllers/userController");

const router = express.Router();

router.post("/login", loginUser);
router.post("/signup", signupUser);

router.get("/checktoken", checkToken);
router.get("/userinfo", getUserInfo);

router.get(
    "/auth/google",
    passport.authenticate("google-signup", { scope: ["email"] })
);
router.get(
    "/auth/google/callback",
    passport.authenticate("google-signup", { failureRedirect: "http://localhost:5173/" }),
    google
);



module.exports = router;
