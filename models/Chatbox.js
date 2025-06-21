import mongoose from "mongoose";

const ChatBoxSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    websiteUrl: { type: String, required: true },
    name: { type: String, required: true },
    theme: { type: String, required: true },
    avatar: { type: String, required: true },
    apiKey: { type: String, required: true },
});

const ChatBox = mongoose.model("ChatBox", ChatBoxSchema);
export default ChatBox;
