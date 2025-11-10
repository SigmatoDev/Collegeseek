// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import { api_url } from "@/utils/apiCall";
// import { toast } from "react-hot-toast";
// import {
//   MagnifyingGlassIcon,
//   PencilSquareIcon,
//   PlusCircleIcon,
// } from "@heroicons/react/24/outline";
// import ImportColleges from "./importCollege";
// import ExportCollegesButton from "./exportColleges";

// interface College {
//   _id: string;
//   name: string;
//   location: string;
//   rank?: number;
//   courses: string[];
//   website: string;
//   selected?: boolean;
// }

// interface Pagination {
//   total: number;
//   page: number;
//   pages: number;
//   limit: number;
// }

// const AdminColleges = () => {
//   const [colleges, setColleges] = useState<College[]>([]);
//   const [pagination, setPagination] = useState<Pagination>({
//     total: 0,
//     page: 1,
//     pages: 1,
//     limit: 10,
//   });
//   const [search, setSearch] = useState<string>("");
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [mounted, setMounted] = useState<boolean>(false);
//   const router = useRouter();

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   const fetchColleges = async (
//     page: number = 1,
//     limit: number = 10,
//     query: string = ""
//   ) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const { data } = await axios.get(
//         `${api_url}search/colleges?page=${page}&limit=${limit}&search=${encodeURIComponent(
//           query
//         )}`
//       );

//       if (!data.success || !Array.isArray(data.data)) {
//         throw new Error("Unexpected API response format.");
//       }

//       setColleges(data.data.map((c: College) => ({ ...c, selected: false })));
//       setPagination(data.pagination);
//     } catch (err: any) {
//       console.error("Error fetching colleges:", err);
//       setError(err.response?.data?.message || "Failed to load colleges.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const delayDebounce = setTimeout(() => {
//       fetchColleges(pagination.page, pagination.limit, search);
//     }, 500);

//     return () => clearTimeout(delayDebounce);
//   }, [search, pagination.page, pagination.limit]);

//   const goToPage = (page: number) => {
//     if (page < 1 || page > pagination.pages) return;
//     setPagination((prev) => ({ ...prev, page }));
//   };

//   const selectedIds = colleges.filter((c) => c.selected).map((c) => c._id);

//   if (!mounted) return null;

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold text-gray-800 mb-4">Colleges List</h1>

//       <div className="mb-6">
//         <div className="flex justify-between items-center mb-2">
//           <button
//             onClick={() => router.push("/admin/manageColleges/new")}
//             className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
//           >
//             <PlusCircleIcon className="w-5 h-5 mr-2" />
//             Add College
//           </button>
//           <ImportColleges />
//         </div>

//         <div className="space-y-4">
//           <div className="flex items-center justify-between">
//             <div className="relative w-[440px]">
//               <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search by name..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
//               />
//             </div>

//             <ExportCollegesButton selectedCollegeIds={selectedIds} />
//           </div>

//           <div className="flex items-center space-x-3 py-2">
//             <label htmlFor="limit" className="text-sm text-gray-600">
//               Rows per page
//             </label>
//             <select
//               id="limit"
//               value={pagination.limit}
//               onChange={(e) =>
//                 setPagination((prev) => ({
//                   ...prev,
//                   limit: parseInt(e.target.value, 10),
//                   page: 1,
//                 }))
//               }
//               className="border border-gray-300 rounded px-2 py-1 text-sm"
//             >
//               {[10, 20, 50].map((num) => (
//                 <option key={num} value={num}>
//                   {num}
//                 </option>
//               ))}
//             </select>
//             <label htmlFor="limit" className="text-sm text-gray-600">
//               Entries
//             </label>
//           </div>
//         </div>
//       </div>

//       {loading && (
//         <p className="text-center text-gray-500">Loading colleges...</p>
//       )}
//       {error && <p className="text-center text-red-500">{error}</p>}

//       {!loading && !error && (
//         <>
//           <div className="overflow-x-auto shadow-md rounded bg-white">
//             <table className="table-auto w-full text-left border-collapse">
//               <thead className="bg-gray-200 text-gray-600">
//                 <tr>
//                   <th className="px-4 py-3">
//                     <input
//                       type="checkbox"
//                       onChange={(e) => {
//                         const checked = e.target.checked;
//                         setColleges((prev) =>
//                           prev.map((college) => ({
//                             ...college,
//                             selected: checked,
//                           }))
//                         );
//                       }}
//                     />
//                   </th>
//                   {["Name", "Location", "Rank", "Website", "Actions"].map(
//                     (header) => (
//                       <th
//                         key={header}
//                         className="px-6 py-3 text-sm font-semibold"
//                       >
//                         {header}
//                       </th>
//                     )
//                   )}
//                 </tr>
//               </thead>
//               <tbody>
//                 {colleges.length > 0 ? (
//                   colleges.map((college) => (
//                     <tr key={college._id} className="border-b hover:bg-gray-50">
//                       <td className="px-4 py-3">
//                         <input
//                           type="checkbox"
//                           checked={college.selected || false}
//                           onChange={() =>
//                             setColleges((prev) =>
//                               prev.map((c) =>
//                                 c._id === college._id
//                                   ? { ...c, selected: !c.selected }
//                                   : c
//                               )
//                             )
//                           }
//                         />
//                       </td>
//                       <td className="px-6 py-3 text-sm text-gray-700">
//                         {college.name}
//                       </td>
//                       <td className="px-6 py-3 text-sm text-gray-700">
//                         {college.location}
//                       </td>
//                       <td className="px-6 py-3 text-sm text-gray-700">
//                         {college.rank ? `#${college.rank}` : "N/A"}
//                       </td>
//                       <td className="px-6 py-3 text-sm text-blue-500 hover:underline">
//                         <a
//                           href={college.website}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                         >
//                           Visit
//                         </a>
//                       </td>
//                       <td className="px-6 py-3 flex space-x-2">
//                         <button
//                           onClick={() =>
//                             router.push(`/admin/manageColleges/${college._id}`)
//                           }
//                           className="bg-blue-500 text-white px-3 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-600 transition"
//                         >
//                           <PencilSquareIcon className="h-5 w-5" />
//                           <span>Edit</span>
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan={6} className="text-center py-4 text-gray-500">
//                       No colleges found.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>

//             <div className="flex justify-between items-center p-4 border-t bg-gray-50">
//               <button
//                 onClick={() => goToPage(pagination.page - 1)}
//                 disabled={pagination.page === 1}
//                 className={`px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition ${
//                   pagination.page === 1 ? "opacity-50 cursor-not-allowed" : ""
//                 }`}
//               >
//                 Prev
//               </button>
//               <span className="flex items-center space-x-2 text-sm">
//                 Page {pagination.page} of {pagination.pages}
//                 <span className="p-2"> / Go to page:</span>
//                 <input
//                   type="number"
//                   min={1}
//                   max={pagination.pages}
//                   placeholder="Page #"
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") {
//                       const pageNum = Number(
//                         (e.target as HTMLInputElement).value
//                       );
//                       if (
//                         !isNaN(pageNum) &&
//                         pageNum >= 1 &&
//                         pageNum <= pagination.pages
//                       ) {
//                         goToPage(pageNum);
//                       }
//                     }
//                   }}
//                   className="w-16 border border-gray-300 rounded px-2 py-1 text-center text-sm ml-2"
//                 />
//               </span>

//               <button
//                 onClick={() => goToPage(pagination.page + 1)}
//                 disabled={pagination.page === pagination.pages}
//                 className={`px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition ${
//                   pagination.page === pagination.pages
//                     ? "opacity-50 cursor-not-allowed"
//                     : ""
//                 }`}
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default AdminColleges;
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { api_url } from "@/utils/apiCall";
import { toast } from "react-hot-toast";
import {
  MagnifyingGlassIcon,
  PencilSquareIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import ImportColleges from "./importCollege";
import ExportCollegesButton from "./exportColleges";

interface College {
  _id: string;
  name: string;
  location: string;
  rank?: number;
  courses: string[];
  website: string;
  selected?: boolean;
}

interface Pagination {
  total: number;
  page: number;
  pages: number;
  limit: number;
}

interface DeletionSummary {
  college: { id: string; name: string };
  counts: {
    college: number;
    courses: number;
    documents: number;
  };
}

const AdminColleges = () => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    pages: 1,
    limit: 10,
  });
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<College | null>(null);
  const [dependencySummary, setDependencySummary] =
    useState<DeletionSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const openDeleteModal = (college: College) => {
    setDeleteTarget(college);
    setDeleteModalOpen(true);
    setDependencySummary(null);
    setSummaryError(null);
    setConfirmText("");
    setSummaryLoading(true);

    axios
      .get(`${api_url}colleges/${college._id}/dependencies`)
      .then((response) => {
        if (response.data?.success) {
          setDependencySummary(response.data.data);
        } else {
          setSummaryError(
            response.data?.error || "Unable to load dependency summary."
          );
        }
      })
      .catch((err) => {
        console.error("Error fetching dependency summary:", err);
        setSummaryError(
          err.response?.data?.error ||
            "Failed to fetch dependency summary. Please try again."
        );
      })
      .finally(() => setSummaryLoading(false));
  };

  const closeDeleteModal = () => {
    if (deleting) return;
    setDeleteModalOpen(false);
    setDeleteTarget(null);
    setDependencySummary(null);
    setSummaryError(null);
    setConfirmText("");
  };

  const handleDeleteCollege = async () => {
    if (!deleteTarget) return;
    if (confirmText.trim().toUpperCase() !== "DELETE") return;

    try {
      setDeleting(true);
      const { data } = await axios.delete(
        `${api_url}colleges/${deleteTarget._id}`
      );
      toast.success(
        data?.message || `${deleteTarget.name} deleted successfully.`
      );
      closeDeleteModal();
      fetchColleges(pagination.page, pagination.limit, search);
    } catch (err: any) {
      console.error("Error deleting college:", err);
      toast.error(err.response?.data?.error || "Failed to delete college.");
    } finally {
      setDeleting(false);
    }
  };

  const fetchColleges = async (
    page: number = 1,
    limit: number = 10,
    query: string = ""
  ) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(
        `${api_url}search/colleges?page=${page}&limit=${limit}&search=${encodeURIComponent(
          query
        )}`
      );

      if (!data.success || !Array.isArray(data.data)) {
        throw new Error("Unexpected API response format.");
      }

      setColleges(data.data.map((c: College) => ({ ...c, selected: false })));
      setPagination(data.pagination);
    } catch (err: any) {
      console.error("Error fetching colleges:", err);
      setError(err.response?.data?.message || "Failed to load colleges.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchColleges(pagination.page, pagination.limit, search);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search, pagination.page, pagination.limit]);

  const goToPage = (page: number) => {
    if (page < 1 || page > pagination.pages) return;
    setPagination((prev) => ({ ...prev, page }));
  };

  const selectedIds = colleges.filter((c) => c.selected).map((c) => c._id);

  if (!mounted) return null;

return (
  <div className="container mx-auto px-4 py-8">
    {/* Header Section */}
   <div className="container mx-auto px-4 py-8">
  <h1 className="text-2xl font-bold text-gray-800 mb-4">Colleges List</h1>

  {/* Action Buttons Below the Title */}
 <div className="flex items-center justify-between mb-6">
  {/* Left side - Add College button */}
  <button
    onClick={() => router.push("/admin/manageColleges/new")}
    className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
  >
    <PlusCircleIcon className="w-5 h-5 mr-2" />
    Add College
  </button>

  {/* Right side - Import option */}
  <ImportColleges />
</div>


  {/* Search and Export Section */}
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <div className="relative w-[440px]">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>

      <ExportCollegesButton selectedCollegeIds={selectedIds} />
    </div>

    <div className="flex items-center space-x-3 py-2">
      <label htmlFor="limit" className="text-sm text-gray-600">
        Rows per page
      </label>
      <select
        id="limit"
        value={pagination.limit}
        onChange={(e) =>
          setPagination((prev) => ({
            ...prev,
            limit: parseInt(e.target.value, 10),
            page: 1,
          }))
        }
        className="border border-gray-300 rounded px-2 py-1 text-sm"
      >
        {[10, 20, 50].map((num) => (
          <option key={num} value={num}>
            {num}
          </option>
        ))}
      </select>
      <label htmlFor="limit" className="text-sm text-gray-600">
        Entries
      </label>
    </div>
  </div>
</div>


    {/* Loading / Error States */}
    {loading && <p className="text-center text-gray-500">Loading colleges...</p>}
    {error && <p className="text-center text-red-500">{error}</p>}

    {/* Table Section */}
    {!loading && !error && (
      <>
        <div className="overflow-x-auto shadow-md rounded-lg bg-white">
          <table className="table-auto w-full text-left border-collapse">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setColleges((prev) =>
                        prev.map((college) => ({
                          ...college,
                          selected: checked,
                        }))
                      );
                    }}
                  />
                </th>
                {["Name", "Location", "Rank", "Website", "Actions"].map(
                  (header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-sm font-semibold"
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {colleges.length > 0 ? (
                colleges.map((college) => (
                  <tr
                    key={college._id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={college.selected || false}
                        onChange={() =>
                          setColleges((prev) =>
                            prev.map((c) =>
                              c._id === college._id
                                ? { ...c, selected: !c.selected }
                                : c
                            )
                          )
                        }
                      />
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-700">
                      {college.name}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-700">
                      {college.location}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-700">
                      {college.rank ? `#${college.rank}` : "N/A"}
                    </td>
                    <td className="px-6 py-3 text-sm text-blue-600 hover:underline">
                      <a
                        href={college.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visit
                      </a>
                    </td>
                    <td className="px-6 py-3 flex space-x-2">
                      <button
                        onClick={() =>
                          router.push(`/admin/manageColleges/${college._id}`)
                        }
                        className="bg-blue-500 text-white px-3 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-600 transition"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => openDeleteModal(college)}
                        className="border border-red-200 bg-red-50 text-red-600 px-3 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-100 transition"
                      >
                        <TrashIcon className="h-5 w-5" />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-4 text-gray-500"
                  >
                    No colleges found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination Footer */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-4 border-t bg-gray-50">
            <button
              onClick={() => goToPage(pagination.page - 1)}
              disabled={pagination.page === 1}
              className={`px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition ${
                pagination.page === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Prev
            </button>

            <div className="flex flex-wrap items-center justify-center text-sm space-x-2">
              <span>
                Page {pagination.page} of {pagination.pages}
              </span>
              <span>/ Go to page:</span>
              <input
                type="number"
                min={1}
                max={pagination.pages}
                placeholder="Page #"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const pageNum = Number(
                      (e.target as HTMLInputElement).value
                    );
                    if (
                      !isNaN(pageNum) &&
                      pageNum >= 1 &&
                      pageNum <= pagination.pages
                    ) {
                      goToPage(pageNum);
                    }
                  }
                }}
                className="w-16 border border-gray-300 rounded px-2 py-1 text-center text-sm"
              />
            </div>

            <button
              onClick={() => goToPage(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className={`px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition ${
                pagination.page === pagination.pages
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </>
    )}

    {/* Delete Modal */}
    {deleteModalOpen && deleteTarget && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
        <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
          <h2 className="text-xl font-semibold text-gray-900">
            Delete “{deleteTarget.name}”?
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Removing this college will also erase all of its connected data.
            This action cannot be undone.
          </p>

          <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-4">
            {summaryLoading ? (
              <p className="text-sm text-gray-500">Calculating impact...</p>
            ) : summaryError ? (
              <p className="text-sm text-red-600">{summaryError}</p>
            ) : dependencySummary ? (
              <>
                <p className="text-sm text-gray-700">
                  The following records will be permanently deleted:
                </p>
                <ul className="mt-3 space-y-1 text-sm text-gray-800">
                  <li>• 1 college profile</li>
                  <li>
                    • {dependencySummary.counts.courses} course entries
                    (including exam & fee info)
                  </li>
                  <li>
                    • {dependencySummary.counts.documents} uploaded
                    documents/brochures
                  </li>
                </ul>
              </>
            ) : null}
          </div>

          <div className="mt-4">
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
              Type DELETE to confirm
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2"
              placeholder="DELETE"
              disabled={summaryLoading || !!summaryError}
            />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={closeDeleteModal}
              className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100"
              disabled={deleting}
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteCollege}
              disabled={
                deleting ||
                summaryLoading ||
                !!summaryError ||
                confirmText.trim().toUpperCase() !== "DELETE"
              }
              className={`rounded-full px-4 py-2 text-sm font-semibold text-white ${
                confirmText.trim().toUpperCase() === "DELETE" &&
                !summaryLoading &&
                !summaryError
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-red-300 cursor-not-allowed"
              }`}
            >
              {deleting ? "Deleting..." : "Delete forever"}
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);

};

export default AdminColleges;
