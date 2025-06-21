import './globals.css';
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import Script from 'next/script';
import { Metadata } from 'next';
import { Toaster } from 'sonner';



export const metadata: Metadata = {
  title: {
    default: "Viqium AI - Giải pháp AI cho Fanpage bán hàng",
    template: "%s | Viqium AI",
  },
  description:
    "Khám phá Viqium AI tư vấn sản phẩm qua hình ảnh và văn bản, đề xuất khuyến mãi, chốt đơn hiệu quả với khả năng tự động tạo kịch bản dẫn dắt khách hàng vượt trội.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.viqium.com"), // Fallback nếu không có biến môi trường
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.viqium.com",
    title: "Viqium AI - Giải pháp AI cho Fanpage bán hàng",
    description:
      "Khám phá Viqium AI tư vấn sản phẩm qua hình ảnh và văn bản, đề xuất khuyến mãi, chốt đơn hiệ",
    images: [
      {
        url: "https://dev-pullzone.b-cdn.net/sky/tutors/metaimage-Er6vM.png", // Đảm bảo file ảnh tồn tại trong public/
        width: 1200,
        height: 630,
        alt: "Viqium AI - Giải pháp AI cho Fanpage bán hàng",
        type: "image/png",
      },
    ],
    siteName: "Viqium AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "Viqium AI - Giải pháp AI cho Fanpage bán hàng",
    description:
      "Khám phá Viqium AI tư vấn sản phẩm qua hình ảnh và văn bản, đề xuất khuyến mãi, chốt đơn hiệu quả với khả năng tự động tạo kịch bản dẫn dắt khách hàng vượt trội.",
    images: ["https://dev-pullzone.b-cdn.net/sky/tutors/metaimage-Er6vM.png"],
    creator: "@ViqiumAI", // Thay bằng Twitter handle thật
  },
};

///álknjdjlskandljksa
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-BQDWZ218W0"
          strategy="afterInteractive"
        />

        <Script id="gtag-init" strategy="afterInteractive">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-BQDWZ218W0');
        `}
        </Script>

        <meta name="google-site-verification" content="ZjDkNbGxJkOvyk8MDqvPeW_cQhcbYYInEMPRlkrVf_I" />
      </head>
      <body className={`relative overflow-x-hidden  text-base antialiased bg-white dark:bg-dark-300`}>
        <ThemeProvider>
          <Toaster />
          <SidebarProvider>{children}</SidebarProvider>
        </ThemeProvider>
        {/* Facebook SDK */}
        <div id="fb-root"></div>
        <Script
          strategy="afterInteractive"
          src="https://connect.facebook.net/en_US/sdk.js"
        />
        {/* <script src="/chatbox.js" api-key="f02f0f92-d5d6-47b0-89bc-dbbbf273071f" async></script> */}
        <Script id="fb-init" strategy="afterInteractive">
          {`
            window.fbAsyncInit = function() {
              FB.init({
                appId      : '1343035583642889', // Replace with your Facebook App ID
                cookie     : true,
                xfbml      : true,
                version    : 'v22.0'
              });
            };
          `}
        </Script>
      </body>
    </html>
  );
}
