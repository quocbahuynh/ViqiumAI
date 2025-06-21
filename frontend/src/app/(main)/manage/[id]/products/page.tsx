"use client"
import { useState, useEffect, useRef } from "react"
import PageBreadcrumb from "@/components/common/PageBreadCrumbCustom"
import Alert from "@/components/ui/alert/Alert"
import { useParams } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchProducts } from "@/store/slices/product/productSlice"
import Button from "@/components/ui/button/Button"
import type { PostProduct } from "@/types/productType"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import ProductTable from "@/components/main/management/products/ProductTable"
import { PlusCircle, RefreshCw, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { createProduct, updateProduct, deleteProduct } from "@/store/slices/product/productSlice"
import { resetForm, setProductForm } from "@/store/slices/product/productFormSlice"
import { resetClassification, updateClassificationsState } from "@/store/slices/product/variantClassificationSlice"
import AddProductForm from "@/components/main/management/products/AddProductModal/ProductForm"
import ConfirmDialog from "@/components/ui/confirm-dialog"
import ComponentCard from "@/components/common/ComponentCard"
import { productsApi } from "@/lib/api"
import UpgradePlanModal from "@/components/main/management/products/ProductAlert"

export default function ProductPage() {
  const params = useParams<{ id: string }>()
  const projectId = params?.id
  const dispatch = useAppDispatch()

  const products = useAppSelector((state) => state.products.data[projectId] || [])
  const status = useAppSelector((state) => state.products.status[projectId] || "idle")
  const error = useAppSelector((state) => state.products.error[projectId] || null)

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingProductDetail, setIsLoadingProductDetail] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false)
  const handleCloseUpgradeModal = () => {
    setShowUpgradeModal(false)
  }
  // Delete confirmation dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<string | null>(null)
  const [productNameToDelete, setProductNameToDelete] = useState<string>("")

  // Check if data is loading
  const isLoading = status === "loading"

  // Track previous projectId to detect actual value changes
  const prevProjectIdRef = useRef<string | undefined>("")

  // Fetch products only if projectId changes and data is not already in store
  useEffect(() => {
    const projectIdChanged = prevProjectIdRef.current !== projectId
    prevProjectIdRef.current = projectId

    if (projectId && projectIdChanged && products.length === 0 && status === "idle") {
      console.log("Fetching products for projectId:", projectId);
      dispatch(fetchProducts(projectId));
    }
  }, [dispatch, projectId, products.length, status])

  
  // Handle form submission
  const handleSubmitProduct = async (product: PostProduct) => {
    setIsSubmitting(true)
    try {
      if (isEditMode && selectedProductId && projectId) {
        await dispatch(updateProduct({ productId: selectedProductId, product, projectId })).unwrap()
      } else if (projectId) {
        await dispatch(createProduct({ product, projectId })).unwrap()
        console.log
      }
      setIsModalOpen(false)
      setSelectedProductId(null)
      setIsEditMode(false)
      
    } catch (error:any) {
      if (error === 401) {
        setIsModalOpen(false)
        setShowUpgradeModal(true)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle add new product
  const handleAddProduct = () => {
    dispatch(resetForm())
    dispatch(resetClassification())
    dispatch(fetchProducts(projectId))
    setIsEditMode(false)
    setSelectedProductId(null)
    setIsModalOpen(true)
  }

  // Handle edit product
  const handleEditProduct = async (productId: string) => {
    setSelectedProductId(productId)
    setIsEditMode(true)
    setIsLoadingProductDetail(true)
    setIsModalOpen(true) // Open modal immediately to show loading state

    try {
      const productDetail = await productsApi.getProductDetail(productId)
      const temp: PostProduct = {
        name: productDetail.name,
        description: productDetail.description || "",
        basePhotoUrl: productDetail.basePhotoUrl || "",
        basePrice: productDetail.basePrice,
        variant: productDetail.variants || [],
      }

      dispatch(resetForm())
      dispatch(resetClassification())
      dispatch(updateClassificationsState(productDetail.classifications))
      dispatch(setProductForm(temp))
    } catch (error) {
      console.error("Error fetching product details:", error)
      toast.error("Lỗi khi tải thông tin sản phẩm", {
        description: "Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.",
      })
      setIsModalOpen(false) // Close modal if there's an error
    } finally {
      setIsLoadingProductDetail(false)
    }
  }

  // Open delete confirmation dialog
  const openDeleteConfirmation = (productId: string, productName: string) => {
    setProductToDelete(productId)
    setProductNameToDelete(productName)
    setIsDeleteDialogOpen(true)
  }

  // Handle delete product confirmation
  const confirmDeleteProduct = async () => {
    if (!productToDelete || !projectId) return

    try {
      await dispatch(deleteProduct({ productId: productToDelete, projectId, productName: productNameToDelete })).unwrap()
    } catch (error) {
      console.error("Error deleting product:", error)
    } finally {
      setIsDeleteDialogOpen(false)
      setProductToDelete(null)
      setProductNameToDelete("")
    }
  }

  // Cancel delete
  const cancelDeleteProduct = () => {
    setIsDeleteDialogOpen(false)
    setProductToDelete(null)
    setProductNameToDelete("")
  }

  // Handle refresh
  const handleRefresh = () => {
    if (projectId) {
      dispatch(fetchProducts(projectId))
      toast.info("Đang làm mới dữ liệu", {
        description: "Danh sách sản phẩm đang được cập nhật.",
      })
    }
  }

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedProductId(null)
    setIsEditMode(false)
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Sản phẩm" />

      <Alert
        variant="info"
        title="Giới thiệu sản phẩm hoặc dịch vụ chủ lực của bạn cho AI"
        message="Cung cấp thông tin về các sản phẩm hoặc dịch vụ trọng tâm để AI hiểu rõ lĩnh vực kinh doanh và hỗ trợ tư vấn chính xác hơn."
        showLink={false}
      />


      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1 mt-3">
        <div className="space-y-6">
          <ComponentCard className="overflow-hidden">
            <div className="flex flex-col gap-2 mb-6 sm:flex-row sm:items-center sm:justify-between pt-6">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Hiển thị <span className="font-medium text-gray-700 dark:text-gray-300">{products.length}</span> sản phẩm
              </div>
              <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                <Button
                  size="md"
                  variant="outline"
                  onClick={handleRefresh}
                  disabled={isLoading}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                  Làm mới
                </Button>
                <Button
                  size="md"
                  onClick={handleAddProduct}
                  startIcon={<PlusCircle className="w-4 h-4" />}
                >
                  Thêm sản phẩm
                </Button>
              </div>
            </div>
            {error && (
              <div className="mx-6 mb-6 p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium">Lỗi khi tải dữ liệu</h4>
                  <p className="text-sm mt-1">{error}</p>
                  <Button
                    variant="outline"
                    size="md"
                    onClick={handleRefresh}
                    className="mt-2 border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                  >
                    Thử lại
                  </Button>
                </div>
              </div>
            )}

            <ProductTable
              products={products}
              isLoading={isLoading}
              onEdit={handleEditProduct}
              onDelete={(productId, productName) => openDeleteConfirmation(productId, productName)}
              onView={handleEditProduct}
            />
          </ComponentCard>
        </div>
      </div>

      {/* Product Form Modal */}
      <AddProductForm
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleSubmitProduct}
        isLoading={isSubmitting}
        isLoadingProductDetail={isLoadingProductDetail} // Pass the loading state
        isEditMode={isEditMode}
      />
      <UpgradePlanModal isOpen={showUpgradeModal} onClose={handleCloseUpgradeModal} />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Xác nhận xóa sản phẩm"
        message={`Bạn có chắc chắn muốn xóa sản phẩm "${productNameToDelete}" không? Hành động này không thể hoàn tác.`}
        confirmText="Xóa sản phẩm"
        cancelText="Hủy"
        onConfirm={confirmDeleteProduct}
        onCancel={cancelDeleteProduct}
        variant="danger"
      />
    </div>
  )
}