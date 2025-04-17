// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { api_url } from "@/utils/apiCall";

// type Link = {
//   _id?: string;
//   label: string;
//   url: string;
// };

// type Column = {
//   _id?: string;
//   title: string;
//   links?: Link[];
// };

// type EditValue = {
//   title?: string;
//   label?: string;
//   url?: string;
// };

// interface MenuParams {
//   menuId: string;
//   columnId: string;
//   linkId: string;
// }

// type EditingIndex = {
//   colIndex: number;
//   columnId?: string;
//   linkIndex?: number;
// } | null;

// export default function AdminMenu() {
//   const [menu, setMenu] = useState<Column[]>([]);
//   const [editingIndex, setEditingIndex] = useState<EditingIndex>(null);
//   const [editValue, setEditValue] = useState<EditValue>({});
//   const [addingLinkIndex, setAddingLinkIndex] = useState<number | null>(null);
//   const [newLink, setNewLink] = useState<{ label: string; url: string }>({
//     label: "",
//     url: "",
//   });
//   const [loading, setLoading] = useState<boolean>(false);

//   useEffect(() => {
//     fetchMenu();
//   }, []);

//   const fetchMenu = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`${api_url}menu`);
//       setMenu(response.data.columns || []);
//     } catch (error) {
//       console.error("Error fetching menu:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEditTitle = (colIndex: number) => {
//     const columnId = menu[colIndex]._id;
//     setEditingIndex({ colIndex, columnId });
//     setEditValue({ title: menu[colIndex].title });
//   };

//   const handleEditLink = (colIndex: number, linkIndex: number) => {
//     const columnId = menu[colIndex]._id;
//     const link = menu[colIndex].links?.[linkIndex];
//     if (!link) return;

//     setEditingIndex({ colIndex, linkIndex, columnId });
//     setEditValue({
//       label: link.label,
//       url: link.url,
//     });
//   };

//   const handleEditChange = (field: keyof EditValue, value: string) => {
//     setEditValue((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleSaveEdit = async () => {
//     if (!editingIndex || !menuId) return;

//     const { colIndex, linkIndex, columnId } = editingIndex;
//     const requestBody: any = { columnId };

//     if (linkIndex === undefined) {
//       if (!editValue.title?.trim()) return;
//       requestBody.title = editValue.title;
//     } else {
//       const link = menu[colIndex].links?.[linkIndex];
//       if (!link || !link._id || !editValue.label?.trim() || !editValue.url?.trim()) return;

//       requestBody.linkId = link._id;
//       requestBody.label = editValue.label;
//       requestBody.url = editValue.url;
//     }

//     setLoading(true);
//     try {
//       await axios.put(`${api_url}menu/${menuId}`, requestBody);
//       fetchMenu();
//       setEditingIndex(null);
//       setEditValue({});
//     } catch (error) {
//       console.error("Error saving edit:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteLink = async (colIndex: number, linkIndex: number) => {
//     const columnId = menu[colIndex]._id;
//     const linkId = menu[colIndex].links?.[linkIndex]?._id;

//     if (!linkId) return;

//     setLoading(true);
//     try {
//       await axios.delete(
//         `${api_url}menu/${menuId}/column/${columnId}/link/${linkId}`
//       );
//       fetchMenu();
//     } catch (error) {
//       console.error("Error deleting link:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddLink = async (colIndex: number) => {
//     const column = menu[colIndex];
//     if (!menuId || !column._id || !newLink.label.trim() || !newLink.url.trim()) return;

//     setLoading(true);
//     try {
//       await axios.post(
//         `${api_url}menu/${menuId}/column/${column._id}/link`,
//         newLink
//       );
//       fetchMenu();
//       setNewLink({ label: "", url: "" });
//       setAddingLinkIndex(null);
//     } catch (error) {
//       console.error("Error adding link:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Admin Menu</h1>

//       {loading && <div className="text-center mb-4">Loading...</div>}

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {menu.map((column, colIndex) => (
//           <div
//             key={column._id || colIndex}
//             className="border p-4 rounded-lg shadow-md bg-white"
//           >
//             {/* Title */}
//             {editingIndex?.colIndex === colIndex && editingIndex.linkIndex === undefined ? (
//               <div className="flex items-center gap-2 mb-4">
//                 <input
//                   type="text"
//                   value={editValue.title || ""}
//                   onChange={(e) => handleEditChange("title", e.target.value)}
//                   className="border px-3 py-1 rounded w-full"
//                 />
//                 <button
//                   onClick={handleSaveEdit}
//                   className="bg-green-500 text-white px-4 py-1 rounded"
//                 >
//                   Save
//                 </button>
//               </div>
//             ) : (
//               <h2
//                 className="text-xl font-semibold mb-3 cursor-pointer hover:text-blue-600"
//                 onClick={() => handleEditTitle(colIndex)}
//               >
//                 {column.title}
//               </h2>
//             )}

//             {/* Links */}
//             <ul className="space-y-2">
//               {(column.links ?? []).map((link, linkIndex) => (
//                 <li key={link._id || linkIndex} className="flex items-center gap-2">
//                   {editingIndex?.colIndex === colIndex && editingIndex.linkIndex === linkIndex ? (
//                     <>
//                       <input
//                         type="text"
//                         value={editValue.label || ""}
//                         onChange={(e) => handleEditChange("label", e.target.value)}
//                         className="border px-2 py-1 rounded w-[45%]"
//                       />
//                       <input
//                         type="text"
//                         value={editValue.url || ""}
//                         onChange={(e) => handleEditChange("url", e.target.value)}
//                         className="border px-2 py-1 rounded w-[45%]"
//                       />
//                       <button
//                         onClick={handleSaveEdit}
//                         className="bg-green-500 text-white px-3 py-1 rounded"
//                       >
//                         Save
//                       </button>
//                     </>
//                   ) : (
//                     <>
//                       <span className="w-[45%] truncate">{link.label}</span>
//                       <button
//                         onClick={() => handleEditLink(colIndex, linkIndex)}
//                         className="text-blue-500 hover:underline"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => handleDeleteLink(colIndex, linkIndex)}
//                         className="text-red-500 hover:underline"
//                       >
//                         Delete
//                       </button>
//                     </>
//                   )}
//                 </li>
//               ))}
//             </ul>

//             {/* Add Link */}
//             {addingLinkIndex === colIndex ? (
//               <div className="mt-4 flex items-center gap-2">
//                 <input
//                   type="text"
//                   placeholder="Label"
//                   value={newLink.label}
//                   onChange={(e) => setNewLink({ ...newLink, label: e.target.value })}
//                   className="border px-2 py-1 rounded w-[45%]"
//                 />
//                 <input
//                   type="text"
//                   placeholder="URL"
//                   value={newLink.url}
//                   onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
//                   className="border px-2 py-1 rounded w-[45%]"
//                 />
//                 <button
//                   onClick={() => handleAddLink(colIndex)}
//                   className="bg-blue-500 text-white px-3 py-1 rounded"
//                 >
//                   Add
//                 </button>
//               </div>
//             ) : (
//               <button
//                 onClick={() => setAddingLinkIndex(colIndex)}
//                 className="mt-4 text-sm text-green-600 hover:underline"
//               >
//                 + Add Link
//               </button>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
