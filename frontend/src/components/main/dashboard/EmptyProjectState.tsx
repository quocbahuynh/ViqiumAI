"use client"
import { Plus, Bot, Sparkles } from "lucide-react"

interface EmptyProjectStateProps {
  onCreateProject: () => void
}

export const EmptyProjectState = ({ onCreateProject }: EmptyProjectStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center  px-4">
      <div className="relative mb-4">
        {/* Background blur effects */}
        <div className="absolute inset-0 flex items-center justify-center -z-10">
          <div className="w-[200px] h-[200px] max-md:w-[150px] max-md:h-[150px] rounded-full bg-primary-200/20 blur-[80px]" />
        </div>

        {/* Main icon container */}
        <div className="relative bg-white dark:bg-dark-200 rounded-full p-6 max-md:p-4 shadow-nav">
          <div className="bg-primary/10 dark:bg-primary/20 rounded-full p-6 max-md:p-4">
            <Bot className="w-16 h-16 max-md:w-12 max-md:h-12 text-primary" />
          </div>

        </div>
      </div>

      <div className="text-center max-w-[500px] mb-6">
        <h3 className="text-2xl max-md:text-xl font-semibold mb-4 max-md:mb-3 text-paragraph dark:text-white">
          Chưa có AI nào được tạo
        </h3>
        <p className="text-paragraph-light dark:text-gray-400 max-md:text-sm leading-relaxed">
          Bắt đầu hành trình AI của bạn! Tạo chatbot thông minh đầu tiên để tự động hóa việc tư vấn và chốt đơn hàng cho
          Fanpage của bạn.
        </p>

        {/* Features list */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-md:gap-2 mb-8 max-md:mb-6 text-left">
          <div className="flex items-center gap-2 max-md:gap-1.5">
            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
            <span className="text-sm max-md:text-xs text-paragraph-light dark:text-gray-400">
              Tư vấn sản phẩm thông minh
            </span>
          </div>
          <div className="flex items-center gap-2 max-md:gap-1.5">
            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
            <span className="text-sm max-md:text-xs text-paragraph-light dark:text-gray-400">
              Đề xuất khuyến mãi tự động
            </span>
          </div>
          <div className="flex items-center gap-2 max-md:gap-1.5">
            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
            <span className="text-sm max-md:text-xs text-paragraph-light dark:text-gray-400">Nhận diện hình ảnh</span>
          </div>
          <div className="flex items-center gap-2 max-md:gap-1.5">
            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
            <span className="text-sm max-md:text-xs text-paragraph-light dark:text-gray-400">
              Kết nối Facebook Fanpage
            </span>
          </div>
        </div> */}
      </div>

      {/* CTA Button */}
      <button
        onClick={onCreateProject}
        className="btn flex items-center btn-sm gap-3 max-md:gap-2 px-8 max-md:px-6 py-4 max-md:py-3 text-base max-md:text-sm font-medium  transition-transform duration-300"
      >
        <Plus color="white" className="w-5 h-5 max-md:w-4 max-md:h-4" />
        Tạo AI đầu tiên
      </button>

   
    </div>
  )
}
