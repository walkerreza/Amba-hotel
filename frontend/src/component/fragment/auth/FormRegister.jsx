// Komponen FormRegister untuk halaman pendaftaran
// Route: /register

import React, { useState, useEffect, createRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../../elements/button'
import Input from '../../elements/inputs'
import authService from '../../../services/auth.service'
import { HiEye, HiEyeOff } from 'react-icons/hi'
import Logo from '../../elements/logo'
import ReCAPTCHA from "react-google-recaptcha";

const FormRegister = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [fadeIn, setFadeIn] = useState(false)
  const [currentBgIndex, setCurrentBgIndex] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const recaptchaRef = createRef();

  const backgroundImages = [
    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1920",
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1920",
    "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1920",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1920"
  ]

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user' // Peran default untuk pengguna baru
  })

  // Fungsi untuk mengupdate state formData saat input berubah
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleCaptchaChange = (value) => {
    setError("");
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return "Password harus minimal 8 karakter";
    }
    if (!hasUpperCase || !hasLowerCase) {
      return "Password harus mengandung huruf besar dan kecil";
    }
    if (!hasNumbers) {
      return "Password harus mengandung angka";
    }
    if (!hasSpecialChar) {
      return "Password harus mengandung karakter spesial (!@#$%^&*(),.?\":{}|<>)";
    }
    return "";
  };

  // Fungsi untuk menangani proses pendaftaran
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validasi password
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      setIsLoading(false);
      return;
    }

    // Validasi konfirmasi password
    if (formData.password !== formData.confirmPassword) {
      setError("Password dan konfirmasi password tidak sama");
      setIsLoading(false);
      return;
    }

    // Validasi CAPTCHA
    if (!recaptchaRef.current.getValue()) {
      setError("Mohon selesaikan CAPTCHA dulu ya");
      setIsLoading(false);
      return;
    }

    try {
      // Memanggil service untuk mendaftarkan pengguna
      await authService.register(formData)
      // Jika berhasil, arahkan ke halaman login
      navigate('/login')
    } catch (err) {
      console.error('Kesalahan pendaftaran:', err);
      setError(err.response?.data?.message || "Pendaftaran gagal. Silakan coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setFadeIn(true)
    const interval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => 
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      )
    }, 5000) // Ganti gambar setiap 5 detik

    return () => {
      setFadeIn(false)
      clearInterval(interval)
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ 
        backgroundImage: `url('https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1920')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>

      <div className="w-full max-w-[800px] bg-white rounded-2xl shadow-lg flex overflow-hidden relative z-10">
        {/* Image Section - Di sebelah kiri */}
        <div className="hidden md:block w-1/2 relative">
          <img
            src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80"
            alt="Hotel Suite"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#09453E]/20"></div>
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <p className="text-sm opacity-80">2024 AMBA Hotel</p>
          </div>
        </div>

        {/* Form Section - Di sebelah kanan */}
        <div className="w-full md:w-1/2 p-8">
          {/* Logo kecil di pojok kanan atas */}
          <div className="absolute top-4 right-4">
            <Logo size="small" />
          </div>

          <div className="mt-12">
            <p className="text-sm text-[#09453E]/70 mb-2">Daftar Akun bookingnyuk</p>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Daftarkan Akun</h2>

            <form 
              onSubmit={handleSubmit} 
              className="space-y-4" 
              method="post"
              autoComplete="on"
            >
              {error && (
                <p className="text-red-500 text-sm text-center mb-4">{error}</p>
              )}

              <div>
                <label htmlFor="username" className="block text-sm text-gray-600 mb-1">Username</label>
                <input
                  id="username"
                  type="text"
                  name="username"
                  autoComplete="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#09453E]/20 focus:border-[#09453E]"
                  placeholder="Buat username"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm text-gray-600 mb-1">Email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#09453E]/20 focus:border-[#09453E]"
                  placeholder="Masukkan email"
                />
              </div>

              <div>
                <label htmlFor="new-password" className="block text-sm text-gray-600 mb-1">Password</label>
                <div className="relative">
                  <input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#09453E]/20 focus:border-[#09453E]"
                    placeholder="Buat password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                  >
                    {showPassword ? <HiEyeOff className="h-5 w-5 text-gray-500" /> : <HiEye className="h-5 w-5 text-gray-500" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="new-password-confirm" className="block text-sm text-gray-600 mb-1">Konfirmasi Password</label>
                <div className="relative">
                  <input
                    id="new-password-confirm"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#09453E]/20 focus:border-[#09453E]"
                    placeholder="Konfirmasi password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                  >
                    {showConfirmPassword ? <HiEyeOff className="h-5 w-5 text-gray-500" /> : <HiEye className="h-5 w-5 text-gray-500" />}
                  </button>
                </div>
              </div>

              {/* Hidden input untuk role */}
              <input 
                type="hidden" 
                name="role" 
                value="user"
              />

              {/* Google reCAPTCHA Checkbox */}
              <div className="mb-4 flex justify-center">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey="6LdVeJsqAAAAAAHvAcY5FwBCKchrkJV6bSADV0bk"
                  onChange={handleCaptchaChange}
                  theme="light"
                  size="normal"
                  className="transform scale-90 sm:scale-100"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                disabled={isLoading}
              >
                {isLoading ? "Membuat Akun..." : "Daftar"}
              </Button>

              <div className="text-center text-sm">
                <span className="text-gray-600">Sudah punya akun? </span>
                <Link to="/login" className="text-[#09453E] hover:underline font-medium">
                  Masuk di sini
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormRegister