const express = require("express");
const router = express.Router();
const {
  updateNickname,
  updateAge,
  updateGender,
  updateBio,
  updateImage,
  getProfileInfo,
  searchByNickname,
  getNickname,
} = require("../controllers/profileController");

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: Operations related to user profiles
 */

/**
 * @swagger
 * /api/profile/updateprofile/nickname:
 *   post:
 *     summary: Update user nickname
 *     tags: [Profile]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               nickname:
 *                 type: string
 *             example:
 *               userId: ABC123
 *               nickname: NewNickname
 *     responses:
 *       '200':
 *         description: Nickname updated successfully
 */

router.post("/updateprofile/nickname", updateNickname);

/**
 * @swagger
 * /api/profile/updateprofile/age:
 *   post:
 *     summary: Update user age
 *     tags: [Profile]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               age:
 *                 type: integer
 *             example:
 *               userId: ABC123
 *               age: 30
 *     responses:
 *       '200':
 *         description: Age updated successfully
 */

router.post("/updateprofile/age", updateAge);

/**
 * @swagger
 * /api/profile/updateprofile/gender:
 *   post:
 *     summary: Update user gender
 *     tags: [Profile]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *             example:
 *               userId: ABC123
 *               gender: male
 *     responses:
 *       '200':
 *         description: Gender updated successfully
 */

router.post("/updateprofile/gender", updateGender);

/**
 * @swagger
 * /api/profile/updateprofile/bio:
 *   post:
 *     summary: Update user biography
 *     tags: [Profile]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               bio:
 *                 type: string
 *             example:
 *               userId: ABC123
 *               bio: New biography
 *     responses:
 *       '200':
 *         description: Biography updated successfully
 */

router.post("/updateprofile/bio", updateBio);

/**
 * @swagger
 * /api/profile/updateprofile/image:
 *   post:
 *     summary: Update user profile image
 *     tags: [Profile]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *             example:
 *               userId: ABC123
 *               image: (binary data)
 *     responses:
 *       '200':
 *         description: Profile image updated successfully
 */

router.post("/updateprofile/image", updateImage);

/**
 * @swagger
 * /api/profile/getprofileinfo:
 *   get:
 *     summary: Get user profile information
 *     tags: [Profile]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user
 *     responses:
 *       '200':
 *         description: Retrieved user profile information successfully
 */

router.get("/getprofileinfo", getProfileInfo);

/**
 * @swagger
 * /api/profile/getprofilebynickname:
 *   get:
 *     summary: Search user profile by nickname
 *     tags: [Profile]
 *     parameters:
 *       - in: query
 *         name: nickname
 *         schema:
 *           type: string
 *         required: true
 *         description: Nickname of the user
 *     responses:
 *       '200':
 *         description: Retrieved user profile by nickname successfully
 */

router.get("/getprofilebynickname", searchByNickname);

/**
 * @swagger
 * /api/profile/getnickname:
 *   get:
 *     summary: Get user nickname
 *     tags: [Profile]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user
 *     responses:
 *       '200':
 *         description: Retrieved user nickname successfully
 */

router.get("/getnickname", getNickname);

module.exports = router;
