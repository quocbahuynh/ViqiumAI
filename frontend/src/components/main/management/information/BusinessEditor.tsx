"use client"

import type React from "react"
import { useEffect, useCallback, useState } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import Document from "@tiptap/extension-document"
import Paragraph from "@tiptap/extension-paragraph"
import Text from "@tiptap/extension-text"
import Bold from "@tiptap/extension-bold"
import Italic from "@tiptap/extension-italic"
import BulletList from "@tiptap/extension-bullet-list"
import OrderedList from "@tiptap/extension-ordered-list"
import ListItem from "@tiptap/extension-list-item"
import History from "@tiptap/extension-history"
import Placeholder from "@tiptap/extension-placeholder"
import CharacterCount from "@tiptap/extension-character-count"
import EditorMenuBar from "./EditorMenuBar"
import Alert from "@/components/ui/alert/Alert"

interface BusinessEditorProps {
  initialContent: string
  onSave: (content: string) => Promise<boolean>
  onSending: boolean
  error: boolean | null
  onUseTemplate: () => void
}

const MAX_CHARACTERS = 5000

const BusinessEditor: React.FC<BusinessEditorProps> = ({ initialContent, onSave, onSending, error, onUseTemplate }) => {
  const [validationError, setValidationError] = useState<string | null>(null)

  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Bold,
      Italic,
      History,
      BulletList,
      OrderedList,
      ListItem,
      CharacterCount.configure({
        limit: MAX_CHARACTERS,
      }),
      Placeholder.configure({
        placeholder: "Viết đoạn văn mô tả doanh nghiệp của bạn...",
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "min-h-[500px] w-full px-4 py-3 text-md focus:outline-none bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-b-lg",
      },
    },
    onUpdate: ({ editor }) => {
      // Clear validation error when user starts typing
      if (validationError) {
        setValidationError(null)
      }
    },
  })

  // Set initial content when editor is ready
  useEffect(() => {
    if (editor && initialContent) {
      editor.commands.setContent(initialContent)
    }
  }, [editor, initialContent])

  // Validation function
  const validateContent = (content: string): string | null => {
    // Remove HTML tags and get plain text
    const plainText = content.replace(/<[^>]*>/g, "").trim()

    // Check if content is empty
    if (!plainText || plainText.length === 0) {
      return "Nội dung không được để trống"
    }

    // Check character limit
    if (plainText.length > MAX_CHARACTERS) {
      return `Nội dung vượt quá giới hạn ${MAX_CHARACTERS} ký tự`
    }

    return null
  }

  // Handle save with validation
  const handleSave = useCallback(async () => {
    if (!editor) return

    const content = editor.getHTML()

    // Validate content
    const error = validateContent(content)
    if (error) {
      setValidationError(error)
      return
    }

    // Clear validation error if content is valid
    setValidationError(null)

    const success = await onSave(content)

    if (success) {
      // Success handled by parent component
    }
  }, [editor, onSave])

  // Get character count
  const characterCount = editor?.storage.characterCount.characters() || 0
  const isOverLimit = characterCount > MAX_CHARACTERS

  return (
    <div className="border border-gray-200 rounded-lg dark:border-gray-700 overflow-hidden">
      {error && (
        <Alert
          variant="error"
          title="Cập nhật thất bại!"
          message="Lỗi hệ thống máy chủ. Vui lòng thử lại sau."
          showLink={false}
        />
      )}

      {validationError && <Alert variant="error" title="Lỗi validation!" message={validationError} showLink={false} />}

      <EditorMenuBar
        editor={editor}
        onSending={onSending}
        onUseTemplate={onUseTemplate}
        onSave={handleSave}
        characterCount={characterCount}
        maxCharacters={MAX_CHARACTERS}
        isOverLimit={isOverLimit}
      />

      <EditorContent editor={editor} className="font-normal text-sm" />

      {/* Character count display */}
      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500 dark:text-gray-400">Số ký tự: {characterCount.toLocaleString()}</span>
          <span className={`${isOverLimit ? "text-red-500" : "text-gray-500 dark:text-gray-400"}`}>
            Giới hạn: {MAX_CHARACTERS.toLocaleString()}
          </span>
        </div>
        {isOverLimit && (
          <p className="text-red-500 text-xs mt-1">
            Vượt quá {(characterCount - MAX_CHARACTERS).toLocaleString()} ký tự
          </p>
        )}
      </div>
    </div>
  )
}

export default BusinessEditor
