import express from 'express';
import { createSession, getChatbox, getChatBoxByAPIKey, getChatHistoryBox, sendMessageChatBox, updateChatbox } from '../controllers/chatboxController.js';
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     ChatBox:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           format: objectId
 *         projectId:
 *           type: string
 *           format: objectId
 *         websiteUrl:
 *           type: string
 *         name:
 *           type: string
 *         theme:
 *           type: string
 *         avatar:
 *           type: string
 *         apiKey:
 *           type: string
 */

/**
 * @swagger
 * /api/chatbox/config:
 *   get:
 *     summary: Get ChatBox by API Key
 *     description: Retrieve a ChatBox configuration using the `x-api-key` header.
 *     tags:
 *       - ChatBox
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         description: The API key associated with the ChatBox
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved ChatBox data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "665d0c0627639dc03f17f6c0"
 *                 projectId:
 *                   type: string
 *                   example: "665d0c0627639dc03f17f6bf"
 *                 websiteUrl:
 *                   type: string
 *                   example: "https://example.com"
 *                 name:
 *                   type: string
 *                   example: "My Chat Widget"
 *                 theme:
 *                   type: string
 *                   example: "#ff6600"
 *                 avatar:
 *                   type: string
 *                   example: "https://example.com/avatar.png"
 *                 apiKey:
 *                   type: string
 *                   example: "abc123-xyz456"
 *       400:
 *         description: Missing API key in header
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Missing API key or Customer key
 *       404:
 *         description: ChatBox not found with the given API key
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: ChatBox not found
 *       500:
 *         description: Server error occurred while retrieving ChatBox
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error
 */
router.get("/config", getChatBoxByAPIKey)

/**
 * @swagger
 * /api/chatbox/session:
 *   post:
 *     summary: Create a customer chat session
 *     tags: [ChatBox]
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required: [phone, fullName, websiteUrl]
 *             properties:
 *               phone:
 *                 type: string
 *               fullName:
 *                 type: string
 *               websiteUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Session created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 customerKey:
 *                   type: string
 *       403:
 *         description: Invalid API key
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */
router.post("/session", createSession)

/**
 * @swagger
 * /api/chatbox/send:
 *   post:
 *     summary: Send a message to the chatbox and get AI-generated responses
 *     description: |
 *       Sends a user message to the chatbox. Requires API key and Customer key in headers.
 *       Returns an array of AI-generated responses.
 *     tags:
 *       - ChatBox
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Hello, how can I reset my password?"
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         schema:
 *           type: string
 *         description: API key to identify the project
 *       - in: header
 *         name: x-customer-key
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier for the customer/session
 *     responses:
 *       200:
 *         description: List of AI-generated responses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   content:
 *                     type: string
 *                     example: "To reset your password, click on 'Forgot Password' at login screen."
 *                   role:
 *                     type: string
 *                     enum: [assistant]
 *                     example: assistant
 *       400:
 *         description: Missing API key or Customer key
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Missing API key or Customer key
 *       404:
 *         description: Session or message history not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Session or message history not found
 *       500:
 *         description: Server error or message limit reached
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error
 */
router.post("/send", sendMessageChatBox)

/**
 * @swagger
 * /api/chatbox/history:
 *   get:
 *     summary: Get recent chat messages
 *     tags: [ChatBox]
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: x-customer-key
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Array of chat messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 properties:
 *                   role:
 *                     type: string
 *                   content:
 *                     type: string
 *       400:
 *         description: Missing headers
 *       404:
 *         description: Session or message history not found
 *       500:
 *         description: Server error
 */
router.get("/history", getChatHistoryBox)

/**
 * @swagger
 * /api/chatbox/{projectId}:
 *   put:
 *     summary: Update a ChatBox
 *     tags: [ChatBox]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               name:
 *                 type: string
 *               theme:
 *                 type: string
 *               avatar:
 *                 type: string
 *               websiteUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated ChatBox
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatBox'
 *       404:
 *         description: ChatBox not found
 *       500:
 *         description: Server error
 */
router.put("/:projectId", updateChatbox)

/**
 * @swagger
 * /api/chatbox/{projectId}:
 *   get:
 *     summary: Get ChatBox by projectId
 *     tags: [ChatBox]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Found ChatBox
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatBox'
 *       404:
 *         description: ChatBox not found
 *       500:
 *         description: Server error
 */
router.get("/:projectId", getChatbox)

export default router;