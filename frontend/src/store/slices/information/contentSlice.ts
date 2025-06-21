import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BusinessInformation, informationService } from "@/lib/api";

interface InformationState {
  data: Record<string, BusinessInformation>;
  status: Record<string, "idle" | "loading" | "succeeded" | "failed">;
  error: Record<string, string | null>;
  lastFetched: Record<string, number>;
}

const initialState: InformationState = {
  data: {},
  status: {},
  error: {},
  lastFetched: {},
};

// Fetch business information
export const fetchBusinessInformation = createAsyncThunk<
  { projectId: string; data: BusinessInformation },
  string,
  { rejectValue: string }
>("information/fetchBusinessInformation", async (projectId, { rejectWithValue }) => {
  try {
    const response = await informationService.getBusinessInformation(projectId);
    return { projectId, data: response };
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch business information");
  }
});

// Update business information
export const updateBusinessInformation = createAsyncThunk<
  { projectId: string; data: BusinessInformation },
  { projectId: string; data: { baseInformation: string } },
  { rejectValue: string }
>("information/updateBusinessInformation", async ({ projectId, data }, { rejectWithValue }) => {
  try {
    const response = await informationService.updateBusinessInformation(projectId, data);
    return { projectId, data: response };
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to update business information");
  }
});

// Optimistic update for business information
export const updateBusinessInformationOptimistic = createAsyncThunk<
  { projectId: string; baseInformation: string },
  { projectId: string; baseInformation: string },
  { rejectValue: string }
>("information/updateBusinessInformationOptimistic", async ({ projectId, baseInformation }, { rejectWithValue }) => {
  return { projectId, baseInformation };
});

// Rollback business information
export const rollbackBusinessInformation = createAsyncThunk<
  { projectId: string; previousInformation: BusinessInformation | undefined },
  { projectId: string; previousInformation: BusinessInformation | undefined },
  { rejectValue: string }
>("information/rollbackBusinessInformation", async ({ projectId, previousInformation }, { rejectWithValue }) => {
  return { projectId, previousInformation };
});

const informationSlice = createSlice({
  name: "information",
  initialState,
  reducers: {
    clearInformationError: (state, action) => {
      const projectId = action.payload;
      if (state.error[projectId]) {
        state.error[projectId] = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch business information
      .addCase(fetchBusinessInformation.pending, (state, action) => {
        const projectId = action.meta.arg;
        state.status[projectId] = "loading";
        state.error[projectId] = null;
      })
      .addCase(fetchBusinessInformation.fulfilled, (state, action) => {
        const { projectId, data } = action.payload;
        state.data[projectId] = data;
        state.status[projectId] = "succeeded";
        state.error[projectId] = null;
        state.lastFetched[projectId] = Date.now();
      })
      .addCase(fetchBusinessInformation.rejected, (state, action) => {
        const projectId = action.meta.arg;
        state.status[projectId] = "failed";
        state.error[projectId] = action.payload || "Failed to fetch business information";
      })
      // Update business information
      .addCase(updateBusinessInformation.pending, (state, action) => {
        const projectId = action.meta.arg.projectId;
        state.status[projectId] = "loading";
        state.error[projectId] = null;
      })
      .addCase(updateBusinessInformation.fulfilled, (state, action) => {
        const { projectId, data } = action.payload;
        state.data[projectId] = data;
        state.status[projectId] = "succeeded";
        state.error[projectId] = null;
        state.lastFetched[projectId] = Date.now();
      })
      .addCase(updateBusinessInformation.rejected, (state, action) => {
        const projectId = action.meta.arg.projectId;
        state.status[projectId] = "failed";
        state.error[projectId] = action.payload || "Failed to update business information";
      })
      // Optimistic update
      .addCase(updateBusinessInformationOptimistic.fulfilled, (state, action) => {
        const { projectId, baseInformation } = action.payload;
        state.data[projectId] = { ...state.data[projectId], baseInformation };
        state.status[projectId] = "succeeded";
        state.error[projectId] = null;
      })
      // Rollback
      .addCase(rollbackBusinessInformation.fulfilled, (state, action) => {
        const { projectId, previousInformation } = action.payload;
        if (previousInformation) {
          state.data[projectId] = previousInformation;
        }
        state.status[projectId] = "failed";
      });
  },
});

export const { clearInformationError } = informationSlice.actions;

export default informationSlice.reducer;