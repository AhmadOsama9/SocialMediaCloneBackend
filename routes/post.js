const express = require("express");

const { 
    createPost,
    addPost, 
    getPosts,
    updatePost, 
    deletePost,
    addReaction,
    updateReaction,
    removeReaction,
    addComment,
    updateComment,
    removeComment,
    addShare,
    removeShare,
} = require("../controllers/postController");

const router = express.Router();

router.post("/create", createPost);

router.post("/add", addPost);

router.post("/update", updatePost);

router.post("/delete", deletePost);

router.post("/reaction/add", addReaction);

router.post("/reaction/update", updateReaction);

router.post("/reaction/remove", removeReaction);

router.post("/comment/add", addComment);

router.post("/comment/update", updateComment);

router.post("/comment/remove", removeComment);

router.post("/share/add", addShare);

router.post("/share/remove", removeShare);



router.get("/getposts", getPosts);

module.exports = router;