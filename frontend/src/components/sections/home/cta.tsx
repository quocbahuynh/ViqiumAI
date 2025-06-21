"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { FadeIn, ParallaxScroll, MaskReveal } from "../scroll-animation"

export default function Cta() {
  return (
    <section className="bg-darkGreen-700 py-32 relative overflow-hidden">
      <div className="container mx-auto ">
        <FadeIn direction="down" delay={0.3} threshold={0.3}>
          <h1 className="font-heading text-white text-center text-4xl md:text-5xl max-w-md md:max-w-xl mx-auto font-bold mb-4">
            Sẵn sàng tăng doanh số với chatbot AI thông minh?
          </h1>
        </FadeIn>

        <FadeIn direction="up" delay={0.3} threshold={0.3}>
          <p className="text-white text-center mb-10">
            Tham gia cùng hàng nghìn cửa hàng sử dụng ChatSell để tự động hóa bán hàng, tư vấn sản phẩm, và chốt đơn
            hiệu quả.
          </p>
        </FadeIn>

        <FadeIn direction="up" delay={0.5} threshold={0.3}>
          <div className="text-center">
            <Link href="#" className="group relative inline-block p-0.5 font-semibold overflow-hidden rounded-full">
              <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-500 group-focus:to-white opacity-40 group-focus:opacity-20 rounded-full"></div>
              <div className="relative z-50 flex items-center w-64 mx-auto text-center justify-center py-2 px-5 bg-white group-hover:bg-white group-focus:bg-white group-hover:bg-white/80 group-focus:bg-white/80 rounded-full transition duration-200">
                <span className="mr-2 text-darkGreen-900 group-hover:text-pinkSecondary-900 group-focus:text-pinkSecondary-900">
                  Dùng thử miễn phí ngay
                </span>
                <ChevronRight size={20} className="text-darkGreen-900" />
              </div>
            </Link>
          </div>
        </FadeIn>
      </div>

      {/* Animated elements */}
      <ParallaxScroll speed={0.2}>
        <div className="absolute top-10 left-10 w-20 h-20 bg-green-500/20 rounded-full animate-float-slow"></div>
      </ParallaxScroll>
      <ParallaxScroll speed={-0.3}>
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-green-500/20 rounded-full animate-float-medium"></div>
      </ParallaxScroll>
      <ParallaxScroll speed={0.1}>
        <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-green-500/20 rounded-full animate-float-fast"></div>
      </ParallaxScroll>
    </section>
  )
}
