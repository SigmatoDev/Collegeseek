"use client"

import { Mail, Phone, MapPin } from 'lucide-react';
import ContactForm from './contactForm';

// 🧠 Load ContactForm only on client to prevent hydration mismatch

export default function ContactDetails() {
  return (
    <div className="max-w-8xl mx-auto px-4 md:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white">
        {/* Left side: Contact Info */}
        <div className="flex flex-col justify-center">
          <h3 className="text-4xl font-bold text-blue-700 mb-4">Let’s Talk</h3>
          <p className="text-gray-600 text-lg mb-10">
            We’d love to hear from you. Whether you have a question about colleges, courses, pricing, or anything else — our team is ready to answer all your questions.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Phone className="text-blue-600" size={24} />
              </div>
              <div>
                <h4 className="text-gray-800 font-semibold text-lg">Call Us</h4>
                <p className="text-gray-600">+1 (555) 123-4567</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Mail className="text-blue-600" size={24} />
              </div>
              <div>
                <h4 className="text-gray-800 font-semibold text-lg">Email</h4>
                <p className="text-gray-600">hello@collegeseek.in</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-xl">
                <MapPin className="text-blue-600" size={24} />
              </div>
              <div>
                <h4 className="text-gray-800 font-semibold text-lg">Visit Us</h4>
                <p className="text-gray-600">123 College Rd, Education City, USA</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side: Contact Form */}
        <div>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
