const express = require("express");

const {
    getCreatedPosts,
    getSharedPosts,
    sendFriendRequest,
    acceptFriendRequest,
    removeFriend,
    getAllFriends,
    getJoinedCommunities,
    getFriendRelationshipStatus,
    declineFriendRequest,
    cancelRequest,
    getReceivedRequests,
    getFeedPosts,
} = require("../controllers/userActivityController");

const router = express.Router();

router.post("/sendrequest", sendFriendRequest);

router.post("/acceptrequest", acceptFriendRequest);

router.post("/remove", removeFriend);

router.post("/decline", declineFriendRequest);

router.post("/cancelrequest", cancelRequest);


router.get("/getposts", getCreatedPosts);

router.get("/getsharedposts", getSharedPosts);

router.get("/receivedrequests", getReceivedRequests);

router.get("/getallfriends", getAllFriends);

router.get("/getjoinedCommunities", getJoinedCommunities);

router.get("/getrelation", getFriendRelationshipStatus);

router.get("/getfeedposts", getFeedPosts);


module.exports = router;
