"use client"

import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, ShoppingCart, Trash2 } from "lucide-react"
import type { Order } from "@/types/ordertype"
import { formatDate } from "@/utils/dateFormat"
import { CardContent } from "@/components/ui/card"
import { truncateText } from "@/utils/truncate"
import ComponentCard from "@/components/common/ComponentCard"
import { Skeleton } from "@/components/ui/skeleton"

interface OrderTableProps {
  orders: Order[]
  isLoading: boolean
  onViewOrder: (order: Order) => void
  onDelete: (orderId: string, orderCode: string) => void
}

export default function OrderTable({ orders, isLoading, onViewOrder, onDelete }: OrderTableProps) {
  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-xl border border-dashed border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-none">

        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[600px]">
            <Table>
              <TableHeader className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-4 py-3 font-semibold text-brand-500 dark:text-brand-400 text-start text-sm"
                  >
                    <Skeleton className="h-5 w-24 bg-gray-200 dark:bg-gray-700" />
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-3 font-semibold text-brand-500 dark:text-brand-400 text-start text-sm hidden md:table-cell"
                  >
                    <Skeleton className="h-5 w-16 bg-gray-200 dark:bg-gray-700" />
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-3 font-semibold text-brand-500 dark:text-brand-400 text-start text-sm hidden md:table-cell"
                  >
                    <Skeleton className="h-5 w-20 bg-gray-200 dark:bg-gray-700" />
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-3 font-semibold text-brand-500 dark:text-brand-400 text-start text-sm w-24"
                  >
                    <Skeleton className="h-5 w-20 bg-gray-200 dark:bg-gray-700" />
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
                {Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <TableRow
                      key={index}
                      className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                    >
                      <TableCell className="px-4 py-3 text-start">
                        <div className="flex items-center gap-3">
                          <Skeleton className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700" />
                          <Skeleton className="h-6 w-40 bg-gray-200 dark:bg-gray-700" />
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start hidden md:table-cell">
                        <Skeleton className="h-6 w-20 bg-gray-200 dark:bg-gray-700" />
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start hidden md:table-cell">
                        <Skeleton className="h-6 w-16 bg-gray-200 dark:bg-gray-700" />
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-8 w-24 rounded-full bg-gray-200 dark:bg-gray-700" />
                          <Skeleton className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700" />
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

  if (orders.length === 0) {
    return (
      <ComponentCard className="shadow-none">
        <CardContent className="flex flex-col items-center justify-center py-10">
          <ShoppingCart className="w-10 h-10 text-gray-400 dark:text-brand-300 mb-4" />
          <h3 className="text-sm font-normal text-gray-400 dark:text-brand-300">Hiện chưa có đơn hàng nào.</h3>
        </CardContent>
      </ComponentCard>
    )
  }

  return (
    <div className="max-w-full overflow-x-auto">
      <div className="min-w-[700px]">
        <div className="overflow-hidden rounded-xl border border-dashed border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-none">

          <Table>
            <TableHeader className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
              <TableRow>
                <TableCell isHeader className="px-4 py-3 font-semibold text-gray-800 dark:text-brand-300 text-start text-sm">
                  Mã đơn hàng
                </TableCell>
                <TableCell isHeader className="px-4 py-3 font-semibold text-gray-800 dark:text-brand-300 text-start text-sm">
                  Số điện thoại
                </TableCell>
                <TableCell isHeader className="px-4 py-3 font-semibold text-gray-800 dark:text-brand-300 text-start text-sm">
                  Địa chỉ
                </TableCell>
                <TableCell isHeader className="px-4 py-3 font-semibold text-gray-800 dark:text-brand-300 text-start text-sm">
                  Ngày tạo
                </TableCell>
                <TableCell isHeader className="px-4 py-3 font-semibold text-gray-800 dark:text-brand-300 text-start text-sm">
                  Trạng thái
                </TableCell>

              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
              {orders.map((order) => (
                <TableRow
                  key={order._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 cursor-pointer"
                  onClick={() => onViewOrder(order)}
                >
                  <TableCell className="px-4 py-3 text-start">
                    <span
                      className={`block text-sm ${!order.isRead ? "font-bold text-brand-600 dark:text-emerald-400" : "font-light text-brand-600"
                        }`}
                    >
                      {order.orderCode}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 font-light text-start text-sm">
                    <span className={!order.isRead ? "font-semibold text-gray-700" : "text-gray-500"}>
                      {order.phoneNumber}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 font-light text-start text-sm">
                    <span className={!order.isRead ? "font-semibold text-gray-700" : "text-gray-500"}>
                      {truncateText(order.address, 40)}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 font-light text-start text-sm">
                    <span className={!order.isRead ? "font-semibold text-gray-700" : "text-gray-500"}>
                      {formatDate(order.createdAt)}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${order.isRead
                          ? "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                          : "bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300 font-medium"
                        }`}
                    >
                      {order.isRead ? "Đã đọc" : "Chưa đọc"}
                    </span>
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