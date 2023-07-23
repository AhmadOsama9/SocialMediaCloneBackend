const express = require("express");

const {
    sendFriendRequest,
    acceptFriendRequest,
    removeFriend,
    getAllFriends,
    getJoinedCommunities,
} = require("../controllers/userActivityController");

const router = express.Router();

router.post("/sendrequest", sendFriendRequest);

router.post("/acceptrequest", acceptFriendRequest);

router.post("/remove", removeFriend);

router.get("/getallfriends", getAllFriends);

router.get("/getjoinedCommunities", getJoinedCommunities);


module.exports = router;
