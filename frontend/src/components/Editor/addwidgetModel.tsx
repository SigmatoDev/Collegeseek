import React from 'react';
import { Type, AlignLeft, Square, Table, ChevronDown, Image, X } from 'lucide-react';

interface AddWidgetModalProps {
  onClose: () => void;
  onSelect: (type: string) => void;
}

const widgets = [
  { type: 'heading', icon: Type, label: 'Heading' },
  { type: 'text', icon: AlignLeft, label: 'Text Description' },
  { type: 'button', icon: Square, label: 'Button' },
  { type: 'table', icon: Table, label: 'Table' },
  { type: 'accordion', icon: ChevronDown, label: 'Accordion' },
  { type: 'image', icon: Image, label: 'Image' },
];

export function AddWidgetModal({ onClose, onSelect }: AddWidgetModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add Widget</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <div className="space-y-2">
          {widgets.map(({ type, icon: Icon, label }) => (
            <button
              key={type}
              onClick={() => onSelect(type)}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Icon className="text-gray-600" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}