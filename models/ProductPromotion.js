import mongoose from "mongoose";
import Promotion from "./Promotion.js";
import Product from "./Product.js";
import { embedProductBluk, embedProductCombo, embedProductDiscount, embedProductGift, embedPromote } from "../ai/embed.js";
import { v4 as uuidv4 } from "uuid";
import { Document } from "@langchain/core/documents";
import { baseInformationVectorStore } from "../mongovector.js";

const ProductPromotionSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    name: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    promotion: { type: mongoose.Schema.Types.ObjectId, ref: "Promotion", require: true },
    productApply: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", require: true },
            promoteTarget: {
                type: Number
            },
            promoteType: {
                type: String,
                enum: ["fixed", "percent"]
            },
            promotePricing: {
                type: Number,
            },
            productGift: [
                { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            ]
        }
    ],
    vectorIds: [{ type: String }]
}, { timestamps: true });

export function transPromotionType(type) {
    if (type === "fixed") {
        return "Giảm giá theo số tiền cố định"
    } else {
        return "Giảm giá theo phần trăm %"
    }
}

export const formatCurrency = (value) => {
    return value.toLocaleString('vi-VN');
};


export function transPromotionTypeValue(type, value) {
    if (type === "fixed") {
        return "Giảm " + formatCurrency(value)
    } else {
        return "Giảm " + value + " %"
    }
}

export function formatDateToDDMMYYYY(date) {
    if (!date) return "";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
}

ProductPromotionSchema.pre('save', async function (next) {
    try {
        const promotionType = await this.populate('promotion');

        if (promotionType) {

            switch (promotionType.promotion.value) {
                case "discount-value":
                    const idsCreated = await embedProductDiscount(this);
                    this.vectorIds = idsCreated;
                    break;

                case "combo-value":
                    const idsCreatedCombo = await embedProductCombo(this);
                    this.vectorIds = idsCreatedCombo;
                    break;

                case "bluk-value":
                    const idsCreatedBluk = await embedProductBluk(this);
                    this.vectorIds = idsCreatedBluk;
                    break;

                case "gift-value":
                    const idsCreatedGift = await embedProductGift(this);
                    this.vectorIds = idsCreatedGift;
                    break;

                default:
                    next()
            }
        }
    } catch (err) {
        console.error('Embedding failed:', err);
        next(err);
    }
});


const ProductPromotion = mongoose.model("ProductPromotion", ProductPromotionSchema);
export default ProductPromotion;