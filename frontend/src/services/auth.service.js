import axios from 'axios';

// URL dasar untuk API autentikasi
const API_URL = 'http://localhost:5000/api/user';

// Fungsi untuk login pengguna
// Route: POST /api/user/login
const login = async (username, password) => {
  try {
    // Kirim permintaan login ke server
    const response = await axios.post(`${API_URL}/login`, { username, password }, { withCredentials: true });
    
    const { token, role, user } = response.data;
    
    // Simpan informasi pengguna di penyimpanan lokal browser
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('userId', user.id);
    
    return { success: true, role, user };
  } catch (error) {
    throw error; // Lempar error jika login gagal
  }
};

// Fungsi untuk mendaftarkan pengguna baru
// Route: POST /api/user
const register = async (userData) => {
  try {
    // Hapus confirmPassword dari data yang akan dikirim
    const { confirmPassword, ...dataToSend } = userData;
    
    // Kirim permintaan pendaftaran ke server
    const response = await axios.post(API_URL, {
      username: dataToSend.username,
      email: dataToSend.email,
      password: dataToSend.password,
      role: dataToSend.role
    }, { withCredentials: true });
    
    return response.data;
  } catch (error) {
    throw error; // Lempar error jika pendaftaran gagal
  }
};

// Fungsi untuk logout pengguna
const logout = () => {
  // Hapus semua data pengguna dari penyimpanan lokal
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('user');
  localStorage.removeItem('userId');
};

// Fungsi-fungsi pembantu untuk mendapatkan informasi pengguna
const getToken = () => localStorage.getItem('token');
const getRole = () => localStorage.getItem('role');
const getUser = () => localStorage.getItem('user');
const isAuthenticated = () => !!getToken();

// Objek layanan autentikasi yang diekspor
const authService = {
  login,
  register,
  logout,
  getToken,
  getRole,
  getUser,
  isAuthenticated
};

export {
  login,
  register,
  logout,
  getToken,
  getRole,
  getUser,
  isAuthenticated
};

export default authService;
