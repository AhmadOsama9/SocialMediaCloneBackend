const express = require("express");

const { 
    createPost,
    addPost, 
    updatePost, 
    deleteCommunityPost,
    deleteUserPost,
    addReaction,
    updateReaction,
    removeReaction,
    addComment,
    updateComment,
    removeComment,
    addShare,
    removeShare,
    getPostReactions,
    getPostComments,
    getPostSharesCount,
} = require("../controllers/postController");

const router = express.Router();

router.post("/create", createPost);

router.post("/add", addPost);

router.post("/update", updatePost);

router.post("/deletecommunitypost", deleteCommunityPost);

router.post("/deleteuserpost", deleteUserPost);

router.post("/reaction/add", addReaction);

router.post("/reaction/update", updateReaction);

router.post("/reaction/remove", removeReaction);

router.post("/comment/add", addComment);

router.post("/comment/update", updateComment);

router.post("/comment/remove", removeComment);

router.post("/share/add", addShare);

router.post("/share/remove", removeShare);


router.get("/reactions", getPostReactions);

router.get("/comments", getPostComments);

router.get("/shares", getPostSharesCount);


module.exports = router;