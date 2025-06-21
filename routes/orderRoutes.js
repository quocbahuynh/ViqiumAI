import express from 'express';
import authenticateJWT from '../middleware/auth.js';
import { deleteOrderById, getListOfOrder, statisticNumber, updateReadOrderById } from '../controllers/orderController.js';

const router = express.Router();

/**
 * @swagger
 * /api/order/list/{projectId}:
 *   get:
 *     summary: Get a list of orders for a specific project
 *     tags:
 *       - Order
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         description: ID of the project
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of orders successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Thành công
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "662d1b4a8d1a5c001f2b1234"
 *                       projectId:
 *                         type: string
 *                         example: "662d1b2c8d1a5c001f2b5678"
 *                       orderCode:
 *                         type: string
 *                         example: "ORD123456"
 *                       phoneNumber:
 *                         type: string
 *                         example: "0909123456"
 *                       address:
 *                         type: string
 *                         example: "123 Lê Lợi, Quận 1, TP.HCM"
 *                       carts:
 *                         type: string
 *                         example: 'Áo thun Unisex Size L Màu Đỏ Giá 300k'
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-08-01T10:30:00.000Z"
 *                       totalBeforePromotion:
 *                         type: string
 *                         example: "1000000"
 *                       totalAftterPromotion:
 *                         type: string
 *                         example: "900000"
 *                       isRead:
 *                         type: boolean
 *                         example: false
 *       500:
 *         description: Server error
 */
router.get("/list/:projectId", authenticateJWT, getListOfOrder)

/**
 * @swagger
 * /api/order/read/{orderId}:
 *   put:
 *     summary: Mark an order as read
 *     tags:
 *       - Order
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the order to mark as read
 *     responses:
 *       200:
 *         description: Successfully marked as read
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Thành công
 *       500:
 *         description: Server error
 */
router.put("/read/:orderId", authenticateJWT, updateReadOrderById)

/**
 * @swagger
 * /api/order/delete/{orderId}:
 *   delete:
 *     summary: Delete an order by ID
 *     tags:
 *       - Order
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the order to delete
 *     responses:
 *       200:
 *         description: Successfully deleted order
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Thành công
 *       500:
 *         description: Server error
 */
router.delete("/delete/:orderId", authenticateJWT, deleteOrderById)
export default router;