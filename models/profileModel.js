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
    sparse: true,
  },
  age: Number,
  gender: {
    type: String,
    enum: ["male", "female"],
  },
  bio: String,
  image: String,
});

profileSchema.statics.updateNickname = async function (userId, nickname) {
  
    const profile = await this.findOne({ user: new mongoose.Types.ObjectId(userId)  });

    if (!profile) {
      throw Error("Profile not found");
    }

    profile.nickname = nickname;
    
    const updatedProfile = await profile.save();
    if (!updatedProfile) {
      throw Error("Failed to svae the udpated profile")
    }

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
    
    const updatedProfile = await profile.save();
    if (!updatedProfile) {
      throw Error("Failed to svae the udpated profile")
    }

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
    
    const updatedProfile = await profile.save();
    if (!updatedProfile) {
      throw Error("Failed to svae the udpated profile")
    }

    return profile;
  
};

profileSchema.statics.updateBio = async function (userId, bio) {
  
    const profile = await this.findOne({ user: new mongoose.Types.ObjectId(userId)  });

    if (!profile) {
      throw Error("Profile not found");
    }

    profile.bio = bio;
    
    const updatedProfile = await profile.save();
    if (!updatedProfile) {
      throw Error("Failed to svae the udpated profile")
    }

    return profile;
  
};

profileSchema.statics.updateImage = async function (userId, iconNumber) {
  
    const profile = await this.findOne({ user: new mongoose.Types.ObjectId(userId)  });

    if (!profile) {
      throw Error("Profile not found");
    }

    profile.image = iconNumber;

    const updatedProfile = await profile.save();
    if (!updatedProfile) {
      throw Error("Failed to svae the udpated profile")
    }

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

profileSchema.statics.checkAllInfo = async (userId) {
  const userProfile = await this.findONe({ user: userId});
  if (!userPRofile) {
    throw Error("User not found");
  }
  
  
}

module.exports = mongoose.model("Profiles", profileSchema);
