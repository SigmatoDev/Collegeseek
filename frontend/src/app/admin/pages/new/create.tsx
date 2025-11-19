// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { toast } from "react-hot-toast";
// import axios from "axios";
// import { api_url } from "@/utils/apiCall";

// let EditorJS: any;
// let Header: any;
// let List: any;
// let ImageTool: any;
// let Quote: any;
// let Embed: any;
// let Code: any;
// let Table: any;

// const Create = () => {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [editor, setEditor] = useState<any>(null);
//   const [hasMounted, setHasMounted] = useState(false);

//   const router = useRouter();

//   useEffect(() => {
//     setHasMounted(true);
//   }, []);

//   useEffect(() => {
//     const loadEditor = async () => {
//       if (!editor && typeof window !== "undefined") {
//         const editorHolder = document.getElementById("editorjs");
//         if (!editorHolder) return;

//         const EJ = (await import("@editorjs/editorjs")).default;
//         const EJHeader = (await import("@editorjs/header")).default;
//         const EJList = (await import("@editorjs/list")).default;
//         const EJImage = (await import("@editorjs/image")).default;
//         const EJQuote = (await import("@editorjs/quote")).default;
//         const EJEmbed = (await import("@editorjs/embed")).default;
//         const EJCode = (await import("@editorjs/code")).default;
//         const EJTable = (await import("@editorjs/table")).default;

//         EditorJS = EJ;
//         Header = EJHeader;
//         List = EJList;
//         ImageTool = EJImage;
//         Quote = EJQuote;
//         Embed = EJEmbed;
//         Code = EJCode;
//         Table = EJTable;

//         const newEditor = new EditorJS({
//           holder: "editorjs",
//           tools: {
//             header: { class: Header, inlineToolbar: true },
//             list: { class: List, inlineToolbar: true },
//             image: {
//               class: ImageTool,
//               config: {
//                 uploader: {
//                   async uploadByFile(file: File) {
//                     return new Promise((resolve, reject) => {
//                       const reader = new FileReader();
//                       reader.onload = () => {
//                         resolve({
//                           success: 1,
//                           file: {
//                             url: reader.result as string, // base64 preview
//                           },
//                         });
//                       };
//                       reader.onerror = () => {
//                         reject({
//                           success: 0,
//                           message: "Failed to load image preview",
//                         });
//                       };
//                       reader.readAsDataURL(file);
//                     });
//                   },
//                 },
//               },
//             },
//             quote: { class: Quote, inlineToolbar: true },
//             embed: { class: Embed, inlineToolbar: true },
//             code: { class: Code, inlineToolbar: true },
//             table: { class: Table },
//           },
//           onReady() {
//             setEditor(newEditor);
//           },
//         });
//       }
//     };

//     if (hasMounted) loadEditor();

//     return () => {
//       if (editor) {
//         editor.destroy();
//         setEditor(null);
//       }
//     };
//   }, [hasMounted, editor]);

//   const handleSubmit = async () => {
//     if (!title.trim() || !description.trim()) {
//       toast.error("Title and description are required.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const savedData = await editor?.save();

//       const dataToSubmit = {
//         title,
//         description,
//         content: savedData,
//       };

//       const response = await axios.post(`${api_url}create/pages`, dataToSubmit);

//       if (response.status === 200) {
//         toast.success("Page published successfully!");
//         // router.push(`/admin/pages/${response.data.slug}`);
//         router.push(`/admin/pages`);
//       }
//     } catch (error) {
//       console.error("Submit error:", error);
//       toast.error("Error publishing the page.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!hasMounted) return null;

//   return (
//     <div className="max-w-7xl mx-auto px-6 py-10 space-y-8 bg-gray-50 rounded-lg shadow-md">
//       <h1 className="text-4xl font-bold text-gray-800">Create New Page</h1>

//       <input
//         type="text"
//         placeholder="Enter page title"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//         className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
//       />

//       <textarea
//         placeholder="Enter page description"
//         value={description}
//         onChange={(e) => setDescription(e.target.value)}
//         className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
//       />

//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Page Content
//         </label>
//         <div
//           id="editorjs"
//           className="border rounded-md py-4 bg-white min-h-[200px]"
//         />
//       </div>

//       <div className="pt-6">
//         <button
//           disabled={loading}
//           onClick={handleSubmit}
//           className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-all disabled:opacity-50"
//         >
//           {loading ? "Publishing..." : "Publish Page"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Create;

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { api_url } from "@/utils/apiCall";

export default function Create() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [dynamicApiKey, setDynamicApiKey] = useState<string | null>(null);

  const router = useRouter();

  // Fetch TinyMCE API Key
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const response = await axios.get(`${api_url}settings`);
        setDynamicApiKey(response.data?.tinymceApiKey || "");
      } catch {
        setDynamicApiKey("");
      }
    };
    fetchApiKey();
  }, []);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      toast.error("Title and description are required.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${api_url}create/pages`, {
        title,
        description,
        content,
      });

      if (response.data?.success) {
        toast.success("Page created successfully!");
        router.push("/admin/pages");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error publishing the page.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8 bg-gray-50 rounded-lg shadow-md">
      <h1 className="text-4xl font-bold text-gray-800">Create New Page</h1>

      {/* Title */}
      <input
        type="text"
        placeholder="Enter page title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-4 border border-gray-300 rounded-md bg-white"
      />

      {/* Description */}
      <textarea
        placeholder="Enter page description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-4 border border-gray-300 rounded-md bg-white"
      />

      {/* Page Editor */}
      <div className="flex flex-col space-y-1">
        <label className="text-gray-800 font-medium">Page Content</label>

        {dynamicApiKey === null ? (
          <p className="text-gray-500">Loading editor...</p>
        ) : (
          <Editor
            apiKey={dynamicApiKey || undefined}
            value={content}
            onEditorChange={(value) => setContent(value)}
            textareaName="content"
            init={{
              height: 500,
              menubar: true,
              plugins:
                "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
              toolbar:
                "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | " +
                "link image media table | align lineheight | numlist bullist indent outdent | " +
                "emoticons charmap | removeformat",

              // ⭐⭐⭐ REAL IMAGE UPLOAD (NOT BASE64)
              images_upload_handler: async (blobInfo: any) => {
                console.log("📤 Uploading Image:", blobInfo.filename());

                const formData = new FormData();
                formData.append("file", blobInfo.blob(), blobInfo.filename());

                try {
                  const response = await axios.post(
                    `${api_url}upload/page-image`,
                    formData,
                    {
                      headers: {
                        "Content-Type": "multipart/form-data",
                      },
                    }
                  );

                  console.log("📥 Upload Response:", response.data);

                  if (response.data?.location) {
                    return response.data.location; // full URL
                  } else {
                    throw new Error("Invalid image upload response");
                  }
                } catch (error) {
                  console.error("❌ TinyMCE Image Upload Error:", error);
                  toast.error("Image upload failed");
                  throw error;
                }
              },
            }}
          />
        )}
      </div>

      {/* Submit Button */}
      <button
        disabled={loading}
        onClick={handleSubmit}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg disabled:opacity-50"
      >
        {loading ? "Publishing..." : "Publish Page"}
      </button>
    </div>
  );
}
