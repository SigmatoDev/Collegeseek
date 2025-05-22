'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { api_url, img_url } from '@/utils/apiCall';

interface Ad {
  _id: string;
  src: string;
  alt?: string;
  link?: string;
}

const getRandomAds = (ads: Ad[], count: number) => {
  const shuffled = [...ads].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const AdBanner = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAds = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${api_url}get/ads5`);
        if (!res.ok) throw new Error(`Failed to fetch ads: ${res.statusText}`);
        const data: Ad[] = await res.json();

        if (!Array.isArray(data)) throw new Error('Invalid data received from ads API');

        const randomAds = getRandomAds(data, 3);
        setAds(randomAds);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, []);

  if (loading) return <p className="px-4 text-center">Loading ads...</p>;
  if (error) return <p className="p-4 text-center text-red-600">Error: {error}</p>;
  if (ads.length === 0) return <p className="p-4 text-center">No ads available.</p>;

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-center">
      {ads.map((ad) => {
        const imageUrl = ad.src.startsWith('http') ? ad.src : `${img_url.replace(/\/$/, '')}/${ad.src.replace(/^\//, '')}`;
        return (
          <div
            key={ad._id}
            className="w-[397px] h-[120px] bg-gray-100 rounded-lg shadow p-2 flex items-center justify-center"
          >
            {ad.link ? (
              <a href={ad.link} target="_blank" rel="noopener noreferrer" className="w-full h-full block">
                <Image
                  src={imageUrl}
                  alt={ad.alt || 'Ad Image'}
                  width={380}
                  height={120}
                  className="w-full h-full object-cover rounded"
                  unoptimized={true}
                />
              </a>
            ) : (
              <Image
                src={imageUrl}
                alt={ad.alt || 'Ad Image'}
                width={380}
                height={120}
                className="w-full h-full object-cover rounded"
                unoptimized={true}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AdBanner;
