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
  resetPromotionGift,
  updatePromotionGiftField,
  addProduct,
  editProductGiftApply,
  addProductToProductGiftApply,
  addProductGiftApply,
} from "@/store/slices/promotion/promotionFormGift"
import { fetchProducts } from "@/store/slices/product/productSlice"
import { useParams } from "next/navigation"
import { PlusCircle, Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"
import ProductSelectionModal from "@/components/main/management/promotion/ListProductModal"
import ProductTable from "@/components/main/management/promotion/TablePreview"
import { PostProductGiftApply, PostPromotionGift, ProductGiftApply, PromotionGift } from "@/types/promotionType"
import { Product } from "@/types/productType"
import { promotionService } from "@/lib/api"
import { fetchVouchers } from "@/store/slices/promotion/promotion"

export default function PromotionGiftCreatePage() {
  const params = useParams<{ id: string }>()
  const projectId = params?.id
  const dispatch = useAppDispatch()

  // Lấy dữ liệu từ Redux store
  const products = useAppSelector((state) => state.products.data[projectId] || [])
  const productsStatus = useAppSelector((state) => state.products.status[projectId] || "idle")
  const promotionGift = useAppSelector((state) => state.promotionFormGift.promotionGift)

  // Local state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalTarget, setModalTarget] = useState<"product" | "productGift" | null>(null)
  const [currentProductGiftApplyIndex, setCurrentProductGiftApplyIndex] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch products nếu chưa load
  useEffect(() => {
    if (projectId && productsStatus === "idle") {
      dispatch(fetchProducts(projectId))
    }
  }, [dispatch, projectId, productsStatus])

  // Reset form khi component mount
  useEffect(() => {
    dispatch(resetPromotionGift())
    dispatch(addProductGiftApply({ promoteTarget: 0, productGift: [] }))
  }, [dispatch])

  // Xử lý thay đổi input
  const handleInputChange = (field: keyof PromotionGift, value: string) => {
    dispatch(updatePromotionGiftField({ [field]: value }))
  }

  // Xử lý thay đổi ngày
  const handleDateChange = (field: "startTime" | "endTime", date: Date) => {
    const selectedDate = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (field === "startTime") {
      if (selectedDate < today) {
        toast.error("Thời gian bắt đầu không được trước ngày hiện tại")
        return
      }
      if (promotionGift.endTime) {
        const endDate = new Date(promotionGift.endTime)
        if (endDate <= selectedDate) {
          toast.error("Thời gian kết thúc phải sau thời gian bắt đầu")
          dispatch(updatePromotionGiftField({ endTime: "" }))
        }
      }
    } else if (field === "endTime") {
      if (promotionGift.startTime) {
        const startDate = new Date(promotionGift.startTime)
        if (selectedDate <= startDate) {
          toast.error("Thời gian kết thúc phải sau thời gian bắt đầu")
          return
        }
      }
    }

    dispatch(updatePromotionGiftField({ [field]: date.toISOString() }))
  }

  // Mở modal để thêm sản phẩm
  const handleAddProducts = (target: "product" | "productGift", productGiftApplyIndex?: number) => {
    setModalTarget(target)
    setCurrentProductGiftApplyIndex(productGiftApplyIndex ?? null)
    setIsModalOpen(true)
  }

  // Xử lý khi chọn sản phẩm từ modal
  const handleProductSelect = (selectedProducts: Product[]) => {
    if (modalTarget === "product") {
      selectedProducts.forEach((product) => {
        const exists = promotionGift.product.some((item) => item._id === product._id)
        if (!exists) {
          dispatch(addProduct(product))
        }
      })
    } else if (modalTarget === "productGift" && currentProductGiftApplyIndex !== null) {
      selectedProducts.forEach((product) => {
        const exists = promotionGift.productApply[currentProductGiftApplyIndex].productGift.some(
          (item) => item._id === product._id
        )
        if (!exists) {
          dispatch(addProductToProductGiftApply({ index: currentProductGiftApplyIndex, product }))
        }
      })
    }
    setIsModalOpen(false)
    setModalTarget(null)
    setCurrentProductGiftApplyIndex(null)
  }

  // Xử lý xóa sản phẩm khỏi danh sách product
  const handleRemoveProduct = (productId: string) => {
    const updatedProducts = promotionGift.product.filter((item) => item._id !== productId)
    dispatch(updatePromotionGiftField({ product: updatedProducts }))
    toast.success("Đã xóa sản phẩm khỏi danh sách mặt hàng chính")
  }

  // Xử lý xóa sản phẩm quà tặng khỏi ProductGiftApply
  const handleRemoveProductGift = (applyIndex: number, productId: string) => {
    const updatedProductGiftApply = {
      ...promotionGift.productApply[applyIndex],
      productGift: promotionGift.productApply[applyIndex].productGift.filter(
        (item) => item._id !== productId
      ),
    }
    dispatch(editProductGiftApply({ index: applyIndex, productGiftApply: updatedProductGiftApply }))
    toast.success("Đã xóa sản phẩm khỏi danh sách quà tặng")
  }

  // Xử lý thay đổi promoteTarget của ProductGiftApply
  const handlePromoteTargetChange = (index: number, value: number) => {
    const updatedProductGiftApply: ProductGiftApply = {
      ...promotionGift.productApply[index],
      promoteTarget: value,
    }
    dispatch(editProductGiftApply({ index, productGiftApply: updatedProductGiftApply }))
  }

  // Thêm ProductGiftApply mới
  const handleAddProductGiftApply = () => {
    if (promotionGift.productApply.length < 2) {
      dispatch(addProductGiftApply({ promoteTarget: 0, productGift: [] }))
    } else {
      toast.error("Chỉ có thể thêm tối đa 2 bậc quà tặng")
    }
  }

  // Xóa ProductGiftApply
  const handleRemoveProductGiftApply = (index: number) => {
    if (promotionGift.productApply.length <= 1) {
      toast.error("Phải có ít nhất 1 bậc quà tặng")
      return
    }
    const newProductApply = promotionGift.productApply.filter((_, i) => i !== index)
    dispatch(updatePromotionGiftField({ productApply: newProductApply }))
  }

  // Chuyển đổi PromotionGift sang PostPromotionGift
  const convertToPostPromotionGift = (promotionGift: PromotionGift): PostPromotionGift => {
    const postProductApply: PostProductGiftApply[] = []

    promotionGift.product.forEach((product) => {
      promotionGift.productApply.forEach((apply) => {
        postProductApply.push({
          productId: product._id,
          promoteTarget: apply.promoteTarget,
          productGift: apply.productGift.map((gift) => gift._id),
        })
      })
    })

    return {
      name: promotionGift.name,
      startTime: promotionGift.startTime,
      endTime: promotionGift.endTime,
      productApply: postProductApply,
    }
  }

  // Xử lý submit form
  const handleSubmit = async () => {

    // Validate form
    if (!promotionGift.name) {
      toast.error("Vui lòng nhập tên khuyến mãi")
      return
    }

    if (!promotionGift.startTime || !promotionGift.endTime) {
      toast.error("Vui lòng chọn thời gian bắt đầu và kết thúc")
      return
    }

    if (promotionGift.product.length === 0) {
      toast.error("Vui lòng thêm ít nhất một mặt hàng chính")
      return
    }
        if (promotionGift.productApply[0].promoteTarget <= 0) {
      toast.error("Số lượng mua của bậc 1 phải lớn hơn 0")
      return
    }
      if (promotionGift.productApply.length ===2 && promotionGift.productApply[1].promoteTarget && promotionGift.productApply[1].promoteTarget <= 0) {
      toast.error("Số lượng mua của bậc 2 phải lớn hơn 0")
      return
    }

    if (promotionGift.productApply.some((item) => item.productGift.length === 0)) {
      toast.error("Mỗi bậc quà tặng phải có ít nhất một sản phẩm quà tặng")
      return
    }

    if (promotionGift.productApply.length === 2) {
      const tier1PromoteTarget = promotionGift.productApply[0].promoteTarget
      const tier2PromoteTarget = promotionGift.productApply[1].promoteTarget
      if (tier2PromoteTarget <= tier1PromoteTarget) {
        toast.error("Số lượng mua của bậc 2 phải lớn hơn bậc 1")
        return
      }
    }

    const postPromotionGift: PostPromotionGift = convertToPostPromotionGift(promotionGift)

    setIsSubmitting(true)
    try {
      if (projectId) {
        const result = await promotionService.createPromotionGift(postPromotionGift, projectId)
        toast.success("Tạo khuyến mãi thành công")
        dispatch(resetPromotionGift())
        dispatch(fetchVouchers(projectId))
        dispatch(addProductGiftApply({ promoteTarget: 0, productGift: [] }))
        location.reload()
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

  // Tính toán minDate
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const minStartDate = today
  const minEndDate = promotionGift.startTime
    ? new Date(new Date(promotionGift.startTime).getTime() + 24 * 60 * 60 * 1000)
    : undefined

  return (
    <div>
      <PageBreadcrumb pageTitle="Tạo quà tặng khi mua hàng
" />
        <ComponentCard title="Thông tin cơ bản">
          <div className="space-y-1 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="col-span-2">
              <Label className="text-sm text-gray-500 dark:text-gray-300">Tên khuyến mãi</Label>
              <Input
                placeholder="Nhập tên khuyến mãi"
                type="text"
                value={promotionGift.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>
            <div className="col-span-1">
              <DatePicker
                id="start-date"
                label="Thời gian bắt đầu"
                placeholder="Chọn ngày bắt đầu"
                minDate={minStartDate}
                onChange={(dates) => handleDateChange("startTime", dates[0])}
              />
            </div>
            <div className="col-span-1">
              <DatePicker
                id="end-date"
                label="Thời gian kết thúc"
                placeholder="Chọn ngày kết thúc"
                minDate={minEndDate}
                disabled={!promotionGift.startTime}
                onChange={(dates) => handleDateChange("endTime", dates[0])}
              />
            </div>
          </div>
        </ComponentCard>

        <ComponentCard title="Mặt hàng chính" className="mt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-medium">Danh sách sản phẩm</h3>
                <p className="text-sm text-gray-500">Chọn sản phẩm chính cho khuyến mãi</p>
              </div>
              <Button
                size="md"
                onClick={() => handleAddProducts("product")}
                startIcon={<PlusCircle className="w-4 h-4" />}
              >
                Thêm sản phẩm
              </Button>
            </div>

            {promotionGift.product.length > 0 ? (
              <ProductTable products={promotionGift.product} onRemove={handleRemoveProduct} />
            ) : (
              <ComponentCard className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">Chưa có sản phẩm nào được thêm</p>
              <Button
                variant="outline"
                size="md"
                onClick={() => handleAddProducts("product")}
                startIcon={<PlusCircle className="w-4 h-4" />}
              >
                Thêm sản phẩm
              </Button>
            </ComponentCard>
            )}
          </div>
        </ComponentCard>

        <ComponentCard title="Cài đặt quà tặng" className="mt-6">
          <div className="space-y-4">
            {promotionGift.productApply.map((productGiftApply, index) => (
              <ComponentCard key={index} title={`Bậc ${index + 1}`}>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Label className="text-green-700">Mua số lượng</Label>
                      <Input
                        type="number"
                        min="0"
                        value={productGiftApply.promoteTarget.toString()}
                        onChange={(e) => handlePromoteTargetChange(index, Number(e.target.value))}
                        className="max-w-[200px]"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="md"
                      onClick={() => handleRemoveProductGiftApply(index)}
                      disabled={promotionGift.productApply.length <= 1}
                      className="mt-6"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-base font-medium">Danh sách sản phẩm quà tặng</h3>
                      <p className="text-sm text-gray-500">Chọn sản phẩm quà tặng cho bậc này</p>
                    </div>
                    <Button
                      size="md"
                      onClick={() => handleAddProducts("productGift", index)}
                      startIcon={<PlusCircle className="w-4 h-4" />}
                    >
                      Thêm sản phẩm
                    </Button>
                  </div>

                  {productGiftApply.productGift.length > 0 ? (
                    <ProductTable
                      products={productGiftApply.productGift}
                      onRemove={(productId) => handleRemoveProductGift(index, productId)}
                    />
                  ) : (
                    <ComponentCard className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">Chưa có sản phẩm nào được thêm</p>
                    <Button
                      variant="outline"
                      size="md"
                      onClick={() => handleAddProducts("productGift", index)}
                      startIcon={<PlusCircle className="w-4 h-4" />}
                    >
                      Thêm sản phẩm
                    </Button>
                  </ComponentCard>
                  )}
                </div>
              </ComponentCard>
            ))}

            {promotionGift.productApply.length < 2 && (
              <Button
                size="md"
                variant="outline"
                onClick={handleAddProductGiftApply}
                startIcon={<PlusCircle className="w-4 h-4" />}
                className="mt-4"

              >
                Thêm bậc quà tặng
              </Button>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              size="md"
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
        selectedProducts={
          modalTarget === "product"
            ? promotionGift.product.map((item) => item._id)
            : currentProductGiftApplyIndex !== null
              ? promotionGift.productApply[currentProductGiftApplyIndex].productGift.map((item) => item._id)
              : []
        }
        isLoading={productsStatus === "loading"}
      />
    </div>
  )
}