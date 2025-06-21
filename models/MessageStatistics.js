//MessageStatistics.js

import mongoose from "mongoose";

const MessageStatisticsSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    date: { type: Date, default: Date.now },
    stats: {
        product: { type: Number },          // Sản phẩm
        promotion: { type: Number },        // Khuyến mãi
        pricing: { type: Number },          // Giá cả
        shipping: { type: Number },         // Vận chuyển (you forgot this in your list)
        return: { type: Number },           // Đổi trả
        warranty: { type: Number },         // Bảo hành
        humanRequest: { type: Number },     // Yêu cầu trò chuyện với người thật
        complaint: { type: Number },        // Khiếu nại
        feedback: { type: Number },         // Góp ý
        others: { type: Number },           // Khác
    },
});

const MessageStatistics = mongoose.model("MessageStatistic", MessageStatisticsSchema);
export default MessageStatistics;
