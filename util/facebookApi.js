import axios from "axios";
import { redisClient } from "../config/redis.js";
import { getVectorEmbedPhoto } from "../ai/embedImage.js";
import ImageEmbed from "../models/ImageEmbed.js";

export const getConversationId = async (fanpageId, senderId, pageAccessToken) => {
    try {
        const response = await axios.get(`https://graph.facebook.com/v22.0/${fanpageId}/conversations`, {
            params: {
                platform: "messenger",
                user_id: senderId,
                access_token: pageAccessToken
            }
        });

        if (!response.data.data.length) {
            throw new Error("No conversation found in the last 24 hours.");
        }

        return response.data.data[0].id;
    } catch (error) {
        console.error("Error fetching conversation ID:", error.response?.data || error.message);
        return null;
    }
};

export const getHistoryChat = async (conversationId, pageAccessToken, limit) => {
    try {
        const response = await axios.get(`https://graph.facebook.com/v22.0/${conversationId}/messages`, {
            params: {
                fields: "message,from,created_time,attachments{image_data{url}}",
                access_token: pageAccessToken,
                limit
            }
        });

        return response.data.data;
    } catch (error) {
        console.error("Error fetching messages:", error.response?.data || error.message);
        return [];
    }
};

export const sendMessage = async (senderId, responseText, pageAccessToken) => {
    try {
        await axios.post(
            `https://graph.facebook.com/v22.0/me/messages?access_token=${pageAccessToken}`,
            {
                recipient: { id: senderId },
                message: { text: responseText }
            }
        );
    } catch (error) {
        console.error(error)
    }
}


/**
 * Get product info for a given image URL via vector search
 */
const getImageMetaFromVectorDB = async (url, projectId) => {
    try {
        const vectorEmbedding = await getVectorEmbedPhoto(url);

        const pipeline = [
            {
                '$vectorSearch': {
                    'index': 'vector_index',
                    'queryVector': vectorEmbedding,
                    'path': 'vector',
                    'numCandidates': 6,
                    'limit': 1,
                    'filter': {
                        '$and': [
                            { "category": { '$eq': 'product' } },
                            { "projectId": { '$eq': projectId } }
                        ]
                    }
                }
            },
            {
                "$project": {
                    "vector": 0
                }
            }
        ];

        const cursor = ImageEmbed.aggregate(pipeline);
        const results = [];
        for await (const doc of cursor) {
            results.push(doc);
        }

        if (results.length >= 1) {
            return `[URL] ${url}\n\n[ALT] Bức hình của sản phẩm có thông tin:\n${results[0].pageContent}`;
        }
    } catch (error) {
        console.error("Error during vector search:", error);
    }

    return `[URL] ${url}\n\n[ALT] Hệ thống không xác định được hình ảnh sản phẩm này`;
};

/**
 * Format chat history into OpenAI-style messages, processing image metadata
 */
export const formatToBaseMessages = async (history, fanpageId, senderId, projectId) => {
    const messages = [];

    const sortedHistory = history.sort((a, b) => new Date(a.created_time) - new Date(b.created_time));
    const redisKey = `images:${senderId}`;

    // Load any existing image metadata from Redis
    const rawImages = await redisClient.lRange(redisKey, 0, -1);
    const cachedImages = rawImages.map((item) => JSON.parse(item));

    for (const { from, message, attachments } of sortedHistory) {
        const role = from.id === fanpageId ? "assistant" : "user";

        // Image message
        if (!message && attachments?.data?.length) {
            for (const attachment of attachments.data) {
                const url = attachment?.image_data?.url;
                if (!url) continue;

                // Try to find existing image meta in Redis
                let imageMeta = cachedImages.find(data => data.url === url);

                if (imageMeta) {
                    messages.push({ role, content: imageMeta.content });
                    continue;
                }

                // If not in Redis, generate new metadata
                const metaContent = await getImageMetaFromVectorDB(url, projectId);

                const newImageData = {
                    url: url,
                    content: metaContent
                };

                // Save new meta to Redis
                await redisClient.rPush(redisKey, JSON.stringify(newImageData));

                // Add to messages
                messages.push({ role, content: metaContent });
            }

        } else {
            // Regular text message
            messages.push({ role, content: message });
        }
    }

    return messages;
};


export const subscribeWebhook = async (longLivedFanpageToken, fanpageId) => {
    await axios.post(`https://graph.facebook.com/v22.0/${fanpageId}/subscribed_apps`, null, {
        params: {
            access_token: longLivedFanpageToken,
            subscribed_fields: [
                "messages",
                "messaging_postbacks",
                "messaging_optins",
                "message_deliveries",
            ].join(',')
        }
    })
}

export const unSubscribeWebhook = async (longLivedFanpageToken, fanpageId) => {
    await axios.delete(`https://graph.facebook.com/v22.0/${fanpageId}/subscribed_apps`, {
        params: {
            access_token: longLivedFanpageToken,
        }
    })
}