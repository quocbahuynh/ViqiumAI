"use client"

import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Package, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { usePathname, useRouter } from "next/navigation"
import { truncateText } from "@/utils/truncate"
import { CardContent } from "@/components/ui/card"
import ComponentCard from "@/components/common/ComponentCard"

// Define interface for API data
export interface ApiVoucher {
  _id: string
  name: string
  startTime: string // ISO string
  endTime: string // ISO string
  promotion: {
    _id: string
    name: string
  }
  productApply: Array<{
    productId?: { _id: string; name: string }
    promoteTarget?: number
    promoteType?: string
    promotePricing?: number
    productGift?: Array<{ _id: string; name: string }>
    _id: string
  }>
}

interface VoucherTableProps {
  vouchers: ApiVoucher[]
  isLoading?: boolean
  onDelete?: (id: string, name: string) => void
  is404Error?: boolean
}

export default function VoucherTable({ vouchers, isLoading = false, onDelete, is404Error = false }: VoucherTableProps) {
  // Format date from ISO string to dd/mm/yyyy
  const formatDate = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const router = useRouter()

  // Calculate voucher status
  const getStatus = (startTime: string, endTime: string) => {
    const currentDate = new Date() // Get current date
    const startDate = new Date(startTime)
    const endDate = new Date(endTime)

    if (startDate > currentDate) {
      return "Sắp diễn ra"
    } else if (endDate < currentDate) {
      return "Hết hạn"
    } else {
      return "Đang diễn ra"
    }
  }

  // Logic to determine navigation URL based on _id
  const getNavigateUrl = (id?: string, url?: string) => {
    switch (id) {
      case "680cf954e0c9459af6296c25":
        return `/discount/${url}`
      case "680cf954e0c9459af6296c26":
        return `/gift/${url}`
      case "680cf954e0c9459af6296c27":
        return `/bluk/${url}`
      case "680cf954e0c9459af6296c28":
        return `/combo/${url}` // Default URL if no match
      default:
        return `/manage/${url}` // Fallback URL
    }
  }

  const pathname = usePathname()

  const handleClick = (url?: string) => {
    const newUrl = `${pathname}/${url}`
    router.push(newUrl)
  }

  // Skeleton loader
  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-xl border border-dashed border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-none">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[400px]">
            <Table>
              <TableHeader className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-4 py-3 font-normal text-dark dark:text-brand-300 text-start text-sm"
                  >
                    <Skeleton className="h-5 w-24" />
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-3 font-normal text-dark dark:text-brand-300 text-start text-sm hidden md:table-cell"
                  >
                    <Skeleton className="h-5 w-16" />
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-3 font-normal text-dark dark:text-brand-300 text-start text-sm hidden md:table-cell"
                  >
                    <Skeleton className="h-5 w-20" />
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-3 font-normal text-dark dark:text-brand-300 text-start text-sm hidden md:table-cell"
                  >
                    <Skeleton className="h-5 w-20" />
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-3 font-normal text-dark dark:text-brand-300 text-start text-sm "
                  >
                    <Skeleton className="h-5 w-20" />
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
                {Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <TableRow
                      key={index}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                    >
                      <TableCell className="px-4 py-3 text-start">
                        <Skeleton className="h-6 w-40" />
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start hidden md:table-cell">
                        <Skeleton className="h-6 w-20" />
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start hidden md:table-cell">
                        <Skeleton className="h-6 w-28" />
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start hidden md:table-cell">
                        <Skeleton className="h-6 w-24" />
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <Skeleton className="h-8 w-8 rounded-full" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    )
  }

  // Display "No vouchers" message if no vouchers and not loading, or if 404 error
  if ((vouchers.length === 0 && !isLoading) || is404Error) {
    return (
      <ComponentCard className="shadow-none">
        <CardContent className="flex flex-col items-center justify-center py-10">
          <Package className="w-10 h-10 text-gray-400 dark:text-brand-300 mb-4" />
          <h3 className="text-sm font-normal text-gray-400 dark:text-brand-300">Hiện chưa có khuyến mãi nào.</h3>
        </CardContent>
      </ComponentCard>
    )
  }

  return (
    <div className="overflow-hidden border-dashed rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[400px]">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-gray-800 border-b mt-0 border-gray-200 dark:border-gray-700 sticky top-0 z-10">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300 text-start text-sm"
                >
                  <div className="flex items-center">Tên khuyến mãi</div>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 font-normal text-dark dark:text-brand-300 text-start text-sm hidden md:table-cell"
                >
                  <div className="flex items-center">Trạng thái</div>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 font-normal text-dark dark:text-brand-300 text-start text-sm hidden md:table-cell"
                >
                  <div className="flex items-center">Thời gian bắt đầu</div>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 font-normal text-dark dark:text-brand-300 text-start text-sm hidden md:table-cell"
                >
                  <div className="flex items-center">Chiến dịch</div>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 font-normal text-dark dark:text-brand-300 text-start text-sm "
                >
                  Hành động
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
              {vouchers.map((voucher) => {
                const status = getStatus(voucher.startTime, voucher.endTime)

                return (
                  <TableRow
                    key={voucher._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 cursor-pointer"
                  >
                    <TableCell className="px-4 py-3 text-start">
                      <span className="block font-normal text-gray-500 dark:text-gray-200 text-sm">
                        {truncateText(voucher.name, 20)}
                      </span>
                      {/* Show status badge on mobile */}
                      <div className="md:hidden mt-1">
                        <Badge
                        
                          variant={
                            status === "Đang diễn ra" ? "success" : status === "Sắp diễn ra" ? "pending" : "destructive"
                          }
                          className="text-xs px-2 py-1 rounded-full"
                        >
                          {status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-sm hidden md:table-cell">
                      <Badge
                        variant={
                          status === "Đang diễn ra" ? "success" : status === "Sắp diễn ra" ? "pending" : "destructive"
                        }
                      >
                        {status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-sm hidden md:table-cell">
                      <span className="font-normal text-gray-500 dark:text-gray-300">{formatDate(voucher.startTime)}</span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-sm hidden md:table-cell">
                      <span className="font-normal text-gray-500 dark:text-gray-400">{voucher.promotion?.name || "Không có"}</span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <div className="flex items-center gap-2">
                        {/* Always visible edit button with icon */}
                        <button
                          onClick={() => handleClick(getNavigateUrl(voucher.promotion._id, voucher._id))}
                          className="font-normal text-sm text-brand-700 hover:text-brand-900 flex items-center"
                        >
                          <span className="inline">Sửa</span>
                        </button>

                        {/* Always visible delete button with icon */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onDelete && onDelete(voucher._id, voucher.name)
                          }}
                          className="font-normal text-sm text-red-600 hover:text-red-700 flex items-center ml-2 text-sm"
                        >
                          <span className="inline">Xóa</span>
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
