import { Button } from "@/components/ui/button";
import {
  AcademicCapIcon,
  BriefcaseIcon,
  GiftIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { ClipboardListIcon, PhoneIcon } from "lucide-react";
import Link from "next/link";

export default function CollegeAdmissions() {
  return (
    <section className="relative bg-gradient-to-b from-[#fef7f4] via-white to-[#f3f1ff] py-16 mt-0">
      <div className="absolute inset-0 opacity-60 pointer-events-none">
        <div className="absolute left-10 top-6 h-32 w-32 rounded-full bg-[#ffd7c5] blur-3xl" />
        <div className="absolute right-16 top-20 h-40 w-40 rounded-full bg-[#d9d4ff] blur-[80px]" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center mb-12 space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/80 px-6 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#c25541]">
            Admissions support
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900">
            Get Ready for Your College Admissions Journey
          </h2>
          <p className="max-w-3xl mx-auto text-sm sm:text-base md:text-lg text-gray-600">
            Our experts pair personalized counselling with application tracking and financial guidance so you can focus on choosing the right college.
          </p>
        </div>

      {/* Progress Bar (Optional) */}
      {/*
      <div className="flex justify-start sm:justify-center items-center gap-4 sm:gap-8 my-7 overflow-x-auto whitespace-nowrap">
        {[
          "Set Goals",
          "Choose Program",
          "Track Progress",
          "Join Community",
          "Achieve Milestones",
          "Admission Confirmed",
        ].map((step, index) => (
          <div
            key={index}
            className="flex items-center gap-2 sm:gap-4 bg-yellow-100 text-yellow-600 px-4 sm:px-6 py-3 sm:py-4 rounded-xl text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hover:bg-yellow-200"
          >
            <span className="w-6 h-6 sm:w-7 sm:h-7 bg-yellow-500 text-white rounded-full flex items-center justify-center border-2 border-yellow-600 text-xs sm:text-sm">
              {index + 1}
            </span>
            <span className="text-[10px]">{step}</span>
          </div>
        ))}
      </div>
      */}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/90 border border-gray-100 p-6 rounded-2xl shadow-[0_20px_60px_rgba(62,44,92,0.08)] hover:shadow-[0_20px_60px_rgba(62,44,92,0.15)] transition flex gap-4 items-start"
            >
              <div className="rounded-full bg-[#fff3f0] text-[#d25c40] p-3">
                 {feature.icon}
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-sm text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-xs text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link href="college/apply?college">
            <Button className="bg-[#d25c41] text-white px-8 py-3 rounded-full shadow-md hover:bg-[#b74930] transition">
              Start Your Application
            </Button>
          </Link>

          <Link href="/contactUs">
            <Button className="border border-[#d25c41] text-[#d25c41] px-8 py-3 rounded-full shadow hover:bg-[#fff7ed] transition">
              Contact an Admissions Counselor
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

const features = [
  {
    title: "Select Your Desired Program",
    description:
      "Explore a wide range of undergraduate and graduate programs that match your goals.",
    icon: <AcademicCapIcon className="h-8 w-8" />,
  },
  {
    title: "Simplify Your Application",
    description:
      "Submit your application online in just a few easy steps through our user-friendly platform.",
    icon: <ClipboardListIcon className="h-8 w-8" />,
  },
  {
    title: "Financial Aid Assistance",
    description:
      "Get help with scholarships, grants, and other financial aid options to fund your education.",
    icon: <BriefcaseIcon className="h-8 w-8" />,
  },
  {
    title: "Apply for Scholarships",
    description:
      "Take advantage of various scholarship opportunities available for eligible students.",
    icon: <GiftIcon className="h-8 w-8" />,
  },
  {
    title: "Connect with Admissions Experts",
    description:
      "Reach out to our admissions counselors to get personalized guidance and support.",
    icon: <UsersIcon className="h-8 w-8" />,
  },
  {
    title: "Track Your Application Status",
    description:
      "Stay informed about your application status and get notified of any updates.",
    icon: <PhoneIcon className="h-8 w-8" />,
  },
];
