"use client";

import { Mail, Phone, MapPin } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import axios from "axios";
import { api_url } from "@/utils/apiCall";
import ContactForm from "./contactForm";
import { colors } from "@/theme/colors";

const DEFAULT_CONTACT = {
  phone: "1800-572-9877",
  email: "hello@collegeseek.in",
  address: "123 College Road, Education City",
};

export default function ContactDetails() {
  const [contactInfo, setContactInfo] = useState(DEFAULT_CONTACT);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const { data } = await axios.get(`${api_url}settings`);
        setContactInfo({
          phone: data.contactPhone || DEFAULT_CONTACT.phone,
          email: data.contactEmail || DEFAULT_CONTACT.email,
          address: data.contactAddress || DEFAULT_CONTACT.address,
        });
      } catch (error) {
        setContactInfo(DEFAULT_CONTACT);
      }
    };
    fetchContact();
  }, []);

  return (
    <div className="max-w-8xl mx-auto px-4 py-6 md:px-8 md:py-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-12 bg-white">

        {/* ── LEFT: contact info — modern card on mobile ── */}
        <div className="flex flex-col justify-center">

          {/* Label pill */}
          <span className="inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-widest mb-3 md:mb-4"
            style={{ 
              borderColor: colors.accent.orange + '30',
              backgroundColor: colors.accent.orange + '10',
              color: colors.accent.red
            }}
          >
            Get in touch
          </span>

          <h3 className="font-bold leading-tight
            text-2xl mb-2
            md:text-4xl md:mb-4"
            style={{ color: colors.accent.red }}
          >
            Let's Talk
          </h3>

          <p className="text-gray-500 leading-relaxed
            text-sm mb-5
            md:text-lg md:mb-8
          ">
            We'd love to hear from you. Whether you have a question about
            colleges, courses, pricing, or anything else — our team is ready to
            answer all your questions.
          </p>

          {/* Contact items — modern card list on mobile */}
          <div className="space-y-3 md:space-y-5">
            <ContactItem
              icon={<Phone size={18} style={{ color: colors.accent.red }} />}
              title="Call Us"
              detail={contactInfo.phone}
              href={`tel:${contactInfo.phone}`}
            />
            <ContactItem
              icon={<Mail size={18} style={{ color: colors.accent.red }} />}
              title="Email"
              detail={contactInfo.email}
              href={`mailto:${contactInfo.email}`}
            />
            <ContactItem
              icon={<MapPin size={18} style={{ color: colors.accent.red }} />}
              title="Visit Us"
              detail={contactInfo.address}
            />
          </div>
        </div>

        {/* ── RIGHT: contact form ── */}
        <div className="rounded-2xl md:rounded-none overflow-hidden">
          <ContactForm />
        </div>

      </div>
    </div>
  );
}

const ContactItem = ({
  icon,
  title,
  detail,
  href,
}: {
  icon: ReactNode;
  title: string;
  detail: string;
  href?: string;
}) => {
  const inner = (
    <div className="flex items-center gap-3 md:gap-4 rounded-2xl border transition px-4 py-3 md:px-4 md:py-3"
      style={{
        borderColor: colors.accent.orange + '30',
        backgroundColor: colors.accent.orange + '15',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = colors.accent.orange + '60';
        e.currentTarget.style.backgroundColor = colors.accent.orange + '25';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = colors.accent.orange + '30';
        e.currentTarget.style.backgroundColor = colors.accent.orange + '15';
      }}
    >
      {/* Icon circle */}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm border"
        style={{ borderColor: colors.accent.orange + '30' }}
      >
        {icon}
      </div>

      {/* Text */}
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-widest leading-none mb-0.5"
          style={{ color: colors.accent.red + '80' }}
        >
          {title}
        </p>
        <p className="text-gray-700 font-medium truncate
          text-sm md:text-base
        ">
          {detail}
        </p>
      </div>

      {/* Arrow indicator */}
      {href && (
        <svg className="ml-auto shrink-0 h-4 w-4" style={{ color: colors.accent.red + '50' }} fill="none" viewBox="0 0 16 16">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </div>
  );

  return href ? (
    <a href={href} className="block focus:outline-none">{inner}</a>
  ) : (
    <div>{inner}</div>
  );
};

// // "use client";

// // import { Mail, Phone, MapPin } from "lucide-react";
// // import { useEffect, useState, type ReactNode } from "react";
// // import axios from "axios";
// // import { api_url } from "@/utils/apiCall";
// // import ContactForm from "./contactForm";

// // const DEFAULT_CONTACT = {
// //   phone: "1800-572-9877",
// //   email: "hello@collegeseek.in",
// //   address: "123 College Road, Education City",
// // };

// // export default function ContactDetails() {
// //   const [contactInfo, setContactInfo] = useState(DEFAULT_CONTACT);

// //   useEffect(() => {
// //     const fetchContact = async () => {
// //       try {
// //         const { data } = await axios.get(`${api_url}settings`);
// //         setContactInfo({
// //           phone: data.contactPhone || DEFAULT_CONTACT.phone,
// //           email: data.contactEmail || DEFAULT_CONTACT.email,
// //           address: data.contactAddress || DEFAULT_CONTACT.address,
// //         });
// //       } catch (error) {
// //         console.error("Error loading contact details:", error);
// //         setContactInfo(DEFAULT_CONTACT);
// //       }
// //     };

// //     fetchContact();
// //   }, []);

// //   return (
// //     <div className="max-w-8xl mx-auto px-4 md:px-8 py-8">
// //       <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white">
// //         <div className="flex flex-col justify-center">
// //           <h3 className="text-4xl font-bold text-[#D17563] mb-4">Let’s Talk</h3>
// //           <p className="text-gray-600 text-lg mb-10">
// //             We’d love to hear from you. Whether you have a question about
// //             colleges, courses, pricing, or anything else — our team is ready to
// //             answer all your questions.
// //           </p>

// //           <div className="space-y-6">
// //             <ContactItem
// //               icon={<Phone className="text-[#D17563]" size={24} />}
// //               title="Call Us"
// //               detail={contactInfo.phone}
// //             />
// //             <ContactItem
// //               icon={<Mail className="text-[#D17563]" size={24} />}
// //               title="Email"
// //               detail={contactInfo.email}
// //             />
// //             <ContactItem
// //               icon={<MapPin className="text-[#D17563]" size={24} />}
// //               title="Visit Us"
// //               detail={contactInfo.address}
// //             />
// //           </div>
// //         </div>

// //         <div>
// //           <ContactForm />
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // const ContactItem = ({
// //   icon,
// //   title,
// //   detail,
// // }: {
// //   icon: ReactNode;
// //   title: string;
// //   detail: string;
// // }) => (
// //   <div className="flex items-start gap-4">
// //     <div className="bg-[#FFF7ED] p-3 rounded-xl">{icon}</div>
// //     <div>
// //       <h4 className="text-[#D17563] font-semibold text-lg">{title}</h4>
// //       <p className="text-gray-600">{detail}</p>
// //     </div>
// //   </div>
// // );
// "use client";

// import { Mail, Phone, MapPin } from "lucide-react";
// import { useEffect, useState, type ReactNode } from "react";
// import axios from "axios";
// import { api_url } from "@/utils/apiCall";
// import ContactForm from "./contactForm";

// const DEFAULT_CONTACT = {
//   phone: "1800-572-9877",
//   email: "hello@collegeseek.in",
//   address: "123 College Road, Education City",
// };

// export default function ContactDetails() {
//   const [contactInfo, setContactInfo] = useState(DEFAULT_CONTACT);

//   useEffect(() => {
//     const fetchContact = async () => {
//       try {
//         const { data } = await axios.get(`${api_url}settings`);
//         setContactInfo({
//           phone: data.contactPhone || DEFAULT_CONTACT.phone,
//           email: data.contactEmail || DEFAULT_CONTACT.email,
//           address: data.contactAddress || DEFAULT_CONTACT.address,
//         });
//       } catch (error) {
//         setContactInfo(DEFAULT_CONTACT);
//       }
//     };
//     fetchContact();
//   }, []);

//   return (
//     <div className="max-w-8xl mx-auto px-4 py-6 md:px-8 md:py-8">
//       <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-12 bg-white">

//         {/* ── LEFT: contact info — modern card on mobile ── */}
//         <div className="flex flex-col justify-center">

//           {/* Label pill */}
//           <span className="inline-flex w-fit items-center rounded-full border border-[#D17563]/30 bg-[#FFF7ED] px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#D17563] mb-3 md:mb-4">
//             Get in touch
//           </span>

//           <h3 className="font-bold text-[#D17563] leading-tight
//             text-2xl mb-2
//             md:text-4xl md:mb-4
//           ">
//             Let's Talk
//           </h3>

//           <p className="text-gray-500 leading-relaxed
//             text-sm mb-5
//             md:text-lg md:mb-8
//           ">
//             We'd love to hear from you. Whether you have a question about
//             colleges, courses, pricing, or anything else — our team is ready to
//             answer all your questions.
//           </p>

//           {/* Contact items — modern card list on mobile */}
//           <div className="space-y-3 md:space-y-5">
//             <ContactItem
//               icon={<Phone size={18} className="text-[#D17563]" />}
//               title="Call Us"
//               detail={contactInfo.phone}
//               href={`tel:${contactInfo.phone}`}
//             />
//             <ContactItem
//               icon={<Mail size={18} className="text-[#D17563]" />}
//               title="Email"
//               detail={contactInfo.email}
//               href={`mailto:${contactInfo.email}`}
//             />
//             <ContactItem
//               icon={<MapPin size={18} className="text-[#D17563]" />}
//               title="Visit Us"
//               detail={contactInfo.address}
//             />
//           </div>
//         </div>

//         {/* ── RIGHT: contact form ── */}
//         <div className="rounded-2xl md:rounded-none overflow-hidden">
//           <ContactForm />
//         </div>

//       </div>
//     </div>
//   );
// }

// const ContactItem = ({
//   icon,
//   title,
//   detail,
//   href,
// }: {
//   icon: ReactNode;
//   title: string;
//   detail: string;
//   href?: string;
// }) => {
//   const inner = (
//     <div className="flex items-center gap-3 md:gap-4 rounded-2xl border border-[#D17563]/10 bg-[#FFF7ED]/60 transition hover:border-[#D17563]/30 hover:bg-[#FFF7ED]
//       px-4 py-3
//       md:px-4 md:py-3
//     ">
//       {/* Icon circle */}
//       <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm border border-[#D17563]/15
//         md:h-10 md:w-10
//       ">
//         {icon}
//       </div>

//       {/* Text */}
//       <div className="min-w-0">
//         <p className="text-[10px] font-bold uppercase tracking-widest text-[#D17563]/70 leading-none mb-0.5">
//           {title}
//         </p>
//         <p className="text-gray-700 font-medium truncate
//           text-sm md:text-base
//         ">
//           {detail}
//         </p>
//       </div>

//       {/* Arrow indicator */}
//       {href && (
//         <svg className="ml-auto shrink-0 h-4 w-4 text-[#D17563]/40" fill="none" viewBox="0 0 16 16">
//           <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//         </svg>
//       )}
//     </div>
//   );

//   return href ? (
//     <a href={href} className="block focus:outline-none">{inner}</a>
//   ) : (
//     <div>{inner}</div>
//   );
// };