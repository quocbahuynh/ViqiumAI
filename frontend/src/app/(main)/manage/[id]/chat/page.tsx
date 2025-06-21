"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useParams } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchMessages, setTypingStatus, clearChat, addBotMessage } from "@/store/slices/chatSlice"
import { ChevronDown, ArrowUp, Copy, Sparkles, Plus } from "lucide-react"
import axiosInstance from "@/lib/axios-config"
import { apiLinks } from "@/lib/api-link"
import Button from "@/components/ui/button/Button"
import PageBreadcrumb from "@/components/common/PageBreadCrumbCustom"
import type { ChatMessage } from "@/types/chatType"
import { aiModels } from "@/utils/mockdata"
import { toast } from "sonner"
import ClearChatConfirmationModal from "./clearChat"
import Image from "next/image"
import ConfirmDialog from "@/components/ui/confirm-dialog"

// Component for typing animation
const TypingAnimation = ({ text, speed = 15 }: { text: string; speed?: number }) => {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, speed) // Speed of typing animation

      return () => clearTimeout(timeout)
    } else {
      setIsComplete(true)
    }
  }, [currentIndex, text, speed])

  return (
    <>
      {displayedText}
      {!isComplete && <span className="animate-pulse">|</span>}
    </>
  )
}

export default function ChatPage() {
  const params = useParams<{ id: string }>()
  const projectId = params?.id
  const dispatch = useAppDispatch()
  const messages = useAppSelector((state) => state.chat.messages[projectId] || [])
  const status = useAppSelector((state) => state.chat.status[projectId] || "idle")
  const error = useAppSelector((state) => state.chat.error[projectId])
  const isTyping = useAppSelector((state) => state.chat.isTyping)

  const [newMessage, setNewMessage] = useState("")
  const [selectedModel, setSelectedModel] = useState<string>("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [animatingMessageId, setAnimatingMessageId] = useState<string | null>(null)
  const [showClearConfirmation, setShowClearConfirmation] = useState(false)

  // Track previous projectId to detect actual value changes
  const prevProjectIdRef = useRef<string | undefined>("")

  // Fetch messages when projectId changes and data is not in store
  useEffect(() => {
    const projectIdChanged = prevProjectIdRef.current !== projectId
    prevProjectIdRef.current = projectId

    if (projectId && projectIdChanged && messages.length === 0 && status === "idle") {
      dispatch(fetchMessages(projectId))
    }
  }, [dispatch, projectId, messages.length, status])

  // Set default selected model when component mounts
  useEffect(() => {
    if (aiModels.length > 0 && !selectedModel) {
      setSelectedModel(aiModels[0].id)
    }
  }, [selectedModel])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "24px"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }, [newMessage])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !projectId) return

    const userMessage: ChatMessage = {
      _id: Date.now().toString(),
      from: "user",
      content: newMessage,
    }

    // Dispatch user message immediately
    dispatch(setTypingStatus(true))
    setNewMessage("")

    try {
      // Dispatch user message
      await dispatch(addBotMessage({ projectId, message: userMessage }))

      // Send user message to API and get response
      const response = await axiosInstance.post(`${apiLinks.chat.sendMessage}/${projectId}`, {
        question: userMessage.content,
      })

      const botMessageContent: string = response.data.data.content
      const botMessageId = Date.now().toString()

      const botMessage: ChatMessage = {
        _id: botMessageId,
        from: "assistant",
        content: botMessageContent,
      }

      // Dispatch bot message directly to Redux without additional API call
      await dispatch(addBotMessage({ projectId, message: botMessage }))

      // Set this message to animate
      setAnimatingMessageId(botMessageId)

      // Calculate animation duration based on message length
      const animationDuration = Math.max(1500, botMessageContent.length * 15)

      // Clear animating message after animation completes
      setTimeout(() => setAnimatingMessageId(null), animationDuration)
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: ChatMessage = {
        _id: Date.now().toString(),
        from: "assistant",
        content: "Xin lỗi, đã xảy ra lỗi khi xử lý tin nhắn của bạn.",
      }
      await dispatch(addBotMessage({ projectId, message: errorMessage }))
    } finally {
      dispatch(setTypingStatus(false))
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const examplePrompts = [
    { title: "Tư vấn sản phẩm phù hợp", description: "Giúp khách chọn sản phẩm theo nhu cầu của họ" },
    { title: "Giải thích chính sách đổi trả", description: "Trình bày rõ ràng và dễ hiểu cho khách hàng" },
    { title: "Gợi ý chương trình khuyến mãi", description: "Đề xuất ưu đãi đang có phù hợp với khách" },
    { title: "Hướng dẫn thanh toán", description: "Chỉ dẫn từng bước để khách hoàn tất đơn hàng" },
  ]

  const handleCopyMessage = (content: string) => {
    navigator.clipboard
      .writeText(content)
      .then(() => {
        toast.success("Đã sao chép thành công", {
          description: "Nội dung đã được sao chép vào clipboard.",
          duration: 3000,
        })
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err)
        toast.error("Sao chép thất bại", {
          description: "Không thể sao chép nội dung. Vui lòng thử lại.",
          duration: 3000,
        })
      })
  }

  const handleNewChat = () => {
    setShowClearConfirmation(true)
  }

  async function confirmClearChat() {
    if (projectId) {
      try {

        await axiosInstance.delete(`${apiLinks.chat.deleteChat}/${projectId}`, {
        })
        dispatch(clearChat(projectId))
        setShowClearConfirmation(false)
      }
      catch {

      }

    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <PageBreadcrumb pageTitle="Huấn luyện AI" />

      {/* Main Chat Area */}
      <div className="max-h-[calc(100vh-160px)] shadow-xl w-full flex justify-between flex-col h-full p-0 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full mr-1 bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Viqium AI Logo"
                width={32}
                height={32}
                className="rounded-full" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Viqium AI</h3>
              <p className="text-xs text-gray-500">Trợ lý thông minh cho cửa hàng của bạn</p>
            </div>
          </div>
          <div className="flex items-center gap-2">

            <Button
              variant="outline"
              size="md"
              className="gap-1"
              startIcon={<Plus className="h-4 w-4" />}
              onClick={handleNewChat}
            >
              Đoạn chat mới
            </Button>
          </div>
        </div>

        {/* Messages Area - Fixed height with scroll */}
        <div className="overflow-y-auto p-4 md:p-6 w-full flex-1">
          {status === "loading" ? (
            <div className="h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 dark:border-brand-400"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4">
              <div className="w-16 h-16 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center mb-4">
                <Image
                  src="/logo.png"
                  alt="Viqium AI Logo"
                  width={100}
                  height={100}
                  className="rounded-full" />              </div>
              <h3 className="text-md  text-gray-700 font-medium mb-2">Xin chào!</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 max-w-full">
                Bạn có thể trò chuyện cùng tôi để cung cấp kiến thức mới phục vụ tư vấn khách hàng.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
                {examplePrompts.map((prompt, index) => (
                  <button
                    key={index}
                    className="text-left p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => {
                      setNewMessage(prompt.title)
                      if (textareaRef.current) {
                        textareaRef.current.focus()
                      }
                    }}
                  >
                    <p className="text-sm text-gray-700 font-medium">{prompt.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{prompt.description}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6  mx-auto">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.from === "Me" || message.from === "user" ? "justify-end" : "justify-start"
                    }`}
                >
                  {message.from !== "Me" && message.from !== "user" && (
                    <div className="h-8 w-8 rounded-full bg-brand-600 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                      <Image
                        src="/logo.png"
                        alt="Viqium AI Logo"
                        width={32}
                        height={32}
                        className="rounded-full" />                    </div>
                  )}
                  <div className="max-w-[85%]">
                    <div
                      className={`rounded-lg px-4 py-3 text-sm font-normal ${message.from === "Me" || message.from === "user"
                        ? "bg-brand-600 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        }`}
                    >
                      <p className="whitespace-pre-wrap">
                        {message.from !== "Me" && message.from !== "user" && animatingMessageId === message._id ? (
                          <TypingAnimation text={message.content} speed={12} />
                        ) : (
                          message.content
                        )}
                      </p>
                    </div>

                    {message.from !== "Me" && message.from !== "user" && (
                      <div className="flex mt-2 ml-1 gap-1">
                        <button
                          className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          onClick={() => handleCopyMessage(message.content)}
                        >
                          <Copy className="h-4 w-4 text-gray-500" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="h-8 w-8 rounded-full bg-brand-600 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                    <Image
                      src="/logo.png"
                      alt="Viqium AI Logo"
                      width={32}
                      height={32}
                      className="rounded-full" />                     </div>
                  <div className="max-w-[85%]">
                    <div className="rounded-lg px-4 py-3 bg-gray-100 dark:bg-gray-800">
                      <div className="flex space-x-2">
                        <div
                          className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="relative flex items-center  mx-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
            <textarea
              ref={textareaRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Nhập tin nhắn..."
              className="w-full border-0 bg-transparent py-3 px-4 pr-12 text-sm focus:ring-0 dark:text-white resize-none min-h-[24px] max-h-[200px] outline-none"
              rows={1}
              disabled={status === "loading"}
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || status === "loading"}
              className={`absolute text-gray-300 right-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors ${newMessage.trim() && status !== "loading"
                ? "text-gray-300 hover:text-white hover:bg-brand-500 dark:hover:bg-brand-900/20"
                : "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                }`}
            >
              {status === "loading" ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <ArrowUp className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
              isOpen={showClearConfirmation}
              title="Xác nhận xóa: Hãy cẩn thận!"
              message={`Chú ý: Xóa đoạn chat sẽ làm mất hoàn toàn nội dung cuộc trò chuyện này (ngoại trừ kiến thức bán hàng). AI sẽ không thể khôi phục bất kỳ chi tiết nào bạn đã chia sẻ. Hãy kiểm tra và lưu thông tin quan trọng trước khi xóa. Bạn có muốn tiếp tục?`}
              confirmText="Xác nhận xóa"
              cancelText="Hủy"
              onConfirm={confirmClearChat}
              onCancel={() => setShowClearConfirmation(false)}
              variant="danger"
            />
    </div>
  )
}
