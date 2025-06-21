"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, Plus, Send, Sparkles, User } from 'lucide-react'
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"

export default function ChatShowcase() {
  const [inputMessage, setInputMessage] = useState("")
  const [visibleMessages, setVisibleMessages] = useState<number[]>([])
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })
  
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3])
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8])
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [50, 0, 0, 50])

  // Chat messages data
const messages = [
    {
      id: 1,
      role: "user",
      content: null, // Tin nhắn hình ảnh
      image: "https://chatbotai.b-cdn.net/085c86ec-c13c-4640-afe8-ed1786d4dd1f.webp", // Hình ảnh áo thun
      floating: true,
      position: { top: "190px", right: "10%" },
    },
    {
      id: 2,
      role: "user",
      content: "Sản phẩm này giá bao nhiêu vậy?",
      floating: true,
      position: { top: "300px", right: "10%" },
    },
    {
      id: 3,
      role: "assistant",
      content: "Đây là áo thun LUSSO nam màu đen, giá 229.000 VNĐ! Hiện đang có chương trình khuyến mãi: mua 2 áo giảm 15%, chỉ còn 195.650 VNĐ/áo. Bạn có muốn đặt hàng không?",
      floating: true,
      position: { top: "380px", left: "10%" },
    },
    {
      id: 4,
      role: "user",
      content: "Tôi muốn đặt ngay 2 áo!",
      floating: true,
      position: { top: "520px", right: "10%" },
    },
    {
      id: 5,
      role: "assistant",
      content: "Tuyệt vời! Tôi đã lên đơn hàng cho bạn với 2 áo thun LUSSO nam màu đen. Giá gốc: 458.000 VNĐ, giảm 15% còn 389.300 VNĐ. Bạn muốn giao hàng đến đâu?",
      floating: true,
      position: { top: "580px", left: "10%" },
    },

]

  // Messages that appear inside the phone
  const phoneMessages = messages.filter((msg) => !msg.floating)

  // Animate messages appearing one by one
  useEffect(() => {
    const showMessages = async () => {
      for (let i = 0; i < messages.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 400))
        setVisibleMessages((prev) => [...prev, messages[i].id])
      }
    }

    showMessages()
  }, [])


  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden" ref={containerRef}>
      {/* Floating chat bubbles */}
      {messages
        // .filter((msg) => msg.floating && visibleMessages.includes(msg.id))
        .map((message) => (
          <motion.div
            key={message.id}
            className="absolute z-10"
            style={{
              ...message.position,
              maxWidth: "350px",
            }}
            // initial={{
            //   opacity: 0,
            //   scale: 0.8,
            //   x: message.role === "user" ? 50 : -50,
            // }}
            // animate={{
            //   opacity: 1,
            //   scale: 1,
            //   x: 0,
            // }}
            // transition={{
            //   duration: 0.5,
            //   type: "spring",
            //   stiffness: 260,
            //   damping: 20,
            // }}
            // whileHover={{ scale: 1.05 }}
          >
            <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} items-end`}>
              {message.role === "assistant" && (
                <motion.div
                  className="h-10 w-10 shadow-2xl rounded-full bg-[#2a3c34] flex items-center justify-center mr-3 flex-shrink-0"
                  // initial={{ scale: 0 }}
                  // animate={{ scale: 1 }}
                  // transition={{ delay: 0.2, duration: 0.3 }}
                >
            
                             <div className="h-8 w-8 rounded-full  flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-green-300" />
            </div>
                </motion.div>
              )}
              {message.image ? (
                <motion.div
                  className={`rounded-2xl overflow-hidden shadow-2xl ${
                    message.role === "user" ? "bg-green-300 rounded-br-none" : "bg-green-900/50 border border-green-300 rounded-bl-none"
                  }`}
                  // initial={{ opacity: 0, y: 20 }}
                  // animate={{ opacity: 1, y: 0 }}
                  // transition={{ delay: 0.1, duration: 0.3 }}
                >
                  <Image
                    src={message.image || "/placeholder.svg"}
                    alt="Uploaded product"
                    width={100}
                    height={100}
                    className="object-cover rounded-2xl"
                  />
                </motion.div>
              ) : (
                <motion.div
                  className={`rounded-2xl px-4 py-3 shadow-2xl ${
                    message.role === "user" ? "bg-green-300 text-black rounded-br-none" : "bg-green-900/50 border border-green-300 rounded-bl-none text-white"
                  }`}
                  // initial={{ opacity: 0, y: 20 }}
                  // animate={{ opacity: 1, y: 0 }}
                  // transition={{ delay: 0.1, duration: 0.3 }}
                >
                  <p className="text-sm">{message.content}</p>
                </motion.div>
              )}
              {message.role === "user" && (
                <motion.div
                  className="h-10 w-10 rounded-full shadow-2xl bg-[#8abb74] flex items-center justify-center ml-3 flex-shrink-0"
                  // initial={{ scale: 0 }}
                  // animate={{ scale: 1 }}
                  // transition={{ delay: 0.2, duration: 0.3 }}
                >
                        <div className="h-8 w-8 rounded-full  flex items-center justify-center">
              <User className="h-5 w-5 text-green-900" />
            </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}

      {/* Phone mockup */}
      <motion.div
        // className="relative w-[310px] h-[640px] bg-[#1C362F] rounded-[40px] border-4 border-[#031E17] shadow-2xl overflow-hidden"
        style={{ opacity, scale, y }}
        transition={{ duration: 0.3 }}
      >
<Image
  src="/hand.png"
  width={900}
  height={900}
  alt="Hand"
  className="absolute top-30 left-30 transform w-full h-full object-contain"
/>        {/* <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-20 h-6 bg-[#031E17] rounded-full z-10"></div>

        <div className="bg-[#1a2922] pt-9 pb-3 px-4 border-[#2a3c34]">
          <div className="flex items-center">
            <button className="p-2 rounded-full text-white">
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-[#2a3c34] flex items-center justify-center">
                     <div className="h-8 w-8 rounded-full  flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-green-300" />
            </div>
              </div>
              <span className="ml-2 text-white font-medium">ShopBot</span>
            </div>
          </div>
        </div>

        <div className="h-[520px] overflow-y-auto p-4 bg-[#1a2922]"></div>

        <div className="absolute bottom-0 left-0 right-0 p-3 bg-[#1a2922] border-t border-[#2a3c34]">
          <div className="flex items-center bg-[#2a3c34] rounded-full px-3 py-2">
            <motion.button
              className="p-1 rounded-full text-[#8abb74]"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <label htmlFor="image-upload" className="cursor-pointer">
                <Plus size={20} />
              </label>
           
            </motion.button>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Gửi tin nhắn hoặc hình ảnh..."
              className="flex-1 bg-transparent border-none text-white text-sm placeholder-gray-400 focus:outline-none px-2"
            />
            <motion.button
              className="p-1 rounded-full text-[#8abb74]"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Send size={20} />
            </motion.button>
          </div>
        </div> */}
      </motion.div>
    </div>
  )
}