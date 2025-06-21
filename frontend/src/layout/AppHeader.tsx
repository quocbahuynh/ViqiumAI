"use client"
import UserDropdown from "@/components/header/UserDropdown"
import { useSidebar } from "@/context/SidebarContext"
import { Menu, X } from "lucide-react"
import type React from "react"
import { useState, useEffect, useRef } from "react"

const AppHeader: React.FC = () => {
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar()
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar()
    } else {
      toggleMobileSidebar()
    }
  }

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen)
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault()
        inputRef.current?.focus()
      }
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 1024 && isApplicationMenuOpen) {
        setApplicationMenuOpen(false)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    window.addEventListener("resize", handleResize)
    handleResize()

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("resize", handleResize)
    }
  }, [isApplicationMenuOpen])

  return (
    <header className="sticky top-0 flex w-full bg-white/50 backdrop-blur-2xl border-b border-gray-200 z-20  dark:border-gray-800 dark:bg-gray-900">
    <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
      <div className="flex items-center justify-between w-full gap-4 px-3 py-3 lg:px-0">
       <button
            className="items-center flex justify-center w-10 h-10 text-gray-500 border-gray-200 rounded-lg z-30 dark:border-gray-800  dark:text-gray-400  lg:border hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

                    <div className="flex items-center gap-3">
                    {/* <NotificationDropdown />
                    <ThemeToggleButton /> */}
                    <UserDropdown />
                  </div>
        </div>

      </div>
    </header>
  )
}

export default AppHeader
