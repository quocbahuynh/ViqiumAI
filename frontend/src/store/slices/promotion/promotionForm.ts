import { Product } from "@/types/productType";
import { ProductApply, Promotion } from "@/types/promotionType";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PromotionState {
  promotion: Promotion;
}

const initialState: PromotionState = {
  promotion: {
    name: "",
    startTime: "",
    endTime: "",
    promotionId: "",
    productApply: [],
  },
};

const promotionSlice = createSlice({
  name: "promotion",
  initialState,
  reducers: {
    // Reset promotion state
    resetPromotion: (state) => {
      state.promotion = initialState.promotion;
    },

    // Update basic promotion info (name, startTime, endTime, promotionId)
    updatePromotionInfo: (
      state,
      action: PayloadAction<Partial<Pick<Promotion, "name" | "startTime" | "endTime" | "promotionId">>>
    ) => {
      state.promotion = { ...state.promotion, ...action.payload };
    },
        setPromotion(state, action: PayloadAction<Partial<Promotion>>) {
          state.promotion = {
            ...state.promotion,
            ...action.payload,
          };
        },

    // Add a product to productApply
    addProductApply: (state, action: PayloadAction<Product>) => {
      const newProductApply: ProductApply = {
        product: action.payload,
        promoteType: "percent", // Default value
        promotePricing: 0,      // Default value
      };
      state.promotion.productApply.push(newProductApply);
    },

    // Remove a product from productApply by productId
    removeProductApply: (state, action: PayloadAction<string>) => {
      state.promotion.productApply = state.promotion.productApply.filter(
        (item) => item.product._id !== action.payload
      );
    },

    // Update promoteType and promotePricing for a specific product
    updateProductPromotion: (
      state,
      action: PayloadAction<{
        productId: string;
        promoteType?: "percent" | "fixed";
        promotePricing?: number;
      }>
    ) => {
      const { productId, promoteType, promotePricing } = action.payload;
      const productIndex = state.promotion.productApply.findIndex(
        (item) => item.product._id === productId
      );

      if (productIndex !== -1) {
        const updatedProduct = { ...state.promotion.productApply[productIndex] };
        if (promoteType !== undefined) {
          updatedProduct.promoteType = promoteType;
        }
        if (promotePricing !== undefined) {
          updatedProduct.promotePricing = promotePricing;
        }
        state.promotion.productApply[productIndex] = updatedProduct;
      }
    },

    // Update promoteType and promotePricing for all products
    updateAllProductsPromotion: (
      state,
      action: PayloadAction<{
        promoteType: "percent" | "fixed";
        promotePricing: number;
      }>
    ) => {
      const { promoteType, promotePricing } = action.payload;
      state.promotion.productApply = state.promotion.productApply.map((item) => ({
        ...item,
        promoteType,
        promotePricing,
      }));
    },
  },
});

export const {
  resetPromotion,
  updatePromotionInfo,
  addProductApply,
  removeProductApply,
  setPromotion,
  updateProductPromotion,
  updateAllProductsPromotion,
} = promotionSlice.actions;

export default promotionSlice.reducer;