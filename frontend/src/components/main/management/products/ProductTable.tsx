"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2, Package } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CardContent } from "@/components/ui/card"
import ComponentCard from "@/components/common/ComponentCard"
import Image from "next/image"
import { truncateText } from "@/utils/truncate"
import { formatCurrency } from "@/utils/money"

export interface Product {
  _id: string
  name: string
  numberOfVariants: number
  photoUrls: string[]
  prices: number[]
}

interface ProductTableProps {
  products: Product[]
  isLoading?: boolean
  onEdit?: (productId: string) => void
  onDelete?: (productId: string, productName: string) => void
  onView?: (productId: string) => void
}

export default function ProductTable({ products, isLoading = false, onEdit, onDelete, onView }: ProductTableProps) {
  const [searchTerm, setSearchTerm] = useState("")

  // Filter products based on search term
  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))

  // Format price range
  const formatPriceRange = (prices: number[]) => {
    if (!prices || prices.length === 0) return "-"
    if (prices.length === 1) return `${prices[0].toLocaleString("vi-VN")}đ`

    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)

    return `${minPrice.toLocaleString("vi-VN")}đ - ${maxPrice.toLocaleString("vi-VN")}đ`
  }

  // Render product images
  const renderProductImages = (photoUrls: string[]) => {
    if (!photoUrls || photoUrls.length === 0) {
      return (
        <Avatar className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden">
          <AvatarFallback className="text-brand-500 dark:text-brand-400">
            <Package color="white" className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      )
    }

    if (photoUrls.length === 1) {
      return (
        <Avatar className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 overflow-hidden">
          <AvatarImage
            src={photoUrls[0] || "/placeholder.svg"}
            alt="Product"
            className="w-full h-full object-cover rounded-full"
          />
          <AvatarFallback className="bg-gray-100 dark:bg-gray-800 text-brand-500 dark:text-brand-400">
            <Package color="white" className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      )
    }

    // Stack of avatars for multiple images
    return (
      <div className="flex -space-x-3">
        {photoUrls.slice(0, 3).map((url, index) => (
          <div key={index} className="w-8 h-8 overflow-hidden border-2 border-white rounded-full dark:border-gray-900">
            <Image
              width={40}
              height={40}
              src={url || "/placeholder.svg"}
              alt={`Product ${index + 1}`}
              className="w-full h-full object-cover rounded-full bg-gray-100 dark:bg-gray-800"
            />
          </div>
        ))}
      </div>
    )
  }

  // Render skeleton loader
  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-none">

        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[600px]">
            <Table>
              <TableHeader className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-4 py-3 font-normal text-brand-500 dark:text-brand-400 text-start text-sm"
                  >
                    <Skeleton className="h-5 w-24 bg-gray-200 dark:bg-gray-700" />
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-3 font-normal text-brand-500 dark:text-brand-400 text-start text-sm hidden md:table-cell"
                  >
                    <Skeleton className="h-5 w-16 bg-gray-200 dark:bg-gray-700" />
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-3 font-normal text-brand-500 dark:text-brand-400 text-start text-sm hidden md:table-cell"
                  >
                    <Skeleton className="h-5 w-20 bg-gray-200 dark:bg-gray-700" />
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-3 font-normal text-brand-500 dark:text-brand-400 text-start text-sm w-24"
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

  // Nếu không có sản phẩm và không đang tải, hiển thị thông báo
  if (products.length === 0 && !isLoading) {
    return (
      <ComponentCard className="shadow-none">
        <CardContent className="flex flex-col items-center justify-center py-10">
          <Package className="w-10 h-10 text-gray-400 dark:text-brand-300 mb-4" />
          <h3 className="text-sm font-normal text-gray-400 dark:text-brand-300">Hiện chưa có sản phẩm nào.</h3>
        </CardContent>
      </ComponentCard>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-dashed border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[400px]">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-gray-800 border-b mt-0 border-gray-200 dark:border-gray-700 sticky top-0 z-10">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-4 py-3 font-normal text-dark dark:text-brand-300 text-start text-sm"
                >
                  <div className="flex items-center">Sản phẩm</div>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 font-normal text-dark dark:text-brand-300 text-start text-sm hidden md:table-cell"
                >
                  <div className="flex items-center">Giá</div>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 font-normal text-dark dark:text-brand-300 text-start text-sm hidden md:table-cell"
                >
                  <div className="flex items-center">Biến thể</div>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 font-normal text-dark dark:text-brand-300 text-start text-sm"
                >
                  Hành động
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredProducts.map((product) => (
                <TableRow
                  key={product._id}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 cursor-pointer"
                >
                  <TableCell className="px-4 py-3 text-start">
                    <div className="flex items-center gap-3">
                      {renderProductImages(product.photoUrls)}
                      <span className="block font-normal text-gray-500 dark:text-emerald-400 text-sm">
                        {truncateText(product.name, 30)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 font-normal text-start text-sm hidden md:table-cell">
                    <span className="text-gray-500">{formatPriceRange((product.prices))}</span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-sm hidden md:table-cell">
                    {product.numberOfVariants > 0 ? (
                      <span className="font-normal text-gray-500">{product.numberOfVariants} biến thể</span>
                    ) : (
                      <span className="font-normal text-gray-500">Không có</span>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    <div className="flex items-center gap-2">
                      {/* Always visible edit button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onEdit && onEdit(product._id)
                        }}
                        className="text-brand-700 text-sm dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-500 flex items-center"
                      >
                        <span className="inline">Sửa</span>
                      </button>

                      {/* Always visible delete button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onDelete && onDelete(product._id, product.name)
                        }}
                        className="text-red-600 text-sm dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 flex items-center ml-2"
                      >
                        <span className="inline">Xóa</span>
                      </button>
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
