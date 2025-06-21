import Profession from "../models/Profession.js";



export const seedProfessions = async () => {
    const count = await Profession.countDocuments();
    if (count === 0) {
        const defaultProfessions = [
            {
                name: 'Thời trang',
                description: "<b>[Tên thương hiệu thời trang]</b> được thành lập vào năm <b>[năm thành lập]</b>, chuyên cung cấp các sản phẩm thời trang <b>[đối tượng khách hàng]</b> mang phong cách <b>[phong cách thời trang – ví dụ: tối giản, năng động, cá tính, sang trọng,...]</b>. Với trụ sở chính đặt tại <b>[địa điểm]</b>, <b>[Tên thương hiệu]</b> hướng đến đối tượng khách hàng là <b>[miêu tả khách hàng mục tiêu – độ tuổi, giới tính, gu thời trang,...]</b>.<br><br>Các sản phẩm của <b>[Tên thương hiệu]</b> bao gồm: <b>[liệt kê danh mục sản phẩm chính – ví dụ: đầm, áo sơ mi, quần jeans, túi xách, phụ kiện,...]</b>. Sản phẩm <b>[nguồn gốc – ví dụ: được thiết kế độc quyền và sản xuất nội địa / được chọn lọc và nhập khẩu từ các thương hiệu uy tín,...]</b>, đảm bảo <b>[chất lượng – ví dụ: chất liệu cao cấp, form dáng chuẩn, phù hợp thời tiết Việt Nam,...]</b>.<br><br>Hiện tại, thương hiệu chủ yếu kinh doanh qua <b>[các kênh đang bán – ví dụ: Facebook, Instagram, TikTok, Shopee,...]</b>, đồng thời đang phát triển thêm các kênh như <b>[nếu có – ví dụ: website thương mại điện tử, cửa hàng offline,...]</b>. <b>[Tên thương hiệu]</b> luôn chú trọng đến trải nghiệm mua sắm của khách hàng, từ hình ảnh sản phẩm cho đến khâu đóng gói và chăm sóc sau bán hàng.<br><br>Mục tiêu trong <b>[thời gian – ví dụ: 3 tháng / 6 tháng / 1 năm]</b> tới là <b>[mục tiêu – ví dụ: xây dựng website chuyên nghiệp, mở rộng thị trường, đẩy mạnh quảng cáo, ra mắt BST mới,...]</b> nhằm khẳng định vị thế thương hiệu trong phân khúc thời trang <b>[phân khúc – ví dụ: nữ văn phòng, tuổi teen, unisex cao cấp,...]</b>.<br>"
            }
        ];

        await Profession.insertMany(defaultProfessions);
        console.log('Default professions seeded.');
    } else {
        console.log('Professions already exist. No seeding needed.');
    }
};

