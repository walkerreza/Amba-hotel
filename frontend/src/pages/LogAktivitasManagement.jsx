// Import library yang dibutuhkan
// React untuk membuat komponen dan mengelola state
// HiTrash untuk ikon sampah/hapus
import React, { useState, useEffect } from 'react';
import { HiTrash } from 'react-icons/hi';

// Route: /log-aktivitas-management
// Komponen untuk menampilkan dan mengelola log aktivitas sistem
const LogAktivitasManagement = () => {
  // State untuk menyimpan data
  const [logList, setLogList] = useState([]); // Daftar log aktivitas
  const [loading, setLoading] = useState(true); // Status loading
  const [error, setError] = useState(null); // Pesan error jika ada

  // Mengambil data log saat komponen dimuat
  useEffect(() => {
    fetchLogs();
  }, []);

  // Fungsi untuk mengambil data log dari API
  // Route: GET /api/log
  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:5000/api/log', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch logs');
      }

      const data = await response.json();
      setLogList(data);
    } catch (error) {
      console.error('Error fetching logs:', error);
      setError(error.message || 'Failed to load logs');
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk menghapus satu log
  // Route: DELETE /api/log/:id
  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus log ini?')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`http://localhost:5000/api/log/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to delete log');
        }

        await fetchLogs();
      } catch (error) {
        console.error('Error deleting log:', error);
        alert(error.message || 'Failed to delete log');
      }
    }
  };

  // Fungsi untuk menghapus semua log
  // Route: DELETE /api/log/clear/all
  const handleClearAll = async () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus semua log?')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch('http://localhost:5000/api/log/clear/all', {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to clear logs');
        }

        await fetchLogs();
      } catch (error) {
        console.error('Error clearing logs:', error);
        alert(error.message || 'Failed to clear logs');
      }
    }
  };

  // Fungsi untuk memformat tanggal ke format Indonesia
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Fungsi untuk menentukan warna background berdasarkan tipe aktivitas
  const getActivityTypeStyle = (type) => {
    switch (type.toLowerCase()) {
      case 'create':
        return 'bg-[#09453E]/10 text-[#09453E]'; // Hijau untuk pembuatan
      case 'update':
        return 'bg-[#0D5E54]/10 text-[#0D5E54]'; // Biru untuk pembaruan
      case 'delete':
        return 'bg-red-100 text-red-800'; // Merah untuk penghapusan
      case 'login':
        return 'bg-[#117A6C]/10 text-[#117A6C]'; // Ungu untuk login
      case 'read':
        return 'bg-[#159785]/10 text-[#159785]'; // Kuning untuk pembacaan
      default:
        return 'bg-gray-100 text-gray-800'; // Abu-abu untuk lainnya
    }
  };

  // Tampilkan loading jika sedang memuat data
  if (loading) return <div className="p-6">Loading...</div>;
  // Tampilkan error jika terjadi kesalahan
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  // Tampilan utama komponen
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#09453E]">Log Aktivitas</h2>
        <button
          onClick={handleClearAll}
          className="px-4 py-2 bg-gradient-to-r from-[#09453E] to-[#0D5E54] text-white rounded-lg hover:from-[#0D5E54] hover:to-[#117A6C] transition-all duration-300 shadow-lg"
        >
          Hapus Semua Log
        </button>
      </div>

      {logList.length === 0 ? (
        <div className="text-center py-8 text-[#09453E]/60">
          Belum ada aktivitas yang tercatat
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#09453E]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Waktu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Tipe
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Deskripsi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logList.map((log) => (
                <tr key={log.id} className="hover:bg-[#09453E]/5">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#09453E]/80">
                    {formatDate(log.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getActivityTypeStyle(log.type)}`}>
                      {log.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#09453E]/80">
                    {log.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#09453E]/80">
                    {log.userId || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDelete(log.id)}
                      className="text-[#09453E] hover:text-[#0D5E54] transition-colors duration-200"
                    >
                      <HiTrash className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LogAktivitasManagement;
