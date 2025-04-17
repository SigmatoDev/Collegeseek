"use client";

import { useParams } from "next/navigation";
import Header from "@/components/header/page";
import Footer from "@/components/footer/page";
import CourseDetails from "@/components/courses/coursesDetail/page";

const CourseDetailsPage = () => {
  const params = useParams();
  const slug = params.slug as string;

  if (!slug) {
    return <div className="text-center p-4">Course not found.</div>;
  }

  return (
    <>
      <Header />
      <CourseDetails slug={slug} />
      <Footer />
    </>
  );
};

export default CourseDetailsPage;
