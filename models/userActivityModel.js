const mongoose = require("mongoose");
const Profile = require("./profileModel");
const Community = require("./communitiesModel");

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
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
        },
        nickname: {
            type: String,
        },
    }],
    friendRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    }],
    pendingRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    }],
});

userActivitySchema.statics.sendFriendRequest = async function (senderId, receiverId) {
    const senderActivity = await this.findOne({ user: senderId });
    const receiverActivity = await this.findOne({ user: receiverId});

    if (!senderActivity) {
        throw Error("Sender Activity not found");
    }

    if (!receiverActivity) {
        throw Error("Receiver Activity not found");
    }

    if (senderActivity.friends.includes(receiverId)) {
        throw Error("You are alraedy friend");
    }

    if (senderActivity.pendingRequests.includes(receiverId)) {
        throw Error("Waiting for the receiver to accept")
    }

    if (receiverActivity.pendingRequests.includes(senderId)) {
        throw Error("Accept or Decline the request that that user sent you");
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
    
    if(userActivity.friends.includes(friendId)) {
        throw Error("You are already friends");
    }
    const userProfile = await Profile.findOne({ user: userId });
    const friendProfile = await Profile.findOne({ user: friendId });

    if (!userProfile || !friendProfile) {
        throw Error("user profile or friend profile not found");
    }

    userActivity.friendRequests.pull(friendId);
    userActivity.friends.push({ userId: friendId, nickname: friendProfile.nickname});
    const updatedUserActivity = await userActivity.save();
    if (!updatedUserActivity) {
        throw Error("Failed to save the updated user activity");
    }

    friendActivity.pendingRequests.pull(userId);
    friendActivity.friends.push({ userId: userId, nickname: userProfile.nickname });
    const updatedFriendActivity = await friendActivity.save();
    if (!updatedFriendActivity) {
        throw Error("Failed to save the updated friend activity");
    }
}

userActivitySchema.statics.declineFriendRequest = async function (userId, otherUserId) {
    const userActivity = await this.findOne({ user: userId});
    if (!userActivity) {
        throw Error("User is not found");
    }

    const otherUserActivity = await this.findOne({user: otherUserId});
    if (!otherUserActivity) {
        throw Error("OtherUser is not found");
    }

    if (userActivity.friendRequests.includes(otherUserId)) {
        userActivity.friendRequests.pull(otherUserId);
        const updatedUserActivity = await userActivity.save();

        if (!updatedUserActivity) {
            throw Error("Failed to save the updated user Activity");
        }

        otherUserActivity.pendingRequests.pull(userId);
        const updatedOtherUserActivity = await otherUserActivity.save();

        if (!updatedOtherUserActivity) {
            throw Error("Failed to save the updated other user Activity");
        }
    }
    else {
        throw Error("The other user is not in your friend requests");
    }
}

userActivitySchema.statics.removeFriend = async function (userId, friendId) {
    const userActivity = await this.findOne({ user: userId});
    const friendActivity = await this.findOne({ user: friendId});

    if (!userActivity) {
        throw Error("User actvity not found");
    }

    if (!friendActivity) {
        throw Error("Friend activity not found");
    }
    
    const friendIndex = userActivity.friends.findIndex((friend) => friend.userId.equals(friendId));
    if (friendIndex) {
        throw Error("That user is not in your friend list");
    }

    userActivity.friends.pull({ userId: friendId });
    const updatedUserActivity = await userActivity.save();
    if (!updatedUserActivity) {
        throw Error("Failed to save the updated user activity");
    }

    friendActivity.friends.pull({ userId });
    const updatedFriendActivity = await friendActivity.save();
    if (!updatedFriendActivity) {
        throw Error("Failed to save the updated friend activity");
    }

}

userActivitySchema.statics.getReceivedRequests = async function (userId) {
    const userActivity = await this.findOne({ user: userId });
  
    if (!userActivity) {
      throw Error("User activity not found");
    }
  
    const frinedRequestsIds = userActivity.friendRequests;
  
    const frinedProfiles = await Promise.all(
      frinedRequestsIds.map(async (profileId) => {
        const profile = await Profile.findOne({ user: profileId });
        return profile;
      })
    );
  
    return frinedProfiles;
};

userActivitySchema.statics.cancelRequest = async function (userId, otherUserId) {
    const userActivity = await this.findOne({ user: userId });
    if (!userActivity) {
        throw Error("User activity not found");
    }

    const otherUserActivity = await this.findOne({ user: otherUserId });
    if (!otherUserActivity) {
        throw Error("OtherUser activity not found");
    }

    if (!userActivity.pendingRequests.includes(otherUserId)) {
        throw Error("That user is not in your pending requests");
    }

    userActivity.pendingRequests.pull(otherUserId);
    otherUserActivity.friendRequests.pull(userId);

    const updatedUserActivity = await userActivity.save();
    if (!updatedUserActivity) {
        throw Error("Failed to update the userActivity");
    }

    const updatedOtherUserActivity = await otherUserActivity.save();
    if (!updatedOtherUserActivity) {
        throw Error("Failed to update the otheruseractivity");
    }
}

userActivitySchema.statics.getAllFriends = async function (userId) {
    const userActivity = await this.findOne({ user: userId });
    if (!userActivity) {
        throw Error("user activity not found");
    }

    return userActivity.friends;
}

userActivitySchema.statics.getJoinedCommunities = async function (userId) {
    const userActivity = await this.findOne({ user: userId});
    if (!userActivity) {
        throw Error("user activity not found");
    }

    const results = [];

    const joinedCommunities = userActivity.joinedCommunities;
    for (const communityId of joinedCommunities) {
        const community = await Community.findById(communityId);
        if (!community) {
            throw Error("Cannot find a community with that Id");
        }

        results.push({ name: community.name, description: community.description });
    }

    return results;
}


userActivitySchema.statics.getFriendRelationshipStatus = async function (userId, otherUserId) {
    const userActivity = await this.findOne({ user: userId });
    if (!userActivity) {
      throw Error("User activity not found");
    }
  
    const friendActivity = await this.findOne({ user: otherUserId });
    if (!friendActivity) {
      throw Error("Friend activity not found");
    }

    if (userActivity.friends.some((friend) => friend.userId.equals(otherUserId))) {
      return "Friends";
    }
  
    if (userActivity.pendingRequests.includes(otherUserId)) {
      return "Pending";
    }
  
    if (userActivity.friendRequests.includes(otherUserId)) {
      return "Received";
    }
  
    return "None";
  };
  
  module.exports = mongoose.model("UsersActivity", userActivitySchema);
  

module.exports = mongoose.model("UsersActivity", userActivitySchema);
