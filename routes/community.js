const express = require("express");

const { 
    createCommunity,
    removeCommunity,
    addMember,
    removeMember,
    addToRequests,
    acceptMemberRequest,
    makeMemberAdmin,
 } 
 = require("../controllers/communityController");

const router = express.Router();



router.post("/create", createCommunity);

router.post("/remove", removeCommunity);

router.post("/add", addMember);

router.post("/remove", removeMember);

router.post("/addtorequests", addToRequests);

router.post("/accept", acceptMemberRequest);

router.post("/makeadmin", makeMemberAdmin);  

module.exports = router;