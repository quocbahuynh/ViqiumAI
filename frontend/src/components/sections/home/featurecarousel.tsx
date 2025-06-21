"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface Feature {
  id: number
  title: string
  message: string
  description: string
  tag1: string
  tag2: string
}

export const FeatureCarousel = () => {
  const [currentFeature, setCurrentFeature] = useState(0)

 const features: Feature[] = [
    {
      id: 1,
      title: "Tư vấn sản phẩm bằng hình ảnh",
      message:
        "Chỉ cần gửi ảnh sản phẩm, tôi sẽ tư vấn chi tiết! Đây là áo thun LUSSO nam màu đen - chất liệu thoáng mát, kiểu dáng thời trang, dễ phối đồ. Dùng mã LUSSO15 để nhận ưu đãi đặc biệt!",
      description:
        "Chatbot phân tích hình ảnh và đưa ra gợi ý sản phẩm chính xác, giúp khách hàng dễ dàng chọn lựa.",
      tag1: "Nhận diện hình ảnh",
      tag2: "Tư vấn thông minh",
    },
    {
      id: 2,
      title: "Giới thiệu sản phẩm và voucher",
      message:
        "🎉 Ưu đãi đặc biệt! Mua 2 áo thun LUSSO mua 2 áo giảm 15%, chỉ còn 195.650 VNĐ/áo. Chương trình chỉ áp dụng đến hết tuần này! Xem ngay sản phẩm nổi bật nhé!",
      description:
        "Tự động quảng bá sản phẩm hot và voucher giảm giá, thúc đẩy khách hàng mua sắm nhiều hơn.",
      tag1: "Ưu đãi hấp dẫn",
      tag2: "Tăng doanh thu",
    },
    {
      id: 3,
      title: "Tự động chốt đơn hàng",
      message:
        "Tuyệt vời! Tôi đã thêm 2 áo thun LUSSO nam màu đen vào giỏ hàng, tổng 389.300  VNĐ (đã giảm 15%). Bạn muốn thanh toán ngay hay tiếp tục mua sắm? Tôi có thể hỗ trợ giao hàng nhanh!",
      description:
        "Hỗ trợ khách hàng hoàn tất đơn hàng mượt mà, tối ưu hóa tỷ lệ chuyển đổi thành công.",
      tag1: "Chốt đơn dễ dàng",
      tag2: "Trải nghiệm mượt mà",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [features.length])

  return (
    <div className="rounded-2xl bg-greenSecondary-900 py-10 px-5 lg:px-20 h-full">
      <div className="h-[400px] w-full mb-8 relative flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={features[currentFeature].id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            <div className="rounded-2xl px-6 py-5 shadow-2xl bg-green-900/50 border border-green-300 rounded-bl-none text-white max-w-2xl mx-auto">
              <p className="text-xl md:text-2xl leading-relaxed">{features[currentFeature].message}</p>
            </div>

            <div className="mt-8 flex items-center justify-center gap-2">
              {features.map((feature, index) => (
                <button
                  key={feature.id}
                  onClick={() => setCurrentFeature(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentFeature ? "bg-green-400 scale-125" : "bg-white/30"
                  }`}
                  aria-label={`Xem ${feature.title}`}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  )
}