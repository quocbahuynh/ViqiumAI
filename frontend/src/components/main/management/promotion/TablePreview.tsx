"use client"

import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table"
import { Product } from "@/types/productType"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Package, Trash2 } from "lucide-react"
import Input from "@/components/form/input/InputField"
import { Checkbox } from "@/components/ui/checkbox"
import { formatCurrency, unformatCurrency } from "@/utils/money"
import { truncateText } from "@/utils/truncate"

interface ProductTableProps {
  products: Product[]
  onRemove?: (productId: string) => void
  showPrice?: boolean
  showPromotePrice?: boolean
  onPromotePriceChange?: (productId: string, price: number) => void
  promoteType?: "percent" | "fixed"
  showCheckbox?: boolean // Thêm prop để hiển thị cột Checkbox
  selectedProducts?: string[] // Danh sách sản phẩm đã chọn
  onSelectProduct?: (productId: string) => void // Callback khi chọn sản phẩm
  onSelectAll?: () => void // Callback khi chọn tất cả
}

export default function ProductTable({
  products,
  onRemove,
  showPrice = false,
  showPromotePrice = false,
  onPromotePriceChange,
  promoteType,
  showCheckbox = false,
  selectedProducts = [],
  onSelectProduct,
  onSelectAll,
}: ProductTableProps) {
  // Format price range
  const formatPriceRange = (prices: number[]) => {
    if (!prices || prices.length === 0) return "-"
    if (prices.length === 1) return `${prices[0].toLocaleString("vi-VN")}đ`

    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)

    return `${minPrice.toLocaleString("vi-VN")}đ - ${maxPrice.toLocaleString("vi-VN")}đ`
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-white/[0.05] dark:bg-white/[0.03] bg-white">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[600px]">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
              <TableRow>
                {showCheckbox && (
                  <TableCell
                    isHeader
                    className="px-4 sm:px-6 py-3 font-semibold text-gray-700 dark:text-gray-300 text-start text-sm w-12 sm:w-16"
                  >
                    <Checkbox
                      id="select-all"
                      checked={
                        selectedProducts.length === products.length && products.length > 0
                      }
                      onCheckedChange={onSelectAll}
                      className="border-gray-300 dark:border-gray-600"
                    />
                  </TableCell>
                )}
                <TableCell
                  isHeader
                  className="px-4 sm:px-6 py-3 font-semibold text-gray-700 dark:text-gray-300 text-start text-sm"
                >
                  Sản phẩm
                </TableCell>
                {showPrice && (
                  <TableCell
                    isHeader
                    className="px-4 sm:px-6 py-3 font-semibold text-gray-700 dark:text-gray-300 text-start text-sm"
                  >
                    Giá
                  </TableCell>
                )}
                {showPromotePrice && promoteType === "fixed" && (
                  <TableCell
                    isHeader
                    className="px-4 sm:px-6 py-3 font-semibold text-gray-700 dark:text-gray-300 text-start text-sm"
                  >
                    Giá khuyến mãi
                  </TableCell>
                )}
                {onRemove && (
                  <TableCell
                    isHeader
                    className="px-4 sm:px-6 py-3 font-semibold text-gray-700 dark:text-gray-300 text-start text-sm w-24"
                  >
                    Hành động
                  </TableCell>
                )}
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
              {products.length > 0 ? (
                products.map((item,index) => (
                  <TableRow
                    key={index}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 cursor-pointer"
                  >
                    {showCheckbox && (
                      <TableCell className="px-4 sm:px-6 py-3 sm:py-4 text-start w-12 sm:w-16">
                        <Checkbox
                          id={`product-${item._id}`}
                          checked={selectedProducts.includes(item._id)}
                          onCheckedChange={() => onSelectProduct?.(item._id)}
                          className="border-gray-300 dark:border-gray-600"
                        />
                      </TableCell>
                    )}
                    <TableCell className="px-4 sm:px-6 py-3 sm:py-4 text-start">
                      <div className="flex items-center gap-3">
                        {item.photoUrls && item.photoUrls.length > 0 ? (
                          <Avatar className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <AvatarImage
                              src={item.photoUrls[0] || "/placeholder.svg"}
                              alt="Product"
                              className="w-full h-full object-cover rounded-full"
                            />
                            <AvatarFallback className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                              <Package color="white" className="w-4 h-4" />
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <Avatar className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <AvatarFallback className="text-gray-500 dark:text-gray-400">
                              <Package color="white" className="w-4 h-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <span className="block font-medium text-green-700 dark:text-gray-200 text-sm sm:text-base truncate">
                          {truncateText(item.name,30)}
                        </span>
                      </div>
                    </TableCell>
                    {showPrice && (
                      <TableCell className="px-4 sm:px-6 py-3 sm:py-4 text-start">
                        <span className="text-gray-700 dark:text-gray-300 text-sm">
                          {formatCurrency(item.prices)}
                        </span>
                      </TableCell>
                    )}
                    {showPromotePrice && promoteType === "fixed" && (
                      <TableCell className="px-4 sm:px-6 py-3 sm:py-4 text-start">
                        <Input
                          min="0"
                          value={formatCurrency((item as any).promotePricing || 0)}
                          onChange={(e) =>
                            onPromotePriceChange?.(item._id, unformatCurrency(e.target.value))
                          }
                          className="max-w-[150px] border-gray-300 dark:border-gray-600 "
                        />
                      </TableCell>
                    )}
                    {onRemove && (
                      <TableCell className="px-4 sm:px-6 py-3 sm:py-4 text-start w-24">
                        <div
                          onClick={() => onRemove(item._id)}
                          className="text-red-500 hover:text-red-700 hover:underline hover:cursor-pointer"
                        >
                          Xóa
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
<TableRow>
      <TableCell
        colSpan={
          (showCheckbox ? 1 : 0) +
          1 +
          (showPrice ? 1 : 0) +
          (showPromotePrice && promoteType === "fixed" ? 1 : 0) +
          (onRemove ? 1 : 0)
        }
        className="py-12 text-center text-gray-500 dark:text-gray-400 text-sm"
      >
        Không tìm thấy sản phẩm
      </TableCell>
    </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}