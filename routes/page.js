const {
    createPage,
    deletePage,
    getCreatedPosts,
    getPageLikers,
    getPage,

} = require("../controllers/pageController");

const express = require("express");

const router = express.Router();

router.post("/create", createPage);

router.post("/delete", deletePage);


router.get("/posts", getCreatedPosts);

router.get("/pagelikers", getPageLikers);

router.get("/getpage", getPage);

module.exports = router;