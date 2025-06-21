import mongoose from "mongoose";


const ProfessionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    active: { type: Boolean, default: true }
});


const Profession = mongoose.model("Profession", ProfessionSchema);
export default Profession;
