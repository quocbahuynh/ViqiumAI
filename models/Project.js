import mongoose from "mongoose";
import FacebookFanpage from "./FacebookFanpage.js";
import Product from "./Product.js";
import ProductPromotion from "./ProductPromotion.js";
import { baseInformationCollection } from "../mongovector.js";
import ImageEmbed from "./ImageEmbed.js";
import Order from "./Order.js";
import Classification from "./Classification.js";
import ValueClassification from "./ValueClassification.js";

const ProjectSchema = new mongoose.Schema({
    name: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    professionId: { type: mongoose.Schema.Types.ObjectId, ref: "Profession", required: true },
    facebookFanpageId: { type: mongoose.Schema.Types.ObjectId, ref: "FacebookFanpage" },
    baseInformation: { type: String },
    image: { type: String },
    aiConfig: {
        maxToken: {
            type: Number,
            enum: [300, 400, 500],
            default: 300,
        },
        communicationStyle: {
            type: String,
            enum: ["formal", "friendly", "enthusiastic", "neutral"],
            default: "neutral"
        }
    },
    deleted: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

ProjectSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    const project = this;
    const projectId = project._id;

    try {
        await Promise.all([
            FacebookFanpage.findOneAndDelete({ projectId }),
            Product.deleteMany({ projectId }),
            ProductPromotion.deleteMany({ projectId }),
            baseInformationCollection.deleteMany({ projectId }),
            ImageEmbed.deleteMany({ projectId }),
            Order.deleteMany({ projectId }),
            Classification.deleteMany({ projectId, typeRoles: "user" }),
            ValueClassification.deleteMany({ projectId, typeRoles: "user" }),
        ]);

        next();
    } catch (error) {
        console.error('Error in pre-deleteOne hook:', error);
        next(error);
    }
});

const Project = mongoose.model("Project", ProjectSchema);

export default Project;