// "use client";

// import React from "react";
// import {
//   ArrowRight,
//   ArrowRightCircle,
//   Clock4,
//   GraduationCap,
//   Layers,
// } from "lucide-react";
// import Link from "next/link";

// interface CourseCardProps {
//   title: string;
//   description?: string;
//   durationLabel: string;
//   degreeLabel?: string | null;
//   modeLabel?: string | null;
//   eligibility?: string | null;
//   entranceExam?: string | null;
//   slug: string;
//   image?: string;
//   streams?: { _id: string; name: string }[];
//   focusAreas?: string[];
//   examList?: string[];
//   collegeCount?: number;
//   collegeName?: string;
// }

// const CourseCard: React.FC<CourseCardProps> = ({
//   title,
//   description,
//   durationLabel,
//   degreeLabel,
//   modeLabel,
//   eligibility,
//   entranceExam,
//   examList = [],
//   slug,
//   image = "/image/14.jpg",
//   streams = [],
//   focusAreas = [],
//   collegeCount,
//   collegeName,
// }) => {
//   // console.log("🔹 Rendering CourseCard:", { title, streams, focusAreas, examList });

//   const specialization = title;
//   const specializationQuery = specialization
//     ? encodeURIComponent(specialization)
//     : "";
//   const collegeFilterHref = specializationQuery
//     ? `/college?specializations=${specializationQuery}`
//     : "/college";

//   const focusDisplay = focusAreas.slice(0, 4);

//   const examSummary =
//     examList.length > 0
//       ? examList.join(", ")
//       : entranceExam || "Depends on college";

//   const summarizeFocus = (items: string[]) => {
//     const text = items.join(", ");
//     const words = text.split(" ");
//     if (words.length <= 6) return text;
//     return `${words.slice(0, 6).join(" ")}...`;
//   };
//   const focusSummaryText = focusDisplay.length
//     ? summarizeFocus(focusDisplay)
//     : "General program overview";

//   const focusChipStyles = [
//     "text-[#4731b1] border border-[#4731b1]/30",
//     "text-[#b45309] border border-[#b45309]/30",
//     "text-[#0b5ed7] border border-[#0b5ed7]/30",
//     "text-[#1f7a3f] border border-[#1f7a3f]/30",
//   ];

//  const primaryStream =
//   streams && streams.length > 0
//     ? streams.find(s => s.name === title)?.name || streams[0]?.name
//     : "Flexible stream";


//   // console.log("🔹 Primary Stream:", primaryStream);

//   return (
//     <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm shadow-slate-100 transition hover:border-[#635dc1]/40 hover:shadow-lg hover:shadow-slate-200">
//       <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
//         <div className="flex items-start gap-4">
//           <Link href={collegeFilterHref} className="hidden sm:block">
//             <img
//               src={image}
//               alt={title}
//               className="h-16 w-16 rounded-full object-cover shadow"
//               loading="lazy"
//               onError={(e) => {
//                 e.currentTarget.src = "/logo/logo-removebg-preview.png";
//                 // console.log("⚠️ Image failed to load, fallback used");
//               }}
//             />
//           </Link>
//           <div className="flex-1">
//             <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#635dc1]">
//               <span className="h-2 w-2 rounded-full bg-gradient-to-r from-[#ff8c6b] to-[#f9c26b]" />
//               Curated Course
//             </div>
//             <Link href={collegeFilterHref} className="inline-block group focus:outline-none">
//               <h2 className="text-xl font-semibold text-slate-900 group-hover:text-[#635dc1] transition-colors">
//                 {title}
//               </h2>
//             </Link>
//             {collegeName && (
//               <p className="mt-1 text-xs text-slate-500">{collegeName}</p>
//             )}
//             {description && (
//               <Link
//                 href={collegeFilterHref}
//                 className="mt-2 block text-sm text-slate-600 line-clamp-2 hover:text-[#635dc1]"
//               >
//                 {description}
//               </Link>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
//         <CourseChip
//           icon={<Clock4 className="h-4 w-4 text-indigo-600" />}
//           label="Duration"
//           value={durationLabel}
//           variant="indigo"
//           href={collegeFilterHref}
//         />
//         <CourseChip
//           icon={<Layers className="h-4 w-4 text-[#ff8c6b]" />}
//           label="Course Type"
//           value={modeLabel || "Flexible"}
//           variant="orange"
//           href={collegeFilterHref}
//         />
//         <CourseChip
//           icon={<GraduationCap className="h-4 w-4 text-[#38337E]" />}
//           label="Degree"
//           value={degreeLabel || "Varies by college"}
//           variant="violet"
//           href={collegeFilterHref}
//         />
//         <CourseChip
//           icon={<Layers className="h-4 w-4 text-emerald-600" />}
//           label="Stream"
//           value={primaryStream}
//           variant="green"
//           href={collegeFilterHref}
//         />
//       </div>

//       <div className="grid gap-3 border-y border-slate-100 py-3 text-xs sm:grid-cols-2">
//         <CourseMetaBlock title="Eligibility" value={eligibility || "Check specific college requirements"} />
//         <CourseMetaBlock title="Entrance Exam" value={examSummary} />
//       </div>

//       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <div className="w-full sm:max-w-xl">
//           <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
//             <span>Focus Areas:</span>
//             {focusDisplay.length > 0 ? (
//               focusDisplay.map((area, idx) => (
//                 <Link
//                   key={`${area}-${idx}`}
//                   href={collegeFilterHref}
//                   className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold bg-white hover:border-[#635dc1] hover:text-[#635dc1] ${
//                     focusChipStyles[idx % focusChipStyles.length]
//                   }`}
//                 >
//                   <span className="h-1.5 w-1.5 rounded-full bg-current/60" />
//                   {area}
//                 </Link>
//               ))
//             ) : (
//               <Link
//                 href={collegeFilterHref}
//                 className="inline-flex rounded-full border border-slate-300/70 px-3 py-1 text-[11px] font-medium text-slate-600 hover:border-[#635dc1] hover:text-[#635dc1]"
//               >
//                 {focusSummaryText}
//               </Link>
//             )}
//           </div>
//         </div>
//         <div className="flex flex-wrap items-center gap-3 sm:flex-nowrap sm:justify-end">
//           <Link
//             href={collegeFilterHref}
//             className="inline-flex items-center gap-2 rounded-full border border-[#635dc1] px-4 py-1.5 text-xs font-semibold text-[#635dc1] transition hover:bg-[#635dc1] hover:text-white"
//           >
//             View Colleges
//             {typeof collegeCount === "number" && (
//               <span className="rounded-full bg-[#ede9fe] px-2 py-0.5 text-[10px] font-semibold text-[#4c1d95]">
//                 {collegeCount}
//               </span>
//             )}
//             <ArrowRight className="h-4 w-4" />
//           </Link>
//           <Link
//             href={`/contactUs?course=${slug}`}
//             className="inline-flex items-center gap-2 rounded-full bg-[#ff8c6b] px-4 py-1.5 text-xs font-semibold text-white shadow hover:shadow-lg"
//           >
//             Apply Now
//             <ArrowRightCircle className="h-5 w-5" />
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// const chipVariants = {
//   indigo: {
//     container: "bg-indigo-50 border-indigo-100 text-indigo-900",
//     label: "text-indigo-600",
//   },
//   green: {
//     container: "bg-emerald-50 border-emerald-100 text-emerald-900",
//     label: "text-emerald-600",
//   },
//   orange: {
//     container: "bg-orange-50 border-orange-100 text-orange-900",
//     label: "text-orange-600",
//   },
//   violet: {
//     container: "bg-purple-50 border-purple-100 text-purple-900",
//     label: "text-purple-600",
//   },
// } satisfies Record<
//   string,
//   {
//     container: string;
//     label: string;
//   }
// >;

// const CourseChip = ({
//   icon,
//   label,
//   value,
//   variant = "indigo",
//   href,
// }: {
//   icon: React.ReactNode;
//   label: string;
//   value: string | null | undefined;
//   variant?: keyof typeof chipVariants;
//   href?: string;
// }) => {
//   const colors = chipVariants[variant] || chipVariants.indigo;
//   const content = (
//     <div
//       className={`rounded-xl border px-3 py-2 text-xs ${colors.container}`}
//     >
//       <div
//         className={`flex items-center gap-2 font-semibold uppercase tracking-wide ${colors.label}`}
//       >
//         {icon}
//         {label}
//       </div>
//       <p className="mt-0.5 pl-6 text-[11px] font-medium">
//         {value || "NA"}
//       </p>
//     </div>
//   );
//   if (href) {
//     return (
//       <Link href={href} className="block focus:outline-none">
//         {content}
//       </Link>
//     );
//   }
//   return content;
// };

// const CourseMetaBlock = ({
//   title,
//   value,
// }: {
//   title: string;
//   value: string;
// }) => (
//   <div className="text-xs">
//     <p className="font-semibold uppercase tracking-wide text-slate-500">
//       {title}
//     </p>
//     <p className="mt-1 text-slate-700">{value}</p>
//   </div>
// );

// export default CourseCard;
"use client";

import React from "react";
import {
  ArrowRight,
  ArrowRightCircle,
  Clock4,
  GraduationCap,
  Layers,
} from "lucide-react";
import Link from "next/link";

interface CourseCardProps {
  title: string;
  description?: string;
  durationLabel: string;
  degreeLabel?: string | null;
  modeLabel?: string | null;
  eligibility?: string | null;
  entranceExam?: string | null;
  slug: string;
  image?: string;
  streams?: { _id: string; name: string }[];
  focusAreas?: string[];
  examList?: string[];
  collegeCount?: number;
  collegeName?: string;
}

const CourseCard: React.FC<CourseCardProps> = ({
  title,
  description,
  durationLabel,
  degreeLabel,
  modeLabel,
  eligibility,
  entranceExam,
  examList = [],
  slug,
  image = "/image/14.jpg",
  streams = [],
  focusAreas = [],
  collegeCount,
  collegeName,
}) => {
  const specialization = title;
  const specializationQuery = specialization ? encodeURIComponent(specialization) : "";
  const collegeFilterHref = specializationQuery
    ? `/college?specializations=${specializationQuery}`
    : "/college";

  const focusDisplay = focusAreas.slice(0, 4);
  const examSummary =
    examList.length > 0 ? examList.join(", ") : entranceExam || "Depends on college";

  const summarizeFocus = (items: string[]) => {
    const text = items.join(", ");
    const words = text.split(" ");
    if (words.length <= 6) return text;
    return `${words.slice(0, 6).join(" ")}...`;
  };
  const focusSummaryText = focusDisplay.length
    ? summarizeFocus(focusDisplay)
    : "General program overview";

  const focusChipStyles = [
    "text-[#4731b1] border border-[#4731b1]/30",
    "text-[#b45309] border border-[#b45309]/30",
    "text-[#0b5ed7] border border-[#0b5ed7]/30",
    "text-[#1f7a3f] border border-[#1f7a3f]/30",
  ];

  const primaryStream =
    streams && streams.length > 0
      ? streams.find((s) => s.name === title)?.name || streams[0]?.name
      : "Flexible stream";

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white/95 shadow-sm shadow-slate-100 transition hover:border-[#635dc1]/40 hover:shadow-lg hover:shadow-slate-200
      gap-3 p-3
      sm:gap-4 sm:p-5
    ">

      {/* Header — title + image */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="flex items-start gap-3 sm:gap-4">
          <Link href={collegeFilterHref} className="hidden sm:block shrink-0">
            <img
              src={image}
              alt={title}
              className="h-16 w-16 rounded-full object-cover shadow"
              loading="lazy"
              onError={(e) => { e.currentTarget.src = "/logo/logo-removebg-preview.png"; }}
            />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="mb-1.5 sm:mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#635dc1]">
              <span className="h-2 w-2 shrink-0 rounded-full bg-gradient-to-r from-[#ff8c6b] to-[#f9c26b]" />
              Curated Course
            </div>
            <Link href={collegeFilterHref} className="inline-block group focus:outline-none">
              <h2 className="font-semibold text-slate-900 group-hover:text-[#635dc1] transition-colors
                text-base leading-snug
                sm:text-xl
              ">
                {title}
              </h2>
            </Link>
            {collegeName && (
              <p className="mt-0.5 text-xs text-slate-500">{collegeName}</p>
            )}
            {description && (
              <Link
                href={collegeFilterHref}
                className="mt-1 sm:mt-2 block text-xs sm:text-sm text-slate-600 line-clamp-2 hover:text-[#635dc1]"
              >
                {description}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Chips grid — 2x2 on mobile, 4-col on desktop */}
      <div className="grid gap-2 sm:gap-3
        grid-cols-2
        sm:grid-cols-2 lg:grid-cols-4
      ">
        <CourseChip
          icon={<Clock4 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-indigo-600" />}
          label="Duration"
          value={durationLabel}
          variant="indigo"
          href={collegeFilterHref}
        />
        <CourseChip
          icon={<Layers className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#ff8c6b]" />}
          label="Course Type"
          value={modeLabel || "Flexible"}
          variant="orange"
          href={collegeFilterHref}
        />
        <CourseChip
          icon={<GraduationCap className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#38337E]" />}
          label="Degree"
          value={degreeLabel || "Varies by college"}
          variant="violet"
          href={collegeFilterHref}
        />
        <CourseChip
          icon={<Layers className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600" />}
          label="Stream"
          value={primaryStream}
          variant="green"
          href={collegeFilterHref}
        />
      </div>

      {/* Meta block — eligibility + exam */}
      <div className="grid gap-2 sm:gap-3 border-y border-slate-100 py-2.5 sm:py-3 text-xs
        grid-cols-2 sm:grid-cols-2
      ">
        <CourseMetaBlock title="Eligibility" value={eligibility || "Check specific college requirements"} />
        <CourseMetaBlock title="Entrance Exam" value={examSummary} />
      </div>

      {/* Focus areas + action buttons */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        {/* Focus area chips — horizontal scroll on mobile */}
        <div className="min-w-0">
          <div
            className="flex items-center gap-1.5 sm:flex-wrap overflow-x-auto sm:overflow-visible"
            style={{ scrollbarWidth: "none" }}
          >
            <span className="shrink-0 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Focus:
            </span>
            {focusDisplay.length > 0 ? (
              focusDisplay.map((area, idx) => (
                <Link
                  key={`${area}-${idx}`}
                  href={collegeFilterHref}
                  className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-[11px] font-semibold bg-white hover:border-[#635dc1] hover:text-[#635dc1] ${focusChipStyles[idx % focusChipStyles.length]}`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current/60 shrink-0" />
                  {area}
                </Link>
              ))
            ) : (
              <Link
                href={collegeFilterHref}
                className="shrink-0 inline-flex rounded-full border border-slate-300/70 px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-[11px] font-medium text-slate-600 hover:border-[#635dc1] hover:text-[#635dc1]"
              >
                {focusSummaryText}
              </Link>
            )}
          </div>
        </div>

        {/* Action buttons — full width on mobile */}
        <div className="flex items-center gap-2 sm:gap-3 sm:flex-nowrap sm:justify-end">
          <Link
            href={collegeFilterHref}
            className="shrink-0 inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-full border border-[#635dc1] text-[#635dc1] font-semibold transition hover:bg-[#635dc1] hover:text-white whitespace-nowrap
              px-3 py-1.5 text-[11px]
              sm:px-4 sm:py-1.5 sm:text-xs
            "
          >
            View Colleges
            {typeof collegeCount === "number" && (
              <span className="rounded-full bg-[#ede9fe] px-1.5 py-0.5 text-[9px] sm:text-[10px] font-semibold text-[#4c1d95]">
                {collegeCount}
              </span>
            )}
            <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
          </Link>
          <Link
            href={`/contactUs?course=${slug}`}
            className="shrink-0 inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-full bg-[#ff8c6b] text-white font-semibold shadow hover:shadow-lg whitespace-nowrap
              px-3 py-1.5 text-[11px]
              sm:px-4 sm:py-1.5 sm:text-xs
            "
          >
            Apply Now
            <ArrowRightCircle className="h-3.5 w-3.5 sm:h-5 sm:w-5 shrink-0" />
          </Link>
        </div>
      </div>
    </div>
  );
};

const chipVariants = {
  indigo: { container: "bg-indigo-50 border-indigo-100 text-indigo-900", label: "text-indigo-600" },
  green: { container: "bg-emerald-50 border-emerald-100 text-emerald-900", label: "text-emerald-600" },
  orange: { container: "bg-orange-50 border-orange-100 text-orange-900", label: "text-orange-600" },
  violet: { container: "bg-purple-50 border-purple-100 text-purple-900", label: "text-purple-600" },
} satisfies Record<string, { container: string; label: string }>;

const CourseChip = ({
  icon,
  label,
  value,
  variant = "indigo",
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null | undefined;
  variant?: keyof typeof chipVariants;
  href?: string;
}) => {
  const colors = chipVariants[variant] || chipVariants.indigo;
  const content = (
    <div className={`rounded-xl border px-2.5 py-2 sm:px-3 sm:py-2 text-xs ${colors.container}`}>
      <div className={`flex items-center gap-1.5 sm:gap-2 font-semibold uppercase tracking-wide ${colors.label}`}>
        {icon}
        <span className="text-[9px] sm:text-[10px] truncate">{label}</span>
      </div>
      <p className="mt-0.5 pl-5 sm:pl-6 text-[10px] sm:text-[11px] font-medium truncate">
        {value || "NA"}
      </p>
    </div>
  );
  if (href) return <Link href={href} className="block focus:outline-none">{content}</Link>;
  return content;
};

const CourseMetaBlock = ({ title, value }: { title: string; value: string }) => (
  <div className="text-xs">
    <p className="font-semibold uppercase tracking-wide text-slate-500
      text-[9px] sm:text-xs
    ">
      {title}
    </p>
    <p className="mt-0.5 sm:mt-1 text-slate-700
      text-[11px] sm:text-xs line-clamp-2
    ">
      {value}
    </p>
  </div>
);

export default CourseCard;