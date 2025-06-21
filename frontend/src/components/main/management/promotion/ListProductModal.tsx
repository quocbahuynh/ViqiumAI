"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import Button from "@/components/ui/button/Button"
import Input from "@/components/form/input/InputField"
import { Search, Loader2 } from "lucide-react"
import ProductTable from "./TablePreview"
import { Product } from "@/types/productType"

interface ProductSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (selectedProducts: Product[]) => void
  products: Product[]
  selectedProducts: string[]
  isLoading: boolean
}

export default function ProductSelectionModal({
  isOpen,
  onClose,
  onConfirm,
  products,
  selectedProducts: initialSelectedProducts,
  isLoading,
}: ProductSelectionModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])

  // Reset selected products when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedProducts([...initialSelectedProducts])
    }
  }, [isOpen, initialSelectedProducts])

  // Filter products based on search term
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Handle product selection
  const handleProductSelect = (productId: string) => {
    setSelectedProducts((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId)
      } else {
        return [...prev, productId]
      }
    })
  }

  // Handle select all products
  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(filteredProducts.map((product) => product._id))
    }
  }

  // Handle confirm selection
  const handleConfirm = () => {
    const selectedProductObjects = products.filter((product) =>
      selectedProducts.includes(product._id)
    )
    onConfirm(selectedProductObjects)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[90vw] md:max-w-[800px] max-h-[85vh] overflow-hidden flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
        <DialogHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
            Chọn sản phẩm
          </DialogTitle>
        </DialogHeader>

        <div className="relative my-4">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400 dark:text-gray-300" />
          </div>
          <Input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 py-2 text-sm border-gray-300 dark:border-gray-600  rounded-lg w-full dark:bg-gray-700 dark:text-gray-200 transition-all duration-200"
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-green-500 dark:text-green-400" />
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
              <ProductTable
                products={filteredProducts}
                showCheckbox={true}
                selectedProducts={selectedProducts}
                onSelectProduct={handleProductSelect}
                onSelectAll={handleSelectAll}
                showPrice={true}
              />
            </div>
            <div className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              Đã chọn:{" "}
              <span className="text-green-600 dark:text-green-400">
                {selectedProducts.length}
              </span>{" "}
              sản phẩm
            </div>
          </>
        )}

        <DialogFooter className="mt-4 sm:mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex justify-end gap-2 w-full">
            <Button
              variant="outline"
              onClick={onClose}
              size="md"
              className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md px-4 py-2 transition-colors duration-200"
            >
              Hủy
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={selectedProducts.length === 0}
              size="md"
            >
              Thêm sản phẩm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}