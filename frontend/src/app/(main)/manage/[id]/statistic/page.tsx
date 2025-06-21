"use client"

import IntentChart from "@/components/main/setting/intent-chart"
import ComponentCard from "@/components/common/ComponentCard"
import PageBreadcrumb from "@/components/common/PageBreadCrumbCustom"
import { useParams } from "next/navigation"
import LineChartOne from "@/components/charts/line/LineChartOne"
import MetricRate from "@/components/charts/MetricRate"
import CommonIssues from "@/components/main/setting/common-issues"

export default function Dashboard() {
  const params = useParams<{ id: string }>()
  const projectId = params?.id

  return (
    <div className="min-h-screen">
      <PageBreadcrumb pageTitle="Thống kê tin nhắn" />
      <main>
        <div className="grid gap-3 grid-cols-5 mb-3">
          <div className="col-span-3">
            <MetricRate projectId={projectId} />
            <ComponentCard title="Tương quan đơn hàng & trò chuyện" desc="Theo dõi số lượng đơn hàng/số lượng trò chuyện">
              <LineChartOne projectId={projectId} />
            </ComponentCard>
          </div>
          <div className="col-span-2">
            <ComponentCard title="Biểu đồ phân bổ" desc="Theo dõi chỉ số chủ đề">
              <IntentChart projectId={projectId} />
            </ComponentCard>
            <div className="mt-3">
              <ComponentCard title="Danh sách chỉ số" desc="Theo dõi danh sách chủ đề">
                <CommonIssues projectId={projectId} />
              </ComponentCard>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}