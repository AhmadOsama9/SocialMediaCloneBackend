const express = require("express");

const {
    sendFriendRequest,
    acceptFriendRequest,
    removeFriend,
    getAllFriends,
    getJoinedCommunities,
    getFriendRelationshipStatus,
} = require("../controllers/userActivityController");

const router = express.Router();

router.post("/sendrequest", sendFriendRequest);

router.post("/acceptrequest", acceptFriendRequest);

router.post("/remove", removeFriend);

router.get("/getallfriends", getAllFriends);

router.get("/getjoinedCommunities", getJoinedCommunities);

router.get("/getrelation", getFriendRelationshipStatus);


module.exports = router;
