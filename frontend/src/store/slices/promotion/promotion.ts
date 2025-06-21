import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { apiLinks } from "@/lib/api-link";
import axiosInstance from "@/lib/axios-config";
import { AppDispatch, RootState } from "../../store"; // Adjust based on your store setup
import { ApiVoucher } from "@/components/main/management/campaign/CampaignTable";
import { toast } from "sonner";

export interface VoucherState {
  vouchers: { [projectId: string]: ApiVoucher[] };
  status: { [projectId: string]: "idle" | "loading" | "succeeded" | "failed" };
  error: { [projectId: string]: string | null };
}

const initialState: VoucherState = {
  vouchers: {},
  status: {},
  error: {},
};

export const fetchVouchers = createAsyncThunk<
  { projectId: string; data: ApiVoucher[] },
  string,
  { dispatch: AppDispatch; state: RootState; rejectValue: string }
>("voucher/fetchVouchers", async (projectId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`${apiLinks.voucher}/${projectId}`);
    const result = response.data;
    if (result.message === "Thành công") {
      return { projectId, data: result.data as ApiVoucher[] };
    } else {
      throw new Error("Không thể lấy danh sách voucher");
    }
  } catch (err: any) {
    return rejectWithValue(err.message || "Đã xảy ra lỗi khi tải danh sách voucher");
  }
});

export const deleteVoucher = createAsyncThunk<
  { projectId: string; voucherId: string },
  { projectId: string; voucherId: string; voucherName: string },
  { dispatch: AppDispatch; state: RootState; rejectValue: string }
>("voucher/deleteVoucher", async ({ projectId, voucherId, voucherName }, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`${apiLinks.promote.delete}/${projectId}/${voucherId}`);
    toast.success(`Xóa voucher "${voucherName}" thành công`);
    return { projectId, voucherId };
  } catch (err: any) {
    return rejectWithValue(err.message || "Lỗi khi xóa voucher");
  }
});

const voucherSlice = createSlice({
  name: "voucher",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVouchers.pending, (state, action) => {
        const projectId = action.meta.arg;
        state.status[projectId] = "loading";
        state.error[projectId] = null;
      })
      .addCase(fetchVouchers.fulfilled, (state, action: PayloadAction<{ projectId: string; data: ApiVoucher[] }>) => {
        const { projectId, data } = action.payload;
        state.status[projectId] = "succeeded";
        state.vouchers[projectId] = data;
      })
      .addCase(fetchVouchers.rejected, (state, action) => {
        const projectId = action.meta.arg;
        state.status[projectId] = "failed";
        state.error[projectId] = action.payload || "Đã xảy ra lỗi khi tải danh sách voucher";
      })
      .addCase(deleteVoucher.pending, (state, action) => {
        const { projectId } = action.meta.arg;
        state.status[projectId] = "loading";
      })
      .addCase(deleteVoucher.fulfilled, (state, action: PayloadAction<{ projectId: string; voucherId: string }>) => {
        const { projectId, voucherId } = action.payload;
        state.status[projectId] = "succeeded";
        state.vouchers[projectId] = state.vouchers[projectId].filter((voucher) => voucher._id !== voucherId);
      })
      .addCase(deleteVoucher.rejected, (state, action) => {
        const { projectId } = action.meta.arg;
        state.status[projectId] = "failed";
        state.error[projectId] = action.payload || "Lỗi khi xóa voucher";
      });
  },
});

export default voucherSlice.reducer;