const express = require("express");

const { 
    createCommunity,
    removeCommunity,
    removeMember,
    addToRequests,
    acceptMemberRequest,
    makeMemberAdmin,
    searchCommunityByName,
    getAllCommunities,
    getRelation,
    declineMemberRequest,
    cancelRequest,
    getMembers,
 } 
 = require("../controllers/communityController");

const router = express.Router();



router.post("/create", createCommunity);

router.post("/remove", removeCommunity);

router.post("/removemember", removeMember);

router.post("/sendrequest", addToRequests);

router.post("/accept", acceptMemberRequest);

router.post("/makeadmin", makeMemberAdmin); 

router.post("/decline", declineMemberRequest);

router.post("cancelRequest", cancelRequest);


router.get("/search", searchCommunityByName);

router.get("/getall", getAllCommunities);

router.get("/relation", getRelation);

router.get("/getmembers", getMembers);

module.exports = router;