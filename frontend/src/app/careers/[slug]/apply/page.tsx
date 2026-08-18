import type { Metadata } from "next";
import Header from "@/components/header/page";
import Footer from "@/components/footer/page";
import CareerApplicationForm from "@/components/careers/careerApplicationForm";

export const metadata: Metadata = { title: "Apply for a Career | CollegeSeek", description: "Submit your application for a career opportunity at CollegeSeek.", robots: { index: false, follow: false } };

export default function CareerApplicationPage() { return <><Header /><CareerApplicationForm /><Footer /></>; }
