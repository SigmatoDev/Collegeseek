// "use client";

// import { useState, useEffect, ReactNode } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import Image from "next/image";
// import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
// import { api_url } from "@/utils/apiCall";
// import { useUserStore } from "@/Store/userStore";
// import Header from "@/components/header/page";
// import Footer from "@/components/footer/page";

// interface RegisterData {
//   emailError: ReactNode;
//   name: string;
//   email: string;
//   phone: string;
//   password: string;
//   confirmPassword: string;
// }

// const Register = () => {
//   const [registerData, setRegisterData] = useState<RegisterData>({
//     name: "", email: "", phone: "", password: "", confirmPassword: "", emailError: "",
//   });
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [mounted, setMounted] = useState(false);
//   const router = useRouter();
//   const setUser = useUserStore((state) => state.setUser);
//   const setToken = useUserStore((state) => state.setToken);

//   useEffect(() => { setMounted(true); }, []);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setRegisterData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(""); setSuccess("");
//     const { name, email, phone, password, confirmPassword } = registerData;
//     if (!name || !email || !phone || !password || !confirmPassword) {
//       setError("Please fill in all fields."); setShowModal(true); return;
//     }
//     if (password !== confirmPassword) {
//       setError("Passwords do not match."); setShowModal(true); return;
//     }
//     try {
//       const res = await fetch(`${api_url}user/signup`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name, email, phone, password }),
//       });
//       const data = await res.json();
//       if (res.ok && data.token && data.user) {
//         setUser({ ...data.user, token: data.token });
//         setToken(data.token);
//         setSuccess("Account created successfully!");
//         setShowModal(true);
//         const pendingCollege = sessionStorage.getItem("pendingShortlistCollege");
//         if (pendingCollege) {
//           try {
//             const { id } = JSON.parse(pendingCollege);
//             await fetch(`${api_url}shortlist`, {
//               method: "POST",
//               headers: { "Content-Type": "application/json", Authorization: `Bearer ${data.token}` },
//               body: JSON.stringify({ collegeId: id, name: data.user.name, email: data.user.email, phone: data.user.phone }),
//             });
//             sessionStorage.removeItem("pendingShortlistCollege");
//           } catch (err) { console.error("Auto-shortlist failed:", err); }
//         }
//         const redirectTo = sessionStorage.getItem("redirectAfterLogin");
//         setTimeout(() => {
//           if (redirectTo && redirectTo !== "/user/auth/logIn" && redirectTo !== "/user/auth/register") {
//             sessionStorage.removeItem("redirectAfterLogin");
//             router.push(redirectTo);
//           } else { router.push("/"); }
//         }, 1500);
//       } else {
//         setError(data.message || "Something went wrong."); setShowModal(true);
//       }
//     } catch (err) {
//       console.error(err); setError("Server error. Please try again later."); setShowModal(true);
//     }
//   };

//   if (!mounted) return null;

//   const inputClass = "w-full border rounded-md focus:outline-none focus:ring focus:border-[#581845] p-2.5 text-sm md:p-3 md:text-base";

//   return (
//     <>
//       <Header />
//       <div className="flex flex-col items-center bg-white
//         pt-4 pb-8 px-4
//         md:pt-6 md:pb-12 md:px-0
//       ">
//         <div className="w-full bg-[#F3F4F6] shadow-lg rounded-lg
//           max-w-sm p-5
//           md:max-w-md md:p-8
//         ">
//           {/* Logo */}
//           <div className="flex justify-center">
//             <Image
//               src="/logo/cs-logo_a.webp"
//               alt="Logo"
//               width={100}
//               height={40}
//               className="md:w-[120px] md:h-[50px]"
//             />
//           </div>

//           {/* Heading */}
//           <div className="text-center mt-3 md:mt-4">
//             <h2 className="font-bold text-gray-800
//               text-xl md:text-2xl
//             ">
//               Create an Account
//             </h2>
//             <p className="text-gray-500 text-xs md:text-sm">Sign up to get started</p>
//           </div>

//           <form onSubmit={handleSubmit} className="mt-4 space-y-3 md:mt-6 md:space-y-4">

//             {/* Name */}
//             <div>
//               <label className="block text-xs md:text-sm font-medium text-gray-600 mb-1">Name</label>
//               <input
//                 type="text" name="name" maxLength={200}
//                 className={inputClass}
//                 placeholder="Enter your name"
//                 value={registerData.name}
//                 onChange={(e) => {
//                   const onlyLetters = e.target.value.replace(/[^A-Za-z\s]/g, "");
//                   setRegisterData((prev) => ({ ...prev, name: onlyLetters }));
//                 }}
//               />
//               {registerData.name.length >= 150 && (
//                 <p className="text-red-500 text-xs mt-1">Name cannot exceed 150 characters</p>
//               )}
//             </div>

//             {/* Email */}
//             <div>
//               <label className="block text-xs md:text-sm font-medium text-gray-600 mb-1">Email</label>
//               <input
//                 type="email" name="email"
//                 className={inputClass}
//                 placeholder="Enter your email"
//                 value={registerData.email}
//                 onChange={(e) => setRegisterData((prev) => ({ ...prev, email: e.target.value.trim() }))}
//                 onBlur={(e) => {
//                   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//                   setRegisterData((prev) => ({
//                     ...prev,
//                     emailError: e.target.value && !emailRegex.test(e.target.value)
//                       ? "Please enter a valid email address" : "",
//                   }));
//                 }}
//               />
//               {registerData.emailError && <p className="text-red-500 text-xs mt-1">{registerData.emailError}</p>}
//             </div>

//             {/* Phone */}
//             <div>
//               <label className="block text-xs md:text-sm font-medium text-gray-600 mb-1">Phone</label>
//               <input
//                 type="tel" name="phone" maxLength={10}
//                 className={inputClass}
//                 placeholder="Enter your 10-digit phone number"
//                 value={registerData.phone}
//                 onChange={(e) => {
//                   const onlyNums = e.target.value.replace(/\D/g, "");
//                   if (onlyNums.length <= 10) setRegisterData((prev) => ({ ...prev, phone: onlyNums }));
//                 }}
//               />
//               {registerData.phone.length > 0 && registerData.phone.length < 10 && (
//                 <p className="text-red-500 text-xs mt-1">Phone number must be 10 digits</p>
//               )}
//             </div>

//             {/* Password */}
//             <div>
//               <label className="block text-xs md:text-sm font-medium text-gray-600 mb-1">Password</label>
//               <input
//                 type={showPassword ? "text" : "password"} name="password"
//                 className={inputClass}
//                 placeholder="Enter password"
//                 value={registerData.password}
//                 onChange={handleInputChange}
//               />
//             </div>

//             {/* Confirm Password */}
//             <div className="relative">
//               <label className="block text-xs md:text-sm font-medium text-gray-600 mb-1">Confirm Password</label>
//               <input
//                 type={showPassword ? "text" : "password"} name="confirmPassword"
//                 className={`${inputClass} pr-10`}
//                 placeholder="Confirm password"
//                 value={registerData.confirmPassword}
//                 onChange={handleInputChange}
//               />
//               <button
//                 type="button"
//                 className="absolute right-3 top-[60%] -translate-y-1/2 text-gray-500"
//                 onClick={() => setShowPassword(!showPassword)}
//               >
//                 {showPassword
//                   ? <EyeSlashIcon className="h-4 w-4 md:h-5 md:w-5" />
//                   : <EyeIcon className="h-4 w-4 md:h-5 md:w-5" />
//                 }
//               </button>
//             </div>

//             {/* Submit */}
//             <button
//               type="submit"
//               className="w-full bg-[#581845] text-white rounded-md hover:bg-[#441137] transition duration-200 font-semibold
//                 p-2.5 text-sm
//                 md:p-3 md:text-base
//               "
//             >
//               Register
//             </button>
//           </form>

//           {/* Login link */}
//           <div className="mt-3 md:mt-4 text-center text-sm">
//             <p className="text-gray-600 text-xs md:text-sm">Already have an account?</p>
//             <Link href="/user/auth/logIn" className="text-[#581845] hover:text-[#441137] font-medium text-sm">
//               Login here
//             </Link>
//           </div>

//           {/* Modal — unchanged */}
//           {showModal && (
//             <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-4">
//               <div className="bg-white px-5 py-4 rounded-2xl w-full max-w-xs text-center shadow-[0_20px_45px_rgba(15,23,42,0.25)]">
//                 {error ? (
//                   <>
//                     <h3 className="text-lg font-semibold text-red-500">Registration Failed</h3>
//                     <p className="text-sm text-gray-600 mt-2">{error}</p>
//                   </>
//                 ) : (
//                   <>
//                     <h3 className="text-lg font-semibold text-green-600">Success!</h3>
//                     <p className="text-sm text-gray-600 mt-2">{success}</p>
//                   </>
//                 )}
//                 <button
//                   className="mt-4 bg-[#581845] text-white px-4 py-1.5 rounded-full text-sm shadow-sm"
//                   onClick={() => setShowModal(false)}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default Register;
"use client";

import { useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { api_url } from "@/utils/apiCall";
import { useUserStore } from "@/Store/userStore";
import Header from "@/components/header/page";
import Footer from "@/components/footer/page";

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface FieldErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}

// ─── Validators ────────────────────────────────────────────────────────────────

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

// Whitelist of real, commonly used email domains
const ALLOWED_EMAIL_DOMAINS = new Set([
  // Google
  "gmail.com", "googlemail.com",
  // Microsoft
  "outlook.com", "hotmail.com", "hotmail.in", "live.com", "msn.com", "outlook.in",
  // Yahoo
  "yahoo.com", "yahoo.in", "yahoo.co.in", "yahoo.co.uk",
  // Apple
  "icloud.com", "me.com", "mac.com",
  // Indian providers
  "rediffmail.com", "indiatimes.com",
  // Other popular
  "protonmail.com", "proton.me", "tutanota.com", "zoho.com",
  "aol.com", "mail.com", "yandex.com", "gmx.com",
  // Corporate / edu — allow by TLD (handled separately below)
]);

// Also accept any .edu, .ac.in, .org, .gov, .net, .co.in domains (institutional)
const ALLOWED_TLDS = /\.(edu|ac\.in|org|gov|net|co\.in|edu\.in)$/i;

function isValidEmailDomain(email: string): boolean {
  const parts = email.toLowerCase().split("@");
  if (parts.length !== 2) return false;
  const domain = parts[1];
  return ALLOWED_EMAIL_DOMAINS.has(domain) || ALLOWED_TLDS.test(domain);
}

function validateFields(data: RegisterData): FieldErrors {
  const errors: FieldErrors = {};

  // Name
  if (!data.name.trim()) {
    errors.name = "Name is required.";
  } else if (data.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters.";
  }

  // Email — check format first, then validate domain against whitelist
  if (!data.email.trim()) {
    errors.email = "Email is required.";
  } else if (!EMAIL_REGEX.test(data.email.trim())) {
    errors.email = "Enter a valid email address (e.g. user@gmail.com).";
  } else if (!isValidEmailDomain(data.email.trim())) {
    const domain = data.email.trim().split("@")[1];
    errors.email = `"${domain}" is not a recognised email provider. Use gmail.com, outlook.com, yahoo.com, etc.`;
  }

  // Phone — must be exactly 10 digits
  if (!data.phone) {
    errors.phone = "Phone number is required.";
  } else if (data.phone.length < 10) {
    errors.phone = `Phone must be 10 digits (currently ${data.phone.length}).`;
  }

  // Password — minimum 8 characters
  if (!data.password) {
    errors.password = "Password is required.";
  } else if (data.password.length < 8) {
    errors.password = `Password must be at least 8 characters (currently ${data.password.length}).`;
  }

  // Confirm Password
  if (!data.confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
}

// ─── Component ─────────────────────────────────────────────────────────────────

const Register = () => {
  const [registerData, setRegisterData] = useState<RegisterData>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  // Per-field errors shown inline
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  // Tracks which fields have been touched (blurred) so errors show progressively
  const [touched, setTouched] = useState<Partial<Record<keyof RegisterData, boolean>>>({});

  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const setToken = useUserStore((state) => state.setToken);

  useEffect(() => { setMounted(true); }, []);

  // Re-validate whenever data changes, but only show errors for touched fields
  useEffect(() => {
    const errors = validateFields(registerData);
    setFieldErrors(errors);
  }, [registerData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (field: keyof RegisterData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Helper — shows error only after field was touched
  const fieldError = (field: keyof RegisterData) =>
    touched[field] ? fieldErrors[field] : undefined;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(""); setSuccess("");

    // Mark all fields as touched so all errors surface on submit
    setTouched({ name: true, email: true, phone: true, password: true, confirmPassword: true });

    const errors = validateFields(registerData);
    if (Object.keys(errors).length > 0) {
      // Don't hit the server if client validation fails
      return;
    }

    const { name, email, phone, password } = registerData;

    try {
      const res = await fetch(`${api_url}user/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim().toLowerCase(), phone, password }),
      });
      const data = await res.json();

      if (res.ok && data.token && data.user) {
        setUser({
          _id: data.user.id || data.user._id,
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone || phone.trim(),
          authProvider: data.user.authProvider || "local",
          token: data.token,
        });
        setToken(data.token);
        setSuccess("Account created successfully!");
        setShowModal(true);

        const pendingCollege = sessionStorage.getItem("pendingShortlistCollege");
        if (pendingCollege) {
          try {
            const { id } = JSON.parse(pendingCollege);
            await fetch(`${api_url}shortlist`, {
              method: "POST",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${data.token}` },
              body: JSON.stringify({ collegeId: id, name: data.user.name, email: data.user.email, phone: data.user.phone }),
            });
            sessionStorage.removeItem("pendingShortlistCollege");
          } catch (err) { console.error("Auto-shortlist failed:", err); }
        }

        const redirectTo = sessionStorage.getItem("redirectAfterLogin");
        setTimeout(() => {
          if (redirectTo && redirectTo !== "/user/auth/logIn" && redirectTo !== "/user/auth/register") {
            sessionStorage.removeItem("redirectAfterLogin");
            router.push(redirectTo);
          } else {
            router.push("/");
          }
        }, 1500);
      } else {
        setServerError(data.message || "Something went wrong.");
        setShowModal(true);
      }
    } catch (err) {
      console.error(err);
      setServerError("Server error. Please try again later.");
      setShowModal(true);
    }
  };

  if (!mounted) return null;

  const inputBase =
    "w-full border rounded-md focus:outline-none focus:ring focus:border-[#581845] p-2.5 text-sm md:p-3 md:text-base transition-colors";

  const inputClass = (field: keyof RegisterData) =>
    `${inputBase} ${fieldError(field) ? "border-red-400 bg-red-50" : "border-gray-300"}`;

  return (
    <>
      <Header />
      <div className="flex flex-col items-center bg-white pt-4 pb-8 px-4 md:pt-6 md:pb-12 md:px-0">
        <div className="w-full bg-[#F3F4F6] shadow-lg rounded-lg max-w-sm p-5 md:max-w-md md:p-8">

          {/* Logo */}
          <div className="flex justify-center">
            <Image
              src="/logo/cs-logo_a.webp"
              alt="Logo"
              width={100}
              height={40}
              className="md:w-[120px] md:h-[50px]"
            />
          </div>

          {/* Heading */}
          <div className="text-center mt-3 md:mt-4">
            <h2 className="font-bold text-gray-800 text-xl md:text-2xl">Create an Account</h2>
            <p className="text-gray-500 text-xs md:text-sm">Sign up to get started</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-3 md:mt-6 md:space-y-4">

            {/* ── Name ── */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-600 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                maxLength={200}
                className={inputClass("name")}
                placeholder="Enter your name"
                value={registerData.name}
                onChange={(e) => {
                  const onlyLetters = e.target.value.replace(/[^A-Za-z\s]/g, "");
                  setRegisterData((prev) => ({ ...prev, name: onlyLetters }));
                }}
                onBlur={() => handleBlur("name")}
              />
              {fieldError("name") && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <span>⚠</span> {fieldError("name")}
                </p>
              )}
            </div>

            {/* ── Email ── */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-600 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="text"            // intentionally "text" — our regex is the real gate
                name="email"
                className={inputClass("email")}
                placeholder="Enter your email (e.g. user@example.com)"
                value={registerData.email}
                onChange={(e) =>
                  setRegisterData((prev) => ({ ...prev, email: e.target.value.trim() }))
                }
                onBlur={() => handleBlur("email")}
              />
              {fieldError("email") && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <span>⚠</span> {fieldError("email")}
                </p>
              )}
            </div>

            {/* ── Phone ── */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-600 mb-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                maxLength={10}
                className={inputClass("phone")}
                placeholder="Enter your 10-digit phone number"
                value={registerData.phone}
                onChange={(e) => {
                  const onlyNums = e.target.value.replace(/\D/g, "");
                  if (onlyNums.length <= 10)
                    setRegisterData((prev) => ({ ...prev, phone: onlyNums }));
                }}
                onBlur={() => handleBlur("phone")}
              />
              {fieldError("phone") && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <span>⚠</span> {fieldError("phone")}
                </p>
              )}
              {/* Progress indicator */}
              {touched.phone && registerData.phone.length > 0 && registerData.phone.length < 10 && (
                <div className="mt-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-400 rounded-full transition-all duration-200"
                    style={{ width: `${(registerData.phone.length / 10) * 100}%` }}
                  />
                </div>
              )}
            </div>

            {/* ── Password ── */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-600 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className={inputClass("password")}
                placeholder="Minimum 8 characters"
                value={registerData.password}
                onChange={handleInputChange}
                onBlur={() => handleBlur("password")}
              />
              {fieldError("password") && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <span>⚠</span> {fieldError("password")}
                </p>
              )}
              {/* Strength bar */}
              {touched.password && registerData.password.length > 0 && registerData.password.length < 8 && (
                <div className="mt-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-400 rounded-full transition-all duration-200"
                    style={{ width: `${(registerData.password.length / 8) * 100}%` }}
                  />
                </div>
              )}
            </div>

            {/* ── Confirm Password ── */}
            <div className="relative">
              <label className="block text-xs md:text-sm font-medium text-gray-600 mb-1">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                className={`${inputClass("confirmPassword")} pr-10`}
                placeholder="Re-enter your password"
                value={registerData.confirmPassword}
                onChange={handleInputChange}
                onBlur={() => handleBlur("confirmPassword")}
              />
              <button
                type="button"
                className="absolute right-3 top-[60%] -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword
                  ? <EyeSlashIcon className="h-4 w-4 md:h-5 md:w-5" />
                  : <EyeIcon className="h-4 w-4 md:h-5 md:w-5" />
                }
              </button>
              {fieldError("confirmPassword") && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <span>⚠</span> {fieldError("confirmPassword")}
                </p>
              )}
            </div>

            {/* ── Submit ── */}
            <button
              type="submit"
              className="w-full bg-[#581845] text-white rounded-md hover:bg-[#441137] transition duration-200 font-semibold p-2.5 text-sm md:p-3 md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Register
            </button>
          </form>

          {/* Login link */}
          <div className="mt-3 md:mt-4 text-center">
            <p className="text-gray-600 text-xs md:text-sm">Already have an account?</p>
            <Link href="/user/auth/logIn" className="text-[#581845] hover:text-[#441137] font-medium text-sm">
              Login here
            </Link>
          </div>

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-4">
              <div className="bg-white px-5 py-4 rounded-2xl w-full max-w-xs text-center shadow-[0_20px_45px_rgba(15,23,42,0.25)]">
                {serverError ? (
                  <>
                    <h3 className="text-lg font-semibold text-red-500">Registration Failed</h3>
                    <p className="text-sm text-gray-600 mt-2">{serverError}</p>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold text-green-600">Success!</h3>
                    <p className="text-sm text-gray-600 mt-2">{success}</p>
                  </>
                )}
                <button
                  className="mt-4 bg-[#581845] text-white px-4 py-1.5 rounded-full text-sm shadow-sm"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Register;
