import axios from 'axios';

// Base URL untuk API
const API_URL = 'http://localhost:5000/api';

// Mengambil daftar kamar dari server
// Route: GET /api/kamar
const getKamarList = async () => {
    try {
        // Mengambil data kamar dan reservasi secara paralel
        const [kamarResponse, reservasiResponse] = await Promise.all([
            axios.get(`${API_URL}/kamar`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }),
            axios.get(`${API_URL}/reservasi`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
        ]);

        const kamarList = kamarResponse.data;
        const reservasiList = reservasiResponse.data;

        // Filter reservasi yang aktif
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const activeReservations = reservasiList.filter(res => {
            const checkoutDate = new Date(res.tanggal_checkout);
            return checkoutDate >= today && res.status_reservasi === 'dipesan';
        });

        // Update status kamar berdasarkan reservasi aktif
        const kamarsWithStatus = kamarList.map(kamar => {
            const isBooked = activeReservations.some(res => 
                res.kamar_id === kamar.id && res.status_reservasi === 'dipesan'
            );

            // Mengubah URL gambar menjadi lengkap
            const baseUrl = API_URL.replace('/api', '');
            
            if (kamar.gambar) {
                // Fungsi untuk normalisasi path gambar
                const normalizeImagePath = (path) => {
                    if (!path) return '/room-placeholder.jpg';
                    if (path.startsWith('http')) return path;
                    return `${baseUrl}/${path.replace(/\\/g, '/')}`;
                };

                // Menambahkan URL gambar lengkap dan status ke data kamar
                return {
                    ...kamar,
                    isBooked,
                    status_kamar: isBooked ? 'dipesan' : 'tersedia',
                    previewUrl: normalizeImagePath(kamar.gambar.gambar_preview),
                    roomUrl: normalizeImagePath(kamar.gambar.gambar_kamar),
                    facilityUrl: normalizeImagePath(kamar.gambar.gambar_fasilitas),
                    locationUrl: normalizeImagePath(kamar.gambar.gambar_lokasi)
                };
            }
            
            // Jika tidak ada gambar, gunakan placeholder
            return {
                ...kamar,
                isBooked,
                status_kamar: isBooked ? 'dipesan' : 'tersedia',
                previewUrl: '/room-placeholder.jpg',
                roomUrl: '/room-placeholder.jpg',
                facilityUrl: '/room-placeholder.jpg',
                locationUrl: '/room-placeholder.jpg'
            };
        });

        return kamarsWithStatus;
    } catch (error) {
        console.error('Error fetching rooms:', error);
        throw error;
    }
};

// Mengambil kamar berdasarkan tipe
// Route: GET /api/kamar?tipe_kamar={tipeKamar}
const getKamarByType = async (id) => {
    try {
        const response = await axios.get(`http://localhost:5000/api/kamar/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching room details:', error);
        throw error;
    }
};

// Memeriksa ketersediaan kamar
// Route: GET /api/kamar/{kamarId}/availability?check_in={checkIn}&check_out={checkOut}
const checkKamarAvailability = async (kamarId, checkIn, checkOut) => {
    try {
        const response = await axios.get(`${API_URL}/kamar/${kamarId}/availability`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            params: {
                check_in: checkIn,
                check_out: checkOut
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Mengambil reservasi pengguna
// Route: GET /api/reservasi/user
const getReservasiUser = async () => {
    try {
        const response = await axios.get(`${API_URL}/reservasi/user`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Membuat reservasi baru
// Route: POST /api/reservasi
const createReservasi = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/reservasi`, data, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Mendapatkan fitur kamar berdasarkan tipe
const getRoomFeatures = (tipeKamar) => {
    const features = {
        luxury: [
            'Emperor Size Bed',
            'Smart TV 65" OLED',
            'Premium Mini Bar',
            'Jacuzzi & Bathtub',
            'Ocean View',
            'Private Balcony',
            'Free Breakfast & Dinner',
            'Free WiFi High Speed',
            'Room Service 24/7',
            'Private Butler',
            'Access to Executive Lounge'
        ],
        vip: [
            'King Size Bed',
            'Smart TV 55"',
            'Mini Bar',
            'Bathtub',
            'City View',
            'Private Balcony',
            'Free Breakfast',
            'Free WiFi High Speed',
            'Room Service 24/7',
            'Welcome Drink'
        ],
        premium: [
            'Queen Size Bed',
            'Smart TV 43"',
            'Coffee Maker',
            'Rain Shower',
            'Garden View',
            'Free WiFi',
            'Room Service',
            'Free Breakfast',
            'Welcome Drink'
        ],
        standart: [
            'Twin Bed',
            'TV 32"',
            'Electric Kettle',
            'Shower',
            'Free WiFi',
            'Basic Amenities',
            'Daily Housekeeping',
            'Complimentary Water'
        ]
    };
    
    return features[tipeKamar.toLowerCase()] || [];
};

// Mengambil kamar yang tersedia berdasarkan tanggal
// Route: GET /api/kamar/available/:date
const getAvailableRooms = async (date) => {
    try {
        const response = await axios.get(`${API_URL}/kamar/available/${date}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Mengambil kamar berdasarkan reservasi
// Route: GET /api/kamar/reservasi/{reservasiId}
const getKamarByReservasi = async (reservasiId) => {
    try {
        const response = await axios.get(`${API_URL}/kamar/reservasi/${reservasiId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching room details:', error);
        throw error;
    }
};

// Ekspor fungsi-fungsi untuk digunakan di file lain
export { 
    getKamarList, 
    getKamarByType,
    checkKamarAvailability,
    getReservasiUser,
    createReservasi,
    getRoomFeatures,
    getAvailableRooms,
    getKamarByReservasi
};
