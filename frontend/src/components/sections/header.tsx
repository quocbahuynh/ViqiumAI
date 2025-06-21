"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronRight, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import { useSession } from "next-auth/react"
import UserDropdown from "../header/UserDropdown"

export default function StickyHeader() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [prevScrollY, setPrevScrollY] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const isScrolled = currentScrollY > 20
      
      // Hide header when scrolling down, show when scrolling up
      if (currentScrollY > prevScrollY && currentScrollY > 100) {
        setVisible(false)
      } else {
        setVisible(true)
      }
      
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
      
      setPrevScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [scrolled, prevScrollY])

  const { data: session } = useSession()

  return (
    <>
      <motion.div
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          scrolled ? "backdrop-blur-md py-2" : "bg-transparent py-2"
        }`}
        initial={{ y: 0 }}
        animate={{ y: visible ? 0 : -100 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto px-4">
          {/* Navigation */}
          <nav className={`${scrolled ? "py-2 border-none" : "py-2 border-b border-white/10"}`}>
            <div className="flex items-center justify-between">
              <motion.div 
                className="flex items-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Link href="/" className="flex items-center">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-300 to-green-900 flex items-center justify-center mr-2">
                    <span className="text-white font-bold text-lg">AI</span>
                  </div>
                  <span className="text-xl font-bold text-white">ShopBot</span>
                </Link>
              </motion.div>
              
              <motion.div 
                className="hidden lg:flex gap-2 p-1 rounded-full bg-white/10"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Link
                  href="/"
                  className="px-3 py-2 rounded-full text-white text-sm hover:bg-white/20 transition duration-200"
                >
                  Trang chủ
                </Link>
                
                <Link
                  href="/contact"
                  className="px-3 py-2 rounded-full text-white text-sm hover:bg-white/20 transition duration-200"
                >
                  Liên hệ
                </Link>
             
                <Link
                  href="/about"
                  className="px-3 py-2 rounded-full text-white text-sm hover:bg-white/20 transition duration-200"
                >
                  Về chúng tôi
                </Link>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {session?.user?.token ? (
                  <UserDropdown />
                ) : (
                  <Link
                    href="/login"
                    className="hidden lg:flex items-center gap-2 text-white hover:text-green-500 transition duration-200"
                  >
                    <span className="text-sm font-medium">Đăng nhập</span>
                    <ChevronRight size={16} />
                  </Link>
                )}
                
                <button className="lg:hidden" onClick={() => setMobileNavOpen(!mobileNavOpen)}>
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
                    <Menu className="text-black" />
                  </div>
                </button>
              </motion.div>
            </div>
          </nav>
        </div>
      </motion.div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileNavOpen && (
          <>
            <motion.div 
              className="fixed inset-0 bg-black/20 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileNavOpen(false)}
            />
            <motion.div
              className="fixed top-0 left-0 bottom-0 w-5/6 max-w-xs z-50 bg-white overflow-y-auto"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <nav className="relative p-8 w-full h-full">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Link href="/" className="flex items-center">
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-300 to-green-900 flex items-center justify-center mr-2">
                        <span className="text-white font-bold text-lg">AI</span>
                      </div>
                      <span className="text-xl font-bold text-black">ShopBot</span>
                    </Link>
                  </div>
                  <button onClick={() => setMobileNavOpen(false)}>
                    <X size={24} />
                  </button>
                </div>
                <motion.ul 
                  className="flex flex-col gap-12 py-12 my-12"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.1,
                        delayChildren: 0.2,
                      },
                    },
                  }}
                >
                  {["Home", "Features", "Pricing", "Blog", "Contact"].map((item, index) => (
                    <motion.li 
                      key={index}
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: { opacity: 1, x: 0 },
                      }}
                    >
                      <Link href={`/${item.toLowerCase() === 'home' ? '' : item.toLowerCase()}`} className="text-sm font-medium">
                        {item === "Home" ? "Trang chủ" : 
                         item === "Features" ? "Tính năng" : 
                         item === "Pricing" ? "Giá cả" : 
                         item === "Blog" ? "Blog" : 
                         "Liên hệ"}
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  {session?.user?.token ? (
                    <UserDropdown />
                  ) : (
                    <Link
                      href="/signin"
                      className="inline-flex items-center gap-2 text-black hover:text-black/80 transition duration-200"
                    >
                      <span className="text-sm font-medium">Đăng nhập</span>
                      <ChevronRight size={16} />
                    </Link>
                  )}
                </motion.div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}