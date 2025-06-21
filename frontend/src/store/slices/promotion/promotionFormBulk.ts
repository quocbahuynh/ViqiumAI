import { Product } from "@/types/productType";
import { ProductBulkApply, PromotionBulk } from "@/types/promotionType";
import { createSlice, PayloadAction } from "@reduxjs/toolkit"



interface PromotionFormBulkState {
  promotionBulk: PromotionBulk;
}

const initialState: PromotionFormBulkState = {
  promotionBulk: {
    name: "",
    startTime: "",
    endTime: "",
    promotionId: "",
    product: [],
    productApply: [],
  },
}

const promotionFormBulkSlice = createSlice({
  name: "promotionFormBulk",
  initialState,
  reducers: {
    // Reset form về trạng thái ban đầu
    resetPromotionBulk(state) {
      state.promotionBulk = initialState.promotionBulk
    },
    setPromotionBluk(state, action: PayloadAction<Partial<PromotionBulk>>) {
      state.promotionBulk = {
        ...state.promotionBulk,
        ...action.payload,
      };
    },
    
    // Cập nhật một field cụ thể của PromotionBulk (name, startTime, endTime, promotionId)
    updatePromotionBulkField(state, action: PayloadAction<Partial<PromotionBulk>>) {
      state.promotionBulk = { ...state.promotionBulk, ...action.payload }
    },

    // Thêm sản phẩm vào danh sách product
    addProduct(state, action: PayloadAction<Product>) {
      state.promotionBulk.product.push(action.payload)
    },

    // Chỉnh sửa một ProductBulkApply tại index cụ thể
    editProductBulkApply(state, action: PayloadAction<{ index: number; productBulkApply: ProductBulkApply }>) {
      const { index, productBulkApply } = action.payload
      if (state.promotionBulk.productApply[index]) {
        state.promotionBulk.productApply[index] = productBulkApply
      }
    },

    // Thêm một ProductBulkApply mới
    addProductBulkApply(state, action: PayloadAction<ProductBulkApply>) {
      state.promotionBulk.productApply.push(action.payload)
    },
  },
})

export const {
  resetPromotionBulk,
  updatePromotionBulkField,
  addProduct,
  editProductBulkApply,
  setPromotionBluk,
  addProductBulkApply,
} = promotionFormBulkSlice.actions

export default promotionFormBulkSlice.reducer