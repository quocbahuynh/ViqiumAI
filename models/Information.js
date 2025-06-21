import mongoose from "mongoose";

const BaseInformationSchema = new mongoose.Schema({
    content: { type: String, required: true },
    vector: { type: [Number], required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "productId" },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    category: {
        type: String,
        enum: ["baseInfo", "product", "sale", "knowledge"],
        required: true
    }
});

const BaseInformation = mongoose.model("BaseInformation", BaseInformationSchema);
export default BaseInformation;
