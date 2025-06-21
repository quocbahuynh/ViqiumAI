"use client"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { truncateText } from "@/utils/truncate"
import { BriefcaseBusiness, Folder, FolderArchive, LayoutDashboard, LogOut, Settings } from "lucide-react"
import { Progress } from "../ui/progress"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchPlan } from "@/store/slices/plan"

interface UserDropdownProps {
  user: any
  displayName: string
  initials: string
}

export default function UserDropdown({ user, displayName, initials }: UserDropdownProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const dispatch = useAppDispatch()
  const plan = useAppSelector((state) => state.plan.data)
  const planStatus = useAppSelector((state) => state.plan.status)

  const usage = plan?.usage || 0
  const limit = plan?.limit || 1
  const percent = Math.min((usage / limit) * 100, 100)

  // Fetch plan khi component mount
  useEffect(() => {
    if (planStatus === "idle") {
      dispatch(fetchPlan())
    }
  }, [planStatus, dispatch])
  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
    setIsDropdownOpen(false)
  }

  // Component Avatar với tên
  const UserAvatar = () => (
    <div className="flex items-center gap-2">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#b1e346] to-[#8bc34a] flex items-center justify-center text-white font-bold ring-2 ring-white/20">
        {initials}
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="font-semibold text-sm text-gray-900 dark:text-white max-w-[120px] truncate">
          {truncateText(displayName,15)}
        </span>
        <div className="text-xs text-gray-500 flex items-center gap-1 dark:text-gray-400">
{plan?.usage}/{plan?.limit} 
                  <Progress value={percent} />
          </div>

      </div>
    </div>
  )

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex border hover:bg-white  border-transparent p-2  rounded-full hover:border-borderColour dark:hover:bg-dark-200 
    dark:hover:border-borderColour/10 duration-500 hover:duration-500 transition-colors group items-center gap-2   dark:hover:bg-dark-200/80  dark:hover:border-borderColour/10  backdrop-blur-sm"
      >
        <UserAvatar />
        <i
          className={`fa-solid fa-chevron-down text-gray-600 dark:text-gray-300 transition-all duration-300 text-xs ${
            isDropdownOpen ? "rotate-180 text-[#b1e346]" : ""
          }`}
        />
      </button>

      {isDropdownOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />

          {/* Dropdown Menu */}
          <div className="absolute right-0 top-full mt-3 w-56  dark:bg-dark-200 rounded-xl shadow-xl border border-gray-100 dark:border-borderColour/10  z-50 backdrop-blur-xl bg-white/95 dark:bg-dark-200/95">
        

            {/* Menu Items */}
            <div className="">
              {/* Quản lý dự án */}
              <Link
                href="/dashboard"
                className="group flex items-center gap-4 px-5 py-3 text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-[#b1e346]/10 hover:to-[#8bc34a]/10 hover:text-[#7cb342] dark:hover:text-[#b1e346] transition-all duration-200 relative overflow-hidden"
                onClick={() => setIsDropdownOpen(false)}
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#b1e346]/20 to-[#8bc34a]/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <BriefcaseBusiness className="w-4 h-4"/>
                </div>
                <div className="flex-1">
                  <div className="font-medium ">Quản lý dự án</div>
                </div>
              </Link>

              {/* Divider */}
              <div className="  border-t border-gray-100 dark:border-borderColour/10" />

              {/* Đăng xuất */}
              <div className="flex items-center w-full justify-center py-4">
                <button
                  onClick={handleSignOut}
                  className="btn py-2 items-center  text-sm flex"
                >
                  <LogOut color="white" size={15} className="text-sm inline-block mr-2" />
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

