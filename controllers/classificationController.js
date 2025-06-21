import mongoose from "mongoose";
import Classification from "../models/Classification.js";
import ValueClassification from "../models/ValueClassification.js";


export const getRecommendClassifications = async (req, res) => {
    const { projectId } = req.params;
    try {
        const recommends = await Classification.find({
            $or: [
                { typeRoles: "system" },
                { typeRoles: "user", projectId: { $in: new mongoose.Types.ObjectId(projectId) } }
            ]
        }).select("_id label value").lean();

        res.status(200).json({
            message: "Lấy danh sách đề xuất phân loại sản phẩm thành công",
            data: recommends
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
};

export const getRecommendValueClassifications = async (req, res) => {
    const { classificationId } = req.params;
    try {
        const recommends = await ValueClassification.find({
            classificationId: new mongoose.Types.ObjectId(classificationId)
        }).select("_id label value").lean();

        res.status(200).json({
            message: "Lấy danh sách giá trị đề xuất phân loại sản phẩm thành công",
            data: recommends
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
};


