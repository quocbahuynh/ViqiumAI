import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Classification, ClassificationOption, ClassificationPost, PostProduct, Variant } from "@/types/productType";

const initialState: PostProduct = {
  name: "",
  basePhotoUrl: "",
  description: "",
  basePrice: 0,
  variant: [],
};

// Hàm chuyển đổi từ Classification[] sang PostProduct["variant"]
export const convertClassificationsToPostProductVariants = (
  classifications: Classification[],
  defaultPrice = 0,
  defaultPhotoUrl = ""
): PostProduct["variant"] => {
  // Lọc ra các classifications có giá trị hợp lệ
  const validClassifications = classifications.filter((c) => c.label && c.options && c.options.some((o) => o.label));

  // Nếu không có classifications hợp lệ, trả về mảng rỗng
  if (validClassifications.length === 0) {
    return [];
  }

  // Hàm tạo tất cả tổ hợp của các options
  const generateCombinations = (
    classIndex: number,
    currentCombination: { classification: Classification; option: ClassificationOption }[]
  ): { classification: Classification; option: ClassificationOption }[][] => {
    // Base case: Nếu đã xử lý hết tất cả classifications
    if (classIndex >= validClassifications.length) {
      return [currentCombination];
    }

    const classification = validClassifications[classIndex];
    const results: { classification: Classification; option: ClassificationOption }[][] = [];

    // Lọc ra các options có giá trị
    const validOptions = classification.options.filter((o) => o.label && o.value);

    // Nếu classification không có options hợp lệ, bỏ qua
    if (validOptions.length === 0) {
      return generateCombinations(classIndex + 1, currentCombination);
    }

    // Với mỗi option trong classification hiện tại
    for (const option of validOptions) {
      const newCombination = [...currentCombination, { classification, option }];
      const combinations = generateCombinations(classIndex + 1, newCombination);
      results.push(...combinations);
    }

    return results;
  };

  // Tạo tất cả tổ hợp
  const combinations = generateCombinations(0, []);

  // Chuyển đổi mỗi tổ hợp thành một variant
  const variants: PostProduct["variant"] = combinations.map((combination) => {
    const variantClassifications: ClassificationPost[] = combination.map(({ classification, option }) => ({
      classificationId: classification._id,
      label: classification.label,
      valueClassificationId: option._id,
      valueLabel: option.label,
      aidescription: "",
      value: classification.value,
      typeRoles: classification.isCustom ? "user" : "system",
      valueAidescription: "",
      valueValue: option.value,
      valueTypeRoles: option.isCustom ? "user" : "system",
    }));

    return {
      photoUrl: defaultPhotoUrl,
      classifications: variantClassifications,
      price: defaultPrice,
    };
  });

  return variants;
};

// Hàm kiểm tra xem variant có khớp với variantId không
const areVariantsEqual = (variant: Variant, variantId: string[]): boolean => {
  // Lấy danh sách valueLabel từ classifications của variant
  const variantClassificationValues = variant.classifications.map((c) => c.valueLabel);

  // So sánh từng valueLabel với variantId
  if (variantClassificationValues.length !== variantId.length) {
    return false;
  }

  return variantClassificationValues.every((value, index) => value === variantId[index]);
};

// Hàm kiểm tra xem variant có chứa valueLabel khớp với variantId không
const hasMatchingValueLabel = (variant: Variant, variantId: string): boolean => {
  // Kiểm tra xem có bất kỳ valueLabel nào trong classifications khớp với variantId không
  return variant.classifications.some((c) => c.valueLabel === variantId);
};

const productFormSlice = createSlice({
  name: "productForm",
  initialState,
  reducers: {
    // Reset form to initial state
    resetForm: () => {
      return initialState;
    },

    // Set entire product form data
    setProductForm: (state: PostProduct, action: PayloadAction<PostProduct>) => {
      const product = action.payload;
      state.name = product.name;
      state.basePhotoUrl = product.basePhotoUrl || "";
      state.description = product.description || "";
      state.basePrice = product.basePrice || 0;
      state.variant = product.variant || [];
    },

    // Update a single field in the form
    updateField: (
      state: PostProduct,
      action: PayloadAction<{
        field: keyof PostProduct;
        value: string | number;
      }>
    ) => {
      const { field, value } = action.payload;
      (state[field] as any) = value;
    },

    updateClassifications: (state, action: PayloadAction<Classification[]>) => {
      const classifications = action.payload;
      // Chỉ tạo variants khi có classifications hợp lệ
      const validClassifications = classifications.filter(
        (c) => c.label && c.options && c.options.some((o) => o.label)
      );

      if (validClassifications.length > 0) {
        const variants = convertClassificationsToPostProductVariants(validClassifications, state.basePrice);
        state.variant = variants;
        console.log("Generated variants:", variants);
      } else {
        state.variant = [];
      }
    },

    updateVariant: (
      state: PostProduct,
      action: PayloadAction<{
        variantId: string[]; // Mảng valueLabel để xác định variant
        field: keyof Variant; // Trường cần cập nhật (photoUrl, price, hoặc classifications)
        value: Variant[keyof Variant]; // Giá trị mới, kiểu phụ thuộc vào field
      }>
    ) => {
      const { variantId, field, value } = action.payload;

      // Tìm index của variant khớp với variantId
      const variantIndex = state.variant.findIndex((variant) => areVariantsEqual(variant, variantId));

      // Nếu tìm thấy variant, cập nhật trường field với giá trị value
      if (variantIndex !== -1) {
        state.variant[variantIndex] = {
          ...state.variant[variantIndex],
          [field]: value,
        };
      } else {
        console.warn(`Không tìm thấy variant với classifications: ${variantId.join(", ")}`);
      }
    },

    deleteVariant: (
      state: PostProduct,
      action: PayloadAction<{
        variantId: string[]; // Mảng valueLabel để xác định variant
      }>
    ) => {
      const { variantId } = action.payload;

      // Tìm index của variant khớp với variantId
      const variantIndex = state.variant.findIndex((variant) => areVariantsEqual(variant, variantId));

      // Nếu tìm thấy variant, xóa variant đó khỏi danh sách
      if (variantIndex !== -1) {
        state.variant.splice(variantIndex, 1);
      } else {
        console.warn(`Không tìm thấy variant với classifications: ${variantId.join(", ")}`);
      }
    },

    addPhotoToVariants: (
      state: PostProduct,
      action: PayloadAction<{
        variantId: string; // Một valueLabel để tìm trong classifications
        photoUrl: string; // URL ảnh để thêm vào các variant khớp
      }>
    ) => {
      const { variantId, photoUrl } = action.payload;

      // Đếm số variant được cập nhật
      let updatedCount = 0;

      // Duyệt qua tất cả variant và cập nhật photoUrl nếu khớp
      state.variant.forEach((variant, index) => {
        if (hasMatchingValueLabel(variant, variantId)) {
          state.variant[index] = {
            ...variant,
            photoUrl,
          };
          updatedCount++;
        }
      });

      // Nếu không tìm thấy variant nào khớp, in cảnh báo
      if (updatedCount === 0) {
        console.warn(`Không tìm thấy variant nào với valueLabel: ${variantId}`);
      }
    },
  },
});

export const { resetForm, setProductForm, updateField, updateClassifications, updateVariant, deleteVariant, addPhotoToVariants } =
  productFormSlice.actions;

export default productFormSlice.reducer;