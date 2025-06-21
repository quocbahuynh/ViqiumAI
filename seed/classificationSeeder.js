import Classification from "../models/Classification.js";

export const seedClassification = async () => {
    const count = await Classification.countDocuments();
    if (count === 0) {
        const defaultClassifications = [
            {
                label: "Màu",
                aidescription: "Phân loại màu sắc sản phẩm",
                value: "color",
                typeRoles: "system"
            },
            {
                label: "Size",
                aidescription: "Phân loại kích thước sản phẩm",
                value: "size",
                typeRoles: "system"
            },
            {
                label: "Giới tính",
                aidescription: "Phân loại theo giới tính người dùng.",
                value: "gender",
                typeRoles: "system"
            }
        ];

        await Classification.insertMany(defaultClassifications);
        console.log('System-wide classifications seeded.');
    } else {
        console.log('Classifications already exist. No seeding needed.');
    }
};
