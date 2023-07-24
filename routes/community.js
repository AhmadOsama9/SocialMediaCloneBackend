const express = require("express");

const { 
    createCommunity,
    removeCommunity,
    addMember,
    removeMember,
    addToRequests,
    acceptMemberRequest,
    makeMemberAdmin,
    searchCommunityByName,
    getAllCommunities,
 } 
 = require("../controllers/communityController");

const router = express.Router();



router.post("/create", createCommunity);

router.post("/remove", removeCommunity);

router.post("/add", addMember);

router.post("/removemember", removeMember);

router.post("/addtorequests", addToRequests);

router.post("/accept", acceptMemberRequest);

router.post("/makeadmin", makeMemberAdmin);  

router.get("/search", searchCommunityByName);

router.get("/getall", getAllCommunities);

module.exports = router;