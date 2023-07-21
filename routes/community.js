const express = require("express");

const { createCommunity } = require("../controllers/communityController");

const router = express.Router();



router.post("/create", createCommunity);

module.exports = router;