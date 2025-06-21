// src/store/slices/breadcrumb/breadcrumbSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface BreadcrumbItem {
  id: string;
  name: string;
}

interface BreadcrumbState {
  items: BreadcrumbItem[];
}

const initialState: BreadcrumbState = {
  items: [],
};

const breadcrumbSlice = createSlice({
  name: "breadcrumb",
  initialState,
  reducers: {
    addBreadcrumb: (state, action: PayloadAction<BreadcrumbItem>) => {
      state.items.push(action.payload);
    },
    updateBreadcrumb: (state, action: PayloadAction<{ id: string; name: string }>) => {
      const { id, name } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        item.name = name;
      }
    },
    clearBreadcrumb: (state) => {
      state.items = [];
    },
  },
});

export const { addBreadcrumb, updateBreadcrumb, clearBreadcrumb } = breadcrumbSlice.actions;

export default breadcrumbSlice.reducer;