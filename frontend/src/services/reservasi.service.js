import axios from 'axios';

// URL dasar untuk API reservasi
const API_URL = 'http://localhost:5000/api/reservasi';

// Fungsi untuk membuat reservasi baru
// Route: POST /api/reservasi
export const createReservasi = async (reservasiData) => {
    try {
        const token = localStorage.getItem('token');
        console.log('Data reservasi:', reservasiData);
        console.log('Token yang digunakan:', token);
        
        // Mengirim permintaan POST ke server
        const response = await axios.post(API_URL, reservasiData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('Respon dari server:', response.data);
        return response.data;
    } catch (error) {
        console.error('Gagal membuat reservasi:', error.response || error);
        throw error.response?.data || error.message;
    }
};

// Fungsi untuk mendapatkan reservasi berdasarkan ID pengguna
// Route: GET /api/reservasi/user/:userId
export const getReservasiByUserId = async (userId) => {
    try {
        const token = localStorage.getItem('token');
        // Mengambil data reservasi dari server
        const response = await axios.get(`${API_URL}/user/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Fungsi untuk membatalkan reservasi
// Route: PUT /api/reservasi/:reservasiId/cancel
export const cancelReservasi = async (reservasiId) => {
    try {
        const token = localStorage.getItem('token');
        // Mengirim permintaan pembatalan ke server
        const response = await axios.put(`${API_URL}/${reservasiId}/cancel`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
