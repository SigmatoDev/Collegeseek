// CustomToast.tsx
import React from "react";
import { CheckCircle, AlertCircle, X } from "lucide-react"; // Optional: use any icon library

const CustomToast = ({
  message,
  onClose,
  type = "info", // info | success | error
}: {
  message: string;
  onClose: () => void;
  type?: "info" | "success" | "error";
}) => {
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="text-green-500 w-5 h-5" />;
      case "error":
        return <AlertCircle className="text-red-500 w-5 h-5" />;
      default:
        return <AlertCircle className="text-blue-500 w-5 h-5" />;
    }
  };

  return (
    <div className="toast-container mt-[90px] mr-[20px] shadow-lg bg-white text-gray-800 rounded-lg p-4 flex items-start gap-3 w-[300px] animate-fade-in border border-gray-200">
      {getIcon()}
      <div className="flex-1 text-sm">{message}</div>
      <button
        onClick={onClose}
        aria-label="Close notification"
        className="ml-2 text-gray-400 hover:text-gray-700"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default CustomToast;

