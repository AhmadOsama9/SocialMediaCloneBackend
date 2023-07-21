const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reactionSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  reaction: {
    type: String,
    enum: ["like", "love", "care", "sad", "Angry"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

reactionSchema.statics.createReaction = async function (userId, reactionType) {
  try {
    const newReaction = await this.create({
      user: userId,
      reaction: reactionType,
    });
    return newReaction;
  } catch (error) {
    throw new Error("Failed to create reaction: " + error.message);
  }
};

reactionSchema.statics.updateReaction = async function (reactionId, userId, newReactionType) {
  try {
    const reaction = await this.findById(reactionId);
    if (!reaction) {
      throw new Error("Reaction not found");
    }

    reaction.reaction = newReactionType;
    await reaction.save();
    return reaction;
  } catch (error) {
    throw new Error("Failed to update reaction: " + error.message);
  }
};

reactionSchema.statics.deleteReaction = async function (reactionId) {
  try {
    const reaction = await this.findById(reactionId);
    if (!reaction) {
      throw new Error("Reaction not found");
    }
    await reaction.remove();
    return reaction;
  } catch (error) {
    throw new Error("Failed to delete reaction: " + error.message);
  }
};

module.exports = mongoose.model("Reactions", reactionSchema);
