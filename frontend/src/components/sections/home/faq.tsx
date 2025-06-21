"use client"

import { useState, useEffect, useRef } from "react"
import { Plus, Minus } from "lucide-react"
import { StaggerChildren, StaggerItem, TextReveal, useScrollInView } from "../scroll-animation"
import { motion, useScroll, useTransform } from "framer-motion"

export default function Faq() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.5, 1, 1, 0.5])
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.95, 1, 1, 0.95])

  const faqs = [
    {
      question: "Chatbot ChatSell hoạt động như thế nào?",
      answer:
        "ChatSell sử dụng AI để tạo chatbot trò chuyện cho Messenger. Nền tảng giúp chatbot tư vấn sản phẩm bằng hình ảnh, giới thiệu voucher, chốt đơn hàng tự động và hỗ trợ 24/7.",
    },
    {
      question: "Tôi có cần kỹ năng lập trình để tạo chatbot không?",
      answer:
        "Không cần! ChatSell cung cấp giao diện kéo-thả thân thiện, không yêu cầu kỹ năng lập trình. Bạn có thể tạo chatbot chuyên nghiệp chỉ trong vài phút.",
    },
    {
      question: "Làm thế nào để kết nối chatbot với trang Facebook của tôi?",
      answer:
        "Rất đơn giản! Đăng nhập bằng tài khoản Facebook, chọn trang bạn muốn kết nối và cấp quyền cho ChatSell. Hệ thống sẽ tự động thực hiện tích hợp.",
    },
    {
      question: "Tôi có thể tùy chỉnh phản hồi của chatbot không?",
      answer:
        "Có! Bạn có thể kiểm soát hoàn toàn tính cách, phản hồi và luồng trò chuyện của chatbot. Tùy chỉnh tin nhắn cho tư vấn sản phẩm, voucher và chốt đơn theo ý muốn.",
    },
    {
      question: "Làm thế nào để huấn luyện AI quản lý sản phẩm?",
      answer:
        "Cung cấp dữ liệu sản phẩm cho AI qua giao diện ChatSell. AI sẽ quản lý danh mục, tư vấn dựa trên hình ảnh và cập nhật thông tin theo thời gian thực.",
    },
    {
      question: "Tôi có thể thêm voucher giảm giá như thế nào?",
      answer:
        "Dễ dàng thêm voucher giảm giá trong bảng điều khiển ChatSell. AI sẽ tự động áp dụng mã giảm giá phù hợp dựa trên hành vi khách hàng.",
    },
    {
      question: "Làm thế nào để huấn luyện AI qua chat?",
      answer:
        "Bạn có thể trò chuyện trực tiếp với AI để đào tạo nó, giúp hiểu rõ hơn về sản phẩm và nhu cầu khách hàng của bạn.",
    },
    {
      question: "Làm thế nào để quản lý đơn hàng từ AI?",
      answer:
        "Theo dõi và xử lý đơn hàng đã chốt qua bảng điều khiển ChatSell. Nhận báo cáo chi tiết và hỗ trợ giao hàng hiệu quả.",
    },
    {
      question: "Chi phí sử dụng như thế nào?",
      answer:
        "Chúng tôi cung cấp các gói giá linh hoạt dựa trên nhu cầu. Tất cả gói bao gồm dùng thử miễn phí 14 ngày, không cần thẻ tín dụng. Sau đó, chọn gói Cơ bản, Nâng cao hoặc Doanh nghiệp với thanh toán hàng tháng hoặc hàng năm.",
    },
  ]

  return (
    <section className="bg-darkGreen-900 py-20" id="faq" ref={containerRef}>
      <motion.div className="container mx-auto px-4" style={{ opacity, scale }}>
        <TextReveal className="font-heading text-white text-4xl text-center font-semibold mb-20">
          Câu hỏi thường gặp
        </TextReveal>

        <div className="max-w-3xl mx-auto">
          <StaggerChildren staggerDelay={0.1}>
            {faqs.map((faq, index) => (
              <StaggerItem key={index}>
                <FaqItem question={faq.question} answer={faq.answer} index={index} />
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </motion.div>
    </section>
  )
}

function FaqItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false)
  const { ref: scrollRef, isInView } = useScrollInView(0.1, false)
  const buttonRef = useRef<HTMLButtonElement>(null) // Ref cho motion.button

  return (
    <div ref={scrollRef}>
      <motion.button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 border-t border-b border-white/10"
        whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
        layout
      >
        <div className="flex items-center gap-2">
          <motion.div className={isOpen ? "hidden" : ""} animate={{ rotate: isOpen ? 90 : 0 }}>
            <Plus size={20} className="text-sweetGreen-400" />
          </motion.div>
          <motion.div className={!isOpen ? "hidden" : ""} initial={{ rotate: -90 }} animate={{ rotate: 0 }}>
            <Minus size={20} className="text-sweetGreen-400" />
          </motion.div>
          <p className="text-white text-lg font-semibold text-left">{question}</p>
        </div>
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: isOpen ? "auto" : 0 }}
          className="overflow-hidden"
          transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
        >
          <p className="text-white text-lg text-left mt-5">{answer}</p>
        </motion.div>
      </motion.button>
    </div>
  )
}