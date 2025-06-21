"use client"

import Link from "next/link"
import { ChevronRight } from 'lucide-react'
import ChatShowcase from "./chat"
import { motion } from "framer-motion"
import { TextReveal, ScaleOnScroll } from "../scroll-animation"

export default function Hero() {
  return (
    <div className="container mx-auto px-4 ">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
        <motion.div
          className="w-full lg:w-1/2 order-2 lg:order-1"
          // initial={{ opacity: 0, x: -50 }}
          // animate={{ opacity: 1, x: 0 }}
          // transition={{ duration: 0.8 }}
        >
          <div className="max-w-xl mx-auto lg:mx-0">
            <TextReveal className="font-heading text-white text-6xl font-bold mb-2 leading-tight ">
Chatbot AI Tư Vấn Mua Sắm Thông Minh            
</TextReveal>
            
            <motion.p 
              className="text-white/90 text-lg font-light mb-8"
              // initial={{ opacity: 0, y: 20 }}
              // animate={{ opacity: 1, y: 0 }}
              // transition={{ duration: 0.8, delay: 0.3 }}
            >
              Tạo chatbot thông minh để tự động tư vấn sản phẩm, thông báo khuyến mãi và chốt đơn hàng 24/7, không cần kỹ năng lập trình.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row items-center gap-4"
              // initial={{ opacity: 0, y: 20 }}
              // animate={{ opacity: 1, y: 0 }}
              // transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Link
                href="#"
                className="group relative inline-block w-full sm:w-auto text-center mb-2 sm:mb-0 p-0.5 font-semibold overflow-hidden rounded-full"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-500 group-focus:to-white opacity-40 group-focus:opacity-20 rounded-full"></div>
                <motion.div 
                  className="relative z-10 flex items-center justify-center py-3 px-6 bg-white group-hover:bg-white/90 group-focus:bg-white/90 rounded-full transition duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <p className="mr-2 text-greenSecondary-900 font-medium">Dùng thử miễn phí</p>
                  <ChevronRight size={16} className="text-greenSecondary-900" />
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        <div
          className="w-full lg:w-1/2 order-1 lg:order-2 flex justify-center lg:justify-end"
          // initialScale={0.8}
          // duration={0.8}
          // delay={0.2}
        >
          <div className="w-full">
            <ChatShowcase />
          </div>
        </div>
      </div>
    </div>
  )
}
