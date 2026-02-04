// Import library dan komponen yang diperlukan
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HiHome, HiClipboardCheck, HiCurrencyDollar, HiUsers } from 'react-icons/hi';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Sidebar from '../component/layouts/Sidebar';
import Header from '../component/layouts/Header';
import KamarManagement from './KamarManagement';
import ReservasiManagement from './ReservasiManagement';
import PembayaranManagement from './PembayaranManagement';
import GaleriManagement from './GaleriManagement';
import LogAktivitasManagement from './LogAktivitasManagement';
import Footer from '../component/layouts/Footer';

// Komponen utama AdminDashboard
// Route: /admin
const AdminDashboard = () => {
  // State untuk mengontrol sidebar, menu aktif, dan pencarian
  const [isOpen, setIsOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  
  // State untuk menyimpan statistik dashboard
  const [stats, setStats] = useState({
    rooms: { total: 0, available: 0 },
    reservations: { total: 0, active: 0 },
    payments: { total: 0, pending: 0 },
    users: { total: 0 }
  });

  // State untuk menyimpan data reservasi
  const [reservationData, setReservationData] = useState({
    todayReservations: [],
    reservationDates: {},
    allReservations: []
  });

  // State untuk menyimpan data user dan kamar
  const [userData, setUserData] = useState({});
  const [kamarData, setKamarData] = useState({});

  // Effect untuk mengambil data dashboard dan mengatur menu dari URL
  useEffect(() => {
    fetchDashboardData();
    fetchReservationData();
    fetchUserData();
    fetchKamarData();
    // Mengambil parameter menu dan pencarian dari URL
    const params = new URLSearchParams(location.search);
    const menuParam = params.get('menu');
    const searchParam = params.get('search');
    if (menuParam) setActiveMenu(menuParam);
    if (searchParam) setSearchQuery(searchParam);
  }, [location]);

  // Fungsi untuk menangani pencarian
  const handleSearch = (query) => {
    setSearchQuery(query);
    // Memperbarui URL dengan query pencarian
    const params = new URLSearchParams(location.search);
    query ? params.set('search', query) : params.delete('search');
    navigate({ search: params.toString() });

    // Melakukan pencarian jika berada di halaman yang mendukung
    if (['kamar', 'reservasi', 'pembayaran'].includes(activeMenu)) {
      console.log(`Mencari di ${activeMenu} dengan query: ${query}`);
    }
  };

  // Fungsi untuk mendapatkan token autentikasi
  const getAuthToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      throw new Error('Token autentikasi tidak ditemukan');
    }
    return token;
  };

  // Fungsi untuk mengambil data dashboard dari server
  const fetchDashboardData = async () => {
    try {
      const token = getAuthToken();
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Mengambil data secara paralel
      const [roomsRes, reservationsRes, paymentsRes, usersRes] = await Promise.all([
        fetch('http://localhost:5000/api/kamar', { headers }),
        fetch('http://localhost:5000/api/reservasi', { headers }),
        fetch('http://localhost:5000/api/pembayaran', { headers }),
        fetch('http://localhost:5000/api/user', { headers })
      ]);

      if (!roomsRes.ok || !reservationsRes.ok || !paymentsRes.ok || !usersRes.ok) {
        throw new Error('Gagal mengambil data dashboard');
      }

      const [rooms, reservations, payments, users] = await Promise.all([
        roomsRes.json(),
        reservationsRes.json(),
        paymentsRes.json(),
        usersRes.json()
      ]);

      // Filter reservasi aktif
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const activeReservations = reservations.filter(res => {
        const checkoutDate = new Date(res.tanggal_checkout);
        return checkoutDate >= today && res.status_reservasi === 'dipesan';
      });

      // Update status kamar berdasarkan reservasi aktif
      const updatedRooms = rooms.map(room => {
        const isBooked = activeReservations.some(res => 
          res.kamar_id === room.id && res.status_reservasi === 'dipesan'
        );
        return {
          ...room,
          status_kamar: isBooked ? 'dipesan' : 'tersedia'
        };
      });

      // Memperbarui state statistik
      setStats({
        rooms: {
          total: rooms.length,
          available: updatedRooms.filter(room => room.status_kamar === 'tersedia').length
        },
        reservations: {
          total: reservations.length,
          active: activeReservations.length
        },
        payments: {
          total: payments.length,
          pending: payments.filter(pay => pay.status_pembayaran === 'pending').length
        },
        users: {
          total: users.length
        }
      });

      // Update kamar data
      setKamarData(updatedRooms);
    } catch (error) {
      console.error('Error saat mengambil data dashboard:', error);
      if (error.message === 'Token autentikasi tidak ditemukan') {
        window.location.href = '/login';
      }
    }
  };

  // Fungsi untuk mengambil data reservasi
  const fetchReservationData = async () => {
    try {
      const token = getAuthToken();
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Mengambil data reservasi
      const response = await fetch('http://localhost:5000/api/reservasi', { headers });
      if (!response.ok) throw new Error('Gagal mengambil data reservasi');
      const reservations = await response.json();

      // Filter reservasi untuk hari ini dan mendatang
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const activeReservations = reservations.filter(res => {
        const checkoutDate = new Date(res.tanggal_checkout);
        return checkoutDate >= today && res.status_reservasi === 'dipesan';
      });

      // Filter reservasi untuk hari ini
      const todayReservations = activeReservations.filter(res => {
        const checkinDate = new Date(res.tanggal_checkin);
        return (
          checkinDate.getDate() === today.getDate() &&
          checkinDate.getMonth() === today.getMonth() &&
          checkinDate.getFullYear() === today.getFullYear()
        );
      });

      // Buat map tanggal untuk kalender
      const reservationDates = {};
      activeReservations.forEach(res => {
        // Pastikan tanggal dalam format yang benar
        const checkin = new Date(res.tanggal_checkin);
        checkin.setHours(0, 0, 0, 0);
        
        const checkout = new Date(res.tanggal_checkout);
        checkout.setHours(0, 0, 0, 0);
        
        // Loop dari checkin sampai checkout (inclusive)
        const currentDate = new Date(checkin);
        while (currentDate <= checkout) {
          const dateStr = currentDate.toISOString().split('T')[0];
          if (!reservationDates[dateStr]) {
            reservationDates[dateStr] = [];
          }
          reservationDates[dateStr].push(res);
          currentDate.setDate(currentDate.getDate() + 1);
        }
      });

      setReservationData({
        todayReservations: todayReservations.sort((a, b) => 
          new Date(a.tanggal_checkin) - new Date(b.tanggal_checkin)
        ),
        reservationDates,
        allReservations: activeReservations
      });

    } catch (error) {
      console.error('Error saat mengambil data reservasi:', error);
    }
  };

  // Fungsi untuk mengambil data user
  const fetchUserData = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch('http://localhost:5000/api/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Gagal mengambil data user');
      
      const users = await response.json();
      const userMap = {};
      users.forEach(user => {
        userMap[user.id] = user;
      });
      
      setUserData(userMap);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Fungsi untuk mengambil data kamar
  const fetchKamarData = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch('http://localhost:5000/api/kamar', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Gagal mengambil data kamar');
      
      const kamars = await response.json();
      const kamarMap = {};
      kamars.forEach(kamar => {
        kamarMap[kamar.id] = kamar;
      });
      
      setKamarData(kamarMap);
    } catch (error) {
      console.error('Error fetching kamar data:', error);
    }
  };

  // Komponen untuk menampilkan kartu statistik dengan kalender
  const StatCard = ({ icon: Icon, title, value, subValue, gradient, showCalendar = false }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showCalendarView, setShowCalendarView] = useState(false);

    // Custom styling untuk tanggal dengan reservasi
    const tileClassName = ({ date }) => {
      // Contoh: tandai hari Minggu dengan warna berbeda
      return date.getDay() === 0 ? 'text-red-500' : '';
    };

    // Custom content untuk tanggal tertentu
    const tileContent = ({ date }) => {
      // Contoh: tambahkan dot untuk tanggal yang ada reservasi
      const hasReservation = date.getDate() % 3 === 0; // Ini hanya contoh, sesuaikan dengan data real
      return hasReservation ? <div className="w-1 h-1 bg-[#09453D] rounded-full mx-auto mt-1"></div> : null;
    };

    return (
      <div className="relative">
        <div className={`p-6 rounded-xl ${gradient} shadow-lg`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium mb-1">{title}</p>
              <h3 className="text-white text-2xl font-bold mb-2">{value}</h3>
              {subValue && (
                <p className="text-white/70 text-sm">{subValue}</p>
              )}
              {showCalendar && (
                <button 
                  onClick={() => setShowCalendarView(!showCalendarView)}
                  className="mt-2 text-white/80 text-sm hover:text-white transition-colors"
                >
                  {showCalendarView ? 'Sembunyikan Kalender' : 'Lihat Kalender'}
                </button>
              )}
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <Icon className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
        
        {/* Kalender Popup */}
        {showCalendar && showCalendarView && (
          <div className="absolute top-full left-0 z-50 mt-2 w-full max-w-md bg-white rounded-lg shadow-xl p-4">
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              className="border-none shadow-none"
              tileClassName={tileClassName}
              tileContent={tileContent}
            />
            <div className="mt-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#09453D] rounded-full"></div>
                <span>Ada Reservasi</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Fungsi untuk merender dashboard
  const renderDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          icon={HiHome}
          title="Kamar"
          value={stats.rooms.total}
          subValue={`${stats.rooms.available} kamar tersedia`}
          gradient="bg-gradient-to-r from-[#09453E] to-[#0D5E54]"
        />
        <StatCard
          icon={HiClipboardCheck}
          title="Reservasi"
          value={stats.reservations.total}
          subValue={`${stats.reservations.active} reservasi aktif`}
          gradient="bg-gradient-to-r from-[#127369] to-[#158A7E]"
        />
        <StatCard
          icon={HiCurrencyDollar}
          title="Pembayaran"
          value={stats.payments.total}
          subValue={`${stats.payments.pending} pembayaran pending`}
          gradient="bg-gradient-to-r from-[#158A7E] to-[#1DA598]"
        />
        <StatCard
          icon={HiUsers}
          title="Pengguna"
          value={stats.users.total}
          gradient="bg-gradient-to-r from-[#1DA598] to-[#25C4B4]"
        />
      </div>

      {/* Kalender Reservasi Box */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Kalender Reservasi</h3>
          <div className="flex gap-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Tersedia</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Terpesan</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>Check-in Hari Ini</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Kalender */}
          <div className="bg-gray-50 rounded-lg p-4">
            <Calendar
              className="border-none shadow-none w-full"
              tileClassName={({ date }) => {
                const dateStr = date.toISOString().split('T')[0];
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const isToday = date.getTime() === today.getTime();
                const hasReservation = reservationData.reservationDates[dateStr]?.length > 0;

                if (isToday && hasReservation) return 'bg-yellow-200 text-yellow-800 rounded-lg'; // Hari ini dengan reservasi
                if (isToday) return 'bg-green-200 text-green-800 rounded-lg'; // Hari ini tanpa reservasi
                if (hasReservation) return 'bg-red-200 text-red-800 rounded-lg'; // Hari dengan reservasi
                return 'bg-green-100 text-green-800 rounded-lg'; // Hari tanpa reservasi
              }}
            />
          </div>

          {/* Daftar Reservasi Hari Ini */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-700">Reservasi Hari Ini</h4>
            <div className="space-y-3">
              {reservationData.todayReservations.length === 0 ? (
                <p className="text-gray-500 text-sm">Tidak ada reservasi hari ini</p>
              ) : (
                reservationData.todayReservations.map((reservation, index) => {
                  const user = userData[reservation.user_id] || {};
                  const kamar = kamarData[reservation.kamar_id] || {};
                  return (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium">
                            Kamar {kamar.nomor_kamar || reservation.kamar_id} 
                            - {kamar.tipe_kamar}
                          </h5>
                          <p className="text-sm text-gray-600">
                            Check-in: {new Date(reservation.tanggal_checkin).toLocaleTimeString('id-ID', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                          Check-in
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        <p>Tamu: {user.username || 'Loading...'}</p>
                        <p>Email: {user.email || '-'}</p>
                        <p>Durasi: {Math.ceil(
                          (new Date(reservation.tanggal_checkout) - new Date(reservation.tanggal_checkin)) 
                          / (1000 * 60 * 60 * 24)
                        )} malam</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Semua Reservasi Aktif */}
      <div className="space-y-4 mt-8">
        <h4 className="font-medium text-gray-700">Semua Reservasi Aktif</h4>
        <div className="space-y-3">
          {reservationData.allReservations?.length === 0 ? (
            <p className="text-gray-500 text-sm">Tidak ada reservasi aktif</p>
          ) : (
            reservationData.allReservations?.map((reservation, index) => {
              const user = userData[reservation.user_id] || {};
              const kamar = kamarData[reservation.kamar_id] || {};
              const checkinDate = new Date(reservation.tanggal_checkin);
              const isToday = checkinDate.toDateString() === new Date().toDateString();

              return (
                <div key={index} className="bg-white shadow-sm rounded-lg p-4 border border-gray-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-medium">
                        Kamar {kamar.nomor_kamar} - {kamar.tipe_kamar}
                      </h5>
                      <p className="text-sm text-gray-600">
                        Check-in: {new Date(reservation.tanggal_checkin).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    {isToday && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                        Hari Ini
                      </span>
                    )}
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <p>Tamu: {user.username}</p>
                    <p>Email: {user.email}</p>
                    <p>Durasi: {Math.ceil(
                      (new Date(reservation.tanggal_checkout) - new Date(reservation.tanggal_checkin)) 
                      / (1000 * 60 * 60 * 24)
                    )} malam</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );

  // Fungsi untuk merender konten berdasarkan menu aktif
  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return renderDashboard();
      case 'kamar':
        return <KamarManagement searchQuery={searchQuery} />;
      case 'reservasi':
        return <ReservasiManagement searchQuery={searchQuery} />;
      case 'pembayaran':
        return <PembayaranManagement searchQuery={searchQuery} />;
      case 'galeri':
        return <GaleriManagement />;
      case 'log':
        return <LogAktivitasManagement />;
      default:
        return renderDashboard();
    }
  };

  // Fungsi untuk mengubah status sidebar
  const toggleSidebar = () => setIsOpen(!isOpen);

  // Render komponen utama
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 flex flex-col">
      <Header 
        onSearch={handleSearch}
        searchQuery={searchQuery}
      />
      <Sidebar 
        isOpen={isOpen} 
        toggleSidebar={toggleSidebar}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        searchQuery={searchQuery}
        setSearchQuery={handleSearch}
      />
      <main className={`transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-20'} pt-24 flex-grow`}>
        <div className="p-8">
          {renderContent()}
        </div>
      </main>
      
      <div className={`transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-20'}`}>
        <Footer />
      </div>
    </div>
  );
};

export default AdminDashboard;
