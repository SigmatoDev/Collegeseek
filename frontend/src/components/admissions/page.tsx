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
    <div className="max-w-7xl mx-auto px-4 sm:px-[15px] py-12 sm:py-[80px]">
      {/* Heading */}
      <div className="text-center mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
          Get Ready for Your College Admissions Journey
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-gray-600">
          Our expert guidance and personalized support will help you navigate
          the admissions process with confidence.
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

      {/* Features Section */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-xl transition duration-300 ease-in-out flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6"
          >
            {/* Icon */}
            <div className="bg-yellow-100 text-yellow-600 p-3 sm:p-4 rounded-full shadow-inner">
              {feature.icon}
            </div>

            {/* Title and Description */}
            <div className="flex flex-col items-center sm:items-start w-full text-center sm:text-left">
              <h3 className="font-semibold text-sm sm:text-[14px] text-gray-800 break-words">
                {feature.title}
              </h3>
              <p className="text-xs sm:text-[12px] text-gray-600">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mt-8">
        <Link href="/college">
          <Button className="bg-yellow-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg shadow-md transform hover:scale-105 transition-all duration-300 ease-in-out hover:bg-yellow-700">
            Start Your Application
          </Button>
        </Link>

        <Link href="/contactUs">
          <Button className="border border-yellow-600 text-yellow-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg shadow-md transform hover:scale-105 transition-all duration-300 ease-in-out hover:bg-blue-50">
            Contact an Admissions Counselor
          </Button>
        </Link>
      </div>
    </div>
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
