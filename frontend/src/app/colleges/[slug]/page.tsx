"use client";

import { useParams } from "next/navigation";
import CollegeDetails from "@/components/college/collegeDetails/collegeDetails";
import Footer from "@/components/footer/page";
import Header from "@/components/header/page";

const CollegesPage = () => {
  const params = useParams();
  const slug = params.slug; // Access dynamic route param like [slug].tsx
  console.log("slug", slug);

  if (!slug) {
    return <div className="text-center p-4">Invalid college slug.</div>;
  }

  return (
    <>
      <Header />
      <CollegeDetails />
      <Footer />
    </>
  );
};

export default CollegesPage;
