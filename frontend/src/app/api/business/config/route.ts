// File: /src/app/api/chatbot/config/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const defaultConfig = {
    name: "Viqium AI",
    theme: { primaryColor: "#b1e346" },
    avatar: "/logo.png",
  };

  return NextResponse.json(defaultConfig);
}
