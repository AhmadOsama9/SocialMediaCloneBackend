const express = require("express");

const { 
    createCommunity,
    addMember,
    removeMember,
    acceptMemberRequest,
    makeMemberAdmin,
 } 
 = require("../controllers/communityController");

const router = express.Router();



router.post("/create", createCommunity);

router.post("/add", addMember);

router.post("/remove", removeMember);

router.post("/accept", acceptMemberRequest);

router.post("/makeadmin", makeMemberAdmin);  

module.exports = router;