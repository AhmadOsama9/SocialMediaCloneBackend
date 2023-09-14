const express = require("express");
const passport = require("../passport");

const { 
    signupUser, 
    loginUser,
    google,
    checkUserInfo,
    checkToken,
    forgotPassword,
    validateOTP,
    checkPassword,
    updatePassword,
} = require("../controllers/userController");

const router = express.Router();

router.post("/login", loginUser);
router.post("/signup", signupUser);

router.get("/checktoken", checkToken);
router.post("/checkuserinfo", checkUserInfo);

router.post("/checkpassword", checkPassword);
router.post("/updatepassword", updatePassword);

router.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["email"] })
);

router.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "https://socialmediaclone-s3lg.onrender.com/" }),
    google
);

router.post("/forgotpassword", forgotPassword);

router.post("/validateotp", validateOTP);



module.exports = router;
