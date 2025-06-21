"use client"

import { useSidebar } from "@/context/SidebarContext"
import { HorizontaLDots } from "@/icons"
import type React from "react"

interface SidebarSectionProps {
  title: string
  children: React.ReactNode
}

const SidebarSection: React.FC<SidebarSectionProps> = ({ title, children }) => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar()
  const showTitle = isExpanded || isHovered || isMobileOpen
  
  return (
    <div>
      <h2
        className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        {showTitle ? title : <HorizontaLDots />}
      </h2>
      {children}
    </div>
  )
}

export default SidebarSection
