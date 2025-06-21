import mongoose from "mongoose";

const ClassificationSchema = new mongoose.Schema({
    label: { type: String, require: true },
    aidescription: { type: String, require: true },
    value: { type: String, require: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    typeRoles: {
        type: String,
        require: true,
        enum: ["user", "system"]
    }
}, { timestamps: true });

const Classification = mongoose.model("Classification", ClassificationSchema);

export default Classification;