import mongoose from "mongoose";
import Order from "../models/Order.js";
import { redisClient } from "../config/redis.js";
import FacebookFanpage from "../models/FacebookFanpage.js";
import Project from "../models/Project.js";
import MessageStatistics from "../models/MessageStatistics.js";

export const getListOfOrder = async (req, res) => {
    try {
        const { projectId } = req.params;
        const data = await Order.find(
            { projectId: new mongoose.Types.ObjectId(projectId) }
        ).sort({ createdAt: -1 }).lean();
        res.status(200).json({ message: "Thành công", data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
}

export const deleteOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        await Order.findOneAndDelete(
            { _id: new mongoose.Types.ObjectId(orderId) }
        )
        res.status(200).json({ message: "Thành công" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
}


export const updateReadOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(
            { _id: new mongoose.Types.ObjectId(orderId) }
        )
        order.isRead = true;
        order.save();
        res.status(200).json({ message: "Thành công" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
}

export const statisticNumber = async (req, res) => {
    try {
        const { projectId } = req.params;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 6);

        const result = await Order.aggregate([
            { $match: { createdAt: { $gte: startDate }, projectId: new mongoose.Types.ObjectId(projectId) } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        const orderMap = Object.fromEntries(result.map(r => [r._id, r.count]));
        const getLast7DaysData = (map) => {
            const data = [];
            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const key = d.toISOString().split("T")[0];
                data.push({ date: key, count: map[key] || 0 });
            }
            return data;
        };

        const fanpage = await Project.findById(projectId).populate("facebookFanpageId");
        const conversationMap = {};

        if (fanpage?.facebookFanpageId?.pageId) {
            const raw = await redisClient.hGetAll(`conver:${fanpage.facebookFanpageId.pageId}`);
            const conversations = Object.values(raw).map(JSON.parse);
            const now = Date.now();
            const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

            conversations
                .filter(d => {
                    const updated = new Date(d.updatedAt).getTime();
                    return updated >= sevenDaysAgo && updated <= now && d.projectId == projectId;
                })
                .forEach(d => {
                    const key = new Date(d.updatedAt).toISOString().split("T")[0];
                    conversationMap[key] = (conversationMap[key] || 0) + 1;
                });
        }

        res.json({
            orders: getLast7DaysData(orderMap),
            conversations: getLast7DaysData(conversationMap),
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server Error" });
    }
};



export const orderConversionRate = async (req, res) => {
    try {
        const { projectId } = req.params;

        const now = Date.now();
        const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
        const sevenDaysAgoDate = new Date(sevenDaysAgo);

        const fanpage = await Project.findById(projectId).populate("facebookFanpageId");

        let totalHumanRequest = 0;
        let humanRequestRate = 0;
        let aiAutomationRate = 0;

        if (!fanpage?.facebookFanpageId?.active) {
            return res.json({
                aiAutomationRate: `${0}%`,
                humanRequest: `${0}%`,
                orderRate: `${0}%`,
            });
        }

        const FANPAGE_ID = fanpage.facebookFanpageId.pageId;
        const allConversations = await redisClient.hGetAll(`conver:${FANPAGE_ID}`);

        let totalConversation = 0;

        if (Object.values(allConversations).length > 0) {
            const conversationArray = Object.values(allConversations).map(JSON.parse);

            const conversationsWithin7Days = conversationArray.filter((data) => {
                if (!data?.updatedAt || !data?.projectId) return false;
                const updated = new Date(data.updatedAt).getTime();
                return (
                    updated >= sevenDaysAgo &&
                    updated <= now &&
                    data.projectId == projectId
                );
            });

            totalConversation = conversationsWithin7Days.length;
        }

        // Count orders
        const orderResult = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: sevenDaysAgoDate },
                    projectId: new mongoose.Types.ObjectId(projectId),
                },
            },
            { $count: "totalOrders" }
        ]);
        const totalOrders = orderResult[0]?.totalOrders || 0;

        const orderRate = totalConversation === 0 ? 0 : (totalOrders / totalConversation) * 100;

        // Count human requests
        const humanResult = await MessageStatistics.aggregate([
            {
                $match: {
                    date: { $gte: sevenDaysAgoDate },
                    projectId: new mongoose.Types.ObjectId(projectId),
                },
            },
            {
                $group: {
                    _id: null,
                    totalHumanRequest: { $sum: "$stats.humanRequest" },
                },
            },
        ]);

        totalHumanRequest = humanResult[0]?.totalHumanRequest || 0;
        humanRequestRate = totalConversation === 0 ? 0 : (totalHumanRequest / totalConversation) * 100;
        aiAutomationRate = orderRate - humanRequestRate;

        return res.json({
            aiAutomationRate: `${Math.max(0, aiAutomationRate.toFixed(0))}%`,
            humanRequest: `${Math.floor(humanRequestRate)}%`,
            orderRate: `${orderRate.toFixed(0)}%`,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server Error" });
    }
};
