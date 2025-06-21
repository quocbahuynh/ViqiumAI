export default function IssuesSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3, 4, 5].map((item) => (
        <div key={item} className="flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-40"></div>
          </div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-8"></div>
        </div>
      ))}
    </div>
  )
}
