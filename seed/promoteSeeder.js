import Promotion from "../models/Promotion.js";




export const seedPromote = async () => {
    const count = await Promotion.countDocuments();
    if (count === 0) {
        const defaultPromote = [
            {
                name: "Giảm giá sản phẩm",
                description: "Giảm thẳng vào giá sản phẩm, không cần điều kiện.",
                value: "discount-value",
                pathCreate: "discount/create"
            },
            {
                name: "Quà tặng khi mua hàng",
                description: "Cung cấp quà tặng miễn phí để khuyến khích khách hàng đặt thêm sản phẩm trong một đơn hàng",
                value: "gift-value",
                pathCreate: "gift/create"
            },
            {
                name: "Mua sỉ giá hời",
                description: "Tạo khuyến mãi đa tầng cho sản phẩm để tăng thêm giá trị đơn hàng",
                value: "bluk-value",
                pathCreate: "bluk/create"
            },
            {
                name: "Ưu Đãi Combo Tiết Kiệm",
                description: "Mua nhiều sản phẩm theo combo sẽ được giá ưu đãi hơn.",
                value: "combo-value",
                pathCreate: "combo/create"
            },
        ];

        await Promotion.insertMany(defaultPromote);
        console.log('Default promotes seeded.');
    } else {
        console.log('Promotes already exist. No seeding needed.');
    }
};

