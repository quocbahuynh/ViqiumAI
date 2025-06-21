import express from 'express';
import authenticateJWT from '../middleware/auth.js';
import { getProfile, getUserPlan, updateProfile } from '../controllers/profileController.js';

const router = express.Router();

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Retrieves the profile details of the authenticated user.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []  # Use bearer token for authentication
 *     responses:
 *       200:
 *         description: Successfully retrieved the user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The user's unique identifier.
 *                     fullName:
 *                       type: string
 *                       description: The full name of the user.
 *                     email:
 *                       type: string
 *                       description: The email address of the user.
 *       401:
 *         description: Unauthorized - The user is not authenticated.
 *       404:
 *         description: Not Found - The user profile was not found.
 *       500:
 *         description: Internal Server Error - An error occurred while fetching the profile.
 *     components:
 *       securitySchemes:
 *         bearerAuth:
 *           type: http
 *           scheme: bearer
 *           bearerFormat: JWT
 */
router.get('/', authenticateJWT, getProfile);


/**
 * @swagger
 * /api/profile/plan:
 *   get:
 *     summary: Get user's current usage and message limit
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usage statistics and message limit for the current user's plan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 usage:
 *                   type: integer
 *                   example: 47
 *                 limit:
 *                   type: object
 *                   properties:
 *                     messages:
 *                       type: integer
 *                       example: 100
 *       401:
 *         description: Unauthorized - User not authenticated
 *       500:
 *         description: Internal server error
 */
router.get('/plan', authenticateJWT, getUserPlan)

export default router;