const express = require("express");

const {
    sendFriendRequest,
    acceptFriendRequest,
} = require("../controllers/userActivityController");

const router = express.Router();

router.post("/sendrequest", sendFriendRequest);

router.post("/acceptrequest", acceptFriendRequest);

module.exports = router;
