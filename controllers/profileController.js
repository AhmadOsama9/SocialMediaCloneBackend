const Profile = require("../models/profileModel");

const updateNickname = async (req, res) => {
    const {userId, nickname} = req.body;

    try {
        const profile = await Profile.updateNickname(userId, nickname);
        res.status(200).json({ nickname });
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const updateAge = async (req, res) => {
    const {userId, age} = req.body;

    try {
        const profile = await Profile.updateAge(userId, age);
        res.status(200).json({ age });
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const updateGender = async (req, res) => {
    const {userId, gender} = req.body;

    try {
        const profile = await Profile.updateGender(userId, gender);
        res.status(200).json({ gender });
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const updateBio = async (req, res) => {
    const {userId, bio} = req.body;

    try {
        const profile = await Profile.updateBio(userId, bio);
        res.status(200).json({ bio });
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const updateImage = async (req, res) => {
    const { userId } = req.body;
    const file = req.file;
  
    try {
      const profile = await Profile.findOne({ user: userId });
  
      if (!profile) {
        throw Error("Profile not found");
      }
  
      await Profile.updateImage(userId, file);
  
      res.status(200).json({ message: "Image updated successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

const getProfileInfo = async (req, res) => {
    const { userId } = req.query;

    try {
        const profile = await Profile.findOne({ user: userId });

        if(!profile) {
            throw Error("Profile not found");
        }

        res.status(200).json(profile);
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
}