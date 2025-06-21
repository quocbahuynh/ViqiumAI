"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { FadeIn, MaskReveal } from "../scroll-animation"

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormStatus("submitting")

    // Simulate form submission
    setTimeout(() => {
      setFormStatus("success")
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormStatus("idle")
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
        })
      }, 3000)
    }, 1500)
  }

  return (
    <MaskReveal direction="left" threshold={0.3}>
      <div className="bg-greenSecondary-900 rounded-2xl p-8 h-full">
        <FadeIn direction="up" delay={0.2}>
          <h2 className="text-white text-2xl font-bold mb-6">Gửi tin nhắn cho chúng tôi</h2>
          <p className="text-white/70 mb-8">
            Hãy điền thông tin của bạn và chúng tôi sẽ liên hệ lại trong thời gian sớm nhất.
          </p>
        </FadeIn>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="name" className="block text-white text-sm mb-2">
              Họ và tên <span className="text-sweetGreen-400">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-darkGreen-900 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-sweetGreen-400 transition duration-200"
              placeholder="Nhập họ và tên của bạn"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="email" className="block text-white text-sm mb-2">
              Email <span className="text-sweetGreen-400">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-darkGreen-900 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-sweetGreen-400 transition duration-200"
              placeholder="Nhập địa chỉ email của bạn"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="phone" className="block text-white text-sm mb-2">
              Số điện thoại
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-darkGreen-900 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-sweetGreen-400 transition duration-200"
              placeholder="Nhập số điện thoại của bạn"
            />
          </div>

          <div className="mb-8">
            <label htmlFor="message" className="block text-white text-sm mb-2">
              Tin nhắn <span className="text-sweetGreen-400">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-3 rounded-xl bg-darkGreen-900 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-sweetGreen-400 transition duration-200 resize-none"
              placeholder="Nhập nội dung tin nhắn của bạn"
            ></textarea>
          </div>

          <motion.button
            type="submit"
            className="w-full py-3 px-6 bg-sweetGreen-400 hover:bg-sweetGreen-300 text-darkGreen-900 font-medium rounded-xl transition duration-200 flex items-center justify-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={formStatus === "submitting"}
          >
            {formStatus === "idle" && "Gửi tin nhắn"}
            {formStatus === "submitting" && (
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-darkGreen-900"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            {formStatus === "submitting" && "Đang gửi..."}
            {formStatus === "success" && "Gửi thành công!"}
            {formStatus === "error" && "Lỗi! Vui lòng thử lại"}
          </motion.button>
        </form>
      </div>
    </MaskReveal>
  )
}
