import axiosInstance from "@/lib/axios-config";
import { apiLinks } from "@/lib/api-link";
import type { ApiResponse } from "@/lib/api/types";

// Interface for classification recommendation response
export interface ClassificationRecommendation {
  _id: string;
  label: string;
  value: string;
}

// Interface for classification value recommendation response
export interface ClassificationValueRecommendation {
  _id: string;
  label: string;
  value: string;
}

export const classificationApi = {
  // Fetch classification recommendations
  fetchClassificationRecommendations: async (id:string ): Promise<ClassificationRecommendation[]> => {
    try {
      const response = await axiosInstance.get<
        ApiResponse<ClassificationRecommendation[]>
      >(`${apiLinks.product.getClassification}/${id}`);
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching classification recommendations:", error);
      return [];
    }
  },

  // Fetch classification value recommendations based on classification ID
  fetchClassificationValueRecommendations: async (
    classificationId: string
  ): Promise<ClassificationValueRecommendation[]> => {
    if (!classificationId) {
      return [];
    }

    try {
      const response = await axiosInstance.get<
        ApiResponse<ClassificationValueRecommendation[]>
      >(`${apiLinks.product.getVariants}/${classificationId}`);
      return response.data.data || [];
    } catch (error) {
      console.error(
        `Error fetching values for classification ${classificationId}:`,
        error
      );
      return [];
    }
  },
};