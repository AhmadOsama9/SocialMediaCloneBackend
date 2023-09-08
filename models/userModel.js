const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");


const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    jwt: {
        type: String,
        default: "Not Created Yet",
    }
})

userSchema.statics.signup = async function(email, password, role) {
    if(!email || !password) {
        throw Error("All Fields Must Be Filled");
    }

    email = email.toLowerCase();

    if(!validator.isEmail(email)) {
        throw Error("Email is not valid");
    }
    if(!validator.isStrongPassword(password)) {
        throw Error("Password is not Strong enough");
    }
    

    const exist = await this.findOne({ email });

    if(exist) {
        throw Error("Email is Already Registered");
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
     
    const user = await this.create({ email, password: hash, role: role || "user"});

    return user;
}

userSchema.statics.googleSignup = async function(email, role) {
    if(!email) {
        throw Error("The email is missing");
    }

    if(!validator.isEmail(email)) {
        throw Error("Email is not valid");
    }    

    const exist = await this.findOne({ email });

    if(exist) {
        throw Error("Email is Already Registered");
    }
     
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash("`-_GOACCOGUNTLE_?", salt);

    const user = await this.create({ email, password: hash, role: role || "user", jwt: "Not Created Yet"});

    return user;
}



userSchema.statics.login = async function(email, password) {
    if(!email || !password) {
        throw Error("All Fields Must Be Filed");
    }

    const user = await this.findOne({ email });

    if(!user) {
        throw Error("Incorrect Email");
    }

    const match = await bcrypt.compare(password, user.password);

    if(!match) {
        throw Error("Incorrect Password");
    }

    return user;

}

userSchema.statics.forgotPassword = async function (email) {
    if (!email) {
        throw Error("The email has not been sent");
    }
    const user = await this.findOne({ email });
    if (!user) {
        throw Error("Incorrect Email");
    }
    const match = await bcrypt.compare("`-_GOACCOGUNTLE_?", user.password);
    if (match) {
        throw Error("This email has been registered as google email, It can't be recovered using OTP");
    }

    const randomstring = require('randomstring')
    const otp = randomstring.generate({
        length: 6,
        charset: 'numeric',
    });
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 5);
    
    user.passwordResetOTP = otp;
    user.otpExpiry = otpExpiry;

    const savedUser = await user.save();
    if (!savedUser) {
        throw Error("Valid to save the udpated User");
    }

    const nodemailer = require('nodemailer');

    // Create a transporter object using your email service (e.g., Gmail)
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
      
    await transporter.sendMail(mailOptions);
}

userSchema.statics.validateOTP = async function (email, otp) {
    if (!email || !otp) {
        throw Error("Missing Info");
    }
    const user = await this.findOne({ email });
    if (!user) {
        throw Error("Incorrect Email");
    }

    if (user.passwordResetOTP !== otp) {
        throw Error("Invalid OTP");
    }

    const currentTimestamp = new Date();
    if (currentTimestamp > user.otpExpiry) {
        throw Error("OTP has expired");
    }

    const newPassword = generateNewPassword();
    user.password = newPassword;

    user.passwordResetOTP = undefined;
    user.otpExpiry = undefined;

    const savedUser = await user.save();
    if (!savedUser) {
        throw Error("Failed to save the updated user");
    }

    return newPassword;
}



module.exports = mongoose.model('Users', userSchema);