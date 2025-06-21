"use client"

import PageBreadcrumb from '@/components/common/PageBreadCrumbCustom'
import MarketingCard from '@/components/main/management/promotion/MarketingCard'
import { MarketingCardSkeleton } from '@/components/main/management/promotion/MarketingCardSkeleton'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { useEffect } from 'react'
import { fetchPromotionTypes } from '@/store/slices/promotion/createPromotion'
import Alert from '@/components/ui/alert/Alert'

export default function MarketingPage() {
  const dispatch = useAppDispatch()

  // Get data from Redux store
  const promotionTypes = useAppSelector((state) => state.promotionCreate.promotionTypes)
  const status = useAppSelector((state) => state.promotionCreate.status)

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPromotionTypes())
    }
  }, [dispatch, status])

  return (
    <div>

      <PageBreadcrumb pageTitle="Tạo khuyến mãi" />
      <Alert
        variant="info"
        title="AI sẽ sử dụng dữ liệu khuyến mãi để hỗ trợ tư vấn khách hàng"
        message="Theo dõi và quản lý các chương trình khuyến mãi giúp AI đưa ra đề xuất phù hợp, góp phần tăng trưởng doanh số."
        showLink={false}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-2 mt-3">
        {status === "loading" ? (
          // Hiển thị skeleton khi đang tải
          [...Array(4)].map((_, i) => (
            <div key={i}>
              <MarketingCardSkeleton />
            </div>
          ))
        ) : (
          // Hiển thị dữ liệu thực khi tải xong
          promotionTypes.map((p, i) => (
            <div key={i}>
              <MarketingCard data={p} />
            </div>
          ))
        )}
      </div>
    </div>
  )
}