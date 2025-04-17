  import React from 'react';
  import { Layout, X } from 'lucide-react';

  interface AddSectionModalProps {
    onClose: () => void;
    onSelect: (columns: number) => void;
  }

  export function AddSectionModal({ onClose, onSelect }: AddSectionModalProps) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Choose Layout</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((cols) => (
              <button
                key={cols}
                onClick={() => onSelect(cols)}
                className="w-full flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <Layout className="text-gray-600" />
                <span className="font-medium">{cols} Column{cols > 1 ? 's' : ''}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }