import express from 'express';
import { getRecommendClassifications, getRecommendValueClassifications } from '../controllers/classificationController.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Classification:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier for the classification
 *           example: 607f1f77bcf86cd7994f6c89
 *         label:
 *           type: string
 *           description: Name of the classification
 *           example: T-shirts
 *         aidescription:
 *           type: string
 *           description: Additional description for the classification
 *           example: This is a system classification for clothing items.
 *         value:
 *           type: string
 *           description: Value representing classification (e.g., category key)
 *           example: tshirts
 *         projectId:
 *           type: string
 *           description: The project ID associated with the classification
 *           example: 607f1f77bcf86cd7994f6c90
 *         typeRoles:
 *           type: string
 *           description: The type of role the classification represents
 *           enum: [user, system]
 *           example: system
 *       required:
 *         - name
 *         - aidescription
 *         - value
 *         - typeRoles
 * 
 *     ValueClassification:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier for the value classification
 *           example: 607f1f77bcf86cd7994f6c91
 *         label:
 *           type: string
 *           description: Name of the value classification
 *           example: Size S
 *         aidescription:
 *           type: string
 *           description: Additional description for the value classification
 *           example: Small size for T-shirts
 *         value:
 *           type: string
 *           description: Value representing the specific classification (e.g., "S")
 *           example: S
 *         classificationId:
 *           type: string
 *           description: The ID of the related classification
 *           example: 607f1f77bcf86cd7994f6c89
 *         typeRoles:
 *           type: string
 *           description: The type of role the value classification represents
 *           enum: [user, system]
 *           example: system
 *       required:
 *         - label
 *         - aidescription
 *         - value
 *         - classificationId
 *         - typeRoles
 */


/**
 * @swagger
 * /api/classification/recommend/{projectId}:
 *   get:
 *     summary: Lấy danh sách đề xuất phân loại sản phẩm
 *     tags: [Classification]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         description: ID của project để lọc các phân loại người dùng
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Danh sách phân loại trả về thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Classification'
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/recommend/:projectId', getRecommendClassifications);





/**
 * @swagger
 * /api/classification/value-recommend/{classificationId}:
 *   get:
 *     summary: Lấy giá trị danh sách đề xuất phân loại sản phẩm
 *     tags: [Classification]
 *     parameters:
 *       - in: path
 *         name: classificationId
 *         required: true
 *         description: ID của Classification để lọc giá trị phân loại người dùng
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Danh sách giá trị phân loại trả về thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ValueClassification'
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/value-recommend/:classificationId', getRecommendValueClassifications);




export default router;