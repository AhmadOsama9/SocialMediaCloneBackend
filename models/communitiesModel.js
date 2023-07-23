const mongoose = require("mongoose");
const UsersActivity = require("./userActivityModel");
const Users = require("./userModel");

const Schema = mongoose.Schema;

const communitySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    admins: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    }],
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    }],
    membershipRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    }],
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Posts",
    }],
});

communitySchema.statics.createCommunity = async function (name, description, admins) {
    const newCommunity = await this.create({
        name,
        description,
        admins,
        members: admins, // Initially, the admins are also members of the community
    });
    if(!newCommunity) {
        throw Error("Failed to create the community");
    }
    // Add the community to each admin's createdCommunities
    const usersActivityUpdate = await UsersActivity.updateMany(
        { user: { $in: admins } },
        { $addToSet: { createdCommunities: newCommunity._id } }
    );
    if(!usersActivityUpdate) {
        throw Error("Failed to make the creators admins");
    }

    return newCommunity;
};


communitySchema.statics.removeCommunity = async function (userId, communityId) {
    const community = await this.findById(communityId);
    if (!community) {
        throw Error("Community not found");
    }

    const user = Users.findById(userId);
    if (!user) {
        throw Error("User not found");
    }

    if (!community.admins.includes(userId) && user.role !== "admin") {
        throw Error("You are not authorized to delete this community");
    }

    const userActivityUpdate = await UsersActivity.updateMany(
        {user: { $in: [...community.admins, ...community.members]}
    },
    {
        $pull: {
            createdCommunities: communityId,
            joinedCommunities: communityId,
        },
    }
    );

    if (!userActivityUpdate) {
        throw Error("Failed to update users activity");
    }

    const deletedCommunity = await this.findByIdAndDelete(communityId);
    if (!deletedCommunity) {
        throw Error("Failed to delete the community");
    }
 
}

communitySchema.statics.addMember = async function (userId, communityId) {

        // Add the member to the community's members
        const community = await this.findById(communityId);
        if (!community) {
            throw Error("Community not found");
        }
        community.members.push(userId);
        const updatedCommunity = await community.save();
        if (!updatedCommunity) {
            throw Error("Failed to save the updated coummunity");
        }

        const activity = await UsersActivity.findOne({ user: userId});
        if (!activity) {
            throw Error("Failed to find the user activity");
        }
        activity.joinedCommunities.push(community);
        const updatedActivity = await activity.save();
        if (!updatedActivity) {
            throw Error("Failed to save the updated activity");
        }
};

communitySchema.statics.removeMember = async function (userId, communityId) {
    const community = await this.findById(communityId);
    if (!community) {
        throw Error("Community not found");
    }
    community.members.pull(userId);
    const updatedCommunity = await community.save();
    if (!updatedCommunity) {
        throw Error("Failed to save the updated community");
    }
    
    const activity = await UsersActivity.findOne({ user: userId });
    if (!activity) {
        throw Error("Failed to find the user activity");
    }
    activity.joinedCommunities.pull(community);
    const updatedActivity = await activity.save();
    if (!updatedActivity) {
        throw Error("Failed to save the updated activity");
    }
};

communitySchema.statics.addToRequests = async function(userId, communityId) {
    const community = await this.findById(communityId);
    if (!community) {
        throw Error("Community not found");
    }
    community.membershipRequests.push(userId);
    const updatedCommunity = await community.save();
    if (!updatedCommunity) {
        throw Error("Failed to save the updated community");
    }
}

communitySchema.statics.acceptMemberRequest = async function (userId, communityId) {
    const community = await this.findById(communityId);
    if (!community) {
        throw Error("Community not found");
    }
    const index = community.membershipRequests.indexOf(userId);
    if(index === -1) {
        throw Error("User request not found");
    }

    community.membershipRequests.splice(index, 1);
    await this.addMember(userId, communityId);
    
}

communitySchema.statics.makeMemberAdmin = async function (userId, communityId) {
    const community = await this.findById(communityId);
    if (!community) {
        throw Error("Failed to find the community");
    }
    
    const index = community.members.indexOf(userId);
    if (index === -1) {
        throw Error("User not found in the community members");
    }

    community.members.splice(index, 1);
    community.admins.push(userId);
    const updatedCommunity = await community.save();
    if (!updatedCommunity) {
        throw Error("Failed to save the updated community");
    }
}

communitySchema.statics.searchCommunityByName = async function (communityName) {
    const community = await this.findOne({ name: communityName });
    if (!community) {
        throw Error("No Community with that name");
    }
    return community;
}

communitySchema.statics.getAllCommunities = async function () {
    const communities = await this.find();
    if (!communities) {
        throw Error("Currently No Communities");
    }
    return communities;
}


module.exports = mongoose.model("Communities", communitySchema);
