"use client"

import { useEffect, useRef, useState } from "react"
import { Chart, type ChartConfiguration, type ChartData, type ChartType } from "chart.js/auto"
import axiosInstance from "@/lib/axios-config";
import { apiLinks } from "@/lib/api-link";

const labelsMap: any = {
  product: {
    lables: "Sản phẩm",
    color: "#88c13c",
  },
  promotion: {
    lables: "Mua hàng",
    color: "#b1e346",
  },
  pricing: {
    lables: "Giá cả",
    color: "#d0c93c",
  },
  shipping: {
    lables: "Hỗ trợ",
    color: "#d89d3c",
  },
  return: {
    lables: "Đổi trả",
    color: "#7d59b3",
  },
  warranty: {
    lables: "Bảo hành",
    color: "#3cb1ac",
  },
  humanRequest: {
    lables: "Con người",
    color: "#b1588a",
  },
  complaint: {
    lables: "Khiếu nại",
    color: "#c93f3f",
  },
  feedback: {
    lables: "Góp ý",
    color: "#a3a24c",
  },
  others: {
    lables: "Khác",
    color: "#6a6c65",
  },
};

const convertToIntentData = (obj: any) => {
  const labels: string[] = [];
  const data: number[] = [];
  const bagColor: string[] = [];

  for (const key in obj) {
    if (labelsMap[key]) {
      labels.push(labelsMap[key].lables);
      data.push(obj[key]);
      bagColor.push(labelsMap[key].color);
    }
  }

  return {
    labels: labels,
    datasets: [
      {
        data: data,
        backgroundColor: bagColor,
      },
    ],
  }
};


interface IntentChartProp {
  projectId: string;
}

export default function IntentChart({ projectId }: IntentChartProp) {

  const initData = {
    labels: ["Chưa cập nhật số liệu"],
    datasets: [
      {
        data: [100],
        backgroundColor: [
          "#222020",
        ],
      },
    ],
  }

  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)
  const [chartData, setChartData] = useState(initData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`${apiLinks.statistic.converstation}/${projectId}`);
        if (response.status == 200) {
          const data = await response.data;
          if (Object.keys(data).length > 0) {
            const formatData = convertToIntentData(data);
            setChartData(formatData);
          }

        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [projectId]);



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
          type: "doughnut" as ChartType,
          data: chartData as ChartData,
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
  }, [chartData])

  return (
    <div className="h-[300px] flex items-center justify-center">
      <canvas ref={chartRef}></canvas>
    </div>
  )
}
