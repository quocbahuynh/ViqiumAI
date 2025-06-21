"use client"
import { RefreshCw, AlertTriangle } from "lucide-react"

interface ErrorProjectStateProps {
  error?: string
  onRetry: () => void
}

export const ErrorProjectState = ({ error, onRetry }: ErrorProjectStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 max-md:py-16 px-4">
      <div className="relative mb-8 max-md:mb-6">
        {/* Background blur effects */}
        <div className="absolute inset-0 flex items-center justify-center -z-10">
          <div className="w-[200px] h-[200px] max-md:w-[150px] max-md:h-[150px] rounded-full bg-red-200/20 blur-[80px]" />
        </div>

        {/* Error icon container */}
        <div className="relative bg-white dark:bg-dark-200 rounded-full p-6 max-md:p-4 shadow-nav">
          <div className="bg-red-50 dark:bg-red-900/20 rounded-full p-6 max-md:p-4">
            <AlertTriangle color="red" className="w-16 h-16 max-md:w-12 max-md:h-12 text-red-500" />
          </div>
        </div>
      </div>

      <div className="text-center max-w-[500px] mx-auto mb-8 max-md:mb-6">
        <h3 className="text-2xl max-md:text-xl font-semibold mb-4 max-md:mb-3 text-paragraph dark:text-white">
          Không thể tải dữ liệu
        </h3>
        <p className="text-paragraph-light dark:text-gray-400 mb-6 max-md:mb-4 max-md:text-sm leading-relaxed">
          Đã xảy ra lỗi khi tải danh sách AI của bạn. Vui lòng thử lại hoặc liên hệ hỗ trợ nếu vấn đề vẫn tiếp tục.
        </p>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 max-md:p-3 mb-6 max-md:mb-4">
            <p className="text-sm max-md:text-xs text-red-600 dark:text-red-400 font-mono">{error}</p>
          </div>
        )}
      </div>

      {/* Retry Button */}
      <button
        onClick={onRetry}
        className="btn flex items-center gap-3 max-md:gap-2 px-8 max-md:px-6 py-4 max-md:py-3 text-base max-md:text-sm font-medium  transition-transform duration-300"
      >
        <RefreshCw color="white" className="w-5 h-5 max-md:w-4 max-md:h-4" />
        Thử lại
      </button>


    </div>
  )
}
