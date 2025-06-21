"use client"

import { useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight } from "lucide-react"
import { FadeIn, StaggerChildren, StaggerItem, ScaleOnScroll, MaskReveal } from "../scroll-animation"
import { motion, useScroll, useTransform } from "framer-motion"

export default function Features() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.5, 1, 1, 0.5])
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.95, 1, 1, 0.95])

  return (
    <section className="bg-darkGreen-900 py-28" id="features" ref={containerRef}>
      <motion.div className="container max-w-8xl mx-auto px-4" style={{ opacity, scale }}>
        <FadeIn>
          <p className="uppercase text-center text-sweetGreen-400 text-xs tracking-widest mb-6">TÍNH NĂNG</p>
          <h1 className="font-heading text-white text-center text-4xl md:text-5xl font-semibold mb-6">
            Những gì bạn có thể làm với chatbot AI
          </h1>
          <p className="text-white/70 text-lg text-center max-w-xl mx-auto mb-20">
            Huấn luyện AI để quản lý sản phẩm, thêm voucher, đào tạo qua chat và quản lý đơn hàng một cách thông minh,
            24/7.
          </p>
        </FadeIn>

        <StaggerChildren className="flex flex-wrap -m-4 mb-8" initialDelay={0.2}>
          <StaggerItem className="w-full md:w-1/2 lg:w-7/12 p-4">
            <div className="rounded-2xl bg-greenSecondary-900 py-10 px-5 lg:px-20 h-full">
              <MaskReveal direction="left" threshold={0.3}>
                <div className="h-[400px] w-full mb-8 relative">
                  <Image
                    src="/images/product.png"
                    alt="Huấn luyện AI quản lý sản phẩm"
                    fill
                    className="object-cover rounded-xl"
                  />
         
                </div>
              </MaskReveal>
              <FadeIn direction="up" delay={0.3}>
                <p className="text-white text-center text-xl font-medium">Huấn luyện AI quản lý sản phẩm</p>
                <p className="text-white/70 text-center mt-4">
                  Cung cấp dữ liệu sản phẩm để AI quản lý danh mục, tư vấn chính xác và cập nhật thông tin theo thời
                  gian thực.
                </p>
              </FadeIn>
            </div>
          </StaggerItem>
          <StaggerItem className="w-full md:w-1/2 lg:w-5/12 p-4">
            <div className="rounded-2xl bg-greenSecondary-900 py-10 px-5 lg:px-10 h-full">
              <MaskReveal direction="right" threshold={0.3}>
                <div className="h-[400px] w-full mb-8 relative">
                  <Image
                    src="/images/voucher.png"
                    alt="Thêm voucher giảm giá"
                    fill
                    className="object-cover rounded-xl"
                  />
                </div>
              </MaskReveal>
              <FadeIn direction="up" delay={0.4}>
                <p className="text-white text-center text-xl font-medium">Thêm voucher giảm giá</p>
                <p className="text-white/70 text-center mt-4">
                  Tích hợp và quản lý các mã voucher giảm giá, tự động áp dụng cho khách hàng dựa trên hành vi mua sắm.
                </p>
              </FadeIn>
            </div>
          </StaggerItem>
        </StaggerChildren>

        <StaggerChildren className="flex flex-wrap -m-4 mb-20" initialDelay={0.2}>
          <StaggerItem className="w-full md:w-1/2 lg:w-5/12 p-4">
            <div className="rounded-2xl bg-greenSecondary-900 py-10 px-5 lg:px-10 h-full">
              <MaskReveal direction="left" threshold={0.3}>
                <div className="h-[400px] w-full mb-8 relative">
                  <Image
                    src="/images/training.png"
                    alt="Huấn luyện AI qua chat"
                    fill
                    className="object-cover rounded-xl"
                  />
                </div>
              </MaskReveal>
              <FadeIn direction="up" delay={0.3}>
                <p className="text-white text-center text-xl font-medium">Huấn luyện AI qua chat</p>
                <p className="text-white/70 text-center mt-4">
                  Đào tạo AI bằng cách trò chuyện trực tiếp, giúp nó hiểu rõ hơn về nhu cầu khách hàng và sản phẩm của
                  bạn.
                </p>
              </FadeIn>
            </div>
          </StaggerItem>
          <StaggerItem className="w-full md:w-1/2 lg:w-7/12 p-4">
            <div className="rounded-2xl bg-greenSecondary-900 py-10 px-5 lg:px-20 h-full">
              <MaskReveal direction="right" threshold={0.3}>
                <div className="h-[400px] w-full mb-8 relative">
                  <Image
                    src="/images/order.png"
                    alt="Quản lý đơn hàng từ AI"
                    fill
                    className="object-cover rounded-xl"
                  />
         
                </div>
              </MaskReveal>
              <FadeIn direction="up" delay={0.4}>
                <p className="text-white text-center text-xl font-medium">Quản lý đơn hàng từ AI</p>
                <p className="text-white/70 text-center mt-4">
                  Theo dõi và xử lý các đơn hàng đã chốt bởi AI, với báo cáo chi tiết và hỗ trợ giao hàng hiệu quả.
                </p>
              </FadeIn>
            </div>
          </StaggerItem>
        </StaggerChildren>

        <ScaleOnScroll initialScale={0.9} threshold={0.3}>
          <div className="text-center">
            <Link href="#" className="group relative inline-block p-0.5 font-semibold overflow-hidden rounded-full">
              <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-500 group-focus:to-white opacity-40 group-focus:opacity-20 rounded-full"></div>
              <motion.div
                className="relative z-50 flex items-center py-2 px-4 bg-white group-hover:bg-white/80 group-focus:bg-white/80 rounded-full transition duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <p className="mr-2 text-darkGreen-900">Bắt đầu dùng thử miễn phí</p>
                <ChevronRight size={16} className="text-darkGreen-900" />
              </motion.div>
            </Link>
          </div>
        </ScaleOnScroll>
      </motion.div>
    </section>
  )
}
