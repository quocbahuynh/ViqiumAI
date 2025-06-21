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
  resetPromotionBulk,
  updatePromotionBulkField,
  addProduct,
  editProductBulkApply,
  addProductBulkApply,
  setPromotionBluk,
} from "@/store/slices/promotion/promotionFormBulk"
import { fetchProducts } from "@/store/slices/product/productSlice"
import { useParams } from "next/navigation"
import { PlusCircle, Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"
import ProductSelectionModal from "@/components/main/management/promotion/ListProductModal"
import ProductTable from "@/components/main/management/promotion/TablePreview"
import { Product } from "@/types/productType"
import { promotionService } from "@/lib/api"
import { PostProductBulkApply, PostPromotionBulk, ProductBulkApply, PromotionBulk } from "@/types/promotionType"
import axiosInstance from "@/lib/axios-config"
import { apiLinks } from "@/lib/api-link"
import { fetchVouchers } from "@/store/slices/promotion/promotion"

export default function PromotionBulkCreatePage() {
  const params = useParams<{ id: string; voucherId?: string }>()
  const projectId = params?.id
  const promotionId = params?.voucherId
  const dispatch = useAppDispatch()

  // Lấy dữ liệu từ Redux store
  const products = useAppSelector((state) => state.products.data[projectId] || [])
  const productsStatus = useAppSelector((state) => state.products.status[projectId] || "idle")
  const promotionBulk = useAppSelector((state) => state.promotionFormBulk.promotionBulk)

  // Local state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalTarget, setModalTarget] = useState<"product" | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch products nếu chưa load
  useEffect(() => {
    if (projectId && productsStatus === "idle") {
      dispatch(fetchProducts(projectId))
    }
  }, [dispatch, projectId, productsStatus])

  // Fetch promotion details nếu có promotionId
  useEffect(() => {
    const fetchPromotionDetail = async () => {
      if (!projectId || !promotionId) {
        console.log("Missing projectId or promotionId, initializing new promotion")
        dispatch(resetPromotionBulk())
        dispatch(addProductBulkApply({ promoteTarget: 0, promoteType: "percent", promotePricing: 0 }))
        return
      }

      try {
        const res = await axiosInstance.get(
          `${apiLinks.promote.createPromotionBulk}/${projectId}/${promotionId}`
        )        
        const data = res.data.data
        console.log("Fetched promotion:", data)

        if (data) {
          // Cập nhật thông tin cơ bản
          dispatch(setPromotionBluk(data))
        } else {
          toast.error("Không thể tải thông tin khuyến mãi")
        }
      } catch (error) {
        console.error("Lỗi khi fetch promotion:", error)
        toast.error("Lỗi khi tải thông tin khuyến mãi")
      }
    }

    fetchPromotionDetail()
  }, [dispatch, projectId, promotionId])

  // Xử lý thay đổi input
  const handleInputChange = (field: keyof PromotionBulk, value: string) => {
    dispatch(updatePromotionBulkField({ [field]: value }))
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
      if (promotionBulk.endTime) {
        const endDate = new Date(promotionBulk.endTime)
        if (endDate <= selectedDate) {
          toast.error("Thời gian kết thúc phải sau thời gian bắt đầu")
          dispatch(updatePromotionBulkField({ endTime: "" }))
        }
      }
    } else if (field === "endTime") {
      if (promotionBulk.startTime) {
        const startDate = new Date(promotionBulk.startTime)
        if (selectedDate <= startDate) {
          toast.error("Thời gian kết thúc phải sau thời gian bắt đầu")
          return
        }
      }
    }

    dispatch(updatePromotionBulkField({ [field]: date.toISOString() }))
  }

  // Mở modal để thêm sản phẩm
  const handleAddProducts = (target: "product") => {
    setModalTarget(target)
    setIsModalOpen(true)
  }

  // Xử lý khi chọn sản phẩm từ modal
  const handleProductSelect = (selectedProducts: Product[]) => {
    if (modalTarget === "product") {
      selectedProducts.forEach((product) => {
        const exists = promotionBulk.product.some((item) => item._id === product._id)
        if (!exists) {
          dispatch(addProduct(product))
        }
      })
    }
    setIsModalOpen(false)
    setModalTarget(null)
  }

  // Xử lý xóa sản phẩm khỏi danh sách product
  const handleRemoveProduct = (productId: string) => {
    const updatedProducts = promotionBulk.product.filter((item) => item._id !== productId)
    dispatch(updatePromotionBulkField({ product: updatedProducts }))
    toast.success("Đã xóa sản phẩm khỏi danh sách mặt hàng chính")
  }

  // Xử lý thay đổi promoteTarget hoặc promotePricing của ProductBulkApply
  const handlePromoteFieldChange = (
    index: number,
    field: "promoteTarget" | "promotePricing",
    value: number
  ) => {
    const updatedProductBulkApply: ProductBulkApply = {
      ...promotionBulk.productApply[index],
      [field]: value,
    }
    dispatch(editProductBulkApply({ index, productBulkApply: updatedProductBulkApply }))
  }

  // Thêm ProductBulkApply mới
  const handleAddProductBulkApply = () => {
    if (promotionBulk.productApply.length < 2) {
      dispatch(addProductBulkApply({ promoteTarget: 0, promoteType: "percent", promotePricing: 0 }))
    } else {
      toast.error("Chỉ có thể thêm tối đa 2 bậc giảm giá")
    }
  }

  // Xóa ProductBulkApply
  const handleRemoveProductBulkApply = (index: number) => {
    if (promotionBulk.productApply.length <= 1) {
      toast.error("Phải có ít nhất 1 bậc giảm giá")
      return
    }
    const newProductApply = promotionBulk.productApply.filter((_, i) => i !== index)
    dispatch(updatePromotionBulkField({ productApply: newProductApply }))
  }

  // Chuyển đổi PromotionBulk sang PostPromotionBulk
  const convertToPostPromotionBulk = (promotionBulk: PromotionBulk): PostPromotionBulk => {
    const postProductApply: PostProductBulkApply[] = []

    promotionBulk.product.forEach((product) => {
      promotionBulk.productApply.forEach((apply) => {
        postProductApply.push({
          productId: product._id,
          promoteTarget: apply.promoteTarget,
          promoteType: apply.promoteType,
          promotePricing: apply.promotePricing,
        })
      })
    })

    return {
      name: promotionBulk.name,
      startTime: promotionBulk.startTime,
      endTime: promotionBulk.endTime,
      promotionId: promotionBulk.promotionId || "680cf954e0c9459af6296c27",
      productApply: postProductApply,
    }
  }

  // Xử lý submit form
  const handleSubmit = async () => {
    if (!promotionBulk.name) {
      toast.error("Vui lòng nhập tên khuyến mãi")
      return
    }

    if (!promotionBulk.startTime || !promotionBulk.endTime) {
      toast.error("Vui lòng chọn thời gian bắt đầu và kết thúc")
      return
    }

    if (promotionBulk.product.length === 0) {
      toast.error("Vui lòng thêm ít nhất một mặt hàng chính")
      return
    }

    if (promotionBulk.productApply.length === 2) {
      const tier1PromoteTarget = promotionBulk.productApply[0].promoteTarget
      const tier2PromoteTarget = promotionBulk.productApply[1].promoteTarget
      if (tier2PromoteTarget <= tier1PromoteTarget) {
        toast.error("Số lượng mua của bậc 2 phải lớn hơn bậc 1")
        return
      }
    }

    if (promotionBulk.productApply.some((item) => item.promotePricing <= 0 || item.promotePricing > 100)) {
      toast.error("Giá trị giảm giá phải nằm trong khoảng từ 1 đến 100%")
      return
    }

    const postPromotionBulk: PostPromotionBulk = convertToPostPromotionBulk(promotionBulk)
    setIsSubmitting(true)
    try {
      if (projectId) {
        if (promotionId) {
          await promotionService.updatePromotionBulk(postPromotionBulk, projectId, promotionId)
          toast.success("Cập nhật khuyến mãi thành công")
                dispatch(fetchVouchers(projectId))
          
        } else {
          await promotionService.createPromotionBulk(postPromotionBulk, projectId)
          toast.success("Tạo khuyến mãi thành công")
          dispatch(resetPromotionBulk())
          dispatch(addProductBulkApply({ promoteTarget: 0, promoteType: "percent", promotePricing: 0 }))
        }
      } else {
        toast.error("Không tìm thấy ID dự án")
      }
    } catch (error) {
      console.error("Error submitting promotion:", error)
      toast.error(promotionId ? "Lỗi khi cập nhật khuyến mãi" : "Lỗi khi tạo khuyến mãi", {
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
  const minEndDate = promotionBulk.startTime
    ? new Date(new Date(promotionBulk.startTime).getTime() + 24 * 60 * 60 * 1000)
    : undefined

  return (
    <div>
      <PageBreadcrumb pageTitle={promotionId ? "Chỉnh sửa mua sỉ giá hời" : "Tạo mua sỉ giá hời"} />
        <ComponentCard title="Thông tin cơ bản">
          <div className="space-y-1 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="col-span-2">
              <Label>Tên khuyến mãi</Label>
              <Input
                type="text"
                value={promotionBulk.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>
            <div className="col-span-1">
              <DatePicker
                id="start-date"
                label="Thời gian bắt đầu"
                placeholder="Chọn ngày bắt đầu"                
                defaultDate={promotionBulk.startTime ? new Date(promotionBulk.startTime) : undefined}

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
                defaultDate={promotionBulk.endTime ? new Date(promotionBulk.endTime) : undefined}

                disabled={!promotionBulk.startTime}
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

            {promotionBulk.product.length > 0 ? (
              <ProductTable
                products={promotionBulk.product}
                onRemove={handleRemoveProduct}
                showPrice={true}
                showPromotePrice={false}
              />
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">Chưa có sản phẩm nào được thêm</p>
              </div>
            )}
          </div>
        </ComponentCard>

        <ComponentCard title="Cài đặt giảm giá" className="mt-6">
          <div className="space-y-4">
            {promotionBulk.productApply.map((productBulkApply, index) => (
              <ComponentCard key={index} title={`Bậc ${index + 1}`}>
                <div className="space-y-4">
                  <div className="flex items-center justify-items- gap-4">
                    Mua
                    <div className="flex-col">
                      <Input
                        type="number"
                        min="0"
                        value={productBulkApply.promoteTarget.toString()}
                        onChange={(e) =>
                          handlePromoteFieldChange(index, "promoteTarget", Number(e.target.value))
                        }
                        className="max-w-[200px]"
                      />
                    </div>
                    hoặc nhiều sản phẩm hơn, được giảm
                    <div className="flex">
                      <Input
                        type="number"
                        min="1"
                        max="100"
                        value={productBulkApply.promotePricing.toString()}
                        onChange={(e) =>
                          handlePromoteFieldChange(index, "promotePricing", Number(e.target.value))
                        }
                        className="max-w-[200px]"
                      />
                    </div>
                    %
                    <div className="flex-1 items-center justify-end">
                      <Button
                        variant="outline"
                        size="md"
                        onClick={() => handleRemoveProductBulkApply(index)}
                        disabled={promotionBulk.productApply.length <= 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </ComponentCard>
            ))}

            {promotionBulk.productApply.length < 2 && (
              <Button
                size="md"
                variant="outline"
                onClick={handleAddProductBulkApply}
                startIcon={<PlusCircle className="w-4 h-4" />}
                className="mt-4"
              >
                Thêm bậc giảm giá
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
              ) : promotionId ? (
                "Cập nhật khuyến mãi"
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
          modalTarget === "product" ? promotionBulk.product.map((item) => item._id) : []
        }
        isLoading={productsStatus === "loading"}
      />
    </div>
  )
}