import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../component/layouts/Footer';

const AboutUs = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <img src="/logo.png" alt="Amba Hotel Logo" className="h-12 w-auto" />
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => navigate('/hotel-preview')}
                className="text-gray-700 hover:text-[#09453D] px-3 py-2"
              >
                OUR HOTEL
              </button>
              <button 
                onClick={() => navigate('/about')}
                className="text-[#09453D] font-semibold px-3 py-2"
              >
                ABOUT US
              </button>
              <button 
                onClick={() => navigate('/rooms')}
                className="text-gray-700 hover:text-[#09453D] px-3 py-2"
              >
                ROOMS
              </button>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => navigate('/login')}
                  className="text-gray-700 hover:text-[#09453D] px-4 py-2"
                >
                  Login
                </button>
                <button 
                  onClick={() => navigate('/register')}
                  className="bg-[#09453D] text-white px-4 py-2 rounded hover:bg-[#09453D]/90"
                >
                  Register
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-[#09453D] focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <button 
                  onClick={() => navigate('/hotel-preview')}
                  className="text-gray-700 hover:text-[#09453D] block px-3 py-2"
                >
                  OUR HOTEL
                </button>
                <button 
                  onClick={() => navigate('/about')}
                  className="text-[#09453D] font-semibold block px-3 py-2"
                >
                  ABOUT US
                </button>
                <button 
                  onClick={() => navigate('/rooms')}
                  className="text-gray-700 hover:text-[#09453D] block px-3 py-2"
                >
                  ROOMS
                </button>
                <button 
                  onClick={() => navigate('/login')}
                  className="text-gray-700 hover:text-[#09453D] block px-3 py-2"
                >
                  Login
                </button>
                <button 
                  onClick={() => navigate('/register')}
                  className="text-gray-700 hover:text-[#09453D] block px-3 py-2"
                >
                  Register
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section dengan Logo */}
      <div className="relative pt-16">
        <div className="h-[400px] relative">
          <img 
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920"
            alt="Hotel Facade"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
            <img src="/logo.png" alt="Amba Hotel Logo" className="h-32 mb-6" />
            <h1 className="text-5xl font-bold text-white">ABOUT US</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Our Story dengan Logo */}
        <div className="mb-16 flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/3">
            <img src="/logo.png" alt="Amba Hotel Logo" className="w-full max-w-[300px] mx-auto" />
          </div>
          <div className="md:w-2/3">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
            <p className="text-gray-600 leading-relaxed">
              Amba Hotel - Luxury Rooms and Resort, didirikan pada tahun 2010 dengan visi untuk memberikan pengalaman 
              menginap yang tak terlupakan bagi setiap tamu. Berlokasi strategis di jantung kota Blitar, hotel kami 
              menggabungkan arsitektur modern dengan sentuhan budaya lokal yang khas. Nama "Amba" sendiri terinspirasi 
              dari kata "Ambara" yang berarti langit, melambangkan aspirasi kami untuk memberikan pelayanan setinggi langit.
            </p>
          </div>
        </div>

        {/* CEO Profile */}
        <div className="mb-16 bg-white rounded-lg overflow-hidden shadow-lg">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 relative">
              <img 
                src="/AMBA BOSS.jpg"
                alt="CEO PT Amba Hotel" 
                className="w-full h-[400px] object-cover object-top"
              />
              {/* Overlay gradient untuk memperindah transisi */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
            <div className="md:w-2/3 p-8 flex flex-col justify-center bg-[#09453E]/5">
              <div className="border-l-4 border-[#09453E] pl-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Bapak Amba Setiawan
                </h3>
                <p className="text-[#09453E] font-medium mb-4">
                  Founder & CEO PT Amba Hotel
                </p>
                <p className="text-gray-600 leading-relaxed italic mb-6">
                  "Amba Hotel dibangun dengan visi untuk memberikan pengalaman menginap 
                  yang tak terlupakan. Kami percaya bahwa setiap tamu berhak mendapatkan 
                  pelayanan terbaik dengan standar internasional tanpa melupakan 
                  kehangatan budaya lokal."
                </p>
                <p className="text-gray-600">
                  Dengan pengalaman lebih dari 20 tahun di industri perhotelan, 
                  Bapak Amba Setiawan memimpin Amba Hotel dengan fokus pada 
                  inovasi layanan dan kepuasan pelanggan. Di bawah kepemimpinannya, 
                  Amba Hotel telah berkembang menjadi salah satu hotel terkemuka 
                  di Kota Blitar.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <div className="text-4xl mb-4">🌟</div>
            <h3 className="text-xl font-semibold mb-2">Excellence</h3>
            <p className="text-gray-600">
              Kami berkomitmen untuk memberikan layanan terbaik dalam setiap aspek pengalaman tamu.
            </p>
          </div>
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-semibold mb-2">Hospitality</h3>
            <p className="text-gray-600">
              Keramahan dan kehangatan dalam melayani adalah prioritas utama kami.
            </p>
          </div>
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <div className="text-4xl mb-4">💫</div>
            <h3 className="text-xl font-semibold mb-2">Innovation</h3>
            <p className="text-gray-600">
              Terus berinovasi untuk memberikan pengalaman menginap yang modern dan nyaman.
            </p>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-[#09453E]/5 p-8 rounded-lg mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-[#09453E]">Strategic Location</h3>
              <p className="text-gray-600">
                Terletak di pusat kota dengan akses mudah ke berbagai destinasi wisata dan bisnis.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-[#09453E]">Modern Facilities</h3>
              <p className="text-gray-600">
                Dilengkapi dengan fasilitas modern untuk memenuhi kebutuhan tamu bisnis maupun liburan.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-[#09453E]">Professional Staff</h3>
              <p className="text-gray-600">
                Tim profesional yang siap melayani dengan standar hospitality internasional.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-[#09453E]">Comfort & Luxury</h3>
              <p className="text-gray-600">
                Desain modern yang elegan dengan sentuhan kemewahan untuk kenyamanan maksimal.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Contact Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-[#09453E]">Address</h3>
              <p className="text-gray-600">
                Jl. Merdeka No. 123<br />
                Kota Blitar<br />
                Jawa Timur, Indonesia
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-[#09453E]">Contact</h3>
              <p className="text-gray-600">
                Phone: +62 123 4567 890<br />
                Email: info@ambahotel.com
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-[#09453E]">Social Media</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-600 hover:text-[#09453E]">Instagram</a>
                <a href="#" className="text-gray-600 hover:text-[#09453E]">Facebook</a>
                <a href="#" className="text-gray-600 hover:text-[#09453E]">Twitter</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AboutUs;