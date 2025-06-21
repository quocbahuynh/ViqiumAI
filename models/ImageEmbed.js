import mongoose from "mongoose";

const ImageEmbedSchema = new mongoose.Schema({
    vector: { type: [Number], required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "productId" },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    pageContent: { type: String },
    imageUrl: { type: String },
    category: {
        type: String,
        enum: ["baseInfo", "product", "sale"],
        required: true
    }
});

const ImageEmbed = mongoose.model("ImageEmbed", ImageEmbedSchema);
export default ImageEmbed;
