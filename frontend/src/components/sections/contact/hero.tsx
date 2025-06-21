"use client"

import { motion } from "framer-motion"
import { TextReveal, ParallaxScroll } from "../scroll-animation"

export default function ContactHero() {
  return (
    <div className="container mx-auto px-4 py-32 md:py-40">
      <div className="relative z-10">
        <TextReveal className="font-heading text-white text-center text-4xl sm:text-5xl md:text-7xl font-bold max-w-sm sm:max-w-lg md:max-w-3xl mx-auto mb-8">
          Liên hệ với chúng tôi
        </TextReveal>

        <motion.p
          className="text-white/80 text-center max-w-xl mx-auto text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Đội ngũ của chúng tôi luôn sẵn sàng hỗ trợ bạn. Hãy liên hệ với chúng tôi nếu bạn có bất kỳ câu hỏi nào.
        </motion.p>
      </div>

      <ParallaxScroll speed={0.1}>
        <div className="absolute top-1/4 left-10 w-20 h-20 bg-green-500/20 rounded-full animate-float-slow"></div>
      </ParallaxScroll>
      <ParallaxScroll speed={-0.2}>
        <div className="absolute bottom-1/4 right-10 w-16 h-16 bg-green-500/20 rounded-full animate-float-medium"></div>
      </ParallaxScroll>
    </div>
  )
}
