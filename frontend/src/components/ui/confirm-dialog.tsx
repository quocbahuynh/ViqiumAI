"use client"

import { useState, useEffect } from "react"
import { AlertTriangle } from "lucide-react"
import Button from "@/components/ui/button/Button"

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  variant?: "danger" | "warning" | "info"
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  onConfirm,
  onCancel,
  variant = "danger",
}: ConfirmDialogProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!isVisible) return null

  // Determine button and icon colors based on variant
  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          icon: "text-red-500",
          iconBg: "bg-red-100 dark:bg-red-900/20",
          button: "bg-red-600 hover:bg-red-700",
        }
      case "warning":
        return {
          icon: "text-yellow-500",
          iconBg: "bg-yellow-100 dark:bg-yellow-900/20",
          button: "bg-yellow-600 hover:bg-yellow-700",
        }
      case "info":
        return {
          icon: "text-green-500",
          iconBg: "bg-green-100 dark:bg-green-900/20",
          button: "bg-green-600 hover:bg-green-700",
        }
      default:
        return {
          icon: "text-red-500",
          iconBg: "bg-red-100 dark:bg-red-900/20",
          button: "bg-red-600 hover:bg-red-700",
        }
    }
  }

  const styles = getVariantStyles()

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 transition-opacity ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full p-6 transform transition-transform"
        style={{ transform: isOpen ? "scale(1)" : "scale(0.95)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-full ${styles.iconBg}`}>
            <AlertTriangle className={`w-6 h-6 ${styles.icon}`} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{message}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-lg"
          >
            {cancelText}
          </Button>
          <Button
            size="md"
            onClick={onConfirm}
            className={`px-4 py-2 ${styles.button} text-white transition-colors rounded-lg hover:text-white`}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
}