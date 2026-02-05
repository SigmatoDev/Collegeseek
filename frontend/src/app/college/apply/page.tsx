// app/college/apply/page.tsx
"use client";

import { Suspense } from "react";
import Header from "@/components/header/page";
import Footer from "@/components/footer/page";
import Breadcrumb from "@/components/breadcrumb/breadcrumb";
import ApplyForm from "./applyForm";

export default function ApplyPage() {
  return (
    <>
      <Header />
      <div className="px-10 pt-2 pb-1 bg-gradient-to-br from-gray-50 via-gray to-gray-100">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Colleges", href: "/college" },
            { label: "Apply" },
          ]}
        />
      </div>
      <div className="px-6 md:px-10 py-6">
        <Suspense fallback={<div>Loading form...</div>}>
          <ApplyForm />
        </Suspense>
      </div>
      <Footer />
    </>
  );
}