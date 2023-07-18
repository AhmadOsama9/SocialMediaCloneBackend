const User = require("../models/userModel");
const Profile = require("../models/profileModel");
const jwt = require("jsonwebtoken");


const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET_JWT, {expiresIn: "3d"});
}

const loginUser = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.login(email, password);

        const token = createToken(user._id);

        res.status(200).json({email, token, role: user.role});

    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const signupUser = async (req, res) => {
    const {email, password, role} = req.body;

    try {
        const user = await User.signup(email, password, role);
        
        await Profile.create({
            user: user._id,
            nickname: "Enter your nickname",
            age: 0,
            gender: "choose man or woman",
            bio: "Enter your bio"
        });

        const token = createToken(user._id);
        res.status(200).json({email, token, role: user.role, userId: user.user._id});

    } catch(error) {
        res.status(400).json({error: error.message});
    }
}

module.exports = {
    signupUser, loginUser
}