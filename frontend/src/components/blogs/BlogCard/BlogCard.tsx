"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { api_url, img_url } from "@/utils/apiCall";
import DOMPurify from "dompurify"; // Import DOMPurify for sanitizing HTML content

interface BlogCardProps {
  _id: string; // Ensure ID is optional
  title: string;
  slug: string;
  image: string | null;
  content: string;
}

export default function BlogCard({ _id: propId, title, slug, image, content }: BlogCardProps) {
  const router = useRouter();
  const [id, setId] = useState<string | undefined>(propId);
  const [loading, setLoading] = useState(!propId);
  const [imageSrc, setImageSrc] = useState(
    image ? `${img_url}${image.replace(/^\/uploads\//, "uploads/")}` : "/default-placeholder.png"
  );

  // Fetch blog ID if not passed in as prop
  useEffect(() => {
    if (!propId) {
      fetch(`${api_url}blog?slug=${slug}`)  // Use slug here for fetching blog data
        .then(async (res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          console.log("API Response:", data); // Log the API response
          if (data?.id) {
            setId(data.id);  // Assuming your API response contains 'id'
          } else {
            console.error("❌ Error: API response missing 'id'.", data);
          }
        })
        .catch((error) => console.error("❌ Fetch error:", error))
        .finally(() => setLoading(false));
    }
  }, [propId, slug]);  // Dependency on propId and slug

  const handleReadMore = () => {
    console.log("slug", slug)
    if (!slug) {
      console.error("❌ Error: Blog slug is undefined");
      alert("Error: Blog slug is missing.");
      return;
    }
    // Navigate to blog detail page using slug (no need for ID)
    console.log("Navigating to blog detail page with slug:", slug); // Log navigation attempt
    router.push(`/blogs/${slug}`);
  };

  // Sanitize content using DOMPurify before rendering it
  const sanitizedContent = DOMPurify.sanitize(content);

  return (
    <div className="bg-white shadow-xl rounded-xl overflow-hidden transition-all hover:scale-105 hover:shadow-2xl h-[430px] flex flex-col">
      <div className="relative w-full h-56">
        <Image
          src={imageSrc}
          alt={title}
          layout="fill"
          objectFit="cover"
          className="rounded-t-xl"
          unoptimized={imageSrc.includes("unsplash.com")}
          onError={() => setImageSrc("/default-placeholder.png")}
        />
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-900 truncate">{title}</h3>
        
        {/* Render the sanitized content with dangerouslySetInnerHTML */}
        <div
          className="text-gray-600 text-sm mt-3"
          dangerouslySetInnerHTML={{
            __html: sanitizedContent.length > 100 ? `${sanitizedContent.slice(0, 100)}...` : sanitizedContent,
          }}
        />

        {loading ? (
          <p className="mt-4 text-gray-500 text-sm">Loading...</p>
        ) : (
          <button
            onClick={handleReadMore}
            className="mt-4 inline-block text-[#D25C40]  font-semibold text-sm hover:underline"
          >
            Read More → {/* Trigger navigation on click */}
          </button>
        )}
      </div>
    </div>
  );
}
