import { transporter } from "../config/mail.js";
import { redisClient } from "../config/redis.js";
import UserPlan from "../models/UserPlan.js";
import { getUsageMsg } from "../services/profileService.js";


export const MS_PER_DAY = 24 * 60 * 60 * 1000;

export const checkMessageLimitMiddleWare = async (userId) => {
    let stat = await UserPlan.findOne({ userId })
        .populate('userId', 'fullName email createdAt') // populate user with selected fields
        .populate('planId', 'name value price limit'); // populate plan;

    const now = new Date();
    const daysSinceRegistration = Math.floor((now - stat.userId.createdAt) / MS_PER_DAY);
    const redisKey = `msg_count:${userId}:${daysSinceRegistration}`;

    // Get current count
    let currentCount = await getUsageMsg(userId, daysSinceRegistration);
    const MAX_MESSAGES_PER_DAY = stat.planId.limit.messages;
    const EMAIL = stat.userId.email;
    const FULL_NAME = stat.userId.fullName;

    if (currentCount >= MAX_MESSAGES_PER_DAY) {

        const mailOptions = {
            from: '"Viqium" <hi.viqium@gmail.com>',
            to: EMAIL,
            subject: `Bạn đã đạt giới hạn gửi tin nhắn trong ngày`,
            text: `Chào bạn ${FULL_NAME},\n\n` +
                `Hiện tại, bạn đã đạt giới hạn ${MAX_MESSAGES_PER_DAY} tin nhắn/ngày. ` +
                `Vui lòng đợi hoặc nâng cấp gói.\n\nTrân trọng,\nViqium`
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log("Email sent!");
        } catch (error) {
            console.error("Failed to send email:", error);
        }

        return {
            allowed: false,
            message: `You have reached the daily limit of ${MAX_MESSAGES_PER_DAY} messages.`,
        };
    }

    // Increment count
    await redisClient.incr(redisKey);

    // If first time, set expiry to 24 hours
    if (currentCount === 0) {
        await redisClient.expire(redisKey, 86400); // 1 day in seconds
    }

    return { allowed: true };
};

