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
    enum: ["like", "love", "care", "sad", "angry"],
    required: true,
  },
  userNickname: {
    type: String,
    required: true,    
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


module.exports = mongoose.model("Reactions", reactionSchema);
