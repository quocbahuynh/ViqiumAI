"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { ChatbotSettings } from "@/components/main/chatbox/chatbot-setting"
import { ChatbotPreview } from "@/components/main/chatbox/chatbot-preview"
import { EmbedCode } from "@/components/main/chatbox/embed-code"
import { Button } from "@/components/ui/button"
import PageBreadcrumb from "@/components/common/PageBreadCrumbCustom"
import axiosInstance from "@/lib/axios-config"
import { apiLinks } from "@/lib/api-link"
import { useParams } from "next/navigation"

export interface ChatbotConfig {
  name: string;
  theme: {
    primaryColor: string
  };
  apiKey: string | null;
  websiteUrl: string;
  avatar: string;
  welcomeMessage: string;
}

export default function ChatbotCustomizer() {
  const params = useParams<{ id: string }>()
  const projectId = params?.id

  const [config, setConfig] = useState<ChatbotConfig>({
    name: "Viqium AI",
    theme: {
      primaryColor: "#b1e346",
    },
    apiKey: null,
    websiteUrl: "viqium.com",
    avatar: "/logo.png",
    welcomeMessage: "Xin chào! 👋",
  })


  // Load saved configuration on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`${apiLinks.chatbox.getChatBoxByProjectId}/${projectId}`);

        if (response.status == 200) {
          const data = await response.data
          setConfig(data)
        }
         if (response.status == 404) {
          const data = await response.data
          setConfig(data)
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [projectId])

  return (
    <div >
      <div className="flex flex-col space-y-6">
        <PageBreadcrumb pageTitle="Tùy chỉnh Chatbot" />

        {/* Embed Code Section - Top */}
        {
          config.apiKey && <EmbedCode config={config} visible={true} onClose={() => { }} />
        }

        {/* Main Content - Settings and Preview */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Settings */}
          <div className="flex-1">
            <ChatbotSettings config={config} onConfigChange={setConfig} projectId={projectId} />
          </div>

          {/* Preview */}
          <div className="flex-1">
            <ChatbotPreview config={config} />
          </div>
        </div>
      </div>
    </div>
  )
}
