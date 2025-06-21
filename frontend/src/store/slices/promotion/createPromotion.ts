// src/store/slices/promotionTypes/promotionTypesSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiLinks } from "@/lib/api-link";
import axiosInstance from "@/lib/axios-config";
import { PromotionType } from "@/types/promotionType";
import { AppDispatch, RootState } from "../../store"; // Adjust based on your store setup

interface PromotionTypesState {
  promotionTypes: PromotionType[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: PromotionTypesState = {
  promotionTypes: [],
  status: "idle",
  error: null,
};

export const fetchPromotionTypes = createAsyncThunk<
  PromotionType[],
  void,
  { dispatch: AppDispatch; state: RootState }
>("promotionTypes/fetchPromotionTypes", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(apiLinks.promote.types);
    return response.data.data as PromotionType[];
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to fetch promotion types");
  }
});

const promotionTypesSlice = createSlice({
  name: "promotionTypes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPromotionTypes.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPromotionTypes.fulfilled, (state, action: PayloadAction<PromotionType[]>) => {
        state.status = "succeeded";
        state.promotionTypes = action.payload;
      })
      .addCase(fetchPromotionTypes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default promotionTypesSlice.reducer;

