import mongoose from "mongoose";

const PlanSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    value: { type: String, required: true },
    price: { type: Number, required: true },
    active: { type: Boolean, default: true },
    limit: {
        messages: { type: Number, default: 0 },
        personalResponse: { type: Boolean, default: false },
        advancedUpsale: { type: Boolean, default: false },
        confirmedOrder: { type: Boolean, default: false },
        integrateWebsite: { type: Boolean, default: false },
        multiplePlatform: { type: Boolean, default: false },
        reportWeekly: { type: Boolean, default: false },
        reportRealtime: { type: Boolean, default: false },
        trainingAINLP: { type: Boolean, default: false },
        livechat: { type: Boolean, default: false },
        exclusiveStrategy: { type: Boolean, default: false },
        advancedExclusiveStrategy: { type: Boolean, default: false }
    }
}, { timestamps: true });


const Plan = mongoose.model("Plan", PlanSchema);
export default Plan;
