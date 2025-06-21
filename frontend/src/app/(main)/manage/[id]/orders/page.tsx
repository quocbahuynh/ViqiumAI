"use client"

import { useState, useEffect, useRef } from "react"
import PageBreadcrumb from "@/components/common/PageBreadCrumbCustom"
import Alert from "@/components/ui/alert/Alert"
import { useParams } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchOrders, markOrderAsRead, deleteOrder } from "@/store/slices/orderSlice"
import Button from "@/components/ui/button/Button"
import { Card, CardContent } from "@/components/ui/card"
import OrderTable from "./components/order-list"
import { PlusCircle, RefreshCw, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import ConfirmDialog from "@/components/ui/confirm-dialog"
import ComponentCard from "@/components/common/ComponentCard"
import { Order } from "@/types/ordertype"
import { OrderDetailModal } from "./components/order-detal-modal"

export default function OrdersPage() {
  const params = useParams<{ id: string }>()
  const projectId = params?.id || "default"
  const dispatch = useAppDispatch()

  // Get data from Redux store
  const orders = useAppSelector((state) => state.orders.data[projectId] || [])
  const status = useAppSelector((state) => state.orders.status[projectId] || "idle")
  const error = useAppSelector((state) => state.orders.error[projectId] || null)

  // Modal and delete state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null)
  const [orderCodeToDelete, setOrderCodeToDelete] = useState<string>("")

  // Check if data is loading
  const isLoading = status === "loading"

  // Track previous projectId to detect changes
  const prevProjectIdRef = useRef<string | undefined>("")

  // Fetch orders only if projectId changes
  useEffect(() => {
    const projectIdChanged = prevProjectIdRef.current !== projectId
    prevProjectIdRef.current = projectId

    if (projectId && projectIdChanged && orders.length === 0 && status === "idle") {
      console.log("Fetching orders for projectId:", projectId)
      dispatch(fetchOrders(projectId))
    }
  }, [dispatch, projectId, orders.length, status])

  // Handle view order
  const handleViewOrder = async (order: Order) => {
    setSelectedOrder(order)
    setIsModalOpen(true)

    if (!order.isRead) {
      await dispatch(markOrderAsRead({ orderId: order._id, projectId })).unwrap()
    }
  }

  // Open delete confirmation dialog
  const openDeleteConfirmation = (orderId: string, orderCode: string) => {
    setOrderToDelete(orderId)
    setOrderCodeToDelete(orderCode)
    setIsDeleteDialogOpen(true)
  }

  // Handle delete order confirmation
  const confirmDeleteOrder = async () => {
    if (!orderToDelete || !projectId) return

    try {
      await dispatch(deleteOrder({ orderId: orderToDelete, projectId })).unwrap()
      setSelectedOrder(null)
    } catch (error) {
      console.error("Error deleting order:", error)
    } finally {
      setIsDeleteDialogOpen(false)
      setOrderToDelete(null)
      setOrderCodeToDelete("")
    }
  }

  // Cancel delete
  const cancelDeleteOrder = () => {
    setIsDeleteDialogOpen(false)
    setOrderToDelete(null)
    setOrderCodeToDelete("")
  }

  // Handle refresh
  const handleRefresh = () => {
    if (projectId) {
      dispatch(fetchOrders(projectId))
      toast.info("Đang làm mới dữ liệu", {
        description: "Danh sách đơn hàng đang được cập nhật.",
      })
    }
  }

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedOrder(null)
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Đơn hàng" />

      <Alert
        variant="info"
        title="Hãy giới thiệu về các đơn hàng của bạn cho AI"
        message="Giúp AI hiểu rõ doanh nghiệp của bạn đang xử lý đơn hàng như thế nào."
        showLink={false}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1 mt-3">
        <div className="space-y-6">
          <ComponentCard className="overflow-hidden">
            <div className="flex flex-col gap-2 mb-6 sm:flex-row sm:items-center sm:justify-between pt-6">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Hiển thị <span className="font-medium text-gray-700 dark:text-gray-300">{orders.length}</span> đơn hàng
              </div>
              <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                <Button
                  size="md"
                  variant="outline"
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="rounded-lg border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                  Làm mới
                </Button>
                {/* Thêm nút "Thêm đơn hàng" nếu cần (tùy thuộc vào yêu cầu) */}
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

            <OrderTable
              orders={orders}
              isLoading={isLoading}
              onViewOrder={handleViewOrder}
              onDelete={(orderId, orderCode) => openDeleteConfirmation(orderId, orderCode)}
            />
          </ComponentCard>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          isOpen={isModalOpen}
          onOpenChange={handleModalClose}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Xác nhận xóa đơn hàng"
        message={`Bạn có chắc chắn muốn xóa đơn hàng "${orderCodeToDelete}" không? Hành động này không thể hoàn tác.`}
        confirmText="Xóa đơn hàng"
        cancelText="Hủy"
        onConfirm={confirmDeleteOrder}
        onCancel={cancelDeleteOrder}
        variant="danger"
      />
    </div>
  )
}