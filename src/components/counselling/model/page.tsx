import { XCircle } from "lucide-react";
import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 transition-opacity animate-fadeIn">
      <div className="relative p-6 bg-white rounded-xl w-full max-w-[770px]  shadow-lg transform scale-95 transition-transform animate-scaleUp">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-xl font-bold"
        >
          <XCircle className="w-7 h-7 text-gray-800 hover:text-[#581845]" />
          </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
