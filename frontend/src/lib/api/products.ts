import { ProjectBase } from "@/types/projectType";
import axiosInstance from "../axios-config"
import { ApiResponse } from "./types";
import { apiLinks } from "../api-link";
import { PostProduct, Product, ProductDetail } from "@/types/productType";


// Projects API
export const productsApi = {
  // Get all projects
  getProducts: async (projectId: string): Promise<Product[]> => {
    const response = await axiosInstance.get<ApiResponse<Product[]>>(
      `${apiLinks.product.getProducts}/${projectId}`
    )
    return response.data.data
  },

  createProduct: async (data:PostProduct, id:string): Promise<ProjectBase> => {
    const response = await axiosInstance.post<ApiResponse<ProjectBase>>(`${apiLinks.product.addProduct}/${id}`, data)
    return response.data.data
  },

  getProductDetail: async (productId: string): Promise<ProductDetail> => {
    const response = await axiosInstance.get<ProductDetail>(
      `${apiLinks.product.getProductById}/${productId}`,
    )
    return response.data
  },
  deleteProduct: async (productId: string): Promise<ProductDetail> => {
    const response = await axiosInstance.delete<ProductDetail>(
      `${apiLinks.product.deleteProductById}/${productId}`,
    )
    return response.data
  },
  updateProduct: async (productId: string,data:PostProduct): Promise<ProductDetail> => {
    const response = await axiosInstance.put<ProductDetail>(
      `${apiLinks.product.updateProductById}/${productId}`,
      data
    )
    return response.data
  },

}
