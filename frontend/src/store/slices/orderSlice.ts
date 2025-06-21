import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "sonner";
import { Order } from "@/types/ordertype";
import { AppDispatch, RootState } from "../store";
import axiosInstance from "@/lib/axios-config";
import { apiLinks } from "@/lib/api-link";

// Define the initial state interface
interface OrderState {
  data: Record<string, Order[]>;
  status: Record<string, "idle" | "loading" | "succeeded" | "failed">;
  error: Record<string, string | null>;
  lastFetched: Record<string, number>;
}

// Initial state
const initialState: OrderState = {
  data: {},
  status: {},
  error: {},
  lastFetched: {},
};

// Fetch orders
export const fetchOrders = createAsyncThunk<
  { projectId: string; data: Order[] },
  string,
  { dispatch: AppDispatch; state: RootState; rejectValue: string }
>("orders/fetchOrders", async (projectId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`${apiLinks.orders.getListOrders}/${projectId}`);
    const data = response.data.data;
    if (!Array.isArray(data)) {
      throw new Error("Invalid data format from API");
    }
    return { projectId, data };
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message || "Failed to fetch orders");
  }
});

// Mark order as read
export const markOrderAsRead = createAsyncThunk<
  { orderId: string; projectId: string },
  { orderId: string; projectId: string },
  { dispatch: AppDispatch; state: RootState; rejectValue: string }
>("orders/markOrderAsRead", async ({ orderId, projectId }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`${apiLinks.orders.readOrder}/${orderId}`);
    const data = response.data;
    toast.success("Đánh dấu đơn hàng đã đọc thành công");
    return { orderId, projectId };
  } catch (error: any) {
    toast.error("Lỗi khi đánh dấu đơn hàng đã đọc", {
      description: "Đã xảy ra lỗi. Vui lòng thử lại sau.",
    });
    return rejectWithValue(error.response?.data?.message || error.message || "Failed to mark order as read");
  }
});

// Delete order
export const deleteOrder = createAsyncThunk<
  { orderId: string; projectId: string },
  { orderId: string; projectId: string },
  { dispatch: AppDispatch; state: RootState; rejectValue: string }
>("orders/deleteOrder", async ({ orderId, projectId }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.delete(`${apiLinks.orders.deleteOrder}/${orderId}`);
    const data = response.data;
    toast.success("Xóa đơn hàng thành công");
    return { orderId, projectId };
  } catch (error: any) {
    toast.error("Lỗi khi xóa đơn hàng", {
      description: "Đã xảy ra lỗi. Vui lòng thử lại sau.",
    });
    return rejectWithValue(error.response?.data?.message || error.message || "Failed to delete order");
  }
});

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearOrderError: (state, action: PayloadAction<string>) => {
      const projectId = action.payload;
      if (state.error[projectId]) {
        state.error[projectId] = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state, action) => {
        const projectId = action.meta.arg;
        state.status[projectId] = "loading";
        state.error[projectId] = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        const { projectId, data } = action.payload;
        state.data[projectId] = data;
        state.status[projectId] = "succeeded";
        state.error[projectId] = null;
        state.lastFetched[projectId] = Date.now();
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        const projectId = action.meta.arg;
        state.status[projectId] = "failed";
        state.error[projectId] = action.payload || "Failed to fetch orders";
      })
      .addCase(markOrderAsRead.pending, (state, action) => {
        const { projectId } = action.meta.arg;
        state.status[projectId] = "loading";
      })
      .addCase(markOrderAsRead.fulfilled, (state, action) => {
        const { orderId, projectId } = action.payload;
        if (state.data[projectId]) {
          state.data[projectId] = state.data[projectId].map((order) =>
            order._id === orderId ? { ...order, isRead: true } : order
          );
        }
        state.status[projectId] = "succeeded";
      })
      .addCase(markOrderAsRead.rejected, (state, action) => {
        const { projectId } = action.meta.arg;
        state.status[projectId] = "failed";
        state.error[projectId] = action.payload || "Failed to mark order as read";
      })
      .addCase(deleteOrder.pending, (state, action) => {
        const { projectId } = action.meta.arg;
        state.status[projectId] = "loading";
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        const { orderId, projectId } = action.payload;
        if (state.data[projectId]) {
          state.data[projectId] = state.data[projectId].filter((order) => order._id !== orderId);
        }
        state.status[projectId] = "succeeded";
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        const { projectId } = action.meta.arg;
        state.status[projectId] = "failed";
        state.error[projectId] = action.payload || "Failed to delete order";
      });
  },
});

export const { clearOrderError } = ordersSlice.actions;

export default ordersSlice.reducer;