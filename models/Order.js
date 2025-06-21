import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    orderCode: { type: String },
    phoneNumber: { type: String },
    address: { type: String },
    carts: { type: String },
    createdAt: { type: Date, default: Date.now },
    totalBeforePromotion: { type: String },
    totalAftterPromotion: { type: String },
    isRead: { type: Boolean, default: false },
    conversationId: { type: String, required: true },
}, { timestamps: true });

const Order = mongoose.model("Order", OrderSchema);
export default Order;
