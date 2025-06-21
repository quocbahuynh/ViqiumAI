"use client"
import { useState, useEffect, useRef } from "react"
import PageBreadcrumb from "@/components/common/PageBreadCrumbCustom"
import Alert from "@/components/ui/alert/Alert"
import { useParams, useRouter } from "next/navigation"
import Button from "@/components/ui/button/Button"
import { RefreshCw, AlertCircle, PlusCircle } from "lucide-react"
import { toast } from "sonner"
import ComponentCard from "@/components/common/ComponentCard"
import VoucherTable, { ApiVoucher } from "@/components/main/management/campaign/CampaignTable"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchVouchers, deleteVoucher } from "@/store/slices/promotion/promotion"
import ConfirmDialog from "@/components/ui/confirm-dialog"

export default function VoucherPage() {
  const params = useParams<{ id: string }>()
  const projectId = params?.id
  const dispatch = useAppDispatch()
  const router = useRouter()

  // Get data from Redux store with a check for projectId
  const vouchers = useAppSelector((state) => (projectId ? state.promotion.vouchers[projectId] : []) || []);
  const status = useAppSelector((state) => (projectId ? state.promotion.status[projectId] : "idle") || "idle");
  const error = useAppSelector((state) => (projectId ? state.promotion.error[projectId] : null) || null);

  // Track previous projectId to detect actual value changes
  const prevProjectIdRef = useRef<string | undefined>("")

  // Fetch vouchers only if projectId changes and data is not already in store
  useEffect(() => {
    // Check if projectId has actually changed in value
    const projectIdChanged = prevProjectIdRef.current !== projectId

    // Update prevProjectIdRef with the current projectId
    prevProjectIdRef.current = projectId

    // Only fetch if projectId exists, projectId has changed, and data is not already in store
    if (projectId && projectIdChanged && vouchers.length === 0 && status === "idle") {
      dispatch(fetchVouchers(projectId))
    }
  }, [dispatch, projectId, vouchers.length, status])

  // Handle refresh
  const handleRefresh = () => {
    if (projectId) {
      dispatch(fetchVouchers(projectId))
      toast.info("Đang làm mới dữ liệu", {
        description: "Danh sách voucher đang được cập nhật.",
      })
    }
  }

  // Delete confirmation dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [voucherToDelete, setVoucherToDelete] = useState<string | null>(null)
  const [voucherNameToDelete, setVoucherNameToDelete] = useState<string>("")

  // Open delete confirmation dialog
  const openDeleteConfirmation = (voucherId: string, voucherName: string) => {
    setVoucherToDelete(voucherId)
    setVoucherNameToDelete(voucherName)
    setIsDeleteDialogOpen(true)
  }

  // Handle delete voucher confirmation
  const confirmDeleteVoucher = async () => {
    if (!voucherToDelete || !projectId) return

    try {
      await dispatch(deleteVoucher({ projectId, voucherId: voucherToDelete, voucherName: voucherNameToDelete })).unwrap()
    } catch (error) {
      console.error("Error deleting voucher:", error)
    } finally {
      // Close dialog and reset state
      setIsDeleteDialogOpen(false)
      setVoucherToDelete(null)
      setVoucherNameToDelete("")
    }
  }

  // Cancel delete
  const cancelDeleteVoucher = () => {
    setIsDeleteDialogOpen(false)
    setVoucherToDelete(null)
    setVoucherNameToDelete("")
  }

  // Handle delete voucher (open confirmation dialog)
  const handleDeleteVoucher = (voucherId: string, voucherName: string) => {
    openDeleteConfirmation(voucherId, voucherName)
  }

  // Check if error is 404 (no vouchers)
  const is404Error = error && error.toLowerCase().includes("404")

  return (
    <>
      <PageBreadcrumb pageTitle="Chương trình khuyến mãi" />

      <Alert
        variant="info"
        title="AI sẽ sử dụng dữ liệu khuyến mãi để hỗ trợ tư vấn khách hàng"
        message="Theo dõi và quản lý các chương trình khuyến mãi giúp AI đưa ra đề xuất phù hợp, góp phần tăng trưởng doanh số."
        showLink={false}
      />


      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1 mt-3">
        <div className="space-y-6">
          <ComponentCard className="overflow-hidden">
            <div className="flex flex-col gap-2 mb-6 sm:flex-row sm:items-center sm:justify-between pt-6">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Hiển thị <span className="font-medium text-gray-700 dark:text-gray-300">{vouchers.length}</span> chương trình khuyến mãi
              </div>
              <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                <Button
                  size="md"
                  variant="outline"
                  onClick={handleRefresh}
                  disabled={status === "loading"}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${status === "loading" ? "animate-spin" : ""}`} />
                  Làm mới
                </Button>
                <Button
                  size="md"
                  onClick={() => router.push(`/manage/${projectId || ""}/marketing`)}
                  startIcon={<PlusCircle className="w-4 h-4" />}
                >
                  Thêm khuyến mãi
                </Button>
              </div>
            </div>

            {error && !is404Error && (
              <div className="mx-6 mb-6 p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium">Lỗi khi tải dữ liệu</h4>
                  <p className="text-sm mt-1">{error}</p>
                  <Button
                    variant="outline"
                    size="md"
                    onClick={handleRefresh}
                  >
                    Thử lại
                  </Button>
                </div>
              </div>
            )}

            <VoucherTable
              vouchers={vouchers}
              isLoading={status === "loading"}
              onDelete={handleDeleteVoucher}
              is404Error={is404Error || false}
            />
          </ComponentCard>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Xác nhận xóa khuyến mãi"
        message={`Bạn có chắc chắn muốn xóa khuyến mãi "${voucherNameToDelete}" không? Hành động này không thể hoàn tác.`}
        confirmText="Xóa khuyến mãi"
        cancelText="Hủy"
        onConfirm={confirmDeleteVoucher}
        onCancel={cancelDeleteVoucher}
        variant="danger"
      />
    </>
  )
}