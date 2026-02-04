import React from 'react';
import { useNavigate } from 'react-router-dom';

const Error404 = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full text-center">
        {/* Error Code */}
        <h1 className="text-9xl font-bold text-green-800 mb-4">
          4
          <span className="text-green-500 inline-block animate-bounce mx-2">0</span>
          4
        </h1>

        {/* Error Message */}
        <h2 className="text-4xl font-semibold text-green-800 mb-8">
          Oops! Halaman Tidak Ditemukan
        </h2>

        {/* Description */}
        <p className="text-gray-300 text-xl mb-12 max-w-2xl mx-auto">
          Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.
        </p>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-green-800 text-white rounded-full hover:bg-green-700 transition-all duration-300 text-lg font-semibold"
          >
            Kembali ke Beranda
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-3 bg-transparent border-2 border-green-800 text-green-800 rounded-full hover:bg-green-800 hover:text-white transition-all duration-300 text-lg font-semibold"
          >
            Halaman Sebelumnya
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="mt-16 flex justify-center space-x-8">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse delay-150"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse delay-300"></div>
        </div>
      </div>
    </div>
  );
};

export default Error404;
