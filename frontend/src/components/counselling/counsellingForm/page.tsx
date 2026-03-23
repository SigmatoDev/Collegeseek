// import { api_url } from "@/utils/apiCall";
// import React, { useState, useEffect } from "react";

// interface CounsellingFormProps {
//   collegeId?: string;
//   onClose?: () => void;
// }

// interface FormDataType {
//   name: string;
//   email: string;
//   phone: string;
//   college: string;
//   message: string;
// }

// interface College {
//   id: string;
//   name: string;
// }

// const CounsellingForm = ({ collegeId, onClose }: CounsellingFormProps) => {
//   const [formData, setFormData] = useState<FormDataType>({
//     name: "",
//     email: "",
//     phone: "",
//     college: "",
//     message: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState<{ [key in keyof FormDataType]?: string }>({});
//   const [college, setCollege] = useState<College | null>(null);
//   const [fetchError, setFetchError] = useState<string | null>(null);
//   const [successMessage, setSuccessMessage] = useState<string>("");

//   // Fetch college details
//   useEffect(() => {
//     if (!collegeId || collegeId === "global") {
//       setCollege({ id: "global", name: "General Counselling" });
//       setFetchError(null);
//       return;
//     }

//     const fetchCollege = async () => {
//       try {
//         const response = await fetch(`${api_url}/colleges/${collegeId}`);
//         const data = await response.json();
//         if (data?.data) {
//           setCollege(data.data);
//           setFetchError(null);
//         } else {
//           setFetchError("No data found for this college.");
//         }
//       } catch (error) {
//         console.error("Failed to fetch college data:", error);
//         setFetchError("Failed to fetch college data.");
//       }
//     };

//     fetchCollege();
//   }, [collegeId]);

//   // Pre-fill college name
//   useEffect(() => {
//     if (college) {
//       setFormData((prev) => ({ ...prev, college: college.name }));
//     }
//   }, [college]);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     if (name === "name" && /\d/.test(value)) return; // block digits in name

//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const validateForm = () => {
//     const newErrors: { [key in keyof FormDataType]?: string } = {};
//     (["name", "email", "phone", "college"] as Array<keyof FormDataType>).forEach((field) => {
//       if (!formData[field]) {
//         newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
//       }
//     });
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

// const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();
//   if (!validateForm()) return;

//   setLoading(true);

//   try {
//     const response = await fetch(`${api_url}/counselling`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(formData),
//     });

//     const data = await response.json();

//     if (response.ok) {
//       setSuccessMessage("Thanks! We’ll connect with you shortly.");
//       setFormData({
//         name: "",
//         email: "",
//         phone: "",
//         college: college?.name || "",
//         message: "",
//       });
//     } else {
//       console.error("Error submitting form:", data.message);
//     }
//   } catch (error) {
//     console.error("Error:", error);
//   } finally {
//     setLoading(false);
//   }
// };



//   if (fetchError) {
//     return <div className="text-center text-xl text-red-500">{fetchError}</div>;
//   }

//   if (!college) {
//     return <div className="text-center text-xl text-gray-700">Loading college details...</div>;
//   }

//   return (
//     <div className="max-w-2xl mx-auto p-5 sm:p-6 bg-white rounded-2xl border border-gray-100">
//       <h3 className="text-2xl font-semibold text-center text-gray-900">
//         Get Free Counselling
//       </h3>
//       <p className="text-sm text-center text-gray-500 mb-5">
//         {college.name}
//       </p>

//       {successMessage ? (
//         <div className="rounded-xl bg-[#f6f4fb] p-6 text-center text-sm text-[#4c8c5a] space-y-4">
//           <p>{successMessage}</p>
//           {onClose && (
//             <button
//               onClick={onClose}
//               className="inline-flex items-center justify-center rounded-full bg-[#d95540] px-4 py-2 text-white text-sm font-semibold shadow hover:bg-[#c44936] transition"
//             >
//               Close
//             </button>
//           )}
//         </div>
//       ) : (
//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
//             {(["name", "email"] as Array<keyof FormDataType>).map((field) => (
//               <div key={field} className="mb-4">
//                 <label htmlFor={field} className="block text-lg font-medium text-gray-700 mb-2 capitalize">
//                   {field}
//                 </label>
//                 <input
//                   type={field === "email" ? "email" : "text"}
//                   id={field}
//                   name={field}
//                   value={formData[field] || ""}
//                   onChange={handleInputChange}
//                   className={`w-full p-3 text-lg border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300 ${
//                     errors[field] ? "border-red-500" : "border-gray-300"
//                   }`}
//                   placeholder={`Enter your ${field}`}
//                   required
//                 />
//                 {errors[field] && <p className="text-xs text-red-500 mt-1">{errors[field]}</p>}
//               </div>
//             ))}

//             {(["phone", "college"] as Array<keyof FormDataType>).map((field) => (
//               <div key={field} className="mb-4">
//                 <label htmlFor={field} className="block text-lg font-medium text-gray-700 mb-2 capitalize">
//                   {field}
//                 </label>
//                 <input
//                   type={field === "phone" ? "tel" : "text"}
//                   id={field}
//                   name={field}
//                   value={formData[field] || ""}
//                   onChange={handleInputChange}
//                   readOnly={field === "college"}
//                   pattern={field === "phone" ? "[0-9]*" : undefined}
//                   inputMode={field === "phone" ? "numeric" : undefined}
//                   onKeyDown={(e) => {
//                     if (
//                       field === "phone" &&
//                       !/[0-9]/.test(e.key) &&
//                       e.key !== "Backspace" &&
//                       e.key !== "Tab"
//                     ) {
//                       e.preventDefault();
//                     }
//                   }}
//                   className={`w-full p-3 text-lg border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300 ${
//                     errors[field] ? "border-red-500" : "border-gray-300"
//                   } ${field === "college" ? "bg-gray-100 cursor-not-allowed" : ""}`}
//                   placeholder={`Enter your ${field}`}
//                   required
//                 />
//                 {errors[field] && <p className="text-xs text-red-500 mt-1">{errors[field]}</p>}
//               </div>
//             ))}
//           </div>

//           <div className="mb-4">
//             <label htmlFor="message" className="block text-lg font-medium text-gray-700 mb-2">
//               Message
//             </label>
//             <textarea
//               id="message"
//               name="message"
//               value={formData.message || ""}
//               onChange={handleInputChange}
//               className="w-full p-3 text-lg border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300 border-gray-300"
//               rows={4}
//               placeholder="Leave a message (optional)"
//             />
//           </div>

//           <button
//             type="submit"
//             className={`w-full py-3 rounded-lg text-base font-semibold transition-all duration-300 ${
//               loading
//                 ? "bg-gray-400 text-white cursor-not-allowed"
//                 : "bg-gradient-to-r from-[#ff8f66] to-[#d95540] text-white hover:from-[#f77d52] hover:to-[#cf4b38]"
//             }`}
//             disabled={loading}
//           >
//             {loading ? "Submitting..." : "Submit"}
//           </button>
//         </form>
//       )}
//     </div>
//   );
// };

// export default CounsellingForm;
import { api_url } from "@/utils/apiCall";
import React, { useState, useEffect } from "react";

interface CounsellingFormProps {
  collegeId?: string;
  onClose?: () => void;
}

interface FormDataType {
  name: string;
  email: string;
  phone: string;
  college: string;
  message: string;
}

interface College {
  id: string;
  name: string;
}

// ── Skeleton loader ──────────────────────────────────────────────
function CounsellingFormSkeleton() {
  return (
    <div className="relative rounded-3xl bg-white border border-gray-100 shadow-xl p-5 sm:p-7 max-w-2xl mx-auto animate-pulse">
      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl bg-orange-200" />

      {/* Header */}
      <div className="text-center mb-5 space-y-2">
        <div className="mx-auto h-5 w-32 rounded-full bg-orange-100" />
        <div className="mx-auto h-6 w-48 rounded-full bg-gray-200" />
        <div className="mx-auto h-3 w-36 rounded-full bg-gray-100" />
      </div>

      {/* Name + Email row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        {[0, 1].map((i) => (
          <div key={i} className="space-y-1.5">
            <div className="h-2.5 w-12 rounded-full bg-gray-200" />
            <div className="h-10 w-full rounded-2xl bg-gray-100" />
          </div>
        ))}
      </div>

      {/* Phone + College row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        {[0, 1].map((i) => (
          <div key={i} className="space-y-1.5">
            <div className="h-2.5 w-14 rounded-full bg-gray-200" />
            <div className="h-10 w-full rounded-2xl bg-gray-100" />
          </div>
        ))}
      </div>

      {/* Message */}
      <div className="space-y-1.5 mb-3">
        <div className="h-2.5 w-20 rounded-full bg-gray-200" />
        <div className="h-24 w-full rounded-2xl bg-gray-100" />
      </div>

      {/* Submit button */}
      <div className="h-12 w-full rounded-2xl bg-orange-200" />
    </div>
  );
}

const CounsellingForm = ({ collegeId, onClose }: CounsellingFormProps) => {
  const [formData, setFormData] = useState<FormDataType>({
    name: "", email: "", phone: "", college: "", message: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key in keyof FormDataType]?: string }>({});
  const [college, setCollege] = useState<College | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>("");

  useEffect(() => {
    if (!collegeId || collegeId === "global") {
      setCollege({ id: "global", name: "General Counselling" });
      return;
    }
    const isObjectId = /^[a-f\d]{24}$/i.test(collegeId);
    if (!isObjectId) {
      setCollege({ id: collegeId, name: collegeId });
      return;
    }
    const fetchCollege = async () => {
      try {
        const response = await fetch(`${api_url}/colleges/${collegeId}`);
        const data = await response.json();
        if (data?.data) setCollege(data.data);
        else setCollege({ id: collegeId, name: collegeId });
      } catch {
        setFetchError("Failed to fetch college data.");
      }
    };
    fetchCollege();
  }, [collegeId]);

  useEffect(() => {
    if (college) setFormData((prev) => ({ ...prev, college: college.name }));
  }, [college]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "name" && /\d/.test(value)) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors: { [key in keyof FormDataType]?: string } = {};
    (["name", "email", "phone", "college"] as Array<keyof FormDataType>).forEach((field) => {
      if (!formData[field]) newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const response = await fetch(`${api_url}/counselling`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccessMessage("Thanks! We'll connect with you shortly.");
        setFormData({ name: "", email: "", phone: "", college: college?.name || "", message: "" });
      }
    } catch {}
    finally { setLoading(false); }
  };

  // ── Show skeleton while college is loading ──
  if (!college && !fetchError) return <CounsellingFormSkeleton />;

  // ── Error state ──
  if (fetchError) return (
    <div className="rounded-3xl bg-white border border-gray-100 shadow-xl p-6 max-w-2xl mx-auto text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-3">
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
          <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <p className="text-sm text-red-500 font-medium">{fetchError}</p>
    </div>
  );

  const inputClass = (field: keyof FormDataType, readOnly?: boolean) =>
    `w-full rounded-2xl border bg-gray-50/80 text-gray-800 placeholder:text-gray-300
     focus:outline-none focus:ring-2 focus:ring-[#d95540]/20 focus:border-[#d95540] focus:bg-white
     transition-all text-sm px-4 py-2.5 sm:py-3
     ${errors[field] ? "border-red-400 bg-red-50/60" : "border-gray-200"}
     ${readOnly ? "cursor-not-allowed opacity-60" : ""}`;

  return (
    <div className="relative rounded-3xl bg-white border border-gray-100 shadow-xl
      p-5 max-w-2xl mx-auto
      sm:p-7
    ">
      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl bg-gradient-to-r from-[#ff8f66] to-[#d95540]" />

      {/* Header */}
      <div className="text-center mb-5">
        <span className="inline-flex items-center rounded-full bg-[#fff3ef] border border-[#d95540]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#d95540] mb-2">
          Free counselling
        </span>
        <h3 className="font-bold text-gray-900 text-lg sm:text-2xl">
          Get Free Counselling
        </h3>
        <p className="text-xs text-gray-400 mt-1 truncate px-6">{college!.name}</p>
      </div>

      {/* Success */}
      {successMessage ? (
        <div className="rounded-2xl bg-green-50 border border-green-200 p-5 text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <path d="M5 13l4 4L19 7" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="text-sm font-semibold text-green-700">{successMessage}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">

          {/* Name + Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(["name", "email"] as const).map((field) => (
              <div key={field}>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">{field}</label>
                <input
                  type={field === "email" ? "email" : "text"}
                  name={field} id={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  placeholder={`Your ${field}`}
                  required
                  className={inputClass(field)}
                />
                {errors[field] && <p className="text-[11px] text-red-500 mt-1">{errors[field]}</p>}
              </div>
            ))}
          </div>

          {/* Phone + College */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(["phone", "college"] as const).map((field) => (
              <div key={field}>
                <label className="block text-[10px] font-bold tracking-widest text-gray-400 mb-1.5 capitalize">{field}</label>
                <input
                  type={field === "phone" ? "tel" : "text"}
                  name={field} id={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  readOnly={field === "college"}
                  inputMode={field === "phone" ? "numeric" : undefined}
                  pattern={field === "phone" ? "[0-9]*" : undefined}
                  onKeyDown={(e) => {
                    if (field === "phone" && !/[0-9]/.test(e.key) && !["Backspace","Tab","ArrowLeft","ArrowRight","Delete"].includes(e.key)) e.preventDefault();
                  }}
                  placeholder={`Your ${field}`}
                  required
                  className={inputClass(field, field === "college")}
                />
                {errors[field] && <p className="text-[11px] text-red-500 mt-1">{errors[field]}</p>}
              </div>
            ))}
          </div>

          {/* Message */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
              Message <span className="normal-case font-normal tracking-normal text-gray-300">(optional)</span>
            </label>
            <textarea
              name="message" id="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={3}
              placeholder="Leave a message (optional)"
              className="w-full rounded-2xl border border-gray-200 bg-gray-50/80 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d95540]/20 focus:border-[#d95540] focus:bg-white transition-all resize-none px-4 py-2.5 sm:py-3"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-2xl font-bold text-white active:scale-[0.98] transition-all
              py-3 text-sm sm:py-3.5 sm:text-base
              ${loading
                ? "bg-gray-300 cursor-not-allowed shadow-none"
                : "bg-gradient-to-r from-[#ff8f66] to-[#d95540] shadow-lg shadow-[#d95540]/20 hover:from-[#f77d52] hover:to-[#cf4b38]"
              }
            `}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin" />
                Submitting...
              </span>
            ) : "Get Free Counselling →"}
          </button>
        </form>
      )}
    </div>
  );
};

export default CounsellingForm;