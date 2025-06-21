"use client"

import { useEffect } from "react"

/**
 * Hook to show a confirmation dialog when the user tries to leave the page with unsaved changes
 * @param hasUnsavedChanges Boolean indicating if there are unsaved changes
 * @param message Message to show in the confirmation dialog
 */
export const useBeforeUnload = (
  hasUnsavedChanges: boolean,
  message = "Bạn có thay đổi chưa được lưu. Bạn có chắc chắn muốn rời đi?",
) => {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!hasUnsavedChanges) return

      e.preventDefault()
      e.returnValue = message
      return message
    }

    if (hasUnsavedChanges) {
      window.addEventListener("beforeunload", handleBeforeUnload)
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [hasUnsavedChanges, message])
}
