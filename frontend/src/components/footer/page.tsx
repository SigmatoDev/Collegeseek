import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-10 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Top Section */}
        <div className="grid grid-cols-4 gap-6">
          {/* More to Explore */}
          <div>
            <h3 className="font-bold mb-2">More To Explore</h3>
            <ul className="space-y-1 text-gray-400">
              <li>Common Application Form</li>
              <li>Job Ready Courses</li>
              <li>ETP Admissions</li>
              <li>Scholarships</li>
              <li>Boards</li>
              <li>Articles</li>
              <li>Visual Stories (English)</li>
              <li>Visual Stories (Hindi)</li>
              <li>CD Academy</li>
            </ul>
          </div>

          {/* Tools & Research */}
          <div>
            <h3 className="font-bold mb-2">Tools & Research</h3>
            <ul className="space-y-1 text-gray-400">
              <li>Career Compass</li>
              <li>Write a Review</li>
              <li>Qna Forum</li>
              <li>DU Predictor</li>
            </ul>
          </div>

          {/* Quick Links */}

          <div>
            <h3 className="font-bold mb-2">Quick Links</h3>
            <ul className="space-y-1 text-gray-400">
              <li>
                <Link
                  href="/aboutUs"
                  className="hover:text-white transition-colors duration-200"
                >
                  About Us
                </Link>
              </li>
              <li><Link
                  href="/contactUs"
                  className="hover:text-white transition-colors duration-200"
                >
                  Contact Us
                </Link></li>
              <li>
              <Link
                  href="/contactUs"
                  className="hover:text-white transition-colors duration-200"
                >
                  Join Us
                </Link></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="font-bold mb-2">Banglore</h3>
            <p className="text-gray-400">
              2nd Floor, Rajini Towers, 27th Cross Road, 7th B Main Rd, 4th
              Block, Jayanagar, Bengaluru, Karnataka 560011
            </p>
            <p className="text-gray-400 mt-2">📞 1800-545-7787</p>
            <p className="text-gray-400">✉️ hello@collegeseekers.com</p>

            {/* Social Media Icons */}
            <div className="flex space-x-3 pt-5">
              <a
                href="#"
                className="hover:text-blue-400 transition-colors duration-200"
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="#"
                className="hover:text-pink-400 transition-colors duration-200"
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="#"
                className="hover:text-blue-500 transition-colors duration-200"
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="#"
                className="hover:text-blue-400 transition-colors duration-200"
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
              <a
                href="#"
                className="hover:text-red-500 transition-colors duration-200"
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Middle Section
        <div className="border-t border-gray-700 my-6"></div>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <h3 className="font-bold mb-2">Trending Links</h3>
          </div>
          <div>
            <h3 className="font-bold mb-2">Most Viewed Links</h3>
          </div>
          <div>
            <h3 className="font-bold mb-2">Popular Universities</h3>
            <ul className="grid grid-cols-2 gap-1 text-gray-400">
              <li>CUSAT</li>
              <li>DTU</li>
              <li>DOON University</li>
              <li>FMS Delhi</li>
              <li>MMMUT</li>
              <li>NIT Jaipur</li>
              <li>NIT Jalandhar</li>
              <li>NIT Jamshedpur</li>
              <li>NIT Raipur</li>
              <li>NIT Silchar</li>
              <li>NIT Trichy</li>
              <li>PUCHD</li>
              <li>TNOU</li>
              <li>TNAU</li>
              <li>TECHNO India University</li>
              <li>TEZPUR University</li>
              <li>University of Hyderabad</li>
              <li>University of Mysore</li>
              <li>VIDYASAGAR University</li>
              <li>VMOU</li>
              <li>ANNA University</li>
              <li>JAYPEE University</li>
            </ul>
          </div>
        </div> */}

        {/* Bottom Section */}
        <div className="border-t border-gray-700 my-6"></div>
        <div className="flex justify-between items-center text-gray-400">
          <div className="flex space-x-4">
            <a href="#">Terms & Conditions</a>
            <a href="#">Privacy Policy</a>
          </div>
          <p>© Pvt Ltd</p>
        </div>

        {/* Scroll to Top Button */}
      </div>
    </footer>
  );
};

export default Footer;
