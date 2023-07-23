const express = require("express");

const {
    sendFriendRequest,
    acceptFriendRequest,
    removeFriend,
} = require("../controllers/userActivityController");

const router = express.Router();

router.post("/sendrequest", sendFriendRequest);

router.post("/acceptrequest", acceptFriendRequest);

router.post("/remove", removeFriend);

module.exports = router;
