const User = require("../models/userModel");
const Profile = require("../models/profileModel");
const UserActivity = require("../models/userActivityModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET_JWT, { expiresIn: "3d" });
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);

        const token = createToken(user._id);
        user.jwt = token;
        const savedUser = await user.save();
        if (!savedUser) {
            throw Error("Failed to save the user");
        }

        res.status(200).json({ email, token, role: user.role, userId: user._id });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const googleLogin = async (email, res) => {
    try {

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

        const redirectURL = `http://localhost:5173/logincallback?email=${email}&token=${token}&role=${"user"}&userId=${user._id}`;
        res.redirect(redirectURL);
    } catch (error) {
        const redirectURL = `http://localhost:5173/logincallback?error=${error}`;
        res.redirect(redirectURL);
    }
};

const signupUser = async (req, res) => {
    const { email, password, role } = req.body;

    try {
        const user = await User.signup(email, password, role);

        const profile = await Profile.create({
            user: user._id,
            image: "0",
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

        res.status(200).json({ email, token, role: 'user', userId: user._id });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const googleSignup = async (email, res) => {
    try {
        async function handleAsyncOperations() {

            const user = await User.googleSignup(email, "user");

            const userProfile = await Profile.create({
                user: user._id,
                image: "0",
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
        const redirectURL = `http://localhost:5173/signupcallback?error=${error}`;
        res.redirect(redirectURL);
    }
}

const google = async (req, res) => {
    if (!req.user || !req.user.emails || !req.user.emails[0].value) {
        console.error('Missing or invalid user data');
        res.status(400).json({ error: 'Missing or invalid user data' });
        return;
    }

    const email = req.user.emails[0].value;

    
    const exist = await User.findOne({ email });
    if (exist) {
        const match = await bcrypt.compare("`-_GOACCOGUNTLE_?", exist.password);
        if(exist && match) {
            googleLogin(email, res);
        } 
        if (exist && !match) {
            const error = "Your email is already registered but not as a google account";
            const redirectURL = `http://localhost:5173/signupcallback?error=${error}`;
            res.redirect(redirectURL);
        }
    }
    if (!exist) {
        googleSignup(email, res);
    }
}

const checkToken = async (req, res) => {
    const { userId, token } = req.query;
    if (!userId || !token) {
        res.status(400).json({error: "userId or the token is missing"});
    }

    const user = await User.findById(userId);

    if (!user) {
        res.status(400).json({error: "User not found"});
    }
    if (user.jwt !== token) {
        res.status(400).json({error: "The token is not valid"});
    }
    if ( user.jwt === token) {
        res.status(200).json(user.jwt);
    }
}

const checkUserInfo = async (req, res) => {
    const { userId, role, email, token } = req.query;

    const user = await User.findById(userId);
    if (!user) {
        res.status(400).json({error: "User not found"});
    }
    if (user.email !== email) {
        res.status(400).json({error: "Invalid User Info"});
    }
    if (user.role !== role) {
        res.status(400).json({error: "Invalid User Info"});
    }
    if (user.jwt !== token) {
        res.status(400).json({error: "Invalid User Info"});
    }
    else {
        res.status(200).json({message: "Valid User Info"});
    }
}

module.exports = {
    signupUser,
    loginUser,
    google,
    checkUserInfo,
    checkToken,
};
