const Chat = require("../models/chatModel");

const sendMessage = async (req, res) => {
    const { userId, otherUserId, content } = req.body;

    try {
        await Chat.sendMessage(userId, otherUserId, content);
        res.status(200).json({message: "The message has been sent Successfully"});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const sendMessageByChatId = async (req, res) => {
    const { chatId, userId, content} = req.body;

    try {
        await Chat.sendMessageByChatId(chatId, userId, content);
        res.status(200).json({message: "The message has been sent Succesfully"});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const getChatMessages = async (req, res) => {
    const { userId, otherUserId } = req.body;

    try {
        const result = await Chat.getChatMessages(userId, otherUserId);
        res.status(200).json({messages: result.messages, chatId: result.chatId});
    } catch(error) {
        res.status(400).json({error: error.message});
    }
}

const getChatMessagesByChatId = async (req, res) => {
    const { chatId } = req.query;

    try {
        const messages = await Chat.getChatMessagesByChatId(chatId);
        res.status(200).json(messages);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const getChats = async (req, res) => {
    const { userId } = req.query;

    try {
        const chats = await Chat.getChats(userId);
        res.status(200).json(chats);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}


module.exports = {
    sendMessage,
    sendMessageByChatId,
    getChatMessages,
    getChatMessagesByChatId,
    getChats,
}