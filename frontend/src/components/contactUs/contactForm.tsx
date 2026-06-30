"use client";

import { api_url } from "@/utils/apiCall";
import { useState, useEffect } from "react";
import { colors } from "@/theme/colors";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState<string>("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => { setIsClient(true); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("Submitting...");
    try {
      const response = await fetch(`${api_url}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setStatus("Message sent successfully!");
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        setStatus("Failed to send message. Please try again.");
      }
    } catch (error) {
      setStatus("Error sending message. Please try again.");
    }
  };

  if (!isClient) return null;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white shadow-xl border border-[#D17563]/10
      p-5 md:p-8
    ">
      {/* Decorative top accent strip */}
      <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl" style={{ background: `linear-gradient(to right, ${colors.accent.orange}, ${colors.accent.red})` }} />

      {/* Header */}
      <div className="mb-5 md:mb-6">
        <span className="inline-flex items-center rounded-full bg-[#FFF7ED] border border-[#D17563]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: colors.accent.red }}>
          Contact form
        </span>
        <h2 className="font-bold text-gray-900 leading-tight
          text-xl md:text-2xl
        ">
          Send us a message
        </h2>
        <p className="text-gray-400 text-xs mt-1">We'll get back to you within 24 hours.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">

        {/* Name */}
        <Field label="Full Name" icon={
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" stroke="#e35235" strokeWidth="1.8"/><path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="#e35235" strokeWidth="1.8" strokeLinecap="round"/></svg>
        }>
          <input
            type="text"
            name="name"
            placeholder="e.g. Rahul Sharma"
            required
            value={formData.name}
            onChange={handleChange}
            autoComplete="off"
            className="w-full bg-transparent border-none outline-none text-gray-800 placeholder:text-gray-300
              text-sm md:text-base
            "
          />
        </Field>

        {/* Email */}
        <Field label="Email Address" icon={
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2" stroke="#e35235" strokeWidth="1.8"/><path d="M2 7l10 7 10-7" stroke="#e35235" strokeWidth="1.8" strokeLinecap="round"/></svg>
        }>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            required
            value={formData.email}
            onChange={handleChange}
            autoComplete="off"
            className="w-full bg-transparent border-none outline-none text-gray-800 placeholder:text-gray-300
              text-sm md:text-base
            "
          />
        </Field>

        {/* Phone */}
        <Field label="Phone Number" icon={
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3l2 5-2.5 1.5a11 11 0 005 5L14 12l5 2v3a2 2 0 01-2 2A16 16 0 013 5z" stroke="#e35235" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        }>
          <input
            type="tel"
            name="phone"
            placeholder="10-digit mobile number"
            required
            value={formData.phone}
            onChange={handleChange}
            autoComplete="off"
            inputMode="numeric"
            pattern="[0-9]*"
            onKeyDown={(e) => {
              if (!/[0-9]/.test(e.key) && !["Backspace","Tab","ArrowLeft","ArrowRight","Delete"].includes(e.key)) {
                e.preventDefault();
              }
            }}
            className="w-full bg-transparent border-none outline-none text-gray-800 placeholder:text-gray-300
              text-sm md:text-base
            "
          />
        </Field>

        {/* Message */}
        <Field label="Your Message" icon={
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="#e35235" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        } textarea>
          <textarea
            name="message"
            placeholder="Tell us how we can help you..."
            required
            rows={3}
            value={formData.message}
            onChange={handleChange}
            className="w-full bg-transparent border-none outline-none text-gray-800 placeholder:text-gray-300 resize-none
              text-sm md:text-base
            "
          />
        </Field>

        {/* Submit */}
        <button
          type="submit"
          className="w-full rounded-2xl text-white font-bold tracking-wide shadow-lg active:scale-[0.98] transition-all duration-300 ease-in-out
            py-3 text-sm
            md:py-3.5 md:text-base
            hover:bg-[#fd4c00] hover:shadow-[0_8px_30px_#fd4c0060] hover:-translate-y-0.5
          "
          style={{
            backgroundColor: colors.accent.red,
            boxShadow: `0 8px 25px ${colors.accent.red}40`
          }}
        >
          Send Message →
        </button>

        {/* Status */}
        {status && (
          <div className={`flex items-center gap-2 rounded-2xl text-sm font-medium px-4 py-3
            ${status.includes("success")
              ? "bg-green-50 border border-green-200 text-green-700"
              : status === "Submitting..."
              ? "bg-[#FFF7ED] border border-[#D17563]/20 text-[#D17563]"
              : "bg-red-50 border border-red-200 text-red-600"
            }
          `}>
            <span className="text-base">
              {status.includes("success") ? "✓" : status === "Submitting..." ? "⟳" : "✕"}
            </span>
            {status}
          </div>
        )}
      </form>
    </div>
  );
}

// ── Field wrapper component ──────────────────────────────────────
function Field({
  label,
  icon,
  children,
  textarea,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  textarea?: boolean;
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
        {icon}
        {label}
      </label>
      <div className={`flex items-${textarea ? "start" : "center"} gap-2 rounded-2xl border border-gray-200 bg-gray-50/80 focus-within:border-[#D17563] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#D17563]/10 transition-all
        px-4 py-3
      `}>
        {children}
      </div>
    </div>
  );
}


// "use client";

// import { api_url } from "@/utils/apiCall";
// import { useState, useEffect } from "react";

// export default function ContactForm() {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     message: "",
//   });
//   const [status, setStatus] = useState<string>("");
//   const [isClient, setIsClient] = useState(false); // NEW: track client-side rendering

//   // NEW: detect when the component is mounted on the client
//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setStatus("Submitting...");

//     try {
//       const response = await fetch(`${api_url}/contact`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         console.log("Form Submitted:", data);
//         setStatus("Message sent successfully!");
//         setFormData({
//           name: "",
//           email: "",
//           phone: "",
//           message: "",
//         });
//       } else {
//         console.error("Error submitting form:", data.message);
//         setStatus("Failed to send message. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       setStatus("Error sending message. Please try again.");
//     }
//   };

//   if (!isClient) return null; // 👈 Prevent server-side render

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="bg-white shadow-md p-8 rounded-xl space-y-6"
//     >
//       <h2 className="text-2xl font-semibold text-[#D17563]">
//         Send us a message
//       </h2>
//       <div className="space-y-4">
//         <input
//           type="text"
//           name="name"
//           placeholder="Your Name"
//           required
//           value={formData.name}
//           onChange={handleChange}
//           autoComplete="off"
//           className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
//         />
//         <input
//           type="email"
//           name="email"
//           placeholder="Your Email"
//           required
//           value={formData.email}
//           onChange={handleChange}
//           autoComplete="off"
//           className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
//         />
//         <input
//           type="tel"
//           name="phone"
//           placeholder="Your Phone Number"
//           required
//           value={formData.phone}
//           onChange={handleChange}
//           autoComplete="off"
//           inputMode="numeric" // shows numeric keypad on mobile
//           pattern="[0-9]*" // only allows digits
//           onKeyDown={(e) => {
//             // Allow digits, Backspace, Tab, Arrow keys, Delete
//             if (
//               !/[0-9]/.test(e.key) &&
//               ![
//                 "Backspace",
//                 "Tab",
//                 "ArrowLeft",
//                 "ArrowRight",
//                 "Delete",
//               ].includes(e.key)
//             ) {
//               e.preventDefault();
//             }
//           }}
//           className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
//         />

//         <textarea
//           name="message"
//           placeholder="Your Message"
//           required
//           rows={5}
//           value={formData.message}
//           onChange={handleChange}
//           className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
//         ></textarea>
//         <button
//           type="submit"
//           className="w-full bg-[#D17563] text-white py-3 rounded-xl font-semibold hover:bg-orange-700 transition"
//         >
//           Submit
//         </button>
//         {status && (
//           <div
//             className={`mt-4 text-center p-3 rounded-xl ${
//               status.includes("success")
//                 ? "bg-green-500 text-white"
//                 : "bg-red-500 text-white"
//             }`}
//           >
//             {status}
//           </div>
//         )}
//       </div>
//     </form>
//   );
// }
// "use client";

// import { api_url } from "@/utils/apiCall";
// import { useState, useEffect } from "react";

// export default function ContactForm() {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     message: "",
//   });
//   const [status, setStatus] = useState<string>("");
//   const [isClient, setIsClient] = useState(false);

//   useEffect(() => { setIsClient(true); }, []);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setStatus("Submitting...");
//     try {
//       const response = await fetch(`${api_url}/contact`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });
//       const data = await response.json();
//       if (response.ok) {
//         setStatus("Message sent successfully!");
//         setFormData({ name: "", email: "", phone: "", message: "" });
//       } else {
//         setStatus("Failed to send message. Please try again.");
//       }
//     } catch (error) {
//       setStatus("Error sending message. Please try again.");
//     }
//   };

//   if (!isClient) return null;

//   return (
//     <div className="relative overflow-hidden rounded-3xl bg-white shadow-xl border border-[#D17563]/10
//       p-5 md:p-8
//     ">
//       {/* Decorative top accent strip */}
//       <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl bg-gradient-to-r from-[#D17563] via-[#e8967e] to-[#f5c4b0]" />

//       {/* Header */}
//       <div className="mb-5 md:mb-6">
//         <span className="inline-flex items-center rounded-full bg-[#FFF7ED] border border-[#D17563]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#D17563] mb-3">
//           Contact form
//         </span>
//         <h2 className="font-bold text-gray-900 leading-tight
//           text-xl md:text-2xl
//         ">
//           Send us a message
//         </h2>
//         <p className="text-gray-400 text-xs mt-1">We'll get back to you within 24 hours.</p>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">

//         {/* Name */}
//         <Field label="Full Name" icon={
//           <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" stroke="#D17563" strokeWidth="1.8"/><path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="#D17563" strokeWidth="1.8" strokeLinecap="round"/></svg>
//         }>
//           <input
//             type="text"
//             name="name"
//             placeholder="e.g. Rahul Sharma"
//             required
//             value={formData.name}
//             onChange={handleChange}
//             autoComplete="off"
//             className="w-full bg-transparent border-none outline-none text-gray-800 placeholder:text-gray-300
//               text-sm md:text-base
//             "
//           />
//         </Field>

//         {/* Email */}
//         <Field label="Email Address" icon={
//           <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2" stroke="#D17563" strokeWidth="1.8"/><path d="M2 7l10 7 10-7" stroke="#D17563" strokeWidth="1.8" strokeLinecap="round"/></svg>
//         }>
//           <input
//             type="email"
//             name="email"
//             placeholder="you@example.com"
//             required
//             value={formData.email}
//             onChange={handleChange}
//             autoComplete="off"
//             className="w-full bg-transparent border-none outline-none text-gray-800 placeholder:text-gray-300
//               text-sm md:text-base
//             "
//           />
//         </Field>

//         {/* Phone */}
//         <Field label="Phone Number" icon={
//           <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3l2 5-2.5 1.5a11 11 0 005 5L14 12l5 2v3a2 2 0 01-2 2A16 16 0 013 5z" stroke="#D17563" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
//         }>
//           <input
//             type="tel"
//             name="phone"
//             placeholder="10-digit mobile number"
//             required
//             value={formData.phone}
//             onChange={handleChange}
//             autoComplete="off"
//             inputMode="numeric"
//             pattern="[0-9]*"
//             onKeyDown={(e) => {
//               if (!/[0-9]/.test(e.key) && !["Backspace","Tab","ArrowLeft","ArrowRight","Delete"].includes(e.key)) {
//                 e.preventDefault();
//               }
//             }}
//             className="w-full bg-transparent border-none outline-none text-gray-800 placeholder:text-gray-300
//               text-sm md:text-base
//             "
//           />
//         </Field>

//         {/* Message */}
//         <Field label="Your Message" icon={
//           <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="#D17563" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
//         } textarea>
//           <textarea
//             name="message"
//             placeholder="Tell us how we can help you..."
//             required
//             rows={3}
//             value={formData.message}
//             onChange={handleChange}
//             className="w-full bg-transparent border-none outline-none text-gray-800 placeholder:text-gray-300 resize-none
//               text-sm md:text-base
//             "
//           />
//         </Field>

//         {/* Submit */}
//         <button
//           type="submit"
//           className="w-full rounded-2xl bg-[#D17563] text-white font-bold tracking-wide shadow-lg shadow-[#D17563]/20 active:scale-[0.98] transition-all hover:bg-[#c06452]
//             py-3 text-sm
//             md:py-3.5 md:text-base
//           "
//         >
//           Send Message →
//         </button>

//         {/* Status */}
//         {status && (
//           <div className={`flex items-center gap-2 rounded-2xl text-sm font-medium px-4 py-3
//             ${status.includes("success")
//               ? "bg-green-50 border border-green-200 text-green-700"
//               : status === "Submitting..."
//               ? "bg-[#FFF7ED] border border-[#D17563]/20 text-[#D17563]"
//               : "bg-red-50 border border-red-200 text-red-600"
//             }
//           `}>
//             <span className="text-base">
//               {status.includes("success") ? "✓" : status === "Submitting..." ? "⟳" : "✕"}
//             </span>
//             {status}
//           </div>
//         )}
//       </form>
//     </div>
//   );
// }

// // ── Field wrapper component ──────────────────────────────────────
// function Field({
//   label,
//   icon,
//   children,
//   textarea,
// }: {
//   label: string;
//   icon: React.ReactNode;
//   children: React.ReactNode;
//   textarea?: boolean;
// }) {
//   return (
//     <div>
//       <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
//         {icon}
//         {label}
//       </label>
//       <div className={`flex items-${textarea ? "start" : "center"} gap-2 rounded-2xl border border-gray-200 bg-gray-50/80 focus-within:border-[#D17563] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#D17563]/10 transition-all
//         px-4 py-3
//       `}>
//         {children}
//       </div>
//     </div>
//   );
// }