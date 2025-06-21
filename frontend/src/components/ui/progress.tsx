"use client"

import type * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

function Progress({ className, value, ...props }: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  const safeValue = value ?? undefined // chuyển null => undefined

  const getProgressColor = (progressValue: number | undefined) => {
    if (!progressValue) return "#b1e346"
    if (progressValue >= 80) return "#ef4444"
    if (progressValue >= 50) return "#eab308"
    return "#b1e346"
  }

  const getProgressColorClass = (progressValue: number | undefined) => {
    if (!progressValue) return "bg-green-400"
    if (progressValue >= 80) return "bg-red-500"
    if (progressValue >= 50) return "bg-yellow-500"
    return "bg-green-400"
  }

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn("bg-primary/20 relative h-2 w-full overflow-hidden rounded-full", className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          "h-full w-full flex-1 transition-all duration-300 ease-in-out",
          getProgressColorClass(safeValue)
        )}
        style={{
          transform: `translateX(-${100 - (safeValue || 0)}%)`,
          backgroundColor: getProgressColor(safeValue),
        }}
      />
    </ProgressPrimitive.Root>
  )
}


export { Progress }
