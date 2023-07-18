const mongoose = require("mongoose");
const fs = require("fs");

const Schema = mongoose.Schema;

const profileSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  nickname: String,
  age: Number,
  gender: {
    type: String,
    enum: ["male", "female"],
  },
  bio: String,
  image: {
    data: Buffer,
    contentType: String,
  },
});

profileSchema.statics.updateNickname = async function (userId, nickname) {
  
    const profile = await this.findOne({ user: userId });

    if (!profile) {
      throw Error("Profile not found");
    }

    profile.nickname = nickname;
    await profile.save();

    return profile;
  
};

profileSchema.statics.updateAge = async function (userId, age) {
  
    const profile = await this.findOne({ user: userId });

    if (!profile) {
      throw Error("Profile not found");
    }

    profile.age = age;
    await profile.save();

    return profile;
  
};

profileSchema.statics.updateGender = async function (userId, gender) {
  
    const profile = await this.findOne({ user: userId });

    if (!profile) {
      throw Error("Profile not found");
    }
    if (gender !== "male" && gender !== "female") {
      throw Error("Invalid gender");
    }

    profile.gender = gender;
    await profile.save();

    return profile;
  
};

profileSchema.statics.updateBio = async function (userId, bio) {
  
    const profile = await this.findOne({ user: userId });

    if (!profile) {
      throw Error("Profile not found");
    }

    profile.bio = bio;
    await profile.save();

    return profile;
  
};

profileSchema.statics.updateImage = async function (userId, image) {
  
    const profile = await this.findOne({ user: userId });

    if (!profile) {
      throw Error("Profile not found");
    }

    profile.image.data = fs.readFileSync(image.path);
    profile.image.contentType = image.mimetype;
    await profile.save();

    return profile;
  
};

module.exports = mongoose.model("Profiles", profileSchema);
