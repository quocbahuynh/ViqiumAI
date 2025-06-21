import express from 'express';
import multer from 'multer';
import { uploadPhoto } from '../controllers/photoController.js';
import authenticateJWT from '../middleware/auth.js';

const router = express.Router();

// ✅ Use memoryStorage to avoid saving files to disk
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @swagger
 * /api/photo/upload:
 *   post:
 *     summary: Upload an image to BunnyCDN
 *     tags:
 *       - Upload
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload
 *     responses:
 *       200:
 *         description: Upload successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Upload successful
 *                 url:
 *                   type: string
 *                   example: https://your-zone.b-cdn.net/example.webp
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: No file uploaded
 *       500:
 *         description: Upload failed
 */
router.post('/upload', authenticateJWT, upload.single('image'), uploadPhoto);

export default router;
