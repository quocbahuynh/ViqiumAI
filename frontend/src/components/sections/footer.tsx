"use client"

import Link from "next/link"
import { InstagramLogoIcon, LinkedInLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons"
import { Facebook } from 'lucide-react'
import { FadeIn, StaggerChildren, StaggerItem } from "./scroll-animation"

export default function Footer() {
  return (
    <section className="bg-darkGreen-900 py-20">
      <div className="container mx-auto px-4">
        <div className="pb-20 border-b border-white/30 mb-10">
          <StaggerChildren className="flex flex-wrap justify-between -m-4" staggerDelay={0.1}>
            <StaggerItem className="p-4">
              <div className="flex items-start">
                <div className="block">
                  <div className="flex items-center">
                    <Link href="/" className="flex items-center">
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-300 to-green-900 flex items-center justify-center mr-2">
                        <span className="text-white font-bold text-lg">AI</span>
                      </div>
                      <span className="text-xl font-bold text-white">ShopBot</span>
                    </Link>
                  </div>
                </div>
              </div>
            </StaggerItem>
            <StaggerItem className="w-full sm:w-1/2 lg:w-1/6 p-4">
              <ul className="flex flex-col gap-6">
                <li>
                  <Link href="#features" className="text-white hover:text-white/70 text-xl transition duration-200">
                    Tính năng
                  </Link>
                </li>
                <li>
                  <Link href="/guide" className="text-white hover:text-white/70 text-xl transition duration-200">
                    Hướng dẫn
                  </Link>
                </li>
              </ul>
            </StaggerItem>
            <StaggerItem className="w-full sm:w-1/2 lg:w-1/6 p-4">
              <ul className="flex flex-col gap-6">
                <li>
                  <Link href="#pricing" className="text-white hover:text-white/70 text-xl transition duration-200">
                    Giá cả
                  </Link>
                </li>
                <li>
                  <Link href="#faq" className="text-white hover:text-white/70 text-xl transition duration-200">
                    Câu hỏi thường gặp
                  </Link>
                </li>
              </ul>
            </StaggerItem>
            <StaggerItem className="w-full sm:w-1/2 lg:w-1/6 p-4">
              <ul className="flex flex-col gap-6">
                <li>
                  <Link href="/about" className="text-white hover:text-white/70 text-xl transition duration-200">
                    Về chúng tôi
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-white hover:text-white/70 text-xl transition duration-200">
                    Blog
                  </Link>
                </li>
              </ul>
            </StaggerItem>
            <StaggerItem className="w-full sm:w-1/2 lg:w-1/6 p-4">
              <ul className="flex flex-col gap-6">
                <li>
                  <Link href="/contact" className="text-white hover:text-white/70 text-xl transition duration-200">
                    Liên hệ
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-white hover:text-white/70 text-xl transition duration-200">
                    Chính sách bảo mật
                  </Link>
                </li>
              </ul>
            </StaggerItem>
          </StaggerChildren>
        </div>
        <FadeIn direction="up" delay={0.3}>
          <div className="flex justify-between items-center flex-wrap gap-6">
            <p className="text-white">
              © ChatSell. Bảo lưu mọi quyền. Cập nhật lần cuối: 08:38 PM +07, Thứ Năm, 15/05/2025.
            </p>
            <div className="flex flex-wrap gap-6">
              <Link href="#">
                <TwitterLogoIcon color="white" width={24} height={24} />
              </Link>
              <Link href="#">
                <LinkedInLogoIcon color="white" width={24} height={24} />
              </Link>
              <Link href="#">
                <InstagramLogoIcon color="white" width={24} height={24} />
              </Link>
              <Link href="#">
                <Facebook color="white" width={24} height={24} />
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
