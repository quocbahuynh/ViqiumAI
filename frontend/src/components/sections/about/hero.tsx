"use client"

import { motion } from "framer-motion"
import { TextReveal, ParallaxScroll } from "../scroll-animation"

export default function AboutHero() {
  return (
    <div className="container mx-auto px-4 py-32 md:py-40">
      <div className="relative z-10">
        <TextReveal className="font-heading  text-white text-center text-4xl sm:text-5xl md:text-7xl font-bold max-w-sm sm:max-w-lg md:max-w-3xl mx-auto mb-32">
          Sứ  mệnh  của  chúng  tôi  là  đơn  giản  hóa  việc  bán  hàng  trực tuyến
        </TextReveal>
      </div>

      <motion.div
        className="bg-darkGreen-900 rounded-2xl p-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="flex flex-wrap items-stretch -m-4">
          <div className="w-full md:w-1/3 lg:w-1/2 p-4">
            <div className="border-r border-transparent md:border-white md:border-opacity-10 flex flex-col justify-center h-full md:pr-4">
              <p className="text-white text-center md:text-left text-opacity-50 mb-2">Đối tác</p>
              <p className="text-white text-center md:text-left mx-auto md:mx-0 text-2xl font-semibold max-w-xs">
                Hợp tác với các đối tác hàng đầu trong ngành
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/3 lg:w-1/4 p-4">
            <div className="border-r border-transparent md:border-white md:border-opacity-10 flex flex-col justify-center h-full md:pr-4">
              <p className="text-white text-opacity-50 mb-2 text-center">Thành viên</p>
              <p className="text-white text-5xl font-bold text-center">50+</p>
            </div>
          </div>
          <div className="w-full md:w-1/3 lg:w-1/4 p-4">
            <div className="flex flex-col justify-center h-full">
              <p className="text-white text-opacity-50 mb-2 text-center">Thành lập</p>
              <p className="text-white text-5xl font-bold text-center">2023</p>
            </div>
          </div>
        </div>
      </motion.div>

      <ParallaxScroll speed={0.1}>
        <div className="absolute top-1/4 left-10 w-20 h-20 bg-green-500/20 rounded-full animate-float-slow"></div>
      </ParallaxScroll>
      <ParallaxScroll speed={-0.2}>
        <div className="absolute bottom-1/4 right-10 w-16 h-16 bg-green-500/20 rounded-full animate-float-medium"></div>
      </ParallaxScroll>
    </div>
  )
}
