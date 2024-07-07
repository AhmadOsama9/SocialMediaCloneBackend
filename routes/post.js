const express = require("express");
const router = express.Router();

const {
    createPost,
    addPost,
    createPagePost,
    updatePost,
    deleteCommunityPost,
    deleteUserPost,
    deletePagePost,
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

/**
 * @swagger
 * tags:
 *   name: Post
 *   description: Operations related to posts
 */

/**
 * @swagger
 * /api/post/create:
 *   post:
 *     summary: Create a new post
 *     tags: [Post]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               content:
 *                 type: string
 *             example:
 *               userId: ABC123
 *               content: This is a new post
 *     responses:
 *       '200':
 *         description: Post created successfully
 */

router.post("/create", createPost);

/**
 * @swagger
 * /api/post/add:
 *   post:
 *     summary: Add a new post
 *     tags: [Post]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               content:
 *                 type: string
 *             example:
 *               userId: ABC123
 *               content: This is another post
 *     responses:
 *       '200':
 *         description: Post added successfully
 */

router.post("/add", addPost);

/**
 * @swagger
 * /api/post/createpagepost:
 *   post:
 *     summary: Create a new post on a page
 *     tags: [Post]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pageId:
 *                 type: string
 *               content:
 *                 type: string
 *             example:
 *               pageId: DEF456
 *               content: This is a new post on a page
 *     responses:
 *       '200':
 *         description: Page post created successfully
 */

router.post("/createpagepost", createPagePost);

/**
 * @swagger
 * /api/post/update:
 *   post:
 *     summary: Update a post
 *     tags: [Post]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
 *                 type: string
 *               content:
 *                 type: string
 *             example:
 *               postId: ABC123
 *               content: Updated post content
 *     responses:
 *       '200':
 *         description: Post updated successfully
 */

router.post("/update", updatePost);

/**
 * @swagger
 * /api/post/deletecommunitypost:
 *   post:
 *     summary: Delete a community post
 *     tags: [Post]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
 *                 type: string
 *             example:
 *               postId: ABC123
 *     responses:
 *       '200':
 *         description: Community post deleted successfully
 */

router.post("/deletecommunitypost", deleteCommunityPost);

/**
 * @swagger
 * /api/post/deleteuserpost:
 *   post:
 *     summary: Delete a user post
 *     tags: [Post]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
 *                 type: string
 *             example:
 *               postId: ABC123
 *     responses:
 *       '200':
 *         description: User post deleted successfully
 */

router.post("/deleteuserpost", deleteUserPost);

/**
 * @swagger
 * /api/post/deletepagepost:
 *   post:
 *     summary: Delete a page post
 *     tags: [Post]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
 *                 type: string
 *             example:
 *               postId: ABC123
 *     responses:
 *       '200':
 *         description: Page post deleted successfully
 */

router.post("/deletepagepost", deletePagePost);

/**
 * @swagger
 * /api/post/reaction/add:
 *   post:
 *     summary: Add a reaction to a post
 *     tags: [Post]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
 *                 type: string
 *               userId:
 *                 type: string
 *               reactionType:
 *                 type: string
 *             example:
 *               postId: ABC123
 *               userId: XYZ456
 *               reactionType: like
 *     responses:
 *       '200':
 *         description: Reaction added successfully
 */

router.post("/reaction/add", addReaction);

/**
 * @swagger
 * /api/post/reaction/update:
 *   post:
 *     summary: Update a reaction to a post
 *     tags: [Post]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
 *                 type: string
 *               userId:
 *                 type: string
 *               reactionType:
 *                 type: string
 *             example:
 *               postId: ABC123
 *               userId: XYZ456
 *               reactionType: love
 *     responses:
 *       '200':
 *         description: Reaction updated successfully
 */

router.post("/reaction/update", updateReaction);

/**
 * @swagger
 * /api/post/reaction/remove:
 *   post:
 *     summary: Remove a reaction from a post
 *     tags: [Post]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
 *                 type: string
 *               userId:
 *                 type: string
 *             example:
 *               postId: ABC123
 *               userId: XYZ456
 *     responses:
 *       '200':
 *         description: Reaction removed successfully
 */

router.post("/reaction/remove", removeReaction);

/**
 * @swagger
 * /api/post/comment/add:
 *   post:
 *     summary: Add a comment to a post
 *     tags: [Post]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
 *                 type: string
 *               userId:
 *                 type: string
 *               text:
 *                 type: string
 *             example:
 *               postId: ABC123
 *               userId: XYZ456
 *               text: This is a comment
 *     responses:
 *       '200':
 *         description: Comment added successfully
 */

router.post("/comment/add", addComment);

/**
 * @swagger
 * /api/post/comment/update:
 *   post:
 *     summary: Update a comment on a post
 *     tags: [Post]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               commentId:
 *                 type: string
 *               text:
 *                 type: string
 *             example:
 *               commentId: DEF456
 *               text: Updated comment text
 *     responses:
 *       '200':
 *         description: Comment updated successfully
 */

router.post("/comment/update", updateComment);

/**
 * @swagger
 * /api/post/comment/remove:
 *   post:
 *     summary: Remove a comment from a post
 *     tags: [Post]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               commentId:
 *                 type: string
 *             example:
 *               commentId: DEF456
 *     responses:
 *       '200':
 *         description: Comment removed successfully
 */

router.post("/comment/remove", removeComment);

/**
 * @swagger
 * /api/post/share/add:
 *   post:
 *     summary: Add a share to a post
 *     tags: [Post]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
 *                 type: string
 *               userId:
 *                 type: string
 *             example:
 *               postId: ABC123
 *               userId: XYZ456
 *     responses:
 *       '200':
 *         description: Share added successfully
 */

router.post("/share/add", addShare);

/**
 * @swagger
 * /api/post/share/remove:
 *   post:
 *     summary: Remove a share from a post
 *     tags: [Post]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
 *                 type: string
 *               userId:
 *                 type: string
 *             example:
 *               postId: ABC123
 *               userId: XYZ456
 *     responses:
 *       '200':
 *         description: Share removed successfully
 */

router.post("/share/remove", removeShare);

/**
 * @swagger
 * /api/post/reaction/get:
 *   get:
 *     summary: Get reactions of a post
 *     tags: [Post]
 *     parameters:
 *       - in: query
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the post
 *     responses:
 *       '200':
 *         description: Retrieved post reactions successfully
 */

router.get("/reaction/get", getPostReactions);

/**
 * @swagger
 * /api/post/comment/get:
 *   get:
 *     summary: Get comments of a post
 *     tags: [Post]
 *     parameters:
 *       - in: query
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the post
 *     responses:
 *       '200':
 *         description: Retrieved post comments successfully
 */

router.get("/comment/get", getPostComments);

/**
 * @swagger
 * /api/post/share/get:
 *   get:
 *     summary: Get share count of a post
 *     tags: [Post]
 *     parameters:
 *       - in: query
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the post
 *     responses:
 *       '200':
 *         description: Retrieved post share count successfully
 */

router.get("/share/get", getPostSharesCount);

module.exports = router;
