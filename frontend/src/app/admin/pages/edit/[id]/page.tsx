"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { api_url } from "@/utils/apiCall";
import { toast } from "react-hot-toast";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { GripVertical, Trash2 } from "lucide-react";

const CustomEditor = dynamic(() => import("@/components/editor/editor"), { ssr: false });

interface ModuleItem {
  _id: string;
  title: string;
  type: string;
  content: any;
}

const EditPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [availableModules, setAvailableModules] = useState<ModuleItem[]>([]);
  const [selectedModules, setSelectedModules] = useState<ModuleItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadPage = async () => {
      try {
        const { data } = await axios.get(`${api_url}pages/${id}`);
        setTitle(data.page.title);
        setDescription(data.page.description);
        setSelectedModules(
          data.page.modules.map((m: any) => m.moduleId) // assume populated moduleId
        );
      } catch (err) {
        toast.error("Failed to load page.");
      }
    };

    const loadModules = async () => {
      try {
        const { data } = await axios.get(`${api_url}admin/modules`);
        setAvailableModules(data.modules);
      } catch {
        toast.error("Failed to fetch modules.");
      }
    };

    loadPage();
    loadModules();
  }, [id]);

  const handleUpdate = async () => {
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

      await axios.put(`${api_url}admin/pages/${id}`, payload);
      toast.success("Page updated!");
      router.push("/admin/pages");
    } catch {
      toast.error("Failed to update.");
    }
    setLoading(false);
  };

  const addModule = (mod: ModuleItem) => {
    if (!selectedModules.find((m) => m._id === mod._id)) {
      setSelectedModules([...selectedModules, mod]);
    }
  };

  const moveModule = (from: number, to: number) => {
    const updated = [...selectedModules];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setSelectedModules(updated);
  };

  const removeModule = (id: string) => {
    setSelectedModules(selectedModules.filter((mod) => mod._id !== id));
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-4">
      <h1 className="text-2xl font-bold">Edit Page</h1>

      <input
        type="text"
        className="border px-4 py-2 w-full rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Page Title"
      />

      <CustomEditor value={description} onChange={setDescription} />

      <DndProvider backend={HTML5Backend}>
        <div className="mt-6 space-y-4">
          <label className="block text-sm font-medium">Add Modules</label>
          <div className="flex flex-wrap gap-2">
            {availableModules.map((mod) => (
              <button
                key={mod._id}
                className="bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300"
                onClick={() => addModule(mod)}
              >
                {mod.title}
              </button>
            ))}
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
        onClick={handleUpdate}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded mt-4"
      >
        {loading ? "Saving..." : "Update Page"}
      </button>
    </div>
  );
};

export default EditPage;


interface ModuleItem {
    _id: string;
    title: string;
    type: string;
    content: any;
  }
  
  interface DraggableModuleProps {
    mod: ModuleItem;
    index: number;
    moveModule: (from: number, to: number) => void;
    onRemove: () => void;
  }
  
  const DraggableModule = ({ mod, index, moveModule, onRemove }: DraggableModuleProps) => {
    const ref = useRef<HTMLDivElement>(null);
  
    const [, drop] = useDrop({
      accept: "MODULE",
      hover(item: { index: number }) {
        if (item.index !== index) moveModule(item.index, index);
        item.index = index;
      },
    });
  
    const [{ isDragging }, drag] = useDrag(() => ({
      type: "MODULE",
      item: { index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }));
  
    drag(drop(ref));
  
    return (
      <div
        ref={ref}
        className={`flex items-center justify-between border px-3 py-2 rounded bg-white shadow ${
          isDragging ? "opacity-50" : ""
        }`}
      >
        <div className="flex items-center gap-2">
          <GripVertical className="cursor-move" />
          <span>{mod.title}</span>
        </div>
        <button onClick={onRemove}>
          <Trash2 size={16} className="text-red-500" />
        </button>
      </div>
    );
  };