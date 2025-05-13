"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import edjsHTML from "editorjs-html";
import { api_url, img_url } from "@/utils/apiCall";

const edjsParser = edjsHTML({
  paragraph: (block: any) => {
    return `<p class="text-lg">${block.data.text}</p>`;
  },

  header: (block: any) => {
    const level = block.data.level || 1;
    return `<h${level} class="text-2xl font-bold">${block.data.text}</h${level}>`;
  },

  list: (block: any) => {
    const style = block.data.style;
    const items = block.data.items
      .map((item: any) => {
        const text = typeof item === "string" ? item : item.content;
        return `<li>${text}</li>`;
      })
      .join("");

    if (style === "unordered") {
      return `<ul class="list-disc list-inside pl-5">${items}</ul>`;
    } else if (style === "ordered") {
      return `<ol class="list-decimal list-inside pl-5">${items}</ol>`;
    } else {
      // Just in case something unexpected comes up
      return `<ul class="list-inside pl-5">${items}</ul>`;
    }
  },

checklist: (block: any) => {
  return `<div class="space-y-2">
    ${block.data.items
      .map((item: any) => {
        const checked = item.meta?.checked ? "checked" : "";
        return `
          <label class="flex items-center space-x-2">
            <input type="checkbox" class="form-checkbox h-5 w-5 text-blue-600" disabled ${checked} />
            <span class="${checked ? 'line-through text-gray-500' : ''}">${item.content}</span>
          </label>
        `;
      })
      .join("")}
  </div>`;
},


  image: (block: any) => {
    return `<img class="max-w-full" src="${block.data.file.url}" alt="${
      block.data.caption || "Image"
    }" />`;
  },

  quote: (block: any) => {
    return `<blockquote class="border-l-4 pl-4 italic text-gray-600">${block.data.text}</blockquote>`;
  },

  code: (block: any) => {
    return `<pre class="bg-gray-100 p-4 rounded overflow-x-auto"><code>${block.data.code}</code></pre>`;
  },

  table: (block: any) => {
    const { content } = block.data;
    const rows = content
      .map((row: any[]) => {
        const cells = row
          .map((cell: string) => `<td class="border px-4 py-2">${cell}</td>`)
          .join("");
        return `<tr>${cells}</tr>`;
      })
      .join("");
    return `<table class="table-auto w-full border border-collapse">${rows}</table>`;
  },
});

const PageView = () => {
  const { slug } = useParams(); // Get the page slug from the URL
  const [pageData, setPageData] = useState<any>(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await axios.get(`${api_url}pages/by/slug/${slug}`); // Fetch by slug
        console.log("Response from page created", res);
        setPageData(res.data);
      } catch (err) {
        console.error("Error fetching page:", err);
      }
    };

    if (slug) fetchPage();
  }, [slug]);

  if (!pageData) return <p>Loading...</p>;

  // Parse the content using edjsParser
  const parsedContent = edjsParser.parse(pageData.content);
  const htmlBlocks: string[] = Array.isArray(parsedContent)
    ? parsedContent
    : [parsedContent];

  // Function to replace relative image URLs with full URLs
  const replaceImageURLs = (htmlContent: string) => {
    return htmlContent.replace(/src="\/uploads/g, `src="${img_url}uploads`);
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold">{pageData.title}</h1>
      <p className="text-gray-600">{pageData.description}</p>

      <div className="prose max-w-none">
        {htmlBlocks.map((html, i) => (
          <div
            key={i}
            dangerouslySetInnerHTML={{
              __html: replaceImageURLs(html), // Replace the image URLs before rendering
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default PageView;
