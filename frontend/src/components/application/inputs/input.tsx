"use client";

import React, { useEffect, useState } from "react";

type InputProps = {
  label: string;
  path: string;
  type?: string;
  required?: boolean;
  placeholder?: string;

  formData: any;
  stepErrors?: Record<string, string>;
  updateField: (path: string, value: any) => void;
  clearFieldError?: (path: string) => void;
};

const Input: React.FC<InputProps> = ({
  label,
  path,
  type = "text",
  required,
  placeholder,
  formData,
  stepErrors = {},
  updateField,
  clearFieldError,
}) => {
  const [mounted, setMounted] = useState(false);

  // ✅ Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ Safe nested value extraction
  const rawValue =
    path.split(".").reduce((acc: any, key: string) => acc?.[key], formData) ??
    "";

  // ✅ Hydration-safe date handling (NO new Date())
  const value =
    type === "date" && rawValue
      ? String(rawValue).slice(0, 10)
      : rawValue ?? "";

  const error = stepErrors[path];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue: any = e.target.value;

    // ✅ date save logic (store ISO string safely)
    if (type === "date" && newValue) {
      newValue = new Date(newValue + "T00:00:00.000Z").toISOString();
    }

    // ✅ mobile number safety (digits only, max 10)
    if (type === "tel") {
      newValue = newValue.replace(/\D/g, "").slice(0, 10);
    }

    updateField(path, newValue);
    clearFieldError?.(path);
  };

  // ✅ Avoid SSR mismatch completely
  if (!mounted) return null;

  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </span>

      <input
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        autoComplete="off"
        data-lpignore="true" // ✅ prevent LastPass injection
        className={`rounded-lg border px-3 py-2 text-sm focus:outline-none ${
          error ? "border-red-400" : "border-gray-200"
        }`}
      />

      {error && <span className="text-xs text-red-500">{error}</span>}
    </label>
  );
};

export default Input;