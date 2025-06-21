"use client"

import { useState } from "react"
import { Modal } from "@/components/ui/modal"
import Button from "@/components/ui/button/Button"
import { AlertTriangle } from 'lucide-react'

interface ClearChatConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export default function ClearChatConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
}: ClearChatConfirmationModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg m-4">
      <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl">
        <div className="flex flex-col items-center text-center mb-5">
          <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
          <div>
  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Xác nhận xóa: Hãy cẩn thận!</h3>
  <p className="text-gray-600 dark:text-gray-300 text-sm">
    <span className="font-semibold text-orange-600 dark:text-orange-400">Chú ý:</span> Xóa đoạn chat sẽ làm mất hoàn toàn nội dung cuộc trò chuyện này (ngoại trừ kiến thức bán hàng). AI sẽ không thể khôi phục bất kỳ chi tiết nào bạn đã chia sẻ. Hãy kiểm tra và lưu thông tin quan trọng trước khi xóa. Bạn có muốn tiếp tục?
  </p>
</div>
</div>
        </div>
        
        <div className="flex gap-3 justify-center">
          <Button
            variant="outline"
            size="md"
            onClick={onClose}
            className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
          >
            Hủy
          </Button>
          <Button
            size="md"
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            Xác nhận xóa
          </Button>
        </div>
      </div>
    </Modal>
  )
}
