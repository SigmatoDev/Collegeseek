'use client';

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { api_url } from "@/utils/apiCall";
import { toast } from "react-hot-toast";

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

const Edit = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [availableModules, setAvailableModules] = useState<ModuleItem[]>([]);
  const [selectedModules, setSelectedModules] = useState<ModuleItem[]>([]);
  const [editor, setEditor] = useState<any>(null);
  const [hasMounted, setHasMounted] = useState(false);

  const router = useRouter();

  // Prevent hydration mismatch
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Fetch all modules (used for selection, if needed)
  useEffect(() => {
    if (!hasMounted) return;

    const controller = new AbortController();
    axios.get(`${api_url}modules`, { signal: controller.signal })
      .then((res) => {
        if (Array.isArray(res.data.modules)) {
          setAvailableModules(res.data.modules);
          console.log("✅ Modules fetched:", res.data.modules);
        }
      })
      .catch((err) => {
        if (!axios.isCancel(err)) {
          console.error("❌ Failed to fetch modules:", err);
          toast.error("Failed to load modules");
        }
      });

    return () => controller.abort();
  }, [hasMounted]);

  // Initialize EditorJS and tools
  useEffect(() => {
    const loadEditor = async () => {
      if (editor || typeof window === "undefined") return;

      try {
        const [
          { default: Editor },
          { default: EJHeader },
          { default: EJList },
          { default: EJImage },
          { default: EJQuote },
          { default: EJEmbed },
          { default: EJCode },
          { default: EJTable }
        ] = await Promise.all([
          import("@editorjs/editorjs"),
          import("@editorjs/header"),
          import("@editorjs/list"),
          import("@editorjs/image"),
          import("@editorjs/quote"),
          import("@editorjs/embed"),
          import("@editorjs/code"),
          import("@editorjs/table")
        ]);

        EditorJS = Editor;
        Header = EJHeader;
        List = EJList;
        ImageTool = EJImage;
        Quote = EJQuote;
        Embed = EJEmbed;
        Code = EJCode;
        Table = EJTable;

        const instance = new EditorJS({
          holder: "editorjs",
          tools: {
            header: Header,
            list: List,
            quote: Quote,
            embed: Embed,
            code: Code,
            table: Table,
            image: {
              class: ImageTool,
              config: {
                uploader: {
                  uploadByFile: async (file: File) => {
                    console.log("📷 Uploading image:", file.name);
                    return new Promise((resolve) => {
                      const url = URL.createObjectURL(file);
                      const img = document.createElement("img");
                      img.src = url;
                      img.style.maxWidth = "200px";

                      const previewContainer = document.getElementById("preview-container");
                      if (previewContainer) {
                        previewContainer.innerHTML = "Loading preview...";
                        img.onload = () => {
                          previewContainer.innerHTML = "";
                          previewContainer.appendChild(img);
                          console.log("✅ Image preview loaded");
                        };
                      }

                      resolve({ success: 1, file: { url } });
                    });
                  }
                }
              }
            }
          },
          data: { blocks: [] },
        });

        console.log("✅ EditorJS initialized");
        setEditor(instance);
      } catch (err) {
        console.error("❌ Error initializing EditorJS:", err);
      }
    };

    if (hasMounted) loadEditor();

    return () => {
      if (editor && editor.destroy) {
        editor.destroy();
        setEditor(null);
        console.log("🧹 EditorJS destroyed");
      }
    };
  }, [hasMounted]);

  // Load page data for editing
useEffect(() => {
  if (!editor || !id) return;

  const loadPage = async () => {
    try {
      const res = await axios.get(`${api_url}id/pages/${id}`);
      const pageData = res.data;

      setTitle(pageData.title || "");
      setSelectedModules(pageData.modules || []);

      // ─── Parse the description JSON into blocks ──────────────────────────────
      let blocks = [];
      try {
        blocks = JSON.parse(pageData.description);
        console.log("Parsed blocks from description:", blocks);
      } catch (err) {
        console.error("Failed to parse description JSON:", err);
      }

      // ─── Render into Editor.js when it's ready ────────────────────────────────
      await editor.isReady;
      if (blocks.length) {
        editor.blocks.render({ blocks });
        console.log("Rendered parsed description blocks");
      }
    } catch (err) {
      console.error("Failed to load page for edit:", err);
      toast.error("Failed to load page");
    }
  };

  loadPage();
}, [id, editor]);


  // Handle Save/Update
  const handleSubmit = async () => {
    if (!editor) return;
    setLoading(true);

    try {
      console.log("💾 Saving content...");
      const savedData = await editor.save();

      const payload = {
        title,
        modules: selectedModules.map((mod, i) => ({
          moduleId: mod._id,
          order: i + 1,
        })),
        content: savedData,
      };

      console.log("📤 Payload:", payload);

      await axios.put(`${api_url}id/pages/${id}`, payload);
      toast.success("Page updated successfully");
      router.push("/admin/pages");
    } catch (err) {
      console.error("❌ Failed to save:", err);
      toast.error("Error saving page");
    } finally {
      setLoading(false);
    }
  };

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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Page Content</label>
        <div id="editorjs" className="border rounded-md py-4 bg-white min-h-[200px]" />
        <div id="preview-container" className="mt-4" />
      </div>

      <button
        className={`mt-6 px-6 py-3 text-white rounded-md ${
          loading ? "bg-gray-500" : "bg-blue-600"
        }`}
        disabled={loading}
        onClick={handleSubmit}
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
};

export default Edit;
