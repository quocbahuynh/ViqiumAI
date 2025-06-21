"use client";
import type React from "react";
import { useState } from "react";
import Input from "@/components/form/input/InputField";
import { formatCurrency, unformatCurrency } from "@/utils/money";
import { ImageIcon, Trash2 } from "lucide-react";
import { imageService } from "@/lib/api";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import Button from "@/components/ui/button/Button";
import { toast } from "sonner";
import { deleteVariant } from "@/store/slices/product/productFormSlice";
import { Variant } from "@/types/productType";

export default function VariantCombinations() {
  const dispatch = useAppDispatch();
  const { variant: variants, basePrice } = useAppSelector((state) => state.productForm);
  const { classifications } = useAppSelector((state) => state.classification);

  const [isLoading, setIsLoading] = useState(false);
  const [uploadingGroup, setUploadingGroup] = useState<string | null>(null);
  const [bulkPrice, setBulkPrice] = useState(0);

  // Apply bulk price to all variants
  const applyBulkPrice = () => {
    try {
      const numericPrice = bulkPrice;
      if (numericPrice < 0) {
        toast.error("Giá không thể là số âm");
        return;
      }

      variants.forEach((variant) => {
        const variantId = variant.classifications.map((c) => c.valueLabel);
        dispatch({
          type: "productForm/updateVariant",
          payload: {
            variantId,
            field: "price",
            value: numericPrice,
          },
        });
      });

      toast.success("Đã áp dụng giá cho tất cả phân loại");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi áp dụng giá");
    }
  };

  // Handle price change for a specific variant
  const handlePriceChange = (variantId: string[], value: string) => {
    try {
      const numericPrice = unformatCurrency(value);
      dispatch({
        type: "productForm/updateVariant",
        payload: {
          variantId,
          field: "price",
          value: numericPrice,
        },
      });
    } catch (error) {
      toast.error("Giá không hợp lệ");
    }
  };

  // Handle delete variant
  const handleDeleteVariant = (variantId: string[]) => {
    dispatch(deleteVariant({ variantId }));
    toast.success("Đã xóa phân loại");
  };

  // Handle image upload for a variant group
  const handleImageUpload = async (groupValue: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setUploadingGroup(groupValue);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await imageService.postImage(formData);
      dispatch({
        type: "productForm/addPhotoToVariants",
        payload: {
          variantId: groupValue,
          photoUrl: response.url,
        },
      });

      toast.success("Đã tải lên ảnh thành công");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tải lên ảnh");
    } finally {
      setUploadingGroup(null);
    }
  };

  // Group variants by their first classification
  const groupVariantsByFirstClassification = (variants: Variant[]) => {
    if (!variants.length || !classifications.length) return [];

    const groups = new Map<string, Variant[]>();

    variants.forEach((variant) => {
      if (variant.classifications.length === 0) return;

      const firstClassification = variant.classifications.find((c) => c.classificationId === classifications[0]._id);

      if (!firstClassification) return;

      const groupKey = firstClassification.valueLabel;

      if (!groups.has(groupKey)) {
        groups.set(groupKey, []);
      }

      groups.get(groupKey)!.push(variant);
    });

    return Array.from(groups.entries());
  };

  // Get color class for variant labels based on value
  const getColorClass = (value: string) => {
    const colors = [
      { bg: "bg-red-100", text: "text-red-800", border: "border-red-200" }, // Red
      { bg: "bg-pink-100", text: "text-pink-800", border: "border-pink-200" }, // Pink
      { bg: "bg-green-100", text: "text-green-800", border: "border-green-200" }, // green
      { bg: "bg-green-100", text: "text-green-800", border: "border-green-200" }, // Green
      { bg: "bg-purple-100", text: "text-purple-800", border: "border-purple-200" }, // Purple
      { bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-200" }, // Yellow
    ];

    const hash = value.split("").reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
    const index = Math.abs(hash) % colors.length;
    return `${colors[index].bg} ${colors[index].text} ${colors[index].border}`;
  };

  // If loading, show skeleton
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-100 rounded-md mb-4"></div>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="border border-gray-200 rounded-md p-4">
              <div className="h-6 bg-gray-100 w-1/4 rounded mb-4"></div>
              <div className="space-y-2">
                {[1, 2].map((j) => (
                  <div key={j} className="flex gap-4">
                    <div className="h-10 bg-gray-100 w-1/4 rounded"></div>
                    <div className="h-10 bg-gray-100 w-1/4 rounded"></div>
                    <div className="h-10 bg-gray-100 w-1/3 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // If no variants, show a message
  if (!variants.length) {
    return (
      <div className="p-8 text-center text-gray-500 border border-gray-200 rounded-md">
        Không có phân loại nào. Vui lòng thêm phân loại để tạo biến thể sản phẩm.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Bulk price input */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-gray-700">Giá áp dụng với tất cả sản phẩm:</span>
        <Input
          type="text"
          value={formatCurrency(bulkPrice)}
          onChange={(e) => setBulkPrice(unformatCurrency(e.target.value))}
          placeholder="Nhập giá cho tất cả phân loại"
          className="border border-gray-200 rounded-md px-3 py-2 text-sm w-64"
        />
        <Button
          size="md"
          onClick={applyBulkPrice}
          
        >
          Áp dụng cho tất cả phân loại
        </Button>
      </div>

      {/* Variant groups */}
      {groupVariantsByFirstClassification(variants).map(([groupValue, groupItems], groupIndex) => {
        // Check if there are secondary classifications
        const hasSecondaryClassifications = groupItems.some((variant) =>
          variant.classifications.some((c) => c.classificationId !== classifications[0]._id)
        );

        // Get variant ID for the group (used when there are no secondary classifications)
        const variantId = groupItems[0]?.classifications.map((c) => c.valueLabel);

        return (
          <div
            key={`group-${groupIndex}`}
            className="border border-gray-200 rounded-md overflow-hidden mb-4"
          >
            {/* Group header with image */}
            <div className="flex items-center py-4 px-4 bg-white">
              <div className="mr-4">
                <div className="relative w-12 h-12">
                  <label
                    htmlFor={`image-upload-group-${groupIndex}`}
                    className={`w-12 h-12 border ${
                      groupItems[0].photoUrl
                        ? "border-solid border-gray-300"
                        : "border-dashed border-gray-300"
                    } rounded-md flex items-center justify-center bg-white hover:bg-gray-50 transition-colors cursor-pointer overflow-hidden`}
                  >
                    {uploadingGroup === groupValue ? (
                      <div className="flex items-center justify-center w-full h-full">
                        <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : groupItems[0].photoUrl ? (
                      <Image
                        width={48}
                        height={48}
                        src={groupItems[0].photoUrl || "/placeholder.svg"}
                        alt={`Group ${groupValue}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-gray-400" />
                    )}
                  </label>
                  <input
                    id={`image-upload-group-${groupIndex}`}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(groupValue, e)}
                    className="hidden"
                    disabled={uploadingGroup !== null}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <div
                    className={`inline-block px-2 py-1 rounded-full text-xs border `}
                  >
                    {groupValue}
                  </div>
                  <span className="ml-2 text-xs text-gray-500">{groupItems.length} phân loại</span>
                </div>

                {/* Show price and delete button directly in the group header if no secondary classifications */}
                {!hasSecondaryClassifications && (
                  <div className="flex items-center">
                    <div className="flex items-center mr-4">
                      <Input
                        type="text"
                        value={formatCurrency(groupItems[0].price || basePrice || 0)}
                        onChange={(e) => handlePriceChange(variantId, e.target.value)}
                        placeholder="Nhập vào"
                        className="w-64 border border-gray-200 rounded-md px-3 py-1.5 text-sm"
                      />
                      <span className="ml-2 text-gray-500 mr-2 text-sm">đ</span>
                    </div>
                    <button
                      onClick={() => handleDeleteVariant(variantId)}
                      className="p-2 text-gray-400 hover:text-red-500 rounded-full transition-colors"
                      title="Xóa phân loại"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Variant rows (only shown if there are secondary classifications) */}
            {hasSecondaryClassifications &&
              groupItems.map((variant, itemIndex) => {
                const variantId = variant.classifications.map((c) => c.valueLabel);
                const secondaryClassifications = variant.classifications.filter(
                  (c) => classifications.length > 1 && c.classificationId !== classifications[0]._id
                );

                return (
                  <div
                    key={`variant-${groupIndex}-${itemIndex}`}
                    className="flex items-center py-3 px-4 border-t border-gray-100 hover:bg-gray-50"
                  >
                    {/* Secondary classifications */}
                    <div className="w-16">
                      {secondaryClassifications.map((classification) => (
                        <div
                          key={`${variant.classifications[0].valueLabel}-${classification.valueLabel}`}
                          className={`inline-block px-2 py-1 rounded-full text-xs border ${getColorClass(
                            classification.valueLabel
                          )}`}
                        >
                          {classification.valueLabel}
                        </div>
                      ))}
                    </div>

                    {/* Price input */}
                    <div className="flex-1 flex items-center ml-4">
                      <span className="text-gray-500 mr-2 text-sm">đ</span>
                      <Input
                        type="text"
                        value={formatCurrency(variant.price || basePrice || 0)}
                        onChange={(e) => handlePriceChange(variantId, e.target.value)}
                        placeholder="Nhập vào"
                        className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-sm"
                      />
                    </div>

                    {/* Delete button */}
                    <div className="ml-4">
                      <button
                        onClick={() => handleDeleteVariant(variantId)}
                        className="p-2 text-gray-400 hover:text-red-500 rounded-full transition-colors"
                        title="Xóa phân loại"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        )})}
    </div>
  );
}