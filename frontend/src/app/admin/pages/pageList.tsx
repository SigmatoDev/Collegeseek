"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { api_url } from "@/utils/apiCall";
import { toast } from "react-hot-toast";
import {
  PencilSquareIcon,
  PlusCircleIcon,
  ClipboardDocumentIcon,
} from "@heroicons/react/24/outline";
import { CheckIcon } from "lucide-react";

interface Page {
  _id: string;
  title: string;
  slug: string;
}

const AdminPages = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState<string | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pagesPerPage] = useState<number>(10); // Or any number you prefer

  const router = useRouter();

  const fetchPages = async (page: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.get(
        `${api_url}get/Pages?page=${page}&limit=${pagesPerPage}`
      );

      // data format: { totalPages, currentPage, pagesPerPage, pages: [...] }
      if (!Array.isArray(data.pages)) {
        throw new Error("Unexpected API response format: expected an array.");
      }

      setPages(data.pages);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (err: any) {
      console.error("Error fetching pages:", err);
      setError(err.response?.data?.message || "Failed to load pages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages(currentPage);
  }, [currentPage]);

  const handleDelete = async (pageId: string) => {
    if (!window.confirm("Are you sure you want to delete this page?")) return;

    try {
      await axios.delete(`${api_url}deletePage/${pageId}`);
      toast.success("Page deleted successfully!");
      fetchPages(currentPage);
    } catch (err) {
      console.error("Error deleting page:", err);
      toast.error("Error deleting page. Please try again.");
    }
  };

  const handleCopySlug = (slug: string) => {
    navigator.clipboard
      .writeText(slug)
      .then(() => {
        toast.success("Slug copied to clipboard!");
        setCopiedSlug(slug);
        setTimeout(() => setCopiedSlug(null), 2000);
      })
      .catch(() => {
        toast.error("Failed to copy slug.");
      });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Pages List</h1>

      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={() => router.push("/admin/pages/new")}
          className="flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
        >
          <PlusCircleIcon className="w-6 h-6 mr-2" />
          <span className="font-semibold">Add Page</span>
        </button>
      </div>

      {loading && <p className="text-center text-gray-500">Loading pages...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
          <table className="table-auto w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-6 py-3 text-sm font-semibold">Title</th>
                <th className="px-6 py-3 text-sm font-semibold">Slug</th>
                <th className="px-6 py-3 text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.length > 0 ? (
                pages.map((page) => (
                  <tr key={page._id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-700">{page.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 flex items-center gap-2">
                      <a
                        href={`/${page.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-blue-600 hover:text-blue-800 hover:underline transition duration-200"
                        title={`Go to ${page.title} page`}
                      >
                        {page.slug}
                      </a>

                      <button
                        onClick={() => handleCopySlug(page.slug)}
                        onMouseEnter={() => setIsHovered(page.slug)}
                        onMouseLeave={() => setIsHovered(null)}
                        className="relative flex items-center justify-center gap-2 text-blue-500 hover:text-blue-700 ml-2 rounded-full p-2 transition-all duration-300 transform hover:scale-105"
                        aria-label={
                          copiedSlug === page.slug ? "Slug Copied" : "Copy Slug"
                        }
                      >
                        {copiedSlug === page.slug ? (
                          <CheckIcon className="w-6 h-6 text-green-500 animate-pulse" />
                        ) : (
                          <ClipboardDocumentIcon className="w-6 h-6 text-blue-500" />
                        )}

                        <span
                          className={`absolute top-[-40px] left-1/2 transform -translate-x-1/2 text-sm text-white font-semibold p-2 rounded-md bg-[#000000] shadow-lg opacity-0 transition-opacity duration-300 ${
                            copiedSlug === page.slug || isHovered === page.slug
                              ? "opacity-100 translate-y-2"
                              : ""
                          }`}
                        >
                          {copiedSlug === page.slug ? "Copied!" : "Copy"}
                          <span
                            className={`absolute left-1/2 transform -translate-x-1/2 top-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-[#000000]`}
                          ></span>
                        </span>
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => router.push(`/admin/pages/edit/${page._id}`)}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-600 transition duration-200"
                        >
                          <PencilSquareIcon className="h-5 w-5" />
                          <span className="text-sm font-medium">Edit</span>
                        </button>
                        {/* You can add a delete button here if needed */}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-4 text-gray-500">
                    No pages found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center p-4 border-t bg-gray-50">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Previous
            </button>
            <span className="text-gray-700 text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition ${
                currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPages;
