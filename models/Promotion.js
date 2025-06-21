import mongoose from "mongoose";


const PromotionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    pathCreate: {type: String},
    value: {type: String},
    active: { type: Boolean, default: true }
});


const Promotion = mongoose.model("Promotion", PromotionSchema);
export default Promotion;
