import { TrashIcon } from "@heroicons/react/24/solid";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  message,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80">
        <div className="flex flex-col items-center space-y-4">
          <TrashIcon className="w-8 h-8 text-red-500" />
          <p className="text-center text-gray-700">{message}</p>
          <div className="flex space-x-4 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
