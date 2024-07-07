const express = require("express");
const router = express.Router();

const {
    createPage,
    deletePage,
    getCreatedPosts,
    getPageLikers,
    getPage,
    getPageAdmin,
    addLike,
    removeLike,
} = require("../controllers/pageController");

/**
 * @swagger
 * tags:
 *   name: Page
 *   description: Operations related to pages
 */

/**
 * @swagger
 * /api/page/create:
 *   post:
 *     summary: Create a new page
 *     tags: [Page]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *             example:
 *               name: My Page
 *               description: This is a page for sharing content
 *     responses:
 *       '200':
 *         description: Page created successfully
 */

router.post("/create", createPage);

/**
 * @swagger
 * /api/page/delete:
 *   post:
 *     summary: Delete a page
 *     tags: [Page]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pageId:
 *                 type: string
 *             example:
 *               pageId: ABC123
 *     responses:
 *       '200':
 *         description: Page deleted successfully
 */

router.post("/delete", deletePage);

/**
 * @swagger
 * /api/page/addlike:
 *   post:
 *     summary: Add a like to a page
 *     tags: [Page]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pageId:
 *                 type: string
 *               userId:
 *                 type: string
 *             example:
 *               pageId: ABC123
 *               userId: XYZ456
 *     responses:
 *       '200':
 *         description: Like added successfully
 */

router.post("/addlike", addLike);

/**
 * @swagger
 * /api/page/removelike:
 *   post:
 *     summary: Remove a like from a page
 *     tags: [Page]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pageId:
 *                 type: string
 *               userId:
 *                 type: string
 *             example:
 *               pageId: ABC123
 *               userId: XYZ456
 *     responses:
 *       '200':
 *         description: Like removed successfully
 */

router.post("/removelike", removeLike);

/**
 * @swagger
 * /api/page/posts:
 *   get:
 *     summary: Get posts created on a page
 *     tags: [Page]
 *     parameters:
 *       - in: query
 *         name: pageId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the page
 *     responses:
 *       '200':
 *         description: Retrieved posts successfully
 */

router.get("/posts", getCreatedPosts);

/**
 * @swagger
 * /api/page/pagelikers:
 *   get:
 *     summary: Get likers of a page
 *     tags: [Page]
 *     parameters:
 *       - in: query
 *         name: pageId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the page
 *     responses:
 *       '200':
 *         description: Retrieved page likers successfully
 */

router.get("/pagelikers", getPageLikers);

/**
 * @swagger
 * /api/page/getpage:
 *   get:
 *     summary: Get details of a page
 *     tags: [Page]
 *     parameters:
 *       - in: query
 *         name: pageId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the page
 *     responses:
 *       '200':
 *         description: Retrieved page details successfully
 */

router.get("/getpage", getPage);

/**
 * @swagger
 * /api/page/getpageadmin:
 *   get:
 *     summary: Get admin of a page
 *     tags: [Page]
 *     parameters:
 *       - in: query
 *         name: pageId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the page
 *     responses:
 *       '200':
 *         description: Retrieved page admin successfully
 */

router.get("/getpageadmin", getPageAdmin);

module.exports = router;
