import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { apiLinks } from "../../lib/api-link";
import axiosInstance from "@/lib/axios-config";


export interface AttributePayload {
    attributeId: string;
    value: string,
}

export interface VariantPayload {
    attributes: AttributePayload[];
    price: number;
}

export interface AddProductPayload {
    name: string
    description: string | undefined;
    note: string | undefined;
    varitans: VariantPayload[];
}


interface ProductItem {
    _id: string;
    name: string;
}

interface ProductState {
    loading: boolean;
    error: string | null;
    products: ProductItem[];
}


const initialState: ProductState = {
    loading: false,
    error: null,
    products: [],
};


export const fetchProducts = createAsyncThunk(
    'products/fetch',
    async ({ projectId, accessToken }: { projectId: string; accessToken: string }) => {
        const res = await axiosInstance.get(`${apiLinks.product.getProducts}/${projectId}`, {
   
        });
        return res.data.data;
    }
);


export const addProduct = createAsyncThunk('products/add', async ({ data, projectId, accessToken }: { data: AddProductPayload, projectId: string, accessToken: string }) => {
    const res = await axiosInstance.post(`${apiLinks.product.addProduct}/${projectId}`, data, {

    })
    return res.data.data;
});

export const updateProduct = createAsyncThunk('products/update', async ({ data, productId, accessToken }: { data: AddProductPayload, productId: string, accessToken: string }) => {
    const res = await axiosInstance.put(`${apiLinks.product.updateProductById}/${productId}`, data, {

    })
    return {
        _id: productId,
        name: data.name
    };
});

export const deleteProduct = createAsyncThunk('products/delete', async ({ productId, accessToken }: { productId: string, accessToken: string }) => {
    const res = await axiosInstance.delete(`${apiLinks.product.deleteProductById}/${productId}`, {

    })
    return productId;
});




const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? 'Lỗi khi lấy dữ liệu';
            })

            // Add
            .addCase(addProduct.fulfilled, (state, action) => {
                state.products.unshift(action.payload);
            })

            // Update
            .addCase(updateProduct.fulfilled, (state, action) => {
                const index = state.products.findIndex(p => p._id === action.payload._id);
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
            })

            //Delete
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.products = state.products.filter(p => p._id !== action.payload);
            });
    },
});

export default productSlice.reducer;