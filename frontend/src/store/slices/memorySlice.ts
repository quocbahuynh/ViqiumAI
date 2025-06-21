import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import { toast } from "sonner"
import type { Memory } from "@/types/chatType"

import { AppDispatch, RootState } from "../store" // Adjust based on your store setup
import axiosInstance from "@/lib/axios-config"
import { apiLinks } from "@/lib/api-link"

interface MemoryState {
  data: Record<string, Memory[]> // Keyed by projectId
  status: Record<string, "idle" | "loading" | "succeeded" | "failed">
  error: Record<string, string | null>
  lastFetched: Record<string, number>
}

const initialState: MemoryState = {
  data: {},
  status: {},
  error: {},
  lastFetched: {},
}

// API service (assumed, similar to productsApi)
const memoriesApi = {
  getMemories: async (projectId: string) => {
    const response = await axiosInstance.get(
      `${apiLinks.memory}/${projectId}`
    )
    return response.data.data
  },
  deleteMemory: async (memoryId: string) => {
    await axiosInstance.delete(
      `${apiLinks.memory}/${memoryId}`
    )
  },
}

// Fetch memories
export const fetchMemories = createAsyncThunk<
  { projectId: string; data: Memory[] },
  string,
  { dispatch: AppDispatch; state: RootState; rejectValue: string }
>("memories/fetchMemories", async (projectId, { rejectWithValue }) => {
  try {
    const response = await memoriesApi.getMemories(projectId)
    return { projectId, data: response }
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch memories")
  }
})

// Delete memory
export const deleteMemory = createAsyncThunk<
  {  memoryId: string },
  { projectId: string; memoryId: string; },
  { dispatch: AppDispatch; state: RootState; rejectValue: string }
>("memories/deleteMemory", async ({ projectId, memoryId }, { dispatch, rejectWithValue }) => {
  try {
    await memoriesApi.deleteMemory(memoryId)
    toast.success("Xóa bộ nhớ thành công")
    dispatch(fetchMemories(projectId)) // Refresh the list
    return {  memoryId }
  } catch (error: any) {
    toast.error("Lỗi khi xóa bộ nhớ", {
      description: "Đã xảy ra lỗi khi xóa bộ nhớ. Vui lòng thử lại sau.",
    })
    return rejectWithValue(error.message || "Failed to delete memory")
  }
})

const memorySlice = createSlice({
  name: "memories",
  initialState,
  reducers: {
    clearMemoryError: (state, action: PayloadAction<string>) => {
      const projectId = action.payload
      if (state.error[projectId]) {
        state.error[projectId] = null
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMemories.pending, (state, action) => {
        const projectId = action.meta.arg
        state.status[projectId] = "loading"
        state.error[projectId] = null
      })
      .addCase(fetchMemories.fulfilled, (state, action) => {
        const { projectId, data } = action.payload
        state.data[projectId] = data
        state.status[projectId] = "succeeded"
        state.error[projectId] = null
        state.lastFetched[projectId] = Date.now()
      })
      .addCase(fetchMemories.rejected, (state, action) => {
        const projectId = action.meta.arg
        state.status[projectId] = "failed"
        state.error[projectId] = action.payload || "Failed to fetch memories"
      })
      .addCase(deleteMemory.pending, (state, action) => {
        const { projectId } = action.meta.arg
        state.status[projectId] = "loading"
      })
      .addCase(deleteMemory.fulfilled, (state, action) => {
        const { memoryId } = action.payload
        state.status[memoryId] = "succeeded"
      })
      .addCase(deleteMemory.rejected, (state, action) => {
        const { projectId } = action.meta.arg
        state.status[projectId] = "failed"
        state.error[projectId] = action.payload || "Failed to delete memory"
      })
  },
})

export const { clearMemoryError } = memorySlice.actions

export default memorySlice.reducer