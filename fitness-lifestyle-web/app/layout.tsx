
import type { Metadata } from "next";
import { Inter } from "next/font/google";
// @ts-ignore
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TrueForm - AI Fitness",
  description: "Hệ sinh thái thể chất thông minh",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="vi">
      <body className={`${inter.className} bg-[#0B0F19] text-white`}>
        {children}
      </body>
    </html>
  );
}