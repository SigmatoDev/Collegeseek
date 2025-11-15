// app/college/page.tsx
import Header from "@/components/header/page";
import Footer from "@/components/footer/page";
import Breadcrumb from "@/components/breadcrumb/breadcrumb";
import { Suspense } from "react";
import CollegesClientWrapper from "./collegeClientWrapper";
import CallbackForm from "@/components/newsletters/page";
import CollegeListSkeleton from "@/components/college/CollegeListSkeleton";

export default function CollegesPage() {
  return (
    <>
      <Header />
      <div className="px-10 pt-2 pb-1 bg-gradient-to-br from-gray-50 via-gray to-gray-100">
        <Breadcrumb
          items={[{ label: "Home", href: "/" }, { label: "Colleges" }]}
        />
      </div>
      <div className="relative px-10 py-6">
        <Suspense fallback={<CollegeListSkeleton />}>
          <CollegesClientWrapper />
        </Suspense>
      </div>
      <CallbackForm />

      <Footer />
    </>
  );
}
