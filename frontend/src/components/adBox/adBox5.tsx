// 'use client';

// import Image from 'next/image';
// import { useEffect, useState } from 'react';
// import { api_url, img_url } from '@/utils/apiCall';

// interface Ad {
//   _id: string;
//   src: string;
//   alt?: string;
//   link?: string;
// }

// const getRandomAds = (ads: Ad[], count: number) => {
//   const shuffled = [...ads].sort(() => 0.5 - Math.random());
//   return shuffled.slice(0, count);
// };

// const AdBanner = () => {
//   const [ads, setAds] = useState<Ad[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchAds = async () => {
//       setLoading(true);
//       setError('');
//       try {
//         const res = await fetch(`${api_url}get/ads5`);
//         if (!res.ok) throw new Error(`Failed to fetch ads: ${res.statusText}`);
//         const data: Ad[] = await res.json();

//         if (!Array.isArray(data)) throw new Error('Invalid data received from ads API');

//         const randomAds = getRandomAds(data, 3);
//         setAds(randomAds);
//       } catch (err: any) {
//         setError(err.message || 'Something went wrong');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAds();
//   }, []);

//   if (loading) return <p className="px-4 text-center">Loading ads...</p>;
//   if (error) return <p className="p-4 text-center text-red-600">Error: {error}</p>;
//   if (ads.length === 0) return <p className="p-4 text-center">No ads available.</p>;

//   return (
//     <div className="flex flex-wrap gap-4 justify-center">
//       {ads.map((ad) => {
//         const imageUrl = ad.src.startsWith('http')
//           ? ad.src
//           : `${img_url.replace(/\/$/, '')}/${ad.src.replace(/^\//, '')}`;

//         return (
//           <div
//             key={ad._id}
//             className="min-w-[45%] sm:min-w-[47%] md:min-w-[30%] lg:min-w-[30%] h-[120px] bg-gray-100 rounded-lg shadow p-2 flex items-center justify-center flex-1"
//           >
//             {ad.link ? (
//               <a
//                 href={ad.link}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="w-full h-full block"
//               >
//                 <Image
//                   src={imageUrl}
//                   alt={ad.alt || 'Ad Image'}
//                   width={380}
//                   height={120}
//                   className="w-full h-full object-cover rounded"
//                   unoptimized={true}
//                 />
//               </a>
//             ) : (
//               <Image
//                 src={imageUrl}
//                 alt={ad.alt || 'Ad Image'}
//                 width={380}
//                 height={120}
//                 className="w-full h-full object-cover rounded"
//                 unoptimized={true}
//               />
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default AdBanner;

'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
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
  const [activeIdx, setActiveIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const autoSlideRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const fetchAds = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${api_url}get/ads5`);
        if (!res.ok) throw new Error(`Failed to fetch ads: ${res.statusText}`);
        const data: Ad[] = await res.json();
        if (!Array.isArray(data)) throw new Error('Invalid data received from ads API');
        setAds(data);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, []);

  // ── Auto-slide every 3s on mobile ──
  useEffect(() => {
    if (ads.length <= 1) return;

    const startAutoSlide = () => {
      autoSlideRef.current = setInterval(() => {
        setActiveIdx((prev) => {
          const next = (prev + 1) % ads.length;
          const container = scrollRef.current;
          if (container) {
            container.scrollTo({ left: container.offsetWidth * next, behavior: 'smooth' });
          }
          return next;
        });
      }, 3000);
    };

    startAutoSlide();
    return () => { if (autoSlideRef.current) clearInterval(autoSlideRef.current); };
  }, [ads.length]);

  // Pause auto-slide on user swipe, resume after 5s
  const onScroll = () => {
    const container = scrollRef.current;
    if (!container) return;
    const index = Math.round(container.scrollLeft / container.offsetWidth);
    setActiveIdx(index);

    // Pause then restart auto-slide
    if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    autoSlideRef.current = setInterval(() => {
      setActiveIdx((prev) => {
        const next = (prev + 1) % ads.length;
        const c = scrollRef.current;
        if (c) c.scrollTo({ left: c.offsetWidth * next, behavior: 'smooth' });
        return next;
      });
    }, 3000);
  };

  // Dot tap
  const goTo = (index: number) => {
    const container = scrollRef.current;
    if (!container) return;
    container.scrollTo({ left: container.offsetWidth * index, behavior: 'smooth' });
    setActiveIdx(index);

    // Reset auto-slide timer
    if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    autoSlideRef.current = setInterval(() => {
      setActiveIdx((prev) => {
        const next = (prev + 1) % ads.length;
        const c = scrollRef.current;
        if (c) c.scrollTo({ left: c.offsetWidth * next, behavior: 'smooth' });
        return next;
      });
    }, 3000);
  };

  if (loading) return <p className="px-4 text-center text-sm text-gray-500">Loading ads...</p>;
  if (error) return <p className="p-4 text-center text-sm text-red-600">Error: {error}</p>;
  if (ads.length === 0) return <p className="p-4 text-center text-sm text-gray-400">No ads available.</p>;

  const getImageUrl = (ad: Ad) =>
    ad.src.startsWith('http')
      ? ad.src
      : `${img_url.replace(/\/$/, '')}/${ad.src.replace(/^\//, '')}`;

  const imgEl = (ad: Ad) => (
    <Image
      src={getImageUrl(ad)}
      alt={ad.alt || 'Ad Image'}
      width={380}
      height={120}
      className="w-full h-full object-cover rounded"
      unoptimized={true}
    />
  );

  return (
    <>
      {/* ══════════════════════════════════════════
          MOBILE: auto-sliding + swipeable + dots
      ══════════════════════════════════════════ */}
      <div className="sm:hidden">
        <div
          ref={scrollRef}
          onScroll={onScroll}
          className="flex overflow-x-auto snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none' }}
        >
          {ads.map((ad) => (
            <div
              key={ad._id}
              className="flex-shrink-0 w-full snap-start h-[100px] bg-gray-100 rounded-lg shadow p-1"
            >
              {ad.link ? (
                <a href={ad.link} target="_blank" rel="noopener noreferrer" className="w-full h-full block">
                  {imgEl(ad)}
                </a>
              ) : imgEl(ad)}
            </div>
          ))}
        </div>

        {/* Dot pagination */}
        <div className="flex justify-center items-center gap-1.5 mt-2">
          {ads.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                activeIdx === i ? 'w-4 h-1.5 bg-gray-500' : 'w-1.5 h-1.5 bg-gray-300'
              }`}
              aria-label={`Ad ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          DESKTOP: original 3-card grid — unchanged
      ══════════════════════════════════════════ */}
      <div className="hidden sm:flex flex-wrap justify-center gap-4">
        {getRandomAds(ads, 3).map((ad) => (
          <div
            key={ad._id}
            className="min-w-[47%] md:min-w-[30%] lg:min-w-[30%] h-[120px] bg-gray-100 rounded-lg shadow p-2 flex items-center justify-center flex-1"
          >
            {ad.link ? (
              <a href={ad.link} target="_blank" rel="noopener noreferrer" className="w-full h-full block">
                {imgEl(ad)}
              </a>
            ) : imgEl(ad)}
          </div>
        ))}
      </div>
    </>
  );
};

export default AdBanner;