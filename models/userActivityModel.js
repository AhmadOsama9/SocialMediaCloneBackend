const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userActivitySchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Posts",
    }],
    sharedPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Posts",
    }],
    createdCommunities: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Communities",
    }],
    joinedCommunities: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Communities",
    }],
    savedPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Posts",
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comments",
    }],
    reactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reactions",
    }],
});

userActivitySchema.statics.leaveCommunity = async function (userId, communityId) {
    try {
        // Remove the community from the user's joinedCommunities
        await this.updateOne({ user: userId }, { $pull: { joinedCommunities: communityId } });
        
        // Remove the user from the community's members
        await Communities.findByIdAndUpdate(communityId, { $pull: { members: userId } });
    } catch (error) {
        throw new Error("Failed to leave the community");
    }
};

userActivitySchema.statics.removeFromSharedPosts = async function (userId, postId) {
    try {
        // Remove the post from the user's sharedPosts
        await this.updateOne({ user: userId }, { $pull: { sharedPosts: postId } });
        
        // Decrease the shareCount of the post
        await Posts.findByIdAndUpdate(postId, { $inc: { shareCount: -1 } });
    } catch (error) {
        throw new Error("Failed to remove post from shared posts");
    }
};

userActivitySchema.statics.savePost = async function (userId, postId) {
    try {
        // Add the post to the user's savedPosts
        await this.updateOne({ user: userId }, { $addToSet: { savedPosts: postId } });
    } catch (error) {
        throw new Error("Failed to save the post");
    }
};

module.exports = mongoose.model("UserActivity", userActivitySchema);
