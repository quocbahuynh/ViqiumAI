"use client"
import { useEffect } from "react"
import type React from "react"

import "./temp.css"
import "../../../public/vendor/fontawesome/all.css"
import Footer from "@/components/home/footer"
import Header from "@/components/home/header"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const {data:session} = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session && (!session?.user?.token || !session?.user?.profile )) {
      console.log("Invalid session or refresh error, signing out...");
      signOut({ redirect:true,callbackUrl: "/" })
    }
  }, [status, session, router])

  useEffect(() => {
    const handleScroll = () => {
      const topNav = document.getElementById("top-nav")
      const mainNav = document.getElementById("mainnavigationBar")
      const scrollY = window.scrollY

      if (topNav && mainNav) {
        if (scrollY > 50) {
          // Ẩn top banner và thêm blur cho navbar
          topNav.style.transform = "translateY(-100%)"
          topNav.style.opacity = "0"
          mainNav.classList.add("navbar-scrolled")
        } else {
          // Hiện lại top banner và bỏ blur navbar
          topNav.style.transform = "translateY(0)"
          topNav.style.opacity = "1"
          mainNav.classList.remove("navbar-scrolled")
        }
      }
    }

    // Thêm event listener
    window.addEventListener("scroll", handleScroll)

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <>
      {/* Top Banner */}
      <div
        className="top-nav fixed top-0 left-0 w-full py-3 text-center duration-500 transition-all origin-top bg-gradient-to-r from-[#b1e346] to-[#8bc34a] z-[999999999] "
        id="top-nav"
      >
        <div className="container mx-auto px-4">
          <p className="text-sm text-white flex items-center justify-center gap-2">
            <span>Miễn phí 7 ngày trải nghiệm AI dành cho Fanpage bán hàng</span>
          </p>
        </div>
      </div>

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <Footer />

      {/* Custom Styles */}
      <style jsx global>{`
        .navbar-scrolled {
          background: rgba(255, 255, 255, 0.1) !important;
          backdrop-filter: blur(20px) !important;
          -webkit-backdrop-filter: blur(20px) !important;
        }

        .dark .navbar-scrolled {
          background: rgba(31, 41, 55, 0.95) !important;
          border-bottom: 1px solid rgba(75, 85, 99, 0.3) !important;
        }

        .navbar-scrolled .nav-logo img {
          filter: brightness(0.8);
        }

        .dark .navbar-scrolled .nav-logo img {
          filter: brightness(1.2);
        }

        /* Smooth scroll behavior */
        html {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #b1e346, #8bc34a);
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #9fd63a, #7cb342);
        }

        .dark ::-webkit-scrollbar-track {
          background: #374151;
        }
      `}</style>
    </>
  )
}
