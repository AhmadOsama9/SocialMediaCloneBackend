const express = require("express");

const { 
    addPost, 
    updatePost, 
    deletePost,
    addReaction,
    updateReaction,
    removeReaction,
} = require("../controllers/postController");

const router = express.Router();

router.post("/add", addPost);

router.post("/update", updatePost);

router.post("/delete", deletePost);

router.post("/reaction/add", addReaction);

router.post("/reaction/update", updateReaction);

router.post("/reaction/remove", removeReaction);

module.exports = router;