'use client';

import {
  AcademicCapIcon,
  EnvelopeIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/solid';

const teamMembers = [
  {
    name: 'Dr. Emily Carter',
    role: 'Academic Advisor',
    image: '/image/uifaces-popular-image (1).jpg',
    email: 'mailto:emily@collegedirectory.com',
    website: 'https://collegedirectory.com/emily',
  },
  {
    name: 'Mark Daniels',
    role: 'Technical Head',
    image: '/image/uifaces-popular-image (2).jpg',
    email: 'mailto:mark@collegedirectory.com',
    website: 'https://collegedirectory.com/mark',
  },
  {
    name: 'Ayesha Khan',
    role: 'Career Counselor',
    image: '/image/uifaces-popular-image.jpg',
    email: 'mailto:ayesha@collegedirectory.com',
    website: 'https://collegedirectory.com/ayesha',
  },
];

const TeamSection = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-white to-blue-50 text-gray-800">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
          Meet Our Experts
        </h2>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
        Our team is made up of passionate professionals who are committed to helping students find the right path.
        With expertise and care, we guide them toward the best colleges and fulfilling career journeys.        </p>

        <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="relative bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200 group"
            >
              {/* Badge */}
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-tr from-indigo-500 to-blue-600 p-3 rounded-full shadow-lg">
                <AcademicCapIcon className="w-6 h-6 text-white" />
              </div>

              {/* Image */}
              <div className="mt-6 w-28 h-28 mx-auto">
                <img
                  src={member.image}
                  alt={member.name}
                  className="rounded-full object-cover w-full h-full border-4 border-white shadow-md group-hover:scale-105 transition-transform"
                />
              </div>

              {/* Name + Role */}
              <h3 className="mt-6 text-xl font-semibold text-gray-900">{member.name}</h3>
              <p className="text-blue-600 mt-1 font-medium">{member.role}</p>

              {/* Social Icons */}
              <div className="mt-4 flex justify-center gap-4 text-gray-400">
                <a href={member.email} target="_blank" rel="noreferrer" aria-label="Email">
                  <EnvelopeIcon className="w-5 h-5 hover:text-blue-600 transition-colors" />
                </a>
                <a href={member.website} target="_blank" rel="noreferrer" aria-label="Website">
                  <GlobeAltIcon className="w-5 h-5 hover:text-blue-600 transition-colors" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
