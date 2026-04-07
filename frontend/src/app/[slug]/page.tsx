// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import axios from "axios";
// import edjsHTML from "editorjs-html";
// import { api_url, img_url } from "@/utils/apiCall";
// import Header from "@/components/header/page";
// import CallbackForm from "@/components/newsletters/page";
// import Footer from "@/components/footer/page";
// import AdBox1 from "@/components/adBox/adBox1";
// import AdBox2 from "@/components/adBox/adBox2";
// import Breadcrumb from "@/components/breadcrumb/breadcrumb";

// // Helper function to escape HTML in code blocks
// const escapeHTML = (str: string) =>
//   str
//     .replace(/&/g, "&amp;")
//     .replace(/</g, "&lt;")
//     .replace(/>/g, "&gt;")
//     .replace(/"/g, "&quot;")
//     .replace(/'/g, "&#039;");

// // Editor.js parser with improved UI/UX rendering
// const edjsParser = edjsHTML({
//   paragraph: (block: any) => {
//     return `<p class="text-lg leading-relaxed text-gray-800 mb-4">${block.data.text}</p>`;
//   },

//   header: (block: any) => {
//     const level = block.data.level || 1;
//     return `<h${level} class="text-${level + 2}xl font-bold text-gray-900 mb-4">${block.data.text}</h${level}>`;
//   },

//   list: (block: any) => {
//     const tag = block.data.style === "ordered" ? "ol" : "ul";
//     const items = block.data.items
//       .map((item: any) => {
//         const text = typeof item === "string" ? item : item?.content || "";
//         return `<li class="mb-2 text-gray-700">${text}</li>`;
//       })
//       .join("");
//     return `<${tag} class="pl-6 space-y-1 list-${
//       tag === "ol" ? "decimal" : "disc"
//     } mb-6">${items}</${tag}>`;
//   },

//   checklist: (block: any) => {
//     return `<div class="space-y-3 mb-6">
//       ${block.data.items
//         .map((item: any) => {
//           const checked = item.checked || item.meta?.checked;
//           return `
//             <label class="flex items-center space-x-2">
//               <input type="checkbox" class="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded" disabled ${
//                 checked ? "checked" : ""
//               } />
//               <span class="${checked ? "line-through text-gray-500" : "text-gray-800"}">${item.text || item.content}</span>
//             </label>
//           `;
//         })
//         .join("")}
//     </div>`;
//   },

//   image: (block: any) => {
//     return `<div class="my-6"><img class="max-w-full rounded-xl shadow-md" src="${block.data.file.url}" alt="${
//       block.data.caption || "Image"
//     }" /></div>`;
//   },

//   quote: (block: any) => {
//     return `<blockquote class="border-l-4 pl-4 italic text-gray-600 border-blue-300 mb-6">${block.data.text}</blockquote>`;
//   },

//   code: (block: any) => {
//     return `
//       <pre class="bg-gray-900 text-gray-100 text-sm p-4 rounded-lg overflow-x-auto whitespace-pre-wrap leading-relaxed font-mono mb-6">
//         <code>${escapeHTML(block.data.code)}</code>
//       </pre>
//     `;
//   },

//   table: (block: any) => {
//     const { content } = block.data;
//     const rows = content
//       .map((row: any[], rowIndex: number) => {
//         const cells = row
//           .map((cell: string) => {
//             const tag = rowIndex === 0 ? "th" : "td";
//             return `<${tag} class="border px-4 py-2 text-left">${cell}</${tag}>`;
//           })
//           .join("");
//         return `<tr>${cells}</tr>`;
//       })
//       .join("");
//     return `<div class="overflow-x-auto my-6"><table class="table-auto w-full border border-collapse border-gray-300">${rows}</table></div>`;
//   },
// });

// const PageView = () => {
//   const { slug } = useParams();
//   const [pageData, setPageData] = useState<any>(null);

//   useEffect(() => {
//     const fetchPage = async () => {
//       try {
//         const res = await axios.get(`${api_url}pages/by/slug/${slug}`);
//         setPageData(res.data);
//       } catch (err) {
//         console.error("Error fetching page:", err);
//       }
//     };

//     if (slug) fetchPage();
//   }, [slug]);

//   if (!pageData)
//     return (
//       <main className="max-w-8xl mx-auto px-6 py-12 sm:px-8 lg:px-16">
//         <div className="animate-pulse space-y-4">
//           <div className="h-10 bg-gray-300 rounded w-1/3" />
//           <div className="h-6 bg-gray-200 rounded w-2/3" />
//           <div className="h-4 bg-gray-100 rounded w-full" />
//           <div className="h-4 bg-gray-100 rounded w-5/6" />
//         </div>
//       </main>
//     );

//   const parsedContent = edjsParser.parse(pageData.content);
//   const htmlBlocks: string[] = Array.isArray(parsedContent)
//     ? parsedContent
//     : [parsedContent];

//   const replaceImageURLs = (htmlContent: string) => {
//     return htmlContent.replace(/src="\/uploads/g, `src="${img_url}uploads`);
//   };

//   return (
//     <>
//       <Header />
//        <div className="px-10 pt-6 bg-gradient-to-br from-gray-50 via-white to-gray-100">
//   <Breadcrumb
//     items={[
//       { label: "Home", href: "/" },
//       { label: pageData.title }  // wrap pageData.title in an object with key 'label'
//     ]}
//   />
// </div>

//  <section className="relative w-full py-12 px-4 sm:px-6 lg:px-8 border-t border-b border-gray-200 bg-gradient-to-br from-blue-50 via-white to-gray-100 overflow-hidden">
//   {/* Background Image */}
//   <div
//     className="absolute inset-0 bg-cover bg-center opacity-20"
//     style={{
//       backgroundImage: `url('/image/12.avif')`, // Replace with your image path
//     }}
//   ></div>

//   {/* Content */}
//   <div className="relative z-10 max-w-screen-2xl mx-auto text-center">
//     <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight tracking-tight">
//       {pageData.title}
//     </h1>
//     <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto">
//       {pageData.description}
//     </p>
//   </div>
// </section>

//       <div className="flex mx-auto px-7 py-5 justify-center gap-8">


//       <main className="max-w-screen-2xl ml-[32px] px-4 sm:px-6 lg:px-8 pb-12">
     

//         <section className="mt-12 animate-fadeIn">
          
//           <div className="prose prose-lg sm:prose-xl lg:prose-2xl max-w-none text-gray-800 prose-headings:text-gray-900 prose-a:text-blue-600 hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-xl prose-blockquote:border-blue-300 prose-blockquote:italic">
//             {htmlBlocks.map((html, i) => (
//               <div
//                 key={i}
//                 dangerouslySetInnerHTML={{ __html: replaceImageURLs(html) }}
//               />
//             ))}
//           </div>
          
          
//         </section>
        
//       </main>
//        {/* Sidebar Ads outside of <main> */}
//       <aside className="w-full lg:w-3/12 space-y-6 pl-[65px] pt-[52px]">
//         <AdBox1 />
//         <AdBox2 />
//       </aside>
//     </div>

//       <CallbackForm />
//       <Footer />
//     </>
//   );
// };

// export default PageView;
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { api_url, img_url } from "@/utils/apiCall";
import Header from "@/components/header/page";
import CallbackForm from "@/components/newsletters/page";
import Footer from "@/components/footer/page";
import AdBox1 from "@/components/adBox/adBox1";
import AdBox2 from "@/components/adBox/adBox2";
import Breadcrumb from "@/components/breadcrumb/breadcrumb";

const PageView = () => {
  const { slug } = useParams();
  const [pageData, setPageData] = useState<any>(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await axios.get(`${api_url}pages/by/slug/${slug}`);
        setPageData(res.data);
      } catch (err) {
        console.error("❌ Error fetching page:", err);
      }
    };
    if (slug) fetchPage();
  }, [slug]);

  // ── SKELETON LOADER ──
  if (!pageData)
    return (
      <div className="font-sans">
        <Header />
        <div className="max-w-4xl mx-auto px-6 py-20 space-y-4">
          <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3" />
          <div className="h-12 bg-gray-200 rounded animate-pulse w-3/4" />
          <div className="h-5 bg-gray-100 rounded animate-pulse w-1/2" />
          <div className="pt-8 space-y-3">
            {[100, 90, 95, 85, 88, 70].map((w, i) => (
              <div
                key={i}
                className="h-4 bg-gray-100 rounded animate-pulse"
                style={{ width: `${w}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    );

  // ── FIX IMAGE URLS ──
  const fixedHTML = (pageData.content || pageData.contentHTML || "")
    .replace(/src="\/uploads/g, `src="${img_url}uploads`)
    .replace(
      /<img([^>]*)>/g,
      `<img$1 onerror="this.onerror=null;this.src='/image/fallback-image.webp';" />`
    );

  return (
    <>
      {/* DM Sans font + article prose overrides */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800;9..40,900&display=swap');

        .pv-root { font-family: 'DM Sans', sans-serif; }

        /* Hero radial glow */
        .pv-hero-glow::before {
          content: '';
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 55% 70% at 15% 60%, rgba(200,16,46,0.2) 0%, transparent 65%),
            radial-gradient(ellipse 45% 55% at 85% 25%, rgba(200,16,46,0.13) 0%, transparent 60%);
        }

        /* Breadcrumb text overrides */
        .pv-crumb * {
          color: #352e77 !important;
          font-size: 11px !important;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-family: 'DM Sans', sans-serif !important;
        }
        .pv-crumb a:hover { color: #fff !important; }

        /* Sidebar label rule */
        .pv-sidebar-label::after {
          content: ''; flex: 1; height: 1px; background: #e3e3de;
        }

        /* ── ARTICLE RICH TEXT ── */
        .pv-article > * + * { margin-top: 1.3rem; }

        .pv-article > h1 {
          font-family: 'DM Sans', sans-serif;
          font-size: 2.5rem; font-weight: 800;
          color: #111; line-height: 1.15;
          letter-spacing: -0.03em;
          margin-top: 3rem; padding-top: 2.4rem;
          border-top: 2px solid #111;
        }
        .pv-article > h2 {
          font-family: 'DM Sans', sans-serif;
          font-size: 1.85rem; font-weight: 700;
          color: #111; line-height: 1.2;
          letter-spacing: -0.02em;
          margin-top: 2.6rem; padding-bottom: 12px;
          border-bottom: 1.5px solid #e3e3de;
        }
        .pv-article > h3 {
          font-size: 1.05rem; font-weight: 600;
          color: #3d3d3d;
          text-transform: uppercase; letter-spacing: 0.09em;
          margin-top: 2rem;
        }
        .pv-article > h4 {
          font-size: 1rem; font-weight: 600;
          color: #3d3d3d; margin-top: 1.6rem;
        }
        .pv-article > p {
          font-size: 1.05rem; line-height: 1.88; color: #2e2e2e;
        }
        .pv-article > p:first-of-type::first-letter {
          font-family: 'DM Sans', sans-serif;
          font-size: 4.5rem; font-weight: 900;
          float: left; line-height: 0.75;
          margin: 10px 14px 0 0;
          color: #c8102e;
        }
        .pv-article a {
          color: #c8102e;
          text-decoration: underline;
          text-decoration-color: rgba(200,16,46,0.25);
          text-underline-offset: 3px;
          transition: text-decoration-color 0.2s;
        }
        .pv-article a:hover { text-decoration-color: #c8102e; }
        .pv-article strong { font-weight: 600; color: #111; }
        .pv-article em { font-style: italic; }

        .pv-article ul { list-style: none; padding: 0; margin: 1.5rem 0; }
        .pv-article ul li {
          position: relative; padding: 8px 0 8px 26px;
          border-bottom: 1px solid #e3e3de;
          font-size: 1rem; color: #333; line-height: 1.6;
        }
        .pv-article ul li::before {
          content: '▸'; position: absolute;
          left: 0; top: 10px;
          color: #c8102e; font-size: 0.7rem;
        }
        .pv-article ol {
          list-style: none; padding: 0;
          counter-reset: pvcnt; margin: 1.5rem 0;
        }
        .pv-article ol li {
          counter-increment: pvcnt;
          position: relative; padding: 8px 0 8px 38px;
          border-bottom: 1px solid #e3e3de;
          font-size: 1rem; color: #333; line-height: 1.6;
        }
        .pv-article ol li::before {
          content: counter(pvcnt);
          position: absolute; left: 0; top: 8px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 700; font-size: 1rem; color: #c8102e;
        }
        .pv-article img {
          width: 100%; height: auto; display: block;
          border-radius: 6px;
          box-shadow: 0 6px 32px rgba(0,0,0,0.1);
          margin: 2.2rem 0;
        }
        .pv-article blockquote {
          margin: 2.4rem 0;
          padding: 22px 28px 22px 32px;
          background: #fff3f4;
          border-left: 4px solid #c8102e;
          font-style: italic; font-size: 1.2rem; font-weight: 500;
          color: #111; line-height: 1.6;
          border-radius: 0 4px 4px 0;
        }
        .pv-article table {
          width: 100%; border-collapse: collapse;
          margin: 2rem 0; font-size: 0.9rem;
          display: block; overflow-x: auto;
        }
        .pv-article table th {
          background: #111; color: #fff;
          padding: 11px 16px; text-align: left;
          font-size: 0.78rem; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase;
        }
        .pv-article table td {
          padding: 10px 16px;
          border-bottom: 1px solid #e3e3de; color: #333;
        }
        .pv-article table tr:hover td { background: #fff3f4; }
        .pv-article pre {
          background: #0d0d0d; color: #d4d4d4;
          padding: 22px 24px; border-radius: 6px;
          overflow-x: auto; font-size: 0.875rem;
          margin: 1.8rem 0;
          border-left: 3px solid #c8102e;
        }

        /* Fade-in animations */
        @keyframes pvFade {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .pv-fade-1 { animation: pvFade 0.6s ease both; }
        .pv-fade-2 { animation: pvFade 0.6s 0.12s ease both; }
        .pv-fade-3 { animation: pvFade 0.6s 0.22s ease both; }

        @media (max-width: 600px) {
          .pv-article > h1 { font-size: 1.8rem; }
          .pv-article > h2 { font-size: 1.4rem; }
          .pv-article > p:first-of-type::first-letter { font-size: 3.5rem; }
        }
      `}</style>

      <div className="pv-root bg-[#f9f9f7] text-[#111] min-h-screen">
        <Header />

        {/* ── BREADCRUMB ── */}
        <div className="pv-crumb bg-[#f3f2f2] px-5 sm:px-11 py-[11px] flex items-center">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: pageData.title },
            ]}
          />
        </div>

        {/* ── HERO ── */}
        <section className="pv-hero-glow pv-fade-1 relative bg-[#111] overflow-hidden text-center px-5 sm:px-11 pt-16 sm:pt-20 pb-14 sm:pb-[68px]">
          {/* Eyebrow tag */}
          <div className="relative z-10 inline-flex items-center gap-3 text-[10.5px] font-semibold tracking-[0.22em] uppercase text-[#c8102e] mb-6">
            <span className="block w-9 h-px bg-[#c8102e]" />
            Article
            <span className="block w-9 h-px bg-[#c8102e]" />
          </div>

          {/* Title */}
          <h1 className="relative z-10 text-white font-extrabold leading-[1.1] tracking-[-0.025em] max-w-4xl mx-auto mb-6 text-[clamp(2rem,5.5vw,4rem)]">
            {pageData.title}
          </h1>

          {/* Description */}
          {pageData.description && (
            <p className="relative z-10 text-white/60 font-light leading-[1.75] max-w-xl mx-auto text-[clamp(0.9rem,1.6vw,1.1rem)]">
              {pageData.description}
            </p>
          )}

          {/* Accent bar */}
          <div className="relative z-10 w-14 h-[3px] bg-[#c8102e] rounded-full mx-auto mt-9" />
        </section>

        {/* ── BODY ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_296px] max-w-[1360px] mx-auto items-start">

          {/* ── MAIN CONTENT ── */}
          <main className="pv-fade-2 px-5 sm:px-11 lg:px-11 pt-12 sm:pt-16 pb-20 border-b lg:border-b-0 lg:border-r border-[#e3e3de] min-w-0">
            <article
              className="pv-article"
              dangerouslySetInnerHTML={{ __html: fixedHTML }}
            />
          </main>

          {/* ── SIDEBAR ── */}
          <aside className="pv-fade-3 bg-[#f3f3f0] px-3 py-8 lg:py-11 lg:sticky lg:top-0 lg:min-h-screen">
            {/* Label */}
            <div className="pv-sidebar-label flex items-center gap-2 text-[10px] font-bold tracking-[0.22em] uppercase text-[#8a8a8a] mb-5 pb-3 border-b border-[#e3e3de]">
              Sponsored
            </div>

            {/* Ad cards - side by side on tablet, stacked on desktop & mobile */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
              <div className="rounded-lg overflow-hidden shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200">
                <AdBox1 />
              </div>
              <div className="rounded-lg overflow-hidden shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200">
                <AdBox2 />
              </div>
            </div>
          </aside>
        </div>

        <CallbackForm />
        <Footer />
      </div>
    </>
  );
};

export default PageView;