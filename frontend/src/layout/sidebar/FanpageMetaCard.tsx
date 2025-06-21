"use client"

import Button from "@/components/ui/button/Button"
import { apiLinks } from "@/lib/api-link"
import axiosInstance from "@/lib/axios-config"
import Image from "next/image"
import type React from "react"
import { useState } from "react"

interface FanpageMetaCardProps {
  fanpageName: string
  accessToken: string
  avatarUrl: string
  projectId: string
  fanpageId: string
  tokenJwt: string
  closeModal: () => void
  setFanpageName: (data: string | null) => void
}

const FanpageMetaCard: React.FC<FanpageMetaCardProps> = ({
  fanpageId,
  fanpageName,
  accessToken,
  avatarUrl,
  projectId,
  closeModal,
  setFanpageName,
}) => {
  const [isConnecting, setConnecting] = useState<boolean>(false)
  
  const connectFanpage = async () => {
    setConnecting(true)
    try {
      const data = { fanpageId, fanpageName, accessToken, avatarUrl }

      await axiosInstance.post(`${apiLinks.project.pagesList}/${projectId}/connect-fanpage`, data, {
       
      })

      setFanpageName(fanpageName)
      setConnecting(false)
      closeModal()
    } catch (error) {
      console.error(error)
      setConnecting(false)
    }
  }
  
  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
          <div className="w-20 h-14 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800 relative">
            <Image fill className="object-cover" src={avatarUrl || "/placeholder.svg"} alt={fanpageName} />
          </div>
          <div className="order-3 xl:order-2">
            <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
              {fanpageName}
            </h4>
          </div>
        </div>
        <Button size="sm" className="min-w-[200px]" onClick={connectFanpage} disabled={isConnecting}>
          {isConnecting ? "Đang kết nối..." : "Kết nối"}
        </Button>
      </div>
    </div>
  )
}

export default FanpageMetaCard
