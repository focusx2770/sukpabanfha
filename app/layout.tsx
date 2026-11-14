import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";

const kanit = Kanit({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["thai", "latin"],
  variable: "--font-kanit",
});

export const metadata: Metadata = {
  title: "ซักป่ะ? บ้านฟ้าปิยรมณ์ | บริการซัก-อบผ้า ส่งถึงหน้าบ้าน เริ่มต้น 40.-",
  description: "บริการซัก-อบแห้งสนิท ไม่ง้อแดด ส่งถึงหน้าบ้าน สำหรับชาวบ้านฟ้าปิยรมณ์ (ลำลูกกา คลอง 6) ทุกเฟส 1-17",
  icons: {
    icon: [
      { url: "/images/sukpa-logo.jpg" },
      { url: "/logo.png" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/images/sukpa-logo.jpg",
    apple: "/images/sukpa-logo.jpg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className={`${kanit.variable}`}>
      <body className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased selection:bg-sky-200 selection:text-sky-900">
        {children}
      </body>
    </html>
  );
}
