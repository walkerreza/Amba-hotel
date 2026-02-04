// Import library dan komponen yang dibutuhkan
import React, { useState, useEffect } from 'react';
import { HiHome, HiCalendar, HiUsers, HiSearch, HiX, HiKey, HiStar, HiCube, HiSparkles } from 'react-icons/hi'; // Import icon dari react-icons
import { getKamarList, getKamarByType, checkKamarAvailability, getRoomFeatures, getAvailableRooms } from '../services/kamar.service'; // Import fungsi terkait kamar
import Header from '../component/layouts/Header'; // Import komponen header
import Sidebar from '../component/layouts/Sidebar'; // Import komponen sidebar 
import Footer from '../component/layouts/Footer'; // Import komponen footer
import axios from 'axios'; // Import axios untuk HTTP request
import { useNavigate } from 'react-router-dom'; // Import untuk navigasi
import { createReservasi } from '../services/reservasi.service'; // Import fungsi reservasi
import { createPembayaran } from '../services/pembayaran.service'; // Import fungsi pembayaran
import { FaStar } from 'react-icons/fa'; // Import icon star
import { getUser } from '../services/auth.service';
import { toast } from 'react-toastify';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import 'dayjs/locale/id';

// Extend dayjs dengan plugin isBetween
dayjs.extend(isBetween);

// Komponen utama UserDashboard
// Route: /dashboard
const UserDashboard = () => {
  const navigate = useNavigate();
  
  // State untuk pencarian
  const [searchQuery, setSearchQuery] = useState('');
  
  // State untuk sidebar (disimpan di localStorage)
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // State untuk menu aktif (disimpan di localStorage) 
  const [activeMenu, setActiveMenu] = useState(() => {
    return localStorage.getItem('activeMenu') || 'dashboard';
  });

  // State untuk data kamar dan reservasi
  const [roomType, setRoomType] = useState('');
  const [selectedDates, setSelectedDates] = useState({
    checkin: '',
    checkout: ''
  });
  const [roomCount, setRoomCount] = useState('1 Room');
  const [kamarList, setKamarList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [kamarCounts, setKamarCounts] = useState({});  // State untuk menyimpan jumlah kamar per jenis
  const [availableRooms, setAvailableRooms] = useState({
    total: 0,
    perType: {}
  });

  // State untuk kriteria pencarian
  const [searchCriteria, setSearchCriteria] = useState({
    tipe_kamar: '',
    status_kamar: '', 
    harga_min: '',
    harga_max: ''
  });

  // State untuk modal dan form
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // State untuk data reservasi dan pembayaran
  const [reservasiList, setReservasiList] = useState([]);
  const [pembayaranList, setPembayaranList] = useState([]);

  // State untuk notifikasi
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  // State untuk gambar dan pembayaran
  const [activeImage, setActiveImage] = useState('room');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('transfer');
  const [selectedReservation, setSelectedReservation] = useState(null);

  // State untuk review
  const [roomReviews, setRoomReviews] = useState({});

  // State untuk ulasan
  const [ulasan, setUlasan] = useState([]);

  // State untuk menyimpan data user
  const [userData, setUserData] = useState({
    username: '',
    email: ''
  });

  // State untuk menyimpan data reservasi yang sudah ada
  const [existingReservations, setExistingReservations] = useState([]);

  // State untuk error modal
  const [errorModal, setErrorModal] = useState({
    show: false,
    message: ''
  });

  // Fungsi untuk mengambil data user
  const getUserData = () => {
    try {
      const user = getUser();
      if (user) {
        setUserData(JSON.parse(user));
      }
    } catch (error) {
      console.error('Error getting user data:', error);
    }
  };

  // Fungsi untuk menghitung rata-rata rating
  const calculateAverageRating = (roomId) => {
    const reviews = roomReviews[roomId] || [];
    if (reviews.length === 0) return 0;
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  // Fetch reviews untuk semua kamar
  const fetchRoomReviews = async () => {
    try {
      const token = localStorage.getItem('token');
      const promises = kamarList.map(kamar => 
        axios.get(`http://localhost:5000/api/ulasan/kamar/${kamar.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      );
      
      const responses = await Promise.all(promises);
      
      // Group reviews by room ID
      const reviewsByRoom = {};
      responses.forEach((response, index) => {
        reviewsByRoom[kamarList[index].id] = response.data;
      });
      
      setRoomReviews(reviewsByRoom);
    } catch (error) {
      console.error('Error fetching room reviews:', error);
    }
  };

  // Fungsi untuk menghitung jumlah kamar per jenis
  const hitungJumlahKamarPerJenis = (kamarData) => {
    const counts = kamarData.reduce((acc, kamar) => {
      acc[kamar.tipe_kamar] = (acc[kamar.tipe_kamar] || 0) + 1;
      return acc;
    }, {});
    setKamarCounts(counts);
  };

  // Fungsi untuk menghitung kamar yang tersedia hari ini
  const hitungKamarTersedia = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await getAvailableRooms(today);
      
      if (response.data) {
        // Hitung kamar yang tersedia (status = 'tersedia')
        const availableData = response.data.reduce((acc, kamar) => {
          if (kamar.status_kamar === 'tersedia') {
            acc.total += 1;
            acc.perType[kamar.tipe_kamar] = (acc.perType[kamar.tipe_kamar] || 0) + 1;
          }
          return acc;
        }, { total: 0, perType: {} });
        
        setAvailableRooms(availableData);
      } else {
        console.error('Invalid response format:', response);
        setAvailableRooms({ total: 0, perType: {} });
      }
    } catch (error) {
      console.error('Error fetching available rooms:', error);
      setAvailableRooms({ total: 0, perType: {} });
    }
  };

  // Fungsi untuk mengecek ketersediaan tanggal
  const checkDateAvailability = (roomId, checkin, checkout) => {
    // Convert string dates to Date objects
    const checkInDate = new Date(checkin);
    const checkOutDate = new Date(checkout);

    // Cek apakah ada reservasi yang overlap
    return !existingReservations.some(reservation => {
      if (reservation.roomId !== roomId) return false;
      
      const existingCheckIn = new Date(reservation.checkin);
      const existingCheckOut = new Date(reservation.checkout);

      return (
        (checkInDate >= existingCheckIn && checkInDate < existingCheckOut) ||
        (checkOutDate > existingCheckIn && checkOutDate <= existingCheckOut) ||
        (checkInDate <= existingCheckIn && checkOutDate >= existingCheckOut)
      );
    });
  };

  // Fungsi untuk cek apakah tanggal sudah dipesan
  const isDateBooked = (date) => {
    if (!selectedRoom || !date) return false;
    
    const currentDate = dayjs(date).startOf('day');
    console.log('Checking date:', currentDate.format('YYYY-MM-DD'), {
      selectedRoom,
      existingReservations
    });

    return existingReservations.some(reservation => {
      if (parseInt(reservation.roomId) !== parseInt(selectedRoom.id)) {
        console.log('Room ID mismatch:', reservation.roomId, selectedRoom.id);
        return false;
      }
      
      const checkIn = dayjs(reservation.checkin).startOf('day');
      const checkOut = dayjs(reservation.checkout).startOf('day');
      
      console.log('Comparing with reservation:', {
        checkIn: checkIn.format('YYYY-MM-DD'),
        checkOut: checkOut.format('YYYY-MM-DD'),
        currentDate: currentDate.format('YYYY-MM-DD')
      });

      // Cek apakah tanggal berada dalam rentang checkin dan checkout (inclusive)
      const isInRange = currentDate.isSame(checkIn, 'day') || 
                       currentDate.isSame(checkOut, 'day') ||
                       currentDate.isBetween(checkIn, checkOut, 'day');
      
      console.log('Is date in range?', isInRange);
      return isInRange;
    });
  };

  // Fungsi untuk custom render tanggal
  const cellRender = (current) => {
    const isBooked = isDateBooked(current);
    const isToday = current.isSame(dayjs(), 'day');
    const isSelected = selectedDates.checkin === current.format('YYYY-MM-DD') || 
                      selectedDates.checkout === current.format('YYYY-MM-DD');
    
    console.log('Rendering date:', current.format('YYYY-MM-DD'), {
      isBooked,
      isToday,
      isSelected,
      selectedRoom,
      existingReservations: existingReservations.length
    });
    
    let bgColorClass = 'bg-green-100 hover:bg-green-200'; // Available
    let textColorClass = 'text-green-800';
    
    if (isBooked) {
      bgColorClass = 'bg-red-100 hover:bg-red-200'; // Booked
      textColorClass = 'text-red-800';
    }
    if (isToday) {
      bgColorClass = 'bg-yellow-100 hover:bg-yellow-200'; // Today
      textColorClass = 'text-yellow-800';
    }
    if (isSelected) {
      bgColorClass = 'bg-blue-200 hover:bg-blue-300'; // Selected
      textColorClass = 'text-blue-800';
    }

    return (
      <div
        className={`
          relative w-8 h-8 flex items-center justify-center rounded-full
          transition-colors duration-200 ease-in-out cursor-pointer
          ${bgColorClass}
        `}
        onClick={() => console.log('Clicked date:', current.format('YYYY-MM-DD'))}
      >
        <span className={`${textColorClass} font-medium`}>
          {current.date()}
        </span>
      </div>
    );
  };

  // Komponen untuk menampilkan bintang rating
  const RatingStars = ({ rating }) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, index) => (
          <FaStar
            key={index}
            className={index < rating ? "text-yellow-400" : "text-gray-300"}
          />
        ))}
      </div>
    );
  };

  // Fungsi untuk mengambil daftar kamar dari API
  // Route: GET /api/kamar
  const fetchKamarList = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getKamarList();
      
      // Tambahkan placeholder image jika gambar tidak ada
      const kamarsWithFallback = response.map(kamar => ({
        ...kamar,
        previewUrl: kamar.previewUrl || '/room-placeholder.jpg',
        roomUrl: kamar.roomUrl || '/room-placeholder.jpg',
        facilityUrl: kamar.facilityUrl || '/room-placeholder.jpg',
        locationUrl: kamar.locationUrl || '/room-placeholder.jpg'
      }));

      console.log('Kamar list:', kamarsWithFallback);
      setKamarList(kamarsWithFallback);
      hitungJumlahKamarPerJenis(kamarsWithFallback);
    } catch (err) {
      console.error('Error fetching rooms:', err);
      setError('Gagal mengambil data kamar. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data saat komponen dimount
  useEffect(() => {
    fetchKamarList();
    fetchReservasiList();
    fetchPembayaranList();
    fetchUlasan();
    hitungKamarTersedia();
    getUserData();
  }, []);

  // Fetch ulasan setelah data kamar tersedia
  useEffect(() => {
    if (kamarList.length > 0) {
      fetchRoomReviews();
    }
  }, [kamarList]);

  // Timer untuk notifikasi
  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  // Fungsi untuk menampilkan notifikasi sukses
  const showSuccessNotification = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
  };

  // Fungsi untuk mengambil daftar reservasi user
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
      setReservasiList(response.data);
    } catch (err) {
      console.error('Error fetching reservasi list:', err);
    }
  };

  // Fungsi untuk mengambil daftar pembayaran user
  // Route: GET /api/pembayaran/user/:id
  const fetchPembayaranList = async () => {
    try {
      const token = localStorage.getItem('token');
      const userString = localStorage.getItem('user');
      let userData = null;

      try {
        userData = userString ? JSON.parse(userString) : null;
      } catch (e) {
        console.error('Error parsing user data:', e);
        return;
      }

      if (!userData || !userData.id) {
        console.error('User data not found');
        return;
      }

      const response = await axios.get(`http://localhost:5000/api/pembayaran/user/${userData.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setPembayaranList(response.data.pembayaran || []);
    } catch (error) {
      console.error('Error fetching payment list:', error);
    }
  };

  // Fungsi untuk menangani reservasi kamar
  // Route: POST /api/reservasi
  const handleReservation = async (kamarId) => {
    console.log('Starting reservation process...');
    
    if (!selectedDates.checkin || !selectedDates.checkout) {
      alert('Silakan pilih tanggal check-in dan check-out');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      console.log('Current token:', token);
      
      let user;
      try {
        const userData = localStorage.getItem('user');
        console.log('Raw user data:', userData);
        user = JSON.parse(userData);
        console.log('Parsed user data:', user);
      } catch (e) {
        console.error('Error parsing user data:', e);
        user = null;
      }
      
      if (!token || !user || !user.id) {
        console.log('Authentication check failed:', { token: !!token, user: !!user, userId: user?.id });
        alert('Silakan login terlebih dahulu untuk melakukan reservasi');
        navigate('/login');
        return;
      }

      // Validasi tanggal
      const checkinDate = new Date(selectedDates.checkin);
      const checkoutDate = new Date(selectedDates.checkout);
      console.log('Dates:', { checkin: checkinDate, checkout: checkoutDate });
      
      if (checkinDate >= checkoutDate) {
        alert('Tanggal check-out harus lebih besar dari tanggal check-in');
        return;
      }

      const reservasiData = {
        user_id: user.id,
        kamar_id: kamarId,
        tanggal_checkin: selectedDates.checkin,
        tanggal_checkout: selectedDates.checkout,
        jumlah_kamar: parseInt(roomCount) || 1,
        status_reservasi: 'pending'
      };

      console.log('Sending reservation data:', reservasiData);

      const response = await createReservasi(reservasiData);
      console.log('Reservation response:', response);

      if (response) {
        setReservationData(response);
        showSuccessNotification('Reservasi berhasil! Silakan cek email Anda untuk konfirmasi.');
        setShowReservationForm(false);
        await fetchReservasiList();
      }
    } catch (error) {
      console.error('Detailed reservation error:', {
        error,
        response: error.response,
        data: error.response?.data,
        status: error.response?.status
      });
      
      if (error?.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        alert('Sesi Anda telah berakhir. Silakan login kembali.');
        navigate('/login');
      } else {
        const errorMessage = error?.response?.data?.message || error.message || 'Gagal melakukan reservasi. Silakan coba lagi.';
        alert(errorMessage);
      }
    }
  };

  // Fungsi untuk toggle sidebar
  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    localStorage.setItem('sidebarOpen', JSON.stringify(newState));
  };

  // Fungsi untuk menangani perubahan pencarian
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Fungsi untuk melakukan pencarian kamar
  const handleSearch = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Ambil data kamar
      const allKamar = await getKamarList();
      
      // Filter berdasarkan kriteria pencarian
      const filteredKamar = allKamar.filter(kamar => {
        const matchNomor = !searchCriteria.nomor_kamar || 
          kamar.nomor_kamar.toLowerCase().includes(searchCriteria.nomor_kamar.toLowerCase());
        
        const matchTipe = !searchCriteria.tipe_kamar || 
          kamar.tipe_kamar.toLowerCase() === searchCriteria.tipe_kamar.toLowerCase();
        
        const matchStatus = !searchCriteria.status_kamar || 
          kamar.status_kamar.toLowerCase() === searchCriteria.status_kamar.toLowerCase();
        
        const matchHargaMin = !searchCriteria.harga_min || 
          parseFloat(kamar.harga_per_malam) >= parseFloat(searchCriteria.harga_min);
        
        const matchHargaMax = !searchCriteria.harga_max || 
          parseFloat(kamar.harga_per_malam) <= parseFloat(searchCriteria.harga_max);

        return matchNomor && matchTipe && matchStatus && matchHargaMin && matchHargaMax;
      });

      // Tambahkan placeholder image jika gambar tidak ada
      const kamarsWithFallback = filteredKamar.map(kamar => ({
        ...kamar,
        previewUrl: kamar.previewUrl || '/room-placeholder.jpg',
        roomUrl: kamar.roomUrl || '/room-placeholder.jpg',
        facilityUrl: kamar.facilityUrl || '/room-placeholder.jpg',
        locationUrl: kamar.locationUrl || '/room-placeholder.jpg'
      }));

      setKamarList(kamarsWithFallback);
      hitungJumlahKamarPerJenis(kamarsWithFallback);
    } catch (err) {
      console.error('Error searching rooms:', err);
      setError('Gagal melakukan pencarian. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk membuka detail kamar
  const openRoomDetails = (room) => {
    setSelectedRoom(room);
    setShowModal(true);
  };

  // Fungsi untuk menangani klik reservasi
  const handleReserveClick = (room) => {
    setSelectedRoom(room);
    fetchExistingReservations(room.id); // Ambil data reservasi saat kamar dipilih
    setShowReservationForm(true);
  };

  // Fungsi untuk menghitung total harga
  const calculateTotalPrice = (checkin, checkout, hargaPerMalam) => {
    const start = new Date(checkin);
    const end = new Date(checkout);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return nights * hargaPerMalam;
  };

  // Fungsi untuk submit reservasi
  // Route: POST /api/reservasi
  const handleReservationSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      const token = localStorage.getItem('token');
      const userString = localStorage.getItem('user');
      let userData = null;
      
      if (userString) {
        userData = JSON.parse(userString);
      }

      if (!userData || !token) {
        toast.error('Silakan login terlebih dahulu');
        return;
      }

      // Hitung total harga
      const totalHarga = calculateTotalPrice(
        selectedDates.checkin,
        selectedDates.checkout,
        selectedRoom.harga_per_malam
      );

      // Format data sesuai yang diminta backend
      const reservasiData = {
        user_id: userData.id,
        kamar_id: selectedRoom.id,
        nomor_kamar: selectedRoom.nomor_kamar,
        tanggal_checkin: selectedDates.checkin,
        tanggal_checkout: selectedDates.checkout,
        jumlah_kamar: 1,
        total_harga: totalHarga,
        status_reservasi: 'pending',
        status_pembayaran: 'belum_dibayar',
        metode_pembayaran: 'transfer', // default metode pembayaran
        bukti_pembayaran: null // akan diupdate saat pembayaran
      };

      console.log('Mengirim data reservasi:', reservasiData); // untuk debugging

      const response = await createReservasi(reservasiData);
      
      // Simpan data reservasi ke state lokal setelah berhasil di backend
      setExistingReservations(prev => [...prev, {
        roomId: selectedRoom.id,
        checkin: selectedDates.checkin,
        checkout: selectedDates.checkout
      }]);

      toast.success('Reservasi berhasil dibuat! Silakan lakukan pembayaran');
      setShowReservationForm(false);
      fetchKamarList(); // Refresh data kamar
    } catch (error) {
      console.error('Error reservasi:', error);
      const errorMessage = error?.message || 'Terjadi kesalahan';
      
      // Show error modal untuk pesan spesifik
      if (errorMessage === 'Kamar sudah dipesan untuk tanggal tersebut') {
        setErrorModal({
          show: true,
          message: 'Maaf, kamar ini sudah dipesan untuk tanggal yang Anda pilih. Silakan pilih tanggal lain atau kamar lainnya.'
        });
      } else {
        toast.error(`Gagal membuat reservasi: ${errorMessage}`);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Fungsi untuk menangani klik menu
  const handleMenuClick = (menuId) => {
    setActiveMenu(menuId);
    localStorage.setItem('activeMenu', menuId);
  };

  // Fungsi untuk menangani pembayaran
  // Route: POST /api/pembayaran
  const handlePaymentClick = (reservasi) => {
    try {
      const paymentData = {
        reservasi_ids: reservasi.id,
        metode_pembayaran: 'transfer'
      };

      axios.post('http://localhost:5000/api/pembayaran', paymentData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }).then(response => {
        if (response.data) {
          showSuccessNotification('Pembayaran berhasil diproses!');
          fetchReservasiList();
          fetchPembayaranList();
        }
      }).catch(error => {
        console.error('Error processing payment:', error);
        const errorMessage = error?.response?.data?.message || error.message || 'Gagal memproses pembayaran. Silakan coba lagi.';
        alert(errorMessage);
      });
    } catch (error) {
      console.error('Error in payment process:', error);
      alert('Terjadi kesalahan dalam proses pembayaran');
    }
  };

  // Fungsi untuk mengambil ulasan
  const fetchUlasan = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5000/api/ulasan/kamar/${kamarId}',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setUlasan(response.data);
    } catch (error) {
      console.error('Error fetching ulasan:', error);
    }
  };

  // Fungsi untuk mengambil data reservasi dari backend
  const fetchExistingReservations = async (kamarId) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching reservations for kamar:', kamarId);
      
      // Get all reservations first
      const response = await axios.get(`http://localhost:5000/api/reservasi`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('Raw response:', response.data);
      
      // Filter reservations for this room
      const reservations = response.data
        .filter(reservasi => 
          reservasi.status_reservasi !== 'cancelled' && 
          parseInt(reservasi.kamar_id) === parseInt(kamarId)
        )
        .map(reservasi => ({
          roomId: reservasi.kamar_id,
          checkin: reservasi.tanggal_checkin,
          checkout: reservasi.tanggal_checkout
        }));

      console.log('Filtered reservations for room:', reservations);
      setExistingReservations(reservations);
    } catch (error) {
      console.error('Error mengambil data reservasi:', error);
      toast.error('Gagal mengambil data reservasi');
    }
  };

  // Component untuk menampilkan tabel riwayat reservasi
  // Route: /dashboard/riwayat-reservasi
  const ReservasiTable = () => (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. Kamar</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipe Kamar</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-in</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-out</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Harga</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {/* Mapping data reservasi untuk ditampilkan dalam tabel */}
        {reservasiList.map((reservasi) => (
          <tr key={reservasi.id}>
            <td className="px-6 py-4 whitespace-nowrap">{reservasi.kamar.nomor_kamar}</td>
            <td className="px-6 py-4 whitespace-nowrap capitalize">{reservasi.kamar.tipe_kamar}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              {new Date(reservasi.tanggal_checkin).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {new Date(reservasi.tanggal_checkout).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {/* Menghitung total harga berdasarkan durasi menginap */}
              Rp {calculateTotalPrice(
                reservasi.tanggal_checkin,
                reservasi.tanggal_checkout,
                reservasi.kamar.harga_per_malam
              ).toLocaleString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {/* Menampilkan status reservasi dengan warna yang berbeda */}
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                ${reservasi.status_reservasi === 'dipesan' ? 'bg-green-100 text-green-800' : 
                  reservasi.status_reservasi === 'dibatalkan' ? 'bg-red-100 text-red-800' : 
                  'bg-gray-100 text-gray-800'}`}>
                {reservasi.status_reservasi}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {/* Menampilkan tombol bayar jika belum ada pembayaran */}
              {!reservasi.pembayaran && reservasi.status_reservasi === 'dipesan' && (
                <button
                  onClick={() => handlePaymentClick(reservasi)}
                  className="text-amber-600 hover:text-amber-900"
                >
                  Bayar Sekarang
                </button>
              )}
              {/* Menampilkan status pembayaran jika sudah ada pembayaran */}
              {reservasi.pembayaran && (
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${reservasi.pembayaran.status_pembayaran === 'sukses' ? 'bg-green-100 text-green-800' : 
                    reservasi.pembayaran.status_pembayaran === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'}`}>
                  {reservasi.pembayaran.status_pembayaran}
                </span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  // Component untuk menampilkan ulasan
  const UlasanCard = ({ ulasan }) => {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="flex items-center mb-2">
          <div className="flex">
            {[...Array(5)].map((_, index) => (
              <FaStar
                key={index}
                color={index < ulasan.rating ? "#ffc107" : "#e4e5e9"}
                size={16}
              />
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-600">
            {new Date(ulasan.tanggal_ulasan).toLocaleDateString()}
          </span>
        </div>
        <p className="text-gray-800">{ulasan.ulasan}</p>
        <p className="text-sm text-gray-600 mt-2">
          Oleh: {ulasan.nama_user}
        </p>
      </div>
    );
  };

  // Component untuk menampilkan card kamar
  const RoomCard = ({ room }) => {
    const averageRating = calculateAverageRating(room.id);
    const [showReviews, setShowReviews] = useState(false);
    
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden relative">
        {/* Status Badge */}
        <div className="absolute top-2 right-2 z-10">
          <span className={`px-3 py-1 inline-flex text-sm leading-5 font-medium rounded-full shadow-sm
            ${room.isBooked 
              ? 'bg-red-100 text-red-800 border border-red-200' 
              : 'bg-green-100 text-green-800 border border-green-200'
            }`}>
            {room.isBooked ? 'Dipesan' : 'Tersedia'}
          </span>
        </div>

        <img
          src={room.previewUrl}
          alt={room.tipe_kamar}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-2 capitalize">{room.tipe_kamar}</h3>
          <div className="flex items-center mb-2">
            <RatingStars rating={averageRating} />
            <span className="ml-2 text-sm text-gray-600">({roomReviews[room.id]?.length || 0} ulasan)</span>
          </div>
          <p className="text-gray-600 mb-4">Rp {room.harga_per_malam.toLocaleString()} / malam</p>
          
          {/* Tampilkan tombol hanya jika kamar tersedia */}
          <button
            onClick={() => handleReserveClick(room)}
            className="w-full bg-gradient-to-r from-[#09453D] to-[#127369] text-white px-6 py-2.5 rounded-lg font-medium hover:from-[#127369] hover:to-[#09453D] transform hover:-translate-y-0.5 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            {room.isBooked ? 'Kamar Sudah Dipesan' : 'Pesan Sekarang'}
          </button>

          {roomReviews[room.id] && roomReviews[room.id].length > 0 && (
            <div className="mt-4 border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-semibold">Ulasan Terbaru</h4>
                <button 
                  onClick={() => setShowReviews(!showReviews)}
                  className="text-sm text-[#09453D] hover:text-[#09453D]/80 transition-colors"
                >
                  {showReviews ? 'Sembunyikan' : 'Lihat Ulasan'}
                </button>
              </div>
              
              {showReviews && (
                <div className="space-y-2">
                  {roomReviews[room.id].slice(0, 2).map((review, index) => (
                    <div key={index} className="p-2 bg-gray-50 rounded">
                      <div className="flex items-center justify-between">
                        <RatingStars rating={review.rating} />
                        <span className="text-xs text-gray-500">
                          {new Date(review.created_at).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{review.ulasan}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Halaman utama dashboard user
  // Route: /dashboard
  useEffect(() => {
    const checkExpiredReservations = async () => {
      try {
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:5000/api/reservasi/update-expired', {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        // Refresh data setelah update
        fetchReservasiList();
      } catch (error) {
        console.error('Error checking expired reservations:', error);
      }
    };

    // Jalankan pengecekan saat komponen dimount
    checkExpiredReservations();

    // Set interval untuk mengecek setiap 5 menit
    const interval = setInterval(checkExpiredReservations, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Fungsi untuk menutup error modal
  const closeErrorModal = () => {
    setErrorModal({ show: false, message: '' });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header dengan fitur pencarian */}
      <Header onSearch={handleSearch} searchQuery={searchQuery} />
      
      {/* Sidebar untuk navigasi */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />

      {/* Konten utama */}
      <main className={`transition-all duration-300 pt-16 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Hero Section dengan background image */}
        <div 
          className="relative h-screen bg-cover bg-center bg-fixed"
          style={{ 
            backgroundImage: `url(${activeImage === 'room' ? '/dashboarduser.jpg' : activeImage === 'room2' ? '/DASHBORDUSER.jpg' : '/DASHBORDUSER2.jpg'})`,
            height: '80vh'
          }}
          onClick={() => setActiveImage(activeImage === 'room' ? 'room2' : activeImage === 'room2' ? 'room3' : 'room')}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm">
            <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center">
              {/* Teks selamat datang */}
              <div className="text-white max-w-3xl text-center">
                <h1 className="text-6xl font-bold mb-6 animate-fade-in-down">
              Selamat datang di AMBA Hotel
                </h1>
                <p className="text-2xl mb-12 animate-fade-in-up">
                  Hi, <span className="font-bold text-3xl">{userData.username}</span>! Ayo cari kamar untukmu
                </p>
              </div>

              {/* Form pencarian kamar */}
              <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-4xl w-full animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Input nomor kamar */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <div className="bg-gradient-to-r from-green-500 to-green-300 p-1 rounded-full mr-2">
                        <HiHome className="text-white" />
                      </div>
                      Room Number
                    </label>
                    <input
                      type="text"
                      name="nomor_kamar"
                      value={searchCriteria.nomor_kamar}
                      onChange={handleSearchChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-black focus:border-black transition-all duration-300"
                      placeholder="Enter room number"
                    />
                  </div>

                  {/* Dropdown tipe kamar */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <div className="bg-gradient-to-r from-green-500 to-green-300 p-1 rounded-full mr-2">
                        <HiHome className="text-white" />
                      </div>
                      Room Type
                    </label>
                    <select
                      name="tipe_kamar"
                      value={searchCriteria.tipe_kamar}
                      onChange={handleSearchChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-black focus:border-black transition-all duration-300"
                    >
                      <option value="">Semua Type</option>
                      <option value="standart">Standart</option>
                      <option value="premium">Premium</option>
                      <option value="luxury">Luxury</option>
                      <option value="vip">VIP</option>
                    </select>
                  </div>

                  {/* Dropdown status kamar */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <div className="bg-gradient-to-r from-green-500 to-green-300 p-1 rounded-full mr-2">
                        <HiUsers className="text-white" />
                      </div>
                      Status
                    </label>
                    <select
                      name="status_kamar"
                      value={searchCriteria.status_kamar}
                      onChange={handleSearchChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-black focus:border-black transition-all duration-300"
                    >
                      <option value="">Semua Status</option>
                      <option value="tersedia">Tersedia</option>
                      <option value="dipesan">Dipesan</option>
                    </select>
                  </div>

                  {/* Input harga minimum */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <div className="bg-gradient-to-r from-green-500 to-green-300 p-1 rounded-full mr-2">
                        <HiCalendar className="text-white" />
                      </div>
                      Min Price
                    </label>
                    <input
                      type="number"
                      name="harga_min"
                      value={searchCriteria.harga_min}
                      onChange={handleSearchChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-black focus:border-black transition-all duration-300"
                      placeholder="Minimum price"
                    />
                  </div>

                  {/* Input harga maksimum */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <div className="bg-gradient-to-r from-green-500 to-green-300 p-1 rounded-full mr-2">
                        <HiCalendar className="text-white" />
                      </div>
                      Max Price
                    </label>
                    <input
                      type="number"
                      name="harga_max"
                      value={searchCriteria.harga_max}
                      onChange={handleSearchChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-black focus:border-black transition-all duration-300"
                      placeholder="Maximum price"
                    />
                  </div>

                  {/* Tombol pencarian */}
                  <div className="flex items-end">
                    <button
                      onClick={handleSearch}
                      className="w-full h-[42px] bg-[#09453D] text-white px-6 rounded-lg hover:bg-[#09453D]/80 transition-all duration-300 flex items-center justify-center"
                    >
                      <HiSearch className="text-xl mr-2" /> Cari Kamar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Menampilkan daftar kamar jika menu aktif adalah dashboard */}
        {activeMenu === 'dashboard' && (
          <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Available Rooms</h2>
            
            {/* Tampilan jumlah kamar per jenis */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl shadow-lg mb-6 border border-blue-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-indigo-800 flex items-center">
                  <HiKey className="w-7 h-7 mr-2 text-indigo-600" />
                  Statistik Kamar Hotel
                </h3>
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-600">Tanggal</p>
                  <p className="font-semibold text-indigo-800">{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>

              {/* Total kamar tersedia hari ini */}
              <div className="mb-6 bg-gradient-to-r from-emerald-500 to-teal-500 p-4 rounded-xl shadow-md text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <HiHome className="w-10 h-10 mr-3 opacity-90" />
                    <div>
                      <h4 className="font-bold text-xl">Total Kamar Tersedia</h4>
                      <p className="text-sm opacity-90">Hari Ini</p>
                    </div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
                    <span className="text-3xl font-bold">{availableRooms.total}</span>
                  </div>
                </div>
              </div>

              {/* Grid statistik per tipe kamar */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(kamarCounts).map(([tipe, jumlah]) => {
                  let Icon;
                  let colorClass;
                  switch(tipe.toLowerCase()) {
                    case 'vip':
                      Icon = HiSparkles;
                      colorClass = 'from-purple-500 to-pink-500 text-white';
                      break;
                    case 'suite':
                      Icon = HiStar;
                      colorClass = 'from-yellow-500 to-orange-500 text-white';
                      break;
                    default:
                      Icon = HiCube;
                      colorClass = 'from-blue-500 to-indigo-500 text-white';
                  }
                  return (
                    <div key={tipe} className="transform transition-all duration-300 hover:scale-105">
                      <div className={`bg-gradient-to-r ${colorClass} p-4 rounded-xl shadow-md`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <Icon className="w-8 h-8 mr-3 opacity-90" />
                            <div>
                              <h4 className="font-bold capitalize text-lg">{tipe}</h4>
                              <p className="text-sm opacity-90">Total Kamar</p>
                            </div>
                          </div>
                          <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                            <span className="text-2xl font-bold">{jumlah}</span>
                          </div>
                        </div>
                        <div className="mt-2 pt-2 border-t border-white/20">
                          <div className="flex justify-between items-center">
                            <span className="text-sm opacity-90">Tersedia Hari Ini</span>
                            <span className="font-bold">{availableRooms.perType[tipe] || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* End statistik kamar */}

            {/* Grid kamar */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                // Tampilan loading
                Array(6).fill(null).map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))
              ) : error ? (
                // Tampilan error
                <div className="col-span-full text-center text-red-500">{error}</div>
              ) : kamarList.length === 0 ? (
                // Tampilan jika tidak ada kamar
                <div className="col-span-full text-center text-gray-500">No rooms found</div>
              ) : (
                // Menampilkan daftar kamar
                kamarList.map((room) => (
                  <RoomCard key={room.id} room={room} />
                ))
              )}
            </div>
          </div>
        )}

        {/* Menampilkan riwayat reservasi jika menu aktif adalah riwayat-reservasi */}
        {activeMenu === 'riwayat-reservasi' && (
          <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Riwayat Reservasi</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <ReservasiTable />
            </div>
          </div>
        )}

        {/* Menampilkan riwayat pembayaran jika menu aktif adalah riwayat-pembayaran */}
        {activeMenu === 'riwayat-pembayaran' && (
          <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Riwayat Pembayaran</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. Reservasi</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metode</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pembayaranList.map((pembayaran) => (
                      <tr key={pembayaran.id}>
                        <td className="px-6 py-4 whitespace-nowrap">#{pembayaran.reservasi_id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(pembayaran.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          Rp {parseFloat(pembayaran.jumlah).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap capitalize">{pembayaran.metode_pembayaran}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${pembayaran.status_pembayaran === 'sukses' ? 'bg-green-100 text-green-800' : 
                              pembayaran.status_pembayaran === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'}`}>
                            {pembayaran.status_pembayaran}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {pembayaran.status_pembayaran === 'pending' && (
                            <button
                              onClick={() => handlePaymentClick(pembayaran)}
                              className="text-amber-600 hover:text-amber-900"
                            >
                              Bayar Sekarang
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Menampilkan ulasan */}
        {activeMenu === 'ulasan' && (
          <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Ulasan</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              {ulasan.length > 0 ? (
                ulasan.map((ulasan) => (
                  <UlasanCard key={ulasan.id} ulasan={ulasan} />
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">Belum ada ulasan</p>
              )}
            </div>
          </div>
        )}

        {/* Modal detail kamar */}
        {showModal && selectedRoom && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg max-w-3xl w-full mx-4 overflow-hidden">
              {/* Tampilan gambar kamar */}
              <div className="relative">
                <div className="w-full h-64 relative">
                  {activeImage === 'room' && (
                    <img
                      src={selectedRoom.roomUrl}
                      alt={`Room ${selectedRoom.nomor_kamar}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/room-placeholder.jpg';
                      }}
                    />
                  )}
                  {activeImage === 'facility' && (
                    <img
                      src={selectedRoom.facilityUrl}
                      alt={`Facility ${selectedRoom.nomor_kamar}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/room-placeholder.jpg';
                      }}
                    />
                  )}
                  {activeImage === 'location' && (
                    <img
                      src={selectedRoom.locationUrl}
                      alt={`Location ${selectedRoom.nomor_kamar}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/room-placeholder.jpg';
                      }}
                    />
                  )}
                  {/* Navigasi gambar */}
                  <div className="absolute bottom-0 left-0 right-0 flex justify-center p-2 space-x-2 bg-black bg-opacity-50">
                    <button
                      onClick={() => setActiveImage('room')}
                      className={`w-3 h-3 rounded-full ${activeImage === 'room' ? 'bg-white' : 'bg-white opacity-50'} hover:opacity-100`}
                    />
                    <button
                      onClick={() => setActiveImage('facility')}
                      className={`w-3 h-3 rounded-full ${activeImage === 'facility' ? 'bg-white' : 'bg-white opacity-50'} hover:opacity-100`}
                    />
                    <button
                      onClick={() => setActiveImage('location')}
                      className={`w-3 h-3 rounded-full ${activeImage === 'location' ? 'bg-white' : 'bg-white opacity-50'} hover:opacity-100`}
                    />
                  </div>
                </div>
                {/* Tombol tutup modal */}
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                >
                  <HiX className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              {/* Informasi detail kamar */}
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-4">Room {selectedRoom.nomor_kamar} - {selectedRoom.tipe_kamar}</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Room Type</h4>
                    <p className="text-gray-600 capitalize">{selectedRoom.tipe_kamar}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Price per Night</h4>
                    <p className="text-green-600 font-bold">
                      Rp {parseFloat(selectedRoom.harga_per_malam).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>

                {/* Fitur kamar */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-700 mb-2">Room Features</h4>
                  <ul className="list-disc list-inside text-gray-600 grid grid-cols-2 gap-2">
                    {getRoomFeatures(selectedRoom.tipe_kamar).map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>

                {/* Ringkasan pemesanan */}
                {selectedDates.checkin && selectedDates.checkout && (
                  <div className="mb-6 p-4 bg-amber-50 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">Booking Summary</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Check-in:</span>
                        <span>{new Date(selectedDates.checkin).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Check-out:</span>
                        <span>{new Date(selectedDates.checkout).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>Total ({Math.ceil((new Date(selectedDates.checkout) - new Date(selectedDates.checkin)) / (1000 * 60 * 60 * 24))} nights):</span>
                        <span className="text-amber-600">
                          Rp {(parseFloat(selectedRoom.harga_per_malam) * Math.ceil((new Date(selectedDates.checkout) - new Date(selectedDates.checkin)) / (1000 * 60 * 60 * 24))).toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tombol reservasi */}
                {selectedRoom.status_kamar === 'tersedia' && (
                  <button
                    onClick={() => {
                      handleReserveClick(selectedRoom);
                      setShowModal(false);
                    }}
                    className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-medium"
                  >
                    Reserve Now
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal form reservasi */}
        {showReservationForm && selectedRoom && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold mb-4">Make a Reservation</h3>
              <form onSubmit={handleReservationSubmit}>
                {/* Form input reservasi */}
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Room Number</label>
                  <input
                    type="text"
                    value={selectedRoom.nomor_kamar}
                    disabled
                    className="w-full p-2 border rounded bg-gray-100"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Room Type</label>
                  <input
                    type="text"
                    value={selectedRoom.tipe_kamar}
                    disabled
                    className="w-full p-2 border rounded bg-gray-100"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Check-in Date</label>
                  <div className="relative">
                    <DatePicker
                      value={selectedDates.checkin ? dayjs(selectedDates.checkin) : null}
                      onChange={(date) => setSelectedDates(prev => ({
                        ...prev,
                        checkin: date ? date.format('YYYY-MM-DD') : null
                      }))}
                      disabledDate={(current) => {
                        return current && current < dayjs().startOf('day') || isDateBooked(current);
                      }}
                      cellRender={cellRender}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                      format="DD/MM/YYYY"
                      placeholder="Pilih tanggal check-in"
                      popupClassName="custom-datepicker"
                    />
                    <div className="absolute right-0 top-0 h-full flex items-center pr-3">
                      <HiCalendar className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  {/* Legend untuk status tanggal */}
                  <div className="mt-2 flex flex-wrap gap-3 text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-100 mr-1"></div>
                      <span>Tersedia</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-red-100 mr-1"></div>
                      <span>Sudah Dipesan</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-yellow-100 mr-1"></div>
                      <span>Hari Ini</span>
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Check-out Date</label>
                  <div className="relative">
                    <DatePicker
                      value={selectedDates.checkout ? dayjs(selectedDates.checkout) : null}
                      onChange={(date) => setSelectedDates(prev => ({
                        ...prev,
                        checkout: date ? date.format('YYYY-MM-DD') : null
                      }))}
                      disabledDate={(current) => {
                        const checkIn = selectedDates.checkin ? dayjs(selectedDates.checkin) : null;
                        return (
                          current && (
                            current < dayjs().startOf('day') ||
                            (checkIn && current <= checkIn) ||
                            isDateBooked(current)
                          )
                        );
                      }}
                      cellRender={cellRender}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                      format="DD/MM/YYYY"
                      placeholder="Pilih tanggal check-out"
                      popupClassName="custom-datepicker"
                    />
                    <div className="absolute right-0 top-0 h-full flex items-center pr-3">
                      <HiCalendar className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
                {/* Ringkasan pemesanan */}
                {selectedDates.checkin && selectedDates.checkout && (
                  <div className="mb-4 p-4 bg-amber-50 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">Booking Summary</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Check-in:</span>
                        <span>{new Date(selectedDates.checkin).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Check-out:</span>
                        <span>{new Date(selectedDates.checkout).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>Total ({Math.ceil((new Date(selectedDates.checkout) - new Date(selectedDates.checkin)) / (1000 * 60 * 60 * 24))} nights):</span>
                        <span className="text-amber-600">
                          Rp {calculateTotalPrice(
                            selectedDates.checkin,
                            selectedDates.checkout,
                            selectedRoom.harga_per_malam
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                {/* Tombol aksi */}
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowReservationForm(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing || !selectedDates.checkin || !selectedDates.checkout}
                    className="px-4 py-2 bg-green-800 text-white rounded hover:bg-green-900 disabled:opacity-90"
                  >
                    {isProcessing ? 'Processing...' : 'Confirm Reservation'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Error Modal */}
        {errorModal.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-red-600">
                  Reservasi Tidak Tersedia
                </h3>
                <button
                  onClick={closeErrorModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mb-6">
                <p className="text-gray-700">{errorModal.message}</p>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={closeErrorModal}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notifikasi sukses */}
        {showNotification && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-slide-up">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>{notificationMessage}</span>
          </div>
        )}
      </main>

      {/* Footer */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <Footer />
      </div>
    </div>
  );
};

export default UserDashboard;
