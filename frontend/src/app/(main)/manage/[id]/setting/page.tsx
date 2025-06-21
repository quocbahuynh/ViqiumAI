"use client"

import { useEffect, useState } from "react"
import ComponentCard from "@/components/common/ComponentCard"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Check } from "lucide-react"
import { aiModels, responseStyles, messageLengthOptions } from "@/utils/mockdata"
import { Badge } from "@/components/ui/badge"
import Alert from "@/components/ui/alert/Alert"
import { useParams } from "next/navigation"
import Button from "@/components/ui/button/Button"
import AISettingsSkeleton from "./skeleton"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchAIConfig, updateAIConfig, setConfig, setHasValidData} from "@/store/slices/settingSlice"
import PageBreadcrumb from "@/components/common/PageBreadCrumbCustom"

interface AIConfig {
  maxToken: number
  communicationStyle: string
  models: string
}

export default function AISettingsPage() {
  const params = useParams<{ id: string }>()
  const projectId = params?.id
  const dispatch = useAppDispatch()

  // Get data from Redux store
  const config = useAppSelector((state)=>state.setting.config)
  const status = useAppSelector((state)=>state.setting.status)
  const updateStatus = useAppSelector((state)=>state.setting.updateStatus)
  const hasValidData = useAppSelector((state)=>state.setting.hasValidData)

  // Local state for form inputs (derived from Redux state)
  const [selectedModel, setSelectedModel] = useState<string>("")
  const [responseStyle, setResponseStyle] = useState<string>("")
  const [messageLength, setMessageLength] = useState<number>(0)

  // Fetch AI Config when component mounts
  useEffect(() => {
    if (projectId && status === "idle") {
      dispatch(fetchAIConfig(projectId))
    } else if (!projectId) {
      dispatch(setHasValidData(false))
    }
  }, [dispatch, projectId, status])

  // Update local state when config is fetched
  useEffect(() => {
    if (config) {
      // Ánh xạ models
      const model = aiModels.find((m) => m.id === config.models)
      if (model) {
        setSelectedModel(model.id)
      } else {
        dispatch(setHasValidData(false))
        return
      }

      // Ánh xạ communicationStyle
      const style = responseStyles.find((s) => s.enum === config.communicationStyle)
      if (style) {
        setResponseStyle(style.id)
      } else {
        dispatch(setHasValidData(false))
        return
      }

      // Ánh xạ maxToken
      const lengthOption = messageLengthOptions.find((opt) => opt.value === config.maxToken)
      if (lengthOption) {
        setMessageLength(lengthOption.value)
      } else {
        dispatch(setHasValidData(false))
        return
      }

      // Nếu tất cả ánh xạ thành công, đánh dấu dữ liệu hợp lệ
      dispatch(setHasValidData(true))
    }
  }, [config, dispatch])

  // Hàm xử lý khi nhấn nút Update
  const handleUpdate = async () => {
    if (!projectId) return;

    // Tìm communicationStyle (enum) từ responseStyle (id)
    const selectedStyle = responseStyles.find((style) => style.id === responseStyle)
    const communicationStyle = selectedStyle ? selectedStyle.enum : "neutral" // Fallback nếu không tìm thấy

    const payload: AIConfig = {
      maxToken: messageLength,
      communicationStyle: communicationStyle,
      models: selectedModel,
    }

    // Dispatch Thunk action to update config
    await dispatch(updateAIConfig({ projectId, config: payload }))
    dispatch(setConfig(payload)) // Update local config state
  }

  // Nếu đang loading hoặc không có projectId hoặc không có dữ liệu hợp lệ, hiển thị skeleton
  if (status === "loading" || !projectId || !hasValidData) {
    return <AISettingsSkeleton />;
  }

  return (
    <div className="  dark:bg-gray-900 min-h-screen">
            <PageBreadcrumb pageTitle="Cài đặt AI" />

      <Alert variant="info" title="Trợ lý AI" message="Chọn mô hình AI và cấu hình hành vi của nó." />



      <ComponentCard
        title="Phong cách phản hồi"
        desc="Xác định giọng điệu mà trợ lý sẽ sử dụng để giao tiếp."
        className="mt-5 sm:mt-6"
      >
        <RadioGroup
          value={responseStyle}
          onValueChange={setResponseStyle}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {responseStyles
            .filter((style) => style.id !== "") // Loại bỏ style có id rỗng
            .map((style) => (
              <div
                key={style.id}
                className={`border rounded-xl p-3 sm:p-4 cursor-pointer transition-all ${
                  responseStyle === style.id
                    ? "border-brand-500 dark:border-brand-500 ring-1 ring-brand-500"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                <RadioGroupItem value={style.id} id={style.id} className="sr-only" />
                <Label htmlFor={style.id} className="flex items-center gap-2 cursor-pointer">
                  <div className="flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-gray-300 dark:border-gray-600">
                    {responseStyle === style.id && <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-brand-500"></div>}
                  </div>
                  <span className="font-medium text-sm sm:text-base">{style.name}</span>
                </Label>
              </div>
            ))}
        </RadioGroup>
      </ComponentCard>

      <ComponentCard
        title="Độ dài tối đa của tin nhắn"
        desc={`Giới hạn độ dài các phản hồi được tạo ra (${messageLength} ký tự)`}
        className="mt-5 sm:mt-6"
      >
        <RadioGroup
          value={messageLength.toString()} // RadioGroup yêu cầu value là string
          onValueChange={(value) => setMessageLength(Number(value))} // Chuyển về number khi set
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {messageLengthOptions.map((option) => (
            <div
              key={option.value}
              className={`border rounded-xl p-3 sm:p-4 cursor-pointer transition-all ${
                messageLength === option.value
                  ? "border-brand-500 dark:border-brand-500 ring-1 ring-brand-500"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              <RadioGroupItem value={option.value.toString()} id={`length-${option.value}`} className="sr-only" />
              <Label htmlFor={`length-${option.value}`} className="flex items-center gap-2 cursor-pointer">
                <div className="flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-gray-300 dark:border-gray-600">
                  {messageLength === option.value && (
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-brand-500"></div>
                  )}
                </div>
                <span className="font-medium text-sm sm:text-base">
                  {option.label} ({option.value})
                </span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </ComponentCard>

      {/* Nút Update */}
      <div className="mt-6 flex justify-end">
        <Button onClick={handleUpdate} disabled={updateStatus === "loading"}>
          {updateStatus === "loading" ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Đang cập nhật
            </>
          ) : (
            "Cập nhật"
          )}
        </Button>
      </div>
    </div>
  )
}