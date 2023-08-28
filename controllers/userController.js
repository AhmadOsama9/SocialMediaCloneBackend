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
        user.jwt = token;

        res.status(200).json({ email, token, role: user.role, userId: user._id });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const googleLogin = async (req, res) => {
    try {
        const { email } = req.user.emails[0].value;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        const token = createToken(user._id);
        user.jwt = token;

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
        user.jwt = token;

        const redirectURL = `http://localhost:5173/logincallback?email=${email}&token=${token}&role=${"user"}&userId=${user._id}`;
        res.redirect(redirectURL);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}



const getUserToken = async (req, res) => {
    const { userId } = req.query;

    const user = User.findById(userId);
    if (!user.jwt) {
        res.status(400).json({error: "The user doesn't have a token"});
    }
    else {
        res.status(200).json(user.jwt);
    }
}

const getUserInfo = async (req, res) => {
    const { userId } = req.query;

    const user = User.findById(userId);
    if (!user) {
        res.status(400).json({error: "User not found"});
    }
    else {
        console.log("email: ", user.email);
        console.log("token: ", user.jwt);
        res.status(200).json({email: user.email, token: user.jwt, role: user.role});
    }
}

module.exports = {
    signupUser,
    loginUser,
    googleLogin,
    getUserToken,
    getUserInfo,
};
