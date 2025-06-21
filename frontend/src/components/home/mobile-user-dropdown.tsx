"use client"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { truncateText } from "@/utils/truncate"
import { BriefcaseBusiness, User, Settings, LogOut, Home, HelpCircle, CreditCard, LifeBuoy, Users } from "lucide-react"

interface MobileUserDropdownProps {
  user: any
  displayName: string
  initials: string
  onMenuClose: () => void
}

export default function MobileUserDropdown({ user, displayName, initials, onMenuClose }: MobileUserDropdownProps) {
  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
    onMenuClose()
  }

  return (
    <div className="w-full space-y-4">
      {/* User Info Section */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-gray-800 font-bold text-sm">
          {initials}
        </div>
        <div className="flex-1">
          <h3 className="text-base font-medium text-gray-800 dark:text-white">{truncateText(displayName, 20)}</h3>
        </div>
      </div>

      {/* Menu Actions */}
      <div className="space-y-1">
        {/* Quản lý dự án */}
        <Link
          href="/dashboard"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/20 transition-all duration-200"
          onClick={onMenuClose}
        >
          <BriefcaseBusiness className="w-5 h-5 text-gray-800 dark:text-white" />
          <div>
            <div className="font-medium text-gray-800 dark:text-white">Quản lý dự án</div>
            <div className="text-xs text-gray-600 dark:text-gray-300">Xem và quản lý các dự án</div>
          </div>
        </Link>

        {/* Hồ sơ cá nhân */}
        <Link
          href="/profile"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/20 transition-all duration-200"
          onClick={onMenuClose}
        >
          <User className="w-5 h-5 text-gray-800 dark:text-white" />
          <div>
            <div className="font-medium text-gray-800 dark:text-white">Hồ sơ cá nhân</div>
            <div className="text-xs text-gray-600 dark:text-gray-300">Chỉnh sửa thông tin</div>
          </div>
        </Link>

        {/* Cài đặt */}
        <Link
          href="/settings"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/20 transition-all duration-200"
          onClick={onMenuClose}
        >
          <Settings className="w-5 h-5 text-gray-800 dark:text-white" />
          <div>
            <div className="font-medium text-gray-800 dark:text-white">Cài đặt</div>
            <div className="text-xs text-gray-600 dark:text-gray-300">Tùy chỉnh tài khoản</div>
          </div>
        </Link>

        {/* Divider */}
        <div className="h-px bg-black/10 dark:bg-white/10 my-2"></div>

        {/* Trang chủ */}
        <Link
          href="/"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/20 transition-all duration-200"
          onClick={onMenuClose}
        >
          <Home className="w-5 h-5 text-gray-800 dark:text-white" />
          <div className="font-medium text-gray-800 dark:text-white">Trang chủ</div>
        </Link>

        {/* Hướng dẫn */}
        <Link
          href="/guide"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/20 transition-all duration-200"
          onClick={onMenuClose}
        >
          <HelpCircle className="w-5 h-5 text-gray-800 dark:text-white" />
          <div className="font-medium text-gray-800 dark:text-white">Hướng dẫn</div>
        </Link>

        {/* Phí dịch vụ */}
        <Link
          href="/pricing"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/20 transition-all duration-200"
          onClick={onMenuClose}
        >
          <CreditCard className="w-5 h-5 text-gray-800 dark:text-white" />
          <div className="font-medium text-gray-800 dark:text-white">Phí dịch vụ</div>
        </Link>

        {/* Hỗ trợ */}
        <Link
          href="/support"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/20 transition-all duration-200"
          onClick={onMenuClose}
        >
          <LifeBuoy className="w-5 h-5 text-gray-800 dark:text-white" />
          <div className="font-medium text-gray-800 dark:text-white">Hỗ trợ</div>
        </Link>

        {/* Đội ngũ phát triển */}
        <Link
          href="/team"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/20 transition-all duration-200"
          onClick={onMenuClose}
        >
          <Users className="w-5 h-5 text-gray-800 dark:text-white" />
          <div className="font-medium text-gray-800 dark:text-white">Đội ngũ phát triển</div>
        </Link>

        {/* Divider */}
        <div className="h-px bg-black/10 dark:bg-white/10 my-2"></div>

        {/* Đăng xuất */}
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/20 transition-all duration-200 w-full text-left"
        >
          <LogOut className="w-5 h-5 text-gray-800 dark:text-white" />
          <div>
            <div className="font-medium text-gray-800 dark:text-white">Đăng xuất</div>
            <div className="text-xs text-gray-600 dark:text-gray-300">Thoát khỏi tài khoản</div>
          </div>
        </button>
      </div>
    </div>
  )
}
