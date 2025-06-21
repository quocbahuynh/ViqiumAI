import { apiLinks } from "@/lib/api-link"
import axiosInstance from "@/lib/axios-config"
import type { ApiResponse } from "@/lib/api/types"

export interface BusinessInformation {
  baseInformation: string
}

export const informationService = {
  // Get business information
  getBusinessInformation: async (projectId: string): Promise<BusinessInformation> => {
    const response = await axiosInstance.get<ApiResponse<BusinessInformation>>(
      `${apiLinks.project.getBaseInformation}/${projectId}`,
    )
    return response.data.data
  },

  // Update business information
  updateBusinessInformation: async (
    projectId: string,
    data: { baseInformation: string },
  ): Promise<BusinessInformation> => {
    const response = await axiosInstance.put<ApiResponse<BusinessInformation>>(
      `${apiLinks.project.updateBaseInformation}/${projectId}`,
      data,
    )
    return response.data.data
  },
}
