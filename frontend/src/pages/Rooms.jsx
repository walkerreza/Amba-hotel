import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Footer from '../component/layouts/Footer';
import { getKamarList, getRoomFeatures } from '../services/kamar.service';

const DEFAULT_ROOM_IMAGE = '/room-placeholder.jpg';

const Rooms = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        console.log('Fetching rooms data...');
        const response = await axios.get('http://localhost:5000/api/kamar', {
          timeout: 5000
        });
        
        console.log('Raw rooms data:', response.data);
        const roomsData = response.data;
        
        // Mengambil data kamar dan fiturnya
        const roomsWithFeatures = await Promise.all(roomsData.map(async (room) => {
          const features = getRoomFeatures(room.tipe_kamar);
          console.log(`Features for ${room.tipe_kamar}:`, features);

          // Mengambil gambar preview kamar jika ada gambar_id
          let roomImage = DEFAULT_ROOM_IMAGE;
          if (room.gambar) {
            try {
              roomImage = room.gambar.gambar_kamar || DEFAULT_ROOM_IMAGE;
            } catch (err) {
              console.error('Error processing room image:', err);
            }
          }

          return {
            ...room,
            features,
            foto_kamar: roomImage
          };
        }));

        // Group rooms by type dan ambil kamar pertama dari setiap tipe
        const uniqueRoomTypes = {};
        roomsWithFeatures.forEach(room => {
          if (!uniqueRoomTypes[room.tipe_kamar]) {
            uniqueRoomTypes[room.tipe_kamar] = {
              ...room,
              features: getRoomFeatures(room.tipe_kamar)
            };
          }
        });

        console.log('Processed rooms data:', Object.values(uniqueRoomTypes));
        setRooms(Object.values(uniqueRoomTypes));
        setLoading(false);
      } catch (err) {
        console.error('Error loading rooms:', err);
        let errorMessage = 'Gagal memuat data kamar';
        if (err.code === 'ERR_NETWORK') {
          errorMessage = 'Tidak dapat terhubung ke server. Mohon periksa koneksi Anda.';
        }
        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const formatRoomType = (type) => {
    switch (type.toLowerCase()) {
      case 'luxury':
        return 'LUXURY SUITE';
      case 'vip':
        return 'VIP ROOM';
      case 'premium':
        return 'PREMIUM ROOM';
      case 'standart':
        return 'STANDART ROOM';
      default:
        return type;
    }
  };

  const getRoomDescription = (type) => {
    switch (type.toLowerCase()) {
      case 'luxury':
        return 'Nikmati pengalaman menginap terbaik dengan fasilitas mewah dan pelayanan butler pribadi.';
      case 'vip':
        return 'Kamar eksklusif dengan pemandangan kota dan fasilitas premium untuk kenyamanan maksimal.';
      case 'premium':
        return 'Kamar nyaman dengan desain modern dan fasilitas lengkap untuk pengalaman menginap berkualitas.';
      case 'standart':
        return 'Kamar nyaman dengan fasilitas lengkap untuk istirahat yang menyenangkan.';
      default:
        return '';
    }
  };

  const RoomCard = ({ room }) => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-2/3">
          <img
            src={room.foto_kamar || DEFAULT_ROOM_IMAGE}
            alt={formatRoomType(room.tipe_kamar)}
            className="w-full h-[300px] object-cover"
            onError={(e) => {
              console.error('Error loading room image:', e);
              e.target.src = DEFAULT_ROOM_IMAGE;
            }}
          />
        </div>
        <div className="w-full md:w-1/3 p-6 flex flex-col justify-between">
          <div>
            <div className="mb-4">
              <h3 className="text-sm font-medium text-[#09453D] mb-1">ROOMS</h3>
              <h2 className="text-xl font-bold text-gray-900">{formatRoomType(room.tipe_kamar)}</h2>
              <p className="text-gray-600 mt-2">
                Mulai dari Rp {room.harga_per_malam?.toLocaleString('id-ID')}/malam
              </p>
              <p className="text-gray-600 mt-2 text-sm italic">
                {getRoomDescription(room.tipe_kamar)}
              </p>
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Fasilitas:</h4>
                <ul className="text-sm text-gray-600">
                  {room.features && room.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 mb-1">
                      <span>•</span> {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <button 
            onClick={() => navigate(`/rooms/${room.id}`)}
            className="bg-[#09453D] text-white px-6 py-2 rounded-sm text-sm hover:bg-[#09453D]/90 transition-colors w-32"
          >
            LIHAT DETAIL
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0">
                <img className="h-12 w-auto" src="/logo.png" alt="Hotel Logo" />
              </Link>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-[#09453D] px-3 py-2">OUR HOTEL</Link>
              <Link to="/about" className="text-gray-700 hover:text-[#09453D] px-3 py-2">ABOUT US</Link>
              <Link to="/rooms" className="text-[#09453D] font-semibold px-3 py-2">ROOMS</Link>
              <div className="flex items-center space-x-2">
                <Link to="/login" className="text-gray-700 hover:text-[#09453D] px-4 py-2">Login</Link>
                <Link to="/register" className="bg-[#09453D] text-white px-4 py-2 rounded hover:bg-[#09453D]/90">
                  Register
                </Link>
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
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/" className="block text-gray-700 hover:text-[#09453D] px-3 py-2">OUR HOTEL</Link>
              <Link to="/about" className="block text-gray-700 hover:text-[#09453D] px-3 py-2">ABOUT US</Link>
              <Link to="/rooms" className="block text-[#09453D] font-semibold px-3 py-2">ROOMS</Link>
              <Link to="/login" className="block text-gray-700 hover:text-[#09453D] px-3 py-2">Login</Link>
              <Link to="/register" className="block text-gray-700 hover:text-[#09453D] px-3 py-2">Register</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Header Image */}
      <div className="relative h-[500px] w-full mt-16">
        <img 
          src="https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1920"
          alt="Header Room"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-4">ROOMS</h1>
            <p className="text-white text-lg max-w-2xl mx-auto px-4">
              Rasakan kenyamanan menginap di hotel kami yang mengutamakan pelayanan terbaik dengan penampilan
              modern yang elegan. Setiap kamar dirancang dengan cermat untuk memenuhi keinginan pelanggan
              sehingga yang tak terlupakan di tengah hiruk pikuk kota blitar.
            </p>
          </div>
        </div>
      </div>

      {/* Room Cards */}
      <div className="container mx-auto px-4 py-16">
        <div className="space-y-8">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Rooms;
