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
  emailError: ReactNode;
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const [registerData, setRegisterData] = useState<RegisterData>({
    name: "", email: "", phone: "", password: "", confirmPassword: "", emailError: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const setToken = useUserStore((state) => state.setToken);

  useEffect(() => { setMounted(true); }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess("");
    const { name, email, phone, password, confirmPassword } = registerData;
    if (!name || !email || !phone || !password || !confirmPassword) {
      setError("Please fill in all fields."); setShowModal(true); return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match."); setShowModal(true); return;
    }
    try {
      const res = await fetch(`${api_url}user/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });
      const data = await res.json();
      if (res.ok && data.token && data.user) {
        setUser({ ...data.user, token: data.token });
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
          } else { router.push("/"); }
        }, 1500);
      } else {
        setError(data.message || "Something went wrong."); setShowModal(true);
      }
    } catch (err) {
      console.error(err); setError("Server error. Please try again later."); setShowModal(true);
    }
  };

  if (!mounted) return null;

  const inputClass = "w-full border rounded-md focus:outline-none focus:ring focus:border-[#581845] p-2.5 text-sm md:p-3 md:text-base";

  return (
    <>
      <Header />
      <div className="flex flex-col items-center bg-white
        pt-4 pb-8 px-4
        md:pt-6 md:pb-12 md:px-0
      ">
        <div className="w-full bg-[#F3F4F6] shadow-lg rounded-lg
          max-w-sm p-5
          md:max-w-md md:p-8
        ">
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
            <h2 className="font-bold text-gray-800
              text-xl md:text-2xl
            ">
              Create an Account
            </h2>
            <p className="text-gray-500 text-xs md:text-sm">Sign up to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-3 md:mt-6 md:space-y-4">

            {/* Name */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-600 mb-1">Name</label>
              <input
                type="text" name="name" maxLength={200}
                className={inputClass}
                placeholder="Enter your name"
                value={registerData.name}
                onChange={(e) => {
                  const onlyLetters = e.target.value.replace(/[^A-Za-z\s]/g, "");
                  setRegisterData((prev) => ({ ...prev, name: onlyLetters }));
                }}
              />
              {registerData.name.length >= 150 && (
                <p className="text-red-500 text-xs mt-1">Name cannot exceed 150 characters</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-600 mb-1">Email</label>
              <input
                type="email" name="email"
                className={inputClass}
                placeholder="Enter your email"
                value={registerData.email}
                onChange={(e) => setRegisterData((prev) => ({ ...prev, email: e.target.value.trim() }))}
                onBlur={(e) => {
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  setRegisterData((prev) => ({
                    ...prev,
                    emailError: e.target.value && !emailRegex.test(e.target.value)
                      ? "Please enter a valid email address" : "",
                  }));
                }}
              />
              {registerData.emailError && <p className="text-red-500 text-xs mt-1">{registerData.emailError}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-600 mb-1">Phone</label>
              <input
                type="tel" name="phone" maxLength={10}
                className={inputClass}
                placeholder="Enter your 10-digit phone number"
                value={registerData.phone}
                onChange={(e) => {
                  const onlyNums = e.target.value.replace(/\D/g, "");
                  if (onlyNums.length <= 10) setRegisterData((prev) => ({ ...prev, phone: onlyNums }));
                }}
              />
              {registerData.phone.length > 0 && registerData.phone.length < 10 && (
                <p className="text-red-500 text-xs mt-1">Phone number must be 10 digits</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-600 mb-1">Password</label>
              <input
                type={showPassword ? "text" : "password"} name="password"
                className={inputClass}
                placeholder="Enter password"
                value={registerData.password}
                onChange={handleInputChange}
              />
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label className="block text-xs md:text-sm font-medium text-gray-600 mb-1">Confirm Password</label>
              <input
                type={showPassword ? "text" : "password"} name="confirmPassword"
                className={`${inputClass} pr-10`}
                placeholder="Confirm password"
                value={registerData.confirmPassword}
                onChange={handleInputChange}
              />
              <button
                type="button"
                className="absolute right-3 top-[60%] -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword
                  ? <EyeSlashIcon className="h-4 w-4 md:h-5 md:w-5" />
                  : <EyeIcon className="h-4 w-4 md:h-5 md:w-5" />
                }
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-[#581845] text-white rounded-md hover:bg-[#441137] transition duration-200 font-semibold
                p-2.5 text-sm
                md:p-3 md:text-base
              "
            >
              Register
            </button>
          </form>

          {/* Login link */}
          <div className="mt-3 md:mt-4 text-center text-sm">
            <p className="text-gray-600 text-xs md:text-sm">Already have an account?</p>
            <Link href="/user/auth/logIn" className="text-[#581845] hover:text-[#441137] font-medium text-sm">
              Login here
            </Link>
          </div>

          {/* Modal — unchanged */}
          {showModal && (
            <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-4">
              <div className="bg-white px-5 py-4 rounded-2xl w-full max-w-xs text-center shadow-[0_20px_45px_rgba(15,23,42,0.25)]">
                {error ? (
                  <>
                    <h3 className="text-lg font-semibold text-red-500">Registration Failed</h3>
                    <p className="text-sm text-gray-600 mt-2">{error}</p>
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