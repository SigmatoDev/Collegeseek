"use client";

import { XCircle } from "lucide-react";
import { useEffect, useState } from "react";
const CollegeConsultationPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  useEffect(() => {
    const popupClosed = localStorage.getItem("collegePopupClosed");
    if (!popupClosed) {
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 2000); // 2 minutes delay
      return () => clearTimeout(timer);
    }
  }, []);
  const handleClose = () => {
    setShowPopup(false);
    localStorage.setItem("collegePopupClosed", "true");
  };
  if (!showPopup) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg p-6 relative flex">
        {/* Left Side - Text and Form */}
        <div className="w-1/2 p-6">
          <h2 className="text-2xl font-bold text-gray-800">Get College Consultation</h2>
          <p className="text-gray-600 mt-2">
            Fill out the form and our expert counselors will reach out to you.
          </p>
          {/* Form */}
          <form className="mt-4 space-y-4">
            <input type="text" placeholder="Your Name" className="w-full p-2 border rounded" />
            <input type="email" placeholder="Your Email" className="w-full p-2 border rounded" />
            <input type="tel" placeholder="Your Phone Number" className="w-full p-2 border rounded" />
            <button type="submit" className="w-full bg-[#581845] text-white p-2 rounded mt-2">
              Submit
            </button>
          </form>
        </div>
        {/* Right Side - Image */}
        <div className="w-1/2">
          <img
            src="image/4.avif"
            alt="Student"
            className="w-full h-full object-cover rounded-r-lg"
          />
        </div>
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-lg"
        >
          <XCircle className="w-5 h-5 text-gray-800" />
        </button>
      </div>
    </div>
  );
};
export default CollegeConsultationPopup;