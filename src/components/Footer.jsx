import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 px-6 py-10">
      <div className="max-w-7xl mx-auto grid gap-10 sm:grid-cols-2 md:grid-cols-4 text-sm">
        {/* Branding */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">StayEase</h2>
          <p className="leading-relaxed lg:text-base">Your gateway to luxury, comfort, and relaxation.</p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2 lg:text-base">
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <li><Link to="/rooms" className="hover:underline">Rooms</Link></li>
            <li><Link to="/about" className="hover:underline">About Us</Link></li>
            <li><Link to="/contact" className="hover:underline">Contact</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Contact Us</h3>
          <p className="mb-1 lg:text-base">123 Serenity Lane</p>
          <p className="mb-1 lg:text-base">New York, NY 10001</p>
          <p className="mb-1 lg:text-base">Email: info@stayease.com</p>
          <p className="lg:text-base">Phone: +1 (800) 123-4567</p>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Follow Us</h3>
          <div className="flex space-x-4 lg:space-x-2 mt-2">
            <a href="https://facebook.com" aria-label="Facebook" className="hover:text-white lg:text-xl"><FaFacebookF /></a>
            <a href="https://instagram.com" aria-label="Instagram" className="hover:text-white lg:text-xl"><FaInstagram /></a>
            <a href="https://twitter.com" aria-label="Twitter" className="hover:text-white lg:text-xl"><FaTwitter /></a>
          </div>
        </div>
      </div>

      {/* Bottom Strip */}
      <div className="mt-10 border-t border-gray-700 pt-5 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} StayEase. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
