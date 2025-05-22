'use client';

import { useEffect, useState } from "react";
import { api_url } from "@/utils/apiCall";
import Image from "next/image";
import toast from "react-hot-toast";

const AdBox1 = () => {
  const [ad, setAd] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch the advertisement data
  const fetchAd = async () => {
    try {
      const res = await fetch(`${api_url}ads`); // Your API URL to fetch ads
      const data = await res.json();

      if (res.ok && data.ads.length > 0) {
        setAd(data.ads[0]); // Assuming you're fetching the first ad
      } else {
        toast.error('No ads available');
      }
    } catch (err) {
      console.error("Failed to fetch ad:", err);
      toast.error('Failed to load ad');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAd();
  }, []);

  return (
    <div className="bg-gray-100 p-4 w-72 h-96 shadow-lg rounded-lg flex flex-col items-center">
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <>
          <p className="text-center font-semibold">Sponsored Ad</p>
          {ad?.image ? (
            // If link exists, wrap in anchor tag with target _blank, else just div
            ad.link ? (
              <a href={ad.link} target="_blank" rel="noopener noreferrer" className="mt-4 w-full h-full relative rounded-lg overflow-hidden block">
                <Image
                  src={`${api_url.replace(/api\/?$/, '')}${ad.image.replace(/\\/g, '/')}`}
                  alt="Advertisement 1"
                  fill
                  className="rounded-lg object-cover"
                />
              </a>
            ) : (
              <div className="mt-4 w-full h-full relative rounded-lg overflow-hidden">
                <Image
                  src={`${api_url.replace(/api\/?$/, '')}${ad.image.replace(/\\/g, '/')}`}
                  alt="Advertisement 1"
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
            )
          ) : (
            <p className="text-center mt-4">No image available</p>
          )}
        </>
      )}
    </div>
  );
};

export default AdBox1;
