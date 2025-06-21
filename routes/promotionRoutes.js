import express from 'express';
import { createBlukPromotion, createComboPromotion, createDiscountPromotion, createGiftPromotion, deletePromotionById, getPromotionBlukById, getPromotionComboAndDiscountById, getPromotionGiftById, getPromotionsByProjectId, getPromotionTypes, updateBulkPromotion, updateDiscountPromotion, updateGiftPromotion } from '../controllers/promotionController.js';
import authenticateJWT from '../middleware/auth.js';

const router = express.Router();


/**
 * @swagger
 * /api/promotion/types:
 *   get:
 *     summary: Get active promotion types
 *     description: Retrieve a list of active promotion types, including their ID, name, and description.
 *     tags:
 *       - Promotion
 *     responses:
 *       200:
 *         description: Successfully retrieved promotion types
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Thành công"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "661abcd1234ef567890g"
 *                       name:
 *                         type: string
 *                         example: "Giảm giá theo phần trăm"
 *                       description:
 *                         type: string
 *                         example: "Khuyến mãi giảm giá theo phần trăm trên tổng hóa đơn"
 *                       pathCreate:
 *                         type: string
 *                         example: "Đường dẫn cho frontend"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lỗi máy chủ"
 */
router.get("/types", authenticateJWT, getPromotionTypes)

/**
 * @swagger
 * /api/promotion/list/{projectId}:
 *   get:
 *     summary: Get a list of gift promotions by projectId
 *     description: Get a list of all gift promotions related to a specific project, optionally filtered by promotionId.
 *     tags:
 *       - Promotion
 *     parameters:
 *       - name: projectId
 *         in: path
 *         required: true
 *         description: The ID of the project to get promotions for.
 *         schema:
 *           type: string
 *       - name: promotionTypeId
 *         in: query
 *         required: false
 *         description: The optional promotionId to filter by.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the promotions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Thành công"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       startTime:
 *                         type: string
 *                         format: date-time
 *                       endTime:
 *                         type: string
 *                         format: date-time
 *                       promotion:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                       productApply:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             productId:
 *                               type: object
 *                               properties:
 *                                 name:
 *                                   type: string
 *                             productGift:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   name:
 *                                     type: string
 *       404:
 *         description: No promotions found for the given projectId or promotionId
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Không tìm thấy chương trình khuyến mãi"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lỗi máy chủ"
 */
router.get("/list/:projectId", authenticateJWT, getPromotionsByProjectId);

/**
 * @swagger
 * /api/promotion/discount-promotion/{projectId}:
 *   post:
 *     summary: Create a discount promotion type
 *     description: Create a new discount promotion by providing name, startTime, endTime, promotionId, and productApply list.
 *     tags:
 *       - Promotion
 *     parameters:
 *       - name: projectId
 *         in: path
 *         required: true
 *         description: The ID of the project this product belongs to.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - startTime
 *               - endTime
 *               - promotionId
 *               - productApply
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Summer Sale 2025"
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-05-01T08:00:00Z"
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-05-31T22:00:00Z"
 *               productApply:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - promoteType
 *                     - promotePricing
 *                   properties:
 *                     productId:
 *                       type: string
 *                       example: "662abcd1234ef567890h"
 *                     promoteType:
 *                       type: string
 *                       enum: [fixed, percent]
 *                       example: "percent"
 *                     promotePricing:
 *                       type: number
 *                       example: 20
 *     responses:
 *       200:
 *         description: Promotion created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Thành công"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "662ef1234abcd567890gh"
 *                     name:
 *                       type: string
 *                       example: "Summer Sale 2025"
 *                     startTime:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-05-01T08:00:00Z"
 *                     endTime:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-05-31T22:00:00Z"
 *                     promotion:
 *                       type: string
 *                       example: "661abcd1234ef567890g"
 *                     productApply:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           product:
 *                             type: string
 *                             example: "662abcd1234ef567890h"
 *                           promoteType:
 *                             type: string
 *                             enum: [fixed, percent]
 *                             example: "percent"
 *                           promotePricing:
 *                             type: number
 *                             example: 20
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Thiếu thông tin bắt buộc"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lỗi máy chủ"
 */
router.post("/discount-promotion/:projectId", authenticateJWT, createDiscountPromotion);

/**
 * @swagger
 * /api/promotion/discount-promotion/{projectId}/{promotionId}:
 *   put:
 *     summary: Update a discount promotion
 *     description: Update an existing discount promotion by providing updated name, startTime, endTime, and productApply list.
 *     tags:
 *       - Promotion
 *     parameters:
 *       - name: projectId
 *         in: path
 *         required: true
 *         description: The ID of the project this promotion belongs to.
 *         schema:
 *           type: string
 *       - name: promotionId
 *         in: path
 *         required: true
 *         description: The ID of the promotion to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - startTime
 *               - endTime
 *               - productApply
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Summer Sale 2025"
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-05-01T08:00:00Z"
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-05-31T22:00:00Z"
 *               productApply:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - promoteType
 *                     - promotePricing
 *                   properties:
 *                     productId:
 *                       type: string
 *                       example: "662abcd1234ef567890h"
 *                     promoteType:
 *                       type: string
 *                       enum: [fixed, percent]
 *                       example: "percent"
 *                     promotePricing:
 *                       type: number
 *                       example: 20
 *     responses:
 *       200:
 *         description: Promotion updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cập nhật thành công"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "662ef1234abcd567890gh"
 *                     name:
 *                       type: string
 *                       example: "Summer Sale Updated"
 *                     startTime:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-07-01T08:00:00Z"
 *                     endTime:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-07-31T22:00:00Z"
 *                     projectId:
 *                       type: string
 *                       example: "661abcd1234ef567890g"
 *                     productApply:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           productId:
 *                             type: string
 *                             example: "662abcd1234ef567890h"
 *                           promoteType:
 *                             type: string
 *                             enum: [fixed, percent]
 *                             example: "percent"
 *                           promotePricing:
 *                             type: number
 *                             example: 20
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Thiếu thông tin bắt buộc"
 *       404:
 *         description: Promotion not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Không tìm thấy chương trình khuyến mãi"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lỗi máy chủ"
 */
router.put("/discount-promotion/:projectId/:promotionId", authenticateJWT, updateDiscountPromotion);


/**
 * @swagger
 * /api/promotion/combo-promotion/{projectId}:
 *   post:
 *     summary: Create a combo promotion type
 *     description: Create a new combo promotion by providing name, startTime, endTime, promotionId, and productApply list.
 *     tags:
 *       - Promotion
 *     parameters:
 *       - name: projectId
 *         in: path
 *         required: true
 *         description: The ID of the project this product belongs to.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - startTime
 *               - endTime
 *               - promotionId
 *               - productApply
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Summer Sale 2025"
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-05-01T08:00:00Z"
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-05-31T22:00:00Z"
 *               productApply:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - promoteType
 *                     - promotePricing
 *                   properties:
 *                     product:
 *                       type: string
 *                       example: "662abcd1234ef567890h"
 *                     promoteType:
 *                       type: string
 *                       enum: [fixed, percent]
 *                       example: "percent"
 *                     promotePricing:
 *                       type: number
 *                       example: 20
 *     responses:
 *       200:
 *         description: Promotion created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Thành công"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "662ef1234abcd567890gh"
 *                     name:
 *                       type: string
 *                       example: "Summer Sale 2025"
 *                     startTime:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-05-01T08:00:00Z"
 *                     endTime:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-05-31T22:00:00Z"
 *                     promotion:
 *                       type: string
 *                       example: "661abcd1234ef567890g"
 *                     productApply:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           productId:
 *                             type: string
 *                             example: "662abcd1234ef567890h"
 *                           promoteType:
 *                             type: string
 *                             enum: [fixed, percent]
 *                             example: "percent"
 *                           promotePricing:
 *                             type: number
 *                             example: 20
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Thiếu thông tin bắt buộc"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lỗi máy chủ"
 */
router.post("/combo-promotion/:projectId", authenticateJWT, createComboPromotion);

/**
 * @swagger
 * /api/promotion/combo-promotion/{projectId}/{promotionId}:
 *   put:
 *     summary: Update a discount promotion
 *     description: Update an existing discount promotion by providing updated name, startTime, endTime, and productApply list.
 *     tags:
 *       - Promotion
 *     parameters:
 *       - name: projectId
 *         in: path
 *         required: true
 *         description: The ID of the project this promotion belongs to.
 *         schema:
 *           type: string
 *       - name: promotionId
 *         in: path
 *         required: true
 *         description: The ID of the promotion to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - startTime
 *               - endTime
 *               - productApply
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Summer Sale 2025"
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-05-01T08:00:00Z"
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-05-31T22:00:00Z"
 *               productApply:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - promoteType
 *                     - promotePricing
 *                   properties:
 *                     productId:
 *                       type: string
 *                       example: "662abcd1234ef567890h"
 *                     promoteType:
 *                       type: string
 *                       enum: [fixed, percent]
 *                       example: "percent"
 *                     promotePricing:
 *                       type: number
 *                       example: 20
 *     responses:
 *       200:
 *         description: Promotion updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cập nhật thành công"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "662ef1234abcd567890gh"
 *                     name:
 *                       type: string
 *                       example: "Summer Sale Updated"
 *                     startTime:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-07-01T08:00:00Z"
 *                     endTime:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-07-31T22:00:00Z"
 *                     projectId:
 *                       type: string
 *                       example: "661abcd1234ef567890g"
 *                     productApply:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           productId:
 *                             type: string
 *                             example: "662abcd1234ef567890h"
 *                           promoteType:
 *                             type: string
 *                             enum: [fixed, percent]
 *                             example: "percent"
 *                           promotePricing:
 *                             type: number
 *                             example: 20
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Thiếu thông tin bắt buộc"
 *       404:
 *         description: Promotion not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Không tìm thấy chương trình khuyến mãi"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lỗi máy chủ"
 */
router.put("/combo-promotion/:projectId/:promotionId", authenticateJWT, updateDiscountPromotion);


/**
 * @swagger
 * /api/promotion/bluk-promotion/{projectId}:
 *   post:
 *     summary: Create a bulk discount promotion for a specific project
 *     description: This API endpoint allows the creation of a bulk discount promotion for a specific project identified by the `projectId`.
 *     tags:
 *       - Promotion
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         description: The unique identifier of the project to which the promotion will be applied.
 *         schema:
 *           type: string
 *           example: "60b8fddf8b5b372c14a9cb13"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Khuyến mãi mua số lượng lớn"
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-05-01T00:00:00Z"
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-06-01T00:00:00Z"
 *               productApply:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                       description: ID of the product to which the promotion will be applied
 *                       example: "60b8fddf8b5b372c14a9cb14"
 *                     promoteTarget:
 *                       type: integer
 *                       description: The target quantity of products required for the discount
 *                       example: 10
 *                     promoteType:
 *                       type: string
 *                       enum:
 *                         - percent
 *                       description: The type of promotion (currently only percent is allowed)
 *                       example: "percent"
 *                     promotePricing:
 *                       type: number
 *                       description: The percentage of discount for the promotion
 *                       example: 15
 *     responses:
 *       200:
 *         description: Successfully created the bulk discount promotion
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Thành công"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60b8fddf8b5b372c14a9cb15"
 *                     name:
 *                       type: string
 *                       example: "Khuyến mãi mua số lượng lớn"
 *                     startTime:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-05-01T00:00:00Z"
 *                     endTime:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-06-01T00:00:00Z"
 *                     promotion:
 *                       type: string
 *                       example: "60b8fddf8b5b372c14a9cb13"
 *                     productApply:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           product:
 *                             type: string
 *                             example: "60b8fddf8b5b372c14a9cb14"
 *                           promoteTarget:
 *                             type: integer
 *                             example: 10
 *                           promoteType:
 *                             type: string
 *                             example: "percent"
 *                           promotePricing:
 *                             type: number
 *                             example: 15
 *       400:
 *         description: Missing required fields or invalid productApply format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Thiếu thông tin bắt buộc hoặc thông tin sản phẩm không hợp lệ"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lỗi máy chủ"
 */
router.post("/bluk-promotion/:projectId", authenticateJWT, createBlukPromotion);

/**
 * @swagger
 * /promotion/bulk-promotion/{projectId}/{promotionId}:
 *   put:
 *     summary: Cập nhật chương trình khuyến mãi với nhiều sản phẩm
 *     tags:
 *       - Promotion
 *     parameters:
 *       - in: path
 *         name: projectId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của dự án
 *       - in: path
 *         name: promotionId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của chương trình khuyến mãi
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - startTime
 *               - endTime
 *               - productApply
 *             properties:
 *               name:
 *                 type: string
 *                 example: Khuyến mãi tháng 5
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-05-01T00:00:00.000Z
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-05-31T23:59:59.000Z
 *               productApply:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - promoteTarget
 *                     - promoteType
 *                     - promotePricing
 *                   properties:
 *                     productId:
 *                       type: string
 *                       example: 66349551fc13ae4970000001
 *                     promoteTarget:
 *                       type: number
 *                       example: 10
 *                     promoteType:
 *                       type: string
 *                       enum: [percent]
 *                       example: percent
 *                     promotePricing:
 *                       type: number
 *                       example: 15
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cập nhật thành công
 *                 data:
 *                   $ref: '#/components/schemas/ProductPromotion'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       404:
 *         description: Không tìm thấy chương trình khuyến mãi
 *       500:
 *         description: Lỗi máy chủ
 */
router.put("/bluk-promotion/:projectId/:promotionId", authenticateJWT, updateBulkPromotion);

/**
 * @swagger
 * /api/promotion/gift-promotion/{projectId}:
 *   post:
 *     summary: Create a gift promotion
 *     description: This API endpoint allows the creation of a gift promotion, where a gift is provided for purchasing a specified product.
 *     tags:
 *       - Promotion
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         description: The unique identifier of the project to which the promotion will be applied.
 *         schema:
 *           type: string
 *           example: "60b8fddf8b5b372c14a9cb13"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Khuyến mãi mua quà tặng"
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-05-01T00:00:00Z"
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-06-01T00:00:00Z"
 *               productApply:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                       description: ID of the product to which the promotion will be applied
 *                       example: "60b8fddf8b5b372c14a9cb14"
 *                     promoteTarget:
 *                       type: integer
 *                       description: The target quantity of products required for the gift
 *                       example: 5
 *                     productGift:
 *                       type: array
 *                       items:
 *                         type: string
 *                         description: ID of the product(s) to be given as gifts
 *                         example: "60b8fddf8b5b372c14a9cb15"
 *     responses:
 *       200:
 *         description: Successfully created the gift promotion
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Thành công"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60b8fddf8b5b372c14a9cb16"
 *                     name:
 *                       type: string
 *                       example: "Khuyến mãi mua quà tặng"
 *                     startTime:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-05-01T00:00:00Z"
 *                     endTime:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-06-01T00:00:00Z"
 *                     promotion:
 *                       type: string
 *                       example: "60b8fddf8b5b372c14a9cb13"
 *                     productApply:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           productId:
 *                             type: string
 *                             example: "60b8fddf8b5b372c14a9cb14"
 *                           promoteTarget:
 *                             type: integer
 *                             example: 5
 *                           productGift:
 *                             type: array
 *                             items:
 *                               type: string
 *                               example: "60b8fddf8b5b372c14a9cb15"
 *       400:
 *         description: Missing required fields or invalid productApply format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Thiếu thông tin bắt buộc hoặc thông tin sản phẩm không hợp lệ"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lỗi máy chủ"
 */
router.post("/gift-promotion/:projectId", authenticateJWT, createGiftPromotion);

/**
 * @swagger
 * /api/promotion/gift-promotion/{projectId}/{promotionId}:
 *   put:
 *     summary: Update an existing gift promotion
 *     description: Update an existing promotion by providing updated `name`, `startTime`, `endTime`, and `productApply` list with product gifts.
 *     tags:
 *       - Promotion
 *     parameters:
 *       - name: projectId
 *         in: path
 *         required: true
 *         description: The ID of the project this promotion belongs to.
 *         schema:
 *           type: string
 *       - name: promotionId
 *         in: path
 *         required: true
 *         description: The ID of the promotion to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - startTime
 *               - endTime
 *               - productApply
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Spring Gift Promotion 2025"
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-03-01T08:00:00Z"
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-03-31T22:00:00Z"
 *               productApply:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - promoteTarget
 *                     - productGift
 *                   properties:
 *                     productId:
 *                       type: string
 *                       example: "662abcd1234ef567890h"
 *                     promoteTarget:
 *                       type: number
 *                       example: 10000
 *                     productGift:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: "662abcd1234ef567890i"
 *     responses:
 *       200:
 *         description: Gift promotion updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cập nhật thành công"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "661abcd1234ef567890g"
 *                     name:
 *                       type: string
 *                       example: "Spring Gift Promotion 2025"
 *                     startTime:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-03-01T08:00:00Z"
 *                     endTime:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-03-31T22:00:00Z"
 *                     projectId:
 *                       type: string
 *                       example: "661abcd1234ef567890g"
 *                     promotion:
 *                       type: string
 *                       example: "661abcd1234ef567890g"
 *                     productApply:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           productId:
 *                             type: string
 *                             example: "662abcd1234ef567890h"
 *                           promoteTarget:
 *                             type: number
 *                             example: 10000
 *                           productGift:
 *                             type: array
 *                             items:
 *                               type: string
 *                               example: "662abcd1234ef567890i"
 *       400:
 *         description: Missing required fields or invalid product apply data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Thiếu thông tin bắt buộc"
 *       404:
 *         description: Promotion not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Không tìm thấy chương trình khuyến mãi"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lỗi máy chủ"
 */
router.put("/gift-promotion/:projectId/:promotionId", authenticateJWT, updateGiftPromotion);


/**
 * @swagger
 * /api/promotion/gift-promotion/{projectId}/{promotionId}:
 *   get:
 *     summary: Lấy thông tin chương trình khuyến mãi theo ID
 *     tags:
 *       - Promotion
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của dự án
 *       - in: path
 *         name: promotionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID chương trình khuyến mãi
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     startTime:
 *                       type: string
 *                       format: date-time
 *                     endTime:
 *                       type: string
 *                       format: date-time
 *                     promotion:
 *                       type: object
 *                       description: Thông tin chi tiết của chương trình khuyến mãi
 *                     productApply:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           productId:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                               name:
 *                                 type: string
 *                               numberOfVariants:
 *                                 type: integer
 *                               photoUrls:
 *                                 type: array
 *                                 items:
 *                                   type: string
 *                               prices:
 *                                 type: array
 *                                 items:
 *                                   type: number
 *                           productGift:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 _id:
 *                                   type: string
 *                                 name:
 *                                   type: string
 *                                 numberOfVariants:
 *                                   type: integer
 *                                 photoUrls:
 *                                   type: array
 *                                   items:
 *                                     type: string
 *                                 prices:
 *                                   type: array
 *                                   items:
 *                                     type: number
 *                           promoteTarget:
 *                             type: number
 *                           promoteType:
 *                             type: string
 *                             enum: [fixed, percent]
 *                           promotePricing:
 *                             type: number
 *       404:
 *         description: Không tìm thấy chương trình khuyến mãi
 *       500:
 *         description: Lỗi máy chủ
 */
router.get("/gift-promotion/:projectId/:promotionId", authenticateJWT, getPromotionGiftById);

/**
 * @swagger
 * /api/promotion/bluk-promotion/{projectId}/{promotionId}:
 *   get:
 *     summary: Lấy thông tin chương trình khuyến mãi theo ID
 *     tags:
 *       - Promotion
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của dự án
 *       - in: path
 *         name: promotionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID chương trình khuyến mãi
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     startTime:
 *                       type: string
 *                       format: date-time
 *                     endTime:
 *                       type: string
 *                       format: date-time
 *                     promotion:
 *                       type: object
 *                       description: Thông tin chi tiết của chương trình khuyến mãi
 *                     productApply:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           productId:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                               name:
 *                                 type: string
 *                               numberOfVariants:
 *                                 type: integer
 *                               photoUrls:
 *                                 type: array
 *                                 items:
 *                                   type: string
 *                               prices:
 *                                 type: array
 *                                 items:
 *                                   type: number
 *                           productGift:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 _id:
 *                                   type: string
 *                                 name:
 *                                   type: string
 *                                 numberOfVariants:
 *                                   type: integer
 *                                 photoUrls:
 *                                   type: array
 *                                   items:
 *                                     type: string
 *                                 prices:
 *                                   type: array
 *                                   items:
 *                                     type: number
 *                           promoteTarget:
 *                             type: number
 *                           promoteType:
 *                             type: string
 *                             enum: [fixed, percent]
 *                           promotePricing:
 *                             type: number
 *       404:
 *         description: Không tìm thấy chương trình khuyến mãi
 *       500:
 *         description: Lỗi máy chủ
 */
router.get("/bluk-promotion/:projectId/:promotionId", authenticateJWT, getPromotionBlukById);

/**
 * @swagger
 * /api/promotion/discount-and-combo-promotion/{projectId}/{promotionId}:
 *   get:
 *     summary: Lấy thông tin chương trình khuyến mãi theo ID
 *     tags:
 *       - Promotion
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của dự án
 *       - in: path
 *         name: promotionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID chương trình khuyến mãi
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     startTime:
 *                       type: string
 *                       format: date-time
 *                     endTime:
 *                       type: string
 *                       format: date-time
 *                     promotion:
 *                       type: object
 *                       description: Thông tin chi tiết của chương trình khuyến mãi
 *                     productApply:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           productId:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                               name:
 *                                 type: string
 *                               numberOfVariants:
 *                                 type: integer
 *                               photoUrls:
 *                                 type: array
 *                                 items:
 *                                   type: string
 *                               prices:
 *                                 type: array
 *                                 items:
 *                                   type: number
 *                           productGift:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 _id:
 *                                   type: string
 *                                 name:
 *                                   type: string
 *                                 numberOfVariants:
 *                                   type: integer
 *                                 photoUrls:
 *                                   type: array
 *                                   items:
 *                                     type: string
 *                                 prices:
 *                                   type: array
 *                                   items:
 *                                     type: number
 *                           promoteTarget:
 *                             type: number
 *                           promoteType:
 *                             type: string
 *                             enum: [fixed, percent]
 *                           promotePricing:
 *                             type: number
 *       404:
 *         description: Không tìm thấy chương trình khuyến mãi
 *       500:
 *         description: Lỗi máy chủ
 */
router.get("/discount-and-combo-promotion/:projectId/:promotionId", authenticateJWT, getPromotionComboAndDiscountById);

/**
 * @swagger
 * /api/promotion/{projectId}/{promotionId}:
 *   delete:
 *     summary: Delete a gift promotion
 *     description: Delete an existing promotion based on the `projectId` and `promotionId`.
 *     tags:
 *       - Promotion
 *     parameters:
 *       - name: projectId
 *         in: path
 *         required: true
 *         description: The ID of the project that the promotion belongs to.
 *         schema:
 *           type: string
 *       - name: promotionId
 *         in: path
 *         required: true
 *         description: The ID of the promotion to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Promotion successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Chương trình khuyến mãi đã được xóa thành công"
 *       404:
 *         description: Promotion not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Không tìm thấy chương trình khuyến mãi"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lỗi máy chủ"
 */
router.delete("/:projectId/:promotionId", authenticateJWT, deletePromotionById);



export default router;
