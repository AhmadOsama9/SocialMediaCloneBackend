const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

commentSchema.statics.createComment = async function (userId, commentContent) {
  try {
    const newComment = await this.create({
      user: userId,
      comment: commentContent,
    });
    return newComment;
  } catch (error) {
    throw new Error("Failed to create comment: " + error.message);
  }
};

commentSchema.statics.updateComment = async function (commentId, userId, newCommentContent) {
  try {
    const comment = await this.findById(commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    comment.comment = newCommentContent;
    await comment.save();
    return comment;
  } catch (error) {
    throw new Error("Failed to update comment: " + error.message);
  }
};

commentSchema.statics.deleteComment = async function (commentId) {
  try {
    const comment = await this.findById(commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }
    await comment.remove();
    return comment;
  } catch (error) {
    throw new Error("Failed to delete comment: " + error.message);
  }
};

module.exports = mongoose.model("Comments", commentSchema);
