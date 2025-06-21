"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { FadeIn, ScrollCounter } from "../scroll-animation"
import { Group, MessageCircle, MessageCircleCode, User } from "lucide-react"
import { TransformIcon } from "@radix-ui/react-icons"

export default function AboutStats() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.5, 1, 1, 0.5])
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.95, 1, 1, 0.95])

  return (
    <section className="bg-darkGreen-900 pt-32 pb-40" ref={containerRef}>
      <motion.div className="container mx-auto px-4" style={{ opacity, scale }}>
        <div className="flex flex-wrap -m-4 mb-56">
          <div className="w-full lg:w-1/2 p-4">
            <FadeIn direction="up" delay={0.2}>
              <p className="text-white text-xl font-medium mb-10">Đối tác của chúng tôi</p>
              <div className="flex flex-wrap gap-8 mb-10">
                <motion.div
                  className="h-12 bg-white/10 rounded-lg px-6 py-3"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                >
                   <p className="text-white font-semibold">Shopee</p>
                </motion.div>
                <motion.div
                  className="h-12 bg-white/10 rounded-lg px-6 py-3"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                >
                  <p className="text-white font-semibold">Lazada</p>
                </motion.div>
                <motion.div
                  className="h-12 bg-white/10 rounded-lg px-6 py-3"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                >
                  <p className="text-white font-semibold">Tiki</p>
                </motion.div>
              </div>
              <div className="flex flex-wrap gap-8">
                <motion.div
                  className="h-12 bg-white/10 rounded-lg px-6 py-3"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                >
                  <p className="text-white font-semibold">Facebook</p>
                </motion.div>
                <motion.div
                  className="h-12 bg-white/10 rounded-lg px-6 py-3"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                >
                  <p className="text-white font-semibold">Instagram</p>
                </motion.div>
                <motion.div
                  className="h-12 bg-white/10 rounded-lg px-6 py-3"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                >
                  <p className="text-white font-semibold">TikTok</p>
                </motion.div>
              </div>
            </FadeIn>
          </div>
          <div className="w-full lg:w-1/2 p-4">
            <FadeIn direction="up" delay={0.4}>
              <p className="text-xl text-white max-w-3xl">
                <span>ChatSell không chỉ là một phần mềm; </span>
                <span className="text-white text-opacity-50">
                  đó là kết quả của nhiều năm nghiên cứu và nỗ lực để cách mạng hóa cách doanh nghiệp quản lý việc bán
                  hàng trực tuyến. Được xây dựng trên nền tảng của hiệu quả, chính xác và hợp tác, ChatSell thiết lập
                  một tiêu chuẩn mới cho giải pháp chatbot bán hàng, giúp doanh nghiệp điều hướng cảnh quan kinh doanh
                  trực tuyến một cách dễ dàng và tự tin.
                </span>
              </p>
            </FadeIn>
          </div>
        </div>

        <div className="flex flex-wrap -m-4 mb-20">
          <div className="w-full md:w-1/3 p-4">
            <FadeIn direction="up" delay={0.2}>
              <div className="bg-greenSecondary-900 rounded-2xl p-8 h-full">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                    <User
                      color="white"
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                  </div>
                </div>
                <h3 className="text-white text-center text-2xl font-bold mb-2">
                  <ScrollCounter
                    start={0}
                    end={5000}
                    suffix="+"
                    className="text-white text-center text-2xl font-bold"
                  />
                </h3>
                <p className="text-white/70 text-center">Khách hàng hài lòng</p>
              </div>
            </FadeIn>
          </div>
          <div className="w-full md:w-1/3 p-4">
            <FadeIn direction="up" delay={0.3}>
              <div className="bg-greenSecondary-900 rounded-2xl p-8 h-full">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                    <MessageCircle
                      color="white"

                      width={32}
                      height={32}
                      className="object-contain"
                    />
                  </div>
                </div>
                <h3 className="text-white text-center text-2xl font-bold mb-2">
                  <ScrollCounter
                    start={0}
                    end={1000000}
                    suffix="+"
                    className="text-white text-center text-2xl font-bold"
                  />
                </h3>
                <p className="text-white/70 text-center">Tin nhắn được xử lý mỗi ngày</p>
              </div>
            </FadeIn>
          </div>
          <div className="w-full md:w-1/3 p-4">
            <FadeIn direction="up" delay={0.4}>
              <div className="bg-greenSecondary-900 rounded-2xl p-8 h-full">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                    <TransformIcon
                                          color="white"

                      width={32}
                      height={32}
                      className="object-contain"
                    />
                  </div>
                </div>
                <h3 className="text-white text-center text-2xl font-bold mb-2">
                  <ScrollCounter start={0} end={98} suffix="%" className="text-white text-center text-2xl font-bold" />
                </h3>
                <p className="text-white/70 text-center">Tỷ lệ chuyển đổi cao hơn</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
