import ValueClassification from "../models/ValueClassification.js";
import Classification from "../models/Classification.js";
import { colors } from "./data/color.js";

export const seedValueClassification = async () => {
    const count = await ValueClassification.countDocuments();
    if (count === 0) {
        const systemClassifications = await Classification.find({ typeRoles: "system" });
        const defaultValueClassifications = systemClassifications.map(classification => {
            switch (classification.value) {
                case "size":
                    return [
                        {
                            label: "S",
                            aidescription: "Kích thước S",
                            value: "S",
                            classificationId: classification._id,
                            typeRoles: "system"
                        },
                        {
                        
                            label: "M",
                            aidescription: "Kích thước M",
                            value: "M",
                            classificationId: classification._id,
                            typeRoles: "system"
                        },
                        {
                        
                            label: "L",
                            aidescription: "Kích thước L",
                            value: "L",
                            classificationId: classification._id,
                            typeRoles: "system"
                        },
                        {
                        
                            label: "XL",
                            aidescription: "Kích thước XL",
                            value: "XL",
                            classificationId: classification._id,
                            typeRoles: "system"
                        }
                    ];
                case "color":
                    return colors.map(([label, value, aidescription]) => ({
                        label,
                        aidescription,
                        value,
                        classificationId: classification._id,
                        typeRoles: "system"
                    }));
                case "gender":
                    return [
                        { label: "Bé trai", aidescription: "Bé trai", value: "be-trai", classificationId: classification._id, typeRoles: "system" },
                        { label: "Nữ", aidescription: "Nữ", value: "nu", classificationId: classification._id, typeRoles: "system" },
                        { label: "Bé gái", aidescription: "Bé gái", value: "be-gai", classificationId: classification._id, typeRoles: "system" },
                        { label: "Nam", aidescription: "Nam", value: "nam", classificationId: classification._id, typeRoles: "system" },
                        { label: "Unisex", aidescription: "Unisex", value: "unisex", classificationId: classification._id, typeRoles: "system" }
                    ];
                default:
                    return [];
            }
        }).flat();

        await ValueClassification.insertMany(defaultValueClassifications);
        console.log('Value classifications seeded.');
    } else {
        console.log('Value classifications already exist. No seeding needed.');
    }
};
