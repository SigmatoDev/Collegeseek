import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/header/page";
import Footer from "@/components/footer/page";
import { api_url } from "@/utils/apiCall";
import CareerDetails, { CareerDetail } from "@/components/careers/careerDetails";

export const dynamic = "force-dynamic";

type Career = CareerDetail & { metaTitle?: string; metaDescription?: string; createdAt: string; };
type Props = { params: Promise<{ slug: string }> };
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.collegeseek.in";
const cleanText = (value: string) => value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

async function getCareer(slug: string): Promise<Career | null> {
  try {
    const response = await fetch(`${api_url}careers/by/slug?slug=${encodeURIComponent(slug)}`, { cache: "no-store" });
    if (!response.ok) return null;
    const data = await response.json();
    return data.data || null;
  } catch (error) { console.error("Failed to fetch career:", error); return null; }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const career = await getCareer(slug);
  if (!career) return { title: "Career Opportunity | CollegeSeek", description: "Explore career opportunities at CollegeSeek." };
  const title = career.metaTitle || `${career.title} | Careers at CollegeSeek`;
  const description = career.metaDescription || cleanText(career.description).slice(0, 160);
  const canonical = `${siteUrl}/careers/${career.slug}`;
  return { title, description, alternates: { canonical }, openGraph: { title, description, url: canonical, type: "website", siteName: "CollegeSeek" }, twitter: { card: "summary", title, description } };
}

export default async function CareerDetailPage({ params }: Props) {
  const { slug } = await params;
  const career = await getCareer(slug);
  if (!career) notFound();
  const jobPosting = { "@context": "https://schema.org", "@type": "JobPosting", title: career.title, description: cleanText(career.description), datePosted: career.createdAt, validThrough: new Date(career.applicationDeadline).toISOString(), employmentType: career.employmentType.toUpperCase().replace("-", "_"), jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: career.location } }, hiringOrganization: { "@type": "Organization", name: "CollegeSeek", sameAs: siteUrl } };
  return <>
    <Header />
    <CareerDetails career={career} />
    <Footer />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPosting).replace(/</g, "\\u003c") }} />
  </>;
}
