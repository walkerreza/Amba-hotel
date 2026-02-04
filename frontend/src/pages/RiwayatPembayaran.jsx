import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../component/layouts/Header';
import Sidebar from '../component/layouts/Sidebar';
import Footer from '../component/layouts/Footer';
import { HiCreditCard, HiCash, HiArrowCircleUp, HiDownload, HiPrinter } from 'react-icons/hi';
import authService from '../services/auth.service';
import { FaStar } from 'react-icons/fa';
import { getKamarByReservasi } from '../services/kamar.service';

const RiwayatPembayaran = () => {
  const navigate = useNavigate();
  const [pembayaranList, setPembayaranList] = useState([]);
  const [kamarDetails, setKamarDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [activeMenu, setActiveMenu] = useState('riwayat-pembayaran');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(null);
  const [reviewedPayments, setReviewedPayments] = useState(() => {
    // Ambil data ulasan dari localStorage saat inisialisasi
    const saved = localStorage.getItem('reviewedPayments');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  // Fungsi untuk mendapatkan user data
  const getUserData = () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Coba dapatkan userId dari berbagai sumber
    const finalUserId = userId || user.id;

    if (!token || !finalUserId) {
      return { isValid: false, message: 'Silakan login terlebih dahulu' };
    }

    return { isValid: true, token, userId: finalUserId };
  };

  useEffect(() => {
    // Cek user data saat component di-mount
    const userData = getUserData();
    if (!userData.isValid) {
      setError(userData.message);
      navigate('/login');
      return;
    }

    // Set up interval untuk cek token setiap 5 menit
    const intervalId = setInterval(() => {
      const checkResult = getUserData();
      if (!checkResult.isValid) {
        navigate('/login');
      }
    }, 5 * 60 * 1000);

    // Fetch data awal
    fetchPembayaranList();

    // Cleanup interval saat component unmount
    return () => clearInterval(intervalId);
  }, [filterStatus, filterDate]);

  useEffect(() => {
    const fetchKamarDetails = async (reservasiId) => {
      try {
        const kamarData = await getKamarByReservasi(reservasiId);
        setKamarDetails(prev => ({
          ...prev,
          [reservasiId]: kamarData
        }));
      } catch (error) {
        console.error('Error fetching room details:', error);
      }
    };

    pembayaranList.forEach(pembayaran => {
      fetchKamarDetails(pembayaran.reservasi_id);
    });
  }, [pembayaranList]);

  // Fungsi untuk mendapatkan data pembayaran
  const fetchPembayaranList = async () => {
    try {
      const userData = getUserData();
      if (!userData.isValid) {
        setError(userData.message);
        navigate('/login');
        return;
      }

      setLoading(true);
      console.log('Fetching payments for user:', userData.userId);
      
      // Ambil data pembayaran
      let url = `http://localhost:5000/api/pembayaran/user/${userData.userId}`;
      if (filterStatus !== 'all') {
        url += `?status_pembayaran=${filterStatus}`;
      }
      if (filterDate) {
        url += `${filterStatus !== 'all' ? '&' : '?'}tanggal_pembayaran=${filterDate}`;
      }

      const response = await axios.get(url, {
        headers: { 
          Authorization: `Bearer ${userData.token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Payment data received:', response.data);
      
      // Transform data untuk mendapatkan id_kamar dari reservasi
      const transformedData = await Promise.all(response.data.map(async payment => {
        try {
          // Fetch detail reservasi
          const reservasiResponse = await axios.get(
            `http://localhost:5000/api/reservasi/user/${userData.userId}`,
            {
              headers: { Authorization: `Bearer ${userData.token}` }
            }
          );
          
          // Cari reservasi yang sesuai dengan reservasi_id di pembayaran
          const matchingReservasi = reservasiResponse.data.find(
            r => parseInt(r.id) === parseInt(payment.reservasi_id)
          );
          
          console.log('Matching reservasi for payment', payment.id, ':', matchingReservasi);
          
          return {
            ...payment,
            reservasi: matchingReservasi || null
          };
        } catch (error) {
          console.error('Error fetching reservation:', error);
          return {
            ...payment,
            reservasi: null
          };
        }
      }));

      console.log('Transformed payment data:', transformedData);
      setPembayaranList(transformedData);
      setLoading(false);
    } catch (err) {
      console.error('Error in fetchPembayaranList:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  // Fungsi untuk generate dan print bukti pembayaran
  const generateBuktiPembayaran = (payment) => {
    console.log('Payment data:', payment); // Tambah log untuk debugging
    const formattedDate = payment.tanggal_pembayaran || 'Tanggal tidak valid';
    console.log('Formatted date:', formattedDate); // Tambah log untuk debugging
    
    const content = `
=================================
        BUKTI PEMBAYARAN         
=================================
ID Pembayaran: ${payment.id}
ID Reservasi : ${payment.reservasi_id}
Tanggal     : ${formattedDate}
Jumlah      : Rp ${parseFloat(payment.jumlah).toLocaleString('id-ID')}
Metode      : ${payment.metode_pembayaran}
Status      : ${payment.status_pembayaran}
=================================
        TERIMA KASIH             
=================================
    `;
    return content;
  };

  const printBuktiPembayaran = (payment) => {
    const content = generateBuktiPembayaran(payment);
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Bukti Pembayaran</title>
          <style>
            body { font-family: monospace; white-space: pre; }
            @media print {
              body { margin: 0; padding: 20px; }
            }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const downloadBuktiPembayaran = (payment) => {
    const content = generateBuktiPembayaran(payment);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bukti_pembayaran_${payment.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'sudah bayar':
        return 'bg-green-100 text-green-800';
      case 'belum bayar':
        return 'bg-red-100 text-red-800';
      case 'tunggu':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentIcon = (method) => {
    switch (method?.toLowerCase()) {
      case 'kartu kredit':
        return <HiCreditCard className="w-5 h-5" />;
      case 'cash':
        return <HiCash className="w-5 h-5" />;
      case 'transfer':
        return <HiArrowCircleUp className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const handleAddReview = (reservationId) => {
    setSelectedReservation(reservationId);
    setShowReviewModal(true);
  };

  const UlasanForm = ({ reservasiId, kamarId, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [ulasan, setUlasan] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit({ rating, ulasan, reservasiId, kamarId });
      setRating(0);
      setUlasan('');
    };

    return (
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Rating
          </label>
          <div className="flex">
            {[...Array(5)].map((star, i) => {
              const ratingValue = i + 1;
              return (
                <label key={i}>
                  <input
                    type="radio"
                    name="rating"
                    className="hidden"
                    value={ratingValue}
                    onClick={() => setRating(ratingValue)}
                  />
                  <FaStar
                    className="cursor-pointer"
                    color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                    size={24}
                    onMouseEnter={() => setHover(ratingValue)}
                    onMouseLeave={() => setHover(0)}
                  />
                </label>
              );
            })}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Ulasan
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={ulasan}
            onChange={(e) => setUlasan(e.target.value)}
            placeholder="Bagikan pengalaman menginap Anda..."
            rows="4"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={!rating || !ulasan}
        >
          Kirim Ulasan
        </button>
      </form>
    );
  };

  // Fungsi untuk mengirim ulasan
  const handleSubmitReview = async (data) => {
    try {
      const userData = getUserData();
      if (!userData.isValid) {
        setError(userData.message);
        navigate('/login');
        return;
      }

      // Validasi input
      if (!data.rating || data.rating < 1 || data.rating > 5) {
        alert('Rating harus diisi antara 1-5');
        return;
      }

      if (!data.ulasan || data.ulasan.trim() === '') {
        alert('Ulasan tidak boleh kosong');
        return;
      }

      // Cari data pembayaran dan reservasi
      const pembayaran = pembayaranList.find(p => parseInt(p.id) === parseInt(data.reservasiId));
      console.log('Selected payment:', pembayaran);
      
      if (!pembayaran?.reservasi) {
        console.error('Reservasi not found for payment:', pembayaran);
        alert('Data pembayaran atau reservasi tidak ditemukan');
        return;
      }

      const kamar_id = parseInt(pembayaran.reservasi.kamar_id);
      console.log('Kamar ID from reservasi:', kamar_id);
      
      if (!kamar_id) {
        console.error('Invalid kamar_id:', kamar_id);
        alert('Data kamar tidak ditemukan');
        return;
      }

      setIsSubmitting(true);

      // Debug log
      const reviewData = {
        id_kamar: kamar_id,
        rating: parseInt(data.rating),
        ulasan: data.ulasan.trim()
      };
      console.log('Sending review data:', reviewData);

      const response = await axios.post(
        'http://localhost:5000/api/ulasan',
        reviewData,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 201) {
        // Tambahkan ID pembayaran ke Set reviewedPayments
        setReviewedPayments(prev => new Set([...prev, data.reservasiId]));
        setShowReviewModal(false);
        setSelectedReservation(null);
        fetchPembayaranList();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      console.log('Error details:', error.response?.data);
      const errorMessage = error.response?.data?.message || 'Gagal mengirim ulasan';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const ReviewModal = ({ show, onClose, reservasiId, kamarId }) => {
    if (!show) return null;

    // Debug log
    console.log('Modal data:', { reservasiId, kamarId });

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-96">
          <h2 className="text-xl font-bold mb-4">Beri Ulasan</h2>
          <UlasanForm
            reservasiId={reservasiId}
            kamarId={kamarId}
            onSubmit={handleSubmitReview}
          />
          <button
            onClick={onClose}
            className="mt-4 text-gray-500 hover:text-gray-700"
          >
            Tutup
          </button>
        </div>
      </div>
    );
  };

  // Effect untuk menyimpan reviewedPayments ke localStorage
  useEffect(() => {
    localStorage.setItem('reviewedPayments', JSON.stringify([...reviewedPayments]));
  }, [reviewedPayments]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    localStorage.setItem('sidebarOpen', JSON.stringify(!isSidebarOpen));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <main className={`flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <div className="container mx-auto px-4 py-8 mt-16"> 
            {/* Content */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Riwayat Pembayaran</h1>
              <p className="text-gray-600">Lihat dan kelola riwayat pembayaran Anda</p>
            </div>

            {/* Filter Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-4">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Semua Status</option>
                    <option value="pending">Pending</option>
                <option value="sukses">Sukses</option>
                <option value="gagal">Gagal</option>
                  </select>

                  <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Payment History Cards */}
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
              <div className="grid grid-cols-1 gap-6">
                {pembayaranList.map((pembayaran) => (
                  <div key={pembayaran.id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between mb-4">
                      <div>
                        <h2 className="text-lg font-bold mb-2">Pembayaran #{pembayaran.id}</h2>
                        <p className="text-gray-600 mb-1">Tipe Kamar: {pembayaran.reservasi.kamar.tipe_kamar}</p>
                      </div>
                      <div className="flex items-center">
                        {getPaymentIcon(pembayaran.metode_pembayaran)}
                        <span className="ml-2">{pembayaran.metode_pembayaran}</span>
                      </div>
                    </div>
                    <div className="flex justify-between mb-4">
                      <p className="text-gray-600">Jumlah: Rp {parseFloat(pembayaran.jumlah).toLocaleString('id-ID')}</p>
                      <p className="text-gray-600">Tanggal: {pembayaran.tanggal_pembayaran}</p>
                    </div>
                    <div className="flex justify-between mb-4">
                      <p className="text-gray-600">Status: 
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(pembayaran.status_pembayaran === 'pending' ? 'tunggu' :
                          pembayaran.status_pembayaran === 'gagal' ? 'belum bayar' :
                          pembayaran.status_pembayaran === 'sukses' ? 'sudah bayar' : 
                          pembayaran.status_pembayaran)}`}>
                          {pembayaran.status_pembayaran === 'pending' ? 'Tunggu' :
                           pembayaran.status_pembayaran === 'gagal' ? 'Belum Bayar' :
                           pembayaran.status_pembayaran === 'sukses' ? 'Sudah Bayar' : 
                           pembayaran.status_pembayaran}
                        </span>
                      </p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => printBuktiPembayaran(pembayaran)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Print Bukti"
                        >
                          <HiPrinter className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => downloadBuktiPembayaran(pembayaran)}
                          className="text-green-600 hover:text-green-800"
                          title="Download Bukti"
                        >
                          <HiDownload className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    {!reviewedPayments.has(pembayaran.id) && pembayaran.status_pembayaran === 'sukses' && (
                      <button
                        onClick={() => {
                          setSelectedReservation(pembayaran);
                          setShowReviewModal(true);
                        }}
                        className="bg-[#09453D] text-white px-3 py-1 rounded hover:bg-[#09453D]/80"
                      >
                        Beri Ulasan
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <Footer />
        </main>

      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <ReviewModal
          show={showReviewModal}
          onClose={() => {
            setShowReviewModal(false);
            setSelectedReservation(null);
          }}
          reservasiId={selectedReservation?.id}
          kamarId={selectedReservation?.reservasi?.kamar_id} // Sesuaikan dengan struktur data yang benar
        />
      )}
    </div>
  );
};

export default RiwayatPembayaran;
