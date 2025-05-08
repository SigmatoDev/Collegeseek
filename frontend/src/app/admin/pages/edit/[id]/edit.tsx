'use client';

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { api_url } from "@/utils/apiCall";
import { toast } from "react-hot-toast";
import dynamic from "next/dynamic";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// Dynamically import EditorJS tools on client side only
const DraggableModule = dynamic(() => import('@/components/editor/draggableComponent'), { ssr: false });

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
  const { id } = useParams(); // Get page ID from URL
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [availableModules, setAvailableModules] = useState<ModuleItem[]>([]);
  const [selectedModules, setSelectedModules] = useState<ModuleItem[]>([]);
  const [editor, setEditor] = useState<any>(null);
  const [hasMounted, setHasMounted] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setHasMounted(true);

    const controller = new AbortController();

    // Fetch available modules
    axios.get(`${api_url}modules`, { signal: controller.signal })
      .then((res) => {
        console.log("Available Modules Response:", res); // Log response
        if (Array.isArray(res.data.modules)) {
          setAvailableModules(res.data.modules);
        }
      })
      .catch((err) => {
        if (!axios.isCancel(err)) {
          toast.error("Failed to load modules");
          console.error("Error loading modules:", err); // Log error
        }
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const loadEditor = async () => {
      if (!editor && typeof window !== "undefined") {
        const editorHolder = document.getElementById("editorjs");
        if (!editorHolder) return;

        const EJ = (await import('@editorjs/editorjs')).default;
        const EJHeader = (await import('@editorjs/header')).default;
        const EJList = (await import('@editorjs/list')).default;
        const EJImage = (await import('@editorjs/image')).default;
        const EJQuote = (await import('@editorjs/quote')).default;
        const EJEmbed = (await import('@editorjs/embed')).default;
        const EJCode = (await import('@editorjs/code')).default;
        const EJTable = (await import('@editorjs/table')).default;

        console.log("EditorJS and Tools Loaded"); // Log editor and tools loaded

        EditorJS = EJ;
        Header = EJHeader;
        List = EJList;
        ImageTool = EJImage;
        Quote = EJQuote;
        Embed = EJEmbed;
        Code = EJCode;
        Table = EJTable;

        const newEditor = new EditorJS({
          holder: 'editorjs',
          tools: {
            header: Header,
            list: List,
            image: {
              class: ImageTool,
              config: {
                uploader: {
                  uploadByFile: async (file: File) => {
                    console.log("Uploading file:", file); // Log file upload attempt
                    return new Promise((resolve) => {
                      const url = URL.createObjectURL(file);
                      const previewImage = document.createElement("img");
                      previewImage.src = url;
                      previewImage.style.maxWidth = "200px";
                      previewImage.style.maxHeight = "200px";
                      previewImage.style.margin = "10px";
                      previewImage.style.objectFit = "cover";

                      const previewContainer = document.getElementById("preview-container");
                      if (previewContainer) {
                        previewContainer.innerHTML = "Loading preview...";
                      }

                      previewImage.onload = () => {
                        if (previewContainer) {
                          previewContainer.innerHTML = "";
                          previewContainer.appendChild(previewImage);
                        }

                        resolve({
                          success: 1,
                          file: {
                            url: url,
                          },
                        });
                      };
                    });
                  },
                },
              },
            },
            quote: Quote,
            embed: Embed,
            code: Code,
            table: Table,
          },
          data: {
            blocks: [], // Initially empty, will populate with current page content
          },
        });

        setEditor(newEditor);
      }
    };

    if (hasMounted) loadEditor();

    return () => {
      if (editor) {
        console.log("Destroying editor..."); // Log editor destruction
        editor.destroy();
        setEditor(null);
      }
    };
  }, [hasMounted]);

  useEffect(() => {
    // Fetch the page data for editing
    if (id) {
      axios.get(`${api_url}id/pages/${id}`)
        .then((response) => {
          const pageData = response.data;
          console.log("Page Data:", pageData); // Debug log
  
          setTitle(pageData.title);
          setDescription(pageData.description);
          setSelectedModules(pageData.modules); // Assume `modules` is part of the page data
  
          // Ensure the content is in the correct format
          const content = pageData.content && pageData.content.blocks ? pageData.content : { blocks: [] };
          if (editor) {
            editor.render(content); // Render saved content in the editor
            console.log("Rendered Content:", content); // Debug log
          }
        })
        .catch((error) => {
          toast.error("Failed to load page data.");
          console.error("Error loading page:", error);
        });
    }
  }, [id, editor]);
  

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const savedData = await editor?.save();

      console.log("Saved Data:", savedData); // Log saved data from editor

      if (!savedData || !savedData.blocks) {
        toast.error("Failed to save the content. Please try again.");
        setLoading(false);
        return;
      }

      const imageBlocks = savedData.blocks.filter(
        (block: any) => block.type === "image" && block.data.file && block.data.file instanceof File
      );

      console.log("Image Blocks:", imageBlocks); // Log image blocks before upload

      const uploadedImages = await Promise.all(
        imageBlocks.map(async (block: any) => {
          const formData = new FormData();
          formData.append("image", block.data.file);

          const response = await axios.post(`${api_url}image`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          return {
            oldFile: block.data.file,
            url: response.data.url,
          };
        })
      );

      console.log("Uploaded Images:", uploadedImages); // Log uploaded images

      const updatedBlocks = savedData.blocks.map((block: any) => {
        if (block.type === "image") {
          const uploaded = uploadedImages.find(u => u.oldFile === block.data.file);
          if (uploaded) {
            return {
              ...block,
              data: {
                file: { url: uploaded.url },
                caption: block.data.caption || "",
                withBorder: block.data.withBorder || false,
                withBackground: block.data.withBackground || false,
                stretched: block.data.stretched || false,
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

      console.log("Payload to Update Page:", payload); // Log payload before update

      await axios.put(`${api_url}id/pages/${id}`, payload); // Use PUT or PATCH for update
      toast.success("Page updated!");
      router.push("/admin/pages");
    } catch (err) {
      toast.error("Failed to update page.");
      console.error("Error submitting page", err); // Log submission error
    }
    setLoading(false);
  };

  const addModule = useCallback((module: ModuleItem) => {
    console.log("Adding module:", module); // Log added module
    if (!selectedModules.find((m) => m._id === module._id)) {
      setSelectedModules((prev) => [...prev, module]);
    }
  }, [selectedModules]);

  const removeModule = useCallback((moduleId: string) => {
    console.log("Removing module:", moduleId); // Log removed module
    setSelectedModules((prev) => prev.filter((mod) => mod._id !== moduleId));
  }, [selectedModules]);

  const moveModule = useCallback((fromIndex: number, toIndex: number) => {
    console.log(`Moving module from index ${fromIndex} to index ${toIndex}`); // Log module move
    const updatedModules = [...selectedModules];
    const [movedModule] = updatedModules.splice(fromIndex, 1);
    updatedModules.splice(toIndex, 0, movedModule);
    setSelectedModules(updatedModules);
  }, [selectedModules]);

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
      
      
      
   

      <DndProvider backend={HTML5Backend}>
        <div className="space-y-3">
          {selectedModules.map((mod, index) => (
            <DraggableModule
              key={mod._id}
              mod={mod}
              index={index}
              moveModule={moveModule}
              onRemove={() => removeModule(mod._id)}
            />
          ))}
        </div>
      </DndProvider>

      <div className="pt-6">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-all disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Page"}
        </button>
      </div>
    </div>
  );
};

export default Edit;
