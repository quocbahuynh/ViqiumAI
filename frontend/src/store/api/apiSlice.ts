import { auth } from "@/auth";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Base API slice that will be extended by other feature slices
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "",
  }),
  tagTypes: ["Products", "Variants"],
  endpoints: () => ({}),
});