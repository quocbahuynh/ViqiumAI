import { apiLinks } from "@/lib/api-link"
import { apiSlice } from "./apiSlice"

export interface AttributePayload {
  attributeId: string
  value: string
}

export interface VariantPayload {
  attributes: AttributePayload[]
  price: number
}

export interface AddProductPayload {
  name: string
  description?: string
  note?: string
  varitans: VariantPayload[]
}

export interface ProductItem {
  _id: string
  name: string
}

export interface ProductDetail extends ProductItem {
  description?: string
  note?: string
  variants: {
    _id: string
    attributes: AttributePayload[]
    price: number
  }[]
}

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all products for a project
    getProducts: builder.query<ProductItem[], string>({
      query: (projectId) => ({
        url: `${apiLinks.product.getProducts}/${projectId}`,
        method: "GET",
      }),
      transformResponse: (response: { data: ProductItem[] }) => response.data,
      providesTags: (result) =>
        result
          ? [...result.map(({ _id }) => ({ type: "Products" as const, id: _id })), { type: "Products", id: "LIST" }]
          : [{ type: "Products", id: "LIST" }],
    }),

    // Get a single product by ID
    getProductById: builder.query<ProductDetail, string>({
      query: (productId) => ({
        url: `${apiLinks.product.getProductById}/${productId}`,
        method: "GET",
      }),
      transformResponse: (response: { data: ProductDetail }) => response.data,
      providesTags: (result, error, id) => [{ type: "Products", id }],
    }),

    // Add a new product
    addProduct: builder.mutation<ProductItem, { data: AddProductPayload; projectId: string }>({
      query: ({ data, projectId }) => ({
        url: `${apiLinks.product.addProduct}/${projectId}`,
        method: "POST",
        body: data,
      }),
      transformResponse: (response: { data: ProductItem }) => response.data,
      invalidatesTags: [{ type: "Products", id: "LIST" }],
      // Optimistic update
      async onQueryStarted({ data, projectId }, { dispatch, queryFulfilled }) {
        // Optimistically add the new product to the list
        const optimisticUpdate = dispatch(
          productApiSlice.util.updateQueryData("getProducts", projectId, (draft) => {
            const optimisticProduct = {
              _id: "temp-id-" + Date.now(),
              name: data.name,
            }
            draft.unshift(optimisticProduct)
          }),
        )
        try {
          await queryFulfilled
        } catch {
          // If the mutation fails, undo the optimistic update
          optimisticUpdate.undo()
        }
      },
    }),

    // Update a product
    updateProduct: builder.mutation<ProductItem, { data: AddProductPayload; productId: string; projectId: string }>({
      query: ({ data, productId }) => ({
        url: `${apiLinks.product.updateProductById}/${productId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: "Products", id: productId },
        { type: "Products", id: "LIST" },
      ],
      // Optimistic update
      async onQueryStarted({ data, productId, projectId }, { dispatch, queryFulfilled }) {
        if (projectId) {
          // Optimistically update the product in the list
          const optimisticUpdate = dispatch(
            productApiSlice.util.updateQueryData("getProducts", projectId, (draft) => {
              const index = draft.findIndex((p) => p._id === productId)
              if (index !== -1) {
                draft[index].name = data.name
              }
            }),
          )
          try {
            await queryFulfilled
          } catch {
            // If the mutation fails, undo the optimistic update
            optimisticUpdate.undo()
          }
        }
      },
    }),

    // Delete a product
    deleteProduct: builder.mutation<void, { productId: string; projectId: string }>({
      query: ({ productId }) => ({
        url: `${apiLinks.product.deleteProductById}/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Products", id: "LIST" }],
      // Optimistic update
      async onQueryStarted({ productId, projectId }, { dispatch, queryFulfilled }) {
        if (projectId) {
          // Optimistically remove the product from the list
          const optimisticUpdate = dispatch(
            productApiSlice.util.updateQueryData("getProducts", projectId, (draft) => {
              const index = draft.findIndex((p) => p._id === productId)
              if (index !== -1) {
                draft.splice(index, 1)
              }
            }),
          )
          try {
            await queryFulfilled
          } catch {
            // If the mutation fails, undo the optimistic update
            optimisticUpdate.undo()
          }
        }
      },
    }),
  }),
})

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApiSlice
