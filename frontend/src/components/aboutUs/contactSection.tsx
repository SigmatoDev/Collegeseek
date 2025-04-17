// components/ContactSection.tsx
const ContactSection = () => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-semibold">Contact Us</h2>
        <p className="mt-4 text-lg text-gray-700">Have questions? Reach out to us, and we’d love to help you.</p>
        <form className="mt-8 max-w-xl mx-auto">
          <input
            type="email"
            placeholder="Your Email"
            className="w-full p-3 rounded-lg border border-gray-300"
          />
          <textarea
            placeholder="Your Message"
            className="w-full p-3 mt-4 rounded-lg border border-gray-300"
            rows={4} // Change this to a number
          ></textarea>
          <button type="submit" className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg">
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactSection;
