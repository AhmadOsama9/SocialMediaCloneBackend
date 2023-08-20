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


router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
    "/google/signup",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );
  
  router.get(
    "/google/signup/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    googleSignup
  );
  
  
  router.get(
    "/google/login",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );
  
  router.get(
    "/google/login/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    googleLogin
  );


module.exports = router;