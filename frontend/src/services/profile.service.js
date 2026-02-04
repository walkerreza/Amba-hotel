import axios from 'axios';
import { getAuthToken } from '../utils/auth';

const API_URL = 'http://localhost:5000/api';

const getProfile = async () => {
    try {
        const token = getAuthToken();
        if (!token) {
            throw new Error('Token tidak ditemukan');
        }

        const response = await axios.get(`${API_URL}/user/profile`, {
            headers: { 
                'Authorization': `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching profile:', error);
        throw new Error(error.response?.data?.message || 'Gagal mengambil data profil');
    }
};

const updateProfile = async (userData) => {
    try {
        const token = getAuthToken();
        if (!token) {
            throw new Error('Token tidak ditemukan');
        }

        const response = await axios.put(`${API_URL}/user/profile`, userData, {
            headers: { 
                'Authorization': `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error updating profile:', error);
        throw new Error(error.response?.data?.message || 'Gagal mengupdate profil');
    }
};

const changePassword = async (passwordData) => {
    try {
        const token = getAuthToken();
        if (!token) {
            throw new Error('Token tidak ditemukan');
        }

        const response = await axios.put(`${API_URL}/user/change-password`, passwordData, {
            headers: { 
                'Authorization': `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error changing password:', error);
        throw new Error(error.response?.data?.message || 'Gagal mengubah password');
    }
};

const uploadPhoto = async (photoFile) => {
    try {
        const token = getAuthToken();
        if (!token) {
            throw new Error('Token tidak ditemukan');
        }

        const formData = new FormData();
        formData.append('photo', photoFile);

        const response = await axios.post(`${API_URL}/user/profile/photo`, formData, {
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error uploading photo:', error);
        throw new Error(error.response?.data?.message || 'Gagal mengupload foto');
    }
};

export {
    getProfile,
    updateProfile,
    changePassword,
    uploadPhoto
};
