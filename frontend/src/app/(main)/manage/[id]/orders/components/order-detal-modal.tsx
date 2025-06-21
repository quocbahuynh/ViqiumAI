"use client"

import type React from "react"
import { useState } from "react"
import { Modal } from "@/components/ui/modal"
import  Button  from "@/components/ui/button/Button"
import ConfirmDialog from "@/components/ui/confirm-dialog"
import { formatCurrency } from "@/utils/money"
import { formatDate } from "@/utils/dateFormat"
import { Trash2, X } from "lucide-react"
import { useAppDispatch } from "@/store/hooks"
import { deleteOrder } from "@/store/slices/orderSlice"
import type { Order } from "@/types/ordertype"

interface OrderDetailModalProps {
  order: Order
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function OrderDetailModal({ order, isOpen, onOpenChange }: OrderDetailModalProps) {
  const dispatch = useAppDispatch()
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteClick = () => {
    setIsConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true)
      await dispatch(deleteOrder({ orderId: order._id, projectId: order.projectId })).unwrap()
      setIsConfirmOpen(false)
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to delete order:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCancelDelete = () => {
    setIsConfirmOpen(false)
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={()=>onOpenChange(false)}
        className="sm:max-w-[600px] bg-white dark:bg-gray-900 border-0 shadow-lg"
      >
        <div className="p-6">
          <div className="border-b mt-2 pb-4 border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              {`Chi tiết đơn hàng #${order.orderCode}`}
            </h3>
          </div>

          <div className="space-y-5 mt-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <DetailItem label="Mã đơn hàng" value={order.orderCode} />
              <DetailItem label="Số điện thoại" value={order.phoneNumber} />
            </div>

            <DetailItem label="Địa chỉ" value={order.address} />

            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Giỏ hàng</h4>
              <pre className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap p-3 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 text-sm">
                {order.carts}
              </pre>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <DetailItem label="Ngày tạo" value={formatDate(order.createdAt)} />
              <DetailItem
                label="Trạng thái đọc"
                value={
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      order.isRead
                        ? "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                        : "bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300 font-medium"
                    }`}
                  >
                    {order.isRead ? "Đã đọc" : "Chưa đọc"}
                  </span>
                }
              />
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
              <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-3">Thông tin thanh toán</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <DetailItem
                  label="Tổng trước khuyến mãi"
                  value={order.totalBeforePromotion}
                />
                <DetailItem
                  label="Tổng sau khuyến mãi"
                  value={order.totalAftterPromotion}
                  highlight={true}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t pt-4 border-gray-200 dark:border-gray-700 mt-4 ">
            <Button
              onClick={handleDeleteClick}
              disabled={isDeleting}
              className="flex items-center bg-red-500 hover:bg-red-700 gap-1"
            >
              <Trash2 className="w-4 h-4" />
              {isDeleting ? "Đang xóa..." : "Xóa"}
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex items-center gap-0"
            >
              <X className="w-4 h-4" />
              Đóng
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Xác nhận xóa đơn hàng"
        message={`Bạn có chắc chắn muốn xóa đơn hàng "${order.orderCode}" không? Hành động này không thể hoàn tác.`}
        confirmText={isDeleting ? "Đang xóa..." : "Xóa đơn hàng"}
        cancelText="Hủy"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        variant="danger"
      />
    </>
  )
}

interface DetailItemProps {
  label: string
  value: string | React.ReactNode
  highlight?: boolean
}

function DetailItem({ label, value, highlight = false }: DetailItemProps) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{label}</h4>
      {typeof value === "string" ? (
        <p
          className={`${
            highlight ? "text-lg font-medium text-brand-600 dark:text-brand-400" : "text-gray-600 dark:text-gray-400"
          }`}
        >
          {value}
        </p>
      ) : (
        value
      )}
    </div>
  )
}