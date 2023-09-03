const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userActivitySchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    userPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Posts",
    }],
    communitiesPosts: [{
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
    createdPages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pages"
    }],
    likedPages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pages"
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
    const Profile = require("./profileModel");

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
    const Profile = require("./profileModel");

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
    const Community = require("./communitiesModel");

    const userActivity = await this.findOne({ user: userId});
    if (!userActivity) {
        throw Error("user activity not found");
    }

    console.log("Joined Communities Array:", userActivity.joinedCommunities);

    const results = [];

    const joinedCommunities = userActivity.joinedCommunities;
    for (const communityId of joinedCommunities) {
        const community = await Community.findById(communityId);
        if (!community) {
            throw Error("Cannot find a community with that Id");
        }

        results.push({ id: community._id, name: community.name, description: community.description });
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

userActivitySchema.statics.getCreatedPosts = async function (userId) {
    const Post = require("./postModel");

    const userActivity = await this.findOne({ user: userId });
    if (!userActivity) {
        throw Error("User activity not found");
    }

    const userPosts = userActivity.userPosts;
    const results = [];

    for (const userPost of userPosts) {
        const post = await Post.findById(userPost);
        if (!post) {
            throw Error("Can not find the post");
        }

        const nickname = post.nickname;
        const header = post.header;
        const content = post.content;

        results.push({
            nickname: nickname,
            header: header,
            content: content,
            postId: post._id,
        });
    }

    return results;
};


userActivitySchema.statics.getSharedPosts = async function(userId) {
    const Post = require("./postModel");

    const userActivity = await this.findOne({ user: userId});
    if (!userActivity) {
        throw Error("User activity not found");
    }

    const userPosts = userActivity.sharedPosts;
    const results = [];

    for (const sharedPost of userPosts) {
        const post = await Post.findById(sharedPost);
        if (!post) {
            throw Error("Shared post not found");
        }

        const nickname = post.nickname;
        const header = post.header;
        const content = post.content;

        results.push({
            nickname: nickname, 
            header: header,
            content: content,
            postId: post._id,
        });
    }
    return results;
}

userActivitySchema.statics.getFeedPosts = async function (userId, page) {
    const Post = require("./postModel");
  
    if (!userId || page < 0) {
      throw Error("Invalid info");
    }
  
    const userActivity = await this.findOne({ user: userId });
    if (!userActivity) {
      throw Error("User activity not found");
    }

    const pageSize = 5;
    const skip = page * pageSize;
  
    // 1. Get User's Newest Posts
    const userPosts = await Post.find({ owner: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .select('nickname header content postId');

    const userPosts2 = await Post.find({ owner: userId});  
    console.log("the user posts is: ", userPosts);
    console.log("The userPosts2 is: ", userPosts2);
  
    // 2. Get User's Friends' Posts
    const friendIds = userActivity.friends.map((friend) => friend.userId);
    const friendPosts = await Post.find({ owner: { $in: friendIds } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .select('nickname header content postId');
  
    // 3. Get User's Joined Communities' Posts
    const joinedCommunityIds = userActivity.joinedCommunities;
    const communityPosts = await Post.find({ community: { $in: joinedCommunityIds } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .select('nickname header content postId');

    // Combine all posts without excluding the user's own posts
    let feedPosts = [...userPosts, ...friendPosts, ...communityPosts];
  
    // 4. Sort all posts by createdAt
    feedPosts.sort((a, b) => b.createdAt - a.createdAt);
  
    // 5. Check if feedPosts array has fewer than pageSize items
    const remainingPosts = pageSize - feedPosts.length;
  
    if (remainingPosts > 0) {
      // 6. Fetch additional posts from other users to fill remaining slots
      const additionalPosts = await Post.find({
        owner: { $ne: userId }, // Exclude the user's own posts
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(remainingPosts)
        .select('nickname header content postId');
  
      feedPosts = [...feedPosts, ...additionalPosts];
    }
  
    // 7. Sort all posts again in case additional posts were added
    feedPosts.sort((a, b) => b.createdAt - a.createdAt);
  
    return feedPosts;
  };
  
  
  

module.exports = mongoose.model("usersactivities", userActivitySchema);