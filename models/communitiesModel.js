const mongoose = require("mongoose");
const UsersActivity = require("./userActivityModel");
const Users = require("./userModel");
const Profile = require("./profileModel");

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

communitySchema.statics.createCommunity = async function (name, description, userId) {
    const newCommunity = await this.create({
        name,
        description,
        admins: [userId],
        members: [userId],
    });
    if (!newCommunity) {
        throw Error("Failed to create the community");
    }

    const userActivity = await UsersActivity.findOne({ user: userId });
    userActivity.createdCommunities.push(newCommunity._id);
    userActivity.joinedCommunities.push(newCommunity._id);

    const updatedUserActivity = await userActivity.save();
    if (!updatedUserActivity) {
        throw Error("Failed to save the updated user activity");
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

    const activity = await UsersActivity.findOne({ user: userId });
    if (!activity) {
        throw Error("Failed to find the user activity");
    }

    if (!community.members.includes(userId)) {
        throw Error("This user is not even a member");
    }

    community.members.pull(userId);
    if (community.admins.includes(userId)) {
        community.admins.pull(userId);
    }
    const updatedCommunity = await community.save();
    if (!updatedCommunity) {
        throw Error("Failed to save the updated community");
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
    const updatedCommunity = await this.addMember(userId, communityId);
    if (!updatedCommunity) {
        throw Error("Failed to save the updated community");
    }
    
}

communitySchema.statics.declineMemberRequest = async function (userId, communityId) {
    const community = await this.findById(communityId);
    if (!community) {
        throw Error("Community not found");
    }
    if (!community.membershipRequests.includes(userId)) {
        throw Error("that user didn't make a membership request");
    }
    community.membershipRequests.pull(userId);
    const updatedCommunity = await community.save();
    if (!updatedCommunity) {
        throw Error("Failed to save the updated community");
    }
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

communitySchema.statics.getRelation = async function(userId, communityId) {
    const community = await this.findById(communityId);
    if (!community) {
        throw Error("Community not found");
    }
    if (community.admins.includes(userId)) {
        return "admin";
    }
    if (community.members.includes(userId)) {
        return "member";
    }
    if (community.membershipRequests.includes(userId)) {
        return "pending";
    }
    return "None"  
}

communitySchema.statics.cancelRequest = async function (userId, communityId) {
    const community = await this.findById(communityId);
    if (!community) {
        throw Error("Community not found");
    }
    if (!community.membershipRequests.includes(userId)) {
        throw Error("That user didn't make a membership request");
    }
    community.membershipRequests.pull(userId);
    const updatedCommunity = await community.save();
    if (!updatedCommunity) {
        throw Error("Failed to save the updated community");
    }
}

communitySchema.statics.getMembers = async function (communityId) {
    const community = await this.findById(communityId);
    if (!community) {
        throw Error("Community not found");
    }

    const members = community.members;
    const results = [];
    for (const member of members) {
        const memberProfile = await Profile.findOne({user: member});
        if (!memberProfile) {
            throw Error("Cannot find member profile");
        }
        let relation = "member";
        if (community.admins.includes(member)) {
            relation = "admin"
        }
        results.push({ nickname: memberProfile.nickname, relation: relation, userId: member});
    }
    return results;
}

communitySchema.statics.getMembershipRequests = async function (communityId) {
    const community = await this.findById(communityId);
    if (!community) {
        throw Error("Community not found");
    }

    const members = community.membershipRequests;
    const results = [];
    for (const member of members) {
        const memberProfile = await Profile.findOne({user: member});
        if (!memberProfile) {
            throw Error("Cannot find member profile");
        }
        results.push({ nickname: memberProfile.nickname, userId: member});
    }
    return results;
}

communitySchema.statics.leaveCommunity = async function (userId, communityId) {
    const community = await this.findById(communityId);
    if (!community) {
        throw Error("Community not found");
    }

    if (!community.members.includes(userId)) {
        throw Error("This user is not even a member");
    }

    const activity = await UsersActivity.findOne({ user: userId });
    if (!activity) {
        throw Error("Failed to find the user Activity");
    }

    community.members.pull(userId);
    if (community.admins.includes(userId)) {
        community.admins.pull(userId);
    }
    const updatedCommunity = await community.save();
    if (!updatedCommunity) {
        throw Error("Failed to save the updated community");
    }

    activity.joinedCommunities.pull(community);
    const updatedActivity = await activity.save();

    if (!updatedActivity) {
        throw Error("Failed to save the updated activity");
    }

}


module.exports = mongoose.model("Communities", communitySchema);
