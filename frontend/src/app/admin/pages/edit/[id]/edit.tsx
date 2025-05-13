"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import axios from "axios";
import { api_url, img_url } from "@/utils/apiCall";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import ImageTool from "@editorjs/image";
import Quote from "@editorjs/quote";
import Embed from "@editorjs/embed";
import Code from "@editorjs/code";
import Table from "@editorjs/table";

const EditPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editor, setEditor] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  // Safely extract slug from params
  const { id } = useParams();

  const router = useRouter();

  // Fetch page data by slug
  const fetchPage = async () => {
    try {
      const response = await axios.get(`${api_url}pages/by/id/${id}`);
      const page = response.data;
      console.log("Modified savedData:", response);

      setTitle(page.title);
      setDescription(page.description);

      let savedData = page.content;

      // Modify image URLs if needed
      if (savedData) {
        savedData = await modifyImageUrls(savedData);
      }

      // Initialize Editor.js with fetched content
      const newEditor = new EditorJS({
        holder: "editorjs",
        data: savedData,
        tools: {
          header: {
            class: Header as any,
            inlineToolbar: true,
            config: {
              placeholder: "Enter header here",
            },
          },
          list: {
            class: List as any,
            inlineToolbar: true,
            config: {
              type: "unordered",
            },
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                      resolve({
                        success: 1,
                        file: {
                          url: reader.result as string,
                        },
                      });
                    };
                    reader.onerror = () => {
                      reject({
                        success: 0,
                        message: "Failed to load image preview",
                      });
                    };
                    reader.readAsDataURL(file);
                  });
                },
              },
            },
          },
          quote: {
            class: Quote,
            inlineToolbar: true,
          },
          embed: {
            class: Embed,
            inlineToolbar: true,
          },
          code: {
            class: Code,
            inlineToolbar: true,
          },
          table: {
            class: Table as any,
            config: {
              rows: 3,
              cols: 3,
              tableStyles: {
                width: "100%",
                border: "1px solid #ccc",
              },
            },
          },
        },
      });

      setEditor(newEditor);
    } catch (error) {
      console.error("Error fetching page:", error);
      toast.error("Error loading page data.");
    }
  };

  // Modify image URLs in the editor content
  const modifyImageUrls = async (data: any) => {
    if (!data) return data;

    // Check if it's an array of blocks (EditorJS data)
    if (Array.isArray(data.blocks)) {
      for (let block of data.blocks) {
        if (
          block.type === "image" &&
          block.data &&
          block.data.file &&
          block.data.file.url
        ) {
          // Replace image URL with the new path format
          block.data.file.url = block.data.file.url.replace(
            /\/uploads/g,
            `${img_url}uploads`
          );
        }
      }
    }

    return data;
  };

  // Submit the edited page content
  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      toast.error("Title and description are required.");
      return;
    }

    setLoading(true);

    try {
      const savedData = await editor?.save();

      const dataToSubmit = {
        title,
        description,
        content: savedData,
      };

      const response = await axios.put(
        `${api_url}updatePage/by/${id}`,
        dataToSubmit
      );

      if (response.status === 200) {
        toast.success("Page updated successfully!");
        router.push("/admin/pages");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Error updating the page.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setHasMounted(true);
    if (id) {
      fetchPage(); // No need to pass id here
    }
  }, [id]);

  // Only render after the component is mounted
  if (!hasMounted) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8 bg-gray-50 rounded-lg shadow-md">
      <h1 className="text-4xl font-bold text-gray-800">Edit Page</h1>

      <input
        type="text"
        placeholder="Enter page title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
      />

      <textarea
        placeholder="Enter page description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Page Content
        </label>
        <div id="editorjs" className="border rounded-md py-4 min-h-[200px]" />
      </div>

      <div className="pt-6">
        <button
          disabled={loading}
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-all disabled:opacity-50"
        >
          {loading ? "Saving..." : "Update Page"}
        </button>
      </div>
    </div>
  );
};

export default EditPage;
