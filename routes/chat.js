const express = require("express");

const {
    sendMessage,
    getChatMessages,
} = require("../controllers/chatController");

const router = express.Router();

router.post("/send", sendMessage);

router.post("/getmessages", getChatMessages);

module.exports = router;