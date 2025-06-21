import mongoose from "mongoose";
import ChatBox from "../models/Chatbox.js";
import { v4 as uuidv4 } from 'uuid';
import { redisClient } from "../config/redis.js";
import { processQuestionByAI } from "../services/chatbotService.js";
import { checkMessageLimitMiddleWare } from "../middleware/messagesLimit.js";

export const getChatbox = async (req, res) => {
    try {
        const { projectId } = req.params;

        const chatBox = await ChatBox.findOne({
            projectId: new mongoose.Types.ObjectId(projectId)
        })

        if (!chatBox) {
            return res.status(404).json({ message: "ChatBox not found" });
        }

        const resData = {
            name: chatBox.name,
            theme: {
                primaryColor: chatBox.theme,
            },
            websiteUrl: chatBox.websiteUrl,
            apiKey: chatBox.apiKey,
            avatar: chatBox.avatar,
            welcomeMessage: "Xin chào! 👋",
        }
        res.status(200).json(resData);
    } catch (error) {
        console.error("Error updating chatbox:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const updateChatbox = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { name, theme, avatar, websiteUrl } = req.body;

        if (!projectId || !name || !theme || !avatar || !websiteUrl) {
            return res.status(400).json({ message: "All fields are required" });
        }

        let chatBox = await ChatBox.findOne({ projectId });

        // If not found, create new
        if (!chatBox) {
            const apiKey = uuidv4();
            const primaryColor = theme.primaryColor;

            const newChatBox = new ChatBox({
                projectId,
                name,
                theme: primaryColor,
                avatar,
                apiKey,
                websiteUrl
            });

            const savedChatBox = await newChatBox.save();
            return res.status(200).json(savedChatBox);
        }

        // If found, update
        chatBox.name = name;
        chatBox.theme = theme.primaryColor;
        chatBox.avatar = avatar;
        chatBox.websiteUrl = websiteUrl;

        const updatedChatBox = await chatBox.save();
        return res.status(200).json(updatedChatBox);
    } catch (error) {
        console.error("Error updating chatbox:", error);
        res.status(500).json({ message: "Server error" });
    }
};


export const getChatBoxByAPIKey = async (req, res) => {
    try {
        const apiKey = req.headers["x-api-key"];

        const chatBox = await ChatBox.findOne({
            apiKey
        })

        if (!chatBox) {
            return res.status(404).json({ message: "ChatBox not found" });
        }


        res.status(200).json(chatBox);
    } catch (error) {
        console.error("Error updating chatbox:", error);
        res.status(500).json({ message: "Server error" });
    }
}


export const createSession = async (req, res) => {
    try {
        const { phone, fullName, websiteUrl } = req.body;
        const apiKey = req.headers["x-api-key"];

        if (!phone || !fullName || !websiteUrl) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const chatBox = await ChatBox.findOne({ apiKey });
        if (!chatBox) {
            return res.status(403).json({ message: "Invalid API key" });
        }
        const customerKey = uuidv4();
        const redisKey = `chatBoxSession:${apiKey}:${customerKey}`;
        const customerData = {
            phone,
            name: fullName,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            customerKey,
            apiKey,
        };

        await redisClient.set(redisKey, JSON.stringify(customerData), {
            EX: 259200,
        });

        const messageListKey = `chatBoxMessages:${customerKey}:${apiKey}`;

        const message = {
            role: "system",
            content: ""
        };
        await redisClient.rPush(messageListKey, JSON.stringify(message));
        await redisClient.expire(messageListKey, 259200)
        return res.status(200).json({ message: "Tạo cuộc trò chuyện thành công!", customerKey });

    } catch (error) {
        console.error("Error create Session chatbox:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

const getHistory = async (apiKey, customerKey) => {
    try {
        const redisSessionKey = `chatBoxSession:${apiKey}:${customerKey}`;
        const redisMessagesKey = `chatBoxMessages:${customerKey}:${apiKey}`;

        const [sessionStr, messageListExists] = await Promise.all([
            redisClient.get(redisSessionKey),
            redisClient.exists(redisMessagesKey)
        ]);

        if (!sessionStr || !messageListExists) {
            return res.status(404).json({ message: "Session or message history not found" });
        }

        const messagesRaw = await redisClient.lRange(redisMessagesKey, -30, -1);
        const messages = messagesRaw.map(msg => {
            try {
                return JSON.parse(msg);
            } catch {
                return null;
            }
        }).filter(Boolean);

        return messages
    } catch (error) {
        console.error(error)
        return [];
    }
}

export const sendMessageChatBox = async (req, res) => {
    try {
        const apiKey = req.headers["x-api-key"];
        const customerKey = req.headers["x-customer-key"];
        const { content } = req.body;

        if (!apiKey || !customerKey) {
            return res.status(400).json({ message: "Missing API key or Customer key" });
        }

        const redisSessionKey = `chatBoxSession:${apiKey}:${customerKey}`;
        const redisMessagesKey = `chatBoxMessages:${customerKey}:${apiKey}`;


        const [sessionStr, messageListExists, fanpage] = await Promise.all([
            redisClient.get(redisSessionKey),
            redisClient.exists(redisMessagesKey),
            ChatBox.findOne({
                apiKey
            }).populate({
                path: "projectId",
                populate: {
                    path: "userId"
                }
            }),
        ]);

        if (!sessionStr || !messageListExists || !fanpage) {
            return res.status(404).json({ message: "Session or message history not found" });
        }

        const message = {
            role: "user",
            content
        };

        await redisClient.rPush(redisMessagesKey, JSON.stringify(message));


        const history = await getHistory(apiKey, customerKey);
        const PROJECT_ID = fanpage.projectId._id;
        const EMAIL = fanpage.projectId.userId.email;
        const USER_ID = fanpage.projectId.userId._id;

        const reachLimit = await checkMessageLimitMiddleWare(USER_ID);

        if (!reachLimit.allowed) {
            return res.status(500).json({ message: "Reached limit" });
        }

        const answers = await processQuestionByAI(history, PROJECT_ID, redisSessionKey, EMAIL);

        const responses = [];

        for (const msg of answers) {
            await redisClient.rPush(redisMessagesKey, JSON.stringify({
                content: msg.content,
                role: "assistant",
            }));

            responses.push({
                content: msg.content,
                role: "assistant",
            });
        }
        await redisClient.expire(redisMessagesKey, 259200)
        res.status(200).json(responses);
    } catch (error) {
        console.error("Error sending message chatbox:", error);
        res.status(500).json({ message: "Server error" });
    }
}


export const getChatHistoryBox = async (req, res) => {
    try {
        const apiKey = req.headers["x-api-key"];
        const customerKey = req.headers["x-customer-key"];

        if (!apiKey || !customerKey) {
            return res.status(400).json({ message: "Missing API key or Customer key" });
        }

        const redisSessionKey = `chatBoxSession:${apiKey}:${customerKey}`;
        const redisMessagesKey = `chatBoxMessages:${customerKey}:${apiKey}`;

        const [sessionStr, messageListExists] = await Promise.all([
            redisClient.get(redisSessionKey),
            redisClient.exists(redisMessagesKey)
        ]);

        if (!sessionStr || !messageListExists) {
            return res.status(404).json({ message: "Session or message history not found" });
        }

        const messagesRaw = await redisClient.lRange(redisMessagesKey, -30, -1);
        const messages = messagesRaw.map(msg => {
            try {
                return JSON.parse(msg);
            } catch {
                return null;
            }
        }).filter(Boolean); // Remove any malformed entries

        return res.status(200).json(messages);
    } catch (error) {
        console.error("Error retrieving chat history:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
