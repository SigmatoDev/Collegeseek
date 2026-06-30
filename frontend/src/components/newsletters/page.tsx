"use client";

import { api_url } from "@/utils/apiCall";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon, PhoneIcon, UserIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { colors } from "@/theme/colors";

export default function CallbackForm() {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    stream: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    if (name === "name") {
      if (/^[a-zA-Z\s]*$/.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    try {
      const response = await fetch(`${api_url}/callback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage("Callback request submitted successfully!");
        setFormData({ name: "", mobile: "", email: "", stream: "" });
      } else {
        setMessage(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setMessage("Server error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* ══════════════════════════════════════════
          MOBILE layout
      ══════════════════════════════════════════ */}
      <div className="sm:hidden py-12 px-4" style={{ backgroundColor: "#fdfeff" }}>
        <div className="max-w-4xl mx-auto rounded-3xl bg-white shadow-xl border overflow-hidden" style={{ borderColor: colors.accent.orange + '30' }}>
          {/* Decorative top gradient strip */}
          <div className="h-1.5 w-full" style={{ background: `linear-gradient(to right, ${colors.accent.orange}, ${colors.accent.red})` }} />

          <div className="px-5 pt-5 pb-6 space-y-5">
            {/* Header */}
            <div className="space-y-1 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: colors.accent.red }}>
                Still Confused?
              </p>
              <h2 className="text-lg font-bold leading-snug" style={{ color: colors.primary.dark }}>
                We're Here to Help You.
              </h2>
              <p className="text-xs text-gray-500 leading-relaxed">
                Get personalized guidance from our expert counsellors and take the right step towards your dream future.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Full Name */}
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 transition placeholder:text-gray-400"
                  style={{ borderColor: colors.accent.orange + '40' }}
                  required
                />
              </div>

              {/* Mobile Number */}
              <div className="relative">
                <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="tel"
                  name="mobile"
                  placeholder="Mobile Number"
                  value={formData.mobile}
                  onChange={handleChange}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={10}
                  minLength={10}
                  onKeyDown={(e) => {
                    if (
                      !/[0-9]/.test(e.key) &&
                      ![
                        "Backspace",
                        "Tab",
                        "ArrowLeft",
                        "ArrowRight",
                        "Delete",
                      ].includes(e.key)
                    ) {
                      e.preventDefault();
                    }
                  }}
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 transition placeholder:text-gray-400"
                  style={{ borderColor: colors.accent.orange + '40' }}
                  required
                />
              </div>

              {/* Email ID */}
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email ID"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 transition placeholder:text-gray-400"
                  style={{ borderColor: colors.accent.orange + '40' }}
                  required
                />
              </div>

              {/* Select Your Interest */}
              <div className="relative">
                <select
                  name="stream"
                  value={formData.stream}
                  onChange={handleChange}
                  className="w-full pl-4 pr-9 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 transition text-gray-600 appearance-none"
                  style={{ borderColor: colors.accent.orange + '40' }}
                  required
                >
                  <option value="" disabled>
                    Select Your Interest
                  </option>
                  <option value="Engineering">Engineering</option>
                  <option value="Business">Business</option>
                  <option value="Medical">Medical</option>
                  <option value="Arts">Arts & Humanities</option>
                  <option value="Science">Science</option>
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Get Free Counselling */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-2xl text-sm font-bold text-white shadow-lg active:scale-[0.98] transition-all disabled:opacity-60"
                style={{
                  background: `linear-gradient(to right, ${colors.accent.orange}, ${colors.accent.red})`,
                  boxShadow: `0 8px 25px ${colors.accent.red}40`
                }}
              >
                {isSubmitting ? "Submitting..." : "Get Free Counselling"}
              </button>
            </form>

            {message && (
              <p
                className={`text-xs text-center font-medium rounded-xl px-3 py-2 ${
                  message.includes("success")
                    ? "bg-green-50 text-green-700 border border-green-100"
                    : "bg-red-50 text-red-600 border border-red-100"
                }`}
              >
                {message}
              </p>
            )}

            {/* Footer */}
            <p className="text-[10px] text-gray-400 text-center leading-relaxed">
              By proceeding, you agree to our{" "}
              <a href="/terms&Conditions" className="underline" style={{ color: colors.accent.red }}>
                Terms of Use
              </a>
              {" and "}
              <a href="/privacyPolicy" className="underline" style={{ color: colors.accent.red }}>
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          DESKTOP layout (Matching Image)
      ══════════════════════════════════════════ */}
      {/* Swap/Update the inline style background or replace class below when you map your public asset */}
      <div 
        className="hidden sm:block text-white px-8 py-10 md:py-12 bg-cover bg-center" 
        style={{ backgroundImage: "url('/image/cta-bg.png')" }}
      >
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Left Text Block */}
          <div className="flex-1 space-y-2 text-left max-w-sm lg:max-w-md">
            <h3 className="text-xl md:text-2xl font-bold tracking-tight">
              Still Confused?
            </h3>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              We're Here to Help You.
            </h2>
            <p className="text-sm text-blue-100 opacity-90 leading-normal pt-1">
              Get personalized guidance from our expert counsellors and take the right step towards your dream future.
            </p>
          </div>

          {/* Right Inputs Block */}
          <div className="flex-[2] w-full max-w-4xl">
            <form onSubmit={handleSubmit} className="w-full space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                
                {/* Full Name */}
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-3 text-sm bg-white text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition placeholder:text-gray-400 font-medium"
                    required
                  />
                </div>

                {/* Mobile Number */}
                <div className="relative">
                  <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    name="mobile"
                    placeholder="Mobile Number"
                    value={formData.mobile}
                    onChange={handleChange}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={10}
                    minLength={10}
                    onKeyDown={(e) => {
                      if (
                        !/[0-9]/.test(e.key) &&
                        ![
                          "Backspace",
                          "Tab",
                          "ArrowLeft",
                          "ArrowRight",
                          "Delete",
                        ].includes(e.key)
                      ) {
                        e.preventDefault();
                      }
                    }}
                    className="w-full pl-9 pr-3 py-3 text-sm bg-white text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition placeholder:text-gray-400 font-medium"
                    required
                  />
                </div>

                {/* Email ID */}
                <div className="relative">
                  <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email ID"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-3 text-sm bg-white text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition placeholder:text-gray-400 font-medium"
                    required
                  />
                </div>

                {/* Select Your Interest */}
                <div className="relative">
                  <select
                    name="stream"
                    value={formData.stream}
                    onChange={handleChange}
                    className="w-full pl-4 pr-10 py-3 text-sm bg-white text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition font-medium appearance-none"
                    required
                  >
                    <option value="" disabled>
                      Select Your Interest
                    </option>
                    <option value="Engineering">Engineering</option>
                    <option value="Business">Business</option>
                    <option value="Medical">Medical</option>
                    <option value="Arts">Arts & Humanities</option>
                    <option value="Science">Science</option>
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Lower Section inside Desktop Banner - Elements Aligned Beside Each Other */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pt-1">
                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-lg text-sm font-bold text-white bg-[#00c66d] hover:bg-[#00b060] active:scale-[0.99] transition-all disabled:opacity-60 shadow-md whitespace-nowrap"
                >
                  {isSubmitting ? "Submitting..." : "Get Free Counselling"}
                </button>

                {/* Left-aligned Privacy/Terms Notice right next to button */}
                <p className="text-xs text-blue-100 opacity-90 leading-normal">
                  By proceeding, you agree to our{" "}
                  <a href="/terms&Conditions" className="underline hover:text-white transition-colors">
                    Terms of Use
                  </a>
                  {" and "}
                  <a href="/privacyPolicy" className="underline hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>
            </form>

            {message && (
              <p
                className={`text-sm font-medium rounded-lg px-4 py-2 mt-2 ${
                  message.includes("success")
                    ? "bg-green-500/20 text-green-200 border border-green-500/30"
                    : "bg-red-500/20 text-red-200 border border-red-500/30"
                }`}
              >
                {message}
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}


// "use client";

// import { api_url } from "@/utils/apiCall";
// import { EnvelopeIcon } from "@heroicons/react/24/outline";
// import { ChevronDownIcon, PhoneIcon, UserIcon } from "lucide-react";
// import { useState, useEffect } from "react";
// import { colors } from "@/theme/colors";

// export default function CallbackForm() {
//   const [formData, setFormData] = useState({
//     name: "",
//     mobile: "",
//     email: "",
//     stream: "",
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [message, setMessage] = useState("");

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
//   ) => {
//     const { name, value } = e.target;
//     if (name === "name") {
//       if (/^[a-zA-Z\s]*$/.test(value)) {
//         setFormData((prev) => ({ ...prev, [name]: value }));
//       }
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const [isMounted, setIsMounted] = useState(false);
//   useEffect(() => {
//     setIsMounted(true);
//   }, []);
//   if (!isMounted) return null;

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setMessage("");
//     try {
//       const response = await fetch(`${api_url}/callback`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });
//       const data = await response.json();
//       if (response.ok) {
//         setMessage("Callback request submitted successfully!");
//         setFormData({ name: "", mobile: "", email: "", stream: "" });
//       } else {
//         setMessage(data.message || "Something went wrong. Please try again.");
//       }
//     } catch (error) {
//       setMessage("Server error. Please try again later.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="py-12 px-4 sm:py-16" style={{ backgroundColor: "#fdfeff" }}>
//       <div className="max-w-4xl mx-auto">
//         {/* ══════════════════════════════════════════
//             MOBILE layout
//         ══════════════════════════════════════════ */}
//         <div className="sm:hidden">
//           <div className="rounded-3xl bg-white shadow-xl border overflow-hidden" style={{ borderColor: colors.accent.orange + '30' }}>
//             {/* Decorative top gradient strip */}
//             <div className="h-1.5 w-full" style={{ background: `linear-gradient(to right, ${colors.accent.orange}, ${colors.accent.red})` }} />

//             <div className="px-5 pt-5 pb-6 space-y-5">
//               {/* Header */}
//               <div className="space-y-1 text-center">
//                 <p className="text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: colors.accent.red }}>
//                   Still Confused?
//                 </p>
//                 <h2 className="text-lg font-bold leading-snug" style={{ color: colors.primary.dark }}>
//                   We're Here to Help You.
//                 </h2>
//                 <p className="text-xs text-gray-500 leading-relaxed">
//                   Get personalized guidance from our expert counsellors and take the right step towards your dream future.
//                 </p>
//               </div>

//               {/* Form */}
//               <form onSubmit={handleSubmit} className="space-y-3">
//                 {/* Full Name */}
//                 <div className="relative">
//                   <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                   <input
//                     type="text"
//                     name="name"
//                     placeholder="Full Name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 transition placeholder:text-gray-400"
//                     style={{ borderColor: colors.accent.orange + '40' }}
//                     required
//                   />
//                 </div>

//                 {/* Mobile Number */}
//                 <div className="relative">
//                   <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                   <input
//                     type="tel"
//                     name="mobile"
//                     placeholder="Mobile Number"
//                     value={formData.mobile}
//                     onChange={handleChange}
//                     inputMode="numeric"
//                     pattern="[0-9]*"
//                     maxLength={10}
//                     minLength={10}
//                     onKeyDown={(e) => {
//                       if (
//                         !/[0-9]/.test(e.key) &&
//                         ![
//                           "Backspace",
//                           "Tab",
//                           "ArrowLeft",
//                           "ArrowRight",
//                           "Delete",
//                         ].includes(e.key)
//                       ) {
//                         e.preventDefault();
//                       }
//                     }}
//                     className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 transition placeholder:text-gray-400"
//                     style={{ borderColor: colors.accent.orange + '40' }}
//                     required
//                   />
//                 </div>

//                 {/* Email ID */}
//                 <div className="relative">
//                   <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                   <input
//                     type="email"
//                     name="email"
//                     placeholder="Email ID"
//                     value={formData.email}
//                     onChange={handleChange}
//                     className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 transition placeholder:text-gray-400"
//                     style={{ borderColor: colors.accent.orange + '40' }}
//                     required
//                   />
//                 </div>

//                 {/* Select Your Interest */}
//                 <div className="relative">
//                   <select
//                     name="stream"
//                     value={formData.stream}
//                     onChange={handleChange}
//                     className="w-full pl-4 pr-9 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 transition text-gray-600 appearance-none"
//                     style={{ borderColor: colors.accent.orange + '40' }}
//                     required
//                   >
//                     <option value="" disabled>
//                       Select Your Interest
//                     </option>
//                     <option value="Engineering">Engineering</option>
//                     <option value="Business">Business</option>
//                     <option value="Medical">Medical</option>
//                     <option value="Arts">Arts & Humanities</option>
//                     <option value="Science">Science</option>
//                   </select>
//                   <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
//                 </div>

//                 {/* Get Free Counselling */}
//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="w-full py-3 rounded-2xl text-sm font-bold text-white shadow-lg active:scale-[0.98] transition-all disabled:opacity-60"
//                   style={{
//                     background: `linear-gradient(to right, ${colors.accent.orange}, ${colors.accent.red})`,
//                     boxShadow: `0 8px 25px ${colors.accent.red}40`
//                   }}
//                 >
//                   {isSubmitting ? "Submitting..." : "Get Free Counselling"}
//                 </button>
//               </form>

//               {message && (
//                 <p
//                   className={`text-xs text-center font-medium rounded-xl px-3 py-2 ${
//                     message.includes("success")
//                       ? "bg-green-50 text-green-700 border border-green-100"
//                       : "bg-red-50 text-red-600 border border-red-100"
//                   }`}
//                 >
//                   {message}
//                 </p>
//               )}

//               {/* Footer */}
//               <p className="text-[10px] text-gray-400 text-center leading-relaxed">
//                 By proceeding, you agree to our{" "}
//                 <a href="/terms&Conditions" className="underline" style={{ color: colors.accent.red }}>
//                   Terms of Use
//                 </a>
//                 {" and "}
//                 <a href="/privacyPolicy" className="underline" style={{ color: colors.accent.red }}>
//                   Privacy Policy
//                 </a>
//                 .
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* ══════════════════════════════════════════
//             DESKTOP layout
//         ══════════════════════════════════════════ */}
//         <div className="hidden sm:block">
//           <div className="rounded-3xl bg-white shadow-xl border overflow-hidden" style={{ borderColor: colors.accent.orange + '30' }}>
//             {/* Decorative top gradient strip */}
//             <div className="h-1.5 w-full" style={{ background: `linear-gradient(to right, ${colors.accent.orange}, ${colors.accent.red})` }} />

//             <div className="px-8 py-10 space-y-6">
//               {/* Header */}
//               <div className="text-center space-y-2">
//                 <p className="text-sm font-semibold uppercase tracking-[0.3em]" style={{ color: colors.accent.red }}>
//                   Still Confused?
//                 </p>
//                 <h2 className="text-3xl font-bold" style={{ color: colors.primary.dark }}>
//                   We're Here to Help You.
//                 </h2>
//                 <p className="text-gray-500 max-w-2xl mx-auto">
//                   Get personalized guidance from our expert counsellors and take the right step towards your dream future.
//                 </p>
//               </div>

//               {/* Form - 2 columns */}
//               <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
//                 <div className="grid grid-cols-2 gap-4">
//                   {/* Full Name */}
//                   <div className="relative">
//                     <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                     <input
//                       type="text"
//                       name="name"
//                       placeholder="Full Name"
//                       value={formData.name}
//                       onChange={handleChange}
//                       className="w-full pl-9 pr-3 py-3 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 transition placeholder:text-gray-400"
//                       style={{ borderColor: colors.accent.orange + '40' }}
//                       required
//                     />
//                   </div>

//                   {/* Mobile Number */}
//                   <div className="relative">
//                     <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                     <input
//                       type="tel"
//                       name="mobile"
//                       placeholder="Mobile Number"
//                       value={formData.mobile}
//                       onChange={handleChange}
//                       inputMode="numeric"
//                       pattern="[0-9]*"
//                       maxLength={10}
//                       minLength={10}
//                       onKeyDown={(e) => {
//                         if (
//                           !/[0-9]/.test(e.key) &&
//                           ![
//                             "Backspace",
//                             "Tab",
//                             "ArrowLeft",
//                             "ArrowRight",
//                             "Delete",
//                           ].includes(e.key)
//                         ) {
//                           e.preventDefault();
//                         }
//                       }}
//                       className="w-full pl-9 pr-3 py-3 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 transition placeholder:text-gray-400"
//                       style={{ borderColor: colors.accent.orange + '40' }}
//                       required
//                     />
//                   </div>

//                   {/* Email ID */}
//                   <div className="relative">
//                     <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                     <input
//                       type="email"
//                       name="email"
//                       placeholder="Email ID"
//                       value={formData.email}
//                       onChange={handleChange}
//                       className="w-full pl-9 pr-3 py-3 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 transition placeholder:text-gray-400"
//                       style={{ borderColor: colors.accent.orange + '40' }}
//                       required
//                     />
//                   </div>

//                   {/* Select Your Interest */}
//                   <div className="relative">
//                     <select
//                       name="stream"
//                       value={formData.stream}
//                       onChange={handleChange}
//                       className="w-full pl-4 pr-9 py-3 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 transition text-gray-600 appearance-none"
//                       style={{ borderColor: colors.accent.orange + '40' }}
//                       required
//                     >
//                       <option value="" disabled>
//                         Select Your Interest
//                       </option>
//                       <option value="Engineering">Engineering</option>
//                       <option value="Business">Business</option>
//                       <option value="Medical">Medical</option>
//                       <option value="Arts">Arts & Humanities</option>
//                       <option value="Science">Science</option>
//                     </select>
//                     <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
//                   </div>
//                 </div>

//                 {/* Get Free Counselling - Full width */}
//                 <div className="mt-4">
//                   <button
//                     type="submit"
//                     disabled={isSubmitting}
//                     className="w-full py-3.5 rounded-2xl text-sm font-bold text-white shadow-lg active:scale-[0.98] transition-all disabled:opacity-60"
//                     style={{
//                       background: `linear-gradient(to right, ${colors.accent.orange}, ${colors.accent.red})`,
//                       boxShadow: `0 8px 25px ${colors.accent.red}40`
//                     }}
//                   >
//                     {isSubmitting ? "Submitting..." : "Get Free Counselling"}
//                   </button>
//                 </div>
//               </form>

//               {message && (
//                 <p
//                   className={`text-sm text-center font-medium rounded-xl px-3 py-2 max-w-3xl mx-auto ${
//                     message.includes("success")
//                       ? "bg-green-50 text-green-700 border border-green-100"
//                       : "bg-red-50 text-red-600 border border-red-100"
//                   }`}
//                 >
//                   {message}
//                 </p>
//               )}

//               {/* Footer */}
//               <p className="text-xs text-gray-400 text-center leading-relaxed">
//                 By proceeding, you agree to our{" "}
//                 <a href="/terms&Conditions" className="underline" style={{ color: colors.accent.red }}>
//                   Terms of Use
//                 </a>
//                 {" and "}
//                 <a href="/privacyPolicy" className="underline" style={{ color: colors.accent.red }}>
//                   Privacy Policy
//                 </a>
//                 .
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }