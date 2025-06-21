import mongoose from "mongoose";

const FacebookFanpageSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", require: true },
    pageId: { type: String, required: true, unique: true },
    fanpageName: { type: String, required: true },
    accessToken: { type: String, required: true },
    avatarUrl: { type: String },
    active: { type: Boolean, require: true, default: true },
    allowAI: { type: Boolean, require: true, default: true },
    createdAt: { type: Date, default: Date.now },
});

const FacebookFanpage = mongoose.model("FacebookFanpage", FacebookFanpageSchema);

export default FacebookFanpage;
