interface ChartSkeletonProps {
  height?: string
}

export default function ChartSkeleton({ height = "h-[300px]" }: ChartSkeletonProps) {
  return (
    <div className={`${height} bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse flex items-center justify-center`}>
      <div className="text-center">
        <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4 animate-pulse"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-32 mx-auto mb-2"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-24 mx-auto"></div>
      </div>
    </div>
  )
}
