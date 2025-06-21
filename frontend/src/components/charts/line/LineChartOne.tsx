"use client";
import React, { useEffect, useState } from "react";

import { ApexOptions } from "apexcharts";

import dynamic from "next/dynamic";
import axiosInstance from "@/lib/axios-config";
import { apiLinks } from "@/lib/api-link";
// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

type CountDate = {
  count: number;
  date: string;
}

interface Statistic {
  orders: CountDate[],
  converstations: CountDate[]
}


interface LineChartOneProp {
  projectId: any
}
export default function LineChartOne({ projectId }: LineChartOneProp) {

  const [orders, setOrder] = useState<number[]>([]);
  const [converstations, setConverstations] = useState<number[]>([]);
  const [dates, setDates] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`${apiLinks.statistic.order}/${projectId}`);
        const data: Statistic = await response.data
        if (response.status == 200) {
          const ordersData = data.orders.map(i => i.count)
          const converstationData = data.converstations.map(i => i.count)
          const datesData = data.orders.map(i => i.date)

          setOrder(ordersData)
          setConverstations(converstationData)
          setDates(datesData)
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [projectId]);

  const options: ApexOptions = {
    legend: {
      show: true, // Hide legend
      position: "top",
      horizontalAlign: "right",
    },
    colors: ["#b1e346", "373935"], // Define line colors
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 350,
      type: "line", // Set the chart type to 'line'
      toolbar: {
        show: false, // Hide chart toolbar
      },
    },
    stroke: {
      curve: 'smooth', // Define the line style (straight, smooth, or step)
      width: [2, 2], // Line width for each dataset
    },

    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 0, // Size of the marker points
      strokeColors: "#fff", // Marker border color
      strokeWidth: 2,
      hover: {
        size: 6, // Marker size on hover
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false, // Hide grid lines on x-axis
        },
      },
      yaxis: {
        lines: {
          show: true, // Show grid lines on y-axis
        },
      },
    },
    dataLabels: {
      enabled: true, // Disable data labels
    },
    tooltip: {
      enabled: true, // Enable tooltip
      x: {
        format: "dd MMM yyyy", // Format for x-axis tooltip
      },
    },
    xaxis: {
      type: "category", // Category-based x-axis
      categories: dates,
      axisBorder: {
        show: false, // Hide x-axis border
      },
      axisTicks: {
        show: false, // Hide x-axis ticks
      },
      tooltip: {
        enabled: false, // Disable tooltip for x-axis points
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px", // Adjust font size for y-axis labels
          colors: ["#6B7280"], // Color of the labels
        },
      },
      title: {
        text: "", // Remove y-axis title
        style: {
          fontSize: "0px",
        },
      },
    },
  };

  const series = [
    {
      name: "Đơn hàng",
      data: orders,
    },
    {
      name: "Cuộc trò chuyện",
      data: converstations,
    },
  ];
  return (
    <div className="max-w-full overflow-x-auto custom-scrollbar">
      <div id="chartEight" className="min-w-[1000px]">
        <ReactApexChart
          options={options}
          series={series}
          type="area"
          height={310}
        />
      </div>
    </div>
  );
}
