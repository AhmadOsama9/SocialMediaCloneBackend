const mongoose = require("mongoose");
const { format } = require("date-fns")

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

chatSchema.statics.sendMessageByChatId = async function (chatId, userId, content) {
    const chat = await this.findById(chatId);
    if (!chat) {
        throw Error("Chat not found");
    }

    const newMessage = {
        sender: userId,
        content: content
    };

    chat.messages.push(newMessage);

    const updatedChat = await chat.save();
    if (!updatedChat) {
        throw Error("Failed to save the updated chat");
    }

    return newMessage;
}

chatSchema.statics.getChatMessages = async function (userId, otherUserId) {
    const chat = await this.findOne({
        participants: { $all: [userId, otherUserId] },
    });

    if (!chat) {
        const newChat = await this.create({
            participants: [userId, otherUserId],
        });

        if (!newChat) {
            throw Error("Failed to create a chat");
        }
        const updatedChat = newChat.save();
        if (!updatedChat) {
            throw Error("Failed to save the updated Chat");
        }
        const chatId = newChat._id;
        return { messages: [], chatId};
    }
    chat.messages.sort((a, b) => a.timestamp - b.timestamp);

    const chatId = chat._id;

    // Format timestamps in messages
    const formattedMessages = chat.messages.map((message) => ({
        ...message.toObject(), // Convert to plain JavaScript object
        createdAt: format(new Date(message.timestamp), "yyyy-MM-dd HH:mm:ss"),
    }));

    return { messages: formattedMessages, chatId };
}


chatSchema.statics.getChatMessagesByChatId = async function (chatId) {
    const chat = await this.findById(chatId);
    if (!chat) {
        throw Error("Chat not found");
    }
    
    chat.messages.sort((a, b) => a.timestamp - b.timestamp);

    const formattedMessages = await Promise.all(
        chat.messages.map(async (message) => ({
            ...message.toObject(), // Convert to plain JavaScript object
            createdAt: format(new Date(message.timestamp), "yyyy-MM-dd HH:mm:ss"),
        }))
    );

    return formattedMessages;
}


chatSchema.statics.getChats = async function (userId) {
    const Profile = require("./profileModel");
    const chats = await this.find({ participants: userId });
    if (!chats) {
        throw new Error("User not found in any chat");
    }

    const results = [];

    for (const chat of chats) {
        const otherParticipantId = chat.participants.find(
            (participant) => participant.toString() !== userId
        );

        const otherUserProfile = await Profile.findOne({ user: otherParticipantId });
        if (!otherUserProfile) {
            throw Error("Can not find other participant profile");
        }
        results.push({ chatId: chat._id, otherUserNickname: otherUserProfile.nickname });
    }

    return results;
}


module.exports = mongoose.model("Chats", chatSchema);