const mongoose = require("mongoose");
const usersActivity = require("./userActivityModel");

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
    const usersActivityUpdate = await usersActivity.updateMany(
        { user: { $in: admins } },
        { $addToSet: { createdCommunities: newCommunity._id } }
    );
    if(!usersActivityUpdate) {
        throw Error("Failed to make the creators admins");
    }

    return newCommunity;
};

communitySchema.statics.addMemberToCommunity = async function (communityId, memberId) {
    try {
        // Add the member to the community's members
        await this.findByIdAndUpdate(communityId, { $addToSet: { members: memberId } });
        
        // Add the community to the member's joinedCommunities
        await Users.findByIdAndUpdate(memberId, { $addToSet: { joinedCommunities: communityId } });
    } catch (error) {
        throw new Error("Failed to add member to the community");
    }
};

communitySchema.statics.removeMemberFromCommunity = async function (communityId, memberId) {
    try {
        // Remove the member from the community's members
        await this.findByIdAndUpdate(communityId, { $pull: { members: memberId } });
        
        // Remove the community from the member's joinedCommunities
        await Users.findByIdAndUpdate(memberId, { $pull: { joinedCommunities: communityId } });
    } catch (error) {
        throw new Error("Failed to remove member from the community");
    }
};

module.exports = mongoose.model("Communities", communitySchema);
