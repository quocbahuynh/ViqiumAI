import axios from "axios"
import type { Order } from "@/types/ordertype"
import axiosInstance from "@/lib/axios-config"

// Base URL for API calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.example.com"

// Fetch all orders
export async function fetchOrders(): Promise<Order[]> {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/orders`)
    return response.data
  } catch (error) {
    console.error("Error fetching orders:", error)
    // For development, return mock data if API fails
    return getMockOrders()
  }
}

// Mark an order as read
export async function markOrderAsRead(orderId: string): Promise<void> {
  try {
    await axiosInstance.patch(`${API_BASE_URL}/orders/${orderId}/read`, {
      isRead: true,
    })
  } catch (error) {
    console.error("Error marking order as read:", error)
    throw error
  }
}

// Mock data for development
function getMockOrders(): Order[] {
  return [
    {
      _id: "662d1b4a8d1a5c001f2b1234",
      projectId: "662d1b2c8d1a5c001f2b5678",
      orderCode: "ORD123456",
      phoneNumber: "0909123456",
      address: "123 Lê Lợi, Quận 1, TP.HCM",
      carts: "- Áo thun Unisex + Size L + Màu Đỏ + Giá 300k\n- Áo thun Unisex + Size L + Màu Đỏ + Giá 300k \n",
      createdAt: "2024-08-01T10:30:00.000Z",
      totalBeforePromotion: "1000000",
      totalAftterPromotion: "900000",
      isRead: false,
    },
    {
      _id: "662d1b4a8d1a5c001f2b1235",
      projectId: "662d1b2c8d1a5c001f2b5678",
      orderCode: "ORD123457",
      phoneNumber: "0909123457",
      address: "456 Nguyễn Huệ, Quận 1, TP.HCM",
      carts: "- Áo thun Unisex + Size L + Màu Đỏ + Giá 300k\n- Áo thun Unisex + Size L + Màu Đỏ + Giá 300k \n",
      createdAt: "2024-08-01T10:30:00.000Z",
      totalBeforePromotion: "1000000",
      totalAftterPromotion: "900000",
      isRead: true,
    },
    {
      _id: "662d1b4a8d1a5c001f2b1236",
      projectId: "662d1b2c8d1a5c001f2b5678",
      orderCode: "ORD123458",
      phoneNumber: "0909123458",
      address: "789 Lê Duẩn, Quận 3, TP.HCM",
      carts: "- Quần Jean Nam + Size 32 + Màu Xanh + Giá 450k\n",
      createdAt: "2024-08-02T14:45:00.000Z",
      totalBeforePromotion: "450000",
      totalAftterPromotion: "450000",
      isRead: false,
    },
  ]
}
