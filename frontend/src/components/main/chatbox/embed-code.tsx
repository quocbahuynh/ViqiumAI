"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Copy, Check } from "lucide-react"
import { toast } from "sonner"
import ComponentCard from "@/components/common/ComponentCard"
import Input from "@/components/form/input/InputField"
import { ChatbotConfig } from "@/app/(main)/manage/[id]/website-integration/page"



interface EmbedCodeProps {
  config: ChatbotConfig
  visible: boolean
  onClose: () => void
}

export function EmbedCode({ config }: EmbedCodeProps) {
  const [copied, setCopied] = useState(false)

  const generateEmbedCode = () => {
    return `<script src="https://www.viqium.com/chatbox.js" api-key="${config.apiKey}" async></script>`
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateEmbedCode())
    setCopied(true)
    toast.success( "Mã nhúng đã được sao chép vào clipboard.",
    )
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <ComponentCard title="Mã nhúng Chatbot" desc="Sao chép mã nhúng để thêm chatbot vào website của bạn">

        <div className="relative">
          <Input value={generateEmbedCode()}  readOnly  className="font-mono text-sm bg-muted" />
          <Button size="sm" variant="secondary" className="absolute top-1.5 right-2" onClick={copyToClipboard}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </Button>
        </div>
        <p className="text-base text-muted-foreground ">Thêm mã này vào phần &lt;head&gt; của website để nhúng chatbot.</p>
    </ComponentCard>
  )
}
