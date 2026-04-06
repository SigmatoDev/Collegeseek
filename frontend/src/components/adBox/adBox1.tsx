"use client";

import { useEffect, useState } from "react";
import { api_url } from "@/utils/apiCall";
import Image from "next/image";
import toast from "react-hot-toast";

const FALLBACK_IMAGE = "/logo/logo1.png"; // fallback if no ad image

const AdBox1 = () => {
  const [ad, setAd] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch the advertisement data
  const fetchAd = async () => {
    try {
      const res = await fetch(`${api_url}ads`);
      const data = await res.json();

      if (res.ok && data.ads.length > 0) {
        setAd(data.ads[0]); // Take the first ad
      } else {
        toast.error("No ads available");
      }
    } catch (err) {
      console.error("Failed to fetch ad:", err);
      toast.error("Failed to load ad");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAd();
  }, []);

  // Resolve full image URL (S3 or local uploads)
  const getImageUrl = (image: string) => {
    if (!image) return FALLBACK_IMAGE;

    // If already a full URL (S3), return as is
    if (image.startsWith("http") || image.startsWith("https")) {
      return image;
    }

    // Else assume local upload path
    return `${api_url.replace(/api\/?$/, "")}${image.replace(/\\/g, "/")}`;
  };

  if (loading) {
    return (
      <div className="bg-gray-100 p-4 w-[300px] h-[400px] mx-[2px] mt-[1px] rounded-lg flex items-center justify-center">
        <p className="text-center">Loading...</p>
      </div>
    );
  }

  if (!ad) {
    return (
      <div className="bg-gray-100 p-4 w-[300px] h-[400px] mx-[2px] mt-[1px] rounded-lg flex items-center justify-center">
        <p className="text-center">No ad available</p>
      </div>
    );
  }

  const imageUrl = getImageUrl(ad.image);

  return (
    <div className="bg-gray-100 p-4 w-[300px] h-[400px] mx-[2px] mt-[1px] rounded-lg flex flex-col items-center">
      {ad.link ? (
        <a
          href={ad.link}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full h-full relative rounded-lg overflow-hidden block"
        >
          <Image
            src={imageUrl}
            alt={ad.description || "Advertisement"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
            className="rounded-lg object-cover"
          />
        </a>
      ) : (
        <div className="w-full h-full relative rounded-lg overflow-hidden">
          <Image
            src={imageUrl}
            alt={ad.description || "Advertisement"}
            fill
            className="rounded-lg object-cover"
          />
        </div>
      )}
    </div>
  );
};

export default AdBox1;