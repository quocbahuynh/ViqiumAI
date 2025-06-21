export interface AIModel {
    id: string
    name: string
    description: string
    capabilities: string[]
  }
  
  export interface ResponseStyle {
    enum:string
    id: string
    name: string
  }
  
  export interface MessageLengthOption {
    value: number
    label: string
  }
  export const aiModels: AIModel[] = [
    {
      id: "gpt-4o-mini-2024-07-18",
      name: "GPT-4o Mini",
      description: "Phiên bản nhỏ gọn của GPT-4o, tối ưu hóa cho tốc độ và chi phí thấp.",
      capabilities: ["Tóm tắt văn bản", "Trả lời tự nhiên", "Phân tích ngữ cảnh", "Hỗ trợ hội thoại nhanh"]
    },
    {
      id: "o3-mini-2025-01-31",
      name: "O3 Mini",
      description: "Mô hình O3 nhẹ, phù hợp cho ứng dụng di động và nhúng.",
      capabilities: ["Phân loại nội dung", "Hiểu ngôn ngữ tự nhiên", "Gợi ý văn bản", "Chạy offline"]
    },
    {
      id: "gpt-4.1-nano-2025-04-14",
      name: "GPT-4.1 Nano",
      description: "Mô hình cực nhỏ từ dòng GPT-4.1, dành cho các tác vụ đơn giản với chi phí cực thấp.",
      capabilities: ["Hoàn thành câu", "Trả lời ngắn gọn", "Xử lý đầu vào nhỏ", "Tối ưu cho tốc độ"]
    }
  ];
  
  export const responseStyles: ResponseStyle[] = [
    {
      id: "professional",
      name: "Trang trọng",        // tương ứng với enum: "formal"
      enum: "formal"
    },
    {
      id: "friendly",
      name: "Thân thiện",         // tương ứng với enum: "friendly"
      enum: "friendly"
    },
    
    {
      id: "enthusiastic",
      name: "Nhiệt huyết",          // enum: "neutral", nên name cũng là "Trung lập"
      enum: "enthusiastic"
    },
    {
      id: "casual",
      name: "Trung lập",          // tương ứng với enum: "neutral"
      enum: "neutral"
    }
  ];

  
  

  export const messageLengthOptions: MessageLengthOption[] = [
    {
      value: 300,
      label: "Ngắn",
    },
    {
      value: 400,
      label: "Trung bình",
    },
    {
      value: 500,
      label: "Dài",
    },
  ]
  

  