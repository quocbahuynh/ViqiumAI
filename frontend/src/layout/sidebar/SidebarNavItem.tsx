"use client"

import { useSidebar } from "@/context/SidebarContext"
import Link from "next/link"
import type React from "react"
import { ChevronDownIcon } from "@/icons"

interface NavItemProps {
  name: string
  icon: React.ReactNode
  path?: string
  isActive: boolean
  hasSubmenu?: boolean
  isSubmenuOpen?: boolean
  onClick?: () => void
  children?: React.ReactNode
}

const SidebarNavItem: React.FC<NavItemProps> = ({
  name,
  icon,
  path,
  isActive,
  hasSubmenu = false,
  isSubmenuOpen = false,
  onClick,
  children,
}) => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar()
  const showText = isExpanded || isHovered || isMobileOpen
  
  const commonClasses = `menu-item group ${isActive ? "menu-item-active" : "menu-item-inactive"} ${
    !isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"
  }`
  
  const iconClasses = `${isActive ? "menu-item-icon-active" : "menu-item-icon-inactive"}`
  
  if (hasSubmenu) {
    return (
      <>
        <button onClick={onClick} className={`${commonClasses} cursor-pointer`}>
          <span className={iconClasses}>{icon}</span>
          {showText && <span className="menu-item-text">{name}</span>}
          {showText && <ChevronDownIcon />}
        </button>
        {children}
      </>
    )
  }
  
  if (path) {
    return (
      <Link href={path} className={commonClasses}>
        <span className={iconClasses}>{icon}</span>
        {showText && <span className="menu-item-text">{name}</span>}
      </Link>
    )
  }
  
  return null
}

export default SidebarNavItem
