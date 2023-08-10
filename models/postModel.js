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
  Shares: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users"
  }],
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
    { $pull: { communitiesPosts: postId } }
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
  const Reactions = require("./reactionModel");

  const post = await this.findById(postId);
  if(!post) {
    throw Error("Post not found");
  }

  const profile = await Profile.findOne({ user: userId });
  if (!profile) {
    throw Error("Profile not found");
  }

  if (!["like", "love", "care", "sad", "angry"].includes(reactionType)) {
    throw Error("Invalid reaction type");
  }
  const newReaction = await Reactions.create({
    user: userId,
    reaction: reactionType,
    userNickname: profile.nickname,
  });
  if (!newReaction) {
    throw Error("Failed to create the reaction");
  }
  
  post.reactions.push(newReaction);
  const savedReaction = await post.save();

  if (!savedReaction) {
    await newReaction.remove();
    throw Error("Failed to save the reaction in the reactions");
  }

};

postSchema.statics.updateReaction = async function (userId, postId, reactionType) {
  const Profile = require("./profileModel");
  const Reactions = require("./reactionModel");

  const post = await this.findById(postId);
  if(!post) {
    throw Error("Post not found");
  }

  const profile = await Profile.findOne({ user: userId });
  if (!profile) {
    throw Error("Profile not found");
  }

  if (!["like", "love", "care", "sad", "angry"].includes(reactionType)) {
    throw new Error("Invalid reaction type");
  }

  const reaction = await Reactions.findOne({ nickname: profile.nickname});
  if (!reaction) {
    throw Error("Reaction not found");
  }
  reaction.reaction = reactionType;
  
  const updatedReaction = await reaction.save();
  if (!updatedReaction) {
    throw Error("Failed to save the updated Reaction");
  }
}

postSchema.statics.deleteReaction = async function (userId, postId) {
  const Profile = require("./profileModel");
  const Reactions = require("./reactionModel");

  const post = await this.findById(postId);
  if (!post) {
    throw new Error("Post not found");
  }

  const profile = await Profile.findOne({ user: userId });
  if (!profile) {
    throw new Error("Profile not found");
  }

  const reaction = await Reactions.findOne({ nickname: profile.nickname });
  if (!reaction) {
    throw new Error("Reaction not found");
  }

  post.reactions.pull(reaction._id);
  const updatedPostReactions = await post.save();
  if (!updatedPostReactions) {
    throw new Error("Failed to save the updated post");
  }

  const deletedReaction = await reaction.remove();
  if (!deletedReaction) {
    throw new Error("Failed to delete the reaction from the reactions schema");
  }
  
}



postSchema.statics.addComment = async function (userId, postId, commentContent) {
  const Profile = require("./profileModel");
  const Comments = require("./commentModel");

  const post = await this.findById(postId);
  if (!post) {
    throw Error("Post not found");
  }

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
    throw Error("Failed to create the comment");
  }
    
  post.comments.push(comment);
  const savedComment = await post.save();
  if (!savedComment) {
    throw Error("Failed to save the comment to the post");
  }

  return comment._id;

};

postSchema.statics.updateComment = async function (newContent, commentId) {
  const Comments = require("./commentModel");

  const comment = await Comments.findById(commentId);
  if (!comment) {
    throw Error("Comment not found");
  }

  comment.content = newContent;
  const updatedComment = await comment.save();
  if (!updatedComment) {
    throw Error("Failed to save the updated comment");
  }


}
postSchema.statics.deleteComment = async function (postId, commentId) {
  const Comments = require("./commentModel");

  const post = await this.findById(postId);
  if (!post) {
    throw new Error("Post not found");
  }

  const comment = await Comments.findById(commentId);
  if (!comment) {
    throw new Error("Comment not found");
  }

  post.comments.pull(commentId);
  const updatedPostComments = await post.save();
  if (!updatedPostComments) {
    throw new Error("Failed to save the updated post");
  }

  const deletedComment = await comment.remove();
  if (!deletedComment) {
    throw new Error("Failed to delete the comment from the comments schema");
  }
};

postSchema.statics.addShare = async function (userId, postId) {
  const UsersActivity = require("./userActivityModel");
  console.log("The postId is: ", postId);
  console.log("The userId is: ", userId);
  const post = await this.findById(postId);
  if (!post) {
    throw new Error("Post not found");
  }

  const userActivity = await UsersActivity.findOne({ user: userId });
  if (!userActivity) {
    throw new Error("User activity not found");
  }

  if (userActivity.sharedPosts.includes(postId)) {
    throw new Error("The user has already shared that post");
  }

  userActivity.sharedPosts.push(postId);
  const updatedUserActivity = await userActivity.save();
  if (!updatedUserActivity) {
    throw new Error("Failed to update the user activity");
  }

  post.shares.push(userId);
  const updatedPost = await post.save();
  if (!updatedPost) {
    throw new Error("Failed to update the post");
  }
};

postSchema.statics.removeShare = async function (userId, postId) {
  const UsersActivity = require("./userActivityModel");
  const post = await this.findById(postId);
  if (!post) {
    throw new Error("Post not found");
  }

  const userActivity = await UsersActivity.findOne({ user: userId });
  if (!userActivity) {
    throw new Error("User activity not found");
  }

  if (!userActivity.sharedPosts.includes(postId)) {
    throw new Error("The user hasn't shared that post");
  }

  userActivity.sharedPosts.pull(postId);
  const updatedUserActivity = await userActivity.save();
  if (!updatedUserActivity) {
    throw new Error("Failed to update the user activity");
  }

  post.shares.pull(userId); // Remove the user's ID from the shares array
  const updatedPost = await post.save();
  if (!updatedPost) {
    throw new Error("Failed to update the post");
  }
};




postSchema.statics.getPostReactions = async (postId) => {
  const Reactions = require("./reactionModel");

  const post = await this.findById(postId);
  if (!post) {
    throw Error("Post not found");
  }

  const reactions = post.reactions;
  const results = [];
  for (const reaction of reactions) {
    const postReaction = await Reactions.findById(reaction);
    if (!postReaction) {
      throw Error("post reaction not found");
    }
    results.push({nickname: postReaction.nickname, reaction: postReaction.reaction});
  }
  return results;

}

postSchema.statics.getPostComments = async (postId) => {
  const Comments = require("./commentModel");

  const post = await this.findById(postId);
  if (!post) {
    throw Error("Post not found");
  }

  const comments = post.comments;
  const results = [];
  for (const comment of comments) {
    const postComment = await Comments.findById(comment);
    if (!postComment) {
      throw Error("post comment not found");
    }
    results.push({nickname: postComment.nickname, content: postComment.content, commentId: postComment._id});
  }

  return results;
}

postSchema.statics.getPostShares = async (postId) => {
  const post = await this.findById(postId);
  if (!post) {
    throw Error("Post not found");
  }

  const shares = post.shares;
  const results = [];
  for (const share of shares) {
    results.push({userId: share});
  }

  return results;
}

module.exports = mongoose.model("Posts", postSchema);
