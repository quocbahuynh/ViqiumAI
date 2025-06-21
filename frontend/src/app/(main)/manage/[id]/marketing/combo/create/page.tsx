"use client"
import { useState, useEffect } from "react"
import type React from "react"

import ComponentCard from "@/components/common/ComponentCard"
import PageBreadcrumb from "@/components/common/PageBreadCrumbCustom"
import DatePicker from "@/components/form/date-picker"
import Input from "@/components/form/input/InputField"
import Label from "@/components/form/Label"
import Button from "@/components/ui/button/Button"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import {
  resetPromotion,
  updatePromotionInfo,
  addProductApply,
  removeProductApply,
  updateProductPromotion,
  updateAllProductsPromotion,
} from "@/store/slices/promotion/promotionForm"
import { fetchProducts } from "@/store/slices/product/productSlice"
import { useParams } from "next/navigation"
import { PlusCircle, Trash2, Loader2, Package } from "lucide-react"
import { toast } from "sonner"
import ProductSelectionModal from "@/components/main/management/promotion/ListProductModal"
import Image from "next/image"
import type { PostPromotion, PostProductApply } from "@/types/promotionType"
import { promotionService } from "@/lib/api"
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table"
import { formatCurrency, unformatCurrency } from "@/utils/money"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import ProductTable from "@/components/main/management/promotion/TablePreview"
import { fetchVouchers } from "@/store/slices/promotion/promotion"

export default function DiscountCreatePage() {
  const params = useParams<{ id: string }>()
  const projectId = params?.id
  const dispatch = useAppDispatch()

  // Get data from Redux store
  const products = useAppSelector((state) => state.products.data[projectId] || [])
  const productsStatus = useAppSelector((state) => state.products.status[projectId] || "idle")
  const promotion = useAppSelector((state) => state.promotionForm.promotion)

  // Local state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [promoteType, setPromoteType] = useState<"percent" | "fixed">("percent")
  const [percentValue, setPercentValue] = useState<number>(0)

  // Fetch products if not already loaded
  useEffect(() => {
    if (projectId && productsStatus === "idle") {
      dispatch(fetchProducts(projectId))
    }
  }, [dispatch, projectId, productsStatus])

  // Reset promotion form on component mount
  useEffect(() => {
    dispatch(resetPromotion())
  }, [dispatch])

  // Handle promotion type change
  const handlePromoteTypeChange = (type: "percent" | "fixed") => {
    setPromoteType(type)

    // Update all products with the new promotion type
    if (promotion.productApply.length > 0) {
      dispatch(
        updateAllProductsPromotion({
          promoteType: type,
          promotePricing: type === "percent" ? percentValue : 0,
        }),
      )
    }
  }

  // Handle percent value change for all products
  const handlePercentChange = (value: number) => {
    setPercentValue(value)
    if (promoteType === "percent" && promotion.productApply.length > 0) {
      dispatch(
        updateAllProductsPromotion({
          promoteType: "percent",
          promotePricing: value,
        }),
      )
    }
  }

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    dispatch(updatePromotionInfo({ [field]: value }))
  }

  // Handle date changes with validation
  const handleDateChange = (field: "startTime" | "endTime", dateString: string) => {
    const selectedDate = new Date(dateString)
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset time to start of day for comparison

    if (field === "startTime") {
      // Validate startDate >= today
      if (selectedDate < today) {
        toast.error("Thời gian bắt đầu không được trước ngày hiện tại")
        return
      }

      // If endTime exists, validate endTime > startTime
      if (promotion.endTime) {
        const endDate = new Date(promotion.endTime)
        if (endDate <= selectedDate) {
          toast.error("Thời gian kết thúc phải sau thời gian bắt đầu")
          dispatch(updatePromotionInfo({ endTime: "" })) // Reset endTime if invalid
        }
      }
    } else if (field === "endTime") {
      // Validate endTime > startTime
      if (promotion.startTime) {
        const startDate = new Date(promotion.startTime)
        if (selectedDate <= startDate) {
          toast.error("Thời gian kết thúc phải sau thời gian bắt đầu")
          return
        }
      }
    }

    dispatch(updatePromotionInfo({ [field]: dateString }))
  }

  // Open product selection modal
  const handleAddProducts = () => {
    setIsModalOpen(true)
  }

  // Handle product selection
  const handleProductSelect = (selectedProducts: any[]) => {
    selectedProducts.forEach((product) => {
      // Check if product is already in the list
      const exists = promotion.productApply.some((item) => item.product._id === product._id)
      if (!exists) {
        dispatch(addProductApply(product))

        // If percent type is selected, apply the current percent value
        if (promoteType === "percent") {
          dispatch(
            updateProductPromotion({
              productId: product._id,
              promoteType: "percent",
              promotePricing: percentValue,
            }),
          )
        }
      }
    })
    setIsModalOpen(false)
  }

  // Handle removing a product
  const handleRemoveProduct = (productId: string) => {
    dispatch(removeProductApply(productId))
  }

  // Handle fixed price change for a specific product
  const handleFixedPriceChange = (productId: string, price: number) => {
    dispatch(
      updateProductPromotion({
        productId,
        promoteType: "fixed",
        promotePricing: price,
      }),
    )
  }

  // Handle form submission
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {

    // Validate form
    if (!promotion.name) {
      toast.error("Vui lòng nhập tên khuyến mãi")
      return
    }

    if (!promotion.startTime || !promotion.endTime) {
      toast.error("Vui lòng chọn thời gian bắt đầu và kết thúc")
      return
    }

    if (promotion.productApply.length === 0) {
      toast.error("Vui lòng thêm ít nhất một sản phẩm")
      return
    }

    const postProductApply: PostProductApply[] = promotion.productApply.map((item) => ({
      productId: item.product._id,
      promoteType: item.promoteType,
      promotePricing: item.promotePricing,
    }))
    const postPromotion: PostPromotion = {
      name: promotion.name,
      startTime: promotion.startTime,
      endTime: promotion.endTime,
      promotionId: promotion.promotionId || "680cf954e0c9459af6296c25", // Sẽ được tạo bởi server nếu là tạo mới
      productApply: postProductApply,
    }

    console.log("Submitting promotion:", postPromotion)

    setIsSubmitting(true)
    try {
      // Call API to create promotion
      if (projectId) {
        const result = await promotionService.createPromotionCombo(postPromotion, projectId)
        toast.success("Tạo khuyến mãi thành công")

        // Reset form after successful submission
        dispatch(resetPromotion())
      dispatch(fetchVouchers(projectId))
      location.reload()

        // Redirect to promotion list or detail page if needed
        // router.push(`/promotion/${result.id}`)
      } else {
        toast.error("Không tìm thấy ID dự án")
      }
    } catch (error) {
      console.error("Error submitting promotion:", error)
      toast.error("Lỗi khi tạo khuyến mãi", {
        description: error instanceof Error ? error.message : "Đã xảy ra lỗi. Vui lòng thử lại sau.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const minStartDate = today // Đây là Date object
  const minEndDate = promotion.startTime
    ? new Date(new Date(promotion.startTime).getTime() + 24 * 60 * 60 * 1000)
    : undefined
  return (
    <div>
      <PageBreadcrumb pageTitle="Tạo ưu đãi combo tiết kiệm" />
        <ComponentCard title="Thông tin cơ bản">
          <div className="space-y-1 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="col-span-2">
              <Label>Tên khuyến mãi</Label>
              <Input type="text" value={promotion.name} onChange={(e) => handleInputChange("name", e.target.value)} />
            </div>
            <div className="col-span-1">
              <DatePicker
                id="start-date"
                label="Thời gian bắt đầu"
                placeholder="Chọn ngày bắt đầu"
                minDate={minStartDate} // Disable dates before today
                onChange={(dates, currentDateString) => {
                  const isoString = dates[0].toISOString()
                  handleDateChange("startTime", isoString)
                }}
              />
            </div>
            <div className="col-span-1">
              <DatePicker
                id="end-date"
                label="Thời gian kết thúc"
                placeholder="Chọn ngày kết thúc"
                minDate={minEndDate} // Disable dates before startTime + 1 day
                disabled={!promotion.startTime} // Disable endDate picker until startTime is selected
                onChange={(dates, currentDateString) => {
                  const isoString = dates[0].toISOString()
                  handleDateChange("endTime", isoString)
                }}
              />
            </div>
            <div className="col-span-2">
              <Label>Loại khuyến mãi</Label>
              <div className="flex gap-6 mt-3">
                <div className="flex">
                  <div className="flex items-center h-5">
                    <input
                      id="percent-radio"
                      aria-describedby="percent-radio-text"
                      type="radio"
                      checked={promoteType === "percent"}
                      onChange={() => handlePromoteTypeChange("percent")}
  className="w-4 h-4 accent-brand-500 focus:ring-0"
                    />
                  </div>
                  <div className="ms-2 text-sm">
                    <label htmlFor="percent-radio" className="font-sm text-gray-700 dark:text-gray-300">
                      Giảm giá phần trăm
                    </label>
                    <p id="percent-radio-text" className="text-xs font-normal text-gray-600 dark:text-gray-300">
                      Giá được giảm theo một tỷ lệ phần trăm nhất định.
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex items-center h-5">
                    <input
                      id="fixed-radio"
                      aria-describedby="fixed-radio-text"
                      type="radio"
                      checked={promoteType === "fixed"}
                      onChange={() => handlePromoteTypeChange("fixed")}
  className="w-4 h-4 accent-brand-500 focus:ring-0"
                    />
                  </div>
                  <div className="ms-2 text-sm">
                    <label htmlFor="fixed-radio" className="font-sm text-gray-700 dark:text-gray-300">
                      Giá cố định
                    </label>
                    <p id="fixed-radio-text" className="text-xs font-normal text-gray-600 dark:text-gray-300">
                      Giá là giá giảm đã đặt.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ComponentCard>

        <ComponentCard title="Sản phẩm áp dụng" className="mt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-medium">Danh sách sản phẩm</h3>
                <p className="text-sm text-gray-500">Chọn sản phẩm để áp dụng khuyến mãi</p>
              </div>
              <Button
                size="md"
                onClick={handleAddProducts}
                startIcon={<PlusCircle className="w-4 h-4" />}
              >
                Thêm sản phẩm
              </Button>
            </div>

            {promoteType === "percent" && (
              <ComponentCard>
                <Label>Phần trăm giảm giá (%)</Label>
                <div className="flex items-center mt-2">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={percentValue.toString()}
                    onChange={(e) => handlePercentChange(Number(e.target.value))}
                    className="min-w-[150px]"
                  />
                  <span className="ml-2">%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Áp dụng cho tất cả sản phẩm được chọn</p>
              </ComponentCard>
            )}

{promotion.productApply.length > 0 ? (
              <ProductTable
                products={promotion.productApply.map((item) => ({
                  ...item.product,
                  promotePricing: item.promotePricing,
                }))}
                onRemove={handleRemoveProduct}
                showPrice={true}
                showPromotePrice={true}
                promoteType={promoteType}
                onPromotePriceChange={handleFixedPriceChange}
              />
            ) : (
              <ComponentCard className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">Chưa có sản phẩm nào được thêm</p>
                <Button
                  variant="outline"
                  size="md"
                  onClick={handleAddProducts}
                  startIcon={<PlusCircle className="w-4 h-4" />}
                >
                  Thêm sản phẩm
                </Button>
              </ComponentCard>
            )}
          </div>
          <div className="mt-6 flex justify-end">
            <Button
              size="md"
              className="rounded-sm "
              disabled={isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Tạo khuyến mãi"
              )}
            </Button>
          </div>
        </ComponentCard>

      {/* Product Selection Modal */}
      <ProductSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleProductSelect}
        products={products}
        selectedProducts={promotion.productApply.map((item) => item.product._id)}
        isLoading={productsStatus === "loading"}
      />
    </div>
  )
}