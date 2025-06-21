import { Product } from '@/types/productType';
import { ProductGiftApply, PromotionGift } from '@/types/promotionType';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';



// Định nghĩa state ban đầu
interface PromotionGiftState {
  promotionGift: PromotionGift;
}

const initialState: PromotionGiftState = {
  promotionGift: {
    name: "",
    startTime: "",
    endTime: "",
    promotionId: "",
    product: [],
    productApply: [],
  },
};

// Tạo slice
const promotionGiftSlice = createSlice({
  name: 'promotionGift',
  initialState,
  reducers: {
    // Reset state về giá trị ban đầu
    resetPromotionGift(state) {
      state.promotionGift = initialState.promotionGift;
    },
    setPromotionGift(state, action: PayloadAction<Partial<PromotionGift>>) {
      state.promotionGift = {
        ...state.promotionGift,
        ...action.payload,
      };
    },
    
    // Chỉnh sửa từng field của PromotionGift (name, startTime, endTime, promotionId)
    updatePromotionGiftField(state, action: PayloadAction<Partial<PromotionGift>>) {
      state.promotionGift = {
        ...state.promotionGift,
        ...action.payload,
      };
    },

    // Thêm từng product vào mảng product
    addProduct(state, action: PayloadAction<Product>) {
      state.promotionGift.product.push(action.payload);
    },

    // Chỉnh sửa một ProductGiftApply trong mảng productApply (dựa trên index)
    editProductGiftApply(state, action: PayloadAction<{ index: number; productGiftApply: ProductGiftApply }>) {
      const { index, productGiftApply } = action.payload;
      if (index >= 0 && index < state.promotionGift.productApply.length) {
        state.promotionGift.productApply[index] = productGiftApply;
      }
    },

    // Thêm một sản phẩm vào productGift của một ProductGiftApply (dựa trên index của ProductGiftApply)
    addProductToProductGiftApply(state, action: PayloadAction<{ index: number; product: Product }>) {
      const { index, product } = action.payload;
      if (index >= 0 && index < state.promotionGift.productApply.length) {
        state.promotionGift.productApply[index].productGift.push(product);
      }
    },

    // Thêm một ProductGiftApply mới vào mảng productApply
    addProductGiftApply(state, action: PayloadAction<ProductGiftApply>) {
      state.promotionGift.productApply.push(action.payload);
    },
  },
});

// Export actions
export const {
  resetPromotionGift,
  updatePromotionGiftField,
  addProduct,
  editProductGiftApply,
  setPromotionGift,
  addProductToProductGiftApply,
  addProductGiftApply,
} = promotionGiftSlice.actions;

// Export reducer
export default promotionGiftSlice.reducer;