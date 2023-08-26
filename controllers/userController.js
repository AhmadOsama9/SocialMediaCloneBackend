const User = require("../models/userModel");
const Profile = require("../models/profileModel");
const UserActivity = require("../models/userActivityModel");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET_JWT, { expiresIn: "3d" });
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);

        const token = createToken(user._id);

        res.status(200).json({ email, token, role: user.role, userId: user._id });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const googleLogin = async (req, res) => {
    try {
        const profile = req.user;

        if (!profile || !profile.emails || !profile.emails[0] || !profile.emails[0].value) {
            return res.status(400).json({ error: "Google profile or email not found" });
        }

        const email = profile.emails[0].value;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        const token = createToken(user._id);

        res.status(200).json({ email, token, role: 'user', userId: user._id });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const signupUser = async (req, res) => {
    const { email, password, role } = req.body;

    try {
        const user = await User.signup(email, password, role);

        const profile = await Profile.create({
            user: user._id,
            nickname: "",
            bio: "",
        });
        if (!profile) {
            throw Error("Failed to create a profile");
        }

        const userActivity = await UserActivity.create({
            user: user._id,
        });
        if (!userActivity) {
            throw Error("Failed to create a userActivity");
        }

        const token = createToken(user._id);
        res.status(200).json({ email, token, role: user.role, userId: user._id });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const googleSignup = async (req, res) => {
    console.log("It enters the googleSignup that being called through callback of googleSignup");
    try {
        const profile = req.user;

        if (!profile || !profile.emails || !profile.emails[0] || !profile.emails[0].value) {
            return res.status(400).json({ error: "Google profile or email not found" });
        }

        const email = profile.emails[0].value;

        const user = await User.googleSignup(email, "user");

        const userProfile = await Profile.create({
            user: user._id,
            nickname: "",
            bio: "",
        });
        if (!userProfile) {
            throw Error("Failed to create a profile");
        }

        const userActivity = await UserActivity.create({
            user: user._id,
        });
        if (!userActivity) {
            throw Error("Failed to create a userActivity");
        }  

        const token = createToken(user._id);

        res.status(200).json({ email, token, role: 'user', userId: user._id });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    signupUser,
    loginUser,
    googleLogin,
    googleSignup,
};
