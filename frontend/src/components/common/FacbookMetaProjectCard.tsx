"use client"

import Image from "next/image"
import type React from "react"

interface FanpageMetaProjectCardProps {
    fanpageName: string
    accessToken: string
    avatarUrl: string
    fanpageId: string
    closeModal: () => void
    setFanpageData: (data: any) => void
}

const FanpageMetaProjectCard: React.FC<FanpageMetaProjectCardProps> = ({
    fanpageId,
    fanpageName,
    accessToken,
    avatarUrl,
    closeModal,
    setFanpageData
}) => {

    const connectFanpage = () => {
        const data = { fanpageId, fanpageName, accessToken, avatarUrl }
        setFanpageData(data);
        closeModal()
    }

    return (
        <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
            <div className="flex flex-row items-center justify-between">
                <div className="flex items-center w-full gap-6 xl:flex-row">
                    <div className="w-15 h-15 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800 relative">
                        <Image fill className="object-cover" src={avatarUrl || "/placeholder.svg"} alt={fanpageName} />
                    </div>
                    <div className="order-3 xl:order-2">
                        <h4 className="mb-2 text-lg font-semibold text-left text-gray-800 dark:text-white/90 xl:text-left">
                            {fanpageName}
                        </h4>
                    </div>
                </div>
                <button type="button" className="btn btn-navbar btn-sm min-w-[150px] px-4" onClick={connectFanpage}>
                    Kết nối
                </button>
            </div>
        </div>
    )
}

export default FanpageMetaProjectCard
