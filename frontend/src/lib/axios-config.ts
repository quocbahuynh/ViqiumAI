import axios from "axios"
import { getSession, signOut } from "next-auth/react"
import { apiLinks } from "./api-link"

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds
})

const authUrls = [
  apiLinks.auth.login,
  apiLinks.auth.register,
  apiLinks.auth.enterCode,
  apiLinks.auth.resendCode,
  apiLinks.auth.forgetPwd,
  apiLinks.auth.verifyNewPwd,
  apiLinks.auth.refresh,
]

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  async (config) => {
    // Check if the request URL is in the auth URLs list
    const isAuthUrl = authUrls.some((url) => config.url?.includes(url))

    // Only add token for non-auth URLs
    if (!isAuthUrl) {
      const session: any = await getSession()
      if (session && session.user?.token?.accessToken) {
        config.headers.Authorization = `Bearer ${session.user.token.accessToken}`
      }
    }

    return config
  },
  (error) => Promise.reject(error)
)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 403) {
      try {
        await signOut({ redirect: false }); // Sign out only
      } catch (signOutError) {
        console.error("Sign out failed:", signOutError);
      }
    }

    return Promise.reject(error); // Always reject the original error
  }
);

export default axiosInstance