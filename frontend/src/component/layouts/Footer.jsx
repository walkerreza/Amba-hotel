import React from 'react';
import { HiPhone, HiMail, HiLocationMarker } from 'react-icons/hi';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#09453E] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Hotel Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4">AMBA Hotel</h3>
            <p className="text-sm mb-2 text-white/80">Tempat menginap nyaman dengan pelayanan terbaik untuk liburan dan bisnis Anda.</p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Kontak</h3>
            <div className="space-y-2 text-white/80">
              <div className="flex items-center">
                <HiLocationMarker className="w-5 h-5 mr-2" />
                <span className="text-sm">Jl. merdeka no. 123, blitar</span>
              </div>
              <div className="flex items-center">
                <HiPhone className="w-5 h-5 mr-2" />
                <span className="text-sm">+62 21 1234 5678</span>
              </div>
              <div className="flex items-center">
                <HiMail className="w-5 h-5 mr-2" />
                <span className="text-sm">info@ambahotel.com</span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Ikuti Kami</h3>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com" className="text-white/80 hover:text-white transition-colors">
                <FaFacebook className="w-6 h-6" />
              </a>
              <a href="https://www.instagram.com" className="text-white/80 hover:text-white transition-colors">
                <FaInstagram className="w-6 h-6" />
              </a>
              <a href="https://www.twitter.com" className="text-white/80 hover:text-white transition-colors">
                <FaTwitter className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-white/20">
          <p className="text-center text-sm text-white/70">
            © {new Date().getFullYear()} AMBA Hotel. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
