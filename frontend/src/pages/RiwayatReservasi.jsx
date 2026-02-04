// Import library yang dibutuhkan
// React untuk membuat komponen dan mengelola state
// Axios untuk request HTTP
// useNavigate untuk navigasi halaman
// HiCreditCard dll untuk ikon pembayaran
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../component/layouts/Header';
import Sidebar from '../component/layouts/Sidebar';
import Footer from '../component/layouts/Footer';
import { HiCreditCard, HiCash, HiArrowCircleUp } from 'react-icons/hi';
import PaymentForm from '../component/fragment/auth/PaymentForm';

// Route: /riwayat-reservasi
// Komponen untuk menampilkan riwayat reservasi user
const RiwayatReservasi = () => {
  const navigate = useNavigate();
  // State untuk menyimpan data
  const [reservasiList, setReservasiList] = useState([]); // Daftar reservasi
  const [loading, setLoading] = useState(true); // Status loading
  const [error, setError] = useState(null); // Pesan error jika ada
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? JSON.parse(saved) : true;
  }); // Status sidebar terbuka/tertutup
  const [activeMenu, setActiveMenu] = useState(() => {
    return localStorage.getItem('activeMenu') || 'riwayat-reservasi';
  }); // Menu aktif di sidebar
  const [showPaymentForm, setShowPaymentForm] = useState(false); // Tampilkan form pembayaran
  const [selectedReservation, setSelectedReservation] = useState(null); // Reservasi yang dipilih
  const [paymentMethod, setPaymentMethod] = useState('transfer'); // Metode pembayaran
  const [isProcessing, setIsProcessing] = useState(false); // Status proses pembayaran
  const [cardNumber, setCardNumber] = useState(''); // Nomor kartu kredit
  const [cardExpiry, setCardExpiry] = useState(''); // Tanggal kadaluarsa kartu
  const [cardCVV, setCardCVV] = useState(''); // CVV kartu
  const [showNotification, setShowNotification] = useState(false); // Tampilkan notifikasi
  const [notificationMessage, setNotificationMessage] = useState(''); // Pesan notifikasi
  const [paidReservations, setPaidReservations] = useState(new Set()); // Tambahan state untuk melacak pembayaran

  // Mengambil data reservasi saat komponen dimuat
  useEffect(() => {
    fetchReservasiList();
  }, []);

  // Fungsi untuk mengambil data reservasi dari API
  // Route: GET /api/reservasi/user/:id
  const fetchReservasiList = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = JSON.parse(localStorage.getItem('user')).id;
      const response = await axios.get(`http://localhost:5000/api/reservasi/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Ambil data pembayaran untuk setiap reservasi
      const reservasiWithPayments = await Promise.all(
        response.data.map(async (reservasi) => {
          try {
            const paymentResponse = await axios.get(
              `http://localhost:5000/api/pembayaran/user/${userId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            );
            
            const payment = paymentResponse.data.find(
              p => p.reservasi_id === reservasi.id && p.status_pembayaran === 'sukses'
            );
            
            return {
              ...reservasi,
              pembayaran: payment || null
            };
          } catch (err) {
            console.error('Error fetching payment:', err);
            return reservasi;
          }
        })
      );

      setReservasiList(reservasiWithPayments);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching reservasi list:', err);
      setError('Failed to fetch reservation history');
      setLoading(false);
    }
  };

  // Fungsi untuk menghitung total harga reservasi
  const calculateTotalPrice = (checkin, checkout, hargaPerMalam) => {
    if (!checkin || !checkout || !hargaPerMalam) return 0;
    const start = new Date(checkin);
    const end = new Date(checkout);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return nights * parseFloat(hargaPerMalam);
  };

  // Fungsi untuk membuka/tutup sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    localStorage.setItem('sidebarOpen', !isSidebarOpen);
  };

  // Fungsi untuk menangani klik tombol bayar
  const handlePaymentClick = (reservasi) => {
    setSelectedReservation(reservasi);
    setShowPaymentForm(true);
  };

  // Fungsi untuk menangani pembayaran berhasil
  const handlePaymentSuccess = () => {
    if (selectedReservation) {
      setPaidReservations(prev => new Set([...prev, selectedReservation.id]));
    }
    setShowPaymentForm(false);
    setNotificationMessage('Pembayaran berhasil!');
    setShowNotification(true);
    fetchReservasiList(); // Refresh data
    
    // Sembunyikan notifikasi setelah 3 detik
    setTimeout(() => {
      setShowNotification(false);
      setNotificationMessage('');
    }, 3000);
  };

  // Fungsi untuk memproses pembayaran
  // Route: POST /api/pembayaran
  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const token = localStorage.getItem('token');
      const totalAmount = calculateTotalPrice(
        selectedReservation.tanggal_checkin,
        selectedReservation.tanggal_checkout,
        selectedReservation.kamar.harga_per_malam
      );

      let paymentData = {
        reservasi_id: selectedReservation.id,
        metode_pembayaran: paymentMethod,
        total_pembayaran: totalAmount,
        status: 'pending'
      };

      // Tambah data kartu kredit jika metode pembayaran kartu kredit
      if (paymentMethod === 'kartu_kredit') {
        paymentData = {
          ...paymentData,
          card_number: cardNumber,
          card_expiry: cardExpiry,
          card_cvv: cardCVV
        };
      }

      const response = await axios.post(
        'http://localhost:5000/api/pembayaran',
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data) {
        setShowNotification(true);
        setNotificationMessage('Pembayaran berhasil diproses!');
        setTimeout(() => {
          setShowPaymentForm(false);
          setShowNotification(false);
          fetchReservasiList();
        }, 2000);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setShowNotification(true);
      setNotificationMessage('Gagal memproses pembayaran. Silakan coba lagi.');
    }
    setIsProcessing(false);
  };

  // Fungsi untuk membatalkan reservasi
  const handleCancelReservation = async (reservasiId) => {
    if (window.confirm('Apakah kamu yakin ingin membatalkan reservasi ini?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`http://localhost:5000/api/reservasi/${reservasiId}/cancel`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Refresh data reservasi
        fetchReservasiList();
        setShowNotification(true);
        setNotificationMessage('Reservasi berhasil dibatalkan dan akan dihapus dalam 30 detik');
        setTimeout(() => setShowNotification(false), 3000);

        // Set timer untuk refresh data setelah 31 detik (sedikit lebih lama dari backend)
        if (response.data.deleteAfter) {
          setTimeout(() => {
            fetchReservasiList();
            setShowNotification(true);
            setNotificationMessage('Reservasi telah dihapus dari sistem');
            setTimeout(() => setShowNotification(false), 3000);
          }, 31000);
        }
      } catch (error) {
        console.error('Error cancelling reservation:', error);
        setShowNotification(true);
        setNotificationMessage('Gagal membatalkan reservasi');
        setTimeout(() => setShowNotification(false), 3000);
      }
    }
  };

  // Render tampilan komponen
  return (
    <div className="flex flex-col min-h-screen">
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 relative">
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
        />
        <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : ''}`}>
          <div className="container mx-auto px-6 py-20 min-h-[calc(100vh-4rem)]">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Riwayat Reservasi</h1>
              <p className="text-gray-600">Kelola dan pantau semua reservasi kamar Anda</p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {error}</span>
              </div>
            ) : (
              <div>
                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Reservasi</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipe Kamar</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-in</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-out</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {reservasiList.map((reservasi) => (
                        <tr key={reservasi.id}>
                          <td className="px-6 py-4 whitespace-nowrap">{reservasi.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{reservasi.kamar.tipe_kamar}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{new Date(reservasi.tanggal_checkin).toLocaleDateString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{new Date(reservasi.tanggal_checkout).toLocaleDateString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            Rp {calculateTotalPrice(
                              reservasi.tanggal_checkin,
                              reservasi.tanggal_checkout,
                              reservasi.kamar.harga_per_malam
                            ).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${reservasi.status_reservasi === 'dipesan' ? 'bg-green-100 text-green-800' : 
                                reservasi.status_reservasi === 'dibatalkan' ? 'bg-red-100 text-red-800' : 
                                'bg-gray-100 text-gray-800'}`}>
                              {reservasi.status_reservasi}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {!reservasi.pembayaran && reservasi.status_reservasi !== 'selesai' && reservasi.status_reservasi !== 'dibatalkan' && !paidReservations.has(reservasi.id) && (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handlePaymentClick(reservasi)}
                                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                                >
                                  Bayar Sekarang
                                </button>
                                <button
                                  onClick={() => handleCancelReservation(reservasi.id)}
                                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                                >
                                  Batalkan
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden">
                  <div className="grid grid-cols-1 gap-4">
                    {reservasiList.map((reservasi) => (
                      <div key={reservasi.id} className="bg-white rounded-lg shadow-md p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold">Reservasi #{reservasi.id}</span>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                            ${reservasi.status_reservasi === 'dipesan' ? 'bg-green-100 text-green-800' : 
                              reservasi.status_reservasi === 'dibatalkan' ? 'bg-red-100 text-red-800' : 
                              'bg-gray-100 text-gray-800'}`}>
                            {reservasi.status_reservasi}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">Tipe Kamar: {reservasi.kamar.tipe_kamar}</p>
                          <p className="text-sm text-gray-600">Check-in: {new Date(reservasi.tanggal_checkin).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-600">Check-out: {new Date(reservasi.tanggal_checkout).toLocaleDateString()}</p>
                          <p className="text-sm font-medium">Total: Rp {calculateTotalPrice(
                            reservasi.tanggal_checkin,
                            reservasi.tanggal_checkout,
                            reservasi.kamar.harga_per_malam
                          ).toLocaleString()}</p>
                        </div>
                        {!reservasi.pembayaran && reservasi.status_reservasi !== 'selesai' && reservasi.status_reservasi !== 'dibatalkan' && !paidReservations.has(reservasi.id) && (
                          <div className="mt-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handlePaymentClick(reservasi)}
                                className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                              >
                                Bayar Sekarang
                              </button>
                              <button
                                onClick={() => handleCancelReservation(reservasi.id)}
                                className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                              >
                                Batalkan
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : ''}`}>
        <Footer />
      </div>

      {/* Modal Payment Form */}
      {showPaymentForm && selectedReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <PaymentForm
              reservation={selectedReservation}
              onSuccess={handlePaymentSuccess}
              onClose={() => setShowPaymentForm(false)}
            />
          </div>
        </div>
      )}

      {/* Notification */}
      {showNotification && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded shadow-lg">
          {notificationMessage}
        </div>
      )}
    </div>
  );
};

export default RiwayatReservasi;
