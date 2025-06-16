// // components/MetaForm.tsx
// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function MetaForm({ page = "college" }) {
//   const [form, setForm] = useState({
//     page,
//     title: "",
//     description: "",
//     keywords: "",
//     openGraph: {
//       title: "",
//       description: "",
//       url: "",
//       siteName: "",
//       type: "website",
//       images: [
//         {
//           url: "",
//           width: 1200,
//           height: 630,
//           alt: "",
//         },
//       ],
//     },
//     twitter: {
//       card: "summary_large_image",
//       title: "",
//       description: "",
//       images: [""],
//     },
//     alternates: {
//       canonical: "",
//     },
//   });

//   const [loading, setLoading] = useState(false);

//   // Fetch existing meta
//   useEffect(() => {
//     axios
//       .get(`${page}`)
//       .then((res) => setForm({ ...res.data, keywords: res.data.keywords?.join(", ") }))
//       .catch(() => {}); // ignore if not found
//   }, [page]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     // Deep update for nested fields
//     if (name.includes(".")) {
//       const parts = name.split(".");
//       setForm((prev) => {
//         const updated = { ...prev };
//         let obj = updated;
//         for (let i = 0; i < parts.length - 1; i++) {
//           obj = obj[parts[i]];
//         }
//         obj[parts[parts.length - 1]] = value;
//         return updated;
//       });
//     } else {
//       setForm((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const payload = {
//       ...form,
//       keywords: form.keywords.split(",").map((k) => k.trim()),
//     };

//     try {
//       await axios.put(`http://localhost:5000/api/meta/${page}`, payload);
//       alert("Meta updated successfully!");
//     } catch (err) {
//       try {
//         await axios.post("http://localhost:5000/api/meta", payload);
//         alert("Meta created successfully!");
//       } catch (e) {
//         alert("Failed to save metadata.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="max-w-3xl mx-auto mt-10 bg-white shadow rounded-lg p-6 space-y-6"
//     >
//       <h2 className="text-xl font-semibold">SEO Meta Editor: {page}</h2>

//       <div>
//         <label className="block font-medium">Title</label>
//         <input
//           name="title"
//           value={form.title}
//           onChange={handleChange}
//           className="w-full border p-2 rounded"
//         />
//       </div>

//       <div>
//         <label className="block font-medium">Description</label>
//         <textarea
//           name="description"
//           value={form.description}
//           onChange={handleChange}
//           className="w-full border p-2 rounded"
//         />
//       </div>

//       <div>
//         <label className="block font-medium">Keywords (comma separated)</label>
//         <input
//           name="keywords"
//           value={form.keywords}
//           onChange={handleChange}
//           className="w-full border p-2 rounded"
//         />
//       </div>

//       <hr className="my-4" />

//       <h3 className="text-lg font-semibold">Open Graph</h3>

//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         <input name="openGraph.title" value={form.openGraph.title} onChange={handleChange} placeholder="OG Title" className="border p-2 rounded" />
//         <input name="openGraph.description" value={form.openGraph.description} onChange={handleChange} placeholder="OG Description" className="border p-2 rounded" />
//         <input name="openGraph.url" value={form.openGraph.url} onChange={handleChange} placeholder="OG URL" className="border p-2 rounded" />
//         <input name="openGraph.siteName" value={form.openGraph.siteName} onChange={handleChange} placeholder="OG Site Name" className="border p-2 rounded" />
//         <input name="openGraph.images.0.url" value={form.openGraph.images[0]?.url || ""} onChange={handleChange} placeholder="OG Image URL" className="border p-2 rounded" />
//         <input name="openGraph.images.0.alt" value={form.openGraph.images[0]?.alt || ""} onChange={handleChange} placeholder="OG Image Alt" className="border p-2 rounded" />
//       </div>

//       <hr className="my-4" />
//       <h3 className="text-lg font-semibold">Twitter Meta</h3>

//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         <input name="twitter.title" value={form.twitter.title} onChange={handleChange} placeholder="Twitter Title" className="border p-2 rounded" />
//         <input name="twitter.description" value={form.twitter.description} onChange={handleChange} placeholder="Twitter Description" className="border p-2 rounded" />
//         <input name="twitter.images.0" value={form.twitter.images[0] || ""} onChange={handleChange} placeholder="Twitter Image URL" className="border p-2 rounded" />
//       </div>

//       <hr className="my-4" />
//       <h3 className="text-lg font-semibold">Canonical URL</h3>
//       <input name="alternates.canonical" value={form.alternates.canonical} onChange={handleChange} placeholder="Canonical URL" className="w-full border p-2 rounded" />

//       <button
//         type="submit"
//         disabled={loading}
//         className="bg-blue-600 text-white px-6 py-2 rounded mt-4"
//       >
//         {loading ? "Saving..." : "Save Metadata"}
//       </button>
//     </form>
//   );
// }
