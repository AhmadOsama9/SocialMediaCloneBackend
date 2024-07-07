const express = require("express");
const router = express.Router();

const {
    sendMessage,
    sendMessageByChatId,
    getChatMessages,
    getChatMessagesByChatId,
    getChats,
} = require("../controllers/chatController");

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: Chat operations
 */

/**
 * @swagger
 * /api/chat/send:
 *   post:
 *     summary: Send a message
 *     tags: [Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *             example:
 *               message: Hello, this is a message
 *     responses:
 *       '200':
 *         description: Message sent successfully
 */

router.post("/send", sendMessage);

/**
 * @swagger
 * /api/chat/sendbychatid:
 *   post:
 *     summary: Send a message by chat ID
 *     tags: [Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chatId:
 *                 type: string
 *               message:
 *                 type: string
 *             example:
 *               chatId: ABC123
 *               message: Hello, this is a message
 *     responses:
 *       '200':
 *         description: Message sent successfully
 */

router.post("/sendbychatid", sendMessageByChatId);

/**
 * @swagger
 * /api/chat/getmessages:
 *   post:
 *     summary: Get all chat messages
 *     tags: [Chat]
 *     responses:
 *       '200':
 *         description: Retrieved all messages successfully
 */

router.post("/getmessages", getChatMessages);

/**
 * @swagger
 * /api/chat/getchats:
 *   get:
 *     summary: Get all chats
 *     tags: [Chat]
 *     responses:
 *       '200':
 *         description: Retrieved all chats successfully
 */

router.get("/getchats", getChats);

/**
 * @swagger
 * /api/chat/getchatmessagesbychatid:
 *   get:
 *     summary: Get messages by chat ID
 *     tags: [Chat]
 *     parameters:
 *       - in: query
 *         name: chatId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the chat
 *     responses:
 *       '200':
 *         description: Retrieved chat messages successfully
 */

router.get("/getchatmessagesbychatid", getChatMessagesByChatId);

module.exports = router;
