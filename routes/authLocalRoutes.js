import express from 'express';
import { forgetPassword, loginLocal, newPassword, refreshToken, registerLocal, resendCode, verifyCode } from '../controllers/authLocalController.js';

const router = express.Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in with email and password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: quochbcontact@gmail.com
 *               password:
 *                 type: string
 *                 example: 123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', loginLocal);

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh access token and refresh token using a valid refresh token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token provided during login or after a token refresh.
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxZmYwYjU4LTJlYmItNDA3Mi05NjgxLWFjNWI5MjUzZDAzYyIsImVtYWlsIjoibGVvYmFyQGdtYWlsLmNvbSIsImlhdCI6MTYxNjI2Njk3OCwiZXhwIjoxNjE2MjY3NTc4fQ.Y8jlsd7uG9fwZ0ZOGY4bQv7rtJ4oOU9M98mVpL4OHnE"
 *     responses:
 *       200:
 *         description: Successfully refreshed the access token and refresh token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: New access token
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxZmYwYjU4LTJlYmItNDA3Mi05NjgxLWFjNWI5MjUzZDAzYyIsImVtYWlsIjoibGVvYmFyQGdtYWlsLmNvbSIsImlhdCI6MTYxNjI3MTEyNiwiZXhwIjoxNjE2Mjc3NjY2fQ.qIjp41S9nP9vQJdSC2yWmfMKouTTN7pnmkRODHKY2qA"
 *                 refreshToken:
 *                   type: string
 *                   description: New refresh token
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxZmYwYjU4LTJlYmItNDA3Mi05NjgxLWFjNWI5MjUzZDAzYyIsImVtYWlsIjoibGVvYmFyQGdtYWlsLmNvbSIsImlhdCI6MTYxNjI2Njk3OCwiZXhwIjoxNjE2MjY3NTc4fQ.Y8jlsd7uG9fwZ0ZOGY4bQv7rtJ4oOU9M98mVpL4OHnE"
 *       400:
 *         description: Missing or invalid refresh token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No refresh token provided"
 *       403:
 *         description: Invalid or expired refresh token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid or expired refresh token"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */
router.post('/refresh-token', refreshToken);


/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Đăng ký tài khoản mới bằng email và mật khẩu
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - password
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Nguyễn Văn A
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: yourPassword123
 *     responses:
 *       201:
 *         description: Đăng ký thành công, mã xác thực đã được gửi qua email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Vui lòng kiểm tra email của bạn để nhận mã xác thực.
 *       400:
 *         description: Email đã tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email đã tồn tại
 *       401:
 *         description: Tài khoản tạm khóa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tài khoản tạm khóa
 *       500:
 *         description: Lỗi máy chủ hoặc lỗi gửi email xác thực
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Lỗi gửi email xác thực
 */
router.post('/register', registerLocal);

/**
 * @swagger
 * /api/auth/verify-account:
 *   post:
 *     summary: Xác thực tài khoản bằng mã xác thực được gửi qua email
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - verificationCode
 *             properties:
 *               email:
 *                 type: string
 *                 description: Địa chỉ email người dùng
 *                 example: user@example.com
 *               verificationCode:
 *                 type: string
 *                 description: Mã xác thực 6 chữ số
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Xác thực thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Xác thực thành công
 *       400:
 *         description: Mã xác thực không đúng hoặc đã hết hạn
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Mã xác thực không đúng
 *       404:
 *         description: Người dùng không tìm thấy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Người dùng không tìm thấy
 *       500:
 *         description: Lỗi máy chủ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Lỗi máy chủ
 */
router.post('/verify-account', verifyCode);

/**
 * @swagger
 * /api/auth/resend-code:
 *   post:
 *     summary: Gửi lại mã xác thực tài khoản qua email
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 description: Địa chỉ email người dùng
 *                 example: user@example.com
 *     responses:
 *       201:
 *         description: Mã xác thực đã được gửi lại thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Vui lòng kiểm tra email của bạn để nhận mã xác thực.
 *       404:
 *         description: Người dùng không tìm thấy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Người dùng không tìm thấy
 *       500:
 *         description: Lỗi gửi email hoặc lỗi máy chủ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Lỗi gửi email xác thực
 */
router.post('/resend-code', resendCode);

/**
 * @swagger
 * /api/auth/forget-password:
 *   post:
 *     summary: Gửi mã xác thực để đặt lại mật khẩu
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 description: Địa chỉ email của người dùng đã đăng ký
 *                 example: user@example.com
 *     responses:
 *       201:
 *         description: Mã xác thực đặt lại mật khẩu đã được gửi thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Vui lòng kiểm tra email của bạn để nhận mã xác thực.
 *       401:
 *         description: Tài khoản tạm khóa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tài khoản tạm khóa
 *       404:
 *         description: Người dùng không tìm thấy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Người dùng không tìm thấy
 *       500:
 *         description: Lỗi gửi email hoặc lỗi máy chủ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Lỗi gửi email xác thực
 */
router.post('/forget-password', forgetPassword);

/**
 * @swagger
 * /api/auth/verify-newpassword:
 *   post:
 *     summary: Xác thực mã và cập nhật mật khẩu mới
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - verificationCode
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               verificationCode:
 *                 type: string
 *                 example: "123456"
 *               newPassword:
 *                 type: string
 *                 example: "NewSecurePassword123"
 *     responses:
 *       200:
 *         description: Mật khẩu đã được cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cập nhật mật khẩu mới thành công
 *       400:
 *         description: Mã xác thực sai hoặc đã hết hạn
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Mã xác thực không đúng
 *       404:
 *         description: Không tìm thấy người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Người dùng không tìm thấy
 *       500:
 *         description: Lỗi máy chủ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Lỗi máy chủ
 */
router.post('/verify-newpassword', newPassword)

export default router;