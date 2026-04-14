import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { api_url } from "@/utils/apiCall";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 🔥 Fetch settings from backend
async function getSettings() {
  try {
    const res = await fetch(`${api_url}/settings`, {
      cache: "no-store",
    });

    if (!res.ok) return null;

    return res.json();
  } catch (err) {
    console.error("Settings fetch error:", err);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();

  return {
    title: settings?.siteName || "Collegeseek",
    description: settings?.siteName || "Collegeseek",

    icons: {
      icon: settings?.favicon || "/favicon.ico",
    },

    openGraph: {
      title: settings?.siteName || "Collegeseek",
      images: settings?.siteLogo ? [settings.siteLogo] : [],
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black`}
      >
        {children}
      </body>
    </html>
  );
}