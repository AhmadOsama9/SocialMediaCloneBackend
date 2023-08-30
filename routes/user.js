const express = require("express");
const passport = require("../passport");

const { 
    signupUser, 
    loginUser,
    google,
    checkUserInfo,
    checkToken,
} = require("../controllers/userController");

const router = express.Router();

router.post("/login", loginUser);
router.post("/signup", signupUser);

router.get("/checktoken", checkToken);
router.post("/checkuserinfo", checkUserInfo);

router.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["email"] })
);
router.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "http://localhost:5173/" }),
    google
);



module.exports = router;
