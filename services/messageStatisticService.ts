import { CronJob } from 'cron';
import MessageStatistics from '../models/MessageStatistics.js';
import { JsonOutputParser } from '@langchain/core/output_parsers';
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import model from '../config/generative.js';
import { formatToBaseMessages, getHistoryChat } from '../util/facebookApi.js';
import { redisClient } from '../config/redis.js';


type ConversationTopicStats = {
    product: number;        // Sản phẩm
    promotion: number;      // Khuyến mãi
    pricing: number;        // Giá cả
    shipping: number;       // Vận chuyển
    return: number;         // Đổi trả
    warranty: number;       // Bảo hành
    humanRequest: number;   // Yêu cầu trò chuyện với người thật
    complaint: number;      // Khiếu nại
    feedback: number;       // Góp ý
    others: number;         // Khác
};
const formatInstructions = `
Chỉ trả về một JSON hợp lệ. Đối tượng JSON trả về phải có dạng như sau:

{{
  product: "number",        // Số lượng hội thoại liên quan đến sản phẩm
  promotion: "number",      // Số lượng hội thoại liên quan đến khuyến mãi
  pricing: "number",        // Số lượng hội thoại liên quan đến giá cả
  shipping: "number",       // Số lượng hội thoại liên quan đến vận chuyển
  return: "number",         // Số lượng hội thoại liên quan đến đổi trả
  warranty: "number",       // Số lượng hội thoại liên quan đến bảo hành
  humanRequest: "number",   // Số lượng hội thoại yêu cầu trò chuyện với người thật
  complaint: "number",      // Số lượng hội thoại khiếu nại
  feedback: "number",       // Số lượng hội thoại góp ý
  others: "number"          // Số lượng hội thoại thuộc các chủ đề khác
}}

Giải thích:
- product: Số lượng hội thoại liên quan đến sản phẩm
- promotion: Số lượng hội thoại liên quan đến khuyến mãi
- pricing: Số lượng hội thoại liên quan đến giá cả
- shipping: Số lượng hội thoại liên quan đến vận chuyển
- return: Số lượng hội thoại liên quan đến đổi trả
- warranty: Số lượng hội thoại liên quan đến bảo hành
- humanRequest: Số lượng hội thoại yêu cầu trò chuyện với người thật
- complaint: Số lượng hội thoại khiếu nại
- feedback: Số lượng hội thoại góp ý
- others: Số lượng hội thoại thuộc các chủ đề khác
`

const analysistConversation = async (chat_history) => {
    console.log("Start AI analysistConverstation")
    const parser = new JsonOutputParser<ConversationTopicStats>();
    const prompt = await ChatPromptTemplate.fromMessages([
        [
            "system",
            "Hãy đọc tất cả các đoạn hội thoại dưới đây, phân loại theo chủ đề và báo cáo tổng hợp số lượng cho mỗi chủ đề. Bao bọc kết quả dưới dạng `json`\n{format_instructions}",
        ],
        new MessagesPlaceholder("chat_history")
    ]).partial({
        format_instructions: formatInstructions,
    });

    const chain = prompt.pipe(model).pipe(parser);
    const result = await chain.invoke({ chat_history })

    return result;
}

export const analysistConverstation = async () => {
    try {
        console.log("Start analysistConverstation")
        const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
        const now = Date.now();
        const keys = await redisClient.keys('conver:*');
        for (const key of keys) {
            const allConverstations = await redisClient.hGetAll(key);
            if (Object.values(allConverstations).length > 0) {
                const converstationArray = Object.values(allConverstations).map((item) => JSON.parse(item));

                const converstationWithiTwentyFourDays = converstationArray.filter((data) => {
                    return data && (
                        data.updatedAt ||
                        data.updatedAt > twentyFourHoursAgo ||
                        data.updatedAt < now
                    );
                });


                for (const val of converstationWithiTwentyFourDays) {
                    const data = val;

                    let CONVERSTATION_ID = data.id;
                    let FANPGE_ACESSTOKEN = data.fanpageAcessToken;
                    let FANPAGE_FB_ID = data.fanpageFBId;
                    let PROJECT_ID = data.projectId;

                    const historyArray = await getHistoryChat(CONVERSTATION_ID, FANPGE_ACESSTOKEN, 20);
                    const formatHistoryChat = formatToBaseMessages(historyArray, FANPAGE_FB_ID);

                    const result = await analysistConversation(formatHistoryChat);
                    await MessageStatistics.create({
                        projectId: PROJECT_ID,
                        stats: result,
                    })

                    console.log("Topic statistics saved successfully.")
                }
            }
        }


    } catch (error) {
        console.log(error)
    }
}

export const cronMessageStatisticJob = new CronJob('0 0 * * *', async () => {
    await analysistConverstation()
});
