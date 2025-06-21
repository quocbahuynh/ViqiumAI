"use client";

import { apiSlice } from "./apiSlice";
import { apiLinks } from "@/lib/api-link";

export interface InformationContent {
  baseInformation: string;
  _id: string;
}

export interface UpdateBaseInformationPayload {
  baseInformation: string;
}

export const projectApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Lấy nội dung baseInformation của project
    getBaseInformation: builder.query<InformationContent, string>({
      query: (projectId) => ({
        url: `${apiLinks.project.getBaseInformation}/${projectId}`,
        method: "GET",
      }),
      transformResponse: (response: { data: InformationContent }) => response.data,
    }),

    // Cập nhật nội dung baseInformation của project
    updateBaseInformation: builder.mutation<void, { projectId: string; data: UpdateBaseInformationPayload }>({
      query: ({ projectId, data }) => ({
        url: `${apiLinks.project.updateBaseInformation}/${projectId}`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const { useGetBaseInformationQuery, useUpdateBaseInformationMutation } = projectApiSlice;