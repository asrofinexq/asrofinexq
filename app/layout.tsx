// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Atau font sans-serif pilihan Anda
import "./globals.css";
import "./nexq.css";
import { InitialLoader } from "@/app/components/InitialLoader";
import LayoutChrome from "@/app/components/LayoutChrome";
import DevelopmentNoticePopup from "@/app/components/DevelopmentNoticePopup";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Full Stack Developer Portfolio",
  icons: {
    icon: "/asrofinexq-logo.png",
    shortcut: "/asrofinexq-logo.png",
    apple: "/asrofinexq-logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <InitialLoader />
        <DevelopmentNoticePopup />
        <LayoutChrome>{children}</LayoutChrome>
      </body>
    </html>
  );
}