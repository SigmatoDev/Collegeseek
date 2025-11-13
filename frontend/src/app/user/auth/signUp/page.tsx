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
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    emailError: "", // 👈 add this
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // ✅ Zustand store functions
  const setUser = useUserStore((state) => state.setUser);
  const setToken = useUserStore((state) => state.setToken);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { name, email, phone, password, confirmPassword } = registerData;

    if (!name || !email || !phone || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      setShowModal(true);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setShowModal(true);
      return;
    }

    try {
      const res = await fetch(`${api_url}user/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await res.json();

      if (res.ok && data.token && data.user) {
        // ✅ Save user and token in Zustand store
        setUser({ ...data.user, token: data.token });
        setToken(data.token);

        setSuccess("Account created successfully!");
        setShowModal(true);

        // ✅ Auto-shortlist pending college (if stored before signup)
        const pendingCollege = sessionStorage.getItem(
          "pendingShortlistCollege"
        );
        if (pendingCollege) {
          try {
            const { id, name, location } = JSON.parse(pendingCollege);
            await fetch(`${api_url}shortlist`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${data.token}`,
              },
              body: JSON.stringify({
                collegeId: id,
                name: data.user.name,
                email: data.user.email,
                phone: data.user.phone,
              }),
            });

            console.log("✅ Auto-shortlisted after signup:", name);
            sessionStorage.removeItem("pendingShortlistCollege");
          } catch (err) {
            console.error("❌ Auto-shortlist failed:", err);
          }
        }

        // Redirect after short delay
        // ✅ Handle redirect after signup
        const redirectTo = sessionStorage.getItem("redirectAfterLogin");
        // console.log("🎯 Stored redirectAfterLogin (signup):", redirectTo);

        setTimeout(() => {
          if (
            redirectTo &&
            redirectTo !== "/user/auth/logIn" &&
            redirectTo !== "/user/auth/register"
          ) {
            // console.log("✅ Redirecting back to:", redirectTo);
            sessionStorage.removeItem("redirectAfterLogin");
            router.push(redirectTo);
          } else {
            // console.log("⚠️ No valid redirect found — going to home page.");
            router.push("/");
          }
        }, 1500);
      } else {
        setError(data.message || "Something went wrong.");
        setShowModal(true);
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again later.");
      setShowModal(true);
    }
  };

  if (!mounted) return null;

  return (
    <>
      <Header />
      <div className="flex flex-col justify-center items-center min-h-screen bg-white">
        <div className="w-full max-w-md bg-[#F3F4F6] p-8 rounded-lg shadow-lg">
          <div className="flex justify-center">
            <Image
              src="/logo/cs-logo_a.webp"
              alt="Logo"
              width={120}
              height={50}
            />
          </div>

          <div className="text-center mt-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Create an Account
            </h2>
            <p className="text-gray-500">Sign up to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Name
              </label>
              <input
                type="text"
                name="name"
                maxLength={200} // limit total length to 150
                className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:border-[#581845]"
                placeholder="Enter your name"
                value={registerData.name}
                onChange={(e) => {
                  const onlyLetters = e.target.value.replace(
                    /[^A-Za-z\s]/g,
                    ""
                  ); // remove non-letters and non-spaces
                  setRegisterData((prev) => ({ ...prev, name: onlyLetters }));
                }}
              />
              {registerData.name.length >= 150 && (
                <p className="text-red-500 text-sm mt-1">
                  Name cannot exceed 150 characters
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Email
              </label>
              <input
                type="email"
                name="email"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:border-[#581845]"
                placeholder="Enter your email"
                value={registerData.email}
                onChange={(e) => {
                  const value = e.target.value.trim();
                  setRegisterData((prev) => ({ ...prev, email: value }));
                }}
                onBlur={(e) => {
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  setRegisterData((prev) => ({
                    ...prev,
                    emailError:
                      e.target.value && !emailRegex.test(e.target.value)
                        ? "Please enter a valid email address"
                        : "",
                  }));
                }}
              />

              {registerData.emailError && (
                <p className="text-red-500 text-sm mt-1">
                  {registerData.emailError}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                maxLength={10} // prevent typing more than 10 digits
                className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:border-[#581845]"
                placeholder="Enter your 10-digit phone number"
                value={registerData.phone}
                onChange={(e) => {
                  const onlyNums = e.target.value.replace(/\D/g, ""); // remove non-numeric chars
                  if (onlyNums.length <= 10) {
                    setRegisterData((prev) => ({ ...prev, phone: onlyNums }));
                  }
                }}
              />
              {registerData.phone.length > 0 &&
                registerData.phone.length < 10 && (
                  <p className="text-red-500 text-sm mt-1">
                    Phone number must be 10 digits
                  </p>
                )}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-600">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:border-[#581845]"
                placeholder="Enter password"
                value={registerData.password}
                onChange={handleInputChange}
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-600">
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:border-[#581845]"
                placeholder="Confirm password"
                value={registerData.confirmPassword}
                onChange={handleInputChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-[#581845] text-white p-3 rounded-md hover:bg-[#441137] transition duration-200"
            >
              Register
            </button>
          </form>

          <div className="mt-4 text-center text-sm">
            <p className="text-gray-600">Already have an account?</p>
            <Link
              href="/user/auth/logIn"
              className="text-[#581845] hover:text-[#441137] font-medium"
            >
              Login here
            </Link>
          </div>

          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg w-80 text-center shadow-xl">
                {error ? (
                  <>
                    <h3 className="text-xl font-semibold text-red-500">
                      Registration Failed
                    </h3>
                    <p className="text-gray-600 mt-2">{error}</p>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold text-green-500">
                      Success!
                    </h3>
                    <p className="text-gray-600 mt-2">{success}</p>
                  </>
                )}
                <button
                  className="mt-4 bg-[#581845] text-white p-2 rounded-md"
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
