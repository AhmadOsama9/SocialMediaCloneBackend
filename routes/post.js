const express = require("express");

const { addPost, updatePost, deletePost } = require("../controllers/postController");

const router = express.Router();

router.post("/add", addPost);

router.post("/update", updatePost);

router.post("/delete", deletePost);

module.exports = router;