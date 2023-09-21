const Chat = require("../models/chatModel");
const io = require("../server");

// Replace the RESTful controllers with WebSocket event handlers
const CHAT_MESSAGE_EVENT = "chat-message";

io.on("connection", (socket) => {
  // Event listener for chat messages
  socket.on(CHAT_MESSAGE_EVENT, async (data) => {
    const { userId, otherUserId, content } = data;

    try {
      // Implement your logic for sending chat messages here
      // You can use your existing Chat model methods
      await Chat.sendMessage(userId, otherUserId, content);

      // Optionally, send an acknowledgment or confirmation to the sender
      socket.emit("message-sent-acknowledgment", { message: "Message sent successfully" });

      // Broadcast the message to other connected clients
      socket.broadcast.emit(CHAT_MESSAGE_EVENT, data);
    } catch (error) {
      console.error("Failed to send message:", error);
      // Handle errors and potentially send an error response to the sender
      socket.emit("message-send-failure", { error: error.message });
    }
  });
});


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
        const messages = await Chat.getChatMessages(userId, otherUserId);
        res.status(200).json(messages);
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