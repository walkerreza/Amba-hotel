import axios from 'axios';

// URL dasar untuk API pembayaran
const API_URL = 'http://localhost:5000/api/pembayaran';

// Fungsi untuk membuat pembayaran baru
// Route: POST /api/pembayaran
export const createPembayaran = async (pembayaranData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(API_URL, pembayaranData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data; // Mengembalikan data pembayaran yang berhasil dibuat
    } catch (error) {
        throw error.response?.data || error.message; // Melempar pesan error jika gagal
    }
};

// Fungsi untuk mendapatkan pembayaran berdasarkan ID reservasi
// Route: GET /api/pembayaran/reservasi/:reservasiId
export const getPembayaranByReservasiId = async (reservasiId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/reservasi/${reservasiId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data; // Mengembalikan data pembayaran untuk reservasi tertentu
    } catch (error) {
        throw error.response?.data || error.message; // Melempar pesan error jika gagal
    }
};

// Fungsi untuk memperbarui status pembayaran
// Route: PUT /api/pembayaran/:pembayaranId/status
export const updatePembayaranStatus = async (pembayaranId, status) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`${API_URL}/${pembayaranId}/status`, { status }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data; // Mengembalikan data pembayaran yang statusnya telah diperbarui
    } catch (error) {
        throw error.response?.data || error.message; // Melempar pesan error jika gagal
    }
};
