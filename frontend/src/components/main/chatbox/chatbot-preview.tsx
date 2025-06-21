"use client"

import { useState } from "react"
import { MessageSquare, Send, MoreVertical, Paperclip } from "lucide-react"

interface ChatbotConfig {
  name: string
  theme: {
    primaryColor: string
  }
  avatar: string
  welcomeMessage: string
}

interface ChatbotPreviewProps {
  config: ChatbotConfig
}

// Color utility functions
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: Number.parseInt(result[1], 16),
        g: Number.parseInt(result[2], 16),
        b: Number.parseInt(result[3], 16),
      }
    : null
}

function hexToRgba(hex: string, alpha: number) {
  const rgb = hexToRgb(hex)
  return rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})` : `rgba(74, 144, 226, ${alpha})`
}

function adjustBrightness(hex: string, percent: number) {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex

  const factor = percent / 100
  const r = Math.round(Math.min(255, Math.max(0, rgb.r + (255 - rgb.r) * factor)))
  const g = Math.round(Math.min(255, Math.max(0, rgb.g + (255 - rgb.g) * factor)))
  const b = Math.round(Math.min(255, Math.max(0, rgb.b + (255 - rgb.b) * factor)))

  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

function adjustDarkness(hex: string, percent: number) {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex

  const factor = 1 - percent / 100
  const r = Math.round(rgb.r * factor)
  const g = Math.round(rgb.g * factor)
  const b = Math.round(rgb.b * factor)

  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

export function ChatbotPreview({ config }: ChatbotPreviewProps) {
  const [previewVisible, setPreviewVisible] = useState(true)
  const [chatOpen, setChatOpen] = useState(true)

  const colors = {
    primary: config.theme.primaryColor,
    primaryLight: adjustBrightness(config.theme.primaryColor, 20),
    primaryDark: adjustDarkness(config.theme.primaryColor, 20),
    primaryRgba10: hexToRgba(config.theme.primaryColor, 0.1),
    primaryRgba20: hexToRgba(config.theme.primaryColor, 0.2),
    primaryRgba30: hexToRgba(config.theme.primaryColor, 0.3),
    primaryRgba70: hexToRgba(config.theme.primaryColor, 0.7),
  }

  return (
    <div className="sticky h-full mt-10 flex items-center justify-center">
      <>
        {previewVisible && (
          <div className="relative h-full overflow-hidden p-4 gap-3 flex flex-col items-end justify-center">
            {/* Chat Window - Always centered and visible */}
            <div className="w-110 max-w-[90%] bg-white rounded-2xl shadow-xl border overflow-hidden">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                  <img src={config.avatar || "/placeholder.svg"} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-base truncate">{config.name}</div>
                </div>
                <div className="flex gap-4 flex-shrink-0">
                  <div className="text-gray-400 cursor-pointer hover:text-gray-600">
                    <MoreVertical size={20} />
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="p-4 bg-white min-h-[280px] max-h-[300px] overflow-y-auto">
                <div className="space-y-3">
                  {/* Bot welcome message */}
                  <div className="flex">
                    <div className="bg-gray-100 rounded-2xl rounded-bl-sm py-3 px-4 max-w-[85%] text-sm text-gray-800">
                      {config.welcomeMessage}
                    </div>
                  </div>

                  {/* Bot second message */}
                  <div className="flex">
                    <div className="bg-gray-100 rounded-2xl rounded-bl-sm py-3 px-4 max-w-[85%] text-sm text-gray-800">
                      Tôi có thể giúp gì cho bạn hôm nay?
                    </div>
                  </div>

                  {/* User message */}
                  <div className="flex justify-end">
                    <div
                      className="rounded-2xl rounded-br-sm py-3 px-4 max-w-[85%] text-sm text-white"
                      style={{
                        backgroundColor: colors.primary,
                        border: `1px solid ${colors.primaryRgba20}`,
                      }}
                    >
                      Tôi muốn tìm hiểu về sản phẩm của bạn
                    </div>
                  </div>

                  {/* Bot response */}
                  <div className="flex">
                    <div className="bg-gray-100 rounded-2xl rounded-bl-sm py-3 px-4 max-w-[85%] text-sm text-gray-800">
                      Tuyệt vời! Chúng tôi có nhiều sản phẩm chất lượng. Bạn quan tâm đến loại sản phẩm nào cụ thể?
                    </div>
                  </div>

                  {/* User message 2 */}
                  <div className="flex justify-end">
                    <div
                      className="rounded-2xl rounded-br-sm py-3 px-4 max-w-[85%] text-sm text-white"
                      style={{
                        backgroundColor: colors.primary,
                        border: `1px solid ${colors.primaryRgba20}`,
                      }}
                    >
                      Bạn có thể gửi cho tôi bảng giá không?
                    </div>
                  </div>

                  {/* Bot response 2 */}
                  <div className="flex">
                    <div className="bg-gray-100 rounded-2xl rounded-bl-sm py-3 px-4 max-w-[85%] text-sm text-gray-800">
                      Dĩ nhiên rồi! Tôi sẽ gửi bảng giá chi tiết cho bạn ngay. Vui lòng để lại thông tin liên hệ để
                      chúng tôi hỗ trợ tốt nhất.
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Input */}
              <div className="p-3 border-t border-gray-100 bg-white rounded-b-2xl">
                <div className="flex items-center gap-3">
                  <div className="text-gray-400 cursor-pointer hover:text-gray-600">
                    <Paperclip size={20} />
                  </div>
                  <input
                    type="text"
                    placeholder="Nhập tin nhắn của bạn..."
                    className="flex-1 border-none outline-none text-sm py-2"
                  />
                  <div
                    className="cursor-pointer transition-all duration-200 hover:scale-110"
                    style={{ color: colors.primary }}
                  >
                    <Send size={18} />
                  </div>
                </div>
              </div>

              {/* Powered By */}
              <div className="text-right text-xs p-2 bg-gray-50 text-gray-500 border-t">
                ĐƯỢC HỖ TRỢ BỞI <span style={{ color: colors.primary }}>Viqium</span>
              </div>
            </div>

            {/* Chat Bubble - Bottom right corner */}
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: colors.primary,
                boxShadow: `0 4px 12px ${colors.primaryRgba30}`,
              }}
              onClick={() => setChatOpen(!chatOpen)}
            >
              <MessageSquare size={20} />
            </div>
          </div>
        )}
      </>
    </div>
  )
}
