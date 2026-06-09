import type { Metadata } from "next";
import { api_url, img_url } from "@/utils/apiCall";
import CollegeDetails from "@/components/college/collegeDetails/collegeDetails";
import Footer from "@/components/footer/page";
import Header from "@/components/header/page";
import CallbackForm from "@/components/newsletters/page";

export const dynamic = "force-dynamic";

type CollegesPageProps = {
  params: Promise<{
    slug?: string;
  }>;
};

type CollegeMetaData = {
  name?: string;
  description?: string;
  about?: string;
  location?: string;
  city?: string;
  state?: string;
  image?: string;
  imageGallery?: string[];
  rank?: number;
  fees?: number;
  avgPackage?: number;
  slug?: string;
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.collegeseek.in";

const stripHtml = (value?: string) =>
  (value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const truncate = (value: string, maxLength: number) => {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 1).trim()}...`;
};

const absoluteUrl = (path: string) => {
  try {
    return new URL(path, siteUrl).toString();
  } catch {
    return siteUrl;
  }
};

const resolveImageUrl = (image?: string) => {
  if (!image) return absoluteUrl("/image/fallback-image.webp");
  if (/^https?:\/\//i.test(image)) return image;

  const cleanImage = image.replace(/^\/+/, "");
  const base = cleanImage.startsWith("uploads/")
    ? img_url || siteUrl
    : siteUrl;

  try {
    return new URL(cleanImage, base).toString();
  } catch {
    return absoluteUrl("/image/fallback-image.webp");
  }
};

const getCollegeBySlug = async (slug?: string): Promise<CollegeMetaData | null> => {
  if (!slug) return null;

  try {
    const res = await fetch(`${api_url}college/${encodeURIComponent(slug)}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data?.success ? data.data : null;
  } catch (error) {
    console.error("College metadata fetch failed:", error);
    return null;
  }
};

export async function generateMetadata({
  params,
}: CollegesPageProps): Promise<Metadata> {
  const { slug } = await params;
  const college = await getCollegeBySlug(slug);

  if (!college?.name) {
    return {
      title: "College Details | CollegeSeek",
      description: "Find college details, courses, fees, ranking, admission information, and placements on CollegeSeek.",
    };
  }

  const location = [college.city, college.state].filter(Boolean).join(", ") || college.location;
  const title = `${college.name} - Courses, Fees, Admission, Ranking | CollegeSeek`;
  const baseDescription =
    stripHtml(college.description) ||
    stripHtml(college.about) ||
    `Explore ${college.name}${location ? ` in ${location}` : ""}: courses, fees, admission details, ranking, placements, and more.`;
  const description = truncate(baseDescription, 160);
  const canonical = absoluteUrl(`/colleges/${college.slug || slug}`);
  const image = resolveImageUrl(college.image || college.imageGallery?.[0]);
  const keywords = [
    college.name,
    `${college.name} courses`,
    `${college.name} fees`,
    `${college.name} admission`,
    `${college.name} ranking`,
    location,
    college.city && `colleges in ${college.city}`,
    college.state && `colleges in ${college.state}`,
    "CollegeSeek",
  ].filter(Boolean) as string[];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "CollegeSeek",
      type: "website",
      images: [
        {
          url: image,
          alt: college.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

const CollegesPage = async ({ params }: CollegesPageProps) => {
  const { slug } = await params;

  if (!slug) {
    return <div className="text-center p-4">Invalid college slug.</div>;
  }

  return (
    <>
      <Header />
      <CollegeDetails />
      <CallbackForm />
      <Footer />
    </>
  );
};

export default CollegesPage;
