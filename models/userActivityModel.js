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
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    }],
    friendRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    }],
    pendingRequests: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Users",
    }],
});

userActivitySchema.statics.sendFriendRequest = async function (senderId, receiverId) {
    const senderActivity = await this.findOne({ user: senderId });
    const receiverActivity = await this.findOne({ user: receiverId});

    if (!senderActivity || !receiverActivity) {
        throw Error("Sender or Receiver activity is not found");
    }

    if (senderActivity.friends.includes(receiverId)) {
        throw Error("You are alraedy friend");
    }

    if (senderActivity.pendingRequests.includes(receiverId)) {
        throw Error("Waiting for the receiver to accept")
    }

    senderActivity.pendingRequests.push(receiverId);
    const updatedSenderActivity = senderActivity.save();
    if (!updatedSenderActivity) {
        throw Error("Failed to save the updated Sender activity");
    }

    receiverActivity.friendRequests.push(senderId);
    const updatedReceiverActivity = await receiverActivity.save();
    if (!updatedReceiverActivity) {
        throw Error("Failed to save the updated Receiver activity");
    }
}

userActivitySchema.statics.acceptFriendRequest = async function (userId, friendId) {
    const userActivity = await this.findOne({ user: userId });
    const friendActivity = await this.findOne({ user: friendId });

    if (!userActivity || !friendActivity) {
        throw Error("User or friend activity not found");
    }
    
    if(!userActivity.friendRequests.includes(friendId)) {
        throw Error("No friend request from this user");
    }
    
    userActivity.friendRequests.pull(friendId);
    userActivity.friends.push(friendId);
    const updatedUserActivity = await userActivity.save();
    if (!updatedUserActivity) {
        throw Error("Failed to save the updated user activity");
    }

    friendActivity.pendingRequests.pull(userId);
    friendActivity.friends.push(userId);
    const updatedFriendActivity = await friendActivity.save();
    if (!updatedFriendActivity) {
        throw Error("Failed to save the updated friend activity");
    }
}

userActivitySchema.statics.removeFriend = async function (userId, friendId) {
    const userActivity = await this.findOne({ user: userId});
    const friendActivity = await this.findOne({ user: friendId});

    if (!userActivity || !friendActivity) {
        throw Error("User or Friend actvity not found");
    }
    
    if (!userActivity.friends.includes(friendId)) {
        throw Error("No friend request from this user");
    }

    userActivity.friends.pull(friendId);
    const updatedUserActivity = await userActivity.save();
    if (!updatedUserActivity) {
        throw Error("Failed to save the updated user activity");
    }

    friendActivity.friends.pull(userId);
    const updatedFriendActivity = await friendActivity.save();
    if (!updatedFriendActivity) {
        throw Error("Failed to save the updated friend activity");
    }

}

module.exports = mongoose.model("UsersActivity", userActivitySchema);
