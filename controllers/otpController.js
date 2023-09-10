const OTP = require("../models/otpModel");

const createAndSendOTP = async (req, res) => {
    const {email} = req.body;

    try {
        await OTP.createAndSendOTP(email);
        res.status(200).json({message: "The otp has been sent"});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const validateOTP = async (req, res) => {
    const { email, otp } = req.body;
    
    try {
        await OTP.validateOTP(email, otp);
        res.status(200).json({message: "The otp is valid"});
    } catch (error) {
        res.status(200).json({error: error.message});
    }
}


module.exports = {
    createAndSendOTP,
    validateOTP,
}