import Product from "../models/Product.js";
import ProductPromotion from "../models/ProductPromotion.js";
import Project from "../models/Project.js";
import User from "../models/User.js"
import { baseInformationCollection } from "../mongovector.js";

export const checkLimitMiddleWare = async (userId, projectId, type) => {
    const user = await User.findById(userId).populate('planId');
    if (!user) throw new Error('User not found');
    if (!user.planId) throw new Error('User does not have a plan assigned');

    const plan = user.planId;
    let currentCount = 0;
    let limit = 0;
    let allow = false;

    switch (type) {
        case 'messages':
            currentCount = await Project.countDocuments({ userId });
            limit = plan.limit.projectLimit;
            break;
        case 'product':
            currentCount = await Product.countDocuments({ projectId });
            limit = plan.limit.productLimit;
            break;
        case 'promotion':
            currentCount = await ProductPromotion.countDocuments({ projectId });
            limit = plan.limit.promotionLimit;
            break;
        case 'trainingMessage':
            currentCount = await baseInformationCollection.countDocuments({ projectId, category: "knowledge" });
            limit = plan.limit.trainingMessageLimit;
            break;
        default:
    }

    if (currentCount < limit) {
        allow = true;
    }
    return allow;
};
