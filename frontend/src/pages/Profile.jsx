import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getProfile, updateProfile, changePassword, uploadPhoto } from '../services/profile.service';
import { HiCamera, HiPencil, HiLockClosed, HiMail, HiUser, HiCalendar, HiArrowLeft } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        username: '',
        email: '',
        role: '',
        created_at: '',
        photo_url: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const data = await getProfile();
            console.log('Profile data:', data); // Untuk debugging
            setProfile({
                username: data.username || '',
                email: data.email || '',
                role: data.role || '',
                created_at: data.created_at || '',
                photo_url: data.photo_url || ''
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
            toast.error(error.message || 'Gagal mengambil data profil');
        } finally {
            setLoading(false);
        }
    };

    const handleProfileChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const updatedData = await updateProfile({
                username: profile.username,
                email: profile.email
            });
            setProfile(prev => ({
                ...prev,
                ...updatedData
            }));
            toast.success('Profil berhasil diperbarui!');
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.message || 'Gagal memperbarui profil');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('Password baru tidak cocok!');
            return;
        }
        try {
            setLoading(true);
            await changePassword({
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword,
            });
            toast.success('Password berhasil diubah!');
            setIsChangingPassword(false);
            setPasswordData({
                oldPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        } catch (error) {
            console.error('Error changing password:', error);
            toast.error(error.message || 'Gagal mengubah password');
        } finally {
            setLoading(false);
        }
    };

    const handlePhotoUpload = async (event) => {
        try {
            const file = event.target.files[0];
            if (!file) return;

            // Validasi ukuran file (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Ukuran file terlalu besar (maksimal 5MB)');
                return;
            }

            // Validasi tipe file
            if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
                toast.error('Format file tidak didukung (gunakan JPG, JPEG, atau PNG)');
                return;
            }

            setLoading(true);
            const result = await uploadPhoto(file);
            
            // Update state profile dengan URL foto baru
            setProfile(prev => ({
                ...prev,
                photo_url: result.photo_url
            }));

            toast.success('Foto profil berhasil diupload');
        } catch (error) {
            console.error('Error uploading photo:', error);
            toast.error(error.message || 'Gagal mengupload foto');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 py-12 px-4 sm:px-6 lg:px-8">
            {/* Tombol Kembali */}
            <motion.button
                onClick={() => navigate(-1)}
                className="mb-6 flex items-center gap-2 px-4 py-2 text-white hover:text-emerald-200 transition-colors"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <HiArrowLeft className="h-5 w-5" />
                <span className="font-serif">Kembali</span>
            </motion.button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto"
            >
                {/* Header Profile */}
                <div className="relative mb-8">
                    <div className="h-48 w-full rounded-xl bg-gradient-to-r from-emerald-800 to-green-900 shadow-2xl"></div>
                    <div className="absolute -bottom-16 left-8">
                        <div className="relative">
                            <div className="h-32 w-32 rounded-full bg-white p-1 shadow-2xl">
                                <div className="h-full w-full rounded-full bg-gradient-to-r from-emerald-600 to-green-700 flex items-center justify-center overflow-hidden">
                                    {profile.photo_url ? (
                                        <img 
                                            src={profile.photo_url}
                                            alt="Profile" 
                                            className="h-full w-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = ''; // Reset src
                                                // Tampilkan inisial sebagai fallback
                                                e.target.style.display = 'none';
                                                e.target.parentElement.innerHTML = `<span class="text-4xl text-white font-serif">${profile.username?.[0]?.toUpperCase() || '?'}</span>`;
                                            }}
                                        />
                                    ) : (
                                        <span className="text-4xl text-white font-serif">
                                            {profile.username?.[0]?.toUpperCase() || '?'}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <label className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/jpeg,image/jpg,image/png"
                                    onChange={handlePhotoUpload}
                                    disabled={loading}
                                />
                                <HiCamera className="h-5 w-5 text-emerald-700" />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Profile Content */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Informasi Profil */}
                    <motion.div 
                        className="md:col-span-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="bg-white/90 backdrop-blur-lg rounded-xl p-8 shadow-2xl border border-emerald-100">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-bold text-emerald-900 font-serif">Informasi Profil</h2>
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-700 text-white rounded-lg hover:from-emerald-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl"
                                    >
                                        <HiPencil className="h-5 w-5" />
                                        <span className="font-serif">Edit</span>
                                    </button>
                                ) : null}
                            </div>

                            <form onSubmit={handleUpdateProfile} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <HiUser className="h-5 w-5 text-emerald-600" />
                                        </div>
                                        <input
                                            type="text"
                                            name="username"
                                            value={profile.username}
                                            onChange={handleProfileChange}
                                            disabled={!isEditing}
                                            className={`block w-full pl-10 pr-3 py-3 border ${isEditing ? 'border-emerald-300' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${!isEditing ? 'bg-gray-50' : 'bg-white'} transition-all font-serif`}
                                            placeholder="Username"
                                        />
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <HiMail className="h-5 w-5 text-emerald-600" />
                                        </div>
                                        <input
                                            type="email"
                                            name="email"
                                            value={profile.email}
                                            onChange={handleProfileChange}
                                            disabled={!isEditing}
                                            className={`block w-full pl-10 pr-3 py-3 border ${isEditing ? 'border-emerald-300' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${!isEditing ? 'bg-gray-50' : 'bg-white'} transition-all font-serif`}
                                            placeholder="Email"
                                        />
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <HiCalendar className="h-5 w-5 text-emerald-600" />
                                        </div>
                                        <input
                                            type="text"
                                            value={new Date(profile.created_at).toLocaleDateString('id-ID', { 
                                                weekday: 'long', 
                                                year: 'numeric', 
                                                month: 'long', 
                                                day: 'numeric' 
                                            })}
                                            disabled
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-gray-50 font-serif"
                                            placeholder="Tanggal Bergabung"
                                        />
                                    </div>
                                </div>

                                {isEditing && (
                                    <div className="flex gap-3">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex-1 bg-gradient-to-r from-emerald-600 to-green-700 text-white py-3 rounded-lg hover:from-emerald-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 font-serif"
                                        >
                                            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-all font-serif"
                                        >
                                            Batal
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>
                    </motion.div>

                    {/* Keamanan */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="bg-white/90 backdrop-blur-lg rounded-xl p-8 shadow-2xl border border-emerald-100">
                            <h2 className="text-2xl font-bold text-emerald-900 mb-8 font-serif">Keamanan</h2>
                            {!isChangingPassword ? (
                                <div className="text-center">
                                    <div className="mb-6">
                                        <div className="w-20 h-20 bg-gradient-to-r from-emerald-600 to-green-700 rounded-full mx-auto flex items-center justify-center shadow-lg">
                                            <HiLockClosed className="h-10 w-10 text-white" />
                                        </div>
                                    </div>
                                    <p className="text-gray-600 mb-8 font-serif">Ingin mengubah password Anda?</p>
                                    <button
                                        onClick={() => setIsChangingPassword(true)}
                                        className="w-full bg-gradient-to-r from-emerald-600 to-green-700 text-white py-3 rounded-lg hover:from-emerald-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl font-serif"
                                    >
                                        Ubah Password
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleChangePassword} className="space-y-4">
                                    <div className="space-y-4">
                                        <input
                                            type="password"
                                            name="oldPassword"
                                            value={passwordData.oldPassword}
                                            onChange={handlePasswordChange}
                                            className="block w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-serif"
                                            placeholder="Password Lama"
                                        />
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            className="block w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-serif"
                                            placeholder="Password Baru"
                                        />
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordChange}
                                            className="block w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-serif"
                                            placeholder="Konfirmasi Password"
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex-1 bg-gradient-to-r from-emerald-600 to-green-700 text-white py-3 rounded-lg hover:from-emerald-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 font-serif"
                                        >
                                            {loading ? 'Menyimpan...' : 'Simpan Password'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsChangingPassword(false);
                                                setPasswordData({
                                                    oldPassword: '',
                                                    newPassword: '',
                                                    confirmPassword: ''
                                                });
                                            }}
                                            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-all font-serif"
                                        >
                                            Batal
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default Profile;
