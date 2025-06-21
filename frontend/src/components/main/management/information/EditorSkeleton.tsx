import type React from "react"

const EditorSkeleton: React.FC = () => {
  return (
    <div className="border border-gray-200 rounded-lg dark:border-gray-700 overflow-hidden animate-pulse">
      <div className="h-12 bg-gray-200 dark:bg-gray-700 flex items-center justify-between p-3">
        <div className="flex space-x-2">
          <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
        </div>
        <div className="flex space-x-2">
          <div className="w-24 h-9 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
        </div>
      </div>
      <div className="p-4">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-4"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-4/5 mb-4"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-4"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
      </div>
    </div>
  )
}

export default EditorSkeleton
