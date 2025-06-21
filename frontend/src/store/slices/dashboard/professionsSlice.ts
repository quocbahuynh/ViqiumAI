import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import { professionsApi } from "@/lib/api"
import { ProfessionSelected } from "@/types/projectType"

// Define the state interface
interface ProfessionsState {
  professions: ProfessionSelected[]
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

// Initial state
const initialState: ProfessionsState = {
  professions: [],
  status: "idle",
  error: null,
}

// Async thunk for fetching professions
export const fetchProfessions = createAsyncThunk("professions/fetchProfessions", async () => {
  return await professionsApi.getProfessions()
})

// Create the professions slice
const professionsSlice = createSlice({
  name: "professions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfessions.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchProfessions.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.professions = action.payload
        state.error = null
      })
      .addCase(fetchProfessions.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to fetch professions"
      })
  },
})

export default professionsSlice.reducer

