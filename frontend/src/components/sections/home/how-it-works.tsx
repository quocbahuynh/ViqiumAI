"use client"

import { useRef } from "react"
import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { FeatureCarousel } from "./featurecarousel"
import { ScrollReveal } from "../scroll-animation"

export default function HowItWorks() {

  return (
    <section className="bg-darkGreen-900" id="features" >
      <motion.div className="container mx-auto px-4" >
        <div className="sm:border-l sm:border-r border-white/20 border-dashed">
          <div className="py-32 px-4 sm:px-24" >
      
              <p className="uppercase text-sweetGreen-300 text-xs mb-4 tracking-widest">TÍNH NĂNG NỔI BẬT</p>
              <h1 className="font-heading text-white text-4xl md:text-5xl font-bold mb-20">
                Khám phá sức mạnh của chatbot bán hàng AI
              </h1>

            <div className="flex flex-wrap items-center -m-4">
              <div className="w-full lg:w-1/3 p-4">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <motion.div
                      className="bg-gradient-to-b from-green-400 via-green-500 to-darkGreen-900 rounded-full p-px w-6 h-6"
                      whileHover={{ scale: 1.2, rotate: 10 }}
                    >
                      <div className="bg-greenSecondary-900 rounded-full p-1">
                        <p className="text-white text-center text-xs font-semibold">1</p>
                      </div>
                    </motion.div>
                    <p className="text-white text-lg font-semibold">Tư vấn sản phẩm bằng hình ảnh</p>
                  </div>
                  <p className="text-white/70 max-w-xs">
                    Chỉ cần gửi ảnh sản phẩm, chatbot sẽ ngay lập tức tư vấn chi tiết, gợi ý phù hợp và đưa ra ưu đãi
                    đặc biệt.
                  </p>

                  <div className="flex flex-wrap gap-2 mb-2">
                    <motion.div
                      className="bg-gradient-to-b from-green-400 via-green-500 to-darkGreen-900 rounded-full p-px w-6 h-6"
                      whileHover={{ scale: 1.2, rotate: 10 }}
                    >
                      <div className="bg-greenSecondary-900 rounded-full p-1">
                        <p className="text-white text-center text-xs font-semibold">2</p>
                      </div>
                    </motion.div>
                    <p className="text-white text-lg font-semibold">Giới thiệu sản phẩm và voucher</p>
                  </div>
                  <p className="text-white/70 max-w-xs">
                    Tự động giới thiệu sản phẩm nổi bật và áp dụng voucher giảm giá, giúp tăng giá trị đơn hàng một cách
                    dễ dàng.
                  </p>

                  <div className="flex flex-wrap gap-2 mb-2">
                    <motion.div
                      className="bg-gradient-to-b from-green-400 via-green-500 to-darkGreen-900 rounded-full p-px w-6 h-6"
                      whileHover={{ scale: 1.2, rotate: 10 }}
                    >
                      <div className="bg-greenSecondary-900 rounded-full p-1">
                        <p className="text-white text-center text-xs font-semibold">3</p>
                      </div>
                    </motion.div>
                    <p className="text-white text-lg font-semibold">Tự động chốt đơn hàng</p>
                  </div>
                  <p className="text-white/70 max-w-xs">
                    Hỗ trợ khách hàng hoàn tất đơn hàng nhanh chóng với trải nghiệm mượt mà, tăng tỷ lệ chuyển đổi vượt
                    trội.
                  </p>
              </div>

              <div className="w-full lg:w-2/3 p-4">
                <motion.div
         
                >
                  <FeatureCarousel />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
