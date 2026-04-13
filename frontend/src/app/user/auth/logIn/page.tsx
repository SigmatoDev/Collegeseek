// "use client";

// import { useState, useEffect, useRef } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import Image from "next/image";
// import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
// import { api_url } from "@/utils/apiCall";
// import { useUserStore } from "@/Store/userStore";
// import Footer from "@/components/footer/page";
// import Header from "@/components/header/page";

// declare global {
//   interface Window {
//     google?: {
//       accounts: {
//         id: {
//           initialize: (options: {
//             client_id: string;
//             callback: (response: { credential?: string }) => void;
//           }) => void;
//           renderButton: (
//             element: HTMLElement,
//             options: {
//               theme?: string;
//               size?: string;
//               shape?: string;
//               text?: string;
//               width?: number;
//             }
//           ) => void;
//         };
//       };
//     };
//   }
// }

// interface LoginUser {
//   id: string;
//   name: string;
//   email: string;
//   phone?: string;
// }

// interface LoginResponse {
//   token: string;
//   user: LoginUser;
//   message?: string;
// }

// interface PendingCollege {
//   id: string;
//   name?: string;
// }

// const LogIn = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const [mounted, setMounted] = useState(false);

//   const [emailError, setEmailError] = useState(false);
//   const [passwordError, setPasswordError] = useState(false);
//   const [acceptedTerms, setAcceptedTerms] = useState(false);
//   const [termsError, setTermsError] = useState(false);
//   const [googleError, setGoogleError] = useState("");

//   const googleButtonRef = useRef<HTMLDivElement | null>(null);
//   const googleInitRef = useRef(false);

//   const router = useRouter();

//   // ✅ Do not redirect immediately — only allow component to render
//   useEffect(() => {
//     setMounted(true);

//     const saved = sessionStorage.getItem("redirectAfterLogin");
//     const current = window.location.href;
//     const path = window.location.pathname;
//     const isAuthPage = path.startsWith("/user/auth/");

//     if (!saved && !isAuthPage) {
//       sessionStorage.setItem("redirectAfterLogin", current);
//     }
//   }, []);

//   const handleLoginSuccess = async (data: LoginResponse) => {
//     // Map `id` → `_id` to satisfy User type
//     useUserStore.getState().setUser({
//       _id: data.user.id,
//       name: data.user.name,
//       email: data.user.email,
//   phone: data.user.phone || "", // fallback to empty string
//       token: data.token,
//     });

//     sessionStorage.setItem("authToken", data.token);
//     setSuccess("Login successful!");

//     // Auto-shortlist college if pending
//     const pendingCollegeRaw = sessionStorage.getItem("pendingShortlistCollege");
//     if (pendingCollegeRaw) {
//       try {
//         const college: PendingCollege = JSON.parse(pendingCollegeRaw);

//         const res = await fetch(`${api_url}shortlist`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${data.token}`,
//           },
//           body: JSON.stringify({
//             collegeId: college.id,
//             name: data.user.name || "",
//             email: data.user.email || "",
//             phone: data.user.phone || "",
//           }),
//         });

//         if (res.ok) {
//           sessionStorage.removeItem("pendingShortlistCollege");
//         }
//       } catch (err) {
//         console.error("Auto-shortlist error:", err);
//       }
//     }

//     // Redirect user after login
//     const redirectTo = sessionStorage.getItem("redirectAfterLogin");
//     const isAuthRedirect =
//       !redirectTo ||
//       redirectTo === "null" ||
//       redirectTo === "" ||
//       redirectTo.includes("/user/auth/logIn") ||
//       redirectTo.includes("/user/auth/signUp") ||
//       redirectTo.includes("/user/auth/register");

//     setTimeout(() => {
//       sessionStorage.removeItem("redirectAfterLogin");
//       if (isAuthRedirect) {
//         router.push("/user/profile");
//       } else {
//         router.push(redirectTo as string);
//       }
//     }, 1200);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     const trimmedEmail = email.trim().toLowerCase();
//     const trimmedPassword = password.trim();

//     const isEmailEmpty = !trimmedEmail;
//     const isPasswordEmpty = !trimmedPassword;

//     setEmailError(isEmailEmpty);
//     setPasswordError(isPasswordEmpty);
//     setTermsError(!acceptedTerms);

//     if (isEmailEmpty || isPasswordEmpty) {
//       setError("Please enter both email and password.");
//       return;
//     }
//     if (!acceptedTerms) {
//       setError("Please accept the Terms and Conditions and Privacy Policy.");
//       return;
//     }

//     try {
//       const res = await fetch(`${api_url}user/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           email: trimmedEmail,
//           password: trimmedPassword,
//         }),
//       });

//       let data: LoginResponse;
//       try {
//         data = await res.json();
//       } catch {
//         setError("Invalid response from server.");
//         return;
//       }

//       if (res.ok && data.token && data.user) {
//         await handleLoginSuccess(data);
//       } else if (data.message?.toLowerCase().includes("user not found")) {
//         setError("No account found with this email. Redirecting to sign-up...");
//         setTimeout(() => router.push("/user/auth/signUp"), 2500);
//       } else {
//         setError(data.message || "Invalid credentials.");
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Server error. Please try again later.");
//     }
//   };

//   useEffect(() => {
//     if (!mounted || googleInitRef.current) return;

//     const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
//     if (!clientId) {
//       setGoogleError("Google login is not configured.");
//       return;
//     }

//     const initializeGoogle = () => {
//       if (!window.google || !googleButtonRef.current) return;

//       window.google.accounts.id.initialize({
//         client_id: clientId,
//         callback: async (response: { credential?: string }) => {
//           setError("");
//           setSuccess("");

//           if (!response.credential) {
//             setError("Google login failed. Please try again.");
//             return;
//           }

//           try {
//             const res = await fetch(`${api_url}user/login/google`, {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify({ credential: response.credential }),
//             });

//             const data: LoginResponse = await res.json();
//             if (res.ok && data.token && data.user) {
//               await handleLoginSuccess(data);
//             } else {
//               setError(data.message || "Google login failed.");
//             }
//           } catch (err) {
//             console.error("Google login error:", err);
//             setError("Google login failed. Please try again.");
//           }
//         },
//       });

//       window.google.accounts.id.renderButton(googleButtonRef.current, {
//         theme: "outline",
//         size: "large",
//         shape: "pill",
//         text: "continue_with",
//         width: 320,
//       });

//       googleInitRef.current = true;
//     };

//     const existingScript = document.getElementById("google-identity-script");
//     if (existingScript) {
//       initializeGoogle();
//       return;
//     }

//     const script = document.createElement("script");
//     script.src = "https://accounts.google.com/gsi/client";
//     script.async = true;
//     script.defer = true;
//     script.id = "google-identity-script";
//     script.onload = initializeGoogle;
//     script.onerror = () =>
//       setGoogleError("Google login failed to initialize.");
//     document.head.appendChild(script);
//   }, [mounted]);

//   if (!mounted) return null;

//   return (
//     <>
//       <Header />
//       <div className="flex flex-col pt-8 items-center min-h-screen bg-white">
//         <div className="w-full max-w-4xl bg-[#F3F4F6] rounded-2xl shadow-lg overflow-hidden">
//           <div className="grid grid-cols-1 md:grid-cols-2">
//             <div className="relative hidden md:block">
//               <Image
//                 src="/image/college.jpg"
//                 alt="College campus"
//                 fill
//                 sizes="(min-width: 768px) 50vw, 100vw"
//                 className="object-cover"
//                 priority
//               />
//               <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/60" />
//               <div className="absolute bottom-6 left-6 right-6 text-white">
//                 <p className="text-sm uppercase tracking-[0.3em] text-white/70">
//                   Collegeseek
//                 </p>
//                 <h3 className="mt-2 text-2xl font-semibold">
//                   Find the right college for your future.
//                 </h3>
//                 <p className="mt-2 text-sm text-white/80">
//                   Discover programs, compare campuses, and connect with advisors.
//                 </p>
//               </div>
//             </div>

//             <div className="px-8 pb-8 pt-0 md:px-10 md:pb-10 md:pt-0">
//               <div className="text-center pt-4">
//                 <h2 className="text-2xl font-bold text-gray-800">
//                   Account Login
//                 </h2>
//               </div>

//               {(error || success) && (
//                 <div
//                   className={`mt-4 text-center text-sm font-medium ${
//                     error ? "text-red-600" : "text-green-600"
//                   }`}
//                 >
//                   {error || success}
//                 </div>
//               )}

//               <form onSubmit={handleSubmit} className="mt-4 space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-600">
//                     Email
//                   </label>
//                   <input
//                     type="email"
//                     className={`w-full p-3 border rounded-md ${
//                       emailError ? "border-red-500" : "focus:border-[#581845]"
//                     }`}
//                     placeholder="Enter your email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                   />
//                   {emailError && (
//                     <p className="text-red-500 text-sm mt-1">Email is required.</p>
//                   )}
//                 </div>

//                 <div className="relative">
//                   <label className="block text-sm font-medium text-gray-600">
//                     Password
//                   </label>
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     className={`w-full p-3 border rounded-md ${
//                       passwordError
//                         ? "border-red-500"
//                         : "focus:border-[#581845]"
//                     }`}
//                     placeholder="Enter password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                   />
//                   <button
//                     type="button"
//                     className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-gray-500"
//                     onClick={() => setShowPassword(!showPassword)}
//                   >
//                     {showPassword ? (
//                       <EyeSlashIcon className="h-5 w-5" />
//                     ) : (
//                       <EyeIcon className="h-5 w-5" />
//                     )}
//                   </button>
//                   {passwordError && (
//                     <p className="text-red-500 text-sm mt-1">
//                       Password is required.
//                     </p>
//                   )}
//                 </div>

//                 <div className="text-right text-xs">
//                   <Link
//                     href="/user/auth/forgotPassword"
//                     className="text-[#581845] hover:text-[#441137] font-medium"
//                   >
//                     Forgot Password?
//                   </Link>
//                 </div>

//                 <label className="flex items-start gap-2 text-xs text-gray-600">
//                   <input
//                     type="checkbox"
//                     className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-[#581845]"
//                     checked={acceptedTerms}
//                     onChange={(e) => {
//                       setAcceptedTerms(e.target.checked);
//                       if (e.target.checked) setTermsError(false);
//                     }}
//                   />
//                   <span>
//                     I accept the{" "}
//                     <a
//                       href="/terms&Conditions"
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-[#581845] hover:text-[#441137] underline"
//                     >
//                       Terms and Conditions
//                     </a>{" "}
//                     and{" "}
//                     <a
//                       href="/privacyPolicy"
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-[#581845] hover:text-[#441137] underline"
//                     >
//                       Privacy Policy
//                     </a>
//                     .
//                   </span>
//                 </label>
//                 {termsError && (
//                   <p className="text-red-500 text-sm">
//                     Please accept the Terms and Conditions and Privacy Policy.
//                   </p>
//                 )}

//                 <button
//                   type="submit"
//                   className="w-full bg-[#581845] text-white p-3 rounded-md hover:bg-[#441137] transition"
//                 >
//                   Log In
//                 </button>
//               </form>

//               <div className="my-6 flex items-center gap-3 text-xs text-gray-500">
//                 <span className="h-px flex-1 bg-gray-300" />
//                 <span>or continue with</span>
//                 <span className="h-px flex-1 bg-gray-300" />
//               </div>

//               <div className="flex flex-col items-center gap-2">
//                 <div ref={googleButtonRef} className="w-full flex justify-center" />
//                 {googleError && (
//                   <p className="text-xs text-red-500 text-center">{googleError}</p>
//                 )}
//               </div>

//               <div className="mt-4 text-center text-sm">
//                 <p className="text-gray-600">Don't have an account?</p>
//                 <Link
//                   href="/user/auth/signUp"
//                   className="text-[#581845] hover:text-[#441137] font-medium"
//                 >
//                   Register here
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <Footer />
//     </>
//   );
// };

// export default LogIn;
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { api_url } from "@/utils/apiCall";
import { useUserStore } from "@/Store/userStore";
import Footer from "@/components/footer/page";
import Header from "@/components/header/page";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: {
              theme?: string;
              size?: string;
              shape?: string;
              text?: string;
              width?: number;
            },
          ) => void;
        };
      };
    };
  }
}

interface LoginUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
}
interface LoginResponse {
  token: string;
  user: LoginUser;
  message?: string;
}

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [googleError, setGoogleError] = useState("");
  const googleButtonRef = useRef<HTMLDivElement | null>(null);
  const googleInitRef = useRef(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const saved = sessionStorage.getItem("redirectAfterLogin");
    const current = window.location.href;
    const path = window.location.pathname;
    if (!saved && !path.startsWith("/user/auth/")) {
      sessionStorage.setItem("redirectAfterLogin", current);
    }
  }, []);

  const handleLoginSuccess = async (data: LoginResponse) => {
    const store = useUserStore.getState();
    store.setUser({
      _id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      phone: data.user.phone || "",
    });
    store.setToken(data.token);
    sessionStorage.setItem("authToken", data.token);
    setToast({ type: "success", msg: "Login successful! Redirecting…" });
    const redirectTo = sessionStorage.getItem("redirectAfterLogin");
    const isAuthRedirect =
      !redirectTo || redirectTo === "null" || redirectTo === "" || redirectTo.includes("/user/auth/");
    sessionStorage.removeItem("redirectAfterLogin");
    router.push(isAuthRedirect ? "/user/profile" : (redirectTo as string));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setToast(null);

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();
    const isEmailEmpty = !trimmedEmail;
    const isPasswordEmpty = !trimmedPassword;

    setEmailError(isEmailEmpty);
    setPasswordError(isPasswordEmpty);
    setTermsError(!acceptedTerms);

    if (isEmailEmpty || isPasswordEmpty) {
      setToast({ type: "error", msg: "Please enter both email and password." });
      return;
    }
    if (!acceptedTerms) {
      setToast({ type: "error", msg: "Please accept the Terms and Conditions and Privacy Policy." });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${api_url}user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, password: trimmedPassword }),
      });
      const data: LoginResponse = await res.json();

      if (res.ok && data.token && data.user) {
        await handleLoginSuccess(data);
      } else if (data.message?.toLowerCase().includes("user not found")) {
        setToast({ type: "error", msg: "No account found. Redirecting to sign-up…" });
        setTimeout(() => router.push("/user/auth/signUp"), 2000);
      } else {
        setToast({ type: "error", msg: data.message || "Invalid credentials." });
      }
    } catch {
      setToast({ type: "error", msg: "Server error. Please try again later." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!mounted || googleInitRef.current) return;
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) { setGoogleError("Google login is not configured."); return; }

    const initializeGoogle = () => {
      if (!window.google || !googleButtonRef.current) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response: { credential?: string }) => {
          setToast(null);
          if (!response.credential) {
            setToast({ type: "error", msg: "Google login failed. Please try again." });
            return;
          }
          try {
            const res = await fetch(`${api_url}user/login/google`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ credential: response.credential }),
            });
            const data: LoginResponse = await res.json();
            if (res.ok && data.token && data.user) {
              await handleLoginSuccess(data);
            } else {
              setToast({ type: "error", msg: data.message || "Google login failed." });
            }
          } catch {
            setToast({ type: "error", msg: "Google login failed. Please try again." });
          }
        },
      });
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        shape: "pill",
        text: "continue_with",
        width: 320,
      });
      googleInitRef.current = true;
    };

    const existingScript = document.getElementById("google-identity-script");
    if (existingScript) { initializeGoogle(); return; }
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.id = "google-identity-script";
    script.onload = initializeGoogle;
    script.onerror = () => setGoogleError("Google login failed to initialize.");
    document.head.appendChild(script);
  }, [mounted]);

  if (!mounted) return null;

  return (
    <>
      <Header />
      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 py-10">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">

            {/* Left image panel */}
            <div className="relative hidden md:block min-h-[560px]">
              <Image
                src="/image/college.jpg"
                alt="College campus"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/35 to-black/65" />
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <p className="text-xs uppercase tracking-widest text-white/60 font-medium">Collegeseek</p>
                <h3 className="mt-3 text-2xl font-semibold leading-snug">
                  Find the right college<br />for your future.
                </h3>
                <p className="mt-2 text-sm text-white/75 leading-relaxed">
                  Discover programs, compare campuses,<br />and connect with advisors.
                </p>
              </div>
            </div>

            {/* Right form panel */}
            <div className="px-8 py-10 md:px-10 flex flex-col justify-center">

              {/* Logo — mobile only */}
              <div className="flex justify-center mb-6 md:hidden">
                <Image src="/logo/logo.jpg" alt="Logo" width={100} height={40} className="object-contain" />
              </div>

              {/* Heading */}
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Welcome back</h2>
                <p className="text-sm text-gray-400 mt-1">Sign in to your Collegeseek account</p>
              </div>

              {/* Toast */}
              {toast && (
                <div className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm mb-5 border ${
                  toast.type === "success"
                    ? "bg-green-50 text-green-800 border-green-200"
                    : "bg-red-50 text-red-800 border-red-200"
                }`}>
                  {toast.type === "success" ? (
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  )}
                  <span>{toast.msg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Email address</label>
                  <input
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setEmailError(false); }}
                    className={`w-full px-3 py-2.5 border rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition ${
                      emailError
                        ? "border-red-300 bg-red-50 focus:ring-red-100 focus:border-red-400"
                        : "border-gray-200 focus:ring-purple-200 focus:border-purple-400"
                    }`}
                  />
                  {emailError && <p className="text-xs text-red-500 mt-1">Email is required.</p>}
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-medium text-gray-600">Password</label>
                    <Link
                      href="/user/auth/forgotPassword"
                      className="text-xs text-purple-600 hover:text-purple-800 font-medium transition"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setPasswordError(false); }}
                      className={`w-full px-3 py-2.5 pr-10 border rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition ${
                        passwordError
                          ? "border-red-300 bg-red-50 focus:ring-red-100 focus:border-red-400"
                          : "border-gray-200 focus:ring-purple-200 focus:border-purple-400"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      tabIndex={-1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {passwordError && <p className="text-xs text-red-500 mt-1">Password is required.</p>}
                </div>

                {/* Terms */}
                <div>
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => { setAcceptedTerms(e.target.checked); if (e.target.checked) setTermsError(false); }}
                      className="mt-0.5 h-4 w-4 rounded border-gray-300 shrink-0 accent-purple-600"
                    />
                    <span className="text-xs text-gray-500 leading-relaxed">
                      I accept the{" "}
                      <a href="/terms&Conditions" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800 underline">
                        Terms and Conditions
                      </a>{" "}
                      and{" "}
                      <a href="/privacyPolicy" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800 underline">
                        Privacy Policy
                      </a>
                    </span>
                  </label>
                  {termsError && (
                    <p className="text-xs text-red-500 mt-1">Please accept the Terms and Conditions and Privacy Policy.</p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-lg text-sm font-medium text-white transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: "#534AB7" }}
                >
                  {loading ? "Signing in…" : "Sign in"}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-5">
                <span className="h-px flex-1 bg-gray-100" />
                <span className="text-xs text-gray-400">or continue with</span>
                <span className="h-px flex-1 bg-gray-100" />
              </div>

              {/* Google button */}
              <div className="flex flex-col items-center gap-2">
                <div ref={googleButtonRef} className="w-full flex justify-center" />
                {googleError && <p className="text-xs text-red-500 text-center">{googleError}</p>}
              </div>

              {/* Sign up */}
              <p className="text-center text-xs text-gray-400 mt-6">
                Don't have an account?{" "}
                <Link href="/user/auth/signUp" className="text-purple-600 hover:text-purple-800 font-medium transition">
                  Register here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LogIn;