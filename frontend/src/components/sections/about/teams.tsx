"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { FadeIn, StaggerChildren, StaggerItem } from "../scroll-animation"

export default function AboutTeam() {
  const [activeSlide, setActiveSlide] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.5, 1, 1, 0.5])
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.95, 1, 1, 0.95])

  const teamMembers = [
    {
      name: "Trần Minh Đức",
      role: "Nhà sáng lập & CEO",
      image: "https://sb.kaleidousercontent.com/67418/1000x1000/8fbbfc9296/cv-color-thumbnail.png",
      bio: "Đức là người sáng lập ChatSell, mang đến nhiều năm kinh nghiệm trong lĩnh vực công nghệ và thương mại điện tử. Với niềm đam mê đổi mới và tầm nhìn sắc bén về xu hướng thị trường, anh đã xây dựng ChatSell với sứ mệnh đơn giản hóa việc bán hàng trực tuyến cho mọi doanh nghiệp.",
      social: {
        twitter: "#",
        linkedin: "#",
      },
    },
    {
      name: "Nguyễn Thị Mai",
      role: "Giám đốc Sản phẩm",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0A5a-xfmx-Yb_1HQdXRvai-cNq5A8uJ5nkQ&s",
      bio: "Mai là động lực đằng sau sự phát triển sản phẩm của ChatSell, với chuyên môn sâu rộng về thiết kế trải nghiệm người dùng và phát triển phần mềm. Được thúc đẩy bởi mong muốn tạo ra các giải pháp trực quan và hiệu quả, cô đã dẫn dắt đội ngũ phát triển ChatSell với cam kết mang lại giá trị tối đa cho người dùng.",
      social: {
        twitter: "#",
        linkedin: "#",
      },
    },
    {
      name: "Lê Hoàng Nam",
      role: "Giám đốc Công nghệ",
      image: "https://static.vecteezy.com/system/resources/previews/034/585/785/non_2x/ai-generative-confident-young-businessman-in-suit-standing-with-arms-folded-free-photo.jpg",
      bio: "Nam là chuyên gia công nghệ đứng sau các thuật toán AI tiên tiến của ChatSell. Với nền tảng vững chắc về học máy và xử lý ngôn ngữ tự nhiên, anh đã phát triển các công nghệ cốt lõi giúp ChatSell hiểu và tương tác với khách hàng một cách thông minh và tự nhiên.",
      social: {
        twitter: "#",
        linkedin: "#",
      },
    },
  ]

  return (
    <section className="bg-darkGreen-900 pt-32 pb-56" ref={containerRef}>
      <motion.div className="container mx-auto px-4" style={{ opacity, scale }}>
        <FadeIn>
          <h1 className="font-heading text-white text-center mb-4 text-4xl md:text-5xl font-bold">
            Đội ngũ của chúng tôi
          </h1>
          <p className="text-white/70 mb-20 text-center">
            Gặp gỡ đội ngũ đa dạng và giàu kinh nghiệm của chúng tôi. Chúng tôi đến từ nhiều nơi trên thế giới.
          </p>
        </FadeIn>

        <div className="flex flex-wrap -m-4">
          <div className="w-full lg:w-1/3 p-4">
            <div className="lg:pt-20">
              <div className="flex flex-col justify-between gap-12 h-full">
                <div>
                  <motion.p
                    className="text-white text-4xl font-semibold mb-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {teamMembers[activeSlide].name}
                  </motion.p>
                  <motion.p
                    className="text-white/70 mb-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    {teamMembers[activeSlide].role}
                  </motion.p>
                  <motion.div
                    className="flex gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <a href={teamMembers[activeSlide].social.twitter} className="inline-block">
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
                    </a>
                    <a href={teamMembers[activeSlide].social.linkedin} className="inline-block">
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
                        <rect x="2" y="9" width="4" height="12"></rect>
                        <circle cx="4" cy="4" r="2"></circle>
                      </svg>
                    </a>
                  </motion.div>
                </div>
                <div className="flex flex-wrap gap-6">
                  <button
                    onClick={() => setActiveSlide((prev) => (prev > 0 ? prev - 1 : teamMembers.length - 1))}
                    className="rounded-full w-10 h-10 flex items-center justify-center text-white hover:text-opacity-100 text-opacity-40 border border-white border-opacity-40 hover:bg-white hover:bg-opacity-10 transition duration-200"
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
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setActiveSlide((prev) => (prev < teamMembers.length - 1 ? prev + 1 : 0))}
                    className="rounded-full w-10 h-10 flex items-center justify-center text-white hover:text-opacity-100 text-opacity-40 border border-white border-opacity-40 hover:bg-white hover:bg-opacity-10 transition duration-200"
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
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-2/3 p-4">
            <div className="max-w-2xl lg:ml-auto">
              <div className="flex flex-wrap -m-4">
                <div className="w-full lg:w-1/2 p-4">
                  <motion.div
                    className="rounded-2xl pt-16 bg-gradient-to-t from-green-400 via-green-500 to-darkGreen-900 h-full overflow-hidden flex flex-col justify-end"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    key={`image-${activeSlide}`}
                  >
                    <Image
                      src={teamMembers[activeSlide].image || "/placeholder.svg"}
                      alt={teamMembers[activeSlide].name}
                      width={400}
                      height={600}
                      className="mx-auto h-80 object-cover"
                    />
                  </motion.div>
                </div>
                <div className="w-full lg:w-1/2 p-4">
                  <motion.div
                    className="bg-greenSecondary-900 rounded-2xl px-10 py-20 h-full"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    key={`bio-${activeSlide}`}
                  >
                    <p className="text-white max-w-xs mx-auto">
                      <span className="text-lg font-semibold">{teamMembers[activeSlide].name} </span>
                      <span>{teamMembers[activeSlide].bio}</span>
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-32">
          <FadeIn>
            <h2 className="font-heading text-white text-center mb-12 text-3xl font-bold">Đội ngũ phát triển</h2>
          </FadeIn>

          <StaggerChildren className="flex flex-wrap -m-4" staggerDelay={0.1}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <StaggerItem key={item} className="w-full md:w-1/2 lg:w-1/3 p-4">
                <motion.div
                  className="bg-greenSecondary-900 rounded-xl p-6 flex items-center gap-4"
                  whileHover={{ scale: 1.03, backgroundColor: "rgba(28, 54, 47, 0.8)" }}
                >
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex-shrink-0"></div>
                  <div>
                    <p className="text-white font-medium">Thành viên {item}</p>
                    <p className="text-white/70 text-sm">Chuyên gia phát triển</p>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </motion.div>
    </section>
  )
}
