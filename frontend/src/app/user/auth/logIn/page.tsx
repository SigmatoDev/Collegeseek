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
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
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
interface PendingCollege {
  id: string;
  name?: string;
}

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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

  const isAuthPage = path.startsWith("/user/auth/");

  if (!saved && !isAuthPage) {
    sessionStorage.setItem("redirectAfterLogin", current);
  }
}, []);


// ✅ FINAL LOGIN SUCCESS HANDLER
const handleLoginSuccess = async (data: LoginResponse) => {
  const store = useUserStore.getState();

  // ✅ Save user
  store.setUser({
    _id: data.user.id,
    name: data.user.name,
    email: data.user.email,
    phone: data.user.phone || "",
  });

  // ✅ Save token
  store.setToken(data.token);

  sessionStorage.setItem("authToken", data.token);

  setSuccess("Login successful!");

  // ✅ REDIRECT
  const redirectTo = sessionStorage.getItem("redirectAfterLogin");

  const isAuthRedirect =
    !redirectTo ||
    redirectTo === "null" ||
    redirectTo === "" ||
    redirectTo.includes("/user/auth/");

  // 🚀 instant redirect (no delay needed)
  sessionStorage.removeItem("redirectAfterLogin");

  router.push(
    isAuthRedirect ? "/user/profile" : (redirectTo as string)
  );
};


// ✅ NORMAL LOGIN
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  setError("");
  setSuccess("");

  const trimmedEmail = email.trim().toLowerCase();
  const trimmedPassword = password.trim();

  const isEmailEmpty = !trimmedEmail;
  const isPasswordEmpty = !trimmedPassword;

  setEmailError(isEmailEmpty);
  setPasswordError(isPasswordEmpty);
  setTermsError(!acceptedTerms);

  if (isEmailEmpty || isPasswordEmpty) {
    setError("Please enter both email and password.");
    return;
  }

  if (!acceptedTerms) {
    setError("Please accept the Terms and Conditions and Privacy Policy.");
    return;
  }

  try {
    const res = await fetch(`${api_url}user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: trimmedEmail,
        password: trimmedPassword,
      }),
    });

    const data: LoginResponse = await res.json();

    if (res.ok && data.token && data.user) {
      await handleLoginSuccess(data);
    } else if (data.message?.toLowerCase().includes("user not found")) {
      setError("No account found. Redirecting to sign-up...");
      setTimeout(() => router.push("/user/auth/signUp"), 2000);
    } else {
      setError(data.message || "Invalid credentials.");
    }
  } catch (err) {
    console.error(err);
    setError("Server error. Please try again later.");
  }
};

  useEffect(() => {
    if (!mounted || googleInitRef.current) return;
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setGoogleError("Google login is not configured.");
      return;
    }
    const initializeGoogle = () => {
      if (!window.google || !googleButtonRef.current) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response: { credential?: string }) => {
          setError("");
          setSuccess("");
          if (!response.credential) {
            setError("Google login failed. Please try again.");
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
              setError(data.message || "Google login failed.");
            }
          } catch (err) {
            console.error("Google login error:", err);
            setError("Google login failed. Please try again.");
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
    if (existingScript) {
      initializeGoogle();
      return;
    }
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
      <div
        className="flex flex-col items-center bg-white
        pt-4 px-4 pb-8
        md:min-h-screen md:pt-8 md:px-0 md:pb-0
      "
      >
        <div
          className="w-full bg-[#F3F4F6] shadow-lg overflow-hidden
          rounded-2xl max-w-sm
          md:max-w-4xl
        "
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image panel — desktop only, unchanged */}
            <div className="relative hidden md:block">
              <Image
                src="/image/college.jpg"
                alt="College campus"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/60" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="text-sm uppercase tracking-[0.3em] text-white/70">
                  Collegeseek
                </p>
                <h3 className="mt-2 text-2xl font-semibold">
                  Find the right college for your future.
                </h3>
                <p className="mt-2 text-sm text-white/80">
                  Discover programs, compare campuses, and connect with
                  advisors.
                </p>
              </div>
            </div>

            {/* Form panel */}
            <div
              className="
              px-5 pb-6 pt-5
              md:px-10 md:pb-10 md:pt-0
            "
            >
              {/* Mobile: brand pill above heading */}
              <div className="md:hidden flex justify-center mb-3">
                <span className="inline-flex items-center rounded-full bg-[#581845]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#581845]">
                  Collegeseek
                </span>
              </div>

              <div className="text-center pt-1 md:pt-4">
                <h2
                  className="font-bold text-gray-800
                  text-xl md:text-2xl
                "
                >
                  Account Login
                </h2>
                <p className="text-xs text-gray-400 mt-1 md:hidden">
                  Welcome back! Sign in to continue.
                </p>
              </div>

              {(error || success) && (
                <div
                  className={`mt-3 text-center text-sm font-medium rounded-xl px-3 py-2
                  ${error ? "bg-red-50 text-red-600 border border-red-100" : "bg-green-50 text-green-600 border border-green-100"}
                `}
                >
                  {error || success}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="mt-4 space-y-3 md:space-y-4"
              >
                {/* Email */}
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-600 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className={`w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-[#581845]
                      p-2.5 text-sm
                      md:p-3
                      ${emailError ? "border-red-500 bg-red-50" : "border-gray-300"}`}
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {emailError && (
                    <p className="text-red-500 text-xs mt-1">
                      Email is required.
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="relative">
                  <label className="block text-xs md:text-sm font-medium text-gray-600 mb-1">
                    Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-[#581845]
                      p-2.5 text-sm pr-10
                      md:p-3
                      ${passwordError ? "border-red-500 bg-red-50" : "border-gray-300"}`}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-[60%] -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-4 w-4 md:h-5 md:w-5" />
                    ) : (
                      <EyeIcon className="h-4 w-4 md:h-5 md:w-5" />
                    )}
                  </button>
                  {passwordError && (
                    <p className="text-red-500 text-xs mt-1">
                      Password is required.
                    </p>
                  )}
                </div>

                {/* Forgot password */}
                <div className="text-right text-xs">
                  <Link
                    href="/user/auth/forgotPassword"
                    className="text-[#581845] hover:text-[#441137] font-medium"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {/* Terms */}
                <label className="flex items-start gap-2 text-xs text-gray-600">
                  <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-[#581845] shrink-0"
                    checked={acceptedTerms}
                    onChange={(e) => {
                      setAcceptedTerms(e.target.checked);
                      if (e.target.checked) setTermsError(false);
                    }}
                  />
                  <span>
                    I accept the{" "}
                    <a
                      href="/terms&Conditions"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#581845] hover:text-[#441137] underline"
                    >
                      Terms and Conditions
                    </a>{" "}
                    and{" "}
                    <a
                      href="/privacyPolicy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#581845] hover:text-[#441137] underline"
                    >
                      Privacy Policy
                    </a>
                    .
                  </span>
                </label>
                {termsError && (
                  <p className="text-red-500 text-xs">
                    Please accept the Terms and Conditions and Privacy Policy.
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full bg-[#581845] text-white rounded-md hover:bg-[#441137] transition font-semibold
                    p-2.5 text-sm
                    md:p-3 md:text-base
                  "
                >
                  Log In
                </button>
              </form>

              {/* Divider */}
              <div
                className="flex items-center gap-3 text-xs text-gray-500
                my-4 md:my-6
              "
              >
                <span className="h-px flex-1 bg-gray-300" />
                <span>or continue with</span>
                <span className="h-px flex-1 bg-gray-300" />
              </div>

              {/* Google button */}
              <div className="flex flex-col items-center gap-2">
                <div
                  ref={googleButtonRef}
                  className="w-full flex justify-center"
                />
                {googleError && (
                  <p className="text-xs text-red-500 text-center">
                    {googleError}
                  </p>
                )}
              </div>

              {/* Sign up link */}
              <div className="text-center text-sm mt-4">
                <p className="text-gray-600 text-xs md:text-sm">
                  Don't have an account?
                </p>
                <Link
                  href="/user/auth/signUp"
                  className="text-[#581845] hover:text-[#441137] font-medium text-sm"
                >
                  Register here
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LogIn;
