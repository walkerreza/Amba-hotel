// File: frontend/src/component/layouts/Sidebar.jsx
// Komponen Sidebar untuk navigasi di aplikasi

import React, { useState, useEffect } from 'react';

// Import ikon-ikon yang diperlukan
import { HiHome, HiPhotograph, HiBriefcase, HiCreditCard, HiDocumentText, HiCog, HiMenu, HiClipboardList, HiCash, HiX } from 'react-icons/hi';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import * as jwt_decode from 'jwt-decode';

// Komponen Sidebar menerima props untuk mengontrol tampilan dan fungsinya
const Sidebar = ({ isOpen, setIsOpen, toggleSidebar, activeMenu, setActiveMenu }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [userRole, setUserRole] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Efek untuk mengambil role pengguna dari local storage saat komponen dimuat
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role) {
      setUserRole(role);
    }

    // Set active menu berdasarkan path saat ini
    const path = location.pathname;
    if (path.includes('riwayat-reservasi')) {
      setActiveMenu('riwayat-reservasi');
    } else if (path.includes('riwayat-pembayaran')) {
      setActiveMenu('riwayat-pembayaran');
    } else if (path.includes('admin')) {
      const params = new URLSearchParams(location.search);
      const menu = params.get('menu');
      if (menu) setActiveMenu(menu);
    } else if (path.includes('user')) {
      setActiveMenu('dashboard');
    }
  }, [location]);

  // Daftar menu untuk admin
  const adminMenuItems = [
    { id: 'dashboard', icon: <HiHome className="w-6 h-6" />, label: 'Dashboard' }, // Route: /admin?menu=dashboard
    { id: 'kamar', icon: <HiBriefcase className="w-6 h-6" />, label: 'Kamar' }, // Route: /admin?menu=kamar
    { id: 'reservasi', icon: <HiDocumentText className="w-6 h-6" />, label: 'Reservasi' }, // Route: /admin?menu=reservasi
    { id: 'pembayaran', icon: <HiCreditCard className="w-6 h-6" />, label: 'Pembayaran' }, // Route: /admin?menu=pembayaran
    { id: 'galeri', icon: <HiPhotograph className="w-6 h-6" />, label: 'Galeri' }, // Route: /admin?menu=galeri
    { id: 'log', icon: <HiCog className="w-6 h-6" />, label: 'Log Aktivitas' }, // Route: /admin?menu=log
  ];

  // Daftar menu untuk pengguna biasa
  const userMenuItems = [
    { id: 'dashboard', icon: <HiHome className="w-6 h-6" />, label: 'Dashboard' }, // Route: /user
    { id: 'riwayat-reservasi', icon: <HiClipboardList className="w-6 h-6" />, label: 'Riwayat Reservasi' }, // Route: /riwayat-reservasi
    { id: 'riwayat-pembayaran', icon: <HiCash className="w-6 h-6" />, label: 'Riwayat Pembayaran' }, // Route: /riwayat-pembayaran
  ];

  // Pilih menu yang sesuai berdasarkan role pengguna
  const menuItems = userRole === 'admin' ? adminMenuItems : userMenuItems;

  // Fungsi untuk menangani klik pada item menu
  const handleMenuClick = (item) => {
    setActiveMenu(item.id);
    localStorage.setItem('activeMenu', item.id);
    
    // Navigasi ke halaman yang sesuai berdasarkan role dan item yang diklik
    if (userRole === 'user') {
      switch (item.id) {
        case 'dashboard':
          navigate('/user');
          break;
        case 'riwayat-reservasi':
          navigate('/riwayat-reservasi');
          break;
        case 'riwayat-pembayaran':
          navigate('/riwayat-pembayaran');
          break;
        default:
          break;
      }
    } else {
      navigate(`/admin?menu=${item.id}`);
    }

    // Tutup sidebar di perangkat mobile setelah navigasi
    if (window.innerWidth < 1024) {
      setIsMobileMenuOpen(false);
    }
  };

  // Fungsi untuk menangani logout
  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('sidebarOpen');
    localStorage.removeItem('activeMenu');
    navigate('/');
    setShowLogoutModal(false);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-20 bg-white shadow-lg transition-all duration-300 ease-in-out pt-16 hidden md:block
          ${isOpen ? 'w-64' : 'w-0 lg:w-20'}`}
      >
        {/* Hapus bagian logo di sini karena sudah ada di header */}
        <div className={`flex items-center justify-end h-16 px-6 border-b border-gray-200`}>
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-gray-100 text-gray-600"
          >
            <HiMenu className="w-6 h-6" />
          </button>
        </div>

        {/* Menu Items */}
        <nav className={`mt-4 px-3 ${!isOpen && 'lg:px-2'}`}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item)}
              className={`w-full flex items-center px-3 py-2 mb-1 rounded-lg transition-colors
                ${activeMenu === item.id 
                  ? 'bg-[#09453E] text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
                }
                ${!isOpen && 'lg:justify-center lg:px-2'}`
              }
            >
              <span className="text-2xl">{item.icon}</span>
              <span className={`ml-3 text-sm font-medium transition-opacity duration-300
                ${!isOpen ? 'opacity-0 hidden lg:hidden' : 'opacity-100'}`}>
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className={`absolute bottom-0 w-full p-4 border-t border-gray-200 ${!isOpen && 'lg:p-2'}`}>
          <button
            onClick={handleLogout}
            className={`flex items-center w-full px-4 py-3 text-gray-600 transition-all duration-200 rounded-lg
              hover:bg-gray-100
              ${!isOpen && 'lg:justify-center lg:px-2'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className={`ml-3 text-sm font-medium whitespace-nowrap transition-all duration-300
              ${!isOpen ? 'opacity-0 w-0' : 'opacity-100'}`}>
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* Mobile Toggle Button */}
      <button 
        className="fixed top-3 left-4 z-50 bg-transparent text-[#09453D] p-2 rounded-lg md:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? (
          <HiX className="h-6 w-6" />
        ) : (
          <HiMenu className="h-6 w-6" />
        )}
      </button>

      {/* Mobile Sidebar */}
      <div 
        className={`md:hidden fixed inset-0 z-40 ${isMobileMenuOpen ? 'block' : 'hidden'}`}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>

        {/* Mobile Sidebar Content */}
        <div 
          className={`absolute left-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-4 h-[60px] border-b border-gray-200">
              <Link to="/" className="flex items-center space-x-2">
                <img src="/logo.png" alt="Logo" className="w-8 h-8" />
                <span className="text-xl font-bold text-[#09453D]">AMBA Hotel</span>
              </Link>
            </div>

            {/* Mobile Menu Items */}
            <nav className="flex-1 overflow-y-auto px-2 py-4">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    handleMenuClick(item);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-2 px-4 py-2 my-1 rounded-lg transition-colors duration-200
                    ${activeMenu === item.id 
                      ? 'bg-[#09453D] text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-80 shadow-xl transform transition-all">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Konfirmasi Logout</h3>
              <button
                onClick={cancelLogout}
                className="text-gray-400 hover:text-gray-500"
              >
                <HiX className="w-5 h-5" />
              </button>
            </div>
            <div className="mb-6">
              <p className="text-gray-600">Yakin mau keluar sekarang?</p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Batal
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Ya, Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;