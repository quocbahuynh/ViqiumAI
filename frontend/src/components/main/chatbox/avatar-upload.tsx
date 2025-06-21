"use client"

import type React from "react"
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Upload, Loader2 } from "lucide-react"
import { imageService } from "@/lib/api"

interface AvatarUploadProps {
  avatar: string
  onChange: (avatar: string) => void
}

export function AvatarUpload({ avatar, onChange }: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Vui lòng chọn file ảnh hợp lệ")
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Kích thước file không được vượt quá 5MB")
        return
      }

      setIsUploading(true)
      setError("")
      setSuccess("")

      try {
        // Create preview URL immediately for better UX
        const reader = new FileReader()
        reader.onloadend = () => {
          onChange(reader.result as string)
        }
        reader.readAsDataURL(file)

        // Upload to server
        const formData = new FormData()
        formData.append("image", file)

        const response = await imageService.postImage(formData)

        // If API returns a URL, use that instead of the local preview
        if (response?.url) {
          onChange(response.url)
        }

        setSuccess("Đã tải lên ảnh thành công!")

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess("")
        }, 3000)
      } catch (error) {
        console.error("Error uploading image:", error)
        setError("Có lỗi xảy ra khi tải lên ảnh. Vui lòng thử lại.")

        // Clear error message after 5 seconds
        setTimeout(() => {
          setError("")
        }, 5000)
      } finally {
        setIsUploading(false)
      }
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="avatar">Avatar</Label>

      {/* Success Message */}
      {success && (
        <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
          <p className="text-sm text-green-800 dark:text-green-200">{success}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <div className="flex gap-4 items-center">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700 flex-shrink-0 relative">
          <img
            src={avatar || "/placeholder.svg?height=80&width=80"}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
          {isUploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <Loader2 className="h-6 w-6 text-white animate-spin" />
            </div>
          )}
        </div>

        <div className="flex-1 space-y-2">
          <div>
            <label
              htmlFor="avatarUpload"
              className={`inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                isUploading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isUploading ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Đang tải lên...
                </>
              ) : (
                <>
                  <Upload size={16} className="mr-2" />
                  Tải lên
                </>
              )}
            </label>
            <input
              id="avatarUpload"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="sr-only"
              disabled={isUploading}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Chấp nhận: JPG, PNG, GIF. Tối đa 5MB.</p>
        </div>
      </div>
    </div>
  )
}
