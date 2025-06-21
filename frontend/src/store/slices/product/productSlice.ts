import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { productsApi } from "@/lib/api";
import { Product, PostProduct } from "@/types/productType";
import { toast } from "sonner";
import { AppDispatch, RootState } from "../../store"; // Adjust based on your store setup
import { ProjectBase } from "@/types/projectType";

interface ProductState {
  data: Record<string, Product[]>;
  status: Record<string, "idle" | "loading" | "succeeded" | "failed">;
  error: Record<string, string | null>;
  lastFetched: Record<string, number>;
}

const initialState: ProductState = {
  data: {},
  status: {},
  error: {},
  lastFetched: {},
};

// Fetch products
export const fetchProducts = createAsyncThunk<
  { projectId: string; data: Product[] },
  string,
  { dispatch: AppDispatch; state: RootState; rejectValue: string }
>("products/fetchProducts", async (projectId, { rejectWithValue }) => {
  try {
    const response = await productsApi.getProducts(projectId);
    return { projectId, data: response };
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch products");
  }
});

// Create product
export const createProduct = createAsyncThunk<
  { projectId: string; data: ProjectBase },
  { product: PostProduct; projectId: string },
  { dispatch: AppDispatch; state: RootState; rejectValue: string }
>("products/createProduct", async ({ product, projectId }, { dispatch, rejectWithValue }) => {
  try {
    const response = await productsApi.createProduct(product, projectId);
    toast.success("Thêm sản phẩm thành công");
    dispatch(fetchProducts(projectId)); // Keep this if you want to refresh the list
    return { projectId, data: response };
  } catch (error: any) {

    if (error.status !== 401 ) {
          toast.error("Lỗi khi thêm sản phẩm", {
      description: "Đã xảy ra lỗi. Vui lòng thử lại sau.",
    });
    }
    return rejectWithValue(error.status || "Failed to create product");

  }
});

// Update product
export const updateProduct = createAsyncThunk<
  { productId: string; data: any; projectId: string },
  { productId: string; product: PostProduct; projectId: string },
  { dispatch: AppDispatch; state: RootState; rejectValue: string }
>("products/updateProduct", async ({ productId, product, projectId }, { dispatch, rejectWithValue }) => {
  try {
    const response = await productsApi.updateProduct(productId, product);
    toast.success("Cập nhật sản phẩm thành công");
    dispatch(fetchProducts(projectId)); // Keep this if you want to refresh the list
    return { productId, data: response, projectId };
  } catch (error: any) {
    toast.error("Lỗi khi cập nhật sản phẩm", {
      description: "Đã xảy ra lỗi. Vui lòng thử lại sau.",
    });
    return rejectWithValue(error.message || "Failed to update product");
  }
});

// Delete product
export const deleteProduct = createAsyncThunk<
  { projectId: string; productId: string },
  { productId: string; projectId: string; productName: string },
  { dispatch: AppDispatch; state: RootState; rejectValue: string }
>("products/deleteProduct", async ({ productId, projectId, productName }, { dispatch, rejectWithValue }) => {
  try {
    await productsApi.deleteProduct(productId);
    toast.success("Xóa sản phẩm thành công");
    return { projectId, productId };
  } catch (error: any) {
    toast.error("Lỗi khi xóa sản phẩm", {
      description: "Đã xảy ra lỗi khi xóa sản phẩm. Vui lòng thử lại sau.",
    });
    return rejectWithValue(error.message || "Failed to delete product");
  }
});

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearInformationError: (state, action: PayloadAction<string>) => {
      const projectId = action.payload;
      if (state.error[projectId]) {
        state.error[projectId] = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state, action) => {
        const projectId = action.meta.arg;
        state.status[projectId] = "loading";
        state.error[projectId] = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        const { projectId, data } = action.payload;
        state.data[projectId] = data;
        state.status[projectId] = "succeeded";
        state.error[projectId] = null;
        state.lastFetched[projectId] = Date.now();
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        const projectId = action.meta.arg;
        state.status[projectId] = "failed";
        state.error[projectId] = action.payload || "Failed to fetch products";
      })
      .addCase(createProduct.pending, (state, action) => {
        const { projectId } = action.meta.arg;
        state.status[projectId] = "loading";
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        const { projectId } = action.payload;
        state.status[projectId] = "succeeded";
      })
      .addCase(createProduct.rejected, (state, action) => {
        const { projectId } = action.meta.arg;
        state.status[projectId] = "failed";
      })
      .addCase(updateProduct.pending, (state, action) => {
        const { projectId } = action.meta.arg;
        state.status[projectId] = "loading";
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const { projectId } = action.payload;
        state.status[projectId] = "succeeded";
      })
      .addCase(updateProduct.rejected, (state, action) => {
        const { projectId } = action.meta.arg;
        state.status[projectId] = "failed";
        state.error[projectId] = action.payload || "Failed to update product";
      })
      .addCase(deleteProduct.pending, (state, action) => {
        const { projectId } = action.meta.arg;
        state.status[projectId] = "loading";
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        const { projectId, productId } = action.payload;
        if (state.data[projectId]) {
          state.data[projectId] = state.data[projectId].filter(
            (product) => product._id !== productId // Assuming Product has an 'id' field
          );
        }
        state.status[projectId] = "succeeded";
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        const { projectId } = action.meta.arg;
        state.status[projectId] = "failed";
        state.error[projectId] = action.payload || "Failed to delete product";
      });
  },
});

export const { clearInformationError } = productsSlice.actions;

export default productsSlice.reducer;