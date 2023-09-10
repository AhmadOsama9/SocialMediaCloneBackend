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
    otpExpiry: Date,
})

otpSchema.statics.createAndSendOTP = async function (email) {
    if (!email) {
        throw Error("The email has not been sent");
    }

    email = email.toLowerCase();
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailRegex.test(email)) {
        throw Error("Email is not valid, only google account are valid");
    }

    const existingOTP = await this.findOne({ email, otpExpiry: { $gt: new Date() } });

    if (existingOTP) {
        throw Error("An active OTP already exists for this email. Please check your email or wait for it to expire.");
    }

    const randomstring = require('randomstring')
    const otp = randomstring.generate({
        length: 6,
        charset: 'numeric',
    });
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 5);
    
    const existingOTP2 = await this.findOne({email});
    if (!existingOTP2) {
        const createdOTP = await this.create({email, otp, otpExpiry});
        if (!createdOTP) {
            throw Error("Failed to create the otp");
        }
    } else {
        existingOTP2.otp = otp;
        existingOTP2.otpExpiry = otpExpiry;
        
        const updatedExistingOTP = existingOTP2.save();
        if (!updatedExistingOTP) {
            throw Error("Failed to save the updated OTP");
        }
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
        subject: 'verification OTP',
        text: `Your OTP for verification is: ${otp}`,
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
    email = email.toLowerCase();
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailRegex.test(email)) {
        throw Error("Email is not valid, only google account are valid");
    }
    
    const emailOTP = await this.findOne({email});
    if (!emailOTP) {
        throw Error("There's no otp for that email");
    }
    if (emailOTP.otp !== otp) {
        throw Error("Invalid OTP");
    }
    const currentTimestamp = new Date();
    if (currentTimestamp > emailOTP.otpExpiry) {
        throw Error("OTP has expired");
    }
}

module.exports = mongoose.model("Otps", otpSchema);