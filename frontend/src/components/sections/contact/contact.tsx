"use client"

import { motion } from "framer-motion"
import { FadeIn, MaskReveal, StaggerChildren, StaggerItem } from "../scroll-animation"

export default function ContactInfo() {
  const contactMethods = [
    {
      title: "Email",
      value: "support@chatsell.vn",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-sweetGreen-400"
        >
          <rect width="20" height="16" x="2" y="4" rx="2"></rect>
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
        </svg>
      ),
    },
    {
      title: "Điện thoại",
      value: "+84-90-668-8013",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-sweetGreen-400"
        >
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
        </svg>
      ),
    },
    {
      title: "Địa chỉ",
      value: "123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-sweetGreen-400"
        >
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      ),
    },
  ]

  const faqs = [
    {
      question: "Tôi có thể dùng thử ChatSell miễn phí không?",
      answer:
        "Có, bạn có thể dùng thử ChatSell miễn phí trong 14 ngày mà không cần thẻ tín dụng. Đăng ký ngay để trải nghiệm đầy đủ tính năng của nền tảng.",
    },
    {
      question: "ChatSell có hỗ trợ tích hợp với các nền tảng thương mại điện tử không?",
      answer:
        "ChatSell hỗ trợ tích hợp với nhiều nền tảng thương mại điện tử phổ biến như Shopee, Lazada, Tiki và các website sử dụng WooCommerce, Magento, Shopify.",
    },
    {
      question: "Tôi cần hỗ trợ kỹ thuật, liên hệ như thế nào?",
      answer:
        "Bạn có thể liên hệ với đội ngũ hỗ trợ kỹ thuật của chúng tôi qua email support@chatsell.vn hoặc hotline (+84) 28 1234 5678. Chúng tôi sẵn sàng hỗ trợ 24/7.",
    },
  ]

  return (
    <div className="h-full flex flex-col">
      <MaskReveal direction="right" threshold={0.3}>
        <div className="bg-greenSecondary-900 rounded-2xl p-8 mb-8">
          <FadeIn direction="up" delay={0.2}>
            <h2 className="text-white text-2xl font-bold mb-6">Thông tin liên hệ</h2>
            <p className="text-white/70 mb-8">
              Đội ngũ của chúng tôi luôn sẵn sàng hỗ trợ bạn. Hãy liên hệ với chúng tôi qua các kênh sau:
            </p>
          </FadeIn>

          <StaggerChildren className="space-y-6" staggerDelay={0.1}>
            {contactMethods.map((method, index) => (
              <StaggerItem key={index}>
                <motion.div
                  className="flex items-start gap-4"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="w-10 h-10 rounded-full bg-darkGreen-900 flex items-center justify-center flex-shrink-0">
                    {method.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{method.title}</h3>
                    <p className="text-white/70">{method.value}</p>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerChildren>

          <div className="mt-10">
            <h3 className="text-white font-medium mb-4">Theo dõi chúng tôi</h3>
            <div className="flex gap-4">
              <motion.a
                href="#"
                className="w-10 h-10 rounded-full bg-darkGreen-900 flex items-center justify-center"
                whileHover={{ scale: 1.1, backgroundColor: "rgba(138, 187, 116, 0.2)" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </motion.a>
              <motion.a
                href="#"
                className="w-10 h-10 rounded-full bg-darkGreen-900 flex items-center justify-center"
                whileHover={{ scale: 1.1, backgroundColor: "rgba(138, 187, 116, 0.2)" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
              </motion.a>
              <motion.a
                href="#"
                className="w-10 h-10 rounded-full bg-darkGreen-900 flex items-center justify-center"
                whileHover={{ scale: 1.1, backgroundColor: "rgba(138, 187, 116, 0.2)" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </motion.a>
              <motion.a
                href="#"
                className="w-10 h-10 rounded-full bg-darkGreen-900 flex items-center justify-center"
                whileHover={{ scale: 1.1, backgroundColor: "rgba(138, 187, 116, 0.2)" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect width="4" height="12" x="2" y="9"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </motion.a>
            </div>
          </div>
        </div>
      </MaskReveal>

      <MaskReveal direction="right" threshold={0.3} delay={0.2}>
        <div className="bg-greenSecondary-900 rounded-2xl p-8">
          <FadeIn direction="up" delay={0.2}>
            <h2 className="text-white text-2xl font-bold mb-6">Câu hỏi thường gặp</h2>
          </FadeIn>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="border-b border-white/10 pb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index }}
              >
                <h3 className="text-white font-medium mb-2">{faq.question}</h3>
                <p className="text-white/70 text-sm">{faq.answer}</p>
              </motion.div>
            ))}
          </div>

          <motion.button
            className="mt-6 text-sweetGreen-400 flex items-center gap-2 hover:text-sweetGreen-300 transition-colors"
            whileHover={{ x: 5 }}
          >
            <span>Xem tất cả câu hỏi thường gặp</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </motion.button>
        </div>
      </MaskReveal>
    </div>
  )
}
