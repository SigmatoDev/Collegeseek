"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { api_url } from "@/utils/apiCall";
import { toast } from "react-hot-toast";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { GripVertical, Trash2 } from "lucide-react";
import EditorComponent from "@/components/Editor/Editor";
import DraggableModule from "@/components/Editor/DraggableComponent";

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
  const router = useRouter();
  const [availableModules, setAvailableModules] = useState<ModuleItem[]>([]);
  const [selectedModules, setSelectedModules] = useState<ModuleItem[]>([]);

  const mountedRef = useRef(true);  // Create a ref to track if the component is mounted


  // Fetch available modules when the component mounts
  useEffect(() => {
    let mounted = true; // Flag to track if the component is still mounted

    axios
      .get(`${api_url}modules`)
      .then((res) => {
        if (mounted) {
          setAvailableModules(res.data.modules); // Set available modules only if the component is mounted
        }
      })
      .catch(() => {
        if (mounted) {
          toast.error("Failed to load modules");
        }
      });

    // Cleanup function to set mounted flag to false when component unmounts
    return () => {
      mounted = false;
    };
  }, []); // Only runs once when the component mounts

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

      // Debugging: Check the payload being sent to the server
      console.log("Payload being sent:", payload);

      // Send the POST request to create the page
      const { data } = await axios.post(`${api_url}pages`, payload);
      console.log("pages call",data)
      toast.success("Page created!");
      router.push("/admin/pages"); // Redirect to the pages list
    } catch (err) {
      toast.error("Failed to create page.");
      console.error("Error submitting page", err); // Log error for debugging
    }
    setLoading(false); // Hide loading state after submission
  };

  const addModule = (module: ModuleItem) => {
    if (!selectedModules.find((m) => m._id === module._id)) {
      setSelectedModules((prev) => [...prev, module]); // Add module to the selected list
    }
  };

  const removeModule = (moduleId: string) => {
    setSelectedModules(selectedModules.filter((mod) => mod._id !== moduleId)); // Remove module from the selected list
  };

  const moveModule = (fromIndex: number, toIndex: number) => {
    const updatedModules = [...selectedModules];
    const [movedModule] = updatedModules.splice(fromIndex, 1);
    updatedModules.splice(toIndex, 0, movedModule);
    setSelectedModules(updatedModules); // Reorder modules
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-4">
      <h1 className="text-2xl font-bold">Create New Page</h1>

      {/* Page Title Input */}
      <input
        type="text"
        placeholder="Page Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border px-4 py-2 w-full rounded"
      />

      {/* Editor Component for Description */}
      <EditorComponent value={description} onChange={setDescription} />

      <DndProvider backend={HTML5Backend}>
        <div className="mt-6 space-y-4">
          <label className="block text-sm font-medium">Add Modules</label>

          {/* Available Modules List */}
          <div className="flex flex-wrap gap-2">
            {availableModules.map((mod) => (
              <button
                key={mod._id}
                className="bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300"
                onClick={() => addModule(mod)} // Add module to selected list
              >
                {mod.title}
              </button>
            ))}
          </div>

          {/* Selected Modules List (Draggable) */}
          <div className="space-y-2">
            {selectedModules.map((mod, index) => (
              <DraggableModule
                key={mod._id}
                mod={mod}
                index={index}
                moveModule={moveModule} // Handle reordering of modules
                onRemove={() => removeModule(mod._id)} // Remove module from selected list
              />
            ))}
          </div>
        </div>
      </DndProvider>

      {/* Publish Button */}
      <button
        onClick={handleSubmit} // Trigger the handleSubmit function
        disabled={loading} // Disable the button while loading
        className="bg-blue-600 text-white px-6 py-2 rounded mt-4"
      >
        {loading ? "Publishing..." : "Publish Page"} {/* Show loading text when submitting */}
      </button>
    </div>
  );
};

export default CreatePage;
