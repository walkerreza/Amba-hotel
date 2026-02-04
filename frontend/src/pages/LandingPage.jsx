import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const LandingPage = () => {
  const navigate = useNavigate();
  // const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const videoSource = "/Places - Hotel Shoot - Commercial Video.mp4";
  const hotelTypes = [
    {
      id: 1,
      title: "What type of stay are you looking for?",
      description: "Choose your perfect accommodation style from our diverse collection of properties, ranging from luxury resorts to boutique hotels.",
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1920",
    },
    {
      id: 2, 
      title: "Finding the right Location",
      description: "Discover hotels in prime locations, whether you're seeking a beachfront paradise, city center convenience, or mountain retreat.",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1920",
    },
    {
      id: 3,
      title: "Understand Your Travel Style",
      description: "From romantic getaways to family vacations, we'll help you find accommodations that match your travel preferences.",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920",
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative h-screen">
        {/* Logo */}
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20">
          <img src="/logo.png" alt="Logo" className="h-48 w-auto drop-shadow-lg" />
        </div>

        <div className="absolute inset-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={videoSource} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] shadow-2xl"></div>
        </div>
        
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <div className="mt-48 space-y-6">
            <h2 className="text-3xl font-medium text-white drop-shadow-lg">
              Selamat Datang di
            </h2>
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">
            AMBA HOTEL
            </h1>
            <p className="text-lg text-white max-w-2xl mx-auto drop-shadow-lg">
              Jelajahi berbagai destinasi menakjubkan dan temukan pengalaman menginap yang tak terlupakan di AMBA HOTEL
            </p>
            <button 
              onClick={() => navigate('/hotel-preview')}
              className="mt-4 px-8 py-3 bg-white text-[#09453E] rounded-full font-medium hover:bg-opacity-90 transition-all shadow-lg"
            >
              Let's Tour
            </button>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      {hotelTypes.map((section, index) => (
        <div key={section.id} className="relative min-h-screen">
          <div className="absolute inset-0">
            <img
              src={section.image}
              alt={section.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"></div>
          </div>
          
          <div className="relative min-h-screen flex items-center">
            <div className="max-w-7xl mx-auto px-4 py-24">
              <div className={`max-w-2xl ${index % 2 === 0 ? '' : 'ml-auto'}`}>
                <div className="text-9xl font-bold text-white opacity-20 mb-4">0{section.id}</div>
                <h2 className="text-4xl font-bold mb-6 text-white">
                  {section.title}
                </h2>
                <p className="text-xl text-white leading-relaxed">
                  {section.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Footer CTA Section */}
      <div className="relative min-h-screen">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1920"
            alt="Footer Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"></div>
        </div>
        
        <div className="relative min-h-screen flex items-center">
          <div className="max-w-7xl mx-auto px-4 py-24 text-center">
            <h2 className="text-5xl font-bold mb-6 text-white">
              Ready to Experience Luxury?
            </h2>
            <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
              Join us today and discover the perfect stay for your next adventure. Our collection of premium hotels awaits you.
            </p>
            <button 
              onClick={() => navigate('/login')}
              className="bg-white text-[#09453E] px-8 py-3 rounded-full hover:bg-opacity-90 transition-all text-lg font-semibold shadow-lg"
            >
              Begin Your Experience
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
