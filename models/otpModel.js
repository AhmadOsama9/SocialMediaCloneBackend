const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const otpSchema = new Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
    },
    otp: {
        type: String,
    },
    otpExpiry: Data,
})

otpSchema.statics.createAndSendOTP = async function (email) {
    if (!email) {
        throw Error("The email has not been sent");
    }
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailRegex.test(email)) {
        throw Error("Email is not valid, only google account are valid");
    }

    const randomstring = require('randomstring')
    const otp = randomstring.generate({
        length: 6,
        charset: 'numeric',
    });
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 5);
    
    const createdOTP = await this.create({email, otp, otpExpiry});
    if (!createdOTP) {
        throw Error("Failed to create the otp");
    }

    const nodemailer = require('nodemailer');

    const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'mailotp153@gmail.com',
        pass: process.env.EMAIL_PASSWORD,
    },
    });
    const mailOptions = {
        from: 'mailotp153@gmail.com',
        to: email,
        subject: 'Password Reset OTP',
        text: `Your OTP for password reset is: ${otp}`,
    };
      
    const sendMail = await transporter.sendMail(mailOptions);
    if (!sendMail) {
        throw Error("Failed due to the sendMail function");
    }
    
}

otpSchema.statics.validateOTP = async function (email, otp) {
    if (!email) {
        throw Error("The email has not been sent");
    }
    if (!validator.isEmail(email)) {
        throw Error("Email is not valid");
    }
    
    const emailOTP = await this.findOne({email});
    if (!emailOTP) {
        throw Error("There's no otp for that email");
    }
    if (emailOTP.otp !== otp) {
        throw Error("Invalid OTP");
    }
    const currentTimestamp = new Date();
    if (currentTimestamp > user.otpExpiry) {
        throw Error("OTP has expired");
    }
}

module.exports = mongoose.model("Otps", otpSchema);