const express = require("express");

const {
    sendFriendRequest,
    acceptFriendRequest,
    removeFriend,
    getAllFriends,
} = require("../controllers/userActivityController");

const router = express.Router();

router.post("/sendrequest", sendFriendRequest);

router.post("/acceptrequest", acceptFriendRequest);

router.post("/remove", removeFriend);

router.get("/getallfriends", getAllFriends);



module.exports = router;
