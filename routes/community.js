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
    getMembershipRequests,
    leaveCommunity,
 } 
 = require("../controllers/communityController");

const router = express.Router();



router.post("/create", createCommunity);

router.post("/delete", removeCommunity);

router.post("/removemember", removeMember);

router.post("/sendrequest", addToRequests);

router.post("/acceptrequest", acceptMemberRequest);

router.post("/makeadmin", makeMemberAdmin); 

router.post("/declinerequest", declineMemberRequest);

router.post("/cancelrequest", cancelRequest);


router.get("/leave", leaveCommunity);

router.get("/search", searchCommunityByName);

router.get("/getall", getAllCommunities);

router.get("/relation", getRelation);

router.get("/getmembers", getMembers);

router.get("/getmembershiprequests", getMembershipRequests);

module.exports = router;