const Chat = require("../models/chatModel");


const sendMessage = async (req, res) => {
    const { userId, otherUserId, message } = req.body;

    try {
        const chat = await Chat.sendMessage(userId, otherUserId, message);
        res.status(200).json({message: "The message has been sent Successfully"});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const getChatMessages = async (req, res) => {
    const { userId, otherUserId } = req.body;

    try {
        const messages = await Chat.getChatMessages(userId, otherUserId);
        res.status(200).json(messages);
    } catch(error) {
        res.status(400).json({error: error.message});
    }
}


module.exports = {
    sendMessage,
    getChatMessages,
}