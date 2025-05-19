// app/college/page.tsx
import Header from "@/components/header/page";
import Footer from "@/components/footer/page";
import Breadcrumb from "@/components/breadcrumb/breadcrumb";
import { Suspense } from "react";
import CollegesClientWrapper from "./collegeClientWrapper";

export default function CollegesPage() {
  return (
    <>
      <Header />
      <div className="px-10 pt-6">
        <Breadcrumb
          items={[{ label: "Home", href: "/" }, { label: "Colleges" }]}
        />
      </div>
      <div className="relative px-10 py-6">
        <Suspense fallback={<p>Loading colleges...</p>}>
          <CollegesClientWrapper />
        </Suspense>
      </div>
      <Footer />
    </>
  );
}
