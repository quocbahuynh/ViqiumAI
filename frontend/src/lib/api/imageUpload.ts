import { apiLinks } from "@/lib/api-link"
import axiosInstance from "@/lib/axios-config"
// import type { ApiResponse } from "@/lib/api/types" // Không cần import ApiResponse nữa

export interface Image {
  message?: string // Làm message optional vì API không trả về
  url: string
}

export const imageService = {
  // Upload image
  postImage: async (data: FormData): Promise<Image> => {
    const response = await axiosInstance.post<Image>(
      `${apiLinks.image}`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )

    return response.data // Trả về response.data trực tiếp vì nó đã là Image
  },
}