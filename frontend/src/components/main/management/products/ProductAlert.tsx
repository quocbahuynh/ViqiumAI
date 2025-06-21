"use client"
import React from "react"
import { X, Crown, Zap, Star, ArrowRight } from 'lucide-react'
import ComponentCard from "@/components/common/ComponentCard"
import Button from "@/components/ui/button/Button"

interface UpgradePlanModalProps {
  isOpen: boolean
  onClose: () => void
}

const UpgradePlanModal: React.FC<UpgradePlanModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  const handleUpgrade = () => {
    // Redirect to pricing page or payment flow
    window.location.href = "/pricing"
  }

  const handleContactSales = () => {
    // Redirect to contact page or open chat
    window.location.href = "/support"
  }

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <ComponentCard className="z-999999 relative">
        {/* Header */}
            <button
            onClick={onClose}
            className="absolute top-5 right-5 rounded-full  transition-colors"
          >
            <X  size={25} />
          </button>
        {/* Content */}
        <div className="px-6 py-6">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Nâng cấp để tiếp tục sử dụng
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Mở khóa toàn bộ tính năng và tăng giới hạn sử dụng với gói Premium
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <Zap size={16} className="text-green-600 dark:text-green-400" />
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Không giới hạn số lượng AI
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <Star size={16} className="text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Tính năng AI nâng cao
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                <Crown size={16} className="text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Hỗ trợ ưu tiên 24/7
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                299,000₫
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">/tháng</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Tiết kiệm 20% khi thanh toán hàng năm
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={handleUpgrade}
              className="w-full mb-4 flex items-center justify-center gap-2"
            >
              Nâng cấp ngay
            </Button>
            
            <Button
              onClick={handleContactSales}
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              Liên hệ tư vấn
            </Button>
          </div>

          {/* Footer */}
          <div className="text-center mt-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Có thể hủy bất cứ lúc nào • Không cam kết dài hạn
            </p>
          </div>
        </div>
      </ComponentCard>
    </div>
  )
}

export default UpgradePlanModal
