// File: frontend/src/component/fragment/auth/FormLogin.jsx
// Route: /login
// Komponen ini menangani tampilan dan logika untuk halaman login

import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../../elements/button'
import Input from '../../elements/inputs'
import authService from '../../../services/auth.service'
import Logo from '../../elements/logo'
import { HiEye, HiEyeOff } from 'react-icons/hi'
import axios from 'axios'

const FormLogin = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [fadeIn, setFadeIn] = useState(false)
  const [currentBgIndex, setCurrentBgIndex] = useState(0)
  const [showPassword, setShowPassword] = useState(false)

  const backgroundImages = [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920", // Luxury hotel lobby
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1920", // Hotel bedroom
    "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1920",  // Swimming pool
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1920"   // Hotel exterior
  ]

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })

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
  }, [])

  // Fungsi ini dipanggil setiap kali pengguna mengetik di input form
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // Fungsi ini dipanggil saat form login disubmit
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Mencoba login dengan username dan password yang diinput
      const response = await authService.login(formData.username, formData.password)
      // Jika berhasil, arahkan ke halaman yang sesuai (admin atau user)
      if (response.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/user')
      }
    } catch (err) {
      // Jika login gagal, tampilkan pesan error
      setError(err.response?.data?.message || "Login gagal")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', {
        email,
        password
      });

      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('userId', user.id);
      localStorage.setItem('role', user.role);
      
      // ... rest of the code
    } catch (error) {
      // ... error handling
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" 
      style={{ 
        backgroundImage: `url('https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=1474&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
      
      <div className="w-full max-w-[800px] bg-white rounded-2xl shadow-lg flex overflow-hidden relative z-10">
        {/* Form Section */}
        <div className="w-full md:w-1/2 p-8">
          {/* Logo kecil di pojok kiri atas */}
          <div className="absolute top-4 left-4">
            <Logo size="small" />
          </div>

          <div className="mt-12">
            <p className="text-sm text-[#09453E]/70 mb-2">Masuk Akun Anda</p>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Selamat Datang</h2>

            <form 
              onSubmit={handleSubmit} 
              className="space-y-4" 
              method="post"
              autoComplete="on"
            >
              {error && (
                <div className="bg-red-100 text-red-600 p-3 rounded-lg text-sm">
                  {error}
                </div>
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
                  placeholder="Masukkan username"
                />
              </div>

              <div>
                <label htmlFor="current-password" className="block text-sm text-gray-600 mb-1">Password</label>
                <div className="relative">
                  <input
                    id="current-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#09453E]/20 focus:border-[#09453E]"
                    placeholder="Masukkan password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Sedang Masuk..." : "Masuk"}
              </Button>

              <div className="flex items-center justify-between text-sm">
                <Link to="/register" className="text-[#09453E] hover:underline">
                  Daftar Sekarang
                </Link>
            
              </div>
            </form>
          </div>
        </div>

        {/* Image Section */}
        <div className="hidden md:block w-1/2 relative">
          <img
            src="https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80"
            alt="Hotel View"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#09453E]/20"></div>
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <p className="text-sm opacity-80">2024 AMBA Hotel</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormLogin