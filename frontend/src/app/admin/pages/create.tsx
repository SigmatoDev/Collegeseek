'use client';

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { api_url } from "@/utils/apiCall";
import { toast } from "react-hot-toast";
import dynamic from "next/dynamic";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// Dynamically import client-only components
const EditorComponent = dynamic(() => import('@/components/editor/Editor'), {
  ssr: false,
});const DraggableModule = dynamic(() => import('@/components/editor/DraggableComponent'), { ssr: false });

interface ModuleItem {
  _id: string;
  title: string;
  type: string;
  content: any;
}

const CreatePage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [availableModules, setAvailableModules] = useState<ModuleItem[]>([]);
  const [selectedModules, setSelectedModules] = useState<ModuleItem[]>([]);
  const [hasMounted, setHasMounted] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setHasMounted(true);

    const controller = new AbortController();
    axios
      .get(`${api_url}modules`, { signal: controller.signal })
      .then((res) => {
        if (Array.isArray(res.data.modules)) {
          setAvailableModules(res.data.modules);
        }
      })
      .catch((err) => {
        if (!axios.isCancel(err)) {
          toast.error("Failed to load modules");
        }
      });

    return () => controller.abort();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        title,
        description,
        modules: selectedModules.map((mod, index) => ({
          moduleId: mod._id,
          order: index + 1,
        })),
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

  const addModule = useCallback((module: ModuleItem) => {
    if (!selectedModules.find((m) => m._id === module._id)) {
      setSelectedModules((prev) => [...prev, module]);
    }
  }, [selectedModules]);

  const removeModule = useCallback((moduleId: string) => {
    setSelectedModules((prev) => prev.filter((mod) => mod._id !== moduleId));
  }, [selectedModules]);

  const moveModule = useCallback((fromIndex: number, toIndex: number) => {
    const updatedModules = [...selectedModules];
    const [movedModule] = updatedModules.splice(fromIndex, 1);
    updatedModules.splice(toIndex, 0, movedModule);
    setSelectedModules(updatedModules);
  }, [selectedModules]);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  
  if (!hasMounted) return null;

  return (
    <div className="container mx-auto px-4 py-6 space-y-4">
      <h1 className="text-2xl font-bold">Create New Page</h1>

      <input
        type="text"
        placeholder="Page Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border px-4 py-2 w-full rounded"
      />

      <EditorComponent
        value={description}
        onChange={(newDescription) => setDescription(newDescription)}
      />

      <DndProvider backend={HTML5Backend}>
        <div className="mt-6 space-y-4">
          <label className="block text-sm font-medium">Add Modules</label>

          <div className="flex flex-wrap gap-2">
            {availableModules.length > 0 ? (
              availableModules.map((mod) => (
                <button
                  key={mod._id}
                  className="bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300"
                  onClick={() => addModule(mod)}
                >
                  {mod.title}
                </button>
              ))
            ) : (
              <p>No modules available.</p>
            )}
          </div>

          <div className="space-y-2">
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
        </div>
      </DndProvider>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded mt-4"
      >
        {loading ? "Publishing..." : "Publish Page"}
      </button>
    </div>
  );
};

export default CreatePage;
