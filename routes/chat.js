const express = require("express");

const {
    sendMessage,
    sendMessageByChatId,
    getChatMessages,
    getChatMessagesByChatId,
    getChats,
} = require("../controllers/chatController");

const router = express.Router();

router.post("/send", sendMessage);

router.post("/sendbychatid", sendMessageByChatId);

router.post("/getmessages", getChatMessages);

router.get("/getchats", getChats);

router.get("/getchatmessagesbychatid", getChatMessagesByChatId);

module.exports = router;