const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");


const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    }

    
})

userSchema.statics.signup = async function(email, password, role) {
    if(!email || !password) {
        throw Error("All Fields Must Be Filled");
    }

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

module.exports = mongoose.model('Users', userSchema);