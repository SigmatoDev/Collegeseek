// app/terms-and-conditions/page.tsx
import Footer from '@/components/footer/page';
import Header from '@/components/header/page';
import CallbackForm from '@/components/newsletters/page';
import React from 'react';

const TermsAndConditions = () => {
  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-6 py-16 text-gray-800 leading-relaxed">
        <h1 className="text-5xl font-bold text-center mb-12">Terms & Conditions</h1>

        <section className="space-y-10">
          <div>
            <h2 className="text-3xl font-semibold mb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing this website, you confirm that you have read, understood, and agreed to be bound by these terms. If you do not agree, you must not use our services.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-semibold mb-2">2. Modification of Terms</h2>
            <p>
              We may update these terms at any time. Continued use of the website after such changes constitutes your acceptance of the new terms.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-semibold mb-2">3. User Conduct</h2>
            <p>
              You agree to use this site only for lawful purposes and in a way that does not infringe upon the rights or restrict the use of this site by any third party.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-semibold mb-2">4. Intellectual Property</h2>
            <p>
              All content—including logos, text, graphics, and software—is the intellectual property of the company. Unauthorized use may violate copyright laws.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-semibold mb-2">5. Limitations of Liability</h2>
            <p>
              We are not liable for any indirect, incidental, or consequential damages arising from your use of the site or services.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-semibold mb-2">6. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your access to the site at our discretion, without notice, for any reason including breach of these terms.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-semibold mb-2">7. Governing Law</h2>
            <p>
              These terms shall be governed by and construed in accordance with the laws of your country of residence, without regard to its conflict of law provisions.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-semibold mb-2">8. Contact Us</h2>
            <p>
              If you have any questions regarding these terms, please reach out to us at{' '}
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

export default TermsAndConditions;
