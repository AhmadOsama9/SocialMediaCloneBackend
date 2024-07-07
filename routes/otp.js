const express = require("express");
const router = express.Router();

const {
    createAndSendOTP,
    validateOTP,
} = require("../controllers/otpController");

/**
 * @swagger
 * tags:
 *   name: OTP
 *   description: Operations related to OTP (One-Time Password)
 */

/**
 * @swagger
 * /api/otp/sendotp:
 *   post:
 *     summary: Create and send OTP
 *     tags: [OTP]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *             example:
 *               phoneNumber: "+1234567890"
 *     responses:
 *       '200':
 *         description: OTP created and sent successfully
 */

router.post("/sendotp", createAndSendOTP);

/**
 * @swagger
 * /api/otp/validateotp:
 *   post:
 *     summary: Validate OTP
 *     tags: [OTP]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *               otp:
 *                 type: string
 *             example:
 *               phoneNumber: "+1234567890"
 *               otp: "123456"
 *     responses:
 *       '200':
 *         description: OTP validated successfully
 */

router.post("/validateotp", validateOTP);

module.exports = router;
