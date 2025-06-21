export default function MetricCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
      </div>
      <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-16 mb-3"></div>
      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
    </div>
  )
}
