"use client"

import FeedbackWidget from "@/components/main/dashboard/FeedbackWidget"
import { useSidebar } from "@/context/SidebarContext"
import AppHeader from "@/layout/AppHeader"
import AppSidebarCustom from "@/layout/AppSidebarCustom"
import Backdrop from "@/layout/Backdrop"
import { signOut, useSession } from "next-auth/react"
import { Lexend } from "next/font/google"
import { useParams, useRouter } from "next/navigation"
import React, { useEffect } from "react"
import { Toaster } from "sonner"
const outfit = Lexend({
  subsets: ["latin"],
});
export default function ManagementLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session && (!session?.user?.token || !session?.user?.profile)) {
      console.log("Invalid session or refresh error, signing out...");
      signOut({ redirect: true, callbackUrl: "/" })
    }
  }, [status, session, router])

  const { isExpanded, isHovered, isMobileOpen } = useSidebar()
  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[290px]"
      : "lg:ml-[90px]"
  const params = useParams<{ id: string }>()
  const projectId = params?.id
  return (
    <div className={`${outfit.className} flex h-screen overflow-hidden  dark:bg-gray-900`}>
      {/* Sidebar */}
      <AppSidebarCustom projectId={projectId} />
      <Backdrop />
      <Toaster />

      {/* Main Content */}
      <div className="flex flex-col flex-1 w-full overflow-x-hidden">
        <AppHeader />
        <main className="flex-1 bg-transparent relative overflow-y-auto px-4 sm:px-6 py-4 sm:py-6">
          {children}
          <FeedbackWidget />
        </main>
      </div>
    </div>

  )
}

