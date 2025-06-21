"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import type React from "react";

import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { Label } from "@/components/ui/label";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import { ImageIcon, Loader2, Upload, X, Plus } from "lucide-react";
import { formatCurrency, unformatCurrency } from "@/utils/money";
import { resetForm, updateClassifications } from "@/store/slices/product/productFormSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import VariantClassifications from "./Classification";
import VariantCombinations from "./VariantCombination";
import { updateClassificationsState, addClassification } from "@/store/slices/product/variantClassificationSlice";
import Image from "next/image";
import { imageService } from "@/lib/api";
import { toast } from "sonner";
import { PostProduct } from "@/types/productType";

interface AddProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: PostProduct) => void;
  isLoading?: boolean;
  isLoadingProductDetail?: boolean; // Add new prop for loading product detail
  isEditMode?: boolean;
}

export default function AddProductForm({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  isLoadingProductDetail = false, // Default to false
  isEditMode = true,
}: AddProductFormProps) {
  // Form state
  const formData = useAppSelector((state) => state.productForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [productImage, setProductImage] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();

  // Get classifications from Redux store
  const { classifications } = useAppSelector((state) => state.classification);
  const currentClassifications = useAppSelector((state) => state.classification.classifications);

  // Ref to track the number of times we've skipped
  const skipCount = useRef(0);

  // Handle input changes for main product fields
  const handleInputChange = (field: keyof PostProduct, value: string | number) => {
    if (field === "basePrice" && typeof value === "string") {
      const numericValue = unformatCurrency(value);
      dispatch({ type: "productForm/updateField", payload: { field, value: numericValue } });
    } else {
      dispatch({ type: "productForm/updateField", payload: { field, value } });
    }
  };

  // Handle price change with formatting
  const handlePriceChange = (value: string) => {
    const numericValue = unformatCurrency(value);
    handleInputChange("basePrice", numericValue);
  };

  // Handle classifications change
  const handleClassificationsChange = useCallback(
    (updatedClassifications: any) => {
      if (JSON.stringify(updatedClassifications) !== JSON.stringify(currentClassifications)) {
        dispatch(updateClassificationsState(updatedClassifications));
        dispatch(updateClassifications(updatedClassifications));
      }
    },
    [currentClassifications, dispatch]
  );

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setIsUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await imageService.postImage(formData);

      setProductImage(response.url);
      dispatch({
        type: "productForm/updateField",
        payload: { field: "basePhotoUrl", value: response.url },
      });

      toast.success("Đã tải lên ảnh thành công");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Có lỗi xảy ra khi tải lên ảnh");
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Handle image removal
  const handleRemoveImage = () => {
    setProductImage(null);
    dispatch({
      type: "productForm/updateField",
      payload: { field: "basePhotoUrl", value: "" },
    });
  };

  // Trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    skipCount.current = 0;
  }, [isOpen]);

  // Reset form to initial state
  const resetFormData = () => {
    dispatch({ type: "productForm/resetForm" });
    dispatch(resetForm());
    setProductImage(null);
    setFormErrors({});
  };

  // Handle form submission
  const handleSubmit = async () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Tên sản phẩm không được để trống";
    }

    if (formData.basePrice <= 0 && formData.variant.length === 0) {
      errors.basePrice = "Giá cơ bản phải lớn hơn 0";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    console.log("Submitting product data:", formData);
    await onSubmit(formData);
    resetFormData();
  };

  // Force update variants when classifications change
  useEffect(() => {
    if (isEditMode && skipCount.current < 3) {
      skipCount.current += 1;
      return;
    }

    if (classifications.some((c) => c.label && c.options.some((o) => o.label))) {
      dispatch(updateClassifications(classifications));
    }
  }, [classifications, dispatch, isEditMode]);

  // Set product image from form data if available
  useEffect(() => {
    if (formData.basePhotoUrl && !productImage) {
      setProductImage(formData.basePhotoUrl);
    }
  }, [formData.basePhotoUrl, productImage]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (!isLoading && !isLoadingProductDetail) {
          resetFormData();
          onClose();
        }
      }}
      className="w-full max-w-[90vw] sm:max-w-[700px] lg:max-w-[900px] p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-900 rounded-xl shadow-xl relative"
    >
      {isLoadingProductDetail ? (
        <div className="flex items-center justify-center h-[70vh]">
          <Loader2 className="w-10 h-10 text-brand-300 animate-spin" />
          <span className="ml-3 text-lg text-brand-600 dark:text-gray-300">
            Đang tải thông tin sản phẩm...
          </span>
        </div>
      ) : (
        <>
          <h4 className="mb-6 text-xl font-medium text-dark dark:text-white">
            {isEditMode ? "Thông tin sản phẩm" : "Thêm sản phẩm mới"}
          </h4>
          <div className="max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
            <div className="space-y-6">
              <Label className="text-sm text-gray-500 dark:text-gray-300 mb-2 block">
                Hình ảnh sản phẩm
              </Label>

              {/* Product Image */}
              <div>
                <div className="mt-1">
                  {productImage ? (
                    <div className="relative w-32 h-32 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <Image
                        src={productImage || "/placeholder.svg"}
                        alt="Product"
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={handleRemoveImage}
                        className="absolute top-1 right-1 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        title="Xóa ảnh"
                      >
                        <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={triggerFileInput}
                      className={`w-32 h-32 border-2 border-dashed ${
                        isUploadingImage
                          ? "border-green-400"
                          : "border-gray-300 dark:border-gray-600"
                      } rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors`}
                    >
                      {isUploadingImage ? (
                        <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
                      ) : (
                        <>
                          <ImageIcon className="w-8 h-8 text-gray-400 dark:text-gray-500 mb-2" />
                          <span className="text-xs text-gray-500 dark:text-gray-400 text-center px-2">
                            Tải lên ảnh sản phẩm
                          </span>
                        </>
                      )}
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isUploadingImage}
                  />
                  {!productImage && !isUploadingImage && (
                    <Button
                      variant="outline"
                      size="md"
                      onClick={triggerFileInput}
                      className="mt-2 text-base border-gray-300 dark:border-gray-600"
                    >
                      <Upload className="w-4 h-4 mr-1" />
                      Chọn ảnh
                    </Button>
                  )}
                </div>
              </div>

              {/* Product Name */}
              <div>
                <Label className="text-sm text-gray-500 dark:text-gray-300">
                  Tên sản phẩm <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="Nhập tên sản phẩm..."
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  value={formData.name}
                  className={`mt-1 w-full rounded-lg border ${
                    formErrors.name
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } px-3 py-2 text-gray-800 dark:text-white bg-white dark:bg-gray-800 focus:border-brand-200 transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500`}
                />
                {formErrors.name && (
                  <p className="mt-1 text-xs text-red-500">{formErrors.name}</p>
                )}
              </div>

              {/* Product Description */}
              <div>
                <Label className="text-sm text-gray-500 dark:text-gray-300">
                  Mô tả sản phẩm
                </Label>
                <TextArea
                  value={formData.description}
                  onChange={(value) => handleInputChange("description", value)}
                  rows={4}
                  placeholder="Nhập mô tả sản phẩm..."
                  className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-800 dark:text-white bg-white dark:bg-gray-800 focus:border-brand-200 transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>

              {/* Base Price - Show when no classifications */}
              {classifications.length === 0 && (
                <div>
                  <Label className="text-sm text-gray-500 dark:text-gray-300">
                    Giá cơ bản <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    value={formatCurrency(formData.basePrice || 0)}
                    onChange={(e) => handlePriceChange(e.target.value)}
                    placeholder="Nhập giá cơ bản..."
                    className={`mt-1 w-full rounded-lg border ${
                      formErrors.basePrice
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    } px-3 py-2 text-gray-800 dark:text-white bg-white dark:bg-gray-800 focus:border-brand-200 transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500`}
                  />
                  {formErrors.basePrice && (
                    <p className="mt-1 text-xs text-red-500">{formErrors.basePrice}</p>
                  )}
                </div>
              )}

              {/* Classifications or Add Classification Button */}
              {classifications.length > 0 ? (
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <VariantClassifications onChange={handleClassificationsChange} />
                </div>
              ) : (
                <Button
                  onClick={() => dispatch(addClassification())}
                  size="md"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm phân loại
                </Button>
              )}

              {/* Variant Combinations - Show when there are variants */}
              {formData.variant.length > 0 && classifications.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-dark dark:text-gray-300">
                    Danh sách phân loại
                  </Label>
                  <div className="mt-2">
                    <VariantCombinations />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 mt-6">
            <Button
              size="md"
              variant="outline"
              onClick={() => {
                if (!isLoading) {
                  resetFormData();
                  onClose();
                }
              }}
              disabled={isLoading}
            >
              {isEditMode ? "Hủy" : "Đóng"}
            </Button>

            <Button
              size="md"
              onClick={handleSubmit}
              disabled={isLoading || isUploadingImage}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : isEditMode ? (
                "Cập nhật sản phẩm"
              ) : (
                "Thêm sản phẩm"
              )}
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
}