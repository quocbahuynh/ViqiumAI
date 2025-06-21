"use client";
import React, { useEffect, useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useDispatch } from "react-redux";
import Button from "../ui/button/Button";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { ChevronDown, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getUserInitials } from "@/utils/name";
import { truncateText } from "@/utils/truncate";
import { Progress } from "../ui/progress";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchPlan } from "@/store/slices/plan";


export default function UserDropdown() {
  const {data:session} = useSession()
  const router = useRouter();
  const profile = session?.user.profile
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }

  function closeDropdown() {
    setIsOpen(false);
  }
  const getInitials = (name?: string) => {
    if (!name) return "U"
    const names = name.trim().split(" ")
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase()
    }
    return name[0]?.toUpperCase() || "U"
  }
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

  const user = getInitials(profile?.fullName)

  // Component Avatar với tên
  const UserAvatar = () => (
    <div className="flex items-center gap-2">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#b1e346] to-[#8bc34a] flex items-center justify-center text-white font-bold ring-2 ring-white/20">
        {user}
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="font-semibold text-sm text-gray-900 dark:text-white max-w-[120px] truncate">
          {truncateText(profile?.fullName||"",15)}
        </span>
        <div className="text-xs text-gray-500 flex items-center gap-0.5 dark:text-gray-400">
{plan?.usage}/{plan?.limit} 
            <Progress value={percent} />
          </div>

      </div>
    </div>
  )

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700  dark:text-gray-400 dropdown-toggle"
      >
                    <div className="flex items-center gap-2 cursor-pointer">
            <UserAvatar/>

                      <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </div>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        <div>
          <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
            {profile && profile.fullName}
          </span>
          <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
            {profile && profile.email}
          </span>
        </div>

        <Button
          variant="primary"
          className="mt-3"
          onClick={() => {
    signOut({ callbackUrl: "/" })
          }}
          startIcon={
            <svg className="w-5 h-5 text-whitedark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2" />
            </svg>
          }
        >
          Đăng xuất
        </Button>
      </Dropdown>
    </div>
  );
}
