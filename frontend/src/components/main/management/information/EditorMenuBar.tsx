"use client"

import type React from "react"
import Button from "@/components/ui/button/Button"
import type { Editor } from "@tiptap/react"
import { Bold, Italic, List, ListOrdered, FileText, Save, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface EditorMenuBarProps {
  editor: Editor | null
  onSending: boolean
  onUseTemplate: () => void
  onSave: () => void
  characterCount?: number
  maxCharacters?: number
  isOverLimit?: boolean
}

const EditorMenuBar: React.FC<EditorMenuBarProps> = ({
  editor,
  onSending,
  onUseTemplate,
  onSave,
  characterCount = 0,
  maxCharacters = 5000,
  isOverLimit = false,
}) => {
  if (!editor) {
    return null
  }

  // Check if content is empty (only HTML tags without actual text)
  const content = editor.getHTML()
  const plainText = content.replace(/<[^>]*>/g, "").trim()
  const isEmpty = !plainText || plainText.length === 0

  // Disable save button if content is empty or over limit
  const isSaveDisabled = onSending || isEmpty || isOverLimit

  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700">
      <div className="flex flex-wrap items-center justify-between p-2 mx-auto">
        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
          <Button
            size="md"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={cn(
              "p-1 sm:p-2 hover:bg-gray-200 dark:hover:bg-gray-700",
              editor.isActive("bold") ? "bg-gray-200 dark:bg-gray-700" : "bg-gray-100 dark:bg-gray-800",
            )}
          >
            <Bold
              className={cn(
                "w-5 h-5",
                editor.isActive("bold") ? "text-dark-600 dark:text-dark" : "text-brand-700 dark:text-brand-300",
              )}
            />
          </Button>
{/* 

          <Button onClick={onUseTemplate} variant="outline" size="md" className="flex items-center gap-1 ml-2">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Sử dụng mẫu</span>
          </Button> */}
        </div>

        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          {/* Validation indicators */}
          {isEmpty && (
            <div className="flex items-center gap-1 text-red-500 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Nội dung trống</span>
            </div>
          )}

          {isOverLimit && (
            <div className="flex items-center gap-1 text-red-500 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Vượt giới hạn</span>
            </div>
          )}

          <Button
            onClick={onSave}
            variant="primary"
            disabled={isSaveDisabled}
            size="md"
            className={cn("flex items-center gap-1", isSaveDisabled && "opacity-50 cursor-not-allowed")}
          >
            {onSending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Đang lưu...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Lưu thay đổi</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default EditorMenuBar
