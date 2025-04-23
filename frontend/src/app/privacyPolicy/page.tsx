// app/privacy-policy/page.tsx
import Footer from '@/components/footer/page';
import Header from '@/components/header/page';
import CallbackForm from '@/components/newsletters/page';
import React from 'react';

const PrivacyPolicy = () => {
  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-6 py-16 text-gray-800 leading-relaxed">
        <h1 className="text-5xl font-bold text-center mb-12">Privacy Policy</h1>

        <section className="space-y-10">
          <div>
            <h2 className="text-3xl font-semibold mb-2">1. Introduction</h2>
            <p>
              This Privacy Policy outlines how we collect, use, and protect your personal information when you visit our website or use our services.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-semibold mb-2">2. Information We Collect</h2>
            <p>
              We may collect information such as your name, email address, IP address, and usage data through forms and cookies to improve your experience.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-semibold mb-2">3. How We Use Your Information</h2>
            <p>
              Your information helps us personalize your experience, send updates, improve our website, and ensure security.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-semibold mb-2">4. Data Protection</h2>
            <p>
              We implement a variety of security measures to maintain the safety of your personal information and prevent unauthorized access.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-semibold mb-2">5. Sharing Your Data</h2>
            <p>
              We do not sell, trade, or otherwise transfer your information to outside parties, except as required by law or trusted partners assisting in operations.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-semibold mb-2">6. Cookies</h2>
            <p>
              Our site may use cookies to enhance user experience and track visits. You can control cookie settings through your browser preferences.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-semibold mb-2">7. Your Rights</h2>
            <p>
              You have the right to access, update, or delete your personal data. Contact us if you wish to exercise any of these rights.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-semibold mb-2">8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy periodically. The revised policy will be posted on this page with a new effective date.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-semibold mb-2">9. Contact Us</h2>
            <p>
              For any questions regarding this Privacy Policy, please email us at{' '}
              <a href="mailto:support@example.com" className="text-blue-600 underline">support@example.com</a>.
            </p>
          </div>
        </section>
      </main>

      <CallbackForm />
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
