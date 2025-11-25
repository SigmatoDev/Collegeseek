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
  TrashIcon,
} from "@heroicons/react/24/outline";
import { CheckIcon } from "lucide-react";
import { motion } from "framer-motion"; // ⭐ Added for animation

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

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pagesPerPage] = useState<number>(10);

  // ⭐ Delete Confirmation Modal State
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const router = useRouter();

 const fetchPages = async (page: number = 1) => {
  setLoading(true);
  setError(null);

  try {
    const { data } = await axios.get(
      `${api_url}get/Pages?page=${page}&limit=${pagesPerPage}`
    );

    if (!Array.isArray(data.pages)) {
      throw new Error("Unexpected API response format: expected an array.");
    }

    // ⭐ Make latest added pages appear on top
    const sortedPages = [...data.pages].reverse();

    setPages(sortedPages);
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

  // ⭐ Open delete modal
  const openDeleteModal = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  // ⭐ Updated handleDelete
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await axios.delete(`${api_url}pages/delete/${deleteId}`);

      toast.success("Page deleted successfully!");
      fetchPages(currentPage);
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          "Error deleting page. Please check console."
      );
    } finally {
      setShowDeleteModal(false);
      setDeleteId(null);
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
          className="flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
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
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {page.title}
                    </td>

                    {/* SLUG */}
                    <td className="px-6 py-4 text-sm text-gray-700 flex items-center gap-2">
                      <a
                        href={`/${page.slug}`}
                        target="_blank"
                        className="font-mono text-blue-600 hover:text-blue-800 hover:underline transition"
                      >
                        {page.slug}
                      </a>

                      <button
                        onClick={() => handleCopySlug(page.slug)}
                        onMouseEnter={() => setIsHovered(page.slug)}
                        onMouseLeave={() => setIsHovered(null)}
                        className="relative flex items-center p-2 rounded-full hover:bg-gray-100 transition transform hover:scale-105"
                      >
                        {copiedSlug === page.slug ? (
                          <CheckIcon className="w-5 h-5 text-green-500" />
                        ) : (
                          <ClipboardDocumentIcon className="w-5 h-5 text-blue-500" />
                        )}

                        <span
                          className={`absolute top-[-38px] left-1/2 transform -translate-x-1/2 text-xs text-white font-semibold p-2 rounded bg-black shadow opacity-0 transition ${
                            copiedSlug === page.slug || isHovered === page.slug
                              ? "opacity-100"
                              : ""
                          }`}
                        >
                          {copiedSlug === page.slug ? "Copied!" : "Copy"}
                          <span className="absolute left-1/2 transform -translate-x-1/2 top-full border-l-8 border-r-8 border-t-8 border-transparent border-t-black" />
                        </span>
                      </button>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            router.push(`/admin/pages/edit/${page._id}`)
                          }
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition"
                        >
                          <PencilSquareIcon className="h-5 w-5" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => openDeleteModal(page._id)} // ⭐ Updated
                          className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-600 transition"
                        >
                          <TrashIcon className="w-5 h-5" />
                          <span>Delete</span>
                        </button>
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

          {/* PAGINATION */}
          <div className="flex justify-between items-center p-4 border-t bg-gray-50">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Previous
            </button>

            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* ⭐ Custom Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 rounded-lg w-[90%] max-w-sm shadow-xl"
          >
            <h2 className="text-xl font-semibold text-gray-800">
              Confirm Delete
            </h2>

            <p className="text-gray-600 mt-2">
              Are you sure you want to delete this page? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminPages;
