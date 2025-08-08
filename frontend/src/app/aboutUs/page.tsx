import { api_url } from "@/utils/apiCall";
import AboutClient from "./aboutClient";

// ✅ Optional: force dynamic rendering
export const dynamic = "force-dynamic";

// ✅ Server-side metadata function
export async function generateMetadata() {
  try {
    const res = await fetch(`${api_url}aboutget/meta?page=about`, {
      cache: "no-store",
    });
    const data = await res.json();

    return {
      title: data.title,
      description: data.description,
      keywords: data.keywords,
      openGraph: {
        title: data.ogTitle,
        description: data.ogDescription,
        url: data.ogUrl,
        siteName: data.ogSiteName,
        type: data.ogType,
      },
      twitter: {
        title: data.xTitle,
        description: data.xDescription,
      },
    };
  } catch (error) {
    console.error("❌ Meta fetch failed:", error);
    return {}; // Return empty object on failure
  }
}

// ✅ Export default server component
export default function AboutPage() {
  return <AboutClient />;
}
