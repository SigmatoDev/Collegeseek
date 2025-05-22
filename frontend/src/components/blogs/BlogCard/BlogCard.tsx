"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { api_url, img_url } from "@/utils/apiCall";
import DOMPurify from "dompurify";

interface BlogCardProps {
  _id: string;
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
      fetch(`${api_url}blog?slug=${slug}`)
        .then(async (res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          if (data?.id) {
            setId(data.id);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [propId, slug]);

  const handleReadMore = () => {
    if (!slug) {
      alert("Error: Blog slug is missing.");
      return;
    }
    router.push(`/blogs/${slug}`);
  };

  // Sanitize the full content HTML
  const sanitizedContent = DOMPurify.sanitize(content);

  // Extract plain text from sanitized HTML for safe truncation
  const getPlainText = (html: string) => {
    if (typeof window === "undefined") return ""; // server-side safety
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  const plainTextContent = getPlainText(sanitizedContent);
  const previewText =
    plainTextContent.length > 100 ? plainTextContent.slice(0, 100) + "..." : plainTextContent;

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
          onError={() => {
            setImageSrc("/default-placeholder.png");
          }}
        />
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-900 truncate">{title}</h3>

        {/* Display plain text preview safely */}
        <p className="text-gray-600 text-sm mt-3">{previewText}</p>

        {loading ? (
          <p className="mt-4 text-gray-500 text-sm">Loading...</p>
        ) : (
          <button
            onClick={handleReadMore}
            className="mt-4 inline-block text-[#D25C40] font-semibold text-sm hover:underline"
          >
            Read More →
          </button>
        )}
      </div>
    </div>
  );
}
