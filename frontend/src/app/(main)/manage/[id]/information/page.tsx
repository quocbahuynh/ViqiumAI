"use client"

import ComponentCard from "@/components/common/ComponentCard"
import PageBreadcrumb from "@/components/common/PageBreadCrumbCustom"
import { useEffect, useState, useRef } from "react"
import { useParams } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchBusinessInformation, updateBusinessInformation, updateBusinessInformationOptimistic, rollbackBusinessInformation } from "@/store/slices/information/contentSlice"
import EditorSkeleton from "@/components/main/management/information/EditorSkeleton"
import BusinessEditor from "@/components/main/management/information/BusinessEditor"
import Alert from "@/components/ui/alert/Alert"

export default function InformationPage() {
  const params = useParams<{ id: string }>()
  const projectId = params.id
  const dispatch = useAppDispatch()

  // Get data from Redux store
  const information = useAppSelector((state) => state.information.data[projectId])
  const status = useAppSelector((state) => state.information.status[projectId] || "idle")
  const error = useAppSelector((state) => state.information.error[projectId])

  const [onSending, setOnSending] = useState(false)
  const [submitError, setSubmitError] = useState<boolean | null>(null)
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false)
  const [content, setContent] = useState<string>("")

  const isLoading = status === "loading"
  const isError = status === "failed"

  // Track previous projectId to detect actual value changes
  const prevProjectIdRef = useRef<string | undefined>("")

  // Fetch information only if projectId changes and data is not in store
  useEffect(() => {
    // Check if projectId has actually changed in value
    const projectIdChanged = prevProjectIdRef.current !== projectId

    // Update prevProjectIdRef with the current projectId
    prevProjectIdRef.current = projectId

    // Only fetch if projectId exists, projectId has changed, and data is not in store
    if (projectId && projectIdChanged && !information && status === "idle") {
      dispatch(fetchBusinessInformation(projectId));
    }
  }, [dispatch, projectId, information, status]);

  const handleSave = async (contentHTML: string) => {
    setOnSending(true)
    setSubmitError(null)

    // Optimistic update: Update Redux state immediately
    const previousInformation = information // Store previous state for rollback if needed
    dispatch(updateBusinessInformationOptimistic({ projectId, baseInformation: contentHTML }))

    try {
      const resultAction = await dispatch(
        updateBusinessInformation({
          projectId,
          data: { baseInformation: contentHTML },
        }),
      )

      if (updateBusinessInformation.rejected.match(resultAction)) {
        // Rollback Redux state if API call fails
        dispatch(rollbackBusinessInformation({ projectId, previousInformation }))
        setSubmitError(true)
        return false
      }
      return true
    } catch (error) {
      console.error("Error saving:", error)
      // Rollback Redux state on error
      dispatch(rollbackBusinessInformation({ projectId, previousInformation }))
      setSubmitError(true)
      return false
    } finally {
      setOnSending(false)
    }
  }

  const handleUseTemplate = () => {
    setIsTemplateModalOpen(true)
  }

  const handleSelectTemplate = (templateContent: string) => {
    setContent(templateContent)
  }

  // Get the content from Redux or use local state if it's a template
  const displayContent = content || information?.baseInformation || "<p>Chưa có nội dung</p>"

  return (
    <div>
      <PageBreadcrumb pageTitle="Thông tin doanh nghiệp" />

      <Alert
        variant="info"
        title="Cung cấp thông tin doanh nghiệp cho AI"
        message="Hãy mô tả doanh nghiệp của bạn — bao gồm sản phẩm, dịch vụ, quy mô và định hướng phát triển — để AI có thể tư vấn chính xác và phù hợp hơn."
        showLink={false}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1 mt-3">
        <div className="space-y-6">
          <ComponentCard title="Văn bản giới thiệu doanh nghiệp">
            {isLoading ? (
              <EditorSkeleton />
            ) : (
              <BusinessEditor
                initialContent={displayContent}
                onSave={handleSave}
                onSending={onSending}
                error={submitError || isError}
                onUseTemplate={handleUseTemplate}
              />
            )}
          </ComponentCard>
        </div>
      </div>
{/* 
      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      /> */}
    </div>
  )
}