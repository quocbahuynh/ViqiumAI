import {
  PostPromotion,
  PostPromotionBulk,
  PostPromotionGift,
} from "@/types/promotionType"
import axiosInstance from "../axios-config"
import { apiLinks } from "../api-link"

export const promotionService = {
  // Create
  createPromotionDiscount: async (data: PostPromotion, id: string): Promise<PostPromotion> => {
    const response = await axiosInstance.post<PostPromotion>(
      `${apiLinks.promote.createPromotionDiscount}/${id}`,
      data
    )
    return response.data
  },

  createPromotionCombo: async (data: PostPromotion, id: string): Promise<PostPromotion> => {
    const response = await axiosInstance.post<PostPromotion>(
      `${apiLinks.promote.createPromotionCombo}/${id}`,
      data
    )
    return response.data
  },

  createPromotionGift: async (data: PostPromotionGift, id: string): Promise<PostPromotionGift> => {
    const response = await axiosInstance.post<PostPromotionGift>(
      `${apiLinks.promote.createPromotionGift}/${id}`,
      data
    )
    return response.data
  },

  createPromotionBulk: async (data: PostPromotionBulk, id: string): Promise<PostPromotionBulk> => {
    const response = await axiosInstance.post<PostPromotionBulk>(
      `${apiLinks.promote.createPromotionBulk}/${id}`,
      data
    )
    return response.data
  },

  // Update
  updatePromotionDiscount: async (data: PostPromotion, projectId: string, voucherId?:string): Promise<PostPromotion> => {
    const response = await axiosInstance.put<PostPromotion>(
      `${apiLinks.promote.createPromotionDiscount}/${projectId}/${voucherId}`,
      data
    )
    return response.data
  },

  updatePromotionCombo: async (data: PostPromotion, projectId: string, voucherId:string): Promise<PostPromotion> => {
    const response = await axiosInstance.put<PostPromotion>(
      `${apiLinks.promote.createPromotionCombo}/${projectId}/${voucherId}`,
      data
    )
    return response.data
  },

  updatePromotionGift: async (data: PostPromotionGift, projectId: string, voucherId:string): Promise<PostPromotionGift> => {
    const response = await axiosInstance.put<PostPromotionGift>(
      `${apiLinks.promote.createPromotionGift}/${projectId}/${voucherId}`,
      data
    )
    return response.data
  },

  updatePromotionBulk: async (data: PostPromotionBulk, projectId: string, voucherId:string): Promise<PostPromotionBulk> => {
    const response = await axiosInstance.put<PostPromotionBulk>(
      `${apiLinks.promote.createPromotionBulk}/${projectId}/${voucherId}`,
      data
    )
    return response.data
  },
}
