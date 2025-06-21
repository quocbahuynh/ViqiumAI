import express from 'express';
import { getListOfProfessional } from '../controllers/professionController.js';
import { orderConversionRate, statisticNumber } from '../controllers/orderController.js';
import authenticateJWT from '../middleware/auth.js';
import MessageStatistics from '../models/MessageStatistics.js';
import { analysistConverstation } from '../services/messageStatisticService.js';

const router = express.Router();

/**
 * @swagger
 * /api/statistic/last-7-days/{projectId}:
 *   get:
 *     summary: Get number of orders for the last 7 days for a specific project/shop
 *     tags:
 *       - Statistic
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         description: The ID of the project/shop to get orders statistics for
 *         schema:
 *           type: string
 *           example: 60d21b4667d0d8992e610c85
 *     responses:
 *       200:
 *         description: A list of objects with date and number of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   date:
 *                     type: string
 *                     format: date
 *                     example: "2025-05-14"
 *                   count:
 *                     type: integer
 *                     example: 10
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Server Error
 */
router.get("/last-7-days/:projectId",  statisticNumber)

/**
 * @swagger
 * /api/statistic/order-rate/{projectId}:
 *   get:
 *     summary: Get order conversion rate based on Facebook conversations.
 *     description: Returns the conversion rate of FacebookFanpageConverstations that resulted in an order for a specific project.
 *     tags:
 *       - Statistic
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the project to calculate conversion rate for.
 *     responses:
 *       200:
 *         description: Conversion rate statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalConversations:
 *                   type: integer
 *                   example: 10
 *                 conversionCount:
 *                   type: integer
 *                   example: 3
 *                 conversionRate:
 *                   type: string
 *                   example: "30.00%"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Server Error
 */
router.get("/order-rate/:projectId", orderConversionRate)


/**
 * @swagger
 * /api/statistic/topics/{projectId}:
 *   get:
 *     summary: Lấy thống kê chủ đề mới nhất của tin nhắn cho một dự án
 *     description: Trả về thống kê các chủ đề hội thoại (product, promotion, pricing, shipping, v.v.) của dự án theo ID.
 *     tags:
 *       - Statistic
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của dự án
 *     responses:
 *       200:
 *         description: Thống kê chủ đề thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 product:
 *                   type: number
 *                 promotion:
 *                   type: number
 *                 pricing:
 *                   type: number
 *                 shipping:
 *                   type: number
 *                 return:
 *                   type: number
 *                 warranty:
 *                   type: number
 *                 humanRequest:
 *                   type: number
 *                 complaint:
 *                   type: number
 *                 feedback:
 *                   type: number
 *                 others:
 *                   type: number
 *       404:
 *         description: Không tìm thấy thống kê cho dự án này
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.get("/topics/:projectId", async (req, res) => {
    const latestStat = await MessageStatistics.findOne({ projectId: req.params.projectId })
        .sort({ date: -1 }) // get latest
    res.json(latestStat?.stats || {})
})

export default router;