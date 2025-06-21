import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import { projectsApi } from "@/lib/api"
import { ProjectBase } from "@/types/projectType"

// Define the state interface
interface ProjectsState {
  projects: ProjectBase[]
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

// Initial state
const initialState: ProjectsState = {
  projects: [],
  status: "idle",
  error: null,
}

// Async thunk for fetching projects
export const fetchProjects = createAsyncThunk("projects/fetchProjects", async () => {
  return await projectsApi.getProjects()
})

// Create the projects slice
const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    // Add a single project to the store
    addProject: (state, action: PayloadAction<ProjectBase>) => {
      state.projects.unshift(action.payload) // Add to the beginning of the array
    },
    
    // Update a project in the store
    updateProject: (state, action: PayloadAction<ProjectBase>) => {
      const index = state.projects.findIndex(project => project._id === action.payload._id)
      if (index !== -1) {
        state.projects[index] = action.payload
      }
    },
    
    // Remove a project from the store
    removeProject: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter(project => project._id !== action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.projects = action.payload
        state.error = null
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to fetch projects"
      })
  },
})

// Export actions and reducer
export const { addProject, updateProject, removeProject } = projectsSlice.actions
export default projectsSlice.reducer

