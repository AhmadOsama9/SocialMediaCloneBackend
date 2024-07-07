const express = require("express");

const {
    getCreatedPosts,
    getSharedPosts,
    sendFriendRequest,
    acceptFriendRequest,
    removeFriend,
    getAllFriends,
    getJoinedCommunities,
    getUserCommunities,
    getUserPages,
    getFriendRelationshipStatus,
    declineFriendRequest,
    cancelRequest,
    getReceivedRequests,
    getFeedPosts,
} = require("../controllers/userActivityController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: UserActivity
 *   description: Operations related to user activity and relationships
 */

/**
 * @swagger
 * /api/userActivity/sendrequest:
 *   post:
 *     summary: Send friend request
 *     tags: [UserActivity]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               friendId:
 *                 type: string
 *             example:
 *               userId: ABC123
 *               friendId: XYZ789
 *     responses:
 *       '200':
 *         description: Friend request sent successfully
 */

router.post("/sendrequest", sendFriendRequest);

/**
 * @swagger
 * /api/userActivity/acceptrequest:
 *   post:
 *     summary: Accept friend request
 *     tags: [UserActivity]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               requestId:
 *                 type: string
 *             example:
 *               requestId: REQUEST123
 *     responses:
 *       '200':
 *         description: Friend request accepted successfully
 */

router.post("/acceptrequest", acceptFriendRequest);

/**
 * @swagger
 * /api/userActivity/remove:
 *   post:
 *     summary: Remove friend
 *     tags: [UserActivity]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               friendId:
 *                 type: string
 *             example:
 *               userId: ABC123
 *               friendId: XYZ789
 *     responses:
 *       '200':
 *         description: Friend removed successfully
 */

router.post("/remove", removeFriend);

/**
 * @swagger
 * /api/userActivity/decline:
 *   post:
 *     summary: Decline friend request
 *     tags: [UserActivity]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               requestId:
 *                 type: string
 *             example:
 *               requestId: REQUEST123
 *     responses:
 *       '200':
 *         description: Friend request declined successfully
 */

router.post("/decline", declineFriendRequest);

/**
 * @swagger
 * /api/userActivity/cancelrequest:
 *   post:
 *     summary: Cancel friend request
 *     tags: [UserActivity]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               requestId:
 *                 type: string
 *             example:
 *               requestId: REQUEST123
 *     responses:
 *       '200':
 *         description: Friend request canceled successfully
 */

router.post("/cancelrequest", cancelRequest);

/**
 * @swagger
 * /api/userActivity/getposts:
 *   get:
 *     summary: Get posts created by user
 *     tags: [UserActivity]
 *     responses:
 *       '200':
 *         description: Retrieved user's created posts successfully
 */

router.get("/getposts", getCreatedPosts);

/**
 * @swagger
 * /api/userActivity/getsharedposts:
 *   get:
 *     summary: Get posts shared by user
 *     tags: [UserActivity]
 *     responses:
 *       '200':
 *         description: Retrieved user's shared posts successfully
 */

router.get("/getsharedposts", getSharedPosts);

/**
 * @swagger
 * /api/userActivity/receivedrequests:
 *   get:
 *     summary: Get received friend requests
 *     tags: [UserActivity]
 *     responses:
 *       '200':
 *         description: Retrieved user's received friend requests successfully
 */

router.get("/receivedrequests", getReceivedRequests);

/**
 * @swagger
 * /api/userActivity/getallfriends:
 *   get:
 *     summary: Get all user's friends
 *     tags: [UserActivity]
 *     responses:
 *       '200':
 *         description: Retrieved user's friends successfully
 */

router.get("/getallfriends", getAllFriends);

/**
 * @swagger
 * /api/userActivity/getjoinedCommunities:
 *   get:
 *     summary: Get communities user has joined
 *     tags: [UserActivity]
 *     responses:
 *       '200':
 *         description: Retrieved communities user has joined successfully
 */

router.get("/getjoinedCommunities", getJoinedCommunities);

/**
 * @swagger
 * /api/userActivity/getusercommunities:
 *   get:
 *     summary: Get communities user is a part of
 *     tags: [UserActivity]
 *     responses:
 *       '200':
 *         description: Retrieved communities user is a part of successfully
 */

router.get("/getusercommunities", getUserCommunities);

/**
 * @swagger
 * /api/userActivity/getuserpages:
 *   get:
 *     summary: Get pages user is associated with
 *     tags: [UserActivity]
 *     responses:
 *       '200':
 *         description: Retrieved pages user is associated with successfully
 */

router.get("/getuserpages", getUserPages);

/**
 * @swagger
 * /api/userActivity/getrelation:
 *   get:
 *     summary: Get relationship status with a friend
 *     tags: [UserActivity]
 *     responses:
 *       '200':
 *         description: Retrieved friend relationship status successfully
 */

router.get("/getrelation", getFriendRelationshipStatus);

/**
 * @swagger
 * /api/userActivity/getfeedposts:
 *   get:
 *     summary: Get user's feed posts
 *     tags: [UserActivity]
 *     responses:
 *       '200':
 *         description: Retrieved user's feed posts successfully
 */

router.get("/getfeedposts", getFeedPosts);

module.exports = router;
