const express = require("express");
const passport = require("../passport");

const { 
    signupUser, 
    loginUser,
    google,
    checkUserInfo,
    checkToken,
    forgotPassword,
    validateOTP,
    checkPassword,
    updatePassword,
} = require("../controllers/userController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Operations related to user management
 */

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Login user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               email: user@example.com
 *               password: password123
 *     responses:
 *       '200':
 *         description: User logged in successfully
 */

router.post("/login", loginUser);

/**
 * @swagger
 * /api/user/signup:
 *   post:
 *     summary: Signup user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *             example:
 *               email: user@example.com
 *               password: password123
 *               name: John Doe
 *     responses:
 *       '200':
 *         description: User signed up successfully
 */

router.post("/signup", signupUser);

/**
 * @swagger
 * /api/user/checktoken:
 *   get:
 *     summary: Check user token
 *     tags: [Users]
 *     responses:
 *       '200':
 *         description: Token is valid
 */

router.get("/checktoken", checkToken);

/**
 * @swagger
 * /api/user/checkuserinfo:
 *   post:
 *     summary: Check user information
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *             example:
 *               userId: ABC123
 *     responses:
 *       '200':
 *         description: User information retrieved successfully
 */

router.post("/checkuserinfo", checkUserInfo);

/**
 * @swagger
 * /api/user/checkpassword:
 *   post:
 *     summary: Check user password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               userId: ABC123
 *               password: currentPassword123
 *     responses:
 *       '200':
 *         description: Password check successful
 */

router.post("/checkpassword", checkPassword);

/**
 * @swagger
 * /api/user/updatepassword:
 *   post:
 *     summary: Update user password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               newPassword:
 *                 type: string
 *             example:
 *               userId: ABC123
 *               newPassword: newPassword123
 *     responses:
 *       '200':
 *         description: Password updated successfully
 */

router.post("/updatepassword", updatePassword);

/**
 * @swagger
 * /api/user/auth/google:
 *   get:
 *     summary: Initiate Google OAuth authentication
 *     tags: [Users]
 *     responses:
 *       '200':
 *         description: Redirecting to Google OAuth consent screen
 */

router.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["email"] })
);

/**
 * @swagger
 * /api/user/auth/google/callback:
 *   get:
 *     summary: Handle Google OAuth callback
 *     tags: [Users]
 *     responses:
 *       '200':
 *         description: Google OAuth callback success
 *       '302':
 *         description: Google OAuth callback failure, redirecting to specified URL
 */

router.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "https://socialmediaclone-s3lg.onrender.com/" }),
    google
);

/**
 * @swagger
 * /api/user/forgotpassword:
 *   post:
 *     summary: Initiate forgot password process
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *             example:
 *               email: user@example.com
 *     responses:
 *       '200':
 *         description: Forgot password process initiated successfully
 */

router.post("/forgotpassword", forgotPassword);

/**
 * @swagger
 * /api/user/validateotp:
 *   post:
 *     summary: Validate OTP (One Time Password)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *             example:
 *               email: user@example.com
 *               otp: 123456
 *     responses:
 *       '200':
 *         description: OTP validated successfully
 */

router.post("/validateotp", validateOTP);

module.exports = router;
