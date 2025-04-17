// components/AdveSection.tsx

import Image from 'next/image';
import React from 'react';

// Assuming adveImg is the image file you want to display
import adveImg from '../../../public/image/4.avif'; // Adjust the path accordingly

const AdveSection: React.FC = () => {
  return (
    <section className="w-full bg-gradient-to-r from-indigo-50 via-blue-100 to-indigo-200 md:px-16 py-24  ">
      {/* Title and Image Section */}
      <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-16 mb-16">
        {/* Image Section */}
        <div className="md:w-1/2 relative group">
          <div className="relative overflow-hidden rounded-xl shadow-lg transform transition duration-500 ease-in-out hover:shadow-xl">
            <Image
              src={adveImg}
              alt="Students working on laptop"
              className="object-cover w-full h-full"
              placeholder="blur"
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ height: 'auto' }}
            />
          </div>
          {/* Hover Overlay */}
          {/* <div className="absolute top-0 left-0 w-full h-full bg-black opacity-0 group-hover:opacity-30 transition-opacity duration-300 ease-in-out"></div> */}
        </div>

        {/* Text Content */}
        <div className="md:w-1/2 text-center md:text-left space-y-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-4">
            About Us
          </h1>
          <p className="text-lg text-gray-700 mt-4 mb-6 leading-relaxed">
            Welcome to Collegeseeker, the ultimate platform designed to help students, parents, and educators easily navigate the world of higher education. Our mission is to provide comprehensive, accurate, and up-to-date information about colleges and universities across the country, making the college search process simpler and more accessible.
            <br />
            <br />
            Our platform is built with the idea that every student deserves the best possible education. We provide an easy-to-use interface with powerful filtering tools to help students find the perfect college that fits their unique needs and aspirations. Whether you're looking for colleges in a specific state, with a particular specialization, or based on ranking and fees, we have you covered.
          </p>
        </div>
      </div>

      {/* Content Boxes Section */}
      <div className="flex flex-col md:flex-row gap-16 mb-8  pt-10 ">
        {/* First Box Content: Who We Are */}
        <div className="p-8 bg-white border border-blue-100 rounded-xl shadow-lg space-y-6 mb-8 md:mb-0 hover:shadow-xl transition-shadow duration-300 ease-in-out">
          <h2 className="text-3xl font-extrabold text-blue-800 mb-4">
            Who We Are
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            We are a dynamic team of professionals, each with a shared vision to provide innovative solutions and services. Our collective knowledge drives our passion for helping our clients succeed.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            With a focus on collaboration, creativity, and continuous improvement, we work together to bring the best results to our clients. Our team is constantly evolving, ensuring that we stay ahead in providing exceptional services.
          </p>
        </div>

        {/* Second Box Content: What We Do */}
        <div className="p-8 bg-white border border-indigo-100 rounded-xl shadow-lg space-y-6 hover:shadow-xl transition-shadow duration-300 ease-in-out">
          <h2 className="text-3xl font-extrabold text-indigo-800 mb-4">
            What We Do
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Our services range from consulting to technology solutions. We focus on delivering measurable results and creating lasting impact by aligning our strategies with your business goals.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            We specialize in providing customized solutions tailored to the unique needs of our clients, whether they are startups or established enterprises. Our solutions are designed to be scalable, sustainable, and impactful for long-term success.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AdveSection;
