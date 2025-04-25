import { useRef, useLayoutEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import { GripVertical, Trash2 } from "lucide-react";

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
  const ref = useRef<HTMLDivElement | null>(null);

  const [, drop] = useDrop({
    accept: "MODULE",
    hover(item: { index: number }) {
      if (item.index !== index) {
        moveModule(item.index, index); // Move the item when hovered
      }
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

  // Attach drag/drop behavior to the ref
  useLayoutEffect(() => {
    if (ref.current) {
      drag(drop(ref.current));
    }
  }, [drag, drop]);

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

export default DraggableModule;
