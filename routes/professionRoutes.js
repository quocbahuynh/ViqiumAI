import express from 'express';
import { getListOfProfessional } from '../controllers/professionController.js';

const router = express.Router();

/**
 * @swagger
 * /api/profession/professions:
 *   get:
 *     summary: Lấy danh sách ngành nghề
 *     description: Danh sách ngành nghề để tạo dự án
 *     tags:
 *       - Project
 *     responses:
 *       200:
 *         description: Lấy danh sách ngành nghề thành công.
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
 *                         description: ID của ngành nghề.
 *                         example: "643a0d83f38e4b001faabcde"
 *                       name:
 *                         type: string
 *                         description: Tên ngành nghề.
 *                         example: "Lập trình viên Web"
 *       500:
 *         description: Lỗi máy chủ - Có lỗi xảy ra khi lấy dữ liệu ngành nghề.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Lỗi máy chủ
 */
router.get('/professions', getListOfProfessional);
export default router;