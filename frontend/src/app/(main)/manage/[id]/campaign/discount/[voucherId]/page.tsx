"use client";
import { useState, useEffect } from "react";
import type React from "react";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumbCustom";
import DatePicker from "@/components/form/date-picker";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  resetPromotion,
  updatePromotionInfo,
  addProductApply,
  removeProductApply,
  updateProductPromotion,
  updateAllProductsPromotion,
  setPromotion,
} from "@/store/slices/promotion/promotionForm";
import { fetchProducts } from "@/store/slices/product/productSlice";
import { useParams } from "next/navigation";
import { PlusCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import ProductSelectionModal from "@/components/main/management/promotion/ListProductModal";
import ProductTable from "@/components/main/management/promotion/TablePreview";
import type { PostPromotion, PostProductApply } from "@/types/promotionType";
import { promotionService } from "@/lib/api";
import { apiLinks } from "@/lib/api-link";
import axiosInstance from "@/lib/axios-config";
import { fetchVouchers } from "@/store/slices/promotion/promotion";

export default function DiscountCreatePage() {
  const params = useParams<{ id: string; voucherId?: string }>();
  const projectId = params?.id;
  const promotionId = params?.voucherId;
  const dispatch = useAppDispatch();

  // Get data from Redux store
  const products = useAppSelector((state) => state.products.data[projectId] || []);
  const productsStatus = useAppSelector((state) => state.products.status[projectId] || "idle");
  const promotion = useAppSelector((state) => state.promotionForm.promotion);

  // Local state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize promoteType and percentValue based on promotion data
  const [promoteType, setPromoteType] = useState<"percent" | "fixed">(
    promotion.productApply.length > 0 ? promotion.productApply[0].promoteType : "percent"
  );
  const [percentValue, setPercentValue] = useState<number>(
    promotion.productApply.length > 0 && promotion.productApply[0].promoteType === "percent"
      ? promotion.productApply[0].promotePricing
      : 0
  );

  // Fetch products if not already loaded
  useEffect(() => {
    if (projectId && productsStatus === "idle") {
      dispatch(fetchProducts(projectId));
    }
  }, [dispatch, projectId, productsStatus]);

  // Fetch promotion details if promotionId exists
  useEffect(() => {
    const fetchPromotionDetail = async () => {
      if (!projectId || !promotionId) {
        console.log("Missing projectId or promotionId, initializing new promotion");
        dispatch(resetPromotion());
        return;
      }

      try {
        const res = await axiosInstance.get(
          `${apiLinks.promote.getDiscountAndCombo}/${projectId}/${promotionId}`
        );
        const data = res.data.data;
        console.log("Fetched promotion:", data);

        if (data) {
          dispatch(resetPromotion());
          dispatch(setPromotion(data));
          // Set initial promoteType and percentValue based on fetched data
          if (data.productApply.length > 0) {
            setPromoteType(data.productApply[0].promoteType);
            setPercentValue(
              data.productApply[0].promoteType === "percent"
                ? data.productApply[0].promotePricing
                : 0
            );
          }
        } else {
          toast.error("Không thể tải thông tin khuyến mãi");
        }
      } catch (error) {
        console.error("Lỗi khi fetch promotion:", error);
        toast.error("Lỗi khi tải thông tin khuyến mãi");
      }
    };

    fetchPromotionDetail();
  }, [dispatch, projectId, promotionId]);

  // Handle promotion type change
  const handlePromoteTypeChange = (type: "percent" | "fixed") => {
    setPromoteType(type);

    // Update all products with the new promotion type
    if (promotion.productApply.length > 0) {
      dispatch(
        updateAllProductsPromotion({
          promoteType: type,
          promotePricing: type === "percent" ? percentValue : 0,
        })
      );
    }
  };

  // Handle percent value change for all products
  const handlePercentChange = (value: number) => {
    setPercentValue(value);
    if (promoteType === "percent" && promotion.productApply.length > 0) {
      dispatch(
        updateAllProductsPromotion({
          promoteType: "percent",
          promotePricing: value,
        })
      );
    }
  };

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    dispatch(updatePromotionInfo({ [field]: value }));
  };

  // Handle date changes with validation
  const handleDateChange = (field: "startTime" | "endTime", dateString: string) => {
    const selectedDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (field === "startTime") {
      if (selectedDate < today) {
        toast.error("Thời gian bắt đầu không được trước ngày hiện tại");
        return;
      }
      if (promotion.endTime) {
        const endDate = new Date(promotion.endTime);
        if (endDate <= selectedDate) {
          toast.error("Thời gian kết thúc phải sau thời gian bắt đầu");
          dispatch(updatePromotionInfo({ endTime: "" }));
        }
      }
    } else if (field === "endTime") {
      if (promotion.startTime) {
        const startDate = new Date(promotion.startTime);
        if (selectedDate <= startDate) {
          toast.error("Thời gian kết thúc phải sau thời gian bắt đầu");
          return;
        }
      }
    }

    dispatch(updatePromotionInfo({ [field]: dateString }));
  };

  // Open product selection modal
  const handleAddProducts = () => {
    setIsModalOpen(true);
  };

  // Handle product selection
  const handleProductSelect = (selectedProducts: any[]) => {
    selectedProducts.forEach((product) => {
      const exists = promotion.productApply.some((item) => item.product._id === product._id);
      if (!exists) {
        dispatch(addProductApply(product));
        if (promoteType === "percent") {
          dispatch(
            updateProductPromotion({
              productId: product._id,
              promoteType: "percent",
              promotePricing: percentValue,
            })
          );
        }
      }
    });
    setIsModalOpen(false);
  };

  // Handle removing a product
  const handleRemoveProduct = (productId: string) => {
    dispatch(removeProductApply(productId));
  };

  // Handle fixed price change for a specific product
  const handleFixedPriceChange = (productId: string, price: number) => {
    dispatch(
      updateProductPromotion({
        productId,
        promoteType: "fixed",
        promotePricing: price,
      })
    );
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!promotion.name) {
      toast.error("Vui lòng nhập tên khuyến mãi");
      return;
    }

    if (!promotion.startTime || !promotion.endTime) {
      toast.error("Vui lòng chọn thời gian bắt đầu và kết thúc");
      return;
    }

    if (promotion.productApply.length === 0) {
      toast.error("Vui lòng thêm ít nhất một sản phẩm");
      return;
    }

    const postProductApply: PostProductApply[] = promotion.productApply.map((item) => ({
      productId: item.product._id,
      promoteType: item.promoteType,
      promotePricing: item.promotePricing,
    }));
    const postPromotion: PostPromotion = {
      name: promotion.name,
      startTime: promotion.startTime,
      endTime: promotion.endTime,
      promotionId: promotion.promotionId || "680cf954e0c9459af6296c25",
      productApply: postProductApply,
    };

    setIsSubmitting(true);
    try {
      if (projectId) {
        const result = await promotionService.updatePromotionDiscount(postPromotion, projectId, promotionId);
        toast.success("Cập nhật khuyến mãi thành công");
        dispatch(fetchVouchers(projectId));
      } else {
        toast.error("Không tìm thấy ID dự án");
      }
    } catch (error) {
      console.error("Error submitting promotion:", error);
      toast.error("Lỗi khi cập nhật khuyến mãi", {
        description: error instanceof Error ? error.message : "Đã xảy ra lỗi. Vui lòng thử lại sau.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const minStartDate = today;
  const minEndDate = promotion.startTime
    ? new Date(new Date(promotion.startTime).getTime() + 24 * 60 * 60 * 1000)
    : undefined;

  return (
    <div>
      <PageBreadcrumb
        pageTitle={promotionId ? "Chỉnh sửa giảm giá sản phẩm" : "Tạo giảm giá sản phẩm"}
      />
      <ComponentCard title="Thông tin cơ bản">
        <div className="space-y-1 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="col-span-2">
            <Label>Tên khuyến mãi</Label>
            <Input
              type="text"
              value={promotion.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
          </div>
          <div className="col-span-1">
            <DatePicker
              id="start-date"
              label="Thời gian bắt đầu"
              placeholder="Chọn ngày bắt đầu"
              minDate={minStartDate}
              defaultDate={promotion.startTime ? new Date(promotion.startTime) : undefined}
              onChange={(dates, currentDateString) => {
                const isoString = dates[0].toISOString();
                handleDateChange("startTime", isoString);
              }}
            />
          </div>
          <div className="col-span-1">
            <DatePicker
              id="end-date"
              label="Thời gian kết thúc"
              placeholder="Chọn ngày kết thúc"
              minDate={minEndDate}
              disabled={!promotion.startTime}
              defaultDate={promotion.endTime ? new Date(promotion.endTime) : undefined}
              onChange={(dates, currentDateString) => {
                const isoString = dates[0].toISOString();
                handleDateChange("endTime", isoString);
              }}
            />
          </div>
          <div className="col-span-2">
            <Label>Loại khuyến mãi</Label>
            <div className="flex gap-6 mt-3">
              <div className="flex">
                <div className="flex items-center h-5">
                  <input
                    id="percent-radio"
                    aria-describedby="percent-radio-text"
                    type="radio"
                    checked={promoteType === "percent"}
                    onChange={() => handlePromoteTypeChange("percent")}
                    className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                <div className="ms-2 text-sm">
                  <label htmlFor="percent-radio" className="font-sm text-gray-700 dark:text-gray-300">
                    Giảm giá phần trăm
                  </label>
                  <p id="percent-radio-text" className="text-xs font-normal text-gray-600 dark:text-gray-300">
                    Giá được giảm theo một tỷ lệ phần trăm nhất định.
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="flex items-center h-5">
                  <input
                    id="fixed-radio"
                    aria-describedby="fixed-radio-text"
                    type="radio"
                    checked={promoteType === "fixed"}
                    onChange={() => handlePromoteTypeChange("fixed")}
                    className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                <div className="ms-2 text-sm">
                  <label htmlFor="fixed-radio" className="font-sm text-gray-700 dark:text-gray-300">
                    Giá cố định
                  </label>
                  <p id="fixed-radio-text" className="text-xs font-normal text-gray-600 dark:text-gray-300">
                    Giá là giá giảm đã đặt.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ComponentCard>

      <ComponentCard title="Sản phẩm áp dụng" className="mt-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-medium">Danh sách sản phẩm</h3>
              <p className="text-sm text-gray-500">Chọn sản phẩm để áp dụng khuyến mãi</p>
            </div>
            <Button
              size="md"
              onClick={handleAddProducts}
              startIcon={<PlusCircle className="w-4 h-4" />}
            >
              Thêm sản phẩm
            </Button>
          </div>

          {promoteType === "percent" && (
            <ComponentCard>
              <Label>Phần trăm giảm giá (%)</Label>
              <div className="flex items-center mt-2">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={percentValue.toString()}
                  onChange={(e) => handlePercentChange(Number(e.target.value))}
                  className="min-w-[150px]"
                />
                <span className="ml-2">%</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Áp dụng cho tất cả sản phẩm được chọn</p>
            </ComponentCard>
          )}

          {promotion.productApply.length > 0 ? (
            <ProductTable
              products={promotion.productApply.map((item) => ({
                ...item.product,
                promotePricing: item.promotePricing,
              }))}
              onRemove={handleRemoveProduct}
              showPrice={true}
              showPromotePrice={true}
              promoteType={promoteType}
              onPromotePriceChange={handleFixedPriceChange}
            />
          ) : (
            <ComponentCard className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">Chưa có sản phẩm nào được thêm</p>
              <Button
                variant="outline"
                size="md"
                onClick={handleAddProducts}
                startIcon={<PlusCircle className="w-4 h-4" />}
              >
                Thêm sản phẩm
              </Button>
            </ComponentCard>
          )}
        </div>
        <div className="mt-6 flex justify-end">
          <Button
            size="md"
            className="rounded-sm"
            disabled={isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              "Cập nhật khuyến mãi"
            )}
          </Button>
        </div>
      </ComponentCard>

      {/* Product Selection Modal */}
      <ProductSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleProductSelect}
        products={products}
        selectedProducts={promotion.productApply.map((item) => item.product._id)}
        isLoading={productsStatus === "loading"}
      />
    </div>
  );
}