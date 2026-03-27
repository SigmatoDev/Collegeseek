// "use client";

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { api_url, img_url } from "@/utils/apiCall";
// import Image from "next/image";
// import DOMPurify from "dompurify";
// import Head from "next/head";

// interface Blog {
//   _id: string;
//   title: string;
//   content: string;
//   image: string;
//   author: string;
//   createdAt: string;
// }

// interface BlogDetailsProps {
//   slug: string;
// }

// const BlogDetails: React.FC<BlogDetailsProps> = ({ slug }) => {
//   const [blog, setBlog] = useState<Blog | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!slug) {
//       console.error("❌ Invalid slug");
//       setError("Invalid blog slug.");
//       setLoading(false);
//       return;
//     }

//     const fetchBlogBySlug = async () => {
//       try {
//         const response = await axios.get(`${api_url}blog/by/slug?slug=${slug}`);
//         // console.log("API Response:", response.data);

//         if (response.data) {
//           setBlog(response.data);
//         } else {
//           console.warn("No blog returned from API");
//           setError("Blog not found.");
//         }
//       } catch (err) {
//         console.error("Error fetching blog:", err);
//         setError("An error occurred while fetching the blog.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBlogBySlug();
//   }, [slug]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center py-12">
//         <div className="w-16 h-16 border-4 border-gradient-to-r from-blue-400 via-purple-500 to-pink-500 border-t-transparent border-solid rounded-full animate-spin"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="max-w-7xl mx-auto py-12 px-6 text-center text-red-500">
//         <p className="text-lg font-semibold">{error}</p>
//         <button
//           onClick={() => window.location.reload()}
//           className="mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-full hover:from-blue-600 hover:to-indigo-700 transition duration-300"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   if (!blog) {
//     return (
//       <div className="max-w-6xl mx-auto py-12 px-6 text-center text-gray-500">
//         <p className="text-lg">Blog not found or failed to load content.</p>
//       </div>
//     );
//   }

//   const sanitizedContent = DOMPurify.sanitize(blog.content);
//   const plainTextDescription = blog.content.replace(/<[^>]+>/g, "").slice(0, 150) + "...";
//   const blogImage = blog.image
//     ? `${img_url}${blog.image.replace(/^\/uploads\//, "uploads/")}`
//     : "/uploads/default-placeholder.png";

//   return (
//     <>
//       <Head>
//         <title>{blog.title} | My Blog</title>
//         <meta name="description" content={plainTextDescription} />
//         <meta property="og:title" content={blog.title} />
//         <meta property="og:description" content={plainTextDescription} />
//         <meta property="og:image" content={blogImage} />
//         <meta property="og:type" content="article" />
//         <meta property="article:published_time" content={blog.createdAt} />
//         <meta name="author" content={blog.author} />
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//       </Head>

//       <div className="max-w-7xl mx-auto py-12 px-6 space-y-12">
//         <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
//           {blog.title}
//         </h1>
//         <p className="text-lg text-gray-600 mb-8">
//           By <span className="font-semibold text-gray-800">{blog.author}</span> |{" "}
//           {blog.createdAt
//             ? new Date(blog.createdAt).toLocaleDateString()
//             : "Date Unavailable"}
//         </p>

//         <div className="flex flex-col md:flex-row gap-12">
//           {/* Image Section */}
//           <div className="bg-gradient-to-r from-blue-50 via-yellow-50 to-blue-50 rounded-2xl p-6 md:w-1/3 justify-center">
//             <div className="relative w-full h-80 rounded-xl overflow-hidden">
//               <Image
//                 src={blogImage}
//                 alt={blog.title}
//                 fill
//                 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                 className="rounded-xl object-cover transform transition-all duration-300 hover:scale-105"
//               />
//             </div>
//           </div>

//           {/* Content Section */}
//           <div className="w-full md:w-2/3">
//             <div
//               className="rich-content"
//               dangerouslySetInnerHTML={{ __html: sanitizedContent }}
//             />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default BlogDetails;
"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { api_url, img_url } from "@/utils/apiCall";
import Image from "next/image";
import DOMPurify from "dompurify";
import Head from "next/head";
import AdBox1 from "@/components/adBox/adBox1";
import AdBox2 from "@/components/adBox/adBox2";
import Breadcrumb from "@/components/breadcrumb/breadcrumb";

interface Blog {
  _id: string;
  title: string;
  content: string;
  image: string;
  author: string;
  createdAt: string;
}

interface BlogDetailsProps {
  slug: string;
}

const BlogDetails: React.FC<BlogDetailsProps> = ({ slug }) => {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError("Invalid blog slug.");
      setLoading(false);
      return;
    }

    const fetchBlogBySlug = async () => {
      try {
        const response = await axios.get(`${api_url}blog/by/slug?slug=${slug}`);
        if (response.data) {
          setBlog(response.data);
        } else {
          setError("Blog not found.");
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError("An error occurred while fetching the blog.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogBySlug();
  }, [slug]);

  // ── SKELETON ──
  if (loading) {
    return (
      <>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800;9..40,900&display=swap');`}</style>
        <div className="font-['DM_Sans'] bg-[#f9f9f7] min-h-screen">
          {/* Hero skeleton */}
          <div className="bg-[#111] px-5 sm:px-12 pt-14 pb-12 space-y-5">
            <div className="h-3 bg-white/10 rounded animate-pulse w-24 mx-auto" />
            <div className="h-10 bg-white/10 rounded animate-pulse max-w-xl mx-auto" />
            <div className="h-10 bg-white/10 rounded animate-pulse max-w-md mx-auto" />
            <div className="h-4 bg-white/5 rounded animate-pulse max-w-xs mx-auto" />
          </div>
          {/* Body skeleton */}
          <div className="max-w-5xl mx-auto px-5 sm:px-8 py-12 space-y-4">
            <div className="h-72 bg-gray-200 rounded-xl animate-pulse w-full" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6" />
          </div>
        </div>
      </>
    );
  }

  // ── ERROR ──
  if (error) {
    return (
      <div className="font-['DM_Sans'] min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-5">
          <svg className="w-7 h-7 text-[#c8102e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 3a9 9 0 110 18A9 9 0 0112 3z" />
          </svg>
        </div>
        <p className="text-lg font-semibold text-gray-800 mb-2">{error}</p>
        <p className="text-gray-500 text-sm mb-6">Please check your connection and try again.</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-[#c8102e] text-white px-7 py-2.5 rounded-full text-sm font-semibold hover:bg-[#a50d26] transition-colors duration-200"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="font-['DM_Sans'] min-h-[60vh] flex items-center justify-center text-gray-500 text-lg">
        Blog not found.
      </div>
    );
  }

  const sanitizedContent =
    typeof window !== "undefined" ? DOMPurify.sanitize(blog.content) : blog.content;

  const plainTextDescription =
    blog.content.replace(/<[^>]+>/g, "").slice(0, 150) + "...";

  const blogImage = blog.image
    ? `${img_url}${blog.image.replace(/^\/uploads\//, "uploads/")}`
    : "/uploads/default-placeholder.png";

  const formattedDate = blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Date Unavailable";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800;9..40,900&display=swap');

        .bd-root { font-family: 'DM Sans', sans-serif; }

        /* Hero glow */
        .bd-hero::before {
          content: '';
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 55% 70% at 10% 70%, rgba(180,90,75,0.25) 0%, transparent 65%),
            radial-gradient(ellipse 40% 50% at 90% 20%, rgba(60,45,105,0.4) 0%, transparent 60%);
        }
        /* Seamless blend into image below */
        .bd-hero::after {
          content: '';
          position: absolute; bottom: 0; left: 0; right: 0;
          height: 48px; pointer-events: none;
          background: linear-gradient(to bottom, transparent, #2d2d5a);
        }

        /* Fade in */
        @keyframes bdFade {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .bd-fade-1 { animation: bdFade 0.6s ease both; }
        .bd-fade-2 { animation: bdFade 0.6s 0.1s ease both; }
        .bd-fade-3 { animation: bdFade 0.6s 0.2s ease both; }

        /* ── RICH TEXT ARTICLE ── */
        .bd-article > * + * { margin-top: 1.25rem; }
        .bd-article > h1 {
          font-size: 2.2rem; font-weight: 800;
          color: #111; line-height: 1.15;
          letter-spacing: -0.03em;
          margin-top: 2.8rem; padding-top: 2.2rem;
          border-top: 2px solid #111;
        }
        .bd-article > h2 {
          font-size: 1.7rem; font-weight: 700;
          color: #111; line-height: 1.2;
          letter-spacing: -0.02em;
          margin-top: 2.4rem; padding-bottom: 10px;
          border-bottom: 1.5px solid #e3e3de;
        }
        .bd-article > h3 {
          font-size: 1.05rem; font-weight: 600;
          color: #3d3d3d;
          text-transform: uppercase; letter-spacing: 0.09em;
          margin-top: 1.8rem;
        }
        .bd-article > h4 {
          font-size: 1rem; font-weight: 600;
          color: #3d3d3d; margin-top: 1.4rem;
        }
        .bd-article > p {
          font-size: 1.05rem; line-height: 1.88; color: #2e2e2e;
        }
        .bd-article > p:first-of-type::first-letter {
          font-size: 4rem; font-weight: 900;
          float: left; line-height: 0.78;
          margin: 8px 12px 0 0;
          color: #c8102e;
        }
        .bd-article a {
          color: #c8102e;
          text-decoration: underline;
          text-decoration-color: rgba(200,16,46,0.3);
          text-underline-offset: 3px;
          transition: text-decoration-color 0.2s;
        }
        .bd-article a:hover { text-decoration-color: #c8102e; }
        .bd-article strong { font-weight: 600; color: #111; }
        .bd-article em { font-style: italic; }

        .bd-article ul { list-style: none; padding: 0; margin: 1.4rem 0; }
        .bd-article ul li {
          position: relative; padding: 7px 0 7px 24px;
          border-bottom: 1px solid #e3e3de;
          font-size: 1rem; color: #333; line-height: 1.6;
        }
        .bd-article ul li::before {
          content: '▸'; position: absolute;
          left: 0; top: 9px;
          color: #c8102e; font-size: 0.68rem;
        }
        .bd-article ol {
          list-style: none; padding: 0;
          counter-reset: bdcnt; margin: 1.4rem 0;
        }
        .bd-article ol li {
          counter-increment: bdcnt;
          position: relative; padding: 7px 0 7px 36px;
          border-bottom: 1px solid #e3e3de;
          font-size: 1rem; color: #333; line-height: 1.6;
        }
        .bd-article ol li::before {
          content: counter(bdcnt);
          position: absolute; left: 0; top: 7px;
          font-weight: 700; font-size: 1rem; color: #c8102e;
        }
        .bd-article img {
          width: 100%; height: auto; display: block;
          border-radius: 8px;
          box-shadow: 0 6px 32px rgba(0,0,0,0.1);
          margin: 2rem 0;
        }
        .bd-article blockquote {
          margin: 2rem 0;
          padding: 20px 26px 20px 28px;
          background: #fff3f4;
          border-left: 4px solid #c8102e;
          font-style: italic; font-size: 1.15rem; font-weight: 500;
          color: #111; line-height: 1.65;
          border-radius: 0 6px 6px 0;
        }
        .bd-article table {
          width: 100%; border-collapse: collapse;
          margin: 2rem 0; font-size: 0.9rem;
          display: block; overflow-x: auto;
        }
        .bd-article table th {
          background: #111; color: #fff;
          padding: 10px 14px; text-align: left;
          font-size: 0.76rem; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase;
        }
        .bd-article table td {
          padding: 9px 14px;
          border-bottom: 1px solid #e3e3de; color: #333;
        }
        .bd-article table tr:hover td { background: #fff3f4; }
        .bd-article pre {
          background: #0d0d0d; color: #d4d4d4;
          padding: 20px 22px; border-radius: 6px;
          overflow-x: auto; font-size: 0.875rem;
          margin: 1.6rem 0;
          border-left: 3px solid #c8102e;
        }

        @media (max-width: 600px) {
          .bd-article > h1 { font-size: 1.7rem; }
          .bd-article > h2 { font-size: 1.35rem; }
          .bd-article > p:first-of-type::first-letter { font-size: 3.2rem; }
        }
      `}</style>

      <Head>
        <title>{blog.title} | Blog</title>
        <meta name="description" content={plainTextDescription} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={plainTextDescription} />
        <meta property="og:image" content={blogImage} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={blog.createdAt} />
        <meta name="author" content={blog.author} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="bd-root bd-fade-1 bg-[#f9f9f7] min-h-screen">

        {/* ── BREADCRUMB ── */}
        <div className="bg-[#f5f6f7] px-5 sm:px-12 py-3 flex items-center border-b border-white/10"
          style={{ fontFamily: "'DM Sans', sans-serif" }}>
          <style>{`.bd-crumb * { color: #2d2d5a !important; font-size: 11px !important; letter-spacing: 0.08em; text-transform: uppercase; font-family: 'DM Sans', sans-serif !important; } .bd-crumb a:hover { color: #1f6ab4 !important; }`}</style>
          <div className="bd-crumb">
            <Breadcrumb
              items={[
                { label: "Home", href: "/" },
                { label: "Blog", href: "/blog" },
                { label: blog.title },
              ]}
            />
          </div>
        </div>

        {/* ── HERO ── */}
        <section className="bd-hero relative bg-[#2d2d5a] overflow-hidden text-center px-5 sm:px-12 pt-14 sm:pt-20 pb-10 sm:pb-12">
          {/* Eyebrow */}
          <div className="relative z-10 inline-flex items-center gap-3 text-[10px] font-semibold tracking-[0.22em] uppercase text-[#faf9f9] mb-5">
            <span className="block w-8 h-px bg-[#faf9f9]" />
            Blog
            <span className="block w-8 h-px bg-[#faf9f9]" />
          </div>

          {/* Title */}
          <h1 className="relative z-10 text-white font-extrabold leading-[1.1] tracking-[-0.025em] max-w-3xl mx-auto mb-5 text-[clamp(1.8rem,4.5vw,3.4rem)]">
            {blog.title}
          </h1>

          {/* Meta */}
          <div className="relative z-10 inline-flex flex-wrap items-center justify-center gap-3 text-white/50 text-sm">
            {/* Author */}
            <span className="inline-flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-[#faf9f9]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 10a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 1114 0H3z" />
              </svg>
              <span className="text-white/80 font-medium">{blog.author}</span>
            </span>
            <span className="text-white/20">|</span>
            {/* Date */}
            <span className="inline-flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-[#faf9f9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formattedDate}
            </span>
          </div>

          {/* Accent bar */}
          <div className="relative z-10 w-12 h-[3px] bg-[#faf9f9] rounded-full mx-auto mt-8" />
        </section>

        {/* ── FEATURED IMAGE — full-width flush banner ── */}
        <div className="bd-fade-2 w-full relative h-56 sm:h-80 lg:h-[460px] overflow-hidden">
          <Image
            src={blogImage}
            alt={blog.title}
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/image/fallback-image.webp";
            }}
          />
          {/* gradient: dark at top (blends into hero) + dark at bottom (blends into paper) */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#2d2d5a]/70 via-transparent to-[#f9f9f7]/80" />

          {/* Floating read-time pill */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm text-[#111] text-xs font-semibold px-4 py-1.5 rounded-full shadow-lg tracking-wide uppercase">
            <svg className="w-3.5 h-3.5 text-[#c8102e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            5 min read
          </div>
        </div>

        {/* ── ARTICLE CONTENT ── */}
        {/* ── ARTICLE + SIDEBAR ── */}
        <div className="bd-fade-3 w-full px-5 sm:px-10 lg:px-16 py-12 sm:py-16 pb-20">
          <div className="flex flex-col lg:flex-row gap-10 items-start">

            {/* ── ARTICLE CONTENT ── */}
            <div className="w-full lg:flex-1 min-w-0">
              {/* Divider with label */}
              <div className="flex items-center gap-4 mb-10">
                <div className="flex-1 h-px bg-[#e3e3de]" />
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#8a8a8a]">Article</span>
                <div className="flex-1 h-px bg-[#e3e3de]" />
              </div>

              <article
                className="bd-article"
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
              />

              {/* Footer meta */}
              <div className="mt-16 pt-8 border-t border-[#e3e3de] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#c8102e]/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#c8102e]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 10a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 1114 0H3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-[#8a8a8a] uppercase tracking-widest font-semibold">Written by</p>
                    <p className="text-sm font-bold text-[#111]">{blog.author}</p>
                  </div>
                </div>
                <p className="text-xs text-[#8a8a8a]">Published {formattedDate}</p>
              </div>
            </div>

            {/* ── SIDEBAR ADS ── */}
            <aside className="w-full lg:w-[300px] flex flex-row lg:flex-col gap-4 lg:sticky lg:top-6">
              {/* Sidebar label */}
              <div className="hidden lg:flex items-center gap-2 text-[10px] font-bold tracking-[0.22em] uppercase text-[#8a8a8a] mb-1 pb-3 border-b border-[#e3e3de] w-full">
                Sponsored
                <span className="flex-1 h-px bg-[#e3e3de]" />
              </div>
              <div className="w-1/2 lg:w-full rounded-lg overflow-hidden shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200">
                <AdBox1 />
              </div>
              <div className="w-1/2 lg:w-full rounded-lg overflow-hidden shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200">
                <AdBox2 />
              </div>
            </aside>

          </div>
        </div>
      </div>
    </>
  );
};

export default BlogDetails;