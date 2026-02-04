// Import library dan komponen yang diperlukan
import React, { useState, useEffect } from 'react';
import { HiBell, HiLogout } from 'react-icons/hi';
import { useNavigate, Link } from 'react-router-dom';
import * as jwt_decode from 'jwt-decode';

// Komponen Header untuk navigasi dan pencarian
// Route: Digunakan di semua halaman
const Header = () => {
  const navigate = useNavigate();
  // State untuk notifikasi dan user info
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userInfo, setUserInfo] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Effect untuk mengatur query pencarian dan mendapatkan info pengguna dari token
  useEffect(() => {
    // Ambil info pengguna dari token
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token) {
      try {
        const decoded = jwt_decode.jwtDecode(token);
        setUserInfo({
          username: decoded.username,
          role: role,
          photo_url: decoded.photo_url
        });
      } catch (error) {
        console.error('Error saat mendekode token:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
      }
    }
  }, []);

  // Fungsi untuk menangani logout
  const handleLogout = () => {
    // Tampilkan konfirmasi sebelum logout
    const isConfirmed = window.confirm('Apakah kamu yakin ingin keluar dari aplikasi?');
    
    if (isConfirmed) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      setUserInfo(null);
      navigate('/login');
    }
  };

  // Fungsi untuk mendapatkan inisial nama pengguna
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Fungsi untuk mengambil notifikasi dari server
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
        setUnreadCount(data.filter(notification => !notification.read).length);
      }
    } catch (error) {
      console.error('Error saat mengambil notifikasi:', error);
    }
  };

  // Fungsi untuk menampilkan/menyembunyikan panel notifikasi
  const toggleNotificationPanel = () => {
    setShowNotifications(!showNotifications);
  };

  // Fungsi untuk menandai notifikasi sebagai telah dibaca
  const markNotificationAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error saat menandai notifikasi sebagai telah dibaca:', error);
    }
  };

  // Fungsi untuk memformat waktu notifikasi
  const formatNotificationTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / 1000 / 60);
    
    if (diffInMinutes < 1) return 'Baru saja';
    if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} jam yang lalu`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Kemarin';
    if (diffInDays < 7) return `${diffInDays} hari yang lalu`;
    
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Effect untuk mengambil notifikasi secara berkala
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Ambil notifikasi setiap 30 detik
    return () => clearInterval(interval);
  }, []);

  // Render komponen Header
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow-lg z-30">
      <div className="flex items-center justify-between h-full px-4">
        {/* Logo */}
        <div className="flex items-center">
          <img src="/logo.png" alt="Logo" className="h-14 w-auto" />
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-600 relative"
            >
              <HiBell className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-amber-200 z-50">
                <div className="p-3 border-b border-amber-200 bg-gradient-to-r from-amber-50 to-amber-100">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-amber-800">Notifikasi</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => notifications.forEach(notification => markNotificationAsRead(notification.id))}
                        className="text-sm text-amber-600 hover:text-amber-800 transition-colors"
                      >
                        Tandai semua telah dibaca
                      </button>
                    )}
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification, index) => (
                      <div
                        key={index}
                        className={`p-4 border-b border-amber-100 hover:bg-amber-50 transition-colors cursor-pointer ${
                          !notification.read ? 'bg-amber-50' : ''
                        }`}
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`rounded-full p-2 ${
                            notification.type === 'success' ? 'bg-green-100 text-green-600' :
                            notification.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                            notification.type === 'error' ? 'bg-red-100 text-red-600' :
                            'bg-amber-100 text-amber-600'
                          }`}>
                            {notification.type === 'success' && <HiBell className="w-5 h-5" />}
                            {notification.type === 'warning' && <HiBell className="w-5 h-5" />}
                            {notification.type === 'error' && <HiBell className="w-5 h-5" />}
                            {notification.type === 'info' && <HiBell className="w-5 h-5" />}
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm ${!notification.read ? 'font-semibold text-amber-900' : 'text-amber-800'}`}>
                              {notification.message}
                            </p>
                            <p className="text-xs text-amber-500 mt-1">
                              {formatNotificationTime(notification.createdAt)}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-amber-600">
                      Tidak ada notifikasi
                    </div>
                  )}
                </div>
                {notifications.length > 0 && (
                  <div className="p-3 border-t border-amber-200 bg-gradient-to-r from-amber-50 to-amber-100">
                    <button
                      onClick={() => setNotifications([])}
                      className="w-full text-center text-sm text-amber-600 hover:text-amber-800 transition-colors"
                    >
                      Hapus semua notifikasi
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-3 focus:outline-none group"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-r from-emerald-600 to-green-700 flex items-center justify-center shadow-lg border-2 border-emerald-400">
                {userInfo?.photo_url ? (
                  <img 
                    src={userInfo.photo_url}
                    alt={userInfo.username}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      if (e.target) {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        const parent = e.target.parentElement;
                        if (parent) {
                          const initial = document.createElement('span');
                          initial.className = 'text-lg font-medium text-white';
                          initial.textContent = getInitials(userInfo.username);
                          parent.appendChild(initial);
                        }
                      }
                    }}
                  />
                ) : (
                  <span className="text-lg font-medium text-white">
                    {userInfo ? getInitials(userInfo.username) : '?'}
                  </span>
                )}
              </div>
              <span className="text-sm font-medium text-white group-hover:text-emerald-200 transition-colors">
                {userInfo ? userInfo.username : 'Guest'}
              </span>
            </button>

            {/* Profile dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 transition-colors"
                  onClick={() => setShowProfileMenu(false)}
                >
                  Profil Saya
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 transition-colors"
                >
                  Keluar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
