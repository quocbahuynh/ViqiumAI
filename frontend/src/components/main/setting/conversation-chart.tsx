"use client"

import { useEffect, useRef } from "react"
import { Chart, type ChartConfiguration, type ChartData, type ChartType } from "chart.js/auto"

// Mock data for conversation classification
const conversationData = {
  labels: ["Sản phẩm", "Giá cả", "Tuyến", "Đổi trả", "Bảo hành", "Hỗ trợ kỹ thuật", "Khiếu nại", "Góp ý", "Khác"],
  datasets: [
    {
      data: [29, 19, 16, 10, 8, 7, 5, 3, 1],
      backgroundColor: [
        "#6366f1", // Sản phẩm - indigo
        "#38bdf8", // Giá cả - sky
        "#4ade80", // Tuyến - green
        "#fb923c", // Đổi trả - orange
        "#a78bfa", // Bảo hành - purple
        "#ec4899", // Hỗ trợ kỹ thuật - pink
        "#ef4444", // Khiếu nại - red
        "#94a3b8", // Góp ý - slate
        "#64748b", // Khác - slate darker
      ],
    },
  ],
}

export default function ConversationChart() {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d")

      if (ctx) {
        // Destroy existing chart if it exists
        if (chartInstance.current) {
          chartInstance.current.destroy()
        }

        // Create new chart
        chartInstance.current = new Chart(ctx, {
          type: "pie" as ChartType,
          data: conversationData as ChartData,
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: "bottom",
                labels: {
                  boxWidth: 12,
                  padding: 10,
                  font: {
                    size: 11,
                  },
                },
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const label = context.label || ""
                    const value = context.raw as number
                    return `${label}: ${value}%`
                  },
                },
              },
            },
          } as ChartConfiguration["options"],
        })
      }
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [])

  return (
    <div className="h-[300px] flex items-center justify-center">
      <canvas ref={chartRef}></canvas>
    </div>
  )
}
