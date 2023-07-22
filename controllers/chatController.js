const Chat = require("../models/chatModel");


const sendMessage = async (req, res) => {
    const { senderId, receiverId, content } = req.body;

    try {
        const chat = await Chat.sendMessage(senderId, receiverId, content);
        res.status(200).json({message: "The message has been sent Successfully"});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const getChatMessages = async (req, res) => {
    const { chatId } = req.body;

    try {
        const messages = await Chat.getChatMessages(chatId);
        res.status(200).json(messages);
    } catch(error) {
        res.status(400).json({error: error.message});
    }
}


module.exports = {
    sendMessage,
    getChatMessages,
}