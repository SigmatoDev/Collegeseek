// import { XCircle } from "lucide-react";
// import { ReactNode } from "react";

// interface ModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   children: ReactNode;
// }

// const Modal = ({ isOpen, onClose, children }: ModalProps) => {
//   if (!isOpen) return null;

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
//       onClick={onClose}
//     >
//       <div
//         className="relative w-full max-w-3xl rounded-2xl bg-white p-4 sm:p-6 border border-gray-100"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Close Button */}
//         <button
//           onClick={onClose}
//           className="absolute top-3 right-3 text-gray-600 hover:text-red-600"
//           aria-label="Close Modal"
//         >
//           <XCircle className="w-7 h-7 text-gray-800 hover:text-[#581845]" />
//         </button>

//         {children}
//       </div>
//     </div>
//   );
// };

// export default Modal;
"use client";

import { XCircle } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  const [visible, setVisible] = useState(false);
  const [animate, setAnimate] = useState(false);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setVisible(true);
      // small delay so CSS transition has a starting state to transition from
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimate(true));
      });
    } else {
      setAnimate(false);
      // wait for exit animation before unmounting
      const t = setTimeout(() => {
        setVisible(false);
        document.body.style.overflow = "";
      }, 300);
      return () => clearTimeout(t);
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      style={{
        // Backdrop fade
        background: animate ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0)",
        backdropFilter: animate ? "blur(4px)" : "blur(0px)",
        transition: "background 0.3s ease, backdrop-filter 0.3s ease",
      }}
      onClick={onClose}
    >
      <div
        className="relative w-full bg-white border border-gray-100 overflow-y-auto
          rounded-t-3xl max-h-[90vh] p-4
          sm:rounded-2xl sm:max-w-3xl sm:max-h-[90vh] sm:p-6
        "
        style={{
          // Mobile: slide up from bottom
          // Desktop: scale + fade in from center
          transform: animate
            ? "translateY(0) scale(1)"
            : "translateY(100%) scale(0.98)",
          opacity: animate ? 1 : 0,
          transition: "transform 0.35s cubic-bezier(0.34,1.2,0.64,1), opacity 0.25s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle — mobile only */}
        <div className="sm:hidden mx-auto mb-3 h-1 w-10 rounded-full bg-gray-300" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-red-600 z-10"
          aria-label="Close Modal"
        >
          <XCircle className="w-7 h-7 text-gray-800 hover:text-[#581845]" />
        </button>

        {children}
      </div>
    </div>
  );
};

export default Modal;