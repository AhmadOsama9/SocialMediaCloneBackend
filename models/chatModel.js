const express = require("express");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messageSchema = new Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    timestamp:{
        type: Date,
        default: Date.now,
    },
});

const chatSchema = new Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    }],
    messages: [messageSchema],
});

chatSchema.statics.sendMessage = async function (senderId, receiverId, content) {
    const chat = await this.findOne({
        participants: {
            $all: [senderId, receiverId],
    },
    });
    if (!chat) {
        const newChat = await this.create({
            participants: [senderId, receiverId],
        });
        
        if (!newChat) {
            throw Error("Failed to create a chat");
        }

        newChat.messages.push({
            sender: senderId,
            content: content,
        });

        const updatedChat = newChat.save();
        if (!updatedChat) {
            throw Error("Failed to save the updated Chat");
        }
        return chat;
    } else {
        chat.messages.push({
            sender: senderId,
            content: content,
        });

        const updatedChat = chat.save();
        if (!updatedChat) {
            throw Error("Failed to save the udpated Chat");
        }
        return chat;
    }
    
}

chatSchema.statics.getChatMessages = async function (userId, otherUserId) {
    const chat = await this.findOne({
        participants: {$all: [userId, otherUserId] },
    });
    
    if (!chat) {
        throw Error("Chat not found");
    }

    chat.messages.sort((a, b) => a.timestamp - b.timestamp);

    return chat.messages;
}

chatSchema.statics.getChatMessagesByChatId = async function (chatId) {
    const chat = await this.findById(chatId);
    if (!chat) {
        throw Error("Chat not found");
    }
    
    chat.messages.sort((a, b) => a.timestamp - b.timestamp);

    return chat.messages;
}

chatSchema.statics.getChats = async function (userId) {
    const chats = await this.findOne({ participants: userId});
    if (!chats) {
        throw Error("User not found");
    }

    const chatIds = chats.map((chat) => chat._id);

    return chatIds;
}

module.exports = mongoose.model("Chats", chatSchema);