import { Routes, Route, Navigate } from 'react-router-dom'
import FormLogin from './component/fragment/auth/FormLogin'
import FormRegister from './component/fragment/auth/FormRegister'
import AdminDashboard from './pages/AdminDashboard'
import UserDashboard from './pages/UserDashboard'
import RiwayatReservasi from './pages/RiwayatReservasi'
import RiwayatPembayaran from './pages/RiwayatPembayaran'
import LandingPage from './pages/LandingPage'
import Error404 from './pages/Error404'
import HotelPreview from './pages/HotelPreview.jsx'
import Rooms from './pages/Rooms'
import RoomDetail from './pages/RoomDetail'
import AboutUs from './pages/AboutUs'
import Profile from './pages/Profile'
import { getAuthToken } from './utils/auth'

// Private Route Component
const PrivateRoute = ({ children }) => {
  const token = getAuthToken();
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gold-50 to-gold-100">
      <Routes>
        {/* Halaman Utama: Landing Page */}
        {/* Route: / */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Halaman Login: Untuk masuk ke akun */}
        {/* Route: /login */}
        <Route path="/login" element={<FormLogin />} />

        {/* Halaman Registrasi: Untuk membuat akun baru */}
        {/* Route: /register */}
        <Route path="/register" element={<FormRegister />} />

        {/* Dasbor Admin: Halaman khusus untuk admin */}
        {/* Route: /admin */}
        <Route path="/admin" element={
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        } />

        {/* Dasbor Pengguna: Halaman utama untuk pengguna biasa */}
        {/* Route: /user */}
        <Route path="/user" element={
          <PrivateRoute>
            <UserDashboard />
          </PrivateRoute>
        } />

        {/* Profile: Halaman profil pengguna */}
        {/* Route: /profile */}
        <Route path="/profile" element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } />

        {/* Riwayat Reservasi: Melihat daftar reservasi yang pernah dibuat */}
        {/* Route: /riwayat-reservasi */}
        <Route path="/riwayat-reservasi" element={
          <PrivateRoute>
            <RiwayatReservasi />
          </PrivateRoute>
        } />

        {/* Riwayat Pembayaran: Melihat daftar pembayaran yang pernah dilakukan */}
        {/* Route: /riwayat-pembayaran */}
        <Route path="/riwayat-pembayaran" element={
          <PrivateRoute>
            <RiwayatPembayaran />
          </PrivateRoute>
        } />

        {/* Hotel Preview: Melihat preview hotel */}
        {/* Route: /hotel-preview */}
        <Route path="/hotel-preview" element={<HotelPreview />} />

        {/* Rooms: Melihat daftar kamar hotel */}
        <Route path="/rooms" element={<Rooms />} />
        
        {/* Room Detail: Melihat detail kamar */}
        <Route path="/rooms/:id" element={<RoomDetail />} />

        {/* About Us: Tentang kami */}
        <Route path="/about" element={<AboutUs />} />

        {/* Error 404: Halaman tidak ditemukan */}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </div>
  )
}

export default App