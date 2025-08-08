"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import edjsHTML from "editorjs-html";
import { api_url, img_url } from "@/utils/apiCall";
import Header from "@/components/header/page";
import CallbackForm from "@/components/newsletters/page";
import Footer from "@/components/footer/page";
import AdBox1 from "@/components/adBox/adBox1";
import AdBox2 from "@/components/adBox/adBox2";
import Breadcrumb from "@/components/breadcrumb/breadcrumb";

// Helper function to escape HTML in code blocks
const escapeHTML = (str: string) =>
  str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

// Editor.js parser with improved UI/UX rendering
const edjsParser = edjsHTML({
  paragraph: (block: any) => {
    return `<p class="text-lg leading-relaxed text-gray-800 mb-4">${block.data.text}</p>`;
  },

  header: (block: any) => {
    const level = block.data.level || 1;
    return `<h${level} class="text-${level + 2}xl font-bold text-gray-900 mb-4">${block.data.text}</h${level}>`;
  },

  list: (block: any) => {
    const tag = block.data.style === "ordered" ? "ol" : "ul";
    const items = block.data.items
      .map((item: any) => {
        const text = typeof item === "string" ? item : item?.content || "";
        return `<li class="mb-2 text-gray-700">${text}</li>`;
      })
      .join("");
    return `<${tag} class="pl-6 space-y-1 list-${
      tag === "ol" ? "decimal" : "disc"
    } mb-6">${items}</${tag}>`;
  },

  checklist: (block: any) => {
    return `<div class="space-y-3 mb-6">
      ${block.data.items
        .map((item: any) => {
          const checked = item.checked || item.meta?.checked;
          return `
            <label class="flex items-center space-x-2">
              <input type="checkbox" class="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded" disabled ${
                checked ? "checked" : ""
              } />
              <span class="${checked ? "line-through text-gray-500" : "text-gray-800"}">${item.text || item.content}</span>
            </label>
          `;
        })
        .join("")}
    </div>`;
  },

  image: (block: any) => {
    return `<div class="my-6"><img class="max-w-full rounded-xl shadow-md" src="${block.data.file.url}" alt="${
      block.data.caption || "Image"
    }" /></div>`;
  },

  quote: (block: any) => {
    return `<blockquote class="border-l-4 pl-4 italic text-gray-600 border-blue-300 mb-6">${block.data.text}</blockquote>`;
  },

  code: (block: any) => {
    return `
      <pre class="bg-gray-900 text-gray-100 text-sm p-4 rounded-lg overflow-x-auto whitespace-pre-wrap leading-relaxed font-mono mb-6">
        <code>${escapeHTML(block.data.code)}</code>
      </pre>
    `;
  },

  table: (block: any) => {
    const { content } = block.data;
    const rows = content
      .map((row: any[], rowIndex: number) => {
        const cells = row
          .map((cell: string) => {
            const tag = rowIndex === 0 ? "th" : "td";
            return `<${tag} class="border px-4 py-2 text-left">${cell}</${tag}>`;
          })
          .join("");
        return `<tr>${cells}</tr>`;
      })
      .join("");
    return `<div class="overflow-x-auto my-6"><table class="table-auto w-full border border-collapse border-gray-300">${rows}</table></div>`;
  },
});

const PageView = () => {
  const { slug } = useParams();
  const [pageData, setPageData] = useState<any>(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await axios.get(`${api_url}pages/by/slug/${slug}`);
        setPageData(res.data);
      } catch (err) {
        console.error("Error fetching page:", err);
      }
    };

    if (slug) fetchPage();
  }, [slug]);

  if (!pageData)
    return (
      <main className="max-w-8xl mx-auto px-6 py-12 sm:px-8 lg:px-16">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-300 rounded w-1/3" />
          <div className="h-6 bg-gray-200 rounded w-2/3" />
          <div className="h-4 bg-gray-100 rounded w-full" />
          <div className="h-4 bg-gray-100 rounded w-5/6" />
        </div>
      </main>
    );

  const parsedContent = edjsParser.parse(pageData.content);
  const htmlBlocks: string[] = Array.isArray(parsedContent)
    ? parsedContent
    : [parsedContent];

  const replaceImageURLs = (htmlContent: string) => {
    return htmlContent.replace(/src="\/uploads/g, `src="${img_url}uploads`);
  };

  return (
    <>
      <Header />
       <div className="px-10 pt-6">
  <Breadcrumb
    items={[
      { label: "Home", href: "/" },
      { label: pageData.title }  // wrap pageData.title in an object with key 'label'
    ]}
  />
</div>

 <section className="relative w-full py-12 px-4 sm:px-6 lg:px-8 border-t border-b border-gray-200 bg-gradient-to-br from-blue-50 via-white to-gray-100 overflow-hidden">
  {/* Background Image */}
  <div
    className="absolute inset-0 bg-cover bg-center opacity-20"
    style={{
      backgroundImage: `url('/image/12.avif')`, // Replace with your image path
    }}
  ></div>

  {/* Content */}
  <div className="relative z-10 max-w-screen-2xl mx-auto text-center">
    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight tracking-tight">
      {pageData.title}
    </h1>
    <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto">
      {pageData.description}
    </p>
  </div>
</section>

      <div className="flex mx-auto px-7 py-5 justify-center gap-8">


      <main className="max-w-screen-2xl ml-[32px] px-4 sm:px-6 lg:px-8 pb-12">
     

        <section className="mt-12 animate-fadeIn">
          
          <div className="prose prose-lg sm:prose-xl lg:prose-2xl max-w-none text-gray-800 prose-headings:text-gray-900 prose-a:text-blue-600 hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-xl prose-blockquote:border-blue-300 prose-blockquote:italic">
            {htmlBlocks.map((html, i) => (
              <div
                key={i}
                dangerouslySetInnerHTML={{ __html: replaceImageURLs(html) }}
              />
            ))}
          </div>
          
          
        </section>
        
      </main>
       {/* Sidebar Ads outside of <main> */}
      <aside className="w-full lg:w-3/12 space-y-6 pl-[65px] pt-[52px]">
        <AdBox1 />
        <AdBox2 />
      </aside>
    </div>

      <CallbackForm />
      <Footer />
    </>
  );
};

export default PageView;
