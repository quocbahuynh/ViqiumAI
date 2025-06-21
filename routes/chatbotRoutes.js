import express from 'express';
import { answer, deleteChatHistory, deleteKnowledgeById, getKnowledge, history } from '../controllers/chatBotController.js';
import authenticateJWT from '../middleware/auth.js';
import asyncHandler from 'express-async-handler';
const router = express.Router();

/**
 * @swagger
 * /api/chatbot/ask/{projectId}:
 *   post:
 *     summary: Trả lời câu hỏi với trí tuệ nhân tạo
 *     description: Phân loại câu hỏi có phải là lời khuyên hay không. Nếu là lời khuyên, hệ thống kiểm tra trùng ý với kiến thức cũ bằng tìm kiếm vector. Nếu không phải, trợ lý AI sẽ trả lời bình thường.
 *     tags:
 *       - ChatBot
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         description: ID của dự án để lọc dữ liệu kiến thức.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *                 example: Tôi nên thức dậy sớm mỗi ngày để tập thể dục?
 *     responses:
 *       200:
 *         description: Kết quả từ trợ lý AI.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   description: Câu trả lời từ trợ lý AI
 *                   example: Dạ, theo em lời khuyên này rất hay ạ. Em sẽ ghi nhớ!
 *       500:
 *         description: Lỗi máy chủ.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Lỗi máy chủ
 */
router.post('/ask/:projectId', authenticateJWT, asyncHandler(answer));


/**
 * @swagger
 * /api/chatbot/history/{projectId}:
 *   get:
 *     summary: Get chat history by project ID
 *     description: Returns a formatted chat history (user and assistant messages) for the given project ID using MongoDBSaver.
 *     tags:
 *       - ChatBot
 *     parameters:
 *       - in: path
 *         name: projectId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the project (thread ID)
 *     responses:
 *       200:
 *         description: Chat history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 messages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       from:
 *                         type: string
 *                         enum: [user, assistant]
 *                         description: Message sender
 *                       content:
 *                         type: string
 *                         description: Message content
 *                       id:
 *                         type: string
 *                         description: Message ID
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Lỗi máy chủ
 */
router.get('/history/:projectId', asyncHandler(history));


/**
 * @swagger
 * /api/chatbot/delete-history/{projectId}:
 *   delete:
 *     summary: Delete chat history for a specific project
 *     description: Clears the chat history associated with the given projectId from the MongoDB collection.
 *     tags:
 *       - ChatBot
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the project whose chat history will be deleted
 *         example: "1234567890abcdef12345678"
 *     responses:
 *       200:
 *         description: Chat history deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: string
 *                   example: "Xóa đoạn chat thành công!"
 *       400:
 *         description: Invalid projectId
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Invalid projectId"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Lỗi máy chủ"
 */
router.delete('/delete-history/:projectId', asyncHandler(deleteChatHistory));

/**
 * @swagger
 * /api/chatbot/knowledge/{projectId}:
 *   get:
 *     summary: Get all knowledge entries for a project
 *     tags:
 *       - ChatBot
 *     parameters:
 *       - in: path
 *         name: projectId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the project
 *     responses:
 *       200:
 *         description: A list of knowledge entries
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       content:
 *                         type: string
 *       500:
 *         description: Server error
 */
router.get('/knowledge/:projectId', asyncHandler(getKnowledge))

/**
 * @swagger
 * /api/chatbot/knowledge/{knowledgeId}:
 *   delete:
 *     summary: Delete a knowledge entry by ID
 *     tags:
 *       - ChatBot
 *     parameters:
 *       - in: path
 *         name: knowledgeId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the knowledge document
 *     responses:
 *       200:
 *         description: Successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Xóa thành công
 *       404:
 *         description: Knowledge not found
 *       500:
 *         description: Server error
 */
router.delete('/knowledge/:knowledgeId', asyncHandler(deleteKnowledgeById))

export default router;