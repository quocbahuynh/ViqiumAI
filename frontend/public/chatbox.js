;(() => {
  const currentScript =
    document.currentScript || Array.from(document.querySelectorAll("script")).find((s) => s.src.includes("chatbot.js"))
  const apiKey = currentScript?.getAttribute("api-key") || null
  const webUrl = window.location.hostname

  console.log("API KEY được truyền vào:", apiKey)

  // Default fallback data
  const apiLinks = "https://chatbot-backend-qu7z.onrender.com"
  const defaultConfig = {
    name: "Shop Bot",
    theme: { primaryColor: "#4A90E2" },
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop&crop=face",
    welcomeMessage: "Xin chào! 👋",
  }

  let chatConfig = defaultConfig
  let userInfo = null
  let isShowingUserForm = false
  let customerKey = null
  let isWaitingForResponse = false // Thêm state để track trạng thái chờ

  // Color utility functions
  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: Number.parseInt(result[1], 16),
          g: Number.parseInt(result[2], 16),
          b: Number.parseInt(result[3], 16),
        }
      : null
  }

  function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
  }

  function adjustBrightness(hex, percent) {
    const rgb = hexToRgb(hex)
    if (!rgb) return hex

    const factor = percent / 100
    const r = Math.round(Math.min(255, Math.max(0, rgb.r + (255 - rgb.r) * factor)))
    const g = Math.round(Math.min(255, Math.max(0, rgb.g + (255 - rgb.g) * factor)))
    const b = Math.round(Math.min(255, Math.max(0, rgb.b + (255 - rgb.b) * factor)))

    return rgbToHex(r, g, b)
  }

  function adjustDarkness(hex, percent) {
    const rgb = hexToRgb(hex)
    if (!rgb) return hex

    const factor = 1 - percent / 100
    const r = Math.round(rgb.r * factor)
    const g = Math.round(rgb.g * factor)
    const b = Math.round(rgb.b * factor)

    return rgbToHex(r, g, b)
  }

  function hexToRgba(hex, alpha) {
    const rgb = hexToRgb(hex)
    return rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})` : `rgba(74, 144, 226, ${alpha})`
  }

  // Generate color palette from primary color
  function generateColorPalette(primaryColor) {
    return {
      primary: primaryColor,
      primaryLight: adjustBrightness(primaryColor, 20),
      primaryDark: adjustBrightness(primaryColor, 20),
      primaryRgba10: hexToRgba(primaryColor, 0.1),
      primaryRgba20: hexToRgba(primaryColor, 0.2),
      primaryRgba30: hexToRgba(primaryColor, 0.3),
      primaryRgba70: hexToRgba(primaryColor, 0.7),
    }
  }

  // Fetch business details
  async function fetchBusinessConfig() {
    try {
      const response = await fetch(`${apiLinks}/api/chatbox/config`, {
        method: "GET",
        headers: {
          "x-api-key": apiKey,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        const config = {
          name: data.name,
          theme: { primaryColor: data.theme },
          avatar: data.avatar,
          welcomeMessage: "Xin chào! 👋",
        }
        chatConfig = config
        console.log("Đã tải cấu hình:", chatConfig)
      }
    } catch (error) {
      console.log("Sử dụng cấu hình mặc định do lỗi API:", error)
      chatConfig = defaultConfig
    }

    applyConfiguration()
  }

  // Fetch chat history
  async function fetchChatHistory() {
    if (!customerKey) {
      console.log("Không có customerKey, bỏ qua fetch lịch sử chat")
      return
    }

    console.log("Đang gọi API fetch lịch sử chat với customerKey:", customerKey)

    try {
      const response = await fetch(`${apiLinks}/api/chatbox/history`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "x-customer-key": customerKey,
        },
      })

      console.log("Phản hồi API lịch sử chat:", response.status)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const history = await response.json()
      console.log("Lịch sử chat nhận được:", history)

      const messages = document.querySelector("#chat-messages")
      if (messages && Array.isArray(history)) {
        messages.innerHTML = ""
        history.forEach((message) => {
          if (message.role === "user") {
            appendMessage(message.content, "user")
          } else if (message.role === "assistant") {
            appendMessage(message.content, "bot")
          }
        })
        if (history.length === 0 && userInfo && userInfo.name) {
          appendMessage(`Xin chào ${userInfo.name}! Tôi có thể giúp gì cho bạn hôm nay?`, "bot")
        }
      }
    } catch (error) {
      console.error("Lỗi khi lấy lịch sử chat:", error)
      appendMessage("Không thể tải lịch sử trò chuyện. Vui lòng thử lại sau.", "bot")
    }
  }

  // Apply configuration to UI
  function applyConfiguration() {
    const headerTitle = document.getElementById("header-title")
    const avatar = document.getElementById("header-avatar")

    if (headerTitle) {
      headerTitle.textContent = chatConfig.name || "Hỗ trợ khách hàng"
    }

    if (avatar && chatConfig.avatar) {
      avatar.src = chatConfig.avatar
    }

    applyDynamicColors()

    // Load user info and show welcome message only if no customerKey
    userInfo = getUserInfo()
    const messages = document.querySelector("#chat-messages")
    if (messages && !customerKey) {
      messages.innerHTML = ""
      appendMessage(chatConfig.welcomeMessage || "Xin chào! 👋", "bot")
      appendMessage("Vui lòng cung cấp thông tin để bắt đầu:", "bot")
    }
  }

  // Apply dynamic colors based on primary color
  function applyDynamicColors() {
    const colors = generateColorPalette(chatConfig.theme.primaryColor)

    const root = document.documentElement
    root.style.setProperty("--chat-primary", colors.primary)
    root.style.setProperty("--chat-primary-light", colors.primaryLight)
    root.style.setProperty("--chat-primary-dark", colors.primaryDark)
    root.style.setProperty("--chat-primary-rgba-10", colors.primaryRgba10)
    root.style.setProperty("--chat-primary-rgba-20", colors.primaryRgba20)
    root.style.setProperty("--chat-primary-rgba-30", colors.primaryRgba30)
    root.style.setProperty("--chat-primary-rgba-70", colors.primaryRgba70)

    const bubble = document.getElementById("mychat-bubble")
    const sendButton = document.getElementById("send-button")
    const closeButton = document.querySelector(".close-button")

    if (bubble) {
      bubble.style.background = colors.primary
      bubble.style.boxShadow = `0 4px 12px ${colors.primaryRgba30}`
    }

    if (sendButton) {
      sendButton.style.color = colors.primary
    }

    if (closeButton) {
      closeButton.style.background = colors.primaryRgba70
      closeButton.style.color = colors.primary
    }
  }

  // Lucide Icons SVG paths
  const icons = {
    messageSquare: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`,
    send: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"></path><path d="M22 2 11 13"></path></svg>`,
    x: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>`,
    user: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
    phone: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>`,
    moreVertical: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>`,
    paperclip: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>`,
    loader: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 11-6.219-8.56"></path></svg>`,
  }

  // Enhanced styles with loading effects
  const style = document.createElement("style")
  style.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
    
    :root {
      --chat-primary: #4A90E2;
      --chat-primary-light: #6BA3E8;
      --chat-primary-dark: #6BA3E8;
      --chat-primary-rgba-10: rgba(74, 144, 226, 0.1);
      --chat-primary-rgba-20: rgba(74, 144, 226, 0.2);
      --chat-primary-rgba-30: rgba(74, 144, 226, 0.3);
      --chat-primary-rgba-70: rgba(74, 144, 226, 0.7);
    }
    
    #mychat-bubble {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 56px;
      height: 56px;
      background: var(--chat-primary);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      cursor: pointer;
      z-index: 9999;
      box-shadow: 0 4px 12px var(--chat-primary-rgba-30);
      transition: all 0.2s ease;
      border: none;
      outline: none;
    }
    
    #mychat-bubble:hover {
      transform: scale(1.05);
      background: var(--chat-primary-dark);
      box-shadow: 0 6px 16px var(--chat-primary-rgba-30);
    }
    
    #mychat-window {
      position: fixed;
      bottom: 90px;
      right: 20px;
      width: 380px;
      max-width: calc(100vw - 40px);
      max-height: 70vh;
      background: white;
      box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16);
      border-radius: 16px;
      display: none;
      flex-direction: column;
      overflow: hidden;
      z-index: 9999;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      animation: slideUp 0.3s ease;
    }
    
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    #chat-header {
      padding: 16px;
      border-bottom: 1px solid #f0f0f0;
      display: flex;
      background: transparent;
      align-items: center;
      gap: 12px;
      background: white;
      border-radius: 16px 16px 0 0;
    }
    
    #header-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: transparent;
      object-fit: cover;
      flex-shrink: 0;
    }
    
    #header-title {
      font-size: 16px;
      font-weight: 500;
      flex: 1;
      min-width: 0;
      background: transparent;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    #header-actions {
      display: flex;
      gap: 16px;
      flex-shrink: 0;
    }
    
    .header-action {
      color: #666;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.2s ease;
      padding: 4px;
    }
    
    .header-action:hover {
      color: var(--chat-primary);
    }
    
    #chat-messages {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      background: #fff;
      display: flex;
      flex-direction: column;
      gap: 12px;
      min-height: 280px;
      max-height: calc(70vh - 140px);
    }
    
    #chat-messages::-webkit-scrollbar {
      width: 6px;
    }
    
    #chat-messages::-webkit-scrollbar-track {
      background: transparent;
    }
    
    #chat-messages::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.1);
      border-radius: 3px;
    }
    
    #chat-input-container {
      padding: 12px 16px;
      border-top: 1px solid #f0f0f0;
      display: flex;
      align-items: center;
      gap: 12px;
      background: #fff;
      border-radius: 0 0 16px 16px;
      position: relative;
    }
    
    #chat-input {
      flex: 1;
      border: none;
      outline: none;
      font-size: 14px;
      padding: 8px 0;
      font-family: inherit;
      color: #333;
      background: transparent;
      min-width: 0;
    }
    
    #chat-input::placeholder {
      color: #999;
    }
    
    #chat-input:disabled {
      color: #999;
      cursor: not-allowed;
    }
    
    .input-action {
      color: #666;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.2s ease;
      padding: 4px;
      background: transparent;
      flex-shrink: 0;
    }
    
    .input-action:hover {
      color: var(--chat-primary);
    }
    
    #send-button {
      color: var(--chat-primary);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      padding: 4px;
      flex-shrink: 0;
    }
    
    #send-button:hover:not(:disabled) {
      color: var(--chat-primary-dark);
      transform: scale(1.1);
    }
    
    #send-button:disabled {
      color: #ccc;
      cursor: not-allowed;
      transform: none;
    }
    
    #send-button.loading {
      color: var(--chat-primary);
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    .chat-bubble {
      max-width: 85%;
      padding: 12px 16px;
      border-radius: 16px;
      font-size: 14px;
      line-height: 1.4;
      position: relative;
      word-wrap: break-word;
      background: transparent;
      animation: messageSlide 0.3s ease-out;
    }
    
    @keyframes messageSlide {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .chat-bubble.user {
      background: var(--chat-primary-rgba-10);
      color: #333;
      align-self: flex-end;
      border-bottom-right-radius: 4px;
      border: 1px solid var(--chat-primary-rgba-20);
    }
    
    .chat-bubble.bot {
      background: #F5F5F5;
      color: #333;
      align-self: flex-start;
      border-bottom-left-radius: 4px;
    }
    
    /* Typing indicator styles */
    .typing-indicator {
      background: #F5F5F5;
      color: #666;
      align-self: flex-start;
      border-bottom-left-radius: 4px;
      max-width: 85%;
      padding: 12px 16px;
      border-radius: 16px;
      font-size: 14px;
      line-height: 1.4;
      display: flex;
      align-items: center;
      gap: 8px;
      animation: messageSlide 0.3s ease-out;
    }
    
    .typing-dots {
      display: flex;
      gap: 4px;
    }
    
    .typing-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--chat-primary);
      animation: typingBounce 1.4s infinite ease-in-out;
    }
    
    .typing-dot:nth-child(1) { animation-delay: -0.32s; }
    .typing-dot:nth-child(2) { animation-delay: -0.16s; }
    .typing-dot:nth-child(3) { animation-delay: 0s; }
    
    @keyframes typingBounce {
      0%, 80%, 100% {
        transform: scale(0.8);
        opacity: 0.5;
      }
      40% {
        transform: scale(1);
        opacity: 1;
      }
    }
    
    .powered-by {
      text-align: right;
      padding: 8px 16px;
      font-size: 12px;
      color: #999;
      border-top: 1px solid #f0f0f0;
      background: #fafafa;
      border-radius: 0 0 16px 16px;
    }
    
    .powered-by span {
      font-weight: 600;
      color: var(--chat-primary);
    }
    
    .close-button {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 56px;
      height: 56px;
      background: var(--chat-primary-rgba-70);
      color: var(--chat-primary);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      cursor: pointer;
      z-index: 9998;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      display: none;
      transition: all 0.2s ease;
      border: none;
      outline: none;
    }
    
    .close-button:hover {
      background: var(--chat-primary-rgba-20);
      transform: scale(1.05);
    }
    
    .icon {
      display: flex;
      align-items: center;
      background: transparent;
      justify-content: center;
    }
    
    .icon svg {
      width: 20px;
      background: transparent;
      height: 20px;
    }
    
    #send-button svg {
      width: 18px;
      background: transparent;
      height: 18px;
    }
    
    /* User Info Form in Chat Styles */
    .user-info-chat-form {
      background: linear-gradient(135deg, var(--chat-primary-rgba-10), var(--chat-primary-rgba-20));
      border: 1px solid var(--chat-primary-rgba-30);
      border-radius: 12px;
      padding: 16px;
      margin: 8px 0;
      background: transparent;
      align-self: flex-start;
      max-width: 100%;
      animation: messageSlide 0.3s ease-out;
    }

    .chat-form-title {
      font-size: 14px;
      font-weight: 600;
      background: transparent;
      color: var(--chat-primary);
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .chat-form-field {
      margin-bottom: 12px;
      background: transparent;
    }

    .chat-form-field:last-of-type {
      margin-bottom: 16px;
    }

    .chat-form-field label {
      display: block;
      font-size: 12px;
      background: transparent;
      font-weight: 500;
      color: #666;
      margin-bottom: 6px;
    }

    .chat-form-field input {
      width: 100%;
      padding: 10px 12px;
      background: transparent;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 14px;
      outline: none;
      transition: all 0.2s ease;
      box-sizing: border-box;
      font-family: inherit;
    }

    .chat-form-field input:focus {
      border-color: var(--chat-primary);
      box-shadow: 0 0 0 2px var(--chat-primary-rgba-20);
    }

    .chat-form-field .error-message {
      font-size: 11px;
      color: #e53e3e;
      margin-top: 4px;
      background: transparent;
      display: none;
    }

    .chat-form-field.error input {
      border-color: #e53e3e;
      background: transparent;
    }

    .chat-form-field.error .error-message {
      display: block;
    }

    .chat-form-actions {
      display: flex;
      gap: 8px;
      background: transparent;
      justify-content: flex-end;
    }

    .chat-form-button {
      padding: 8px 16px;
      border: none;
      border-radius: 6px;
      background: transparent;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: inherit;
    }

    .chat-form-button.primary {
      background: var(--chat-primary);
      color: white;
    }

    .chat-form-button.primary:hover {
      background: var(--chat-primary-dark);
    }

    .chat-form-button.primary:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .chat-form-button.secondary {
      background: #f8f9fa;
      color: #666;
      border: 1px solid #e2e8f0;
    }

    .chat-form-button.secondary:hover {
      background: #e9ecef;
    }

    .required {
      color: #e53e3e;
    }
    
    /* Enhanced responsive design */
    @media (max-width: 768px) {
      #mychat-window {
        width: calc(100vw - 32px);
        max-height: 75vh;
        right: 16px;
        bottom: 80px;
        border-radius: 12px;
      }
      
      #mychat-bubble {
        right: 16px;
        bottom: 16px;
        width: 52px;
        height: 52px;
      }
      
      .close-button {
        right: 16px;
        bottom: 16px;
        width: 52px;
        background: var(--chat-primary-rgba-30);
        height: 52px;
      }
    }
    
    @media (max-width: 480px) {
      #mychat-window {
        width: calc(100vw - 24px);
        max-height: 80vh;
        right: 12px;
        bottom: 75px;
        border-radius: 10px;
      }
      
      #mychat-bubble {
        right: 12px;
        bottom: 12px;
        width: 48px;
        height: 48px;
      }
      
      .close-button {
        right: 12px;
        bottom: 12px;
        width: 48px;
        height: 48px;
      }
    }
  `
  document.head.appendChild(style)

  // Check if customer key exists in localStorage
  function getCustomerKey() {
    try {
      return localStorage.getItem("x-customer-key")
    } catch (error) {
      console.error("Lỗi khi lấy x-customer-key từ localStorage:", error)
      return null
    }
  }

  // Save customer key to localStorage
  function saveCustomerKey(key) {
    try {
      localStorage.setItem("x-customer-key", key)
      customerKey = key
      console.log("Đã lưu x-customer-key:", key)
    } catch (error) {
      console.error("Lỗi khi lưu x-customer-key vào localStorage:", error)
    }
  }

  // Check if user info exists in localStorage
  function getUserInfo() {
    try {
      const storedInfo = localStorage.getItem("chatbot_user_info")
      return storedInfo ? JSON.parse(storedInfo) : null
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng từ localStorage:", error)
      return null
    }
  }

  // Save user info to localStorage
  function saveUserInfo(info) {
    try {
      localStorage.setItem("chatbot_user_info", JSON.stringify(info))
      userInfo = info
      console.log("Đã lưu thông tin người dùng:", info)
    } catch (error) {
      console.error("Lỗi khi lưu thông tin người dùng vào localStorage:", error)
    }
  }

  // Clear user info and customer key (for testing)
  function clearUserInfo() {
    try {
      localStorage.removeItem("chatbot_user_info")
      localStorage.removeItem("x-customer-key")
      userInfo = null
      customerKey = null
      console.log("Đã xóa thông tin người dùng và x-customer-key")
    } catch (error) {
      console.error("Lỗi khi xóa thông tin:", error)
    }
  }

  // Make it available globally for testing
  window.clearChatbotUserInfo = clearUserInfo

  // Validate phone number
  function validatePhone(phone) {
    const phoneRegex = /^(0|\+84)(\d{9,10})$/
    return phoneRegex.test(phone.replace(/\s/g, ""))
  }

  // Validate name
  function validateName(name) {
    return name.trim().length >= 2 && name.trim().length <= 50
  }

  // Show typing indicator
  function showTypingIndicator() {
    const messages = document.querySelector("#chat-messages")
    if (!messages) return

    // Remove existing typing indicator
    const existingIndicator = messages.querySelector(".typing-indicator")
    if (existingIndicator) {
      existingIndicator.remove()
    }

    const typingDiv = document.createElement("div")
    typingDiv.className = "typing-indicator"
    typingDiv.id = "typing-indicator"
    typingDiv.innerHTML = `
      <div class="typing-dots">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    `

    messages.appendChild(typingDiv)
    messages.scrollTop = messages.scrollHeight
  }

  // Hide typing indicator
  function hideTypingIndicator() {
    const typingIndicator = document.querySelector("#typing-indicator")
    if (typingIndicator) {
      typingIndicator.remove()
    }
  }

  // Show user info form in chat
  function showUserInfoChatForm() {
    if (isShowingUserForm) return

    isShowingUserForm = true

    const messages = document.querySelector("#chat-messages")
    const formDiv = document.createElement("div")
    formDiv.className = "user-info-chat-form"
    formDiv.id = "user-info-chat-form"

    formDiv.innerHTML = `
      <div class="chat-form-title">
        <span class="icon">${icons.user}</span>
        Vui lòng cung cấp thông tin của bạn
      </div>
      
      <div class="chat-form-field" id="name-field">
        <label for="chat-user-name">Họ và tên <span class="required">*</span></label>
        <input type="text" id="chat-user-name" placeholder="Nhập họ và tên của bạn" maxlength="50" />
        <div class="error-message">Vui lòng nhập tên từ 2-50 ký tự</div>
      </div>
      
      <div class="chat-form-field" id="phone-field">
        <label for="chat-user-phone">Số điện thoại <span class="required">*</span></label>
        <input type="tel" id="chat-user-phone" placeholder="Ví dụ: 0901234567" />
        <div class="error-message">Vui lòng nhập số điện thoại hợp lệ</div>
      </div>
      
      <div class="chat-form-actions">
        <button type="button" class="chat-form-button secondary" id="chat-cancel-button">Hủy</button>
        <button type="button" class="chat-form-button primary" id="chat-save-button" disabled>Lưu</button>
      </div>
    `

    messages.appendChild(formDiv)
    messages.scrollTop = messages.scrollHeight

    // Setup form event listeners
    setupChatFormEventListeners(formDiv)

    // Focus on first input
    setTimeout(() => {
      const nameInput = formDiv.querySelector("#chat-user-name")
      if (nameInput) nameInput.focus()
    }, 100)
  }

  // Setup chat form event listeners
  function setupChatFormEventListeners(formDiv) {
    const nameInput = formDiv.querySelector("#chat-user-name")
    const phoneInput = formDiv.querySelector("#chat-user-phone")
    const saveButton = formDiv.querySelector("#chat-save-button")
    const cancelButton = formDiv.querySelector("#chat-cancel-button")

    // Validation function
    function validateForm() {
      const nameValid = validateName(nameInput.value)
      const phoneValid = validatePhone(phoneInput.value)

      // Update field states
      const nameField = formDiv.querySelector("#name-field")
      const phoneField = formDiv.querySelector("#phone-field")

      if (nameValid) {
        nameField.classList.remove("error")
      } else {
        nameField.classList.add("error")
      }

      if (phoneValid) {
        phoneField.classList.remove("error")
      } else {
        phoneField.classList.add("error")
      }

      // Enable/disable save button
      saveButton.disabled = !(nameValid && phoneValid)

      return nameValid && phoneValid
    }

    // Real-time validation
    nameInput.addEventListener("input", validateForm)
    phoneInput.addEventListener("input", validateForm)

    // Submit on Enter
    nameInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        phoneInput.focus()
      }
    })

    phoneInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && validateForm()) {
        saveUserInfoAndFetchKey()
      }
    })

    // Save button
    saveButton.addEventListener("click", saveUserInfoAndFetchKey)

    // Cancel button
    cancelButton.addEventListener("click", closeForm)

    async function saveUserInfoAndFetchKey() {
      if (validateForm()) {
        const userData = {
          fullName: nameInput.value.trim(),
          phone: phoneInput.value.trim(),
          websiteUrl: "viqium.com",
        }

        try {
          // Save user info
          saveUserInfo(userData)

          // Call API to get x-customer-key
          const response = await fetch(`${apiLinks}/api/chatbox/session`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": apiKey,
            },
            body: JSON.stringify(userData),
          })

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          const data = await response.json()
          const key = data.customerKey // Adjust based on actual API response structure

          if (key) {
            saveCustomerKey(key)
            closeForm()
            appendMessage(`Cảm ơn ${userData.fullName}! Thông tin của bạn đã được lưu.`, "bot")
            appendMessage("Tôi có thể giúp gì cho bạn hôm nay?", "bot")

            // Send the pending message if any
            const input = document.querySelector("#chat-input")
            if (input && input.dataset.pendingMessage) {
              const pendingMessage = input.dataset.pendingMessage
              delete input.dataset.pendingMessage
              setTimeout(() => {
                sendMessageWithUserInfo(pendingMessage)
              }, 500)
            }
          } else {
            throw new Error("Không nhận được x-customer-key từ API")
          }
        } catch (error) {
          console.error("Lỗi khi lưu thông tin hoặc lấy x-customer-key:", error)
          appendMessage("Có lỗi xảy ra khi lưu thông tin. Vui lòng thử lại.", "bot")
        }
      }
    }

    function closeForm() {
      isShowingUserForm = false
      formDiv.remove()

      // Clear pending message if cancelled
      const input = document.querySelector("#chat-input")
      if (input && input.dataset.pendingMessage) {
        delete input.dataset.pendingMessage
      }
    }
  }

  // Initialize
  async function initialize() {
    customerKey = getCustomerKey()
    console.log("CustomerKey ban đầu:", customerKey)
    userInfo = getUserInfo()
    await fetchBusinessConfig()
    createChatElements()
    if (customerKey) {
      await fetchChatHistory()
    }
    setupEventListeners()
  }

  function createChatElements() {
    // Create bubble
    const bubble = document.createElement("div")
    bubble.id = "mychat-bubble"
    bubble.className = "icon"
    bubble.innerHTML = icons.messageSquare
    document.body.appendChild(bubble)

    // Create close button
    const closeButton = document.createElement("div")
    closeButton.className = "close-button icon"
    closeButton.innerHTML = icons.x
    document.body.appendChild(closeButton)

    // Create chat window
    const windowBox = document.createElement("div")
    windowBox.id = "mychat-window"
    windowBox.innerHTML = `
      <div id="chat-header">
        <img id="header-avatar" src="${chatConfig.avatar}" alt="Avatar" />
        <div id="header-title">${chatConfig.name}</div>
      </div>
      <div id="chat-messages"></div>
      <div id="chat-input-container">
        <input id="chat-input" type="text" placeholder="Nhập tin nhắn của bạn..." />
        <div id="send-button" class="icon">${icons.send}</div>
      </div>
      <div class="powered-by">ĐƯỢC HỖ TRỢ BỞI <span>Viqium</span></div>
    `
    document.body.appendChild(windowBox)
  }

  function setupEventListeners() {
    const bubble = document.getElementById("mychat-bubble")
    const closeButton = document.querySelector(".close-button")
    const input = document.querySelector("#chat-input")
    const sendButton = document.querySelector("#send-button")

    // Toggle chat window
    let isOpen = false
    bubble.addEventListener("click", () => {
      isOpen = true
      const windowBox = document.getElementById("mychat-window")
      windowBox.style.display = "flex"
      bubble.style.display = "none"
      closeButton.style.display = "flex"
      setTimeout(() => {
        if (!customerKey) {
          showUserInfoChatForm()
        }
        input.focus()
      }, 100)
    })

    // Close chat window
    closeButton.addEventListener("click", () => {
      isOpen = false
      const windowBox = document.getElementById("mychat-window")
      windowBox.style.display = "none"
      bubble.style.display = "flex"
      closeButton.style.display = "none"
    })

    // Send message events
    sendButton.addEventListener("click", sendMessage)

    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault()
        sendMessage()
      }
    })

    // Enable/disable send button based on input and loading state
    input.addEventListener("input", () => {
      sendButton.disabled = !input.value.trim() || isWaitingForResponse
    })
  }

  // Append message
  function appendMessage(text, sender = "bot") {
    const messages = document.querySelector("#chat-messages")
    if (!messages) {
      console.error("Không tìm thấy #chat-messages")
      return
    }
    const messageDiv = document.createElement("div")
    messageDiv.className = `chat-bubble ${sender}`
    messageDiv.textContent = text
    messages.appendChild(messageDiv)
    messages.scrollTop = messages.scrollHeight
  }

  // Send message (check user info first)
  async function sendMessage() {
    const input = document.querySelector("#chat-input")
    const text = input.value.trim()

    if (!text || isWaitingForResponse) return

    // Check if customer key exists
    if (!customerKey) {
      input.dataset.pendingMessage = text
      appendMessage(text, "user")
      setTimeout(() => {
        appendMessage("Vui lòng cung cấp thông tin để tiếp tục:", "bot")
        setTimeout(() => {
          showUserInfoChatForm()
        }, 500)
      }, 500)
      return
    }

    // Send message with user info
    sendMessageWithUserInfo(text)
  }

  // Send message with user info
  async function sendMessageWithUserInfo(text) {
    const input = document.querySelector("#chat-input")
    const sendButton = document.querySelector("#send-button")

    // Set loading state
    isWaitingForResponse = true
    input.value = ""
    input.disabled = true
    input.placeholder = "Đang chờ phản hồi..."
    sendButton.disabled = true
    sendButton.classList.add("loading")
    sendButton.innerHTML = icons.loader

    appendMessage(text, "user")

    // Show typing indicator
    showTypingIndicator()

    try {
      const requestBody = {
        content: text,
      }

      const response = await fetch(`${apiLinks}/api/chatbox/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "x-customer-key": customerKey,
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Hide typing indicator before showing response
      hideTypingIndicator()

      // ✅ Xử lý array response
      if (Array.isArray(data)) {
        data.forEach((msg, index) => {
          if (msg.role === "assistant") {
            setTimeout(
              () => {
                appendMessage(msg.content || "...", "bot")
              },
              300 * (index + 1),
            ) // Delay theo thứ tự
          }
        })
      } else {
        console.warn("Phản hồi không phải là mảng:", data)
        appendMessage("Đã nhận được phản hồi từ server.", "bot")
      }
    } catch (error) {
      console.error("Lỗi chat:", error)
      hideTypingIndicator()
      setTimeout(() => {
        appendMessage("Xin lỗi, tôi đang gặp sự cố kết nối. Vui lòng thử lại sau.", "bot")
      }, 300)
    } finally {
      // Reset loading state
      setTimeout(() => {
        isWaitingForResponse = false
        input.disabled = false
        input.placeholder = "Nhập tin nhắn của bạn..."
        sendButton.disabled = false
        sendButton.classList.remove("loading")
        sendButton.innerHTML = icons.send
        input.focus()
      }, 1000) // Wait a bit before enabling input again
    }
  }

  // Start initialization
  initialize()
})()
