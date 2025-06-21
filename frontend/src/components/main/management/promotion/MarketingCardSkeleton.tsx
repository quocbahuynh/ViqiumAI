"use client"

import { Skeleton } from "@/components/ui/skeleton"
import ComponentCard from "@/components/common/ComponentCard"

export const MarketingCardSkeleton = () => {
  return (
    <ComponentCard className="flex flex-col h-full overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] transition-all duration-200">
      <div className="flex flex-col h-full justify-between ">
        {/* Icon Skeleton */}
        <Skeleton className="mb-5 h-14 w-14 rounded-xl" />

        {/* Content Skeleton */}
        <div className="flex-grow">
          <Skeleton className="mb-2 h-6 w-3/4" /> {/* Placeholder cho tiêu đề */}
          <Skeleton className="h-4 w-full mb-2" /> {/* Placeholder cho mô tả */}
          <Skeleton className="h-4 w-5/6" /> {/* Placeholder cho mô tả (dòng thứ 2) */}
        </div>

        {/* Actions Skeleton */}
        <div className="flex gap-3 mt-6">
          <Skeleton className="h-9 w-24 rounded-md" /> {/* Placeholder cho nút "Tạo" */}
          <Skeleton className="h-9 w-28 rounded-md" /> {/* Placeholder cho nút "Tìm hiểu" */}
        </div>
      </div>
    </ComponentCard>
  )
}