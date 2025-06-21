import type React from "react"
import { cn } from "@/lib/utils" // Import hàm cn từ lib/utils

interface ComponentCardProps {
  title?: string
  children: React.ReactNode
  className?: string
  desc?: string
  padding?: string;
  bgColor?: string;
  isBorderdashed?: boolean;
}

const ComponentCard: React.FC<ComponentCardProps> = ({ title, children, className = "", desc = "", padding = "", bgColor = "", isBorderdashed = true }) => {
  return (
    <div
      style={{ backgroundColor: bgColor }}
      className={cn("bg-white dark:bg-dark-200 rounded-xl p-2.5 shadow-sm", className)}
    >
      <div className={`${isBorderdashed ? ' border border-dashed' : null} rounded-lg border-gray-200 h-full`}>

        {title != null ? (
          <div className={cn("p-4")}>
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">{title}</h3>
            {desc && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{desc}</p>}
          </div>
        ) : null}

        <div className={cn("p-4 sm:p-6", padding, title && " dark:border-gray-800")}>
          <div className="space-y-6">{children}</div>
        </div>

      </div>
    </div>
  )
}

export default ComponentCard
