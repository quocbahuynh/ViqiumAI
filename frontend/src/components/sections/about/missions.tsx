"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { TextReveal, MaskReveal } from "../scroll-animation"

export default function AboutMission() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.5, 1, 1, 0.5])
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.95, 1, 1, 0.95])

  return (
    <section className="bg-darkGreen-900 py-20" ref={containerRef}>
      <motion.div className="container mx-auto px-4" style={{ opacity, scale }}>
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center mb-10">
            <motion.div
              className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </motion.div>
          </div>

          <TextReveal className="font-heading text-center text-white text-3xl md:text-5xl font-semibold mb-10">
            Chúng tôi rất vui mừng khi tạo ra giải pháp chatbot bán hàng tuyệt vời này
          </TextReveal>

          <MaskReveal direction="up" threshold={0.3}>
            <div className="rounded-2xl bg-greenSecondary-900 p-8 mb-10">
              <p className="text-white text-center text-lg">
                "ChatSell đã giúp chúng tôi tăng doanh số bán hàng lên 45% chỉ trong 3 tháng đầu tiên. Khách hàng của
                chúng tôi yêu thích trải nghiệm mua sắm mượt mà và phản hồi nhanh chóng từ chatbot."
              </p>
            </div>
          </MaskReveal>

          <div className="w-px h-20 mx-auto bg-white/20 mb-6"></div>

          <div className="flex justify-center">
            <motion.div
              className="rounded-full bg-white/10 py-2 pl-2 pr-8 flex gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
            >
              <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
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
                  className="text-white"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div>
                <p className="text-white font-semibold">Nguyễn Văn Anh</p>
                <p className="text-gray-400 text-sm">Giám đốc Thương mại, TechViet</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
