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
import TopStudyCities from "@/components/topCities/page";

// ✅ FIX: Force dynamic rendering
export const dynamic = "force-dynamic";

// ✅ Meta fetch using dynamic fetch
export async function generateMetadata() {
  try {
    const res = await fetch(`${api_url}get/meta?page=home`, {
      cache: "no-store", // causes dynamic fetch
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
    return {
      title: "collegeseek",
      description: "Best collegeseek platform for kids.",
    };
  }
}

// ✅ Page component
export default function HomePage() {
  return (
    <div className="bg-[#fffdff]">
      <Header />
      <HeroSection />
      <TrendingNow />
      <FeaturedColleges />
      <TopStudyCities />
      <CollegeAdmissions />
      <CategoryGrid />
      <BlogList />
      <CallbackForm />
      {/* <PopUp /> */}
      <Footer />
    </div>
  );
}
