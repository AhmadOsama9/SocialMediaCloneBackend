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

        const userCount = await User.countDocuments();
        const userNickname = "user" + userCount;

        const userProfile = await Profile.create({
            user: user._id,
            image: "0",
            nickname: userNickname,
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

            const userCount = await User.countDocuments();
            const userNickname = "user" + userCount;

            const userProfile = await Profile.create({
                user: user._id,
                image: "0",
                nickname: userNickname,
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

async function verifyGoogleToken(accessToken) {
    try {
      // Make an HTTP GET request to Google's tokeninfo endpoint
      const response = await axios.get(`https://oauth2.googleapis.com/tokeninfo?access_token=${accessToken}`);
      // Check if the response contains the required fields
      console.log("The response.data.aud is: ", req.data.aud);
      console.log("The Client Id is: ", process.env.CLIENT_ID);
      if (response.data.aud && response.data.aud === process.env.CLIENT_ID) {
        // The token is valid and intended for your application
        return true;
      } else {
        // The token is not valid for your application
        return false;
      }
    } catch (error) {
      // An error occurred while verifying the token
      console.error('Error verifying Google token:', error);
      return false;
    }
}

const google = async (req, res) => {
    const tokenValid = await verifyGoogleToken(req.accessToken);
    if (!tokenValid) {
        const redirectURL = `http://localhost:5173/signupcallback?error=${"Invalid google Token"}`;
        res.redirect(redirectURL);
    }

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
    const { userId, role, email, token } = req.body;

    const user = await User.findById(userId);
    if (!user) {
        res.status(400).json({error: "User not found"});
    }
    else if (user.email !== email) {
        res.status(400).json({error: "Invalid User email"});
    }
    else if (user.role !== role) {
        res.status(400).json({error: "Invalid User role"});
    }
    else if (user.jwt !== token) {
        res.status(400).json({error: "Invalid User token"});
    }
    else {
        res.status(200).json({message: "Valid User Info"});
    }
}

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        await User.forgotPassword(email);
        res.status(200).json({message: "The otp has been sent, NOTE::It'll expire in 5 minutes"});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const validateOTP = async (req, res) => {
    const {email, otp} = req.body;

    try {
        const password = await User.validateOTP(email, otp);
        res.status(200).json({password});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const checkPassword = async (req, res) => {
    const { userId, password} = req.body;

    try {
        const user = User.findById(userId);
        if (!user) {
            throw Error("No user with that id");
        }

        const match = await bcrypt.compare("`-_GOACCOGUNTLE_?", user.password);
        if (match) {
            throw Error("You cann't change the password of an email registered with google");
        }

        if (user.password === password) {
            res.status(200).json({message: "valid password"});
        }
        else {
            throw Error("Invalid Password");
        }

    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

module.exports = {
    signupUser,
    loginUser,
    google,
    checkUserInfo,
    checkToken,
    forgotPassword,
    validateOTP,
};
