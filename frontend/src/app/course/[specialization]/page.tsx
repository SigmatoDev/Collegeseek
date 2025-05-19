"use client";

import { useParams } from "next/navigation";
import Header from "@/components/header/page";
import Footer from "@/components/footer/page";
import CourseDetails from "@/components/courses/coursesDetail/page";

const CourseDetailsPage = () => {
  const params = useParams();
  const specialization = params.specialization as string;

  if (!specialization) {
    return <div className="text-center p-4">Specialization not found.</div>;
  }

  return (
    <>
      <Header />
      <CourseDetails specialization={specialization} />
      <Footer />
    </>
  );
};

export default CourseDetailsPage;
