"use client"
import { useState, useEffect, useRef } from "react"
import { Controller, useForm } from "react-hook-form"
import Input from "@/components/form/input/InputField"
import Label from "@/components/form/Label"
import Button from "@/components/ui/button/Button"
import { Modal } from "@/components/ui/modal"
import { Loader2, X } from "lucide-react"
import { projectsApi, professionsApi } from "@/lib/api"
import type { ProfessionSelected, ProjectBase } from "@/types/projectType"
import Select from "../../form/Select"
import { cn } from "@/lib/utils"
import FacebookConnectWidget from "@/components/common/FacebookConnect"

type FormValues = {
  name: string
  professionId: string
  image?: File
}

interface CreateProjectWithImageProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (newProject: ProjectBase) => void
  onError: (error: string) => void
}

export default function CreateProjectWithImage({ isOpen, onClose, onSuccess, onError }: CreateProjectWithImageProps) {
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
  const [isCreating, setIsCreating] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false)
  const [fanpageChoice, setFanpageChoice] = useState<any>(null)

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
    // Reset form and preview when modal closes
    if (!isOpen) {
      reset()
      setHasSubmitted(false)
      setIsCreating(false)
      setError(null)
    }
  }, [isOpen, reset])

  const onSubmit = async (data: FormValues) => {
    // Prevent double submission
    if (isCreating || hasSubmitted) {
      return
    }

    setIsCreating(true)
    setHasSubmitted(true)
    setError(null)

    try {
      // Upload image if a new one was selected
      const imageUrl = ""

      // Create project with form data
      const response = await projectsApi.createProject({
        name: data.name,
        professionId: data.professionId,
        accessToken: fanpageChoice.accessToken,
        avatarUrl: fanpageChoice.avatarUrl,
        fanpageId: fanpageChoice.fanpageId,
        fanpageName: fanpageChoice.fanpageName
      })

      // Find the profession name for the created project
      const professionSelected = professions.find((p) => p.value === data.professionId)
      const projectWithProfession: ProjectBase = {
        _id: response._id,
        name: response.name,
        active: response.active,
        createdAt: response.createdAt,
        profession: {
          name: professionSelected?.label || "",
        },
        fannpage: fanpageChoice,
        image: imageUrl,
      }

      onSuccess(projectWithProfession)
      reset()
      onClose()
    } catch (err: any) {
      setHasSubmitted(false) // Allow retry on error
      if (err.status === 401 || err.response?.status === 401) {
        console.log("")
        onError("Bạn không có quyền truy cập. Vui lòng đăng nhập lại.")
        onClose()
      } else {
        setError("Không thể tạo dự án. Vui lòng thử lại.")
      }
    } finally {
      setFanpageChoice(null)
      setIsCreating(false)
    }
  }

  const handleClose = () => {
    // Reset states when closing
    setHasSubmitted(false)
    setIsCreating(false)
    setError(null)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-[500px] m-4">
      <div className="relative w-full p-6 overflow-y-auto bg-white no-scrollbar rounded-2xl dark:bg-gray-900 lg:p-8">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <h4 className="text-xl font-semibold text-dark dark:text-white/90">Tạo AI mới</h4>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-green-500" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-10 gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-red-900/30">
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
                  Đặt tên AI <span className="text-red-500">*</span>
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

              <div>
                <Label className="mb-1.5 inline-block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Ngành nghề kinh doanh <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Controller
                    name="professionId"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Vui lòng chọn ngành nghề kinh doanh",
                      validate: {
                        notEmpty: (value) => {
                          return value !== "" || "Vui lòng chọn ngành nghề kinh doanh"
                        },
                      },
                    }}
                    render={({ field }) => (
                      <Select
                        options={professions}
                        placeholder="Chọn ngành nghề kinh doanh"
                        className={cn(
                          "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 transition-colors dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-green-500",
                          errors.professionId ? "border-red-500 dark:border-red-500" : "",
                        )}
                        onChange={field.onChange}
                        defaultValue={field.value}
                      />
                    )}
                  />
                </div>
                {errors.professionId && <p className="mt-1.5 text-sm text-red-500">{errors.professionId.message}</p>}
              </div>

              <FacebookConnectWidget setChooseFanpage={setFanpageChoice} chooseFanpage={fanpageChoice} />
            </div>

            <div className="flex items-center gap-3 mt-8 sm:justify-end">
              <Button
                size="md"
                variant="outline"
                onClick={handleClose}
                disabled={isCreating}
                className="px-4 py-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Hủy
              </Button>
              <button
                type="submit"
                disabled={isCreating || hasSubmitted || isSubmitting || !fanpageChoice}
                className={cn(
                  "btn btn-navbar btn-sm",
                  (isCreating || hasSubmitted || isSubmitting || !fanpageChoice) && "opacity-50 cursor-not-allowed",
                )}
              >
                {isCreating ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" color="#FFFFFF" />
                    <span className="text-white">Đang tạo...</span>
                  </div>
                ) : (
                  "Tạo dự án"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  )
}
