const express = require("express");
const passport = require("../passport");

const { 
    signupUser, 
    loginUser,
    googleLogin,
    googleSignup
} = require("../controllers/userController");

const router = express.Router();

router.post("/login", loginUser);
router.post("/signup", signupUser);

router.post("/googlesignup", googleSignup);
router.post("/googlelogin", googleLogin);

router.get(
    "/auth/google/signup",
    passport.authenticate("google-signup", { scope: ["email"] })
);
  
router.get(
    "/auth/google/login",
    passport.authenticate("google-login", { scope: ["email"] })
);
  

module.exports = router;
