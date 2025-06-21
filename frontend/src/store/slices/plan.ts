// src/store/slices/breadcrumb/breadcrumbSlice.ts
import { apiLinks } from "@/lib/api-link"
import axiosInstance from "@/lib/axios-config"
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"

export interface Plan {
  usage: number
  limit: number
}

interface PlanState {
  data: Plan | null
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

const initialState: PlanState = {
  data: null,
  status: "idle",
  error: null,
}

// ✅ Async thunk
export const fetchPlan = createAsyncThunk<Plan>(
  "plan/fetchPlan",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`${apiLinks.auth.plan}`) // Thay bằng URL thực tế
      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Fetch plan failed"
      )
    }
  }
)

// ✅ Slice
const planSlice = createSlice({
  name: "plan",
  initialState,
  reducers: {
    setPlan(state, action: PayloadAction<Plan>) {
      state.data = action.payload
      state.status = "succeeded"
      state.error = null
    },
    resetPlan(state) {
      state.data = null
      state.status = "idle"
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlan.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(fetchPlan.fulfilled, (state, action: PayloadAction<Plan>) => {
        state.status = "succeeded"
        state.data = action.payload
        state.error = null
      })
      .addCase(fetchPlan.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload as string
      })
  },
})

export const { setPlan, resetPlan } = planSlice.actions
export default planSlice.reducer
