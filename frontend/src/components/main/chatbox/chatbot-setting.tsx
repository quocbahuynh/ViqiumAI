"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ColorPicker } from "./color-picker"
import { AvatarUpload } from "./avatar-upload"
import ComponentCard from "@/components/common/ComponentCard"
import Input from "@/components/form/input/InputField"
import { toast } from "sonner"
import Button from "@/components/ui/button/Button"
import axiosInstance from "@/lib/axios-config"
import { apiLinks } from "@/lib/api-link"
import { ChatbotConfig } from "@/app/(main)/manage/[id]/website-integration/page"


interface ChatbotSettingsProps {
  projectId: string;
  config: ChatbotConfig;
  onConfigChange: (config: ChatbotConfig) => void;
}

export function ChatbotSettings({ config, onConfigChange, projectId }: ChatbotSettingsProps) {
  const updateConfig = (updates: Partial<ChatbotConfig>) => {
    onConfigChange({ ...config, ...updates })
  }

  // Save configuration
  const saveConfig = async () => {
    console.log(config)
    try {
      const data = await axiosInstance.put(`${apiLinks.chatbox.update}/${projectId}`, config);
      console.log(data.data)
      const updatedConfig = {...data.data,theme:{primaryColor: data.data.theme}};
      console.log(updatedConfig)
      onConfigChange(updatedConfig);
      toast.success("Cấu hình đã được lưu thành công!");
    } catch (error) {
      console.error(error)
      toast.error("Lỗi khi lưu cấu hình. Vui lòng thử lại sau.");
    }

  }
  return (
    <ComponentCard padding="0px" title="Cài đặt Chatbot" desc="Cấu hình thông tin và giao diện của chatbot" >

      <div className="space-y-6">

        <div className="space-y-2">
          <Label htmlFor="botUrl">Website Url</Label>
          <Input
            id="botUrl"
            value={config.websiteUrl}
            onChange={(e) => updateConfig({ websiteUrl: e.target.value })}
            placeholder="viqium.com"
          />
        </div>
        {/* Bot Name */}
        <AvatarUpload avatar={config.avatar} onChange={(avatar) => updateConfig({ avatar })} />

        <div className="space-y-2">
          <Label htmlFor="botName">Tên Chatbot</Label>
          <Input
            id="botName"
            value={config.name}
            onChange={(e) => updateConfig({ name: e.target.value })}
            placeholder="Tên Chatbot"
          />
        </div>


        {/* Color Picker */}
        <ColorPicker
          color={config.theme.primaryColor}
          onChange={(color) =>
            updateConfig({
              theme: { ...config.theme, primaryColor: color },
            })
          }
        />

        <div className="mt-6 flex justify-end">
          <Button onClick={saveConfig}>Lưu cấu hình</Button>
        </div>
        {/* Avatar Upload */}
      </div>
    </ComponentCard>
  )
}
