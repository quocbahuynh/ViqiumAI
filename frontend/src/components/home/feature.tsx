const features = [
  {
    title: "Tư vấn sản phẩm",
    description: "AI tự động giới thiệu sản phẩm phù hợp dựa trên nhu cầu và hành vi của khách hàng.",
    image: "/images/chatbot/text.png",
  },
  {
    title: "Tư vấn khuyến mãi",
    description: "AI tự động đề xuất khuyến mãi phù hợp với sản phẩm để tăng giá trị đơn hàng và thúc đẩy chốt sale.",
    image: "/images/chatbot/promotion.png",
  },
  {
    title: "Tư vấn bằng hình ảnh",
    description: "AI nhận diện hình ảnh khách gửi và cung cấp thông tin sản phẩm tương ứng",
    image: "/images/chatbot/Photo.png",
  },
  {
    title: "Kết nối Facebook Fanpage",
    description: "Tích hợp với Fanpage để tiếp nhận và phản hồi tin nhắn khách hàng nhanh chóng.",
    image: "/images/chatbot/Connect.png",
  },
  {
    title: "Đào tạo AI",
    description: "Trò chuyện trực tiếp để huấn luyện AI hiểu rõ sản phẩm, khách hàng và cách tư vấn phù hợp.",
    image: "/images/chatbot/Knowledge.png",
  },
  {
    title: "Thống kê đơn hàng",
    description: "Tổng hợp dữ liệu sau khi AI chốt đơn, giúp theo dõi hiệu quả và quản lý đơn hàng dễ dàng.",
    image: "/images/chatbot/Statistics.png",
  },
]

export default function Feature() {
  return (
    <section className="bg-white dark:bg-dark-300 relative pb-20 max-md:pb-16">
      <div className="container">
        <div className="text-center max-w-[800px] mx-auto mb-16 max-md:mb-12">
          <p className="section-tagline">TÍNH NĂNG NỔI BẬT</p>
          <h2 className="mb-7 max-md:mb-5 max-md:text-2xl max-sm:text-xl">
            Huấn luyện AI chuyên biệt, <br className="max-sm:hidden" /> tư vấn chuẩn xác cho khách hàng của bạn.
          </h2>
          <p className="mb-15 max-md:mb-10 max-md:text-sm">
            Dễ dàng chia sẻ ý tưởng và kiến thức với AI thông qua trò chuyện trực tiếp – giúp AI thấu hiểu khách hàng, tư vấn chính xác và nâng cao hiệu quả kinh doanh.
          </p>
        </div>
        <div className="grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 gap-8 max-md:gap-6">
          {features.map((f, i) => (
            <div key={i} className="bg-white dark:bg-dark-200 rounded-medium p-2.5 shadow-nav">
              <div className="border border-dashed rounded border-gray-100 dark:border-borderColour-dark max-lg:p-5 max-md:p-6 p-10 h-full">
                <img
                  src={f.image || "/placeholder.svg"}
                  alt="image"
                  className="inline-block dark:hidden mb-10 max-md:mb-6 rounded w-full"
                />
                <img
                  src="/images/chatbot/chatbot-feature-1-dark.png"
                  alt="image"
                  className="hidden dark:inline-block mb-10 max-md:mb-6 rounded w-full"
                />
                <h3 className="mb-2.5 leading-8 max-md:text-lg max-md:mb-2">{f.title}</h3>
                <p className="max-md:text-sm">{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
