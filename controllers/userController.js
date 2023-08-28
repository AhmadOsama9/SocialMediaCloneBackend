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
        const  email  = req.user.emails[0].value;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        const token = createToken(user._id);
        user.jwt = token;
        const savedUser = await user.save();
        if (!savedUser) {
            throw Error("Failed to save the user");
        }

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
        const savedUser = await user.save();
        if (!savedUser) {
            throw Error("Failed to save the user");
        }

        const redirectURL = `http://localhost:5173/logincallback?email=${email}&token=${user.jwt}&role=${"user"}&userId=${user._id}`;
        res.redirect(redirectURL);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const googleSignup = async (req, res) => {
    try {
        if (!req.user || !req.user.emails || !req.user.emails[0].value) {
            console.error('Missing or invalid user data');
            res.status(400).json({ error: 'Missing or invalid user data' });
            return;
        }
        const email  = req.user.emails[0].value;         

        async function handleAsyncOperations() {

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
            user.jwt = token;
            const savedUser = await user.save();
            if (!savedUser) {
                throw Error("Failed to save the user");
            }

            const redirectURL = `http://localhost:5173/signupcallback?email=${email}&token=${token}&role=${"user"}&userId=${user._id}`;
            res.redirect(redirectURL);
        }

        await handleAsyncOperations();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const checkToken = async (req, res) => {
    const { userId, token } = req.query;

    const user = await User.findById(userId);
    if (!user) {
        res.status(400).json({error: "User not found"});
    }
    if (!user.jwt) {
        res.status(400).json({error: "The user doesn't have a token"});
    }
    if (user.jwt !== token) {
        res.status(400).json({error: "The token is not valid"});
    }
    if ( user.jwt === token) {
        res.status(200).json(user.jwt);
    }
}

const getUserInfo = async (req, res) => {
    const { userId } = req.query;

    const user = await User.findById(userId);
    if (!user) {
        res.status(400).json({error: "User not found"});
    }
    else {
        res.status(200).json({email: user.email, token: user.jwt, role: user.role, userId: user._id});
    }
}

module.exports = {
    signupUser,
    loginUser,
    googleLogin,
    googleSignup,
    getUserInfo,
    checkToken,
};
