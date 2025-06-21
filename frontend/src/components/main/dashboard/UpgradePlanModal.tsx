"use client"

import React from "react"
import { X, Crown } from 'lucide-react'
import ComponentCard from "@/components/common/ComponentCard"
import { useRouter } from "next/navigation"
import Link from "next/link"
import CountdownTimer from "@/components/calendar/CountdownTimer"

interface UpgradePlanModalProps {
  isOpen: boolean
  onClose: () => void
}

const UpgradePlanModal: React.FC<UpgradePlanModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleUpgrade = () => {
    window.location.href = "/pricing";
  }

  return (
    <div className="fixed inset-0 z-99999999999999 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <ComponentCard className="z-[10000] relative w-full max-w-[500px] animate-fadeInUp">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Content */}
        <div className="px-8 py-10 text-center">
          <div className="mb-1">
            <h2 className="text-2xl font-bold text-gray-800">CƠ HỘI CHỈ CÒN</h2>
            <CountdownTimer />
          </div>

          <div className="mb-6">
            <p className="text-gray-600 mt-3 text-base">
              Đăng ký để nhận ngay <strong className="text-red-500">ưu đãi giảm giá 40%</strong>
            </p>
          </div>

          {/* Actions */}
          <Link
            href="/signup"
            className="w-full inline-block bg-brand-500 text-white font-semibold py-3 rounded-lg shadow-md hover:opacity-90 transition"
          >
            Đăng ký ngay
          </Link>

          {/* Footer note */}
          <div className="bg-gray-10 mt-6 rounded-lg p-4 text-sm text-gray-500 w-full">
            Ưu đãi có hạn · Có thể hủy bất cứ lúc nào · <br />Áp dụng cho khách hàng mới
          </div>
        </div>
      </ComponentCard>
    </div>
  )
}

export default UpgradePlanModal
