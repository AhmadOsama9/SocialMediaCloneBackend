const mongoose = require("mongoose");
const UsersActivity = require("./usersActivityModel");
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
    reaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reactions",
    },
  }],
  comments: [{
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comments",
    },
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
    if(!createdPost) {
        throw Error("Cannot create the post");
    }
    // Add the post to the user's posts array in UsersActivity
    const userActivity = await UsersActivity.findByIdAndUpdate(owner, { $push: { posts: createdPost._id } });
    if(!userActivity) {
        throw Error("Cannot find a UserActivity with that Id");
    }
    // Add the post to the community's posts array
    community = await Communities.findByIdAndUpdate(community, { $push: { posts: createdPost._id } });
    if(!community) {
        throw Error("Cannot find a community with that Id")
    }

    return createdPost;
};

postSchema.statics.updatePost = async function (postId, content, community, imageData, contentType) {
  try {
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

    return this.findByIdAndUpdate(postId, updatedPost, { new: true });
  } catch (error) {
    throw new Error("Failed to update the post");
  }
};

postSchema.statics.deletePost = async function (postId) {
  try {
    const postToDelete = await this.findById(postId);

    if (!postToDelete) {
      throw new Error("Post not found");
    }

    // Remove the post from the user's posts array in UsersActivity
    await UsersActivity.findByIdAndUpdate(postToDelete.owner, { $pull: { posts: postId } });

    // Remove the post from the community's posts array
    await Communities.findByIdAndUpdate(postToDelete.community, { $pull: { posts: postId } });

    return this.findByIdAndDelete(postId);
  } catch (error) {
    throw new Error("Failed to delete the post");
  }
};

postSchema.methods.addReaction = async function (userId, reactionType) {
  try {
    const reaction = await Reactions.create({ user: userId, reaction: reactionType });
    this.reactions.push({ reaction });
    await this.save();

    // Add the reaction to the user's reactions array in UsersActivity
    await UsersActivity.findByIdAndUpdate(this.owner, { $push: { reactions: reaction._id } });

    return this;
  } catch (error) {
    throw new Error("Failed to add reaction: " + error.message);
  }
};

postSchema.methods.removeReaction = async function (userId) {
  try {
    const reactionIndex = this.reactions.findIndex(r => r.reaction.user.equals(userId));
    if (reactionIndex === -1) {
      throw new Error("Reaction not found");
    }

    // Remove the reaction from the post's reactions array
    const removedReaction = this.reactions.splice(reactionIndex, 1)[0];
    await this.save();

    // Remove the reaction from the user's reactions array in UsersActivity
    await UsersActivity.findByIdAndUpdate(this.owner, { $pull: { reactions: removedReaction.reaction._id } });

    // Delete the reaction document
    await Reactions.findByIdAndDelete(removedReaction.reaction._id);

    return this;
  } catch (error) {
    throw new Error("Failed to remove reaction: " + error.message);
  }
};

postSchema.methods.addComment = async function (userId, commentContent) {
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

postSchema.methods.removeComment = async function (userId, commentId) {
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

postSchema.methods.addShare = async function (userId) {
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
