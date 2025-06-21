"use client"

import Button from "@/components/ui/button/Button"
import { apiLinks } from "@/lib/api-link"
import axiosInstance from "@/lib/axios-config"
import { truncateText } from "@/utils/truncate"
import axios from "axios"
import { Facebook, Link2Off } from "lucide-react"
import type React from "react"

interface FanpageConnectionProps {
  projectId: string
  token: string | undefined
  fanpageConnected: string | null
  onOpenBreakModal: () => void
  onOpenConnectModal: (pageList: any[]) => void
}

const FanpageConnection: React.FC<FanpageConnectionProps> = ({
  projectId,
  token,
  fanpageConnected,
  onOpenBreakModal,
  onOpenConnectModal,
}) => {
  const handleFacebookLogin = () => {
    if (!window.FB) return console.error("Facebook SDK not loaded")

    window.FB.login(
      (response: any) => {
        if (response.authResponse) {
          const accessToken = response.authResponse.accessToken
          fetchPages(accessToken)
        }
      },
      {
        scope: "public_profile,email,pages_messaging,pages_show_list,pages_manage_metadata",
      },
    )
  }

  const fetchPages = async (accessToken: string) => {
    try {
      const res = await axiosInstance.post(
        `${apiLinks.project.pagesList}/pages-list`,
        { accessToken },
        
      )

      const pageList = res.data.data
      onOpenConnectModal(pageList)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="w-full rounded-xl bg-gray-50 dark:bg-gray-800/30 px-4 py-5 text-center">
      {fanpageConnected ? (
        <Button
          onClick={onOpenBreakModal}
          variant="primary"
          size="md"
          className="bg-yellow-500 hover:bg-yellow-600 w-full"
          startIcon={<Link2Off className="w-4 h-4" />}
        >
          {truncateText(fanpageConnected, 15)}
        </Button>
      ) : (
        <Button
          onClick={handleFacebookLogin}
          variant="primary"
          size="md"
          className="w-full"
          startIcon={<Facebook className="w-4 h-4" />}
        >
          Kết nối Fanpage
        </Button>
      )}
    </div>
  )
}

export default FanpageConnection
