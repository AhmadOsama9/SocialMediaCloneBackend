const express = require("express");
const router = express.Router();

const {
    createCommunity,
    removeCommunity,
    removeMember,
    addToRequests,
    acceptMemberRequest,
    makeMemberAdmin,
    searchCommunityByName,
    getAllCommunities,
    getRelation,
    declineMemberRequest,
    cancelRequest,
    getMembers,
    getMembershipRequests,
    leaveCommunity,
    getCreatedPost,
} = require("../controllers/communityController");

/**
 * @swagger
 * tags:
 *   name: Community
 *   description: Community operations
 */

/**
 * @swagger
 * /api/community/create:
 *   post:
 *     summary: Create a new community
 *     tags: [Community]
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
 *               name: My Community
 *               description: This is a community for discussion
 *     responses:
 *       '200':
 *         description: Community created successfully
 */

router.post("/create", createCommunity);

/**
 * @swagger
 * /api/community/delete:
 *   post:
 *     summary: Delete a community
 *     tags: [Community]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               communityId:
 *                 type: string
 *             example:
 *               communityId: ABC123
 *     responses:
 *       '200':
 *         description: Community deleted successfully
 */

router.post("/delete", removeCommunity);

/**
 * @swagger
 * /api/community/removemember:
 *   post:
 *     summary: Remove a member from a community
 *     tags: [Community]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               communityId:
 *                 type: string
 *               memberId:
 *                 type: string
 *             example:
 *               communityId: ABC123
 *               memberId: XYZ456
 *     responses:
 *       '200':
 *         description: Member removed successfully
 */

router.post("/removemember", removeMember);

/**
 * @swagger
 * /api/community/sendrequest:
 *   post:
 *     summary: Add a membership request to join a community
 *     tags: [Community]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               communityId:
 *                 type: string
 *               memberId:
 *                 type: string
 *             example:
 *               communityId: ABC123
 *               memberId: XYZ456
 *     responses:
 *       '200':
 *         description: Request sent successfully
 */

router.post("/sendrequest", addToRequests);

/**
 * @swagger
 * /api/community/acceptrequest:
 *   post:
 *     summary: Accept a membership request to join a community
 *     tags: [Community]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               communityId:
 *                 type: string
 *               requestId:
 *                 type: string
 *             example:
 *               communityId: ABC123
 *               requestId: REQ789
 *     responses:
 *       '200':
 *         description: Request accepted successfully
 */

router.post("/acceptrequest", acceptMemberRequest);

/**
 * @swagger
 * /api/community/makeadmin:
 *   post:
 *     summary: Make a member an admin of the community
 *     tags: [Community]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               communityId:
 *                 type: string
 *               memberId:
 *                 type: string
 *             example:
 *               communityId: ABC123
 *               memberId: XYZ456
 *     responses:
 *       '200':
 *         description: Member made admin successfully
 */

router.post("/makeadmin", makeMemberAdmin);

/**
 * @swagger
 * /api/community/declinerequest:
 *   post:
 *     summary: Decline a membership request to join a community
 *     tags: [Community]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               communityId:
 *                 type: string
 *               requestId:
 *                 type: string
 *             example:
 *               communityId: ABC123
 *               requestId: REQ789
 *     responses:
 *       '200':
 *         description: Request declined successfully
 */

router.post("/declinerequest", declineMemberRequest);

/**
 * @swagger
 * /api/community/cancelrequest:
 *   post:
 *     summary: Cancel a membership request to join a community
 *     tags: [Community]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               communityId:
 *                 type: string
 *               memberId:
 *                 type: string
 *             example:
 *               communityId: ABC123
 *               memberId: XYZ456
 *     responses:
 *       '200':
 *         description: Request canceled successfully
 */

router.post("/cancelrequest", cancelRequest);

/**
 * @swagger
 * /api/community/leave:
 *   get:
 *     summary: Leave a community
 *     tags: [Community]
 *     parameters:
 *       - in: query
 *         name: communityId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the community
 *     responses:
 *       '200':
 *         description: Left community successfully
 */

router.get("/leave", leaveCommunity);

/**
 * @swagger
 * /api/community/search:
 *   get:
 *     summary: Search for a community by name
 *     tags: [Community]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Name of the community to search for
 *     responses:
 *       '200':
 *         description: Retrieved community successfully
 */

router.get("/search", searchCommunityByName);

/**
 * @swagger
 * /api/community/getall:
 *   get:
 *     summary: Get all communities
 *     tags: [Community]
 *     responses:
 *       '200':
 *         description: Retrieved all communities successfully
 */

router.get("/getall", getAllCommunities);

/**
 * @swagger
 * /api/community/relation:
 *   get:
 *     summary: Get relation to a community (member, admin, pending)
 *     tags: [Community]
 *     parameters:
 *       - in: query
 *         name: communityId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the community
 *     responses:
 *       '200':
 *         description: Retrieved relation successfully
 */

router.get("/relation", getRelation);

/**
 * @swagger
 * /api/community/getmembers:
 *   get:
 *     summary: Get all members of a community
 *     tags: [Community]
 *     parameters:
 *       - in: query
 *         name: communityId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the community
 *     responses:
 *       '200':
 *         description: Retrieved members successfully
 */

router.get("/getmembers", getMembers);

/**
 * @swagger
 * /api/community/getmembershiprequests:
 *   get:
 *     summary: Get all membership requests for a community
 *     tags: [Community]
 *     parameters:
 *       - in: query
 *         name: communityId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the community
 *     responses:
 *       '200':
 *         description: Retrieved membership requests successfully
 */

router.get("/getmembershiprequests", getMembershipRequests);

/**
 * @swagger
 * /api/community/getcreatedposts:
 *   get:
 *     summary: Get posts created within a community
 *     tags: [Community]
 *     parameters:
 *       - in: query
 *         name: communityId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the community
 *     responses:
 *       '200':
 *         description: Retrieved created posts successfully
 */

router.get("/getcreatedposts", getCreatedPost);

module.exports = router;
