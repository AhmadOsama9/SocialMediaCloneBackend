const mongoose = require("mongoose");
const UsersActivity = require("./userActivityModel");
const Communities = require("./communitiesModel");
const Reactions = require("./reactionModel");
const Comments = require("./commentModel");

const Schema = mongoose.Schema;

const postSchema = new Schema({
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
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

postSchema.statics.addPost = async function (content, owner, community, imageData, contentType) {
    const newPost = {
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
    // Add the post to the user's posts array in UsersActivity
    const userActivity = await UsersActivity.findOne({ user: owner});
    if (!userActivity) {
        throw Error("Cannot find a UserActivity with that Id");
    }

    userActivity.posts.push(createdPost._id);
    const foundUserActivity = await userActivity.save();
    if (!foundUserActivity) {
      throw Error("Couldn't save the post to the userActivity");
    }
    // Add the post to the community's posts array
    community = await Communities.findByIdAndUpdate(community, { $push: { posts: createdPost._id } });
    if (!community) {
        throw Error("Cannot find a community with that Id")
    }

    return createdPost;
};

postSchema.statics.updatePost = async function (postId, content, community, imageData, contentType) {
  const updatedPost = {};

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
  if(!finishedupdatedPost) {
    throw Error("Failed to update the post");
  }

  return finishedupdatedPost;
};

postSchema.statics.deletePost = async function (postId) {

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

  deletedPost = await this.findByIdAndDelete(postId);
  if(!deletedPost) {
    throw Error("Failed to delete the post");
  }
};

postSchema.statics.addReaction = async function (userId, postId, reactionType) {
  if (!["like", "love", "care", "Sad", "Angry"].includes(reactionType)) {
    throw Error("Invalid reaction type");
  }
  const newReaction = await Reactions.create({
    user: userId,
    reaction: reactionType,
  });
  const reaction = await Reactions.create(newReaction);
  if (!reaction) {
    throw Error("Failed to add the reaction");
  }
  const post = await this.model("Posts").findById(postId);
  if(!post) {
    throw Error("Failed to find the post with that postId");
  }
  post.reactions.push(newReaction);
  const savedReaction = await post.save();

  if (!savedReaction) {
    throw Error("Failed to save the reaction in the reactions");
  }
  // Add the reaction to the user's reactions array in UsersActivity
  const addedReaction = await UsersActivity.findByIdAndUpdate(this.owner, { $push: { reactions: reaction._id } });
  if (!addedReaction) {
    throw Error("Failed to add the reaction to the user activities");
  }

};

postSchema.statics.removeReaction = async function (userId, postId) {
  const post = await this.model("Posts").findById(postId);
  if (!post) {
    throw new Error("Post not found");
  }

  const reactionIndex = post.reactions.findIndex((r) =>
    r.reaction.user.equals(userId)
  );
  if (reactionIndex === -1) {
    throw new Error("Reaction not found");
  }

  // Remove the reaction from the post's reactions array
  const removedReaction = post.reactions.splice(reactionIndex, 1)[0];
  const removedpostReaction = await post.save();
  if (!removedpostReaction) {
    throw Error("Failed to remove the reaction from the post");
  }
  // Remove the reaction from the user's reactions array in UsersActivity
  const userActivity = await UsersActivity.findOneAndUpdate(
    { user: post.owner },
    { $pull: { reactions: removedReaction.reaction._id } }
  );
  if (!userActivity) {
    throw Error("Couldn't remove it from the user activity");
  }
  // Delete the reaction document
  const react = await Reactions.findByIdAndDelete(removedReaction.reaction._id);
  if(!react) {
    throw Error("Couldn't remove the react from the reactions");
  }
};

postSchema.statics.updateReaction = async function (userId, postId, reactionType) {
  if (!["like", "love", "care", "Sad", "Angry"].includes(reactionType)) {
    throw new Error("Invalid reaction type");
  }
  if (!["like", "love", "care", "Sad", "Angry"].includes(reactionType)) {
    throw new Error("Invalid reaction type");
  }
  const post = await this.model("Posts").findById(postId);
  if (!post) {
    throw new Error("Post not found");
  }

  const reaction = await Reaction.findOne({
    "user": userId,
    "reaction._id": { $in: post.reactions.map((r) => r.reaction._id) },
  });

  if (!reaction) {
    throw new Error("Reaction not found");
  }

  reaction.reaction = reactionType;
  await reaction.save();

  return reaction;

}

postSchema.statics.addComment = async function (userId, commentContent) {
  try {
    const comment = await Comments.create({ user: userId, comment: commentContent });
    this.comments.push({ comment });
    await this.save();

    // Add the comment to the user's comments array in UsersActivity
    await UsersActivity.findByIdAndUpdate(this.owner, { $push: { comments: comment._id } });

    return this;
  } catch (error) {
    throw new Error("Failed to add comment: " + error.message);
  }
};

postSchema.statics.removeComment = async function (userId, commentId) {
  try {
    const commentIndex = this.comments.findIndex(c => c.comment._id.equals(commentId));
    if (commentIndex === -1) {
      throw new Error("Comment not found");
    }

    // Remove the comment from the post's comments array
    const removedComment = this.comments.splice(commentIndex, 1)[0];
    await this.save();

    // Remove the comment from the user's comments array in UsersActivity
    await UsersActivity.findByIdAndUpdate(this.owner, { $pull: { comments: removedComment.comment._id } });

    // Delete the comment document
    await Comments.findByIdAndDelete(removedComment.comment._id);

    return this;
  } catch (error) {
    throw new Error("Failed to remove comment: " + error.message);
  }
};

postSchema.statics.addShare = async function (userId) {
  try {
    // Add the post to the user's shared posts array in UsersActivity
    await UsersActivity.findByIdAndUpdate(userId, { $push: { sharePosts: this._id } });

    // Increment the ShareCount in the post
    this.ShareCount++;
    await this.save();

    return this;
  } catch (error) {
    throw new Error("Failed to add share: " + error.message);
  }
};

module.exports = mongoose.model("Posts", postSchema);
