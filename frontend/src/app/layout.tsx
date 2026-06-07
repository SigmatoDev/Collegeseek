import type { Metadata } from "next";
import "./globals.css";
import Favicon from "@/components/favicon/Favicon";
import Script from "next/script";

export const metadata: Metadata = {
  title: "collegeseek",
  description: "collegeseek",

  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID!;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-white text-black">
        <Favicon />
        {children}
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
    window.dataLayer = window.dataLayer || [];

    function gtag(){
      dataLayer.push(arguments);
    }

    window.gtag = gtag;

    gtag('js', new Date());

    gtag('config', '${GA_ID}');
  `}
        </Script>
      </body>
    </html>
  );
}
