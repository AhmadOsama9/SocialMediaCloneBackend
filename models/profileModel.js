const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const profileSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  nickname: {
    type: String,
    unique: true,
  },
  age: Number,
  gender: {
    type: String,
    enum: ["male", "female"],
  },
  bio: String,
});

profileSchema.statics.updateNickname = async function (userId, nickname) {
  
    const profile = await this.findOne({ user: new mongoose.Types.ObjectId(userId)  });

    if (!profile) {
      throw Error("Profile not found");
    }

    profile.nickname = nickname;
    await profile.save();

    return profile;
  
};

profileSchema.statics.updateAge = async function (userId, age) {
  
    const profile = await this.findOne({ user: new mongoose.Types.ObjectId(userId)  });

    if (!profile) {
      throw Error("Profile not found");
    }

    if (age < 12 || age > 90) {
        throw Error("Invalid age");
      }

    profile.age = age;
    await profile.save();

    return profile;
  
};

profileSchema.statics.updateGender = async function (userId, gender) {
  
    const profile = await this.findOne({ user: new mongoose.Types.ObjectId(userId)  });

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
  
    const profile = await this.findOne({ user: new mongoose.Types.ObjectId(userId)  });

    if (!profile) {
      throw Error("Profile not found");
    }

    profile.bio = bio;
    await profile.save();

    return profile;
  
};

profileSchema.statics.updateImage = async function (userId, icon) {
  
    const profile = await this.findOne({ user: new mongoose.Types.ObjectId(userId)  });

    if (!profile) {
      throw Error("Profile not found");
    }

    profile.image = {
        data: Buffer.from(icon, "utf-8"),
        contentType: "image/svg+xml"
      };

    await profile.save();

    return profile;
  
};


profileSchema.statics.searchByNickname = async function (nickname) {
  const userProfile = await this.findOne({ nickname: nickname });
  if (!userProfile) {
      throw Error("No user with that nickname");
  }
  return userProfile;
}

profileSchema.statics.getNickname = async function (userId) {
  const userProfile = await this.findOne({ user: userId });
  if (!userProfile) {
    throw Error("No user with that userId");
  }
  return userProfile.nickname;
}

module.exports = mongoose.model("Profiles", profileSchema);
