"use client"

import { useSidebar } from "@/context/SidebarContext"
import Image from "next/image"
import Link from "next/link"
import type React from "react"

interface LogoProps {
  href?: string
}

const Logo: React.FC<LogoProps> = ({ href = "/" }) => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar()
  
  const showFullLogo = isExpanded || isHovered || isMobileOpen
  
  return (
    <div className={`py-8 flex ${!showFullLogo ? "lg:justify-center" : "justify-start"}`}>
      <Link href={href}>
        {showFullLogo ? (
          <>              <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-10 h-10 bg-green-600 rounded-lg">
            <span className="text-xl font-bold text-white">CB</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">ChatBot Admin</h1>
        </div>
          </>
        ) : (
          <div className="flex items-center justify-center w-10 h-10 bg-green-600 rounded-lg">
            <span className="text-xl font-bold text-white">CB</span>
          </div>
        )}
      </Link>
    </div>
  )
}

export default Logo
