import ComponentCard from "@/components/common/ComponentCard";
import Alert from "@/components/ui/alert/Alert";
import { Skeleton } from "@/components/ui/skeleton";

export default function AISettingsSkeleton() {
  return (
    <div className=" bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Alert Skeleton */}
      <Alert variant="info" title="Trợ lý AI" message="Chọn mô hình AI và cấu hình hành vi của nó." />

      {/* Mô hình AI Skeleton */}
      <ComponentCard className="mt-5" title="Mô hình AI" desc="Chọn mô hình sẽ được sử dụng để tạo câu trả lời.">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((_, index) => (
            <div
              key={index}
              className="border rounded-xl p-3 sm:p-4 border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-2 mb-2">
                <Skeleton className="w-5 h-5 rounded-full" />
                <Skeleton className="h-5 w-1/2" />
              </div>
              <Skeleton className="h-4 w-3/4 mb-3" />
              <div className="mt-1">
                <Skeleton className="h-4 w-1/4 mb-1" />
                <div className="flex flex-wrap gap-1.5">
                  {[1, 2, 3].map((_, idx) => (
                    <Skeleton key={idx} className="h-5 w-16" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ComponentCard>

      {/* Phong cách phản hồi Skeleton */}
      <ComponentCard
        title="Phong cách phản hồi"
        desc="Xác định giọng điệu mà trợ lý sẽ sử dụng để giao tiếp."
        className="mt-5 sm:mt-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((_, index) => (
            <div
              key={index}
              className="border rounded-xl p-3 sm:p-4 border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-2">
                <Skeleton className="w-4 h-4 sm:w-5 sm:h-5 rounded-full" />
                <Skeleton className="h-5 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </ComponentCard>

      {/* Độ dài tối đa của tin nhắn Skeleton */}
      <ComponentCard
        title="Độ dài tối đa của tin nhắn"
        desc="Giới hạn độ dài các phản hồi được tạo ra"
        className="mt-5 sm:mt-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((_, index) => (
            <div
              key={index}
              className="border rounded-xl p-3 sm:p-4 border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-2">
                <Skeleton className="w-4 h-4 sm:w-5 sm:h-5 rounded-full" />
                <Skeleton className="h-5 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </ComponentCard>

      {/* Nút Update Skeleton */}
      <div className="mt-6 flex justify-end">
        <Skeleton className="h-10 w-32 rounded" />
      </div>
    </div>
  );
}