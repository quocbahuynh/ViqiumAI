// src/store/slices/aiSettings/aiSettingsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios-config";
import { apiLinks } from "@/lib/api-link";
import { toast } from "sonner";
import { AppDispatch, RootState } from "../store"; // Adjust based on your store setup

interface AIConfig {
  maxToken: number;
  communicationStyle: string;
  models: string;
}

interface AISettingsState {
  config: AIConfig | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  updateStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  hasValidData: boolean;
}

const initialState: AISettingsState = {
  config: null,
  status: "idle",
  updateStatus: "idle",
  error: null,
  hasValidData: false,
};

export const fetchAIConfig = createAsyncThunk<
  AIConfig,
  string,
  { dispatch: AppDispatch; state: RootState }
>("aiSettings/fetchAIConfig", async (projectId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`${apiLinks.modelAI.getModel}/${projectId}`);
    return response.data.data as AIConfig;
  } catch (err: any) {
    toast.error("Lấy dữ liệu cài đặt AI lỗi, hãy thử lại");
    return rejectWithValue(err.message || "Lỗi lấy dữ liệu");
  }
});

export const updateAIConfig = createAsyncThunk<
  void,
  { projectId: string; config: AIConfig },
  { dispatch: AppDispatch; state: RootState }
>("aiSettings/updateAIConfig", async ({ projectId, config }, { rejectWithValue }) => {
  try {
    await axiosInstance.patch(`${apiLinks.modelAI.getModel}/${projectId}`, config);
    toast.success("Cập nhật thành công cài đặt AI");
  } catch (err: any) {
    toast.error( "Cập nhật cài đặt AI lỗi, hãy thử lại");
    return rejectWithValue(err.message || "Lỗi lấy dữ liệu");
  }
});

const aiSettingsSlice = createSlice({
  name: "aiSettings",
  initialState,
  reducers: {
    setConfig: (state, action: PayloadAction<AIConfig>) => {
      state.config = action.payload;
    },
    setHasValidData: (state, action: PayloadAction<boolean>) => {
      state.hasValidData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAIConfig.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.hasValidData = false;
      })
      .addCase(fetchAIConfig.fulfilled, (state, action: PayloadAction<AIConfig>) => {
        state.status = "succeeded";
        state.config = action.payload;
        state.error = null;
      })
      .addCase(fetchAIConfig.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
        state.hasValidData = false;
      })
      .addCase(updateAIConfig.pending, (state) => {
        state.updateStatus = "loading";
        state.error = null;
      })
      .addCase(updateAIConfig.fulfilled, (state) => {
        state.updateStatus = "succeeded";
      })
      .addCase(updateAIConfig.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { setConfig, setHasValidData } = aiSettingsSlice.actions;

export default aiSettingsSlice.reducer;

