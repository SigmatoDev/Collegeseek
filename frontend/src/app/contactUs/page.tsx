import { api_url } from "@/utils/apiCall";
import ContactPage from "./contactClient";

export const dynamic = "force-dynamic";

// ✅ Server-side metadata
export async function generateMetadata() {
  try {
    const res = await fetch(`${api_url}Contactget/meta?page=contact`, {
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


// ✅ Server component rendering the client component
export default function Contact() {
  return <ContactPage />;
}
