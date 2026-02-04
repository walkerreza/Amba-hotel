// File: frontend/src/utils/auth.js
// Fungsi-fungsi untuk mengelola autentikasi pengguna

// Mengambil token dari penyimpanan lokal browser
// Jika tidak ada, arahkan ke halaman login
// Route: Digunakan di berbagai komponen yang memerlukan autentikasi
export const getAuthToken = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login';
    throw new Error('Anda belum login. Silakan login terlebih dahulu.');
  }
  return token;
};

// Memeriksa apakah pengguna sudah login
// Route: Digunakan untuk mengontrol akses ke halaman tertentu
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Menyimpan token setelah login berhasil
// Route: Biasanya dipanggil di halaman login (/login)
export const setAuthToken = (token) => {
  localStorage.setItem('token', token);
};

// Menghapus token saat logout
// Route: Biasanya dipanggil saat user melakukan logout
export const removeAuthToken = () => {
  localStorage.removeItem('token');
};
