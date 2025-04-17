'use client';

import { api_url } from '@/utils/apiCall';
import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [status, setStatus] = useState<string>(''); // To manage form submission status

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('Submitting...'); // Update status during submission

    try {
      const response = await fetch(`${api_url}/contact`, { // Fixed string interpolation
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Send form data to the backend
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Form Submitted:', data);
        setStatus('Message sent successfully!'); // Success message
        // Optionally, reset form data after successful submission
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
        });
      } else {
        console.error('Error submitting form:', data.message);
        setStatus('Failed to send message. Please try again.'); // Error message
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('Error sending message. Please try again.'); // Network error message
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md p-8 rounded-xl space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Send us a message</h2>
      <div className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          required
          value={formData.name}
          onChange={handleChange}
          autoComplete="off"
          className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          required
          value={formData.email}
          onChange={handleChange}
          autoComplete="off"
          className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Your Phone Number"
          required
          value={formData.phone}
          onChange={handleChange}
          autoComplete="off"
          className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <textarea
          name="message"
          placeholder="Your Message"
          required
          rows={5}
          value={formData.message}
          onChange={handleChange}
          className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
        ></textarea>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          Submit
        </button>
        {status && (
          <div
            className={`mt-4 text-center p-3 rounded-xl ${status.includes('success') ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
          >
            {status}
          </div>
        )}
      </div>
    </form>
  );
}
