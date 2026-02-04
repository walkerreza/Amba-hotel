import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../component/layouts/Footer';
import axios from 'axios';
import VirtualTour from '../component/fragment/VirtualTour';
import { FaHotel, FaConciergeBell, FaStar, FaSwimmingPool, FaWifi, FaParking, FaCoffee } from 'react-icons/fa';
import { motion } from 'framer-motion';

const HotelPreview = () => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAd, setShowAd] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);

  // Data gambar dari internet
  const images = {
    preview: [
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1920", // Infinity pool view
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1920", // Beach resort
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1920", // Luxury hotel
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920", // Sunset view
    ],
    kamar: [
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200", // Luxury room
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200", // Premium suite
      "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200", // Ocean view room
    ],
    fasilitas: [
      "https://images.unsplash.com/photo-1601000938365-f182c5a3c681?auto=format&fit=crop&w=1200", // Restaurant
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200", // Spa
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200", // Pool area
    ]
  };

  // Tambahkan fitur autoplay untuk carousel
  useEffect(() => {
    const timer = setInterval(() => {
      nextImage();
    }, 5000); // Ganti gambar setiap 5 detik

    return () => clearInterval(timer);
  }, [currentImageIndex]);

  // Modifikasi komponen carousel untuk transisi yang lebih halus
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextImage = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentImageIndex((prev) => 
        prev === images.preview.length - 1 ? 0 : prev + 1
      );
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  const prevImage = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentImageIndex((prev) => 
        prev === 0 ? images.preview.length - 1 : prev - 1
      );
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  const facilities = [
    { name: "WiFi Gratis", icon: <FaWifi className="text-[#09453D]" /> },
    { name: "Kolam Renang", icon: <FaSwimmingPool className="text-[#09453D]" /> },
    { name: "Parkir", icon: <FaParking className="text-[#09453D]" /> },
    { name: "Restoran", icon: <FaCoffee className="text-[#09453D]" /> },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Business Traveler",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150",
      comment: "Pelayanan yang luar biasa dan fasilitas yang lengkap. Sangat cocok untuk perjalanan bisnis.",
      rating: 5
    },
    {
      name: "David Chen",
      role: "Family Vacation",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150",
      comment: "Liburan keluarga yang menyenangkan. Anak-anak sangat menikmati kolam renang dan area bermainnya.",
      rating: 5
    },
    {
      name: "Maria Garcia",
      role: "Honeymoon",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150",
      comment: "Tempat yang sempurna untuk bulan madu. Pemandangan sunset dari kamar kami sungguh menakjubkan.",
      rating: 5
    }
  ];

  const specialOffers = [
    {
      title: "Honeymoon Package",
      description: "Paket romantis 3 hari 2 malam termasuk candle light dinner",
      price: "Rp 2.500.000",
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600",
      discount: "20%",
      originalPrice: "Rp 3.125.000"
    },
    {
      title: "Weekend Getaway",
      description: "Menginap di akhir pekan dengan sarapan gratis untuk 2 orang",
      price: "Rp 1.800.000",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600",
      discount: "15%",
      originalPrice: "Rp 2.117.647"
    },
    {
      title: "Business Package",
      description: "Termasuk ruang meeting dan airport transfer",
      price: "Rp 2.200.000",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600",
      discount: "25%",
      originalPrice: "Rp 2.933.333"
    }
  ];

  useEffect(() => {
    // Tampilkan iklan setelah 5 detik
    const timer = setTimeout(() => {
      setShowAd(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const AdPopup = ({ onClose }) => {
    const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
      // Fetch data kamar untuk iklan
      const fetchRooms = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/kamar');
          // Ambil 3 kamar random untuk ditampilkan
          const shuffled = response.data.sort(() => 0.5 - Math.random());
          setRooms(shuffled.slice(0, 3));
        } catch (error) {
          console.error('Error fetching rooms for ad:', error);
        }
      };

      fetchRooms();
    }, []);

    useEffect(() => {
      // Auto slide setiap 5 detik
      const timer = setInterval(() => {
        setCurrentRoomIndex((prev) => (prev + 1) % rooms.length);
      }, 5000);

      return () => clearInterval(timer);
    }, [rooms.length]);

    if (rooms.length === 0) return null;

    const currentRoom = rooms[currentRoomIndex];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl overflow-hidden relative">
          {/* Tombol Close (X) */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors z-20"
          >
            <span className="text-xl font-medium text-gray-600">×</span>
          </button>

          <div className="flex flex-col md:flex-row">
            {/* Gambar Kamar */}
            <div className="relative w-full md:w-1/2 h-64 md:h-auto">
              <img 
                src={currentRoom.gambar?.gambar_kamar || '/room-placeholder.jpg'}
                alt={currentRoom.tipe_kamar}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            {/* Konten */}
            <div className="w-full md:w-1/2 p-6 md:p-8">
              <div className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium inline-block mb-4">
                Promo Spesial!
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {currentRoom.tipe_kamar}
              </h2>

              <div className="text-3xl font-bold text-[#09453D] mb-4">
                Rp {currentRoom.harga_per_malam?.toLocaleString('id-ID')}
                <span className="text-sm font-normal text-gray-600">/malam</span>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-2">Fasilitas:</h4>
                <ul className="grid grid-cols-2 gap-2">
                  {currentRoom.features?.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <span className="mr-2">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <p className="text-yellow-800">
                    <span className="font-bold">Hemat 20%</span> untuk pemesanan minggu ini!
                  </p>
                </div>

                <button 
                  onClick={() => {
                    navigate(`/rooms/${currentRoom.id}`);
                    onClose();
                  }}
                  className="w-full bg-[#09453D] text-white py-3 rounded-lg text-lg font-medium hover:bg-[#09453D]/90"
                >
                  PESAN SEKARANG
                </button>
              </div>
            </div>
          </div>

          {/* Dots Navigation */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {rooms.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentRoomIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentRoomIndex ? 'bg-[#09453D]' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Fungsi untuk membuka WhatsApp
  const openWhatsApp = () => {
    const message = encodeURIComponent("halo admin hotel amba, saya reservasi kamar dihotel amba");
    const phoneNumber = "6285236977690";
    
    // Deteksi perangkat mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Untuk perangkat mobile, coba buka aplikasi WhatsApp
      window.location.href = `whatsapp://send?phone=${phoneNumber}&text=${message}`;
      
      // Jika gagal buka aplikasi setelah 2 detik, buka versi web
      setTimeout(() => {
        window.location.href = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}`;
      }, 2000);
    } else {
      // Untuk desktop, buka WhatsApp Web
      window.open(`https://web.whatsapp.com/send?phone=${phoneNumber}&text=${message}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <img className="h-12 w-auto" src="/logo.png" alt="Hotel Logo" />
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => navigate('/hotel-preview')}
                className="text-[#09453D] font-semibold px-3 py-2"
              >
                OUR HOTEL
              </button>
              <button 
                onClick={() => navigate('/about')}
                className="text-gray-700 hover:text-[#09453D] px-3 py-2"
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
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  className="text-[#09453D] font-semibold block px-3 py-2"
                >
                  OUR HOTEL
                </button>
                <button 
                  onClick={() => navigate('/about')}
                  className="text-gray-700 hover:text-[#09453D] block px-3 py-2"
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

      {/* Hero Section dengan Carousel */}
      <div className="relative h-screen pt-20">
        <div className="relative h-full overflow-hidden">
          <div 
            className={`relative h-full transition-transform duration-500 ease-in-out ${
              isTransitioning ? 'opacity-80' : 'opacity-100'
            }`}
          >
            <img 
              src={images.preview[currentImageIndex]}
              alt={`Preview ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
          
          {/* Navigation Arrows dengan style yang lebih menarik */}
          <button 
            onClick={prevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 text-white p-6 rounded-full hover:bg-white/40 transition-all duration-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 text-white p-6 rounded-full hover:bg-white/40 transition-all duration-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots Indicator dengan style yang lebih menarik */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
            {images.preview.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentImageIndex === index 
                    ? 'bg-white w-8' 
                    : 'bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Informasi Hotel dengan dekorasi */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header dengan dekorasi */}
        <div className="relative mb-8 text-center">
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
            <FaHotel className="text-[#09453D]/20 w-12 h-12" />
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-[#09453D] mb-2"
          >
            AMBA HOTEL
          </motion.h1>
          <div className="flex justify-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar key={star} className="text-yellow-400 w-5 h-5" />
            ))}
          </div>
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
            <FaConciergeBell className="text-[#09453D]/20 w-12 h-12" />
          </div>
        </div>

        {/* Deskripsi dengan border dekoratif */}
        <div className="relative max-w-3xl mx-auto mb-12">
          <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-[#09453D]"></div>
          <div className="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-[#09453D]"></div>
          <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-[#09453D]"></div>
          <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-[#09453D]"></div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-600 text-center leading-relaxed px-8 py-6"
          >
            Hotel AMBA adalah destinasi sempurna untuk para pelancong yang mencari pengalaman menginap yang tak terlupakan. 
            Dengan lokasi strategis dan fasilitas modern, kami menawarkan kenyamanan dan kemewahan dalam satu paket.
          </motion.p>
        </div>

        {/* Facilities dengan animasi */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
        >
          {facilities.map((facility, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md"
            >
              <div className="text-4xl mb-3">{facility.icon}</div>
              <span className="text-sm text-gray-600">{facility.name}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Virtual Tour */}
        <div className="mb-12">
          <VirtualTour />
        </div>

        {/* Rooms Section dengan dekorasi */}
        <div className="relative mb-8 text-center">
          <h2 className="text-2xl font-semibold text-[#09453D] relative inline-block">
            Kamar Tersedia
            <div className="absolute w-full h-1 bg-[#09453D]/20 bottom-0 left-0"></div>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {images.kamar.map((image, index) => (
            <div key={index} className="rounded-lg overflow-hidden shadow-lg">
              <img src={image} alt={`Room ${index + 1}`} className="w-full h-64 object-cover" />
            </div>
          ))}
        </div>

        {/* Special Offers Section */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">SPECIAL OFFERS</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {specialOffers.map((offer, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative">
                <img src={offer.image} alt={offer.title} className="w-full h-48 object-cover" />
                <div className="absolute top-0 right-0 bg-red-500 text-white px-3 py-1 m-2 rounded">
                  Save {offer.discount}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{offer.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{offer.description}</p>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[#09453E] font-bold block">{offer.price}</span>
                    <span className="text-gray-500 text-sm line-through">{offer.originalPrice}</span>
                  </div>
                  <button 
                    onClick={() => navigate(`/rooms`)}
                    className="bg-[#09453E] text-white px-4 py-2 rounded text-sm hover:bg-opacity-90"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Guest Reviews Section */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">GUEST REVIEWS</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full object-cover mr-3"
                />
                <div>
                  <h3 className="font-semibold">{testimonial.name}</h3>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <div className="mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
              <p className="text-gray-600 text-sm italic">"{testimonial.comment}"</p>
            </div>
          ))}
        </div>

        {/* Map Section */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">LOCATION</h2>
        <div className="h-[400px] bg-gray-200 rounded-lg mb-8">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3949.9444875460392!2d112.16203707488771!3d-8.098202701952423!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOMKwMDUnNTMuNSJTIDExMsKwMDknNTEuMiJF!5e0!3m2!1sen!2sid!4v1234567890!5m2!1sen!2sid"
            width="100%" 
            height="100%" 
            style={{border: 0}} 
            allowFullScreen="" 
            loading="lazy"
          ></iframe>
        </div>

        {/* Book Now Button */}
        <div className="text-center">
          <button 
            onClick={() => navigate('/rooms')}
            className="bg-[#09453E] text-white px-12 py-4 rounded-full text-lg font-semibold hover:bg-opacity-90 transition-all"
          >
            Select Room
          </button>
        </div>
      </div>

      {/* Menambahkan Footer */}
      <Footer />

      {showAd && <AdPopup onClose={() => setShowAd(false)} />}

      {/* WhatsApp Floating Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={() => setIsWhatsAppOpen(true)}
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center"
          title="Hubungi via WhatsApp"
        >
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1200px-WhatsApp.svg.png"
            alt="WhatsApp"
            className="w-8 h-8"
          />
        </button>
      </div>

      {/* WhatsApp Modal */}
      {isWhatsAppOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <img 
                  src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Man%20Office%20Worker.png" 
                  alt="Admin Profile"
                  className="w-12 h-12 rounded-full mr-3 object-cover bg-gray-100"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Admin Hotel Amba</h3>
                  <p className="text-sm text-gray-500">+62 852-3697-7690</p>
                </div>
              </div>
              <button
                onClick={() => setIsWhatsAppOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-600 mb-2">Pesan yang akan dikirim:</p>
              <div className="bg-gray-50 p-3 rounded-lg text-sm">
                halo admin, saya ingin reservasi dihotel amba
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsWhatsAppOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Batal
              </button>
              <button
                onClick={openWhatsApp}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg flex items-center"
              >
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1200px-WhatsApp.svg.png"
                  alt="WhatsApp"
                  className="w-5 h-5 mr-2"
                />
                Kirim Pesan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelPreview; 