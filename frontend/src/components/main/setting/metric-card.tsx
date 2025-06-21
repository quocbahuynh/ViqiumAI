import type { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"
import ComponentCard from "@/components/common/ComponentCard"

interface MetricCardProps {
  title: string
  value: string
  description: string
  icon: ReactNode;
  background?: string;
}

export default function MetricCard({ title, value, description, icon, background = "" }: MetricCardProps) {
  return (
    <ComponentCard bgColor={background} className={`p-0 shadow-none ${background == "#222020" ? 'text-white' : null}`} isBorderdashed={false}>
      <div className="">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-medium">{title}</span>
        </div>
        <div className="text-3xl font-medium mt-2">{value}</div>
        <p className="mt-3 text-xs">{description}</p>
      </div>
    </ComponentCard>
  )
}
