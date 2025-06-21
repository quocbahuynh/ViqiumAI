"use client"
import { useState, useEffect } from "react"
import { Modal } from "@/components/ui/modal"
import Button from "@/components/ui/button/Button"
import { AlertTriangle, Loader2 } from "lucide-react"
import { projectsApi } from "@/lib/api"
import { toast } from "sonner"
import type { ProjectBase } from "@/types/projectType"
import { cn } from "@/lib/utils"

interface DeleteProjectConfirmationProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (projectId: string) => void
  project: ProjectBase | null
}

export default function DeleteProjectConfirmation({
  isOpen,
  onClose,
  onSuccess,
  project,
}: DeleteProjectConfirmationProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)

  useEffect(() => {
    // Reset states when modal opens/closes
    if (!isOpen) {
      setIsDeleting(false)
      setHasSubmitted(false)
    }
  }, [isOpen])

  const handleDelete = async () => {
    if (!project) return

    // Prevent double submission
    if (isDeleting || hasSubmitted) {
      return
    }

    setIsDeleting(true)
    setHasSubmitted(true)

    try {
      // Call API to delete project
      await projectsApi.deleteProject(project._id)

      toast.success("Xóa dự án thành công")
      onSuccess(project._id)
      onClose()
    } catch (error) {
      console.error("Failed to delete project:", error)
      toast.error("Xóa dự án thất bại")
      setHasSubmitted(false) // Allow retry on error
    } finally {
      setIsDeleting(false)
    }
  }

  const handleClose = () => {
    // Reset states when closing
    setIsDeleting(false)
    setHasSubmitted(false)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-md m-4">
      <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl">
        <div className="flex flex-col items-center text-center mb-5">
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Xóa dự án</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Bạn có chắc chắn muốn xóa dự án{" "}
            <span className="font-medium text-gray-900 dark:text-white">"{project?.name}"</span>? Hành động này không
            thể hoàn tác.
          </p>
        </div>

        <div className="flex gap-3 justify-center">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isDeleting}
            className={cn(
              "btn-outline",
              isDeleting && "opacity-50 cursor-not-allowed",
            )}
          >
            Hủy
          </Button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting || hasSubmitted}
            className={cn(
              "btn ",
              (isDeleting || hasSubmitted) && "opacity-50 cursor-not-allowed",
            )}
          >
            {isDeleting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" color="#FFFFFF" />
                <span className="text-white">Đang xóa...</span>
              </div>
            ) : (
              "Xác nhận xóa"
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}
