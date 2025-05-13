"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { api_url } from "@/utils/apiCall";
import { toast } from "react-hot-toast";
import dynamic from "next/dynamic";

let EditorJS: any;
let Header: any;
let List: any;
let ImageTool: any;
let Quote: any;
let Embed: any;
let Code: any;
let Table: any;

interface ModuleItem {
  _id: string;
  title: string;
  type: string;
  content: any;
}

const Create = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedModules, setSelectedModules] = useState<ModuleItem[]>([]);
  const [editor, setEditor] = useState<any>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null); // State for the image preview

  const router = useRouter();

  // Just set up for mounting
  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const loadEditor = async () => {
      if (!editor && typeof window !== "undefined") {
        const editorHolder = document.getElementById("editorjs");
        if (!editorHolder) return;

        const EJ = (await import("@editorjs/editorjs")).default;
        const EJHeader = (await import("@editorjs/header")).default;
        const EJList = (await import("@editorjs/list")).default;
        const EJImage = (await import("@editorjs/image")).default;
        const EJQuote = (await import("@editorjs/quote")).default;
        const EJEmbed = (await import("@editorjs/embed")).default;
        const EJCode = (await import("@editorjs/code")).default;
        const EJTable = (await import("@editorjs/table")).default;

        EditorJS = EJ;
        Header = EJHeader;
        List = EJList;
        ImageTool = EJImage;
        Quote = EJQuote;
        Embed = EJEmbed;
        Code = EJCode;
        Table = EJTable;

        const newEditor = new EditorJS({
          holder: "editorjs",
          tools: {
            header: Header,
            list: List,
            image: {
              class: ImageTool,
              config: {
                uploader: {
                  uploadByFile: async (file: File) => {
                    // Here, first upload the image to your server
                    const formData = new FormData();
                    formData.append("image", file);

                    const response = await axios.post(`${api_url}image`, formData, {
                      headers: { "Content-Type": "multipart/form-data" },
                    });

                    // Once the image is uploaded, update the preview with the uploaded image URL
                    const uploadedImageUrl = response.data.url;
                    setImagePreview(uploadedImageUrl); // Display uploaded image URL in the preview

                    return {
                      success: 1,
                      file: {
                        url: uploadedImageUrl,
                        file: file,
                      },
                    };
                  },
                },
              },
            },
            quote: Quote,
            embed: Embed,
            code: Code,
            table: Table,
          },
          async onChange() {
            const data = await newEditor.save();
            setDescription(JSON.stringify(data.blocks));
          },
          data: {
            blocks: [],
          },
        });

        setEditor(newEditor);
      }
    };

    if (hasMounted) loadEditor();

    return () => {
      if (editor) {
        editor.destroy();
        setEditor(null);
      }
    };
  }, [hasMounted]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const savedData = await editor?.save();

      if (!savedData || !savedData.blocks) {
        toast.error("Failed to save the content. Please try again.");
        setLoading(false);
        return;
      }

      const uploadedImages = await Promise.all(
        savedData.blocks.map(async (block: any) => {
          if (block.type === "image" && block.data.file && block.data.file instanceof File) {
            const formData = new FormData();
            formData.append("image", block.data.file);

            const response = await axios.post(`${api_url}image`, formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });

            return {
              oldFile: block.data.file,
              url: response.data.url,
            };
          }
          return null;
        })
      );

      const updatedBlocks = savedData.blocks.map((block: any) => {
        if (block.type === "image" && block.data.file && block.data.file instanceof File) {
          const uploaded = uploadedImages.find(
            (u) => u && u.oldFile === block.data.file
          );

          if (uploaded) {
            return {
              ...block,
              data: {
                ...block.data,
                file: {
                  url: uploaded.url,
                },
              },
            };
          }
        }

        return block;
      });

      const payload = {
        title,
        description,
        modules: selectedModules.map((mod, index) => ({
          moduleId: mod._id,
          order: index + 1,
        })),
        content: {
          ...savedData,
          blocks: updatedBlocks,
        },
      };

      await axios.post(`${api_url}pages`, payload);
      toast.success("Page created!");
      router.push("/admin/pages");
    } catch (err) {
      toast.error("Failed to create page.");
      console.error("Error submitting page", err);
    }
    setLoading(false);
  };

  const addModule = useCallback(
    (module: ModuleItem) => {
      if (!selectedModules.find((m) => m._id === module._id)) {
        setSelectedModules((prev) => [...prev, module]);
      }
    },
    [selectedModules]
  );

  const removeModule = useCallback(
    (moduleId: string) => {
      setSelectedModules((prev) => prev.filter((mod) => mod._id !== moduleId));
    },
    [selectedModules]
  );

  const moveModule = useCallback(
    (fromIndex: number, toIndex: number) => {
      const updatedModules = [...selectedModules];
      const [movedModule] = updatedModules.splice(fromIndex, 1);
      updatedModules.splice(toIndex, 0, movedModule);
      setSelectedModules(updatedModules);
    },
    [selectedModules]
  );

  if (!hasMounted) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8 bg-gray-50 rounded-lg shadow-md">
      <h1 className="text-4xl font-bold text-gray-800">Create New Page</h1>

      <input
        type="text"
        placeholder="Enter page title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Page Content
        </label>
        <div
          id="editorjs"
          className="border rounded-md py-4 bg-white min-h-[200px]"
        />
        {imagePreview && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700">Image Preview</h4>
            <img
              src={imagePreview}
              alt="Image preview"
              className="max-w-full h-auto mt-2 rounded-md"
            />
          </div>
        )}
      </div>

      <div className="pt-6">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-all disabled:opacity-50"
        >
          {loading ? "Publishing..." : "Publish Page"}
        </button>
      </div>
    </div>
  );
};

export default Create;
