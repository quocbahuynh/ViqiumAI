"use client"

import Button from "@/components/ui/button/Button"
import type { PromotionType } from "@/types/promotionType"
import { usePathname, useRouter } from "next/navigation"
import { Percent, Gift, Package, ShoppingCart } from "lucide-react"
import ComponentCard from "@/components/common/ComponentCard"

interface MarketingCardProps {
  data: PromotionType
}

export default function MarketingCard({ data }: MarketingCardProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleRedirect = () => {
    router.push(`${pathname}/${data.pathCreate}`)
  }

  return (
    <ComponentCard className="flex flex-col h-full overflow-hidden ">
      <div className="flex flex-col h-full justify-between">
        {/* Icon */}
        <div className="mb-5 flex h-14 w-14 items-center justify-start text-[#a1cf3e] dark:bg-green-900/20 dark:text-green-400 shadow-none">
          {(() => {
            if (data.pathCreate === "/discount/create") {
              return <Percent className="w-7 h-7" />;
            } else if (data.pathCreate === "/gift/create") {
              return <Gift className="w-7 h-7" />;
            } else if (data.pathCreate === "/combo/create") {
              return <Package className="w-7 h-7" />;
            } else if (data.pathCreate === "/bluk/create") {
              return <ShoppingCart className="w-7 h-7" />;
            } else {
              return (
                <svg
                  className="fill-current"
                  width={28}
                  height={28}
                  viewBox="0 0 28 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M13.6147 4.39464C13.8572 4.2734 14.1426 4.2734 14.385 4.39464L21.8797 8.14188L14.3973 11.883C14.1471 12.0081 13.8526 12.0081 13.6024 11.883L6.11997 8.14188L13.6147 4.39464ZM5.02148 9.57978V18.7772C5.02148 19.1035 5.20581 19.4017 5.49762 19.5476L13.1109 23.3542V13.6016C13.0079 13.5652 12.9066 13.5222 12.8076 13.4727L5.02148 9.57978ZM14.8883 23.3544L22.5021 19.5476C22.7939 19.4017 22.9782 19.1035 22.9782 18.7772V9.57978L15.1921 13.4727C15.0929 13.5223 14.9915 13.5653 14.8883 13.6018L14.8883 23.3544ZM14.7825 3.59978L15.1799 2.80493C14.437 2.43351 13.5627 2.43351 12.8198 2.80493L4.70279 6.86333C3.80884 7.3103 3.24414 8.22398 3.24414 9.22344V18.7772C3.24414 19.7767 3.80883 20.6904 4.70279 21.1373L12.8198 25.1958L13.2172 24.4009L12.8198 25.1958C13.5627 25.5672 14.437 25.5672 15.1799 25.1958L23.2969 21.1373C24.1909 20.6904 24.7556 19.7767 24.7556 18.7772V9.22344C24.7556 8.22398 24.1909 7.3103 23.2969 6.86333L15.1799 2.80493L14.7825 3.59978Z"
                    fill="currentColor"
                  />
                </svg>
              );
            }
          })()}
        </div>

        {/* Content */}
        <div className="flex-grow">
          <h4 className="mb-3 text-md font-semibold text-dark dark:text-white/90">{data.name}</h4>
          <p className="text-sm leading-6 text-gray-500 dark:text-gray-400 mb-6">{data.description}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-auto">
          <Button
            size="md"
            onClick={handleRedirect}
            className=""
          >
            Tạo
          </Button>
          <Button
            size="md"
            disabled
            variant="outline"
            className="px-4 py-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-1.5"
          >
            Tìm hiểu
          </Button>
        </div>
      </div>
    </ComponentCard>
  )
}