"use client"
import { useState, useEffect } from "react"

import { useForm } from "react-hook-form"
import Input from "@/components/form/input/InputField"
import Label from "@/components/form/Label"
import Button from "@/components/ui/button/Button"
import { Modal } from "@/components/ui/modal"
import { Loader2, X } from "lucide-react"
import { projectsApi, professionsApi } from "@/lib/api"
import type { ProfessionSelected, ProjectBase } from "@/types/projectType"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

// Default cover image
const DEFAULT_COVER_IMAGE =
  "https://images.unsplash.com/photo-1531973576160-7125cd663d86?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

type FormValues = {
  name: string
  professionId: string
}

interface EditProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (updatedProject: ProjectBase) => void
  project: ProjectBase | null
}

export default function EditProjectModal({ isOpen, onClose, onSuccess, project }: EditProjectModalProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<FormValues>({
    mode: "onChange", // Enable real-time validation
  })

  const [professions, setProfessions] = useState<ProfessionSelected[]>([])
  const [isUpdating, setIsUpdating] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false)

  useEffect(() => {
    const fetchProfessions = async () => {
      if (!isOpen) return

      setIsLoading(true)
      try {
        const data = await professionsApi.getProfessions()
        setProfessions(data)
        setError(null)
      } catch (err) {
        console.error("Failed to fetch professions:", err)
        setError("Failed to load professions. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfessions()
  }, [isOpen])

  useEffect(() => {
    // Reset form and set values when modal opens with project data
    if (isOpen && project) {
      reset()
      setHasSubmitted(false)
      setIsUpdating(false)
      setError(null)

      // Find the profession ID based on the profession name
      const professionId = professions.find((p) => p.label === project.profession.name)?.value || ""

      setValue("name", project.name)
      setValue("professionId", professionId)
    } else if (!isOpen) {
      reset()
      setHasSubmitted(false)
      setIsUpdating(false)
      setError(null)
    }
  }, [isOpen, project, reset, setValue, professions])

  const onSubmit = async (data: FormValues) => {
    if (!project) return

    // Prevent double submission
    if (isUpdating || hasSubmitted) {
      return
    }

    setIsUpdating(true)
    setHasSubmitted(true)
    setError(null)

    try {
      // Update project with form data
      const updateData = {
        name: data.name,
        // Remove image field
      }

      // Call API to update project
      await projectsApi.updateProject(updateData, project._id)

      // Find the profession name for the updated project
      const professionSelected = professions.find((p) => p.value === data.professionId)

      // Create updated project object
      const updatedProject: ProjectBase = {
        ...project,
        name: data.name,
        profession: {
          name: professionSelected?.label || project.profession.name,
        },
        image: project.image,
      }

      toast.success("Cập nhật dự án thành công")
      onSuccess(updatedProject)
      reset()
      onClose()
    } catch (err) {
      console.error("Failed to update project:", err)
      setError("Failed to update project. Please try again.")
      toast.error("Cập nhật dự án thất bại")
      setHasSubmitted(false) // Allow retry on error
    } finally {
      setIsUpdating(false)
    }
  }

  const handleClose = () => {
    // Reset states when closing
    setHasSubmitted(false)
    setIsUpdating(false)
    setError(null)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-[500px] z-99999 m-4">
      <div className="relative w-full p-6 overflow-y-auto bg-white no-scrollbar rounded-2xl dark:bg-gray-900 lg:p-8">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <h4 className="text-xl font-semibold text-gray-800 dark:text-white/90">Chỉnh sửa</h4>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-green-500" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-10 gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30">
              <X className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <p className="text-red-600 dark:text-red-400 text-center">{error}</p>
            <Button size="sm" variant="outline" onClick={() => setError(null)}>
              Thử lại
            </Button>
          </div>
        ) : (
          <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-5">
              <div>
                <Label className="mb-1.5 inline-block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tên AI <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="Nhập tên AI của bạn"
                  {...register("name", {
                    required: "Tên dự án không được để trống",
                    maxLength: {
                      value: 255,
                      message: "Tên vượt độ dài cho phép",
                    },
                    minLength: {
                      value: 1,
                      message: "Tên dự án không được để trống",
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9\sÀ-ỹ]+$/,
                      message: "Không nên có ký tự đặc biệt",
                    },
                    validate: {
                      notOnlySpaces: (value) => {
                        return value.trim().length > 0 || "Tên dự án không được để trống"
                      },
                      noLeadingTrailingSpaces: (value) => {
                        return value === value.trim() || "Tên không được có khoảng trắng ở đầu hoặc cuối"
                      },
                    },
                  })}
                  className={cn(
                    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 transition-colors dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-green-500",
                    errors.name ? "border-red-500 dark:border-red-500" : "",
                  )}
                />
                {errors.name && <p className="mt-1.5 text-sm text-red-500">{errors.name.message}</p>}
              </div>
            </div>

            <div className="flex items-center gap-3 mt-8 sm:justify-end">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isUpdating}
                className="btn-outline"
              >
                Hủy
              </Button>
              <button
                type="submit"
                disabled={isUpdating || hasSubmitted || isSubmitting}
                className={cn(
                  "btn",
                  (isUpdating || hasSubmitted || isSubmitting) && "opacity-50 cursor-not-allowed",
                )}
              >
                {isUpdating ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-white">Đang cập nhật...</span>
                  </div>
                ) : (
                  "Cập nhật"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  )
}
