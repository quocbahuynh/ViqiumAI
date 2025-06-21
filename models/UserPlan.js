import mongoose from "mongoose";

const UserPlanSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    planId: { type: mongoose.Schema.Types.ObjectId, ref: "Plan" },
    active: {
        type: Boolean,
        require: true,
        default: true,
    }
}, { timestamps: true });


const UserPlan = mongoose.model("UserPlan", UserPlanSchema);
export default UserPlan;
