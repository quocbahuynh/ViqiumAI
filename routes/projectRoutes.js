import express from 'express';
import { connectFanpageToProject, getProjectById, createBaseProject, deleteProject, disconnectFanpageFromProject, getAiConfigByProjectId, getBaseInformation, getFanpageFacebookFromToken, getFanpageInformation, getListOfProject, updateAiConfig, updateBaseInformation, updateBaseProject } from '../controllers/projectController.js';
import authenticateJWT from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/project:
 *   post:
 *     summary: Tạo dự án cơ bản từ ngành nghề
 *     description: Tạo mới một dự án với thông tin cơ bản được lấy từ mô tả ngành nghề tương ứng.
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - professionId
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Dự án marketing online"
 *               professionId:
 *                 type: string
 *                 example: "60f1b8c9a25e4a4b6c5b7b8d"
 *     responses:
 *       200:
 *         description: Tạo dự án thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tạo dự án thành công"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     professionId:
 *                       type: string
 *                     baseInformation:
 *                       type: string
 *       401:
 *         description: Không tìm thấy người dùng hoặc ngành nghề
 *       500:
 *         description: Lỗi máy chủ
 */
router.post('/', authenticateJWT, createBaseProject);

/**
 * @swagger
 * /api/project/{projectId}:
 *   put:
 *     summary: Cập nhật thông tin dự án cơ bản
 *     description: Cập nhật tên và hình ảnh của một dự án thuộc về người dùng hiện tại.
 *     tags:
 *       - Project
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của dự án cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Dự án đã cập nhật"
 *               image:
 *                 type: string
 *                 example: "https://example.com/image.png"
 *     responses:
 *       200:
 *         description: Cập nhật dự án thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cập nhật dự án thành công"
 *                 data:
 *                   $ref: '#/components/schemas/Project'
 *       401:
 *         description: Không tìm thấy người dùng
 *       404:
 *         description: Không tìm thấy dự án
 *       500:
 *         description: Lỗi máy chủ
 */
router.put('/:projectId', authenticateJWT, updateBaseProject);

/**
 * @swagger
 * /api/project/{projectId}:
 *   delete:
 *     summary: Xóa dự án (mềm)
 *     description: Đánh dấu dự án là đã xóa (soft delete) bằng cách đặt `deleted = true`.
 *     tags:
 *       - Project
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của dự án cần xóa
 *     responses:
 *       200:
 *         description: Xóa dự án thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Xóa dự án thành công"
 *       401:
 *         description: Không tìm thấy dự án
 *       500:
 *         description: Lỗi máy chủ
 */
router.delete('/:projectId', authenticateJWT, deleteProject);

/**
 * @swagger
 * /api/project/list:
 *   get:
 *     summary: Lấy danh sách dự án của người dùng
 *     description: Trả về danh sách tất cả các dự án của người dùng đã đăng nhập (chưa bị xoá), bao gồm thông tin ngành nghề và fanpage liên kết.
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy danh sách dự án thành công
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
 *                         example: "60f8d32f5c8a3b2d9c9d7d73"
 *                       name:
 *                         type: string
 *                         example: "Dự án truyền thông"
 *                       active:
 *                         type: boolean
 *                         example: true
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       professionId:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "Marketing"
 *                       facebookFanpageId:
 *                         type: object
 *                         properties:
 *                           fanpageName:
 *                             type: string
 *                             example: "Fanpage Chính Thức"
 *                           avatarUrl:
 *                             type: string
 *                             example: "https://example.com/fanpage-avatar.jpg"
 *       401:
 *         description: Không được xác thực - người dùng chưa đăng nhập
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/list', authenticateJWT, getListOfProject);

/**
 * @swagger
 * /api/project/id/ai-config/{projectId}:
 *   get:
 *     summary: Get AI configuration of a project
 *     description: Returns only the aiConfig object of the specified project.
 *     tags:
 *       - Project
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the project to retrieve aiConfig from
 *     responses:
 *       200:
 *         description: Successfully retrieved aiConfig
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 aiConfig:
 *                   type: object
 *                   properties:
 *                     maxToken:
 *                       type: number
 *                       example: 300
 *                     communicationStyle:
 *                       type: string
 *                       example: neutral
 *       400:
 *         description: Missing or invalid project ID
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */
router.get('/id/ai-config/:projectId', authenticateJWT, getAiConfigByProjectId);

/**
 * @swagger
 * /api/project/id/ai-config/{projectId}:
 *   patch:
 *     summary: Update AI configuration for a specific project
 *     tags:
 *       - Project
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         description: ID của project cần cập nhật
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               maxToken:
 *                 type: number
 *                 enum: [300, 400, 500]
 *                 description: Số token tối đa
 *               communicationStyle:
 *                 type: string
 *                 enum: [formal, friendly, enthusiastic, neutral]
 *                 description: Phong cách giao tiếp
 *               models:
 *                 type: string
 *                 enum: [gpt-4o-mini-2024-07-18]
 *                 description: Model AI sử dụng
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       400:
 *         description: Thiếu trường dữ liệu
 *       404:
 *         description: Không tìm thấy project
 *       500:
 *         description: Lỗi server
 */
router.patch('/id/ai-config/:projectId', authenticateJWT, updateAiConfig);

/**
 * @swagger
 * /api/project/id/base-information/{projectId}:
 *   get:
 *     summary: Lấy thông tin cơ bản của doanh nghiệp
 *     tags:
 *       - Project
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của dự án
 *     responses:
 *       200:
 *         description: Lấy thông tin cơ bản thành công
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
 *                     baseInformation:
 *                       type: object
 *                       example:
 *                         title: Dự án ABC
 *                         description: Mô tả ngắn gọn về dự án
 *                         logo: https://example.com/logo.png
 *       404:
 *         description: Không tìm thấy dự án
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/id/base-information/:projectId', authenticateJWT, getBaseInformation);

router.put('/id/base-information/:projectId', authenticateJWT, updateBaseInformation);

router.post('/id/pages-list', authenticateJWT, getFanpageFacebookFromToken);
router.post('/id/:projectId/connect-fanpage', authenticateJWT, connectFanpageToProject);
router.get('/id/:projectId/fanpage', authenticateJWT, getFanpageInformation);
router.post('/id/:projectId/disconnect-fanpage', authenticateJWT, disconnectFanpageFromProject);


/**
 * @swagger
 * /api/project/id/{projectId}:
 *   get:
 *     summary: Get a project by ID
 *     tags:
 *       - Project
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the project to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved the project
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
 *                       example: "64ffb947c5f4054f5e6f8e2e"
 *                     name:
 *                       type: string
 *                       example: "My Project"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Lỗi máy chủ
 */
router.get('/id/:projectId', authenticateJWT, getProjectById);
export default router;