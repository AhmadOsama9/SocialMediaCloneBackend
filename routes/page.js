const {
    createPage,
    deletePage,
    getCreatedPosts,
    getPageLikers,
    getPage,
    getPageAdmin,

} = require("../controllers/pageController");

const express = require("express");

const router = express.Router();

router.post("/create", createPage);

router.post("/delete", deletePage);


router.get("/posts", getCreatedPosts);

router.get("/pagelikers", getPageLikers);

router.get("/getpage", getPage);

router.get("/getpageadmin/", getPageAdmin);

module.exports = router;