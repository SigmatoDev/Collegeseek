// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import BlogCard from "../BlogCard/BlogCard";
// import { api_url } from "@/utils/apiCall";
// import AdBanner from "@/components/adBox/adBox5";

// export default function BlogAll() {
//   const [blogs, setBlogs] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchBlogs = async () => {
//       try {
//         const response = await axios.get(`${api_url}blog`);
//         setBlogs(response.data);
//       } catch (err: any) {
//         setError("Failed to fetch blogs. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBlogs();
//   }, []);

//   return (
//     <section className="container-1 mx-auto px-6 py-[70px] bg-blue-50">
//       <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-8 pb-[20px]">
//          Blog & News
//       </h2>
// {/* <AdBanner/> */}
//       {error && <p className="text-center text-red-500">{error}</p>}
//       {loading && (
//         <div className="flex justify-center items-center space-x-2">
//           <div className="w-7 h-7 border-5 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
//           <p className="text-center py-7 text-gray-600">Loading blogs...</p>
//         </div>
//       )}

//       {!loading && blogs.length === 0 && (
//         <p className="text-center text-gray-600">No blogs available.</p>
//       )}

//       {!loading && blogs.length > 0 && (
        
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mt-7">
//           {blogs.map((blog, index) => (
//             <BlogCard key={blog.id || index} {...blog} />
//           ))}
//         </div>
//       )}
//     </section>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import BlogCard from "../BlogCard/BlogCard";
import { api_url } from "@/utils/apiCall";
import AdBanner from "@/components/adBox/adBox5";

export default function BlogAll() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${api_url}blog`);
        setBlogs(response.data);
      } catch (err: any) {
        setError("Failed to fetch blogs. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <section className="container-1 mx-auto bg-blue-50
      px-4 py-10
      sm:px-6 sm:py-[70px]
    ">
      {/* Heading */}
      <h2 className="font-extrabold text-center text-gray-900 mb-6 pb-3
        text-2xl sm:text-4xl sm:mb-8 sm:pb-[20px]
      ">
        Blog & News
      </h2>

      {/* Error */}
      {error && <p className="text-center text-red-500 text-sm">{error}</p>}

      {/* Loading — skeleton cards on mobile, spinner on desktop */}
      {loading && (
        <>
          {/* Mobile skeleton — 1 col */}
          <div className="sm:hidden grid grid-cols-1 gap-4 max-w-6xl mx-auto mt-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-2xl border border-gray-100 bg-white shadow animate-pulse overflow-hidden">
                <div className="h-40 w-full bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 w-20 bg-gray-200 rounded-full" />
                  <div className="h-4 w-full bg-gray-200 rounded-full" />
                  <div className="h-4 w-3/4 bg-gray-100 rounded-full" />
                  <div className="h-3 w-full bg-gray-100 rounded-full" />
                  <div className="h-3 w-5/6 bg-gray-100 rounded-full" />
                  <div className="h-4 w-24 bg-gray-200 rounded-full mt-2" />
                </div>
              </div>
            ))}
          </div>

          {/* Desktop spinner — unchanged */}
          <div className="hidden sm:flex justify-center items-center space-x-2">
            <div className="w-7 h-7 border-5 border-t-transparent border-blue-500 rounded-full animate-spin" />
            <p className="text-center py-7 text-gray-600">Loading blogs...</p>
          </div>
        </>
      )}

      {/* Empty state */}
      {!loading && blogs.length === 0 && (
        <p className="text-center text-gray-600 text-sm sm:text-base">No blogs available.</p>
      )}

      {/* Blog grid */}
      {!loading && blogs.length > 0 && (
        <div className="grid max-w-7xl mx-auto
          grid-cols-1 gap-4 mt-4
          sm:grid-cols-2 sm:gap-4 sm:mt-7
          lg:grid-cols-4
        ">
          {blogs.map((blog, index) => (
            <BlogCard key={blog.id || index} {...blog} />
          ))}
        </div>
      )}
    </section>
  );
}