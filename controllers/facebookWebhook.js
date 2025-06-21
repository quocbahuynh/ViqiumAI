import { redisClient } from "../config/redis.js";
import { processMessageQueue } from "../services/chatbotService.js";

export const messengerWebhook = (req, res) => {
    const VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN;

    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
        console.log("✅ Webhook verified successfully.");
        return res.status(200).send(challenge);
    }

    console.warn("❌ Webhook verification failed.");
    return res.status(403).send("Forbidden");
};

export const handleMessage = async (req, res) => {
    const body = req.body;
    console.log(Date.now())
    console.log("📩 Incoming Webhook:", JSON.stringify(body, null, 2));

    if (body.object !== "page") {
        return res.status(404).send();
    }

    res.status(200).send("EVENT_RECEIVED");

    try {
        await Promise.all(
            body.entry.flatMap(entry =>
                (entry.messaging || []).map(async (event) => {  // <-- Thêm async ở đây

                    if (event.message?.text || Array.isArray(event.message?.attachments)) {
                        const message = {
                            senderId: event.sender?.id,
                            recipientId: event.recipient?.id,
                            content: event.message?.text,
                            timestamp: Date.now()
                        }
                        // add to redis queue
                        await redisClient.rPush(`queue:${event.sender?.id}`, JSON.stringify(message));

                        const isProcessing = await redisClient.get(`processing:${event.sender?.id}`);
                        if (!isProcessing) {
                            await redisClient.set(`processing:${event.sender?.id}`, "1");
                            await new Promise(resolve => setTimeout(resolve, 6000));
                            await processMessageQueue(event.sender?.id, event.recipient?.id, null);
                        }
                    }
                })
            )
        );
    } catch (error) {
        console.error("❌ Error handling messages:", error.message);
    }
};
