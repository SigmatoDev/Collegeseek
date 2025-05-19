import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-black text-white px-6 py-16">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Grid Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo & Description */}
          <div>
            <img src="/logo/logo.jpg" alt="CollegeSeek Logo" className="h-10 w-auto mb-4" />
            <p className="text-gray-400 text-sm leading-relaxed">
              CollegeSeek is your trusted platform for discovering top colleges and universities around the world.
            </p>
          </div>

          {/* Explore Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">More to Explore</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/latestUpdate" className="hover:text-white transition">Latest Update</Link></li>
              <li><Link href="/courses" className="hover:text-white transition">Courses</Link></li>
              <li><Link href="/college" className="hover:text-white transition">Colleges</Link></li>
            </ul>
          </div>

          {/* Quick Links Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/aboutUs" className="hover:text-white transition">About Us</Link></li>
              <li><Link href="/contactUs" className="hover:text-white transition">Contact Us</Link></li>
              <li><Link href="/contactUs" className="hover:text-white transition">Join Us</Link></li>
            </ul>
          </div>

          {/* Contact Info & Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <address className="not-italic text-sm text-gray-400 leading-relaxed">
              ABC Education Pvt. Ltd.<br />
              123 Knowledge Park, Sector 42<br />
              New Delhi - 110001, India
            </address>
            <p className="mt-3 text-sm text-gray-400">📞 1800-545-7787</p>
            <p className="text-sm text-gray-400">✉️ hello@collegeseek.in</p>

            {/* Social Icons */}
            <div className="flex space-x-4 mt-4">
              {[
                { href: "#", src: "/svg/facebook-svgrepo-com (5).svg", alt: "Facebook" },
                { href: "#", src: "/svg/instagram-svgrepo-com (1).svg", alt: "Instagram" },
                { href: "#", src: "/svg/linkedin-svgrepo-com.svg", alt: "LinkedIn" },
                { href: "#", src: "/svg/twitter-154-svgrepo-com.svg", alt: "Twitter" },
                { href: "#", src: "/svg/youtube-168-svgrepo-com.svg", alt: "YouTube" },
              ].map((icon, index) => (
                <a key={index} href={icon.href} aria-label={icon.alt} className="hover:opacity-75 transition">
                  <img src={icon.src} alt={icon.alt} className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800"></div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
          <div className="flex space-x-6 mb-4 sm:mb-0">
            <Link href="/terms&Conditions" className="hover:text-white transition">Terms & Conditions</Link>
            <Link href="/privacyPolicy" className="hover:text-white transition">Privacy Policy</Link>
          </div>
          <p>© {new Date().getFullYear()} Collegeseeker Pvt. Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
