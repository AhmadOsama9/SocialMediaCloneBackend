const mongoose = require("mongoose");
const Reactions = require("./reactionModel");
const Comments = require("./commentModel");

const Schema = mongoose.Schema;

const postSchema = new Schema({
  nickname: {
    type: String, 
    required: true,
  },
  header: {
    type: String, 
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    data: Buffer,
    contentType: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  reactions: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reactions",
  }],
  comments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comments",
  }],
  ShareCount: {
    type: Number,
    default: 0,
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Communities",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

postSchema.statics.createPost = async function (header, content, owner, imageData, contentType) {
  const Profile = require("./profileModel");
  const UsersActivity = require("./userActivityModel");

  const profile = await Profile.findOne({ user: owner });
  if (!profile) {
    throw Error("Profile not found");
  }

  const nickname = profile.nickname;

  const newPost = {
    nickname,
    header,
    content,
    owner,
    createdAt: Date.now(),
  }

  if (imageData && contentType) {
    newPost.image = {
      data: imageData,
      contentType,
    };
  }

  const createdPost = await this.create(newPost);
  if (!createdPost) {
    throw Error("Failed to create the post");
  }

  const userActivity = await UsersActivity.findOne({ "user": owner});
  if (!userActivity) {
    throw Error("Failed to find the user activity");
  }

  userActivity.userPosts.push(createdPost._id);
  const updatedUserActivity = await userActivity.save();
  if (!updatedUserActivity) {
    throw Error("Failed to save the updated user activity");
  }

}

postSchema.statics.addPost = async function (header, content, owner, communityId, imageData, contentType) {
  const Communities = require("./communitiesModel");
  const Profile = require("./profileModel");
  const UsersActivity = require("./userActivityModel");
  
  const profile = await Profile.findOne({ user: owner });
  if (!profile) {
    throw Error("Profile not found");
  }

  const nickname = profile.nickname;

  const newPost = {
    nickname,
    header,
    content,
    owner,
    community,
    createdAt: Date.now(),
  };

  if (imageData && contentType) {
    newPost.image = {
      data: imageData,
      contentType,
    };
  }

  const createdPost = await this.create(newPost);
  if (!createdPost) {
      throw Error("Cannot create the post");
  }

  const userActivity = await UsersActivity.findOne({ user: owner});
  if (!userActivity) {
      throw Error("Cannot find a UserActivity with that Id");
  }

  userActivity.communitiesPosts.push(createdPost._id);
  const updatedUserActivity = await userActivity.save();
  if (!updatedUserActivity) {
    throw Error("Couldn't save the post to the userActivity");
  }
  
  const community = await Communities.findById(communityId);
  if (!community) {
    throw Error("Community not found");
  }

  community.posts.push(createdPost._id);
  const updatedCommunity = community.save();
  if (!updatedCommunity) {
    throw Error("Failed to save the updated community");
  }
    
};

postSchema.statics.updatePost = async function (postId, header, content, community, imageData, contentType) {
  const updatedPost = {};

  if (header) {
    updatedPost.header = header;
  }

  if (content) {
    updatedPost.content = content;
  }

  if (community) {
    updatedPost.community = community;
  }

  if (imageData && contentType) {
    updatedPost.image = {
      data: imageData,
      contentType,
    };
  }

  const finishedupdatedPost = await this.findByIdAndUpdate(postId, updatedPost, { new: true });
  if (!finishedupdatedPost) {
    throw Error("Failed to update the post");
  }

  return finishedupdatedPost;
};


postSchema.statics.deleteCommunityPost = async function (postId) {
  const Communities = require("./communitiesModel");
  const UsersActivity = require("./userActivityModel");
  const postToDelete = await this.findById(postId);

  if (!postToDelete) {
    throw Error("Post not found");
  }

  // Remove the post from the user's posts array in UsersActivity
  const userActivity = await UsersActivity.findOneAndUpdate(
    {user: postToDelete.owner},
    { $pull: { posts: postId } }
  );

  if(!userActivity) {
    throw Error("Failed to find the userActivity");
  }
  // Remove the post from the community's posts array
  const community = await Communities.findByIdAndUpdate(postToDelete.community, { $pull: { posts: postId } });
  if(!community) {
    throw Error("Failed to find the community");
  }

  const deletedPost = await this.findByIdAndDelete(postId);
  if(!deletedPost) {
    throw Error("Failed to delete the post");
  }
};

postSchema.statics.deleteUserPost = async function (postId) {
  const UsersActivity = require("./userActivityModel");
  
  const postToDelete = await this.findById(postId);
  if (!postToDelete) {
    throw Error("Post not found");
  }
  const userActivity = await UsersActivity.findOneAndUpdate(
    {user: postToDelete.owner},
    {$pull: {userPosts: postId}}
  );
  if (!userActivity) {
    throw Error("Failed to find the userActivity");
  }

  const deletedPost = await this.findByIdAndDelete(postId);
  if (!deletedPost) {
    throw Error("FAiled to delete the post");
  }

}

postSchema.statics.addReaction = async function (userId, postId, reactionType) {
  const Profile = require("./profileModel");
  const profile = await Profile.findOne({ user: userId });
  if (!profile) {
    throw Error("Profile not found");
  }

  if (!["like", "love", "care", "Sad", "Angry"].includes(reactionType)) {
    throw Error("Invalid reaction type");
  }
  const newReaction = await Reactions.create({
    user: userId,
    reaction: reactionType,
    userNickname: profile.nickname,
  });
  if (!newReaction) {
    throw Error("Failed to add the reaction");
  }
  const post = await this.findById(postId);
  if(!post) {
    throw Error("Failed to find the post with that postId");
  }
  post.reactions.push(newReaction);
  const savedReaction = await post.save();

  if (!savedReaction) {
    throw Error("Failed to save the reaction in the reactions");
  }
  // Add the reaction to the user's reactions array in UsersActivity
  const activity = await UsersActivity.findOne({user: userId});
  if(!activity) {
    throw Error("Failed to find the user Activity");
  }
  activity.reactions.push(newReaction);
  const addedReaction = await activity.save();
  if (!addedReaction) {
    throw Error("Failed to add the reaction to the user activities");
  }

};

postSchema.statics.updateReaction = async function (userId, postId, reactionType) {
  if (!["like", "love", "care", "Sad", "Angry"].includes(reactionType)) {
    throw Error("Invalid reaction type");
  }

  const post = await this.findById(postId).populate("reactions");
  if (!post) {
    throw Error("Post not found");
  }

  const reaction = post.reactions.find((r) => r.user.equals(userId));
  if (!reaction) {
    throw Error("Cannot find the user reaction on this post");
  }

  reaction.reaction = reactionType;
  const savedReaction = await reaction.save();
  if (!savedReaction) {
    throw Error("Failed to save the updated Reaction");
  }

  return reaction;
};

postSchema.statics.removeReaction = async function (userId, postId) {
  const post = await this.findById(postId).populate("reactions");
  if (!post) {
    throw Error("Post not found");
  }

  const reactionIndex = post.reactions.findIndex((r) =>
    r.user.equals(userId)
  );
  if (reactionIndex === -1) {
    throw Error("Reaction not found");
  }

  // Remove the reaction from the post's reactions array
  const removedReaction = post.reactions.splice(reactionIndex, 1)[0];
  const removedPostReaction = await post.save();
  if (!removedPostReaction) {
    throw Error("Failed to remove the reaction from the post");
  }
  // Remove the reaction from the user's reactions array in UsersActivity
  const activity = await UsersActivity.findOne({ user: userId });
  if (!activity) {
    throw Error("Failed to find the user Activity");
  }
  activity.reactions.pull(removedReaction._id); 
  const updatedActivity = await activity.save();
  if (!updatedActivity) {
    throw Error("Failed to remove the reaction from the user activities");
  }
  // Delete the reaction document
  const react = await Reactions.findByIdAndDelete(removedReaction._id);
  if (!react) {
    throw Error("Couldn't remove the react from the reactions table");
  }
};


postSchema.statics.addComment = async function (userId, postId, commentContent) {
  const Profile = require("./profileModel");
  const profile = await Profile.findOne({ user: userId });
  if (!profile) {
    throw Error("Profile not found");
  }
  
  const comment = await Comments.create({
    user: userId,
    content: commentContent,
    userNickname: profile.nickname,
    createdAt: Date.now(),
  });
  if (!comment) {
    throw Error("Failed to craete the comment");
  }
  
  const post = await this.findById(postId);
  if (!post) {
    throw Error("Failed to find the post with that postId");
  }
  post.comments.push(comment);
  const savedComment = await post.save();
  if (!savedComment) {
    throw Error("Failed to save the comment to the post");
  }
  
  const activity = await UsersActivity.findOne({user: userId});
  if (!activity) {
    throw Error("Failed to find the user activity");
  }
  activity.comments.push(comment);
  const addedComment = await activity.save();
  if (!addedComment) {
    throw Error("Failed to add the comment to the user actvitiy");
  }

};

postSchema.statics.updateComment = async function (userId, postId, newContent) {
  const post = await this.findById(postId).populate("comments");
  if (!post) {
    throw Error("Post not found");
  }

  const comment = post.comments.find((r) => r.user.equals(userId));
  if (!comment) {
    throw Error("Can not find the user comment in that post")
  }

  comment.content = newContent;
  const savedComment = await comment.save();
  if (!savedComment) {
    throw Error("Failed to save the updated comment");
  }
  return comment;
}

postSchema.statics.removeComment = async function (userId, postId) {
  const UsersActivity = require("./userActivityModel");
  const post = await this.findById(postId).populate("comments");
  if (!post) {
    throw Error("Post not found");
  }

  const commentIndex = post.comments.findIndex((r) => r.user.equals(userId));
  if (commentIndex === -1) {
    throw Error("Comment not found");
  }
  
  const removedComment = post.comments.splice(commentIndex, 1)[0];
  const removedPostComment = await post.save();
  if (!removedPostComment) {
    throw Error("Failed to remove the comment from the post");
  }

  const activity = await UsersActivity.findOne({ user: userId });
  if (!activity) {
    throw Error("Failed to find the user activity");
  }
  activity.comments.pull(removedComment);
  const updatedActivity = await activity.save();
  if (!updatedActivity) {
    throw Error("Failed to remove the comment from the user activities");
  }

  const comment2 = await Comments.findByIdAndDelete(removedComment._id);
  if (!comment2) {
    throw Error("Couldn't remove the comment from the comments table");
  }
  
};

postSchema.statics.addShare = async function (userId, postId) {
  const UsersActivity = require("./userActivityModel");
  const post = await this.findById(postId);
  if (!post) {
    throw Error("Post not found");
  }

  post.ShareCount++;
  const updatedPost = await post.save();
  if (!updatedPost) {
    throw Error("Failed to updated the number of shares in the post");
  }

  const activity = await UsersActivity.findOne({user: userId});
  if (!activity) {
    throw Error("Failed to find the user activity");
  }
  activity.sharedPosts.push(post);
  const updatedActivity = await activity.save();
  if (!updatedActivity) {
    throw Error("Failed to add the post to the user sharedPosts");
  }
  

};

postSchema.statics.removeShare = async function(userId, postId) {
  const UsersActivity = require("./userActivityModel");
  const post = await this.findById(postId);
  if (!post) {
    throw Error("Post not found");
  }

  const activity = await UsersActivity.findOne({ user: userId});
  if (!activity) {
    throw Error("Failed to find the user Activity");
  }
  activity.sharedPosts.pull(post);
  const updatedActivity = await activity.save();
  if (!updatedActivity) {
    throw Error("Failed to remove the post from user sharedPosts");
  }

  post.ShareCount--;
  const updatedPost = await post.save();
  if (!updatedPost) {
    throw Error("Failed to update the number of share in the post");
  }
}

module.exports = mongoose.model("Posts", postSchema);
