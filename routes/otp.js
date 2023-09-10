const express = require("express");
const router = express.Router();

const {
    createAndSendOTP,
    validateOTP,
} = require("../controllers/otpController");

router.post("/sendotp", createAndSendOTP);

router.post("/validateotp", validateOTP);

module.exports = router;