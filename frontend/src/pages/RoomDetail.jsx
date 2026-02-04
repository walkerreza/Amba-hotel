import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Footer from '../component/layouts/Footer';
import { getKamarByType, getRoomFeatures } from '../services/kamar.service';
import axios from 'axios';

const RoomDetail = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const DEFAULT_ROOM_IMAGE = '/uploads/room-placeholder.jpg';

  useEffect(() => {
    const fetchRoomDetail = async () => {
      try {
        console.log('Fetching room detail for ID:', id);
        const response = await axios.get(`http://localhost:5000/api/kamar/${id}`);
        const roomData = response.data;
        
        if (roomData) {
          const features = await getRoomFeatures(roomData.tipe_kamar);
          setRoom({
            ...roomData,
            features,
            foto_kamar: roomData.foto_kamar || DEFAULT_ROOM_IMAGE,
            foto_preview: roomData.foto_preview || DEFAULT_ROOM_IMAGE,
            foto_fasilitas: roomData.foto_fasilitas || DEFAULT_ROOM_IMAGE,
            foto_lokasi: roomData.foto_lokasi || DEFAULT_ROOM_IMAGE,
          });
        } else {
          setError('Data kamar tidak ditemukan');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error loading room details:', err);
        setError(err.response?.data?.message || 'Gagal memuat detail kamar');
        setLoading(false);
      }
    };

    fetchRoomDetail();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  if (!room) {
    return <div className="min-h-screen flex items-center justify-center">Kamar tidak ditemukan</div>;
  }

  const getRoomDescription = (tipeKamar) => {
    switch (tipeKamar.toLowerCase()) {
      case 'vip':
        return 'Didesain untuk tamu istimewa seperti Anda, kamar Premier Deluxe seluas 32 m2 ini memiliki ruangan khusus untuk belajar dan beristirahat, dilengkapi dengan fasilitas yang tidak terkalahkan dengan standar internasional. Nikmati semua fasilitas kamar, fasilitas kamar tidur, dan fasilitas kamar mandi yang lengkap.';
      case 'premium':
        return 'Kamar Premium kami menawarkan pengalaman menginap yang mewah dengan fasilitas modern dan layanan premium. Nikmati pemandangan kota yang menakjubkan dari jendela kamar Anda.';
      case 'standart':
        return 'Kamar Standart kami menyediakan kenyamanan dan kemudahan dengan harga terjangkau. Dilengkapi dengan fasilitas dasar yang lengkap untuk memastikan kenyamanan Anda selama menginap.';
      default:
        return 'Informasi kamar tidak tersedia';
    }
  };

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
            
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-[#09453D] px-3 py-2">OUR HOTEL</Link>
              <Link to="/about" className="text-gray-700 hover:text-[#09453D] px-3 py-2">ABOUT US</Link>
              <Link to="/rooms" className="text-[#09453D] font-semibold px-3 py-2">ROOMS</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Room Detail Content */}
      <div className="pt-16">
        {/* Room Images */}
        <div className="relative h-[500px]">
          <img 
            src={room.foto_kamar}
            alt={room.tipe_kamar}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error('Error loading room image:', e);
              e.target.src = DEFAULT_ROOM_IMAGE;
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <h1 className="text-5xl font-bold text-white">{room.tipe_kamar.toUpperCase()}</h1>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {/* Room Info Tabs */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`${
                    activeTab === 'description'
                      ? 'border-[#09453D] text-[#09453D]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab('features')}
                  className={`${
                    activeTab === 'features'
                      ? 'border-[#09453D] text-[#09453D]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
                >
                  Features
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="mt-8">
              {activeTab === 'description' && (
                <div className="prose max-w-none">
                  <p className="text-gray-600 leading-relaxed">
                    {getRoomDescription(room.tipe_kamar)}
                  </p>
                  <div className="mt-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Room Details:</h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                      <li>Bed produksi kelas atas VIP</li>
                      <li>Smart TV dengan siaran kabel internasional</li>
                      <li>Kamar mandi dengan fasilitas lengkap</li>
                      <li>Jaringan WiFi dengan kecepatan tinggi</li>
                      <li>Shower</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'features' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {room.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <span className="text-[#09453D]">•</span>
                      <span className="text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Price and Booking */}
          <div className="bg-gray-50 p-6 rounded-lg mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <p className="text-gray-600">Mulai dari</p>
                <p className="text-3xl font-bold text-[#09453D]">
                  Rp {room.harga_per_malam?.toLocaleString('id-ID')}/malam
                </p>
              </div>
              <button 
                onClick={() => window.location.href = `/login`}
                className="mt-4 md:mt-0 bg-[#09453D] text-white px-8 py-3 rounded hover:bg-opacity-90 transition-colors"
              >
                BOOK NOW
              </button>
            </div>
          </div>

          {/* Additional Images */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {['foto_preview', 'foto_fasilitas', 'foto_lokasi'].map((imageType) => (
              <img 
                key={imageType}
                src={room[imageType]}
                alt={imageType.replace('foto_', '')}
                className="w-full h-64 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = DEFAULT_ROOM_IMAGE;
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RoomDetail;
