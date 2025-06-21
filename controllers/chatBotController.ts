import { Request, Response } from 'express';
import { baseInformationCollection } from "../mongovector.js";
import mongoose from "mongoose";
import { redisClient } from "../config/redis.js";
import { generateChatbotAnswer } from "../services/aiService.js";

export const answer = async (req: any, res: Response) => {
    const userId = req.user.id;
    const { projectId } = req.params;
    const { question } = req.body;

    const data = await generateChatbotAnswer(userId, projectId, question);
    
    res.json({
        status: 200,
        data
    });
}

export const history = async (req: Request, res: Response) => {
    const { projectId } = req.params;
    const chatKey = `trainingChat:${projectId}`;
    const messagesRaw: any = await redisClient.lRange(chatKey, 0, -1);
    const formattedMessages = messagesRaw.map((item: string) => {
        const parsed = JSON.parse(item);
        return {
            from: parsed.role,
            content: parsed.content
        };
    });

    res.json({
        status: 200,
        messages: formattedMessages,
    });
};

export const deleteChatHistory = async (req: Request, res: Response) => {
    const { projectId } = req.params;
    await redisClient.del(`trainingChat:${projectId}`);

    res.json({
        status: 200,
        data: "Xóa đoạn chat thành công!",
    });
}

export const getKnowledge = async (req: Request, res: Response) => {
    const { projectId } = req.params;

    const knowledgeDocs = await baseInformationCollection.find({
        projectId: new mongoose.Types.ObjectId(projectId),
        category: "knowledge",
    }).project({
        content: 1,
        _id: 1
    }).toArray();

    const memories = knowledgeDocs.map(doc => {
        const content: string = doc.content || "";
        const name = content.slice(0, 15);
        return {
            _id: doc._id.toString(),
            name: `${name}...`,
            content
        };
    });
    res.status(200).json({
        status: 200,
        data: memories,
    });
}

export const deleteKnowledgeById = async (req: Request, res: Response) => {
    const { knowledgeId } = req.params;

    const result = await baseInformationCollection.deleteOne({
        _id: new mongoose.Types.ObjectId(knowledgeId),
        category: "knowledge"
    });

    if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Không tìm thấy dữ liệu" });
    }

    res.status(200).json({ message: "Xóa thành công" });
};