const Profile = require("../models/profileModel");
const mongoose = require("mongoose");


const toLowerCase = (str) => {
    return str.toLowerCase();
}
  
const updateNickname = async (req, res) => {
    const { userId, nickname } = req.body;
  
    try {
      const lowercaseNickname = toLowerCase(nickname);
      const profile = await Profile.updateNickname(userId, lowercaseNickname);
      res.status(200).json({ nickname: lowercaseNickname });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
}
  
const updateAge = async (req, res) => {
    const { userId, age } = req.body;
  
    try {
      const profile = await Profile.updateAge(userId, age);
      res.status(200).json({ age });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
}
  
const updateGender = async (req, res) => {
    const { userId, gender } = req.body;
  
    try {
      const lowercaseGender = toLowerCase(gender);
      const profile = await Profile.updateGender(userId, lowercaseGender);
      res.status(200).json({ gender: lowercaseGender });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
}
  
const updateBio = async (req, res) => {
    const { userId, bio } = req.body;
  
    try {
      const lowercaseBio = toLowerCase(bio);
      const profile = await Profile.updateBio(userId, lowercaseBio);
      res.status(200).json({ bio: lowercaseBio });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
}
  
const updateImage = async (req, res) => {
    const { userId, image } = req.body;
  
    try {
      await Profile.updateImage(userId, image);
      res.status(200).json({ image });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
}

const getProfileInfo = async (req, res) => {
    const { userId } = req.query;

    if(!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "Invalid userId: ", userId});
    }

    try {
        const profile = await Profile.findOne({ user: new mongoose.Types.ObjectId(userId) });

        if(!profile) {
            throw Error("Profile not found");
        }

        res.status(200).json(profile);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const searchByNickname = async (req, res) => {
    const { nickname } = req.query;
    const lowercaseNickname = nickname.toLowerCase();

    try {
        const userProfile = await Profile.searchByNickname(lowercaseNickname);
        res.status(200).json(userProfile);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const getNickname = async (req, res) => {
    const { userId } = req.query;

    try {
        const nickname = await Profile.getNickname(userId);
        res.status(200).json({ nickname: nickname});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}


module.exports = {
    updateNickname, 
    updateAge,
    updateGender,
    updateBio,
    updateImage,
    getProfileInfo,
    searchByNickname,
    getNickname,
}