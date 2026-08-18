import type { Metadata } from "next";
import Header from "@/components/header/page";
import Footer from "@/components/footer/page";
import { api_url } from "@/utils/apiCall";
import CareersList, { PublicCareer } from "@/components/careers/careersList";
import Breadcrumb from "@/components/breadcrumb/breadcrumb";

export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.collegeseek.in";

export const metadata: Metadata = {
  title: "Careers | CollegeSeek",
  description: "Explore current career opportunities at CollegeSeek.",
  alternates: { canonical: `${siteUrl}/careers` },
  openGraph: { title: "Careers | CollegeSeek", description: "Explore current career opportunities at CollegeSeek.", url: `${siteUrl}/careers`, type: "website" },
};

async function getCareers(): Promise<{ careers: PublicCareer[]; error: boolean }> {
  try {
    const response = await fetch(`${api_url}careers`, { cache: "no-store" });
    if (!response.ok) return { careers: [], error: true };
    const data = await response.json();
    return { careers: Array.isArray(data.data) ? data.data : [], error: false };
  } catch (error) {
    console.error("Failed to fetch careers:", error);
    return { careers: [], error: true };
  }
}

export default async function CareersPage() {
  const { careers, error } = await getCareers();
  return <>
    <Header />
    <div className="ml-4 mt-3 rounded-md px-6 py-3">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Careers" }]} />
    </div>
    <CareersList careers={careers} hasError={error} />
    <Footer />
  </>;
}
