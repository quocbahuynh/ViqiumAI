import mongoose from "mongoose";

const ValueClassificationSchema = new mongoose.Schema({
    label: { type: String, require: true },
    aidescription: { type: String, require: true },
    value: { type: String, require: true },
    classificationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Classification', require: true },
    typeRoles: {
        type: String,
        require: true,
        enum: ["user", "system"]
    }
},{ timestamps: true});

const ValueClassification = mongoose.model("ValueClassification", ValueClassificationSchema);

export default ValueClassification;