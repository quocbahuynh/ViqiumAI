import { ProfessionSelected } from "@/types/projectType"
import axiosInstance from "../axios-config"

import type { ApiResponse } from "./types"
import { apiLinks } from "../api-link"

// Professions API
export const professionsApi = {
  getProfessions: async (): Promise<ProfessionSelected[]> => {
    const response = await axiosInstance.get<ApiResponse<ProfessionSelected[]>>(apiLinks.profession.list)
    return response.data.data
  },
}
