import Header from "@/components/header/page";
import Footer from "@/components/footer/page";
import HeroSection from "@/components/hero/page";
import TrendingNow from "@/components/trendingNow/trendingNow";
import CollegeAdmissions from "@/components/admissions/page";
import CategoryGrid from "@/components/categoryGrid/CategoryGrid";
import BlogList from "@/components/blogs/blogList/blogList";
import CallbackForm from "@/components/newsletters/page";
import PopUp from "@/components/popup/popUp";
import { api_url } from "@/utils/apiCall";
import FeaturedColleges from "@/components/featuredColleges/featuredColleges.tsx";

// ✅ Server-side meta generation
export async function generateMetadata() {
  try {
    const res = await fetch(`${api_url}get/meta?page=home`, {
      cache: "no-store", // Ensures fresh data
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
    return {}; // Return empty object if fetch fails
  }
}


// ✅ Main component — server component
export default function HomePage() {
  return (
    <div className="bg-[#fffdff]">
      <Header />
      <HeroSection />
      <TrendingNow />
      <FeaturedColleges />
      <CollegeAdmissions />
      <CategoryGrid />
      <BlogList />
      <CallbackForm />
      <PopUp />
      <Footer />
    </div>
  );
}
