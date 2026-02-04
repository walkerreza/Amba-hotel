// Import library yang dibutuhkan
// React untuk membuat komponen dan mengelola state
// HiPlus, HiPencil, HiTrash untuk ikon
import React, { useState, useEffect } from 'react';
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi';

// Route: /kamar-management
// Komponen untuk mengelola data kamar hotel
const KamarManagement = () => {
  // State untuk menyimpan data
  const [kamarList, setKamarList] = useState([]); // Daftar kamar
  const [showModal, setShowModal] = useState(false); // Kontrol tampilan modal
  const [selectedKamar, setSelectedKamar] = useState(null); // Kamar yang dipilih untuk edit
  const [gambarList, setGambarList] = useState([]); // Daftar gambar
  const [formData, setFormData] = useState({
    nomor_kamar: '',
    tipe_kamar: '',
    harga_per_malam: '',
    status_kamar: 'tersedia',
    gambar_id: ''
  }); // Data form input kamar

  // Mengambil data kamar dan gambar saat komponen dimuat
  useEffect(() => {
    fetchKamarList();
    fetchGambar(); 
  }, []);

  // Fungsi untuk mengambil daftar kamar dari API
  // Route: GET /api/kamar
  const fetchKamarList = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/kamar', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setKamarList(data);
      }
    } catch (error) {
      console.error('Error fetching kamar list:', error);
    }
  };

  // Fungsi untuk mengambil daftar gambar dari API
  // Route: GET /api/gambar
  const fetchGambar = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/gambar', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setGambarList(data);
    } catch (error) {
      console.error('Error fetching gambar:', error);
    }
  };

  // Format harga ke format rupiah
  const formatRupiah = (angka) => {
    const numberFormat = new Intl.NumberFormat('id-ID');
    return numberFormat.format(angka);
  };

  // Parse harga dari format rupiah ke number
  const parseRupiah = (rupiah) => {
    return parseInt(rupiah.replace(/[^0-9]/g, ''));
  };

  // Fungsi untuk menangani submit form tambah/edit kamar
  // Route: POST /api/kamar (tambah) atau PUT /api/kamar/:id (edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      // Validasi input
      if (!formData.nomor_kamar || !formData.tipe_kamar || !formData.harga_per_malam || !formData.status_kamar) {
        alert('Semua field harus diisi ya!');
        return;
      }

      // Format data sebelum dikirim
      const formattedData = {
        ...formData,
        harga_per_malam: parseRupiah(formData.harga_per_malam)
      };

      console.log('Sending data:', formattedData); // Debug data yang dikirim

      let response;
      if (selectedKamar) {
        // Edit kamar yang ada
        response = await fetch(`http://localhost:5000/api/kamar/${selectedKamar.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formattedData)
        });
      } else {
        // Tambah kamar baru
        response = await fetch('http://localhost:5000/api/kamar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formattedData)
        });
      }

      const data = await response.json();

      if (response.ok) {
        fetchKamarList();
        setShowModal(false);
        resetForm();
        alert('Data kamar berhasil disimpan!');
      } else {
        // Tampilkan pesan error dari server
        alert(data.message || 'Terjadi kesalahan saat menyimpan data kamar');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat menyimpan data kamar');
    }
  };

  // Handle input change dengan format harga
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'harga_per_malam') {
      // Format harga dengan pemisah ribuan
      const numericValue = value.replace(/[^0-9]/g, '');
      
      // Validasi maksimal harga
      const MAX_HARGA = 100000000; // 100 juta
      if (parseInt(numericValue) > MAX_HARGA) {
        alert(`Harga per malam tidak boleh lebih dari ${formatRupiah(MAX_HARGA)}`);
        return;
      }
      
      const formattedValue = formatRupiah(numericValue);
      setFormData({ ...formData, [name]: formattedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Fungsi untuk mengisi form dengan data kamar yang akan diedit
  const handleEdit = (kamar) => {
    setSelectedKamar(kamar);
    setFormData({
      nomor_kamar: kamar.nomor_kamar,
      tipe_kamar: kamar.tipe_kamar,
      harga_per_malam: kamar.harga_per_malam,
      status_kamar: kamar.status_kamar,
      gambar_id: kamar.gambar_id
    });
    setShowModal(true);
  };

  // Fungsi untuk menghapus kamar
  // Route: DELETE /api/kamar/:id
  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kamar ini?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/kamar/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          fetchKamarList();
        }
      } catch (error) {
        console.error('Error deleting kamar:', error);
      }
    }
  };

  // Fungsi untuk mereset form ke nilai awal
  const resetForm = () => {
    setFormData({
      nomor_kamar: '',
      tipe_kamar: '',
      harga_per_malam: '',
      status_kamar: 'tersedia',
      gambar_id: ''
    });
    setSelectedKamar(null);
  };

  // Tampilan komponen
  return (
    <div className="container mx-auto px-4 py-4">
      {/* Header section dengan warna baru */}
      <div className="bg-gradient-to-r from-[#09453E]/10 via-[#09453E]/5 to-[#09453E]/10 p-6 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold text-[#09453E]">Manajemen Kamar</h2>
            <p className="text-[#09453E]/80 mt-1">Kelola data kamar hotel</p>
          </div>
          <button
            onClick={() => {
              setSelectedKamar(null);
              setFormData({
                nomor_kamar: '',
                tipe_kamar: '',
                harga_per_malam: '',
                status_kamar: 'tersedia',
                gambar_id: ''
              });
              setShowModal(true);
            }}
            className="bg-gradient-to-r from-[#09453E] to-[#0D5E54] text-white px-4 py-2 rounded-lg hover:from-[#0D5E54] hover:to-[#117A6C] transition-all duration-300 shadow-lg flex items-center gap-2"
          >
            <HiPlus className="w-5 h-5" />
            Tambah Kamar
          </button>
        </div>
      </div>

      {/* Tabel dengan warna baru */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg">
          <thead className="bg-[#09453E] text-white">
            <tr>
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Nomor Kamar</th>
              <th className="py-2 px-4 text-left">Tipe Kamar</th>
              <th className="py-2 px-4 text-left">Harga/Malam</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Preview Gambar</th>
              <th className="py-2 px-4 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {kamarList.map((kamar) => (
              <tr key={kamar.id} className="hover:bg-[#09453E]/5">
                <td className="py-2 px-4">{kamar.id}</td>
                <td className="py-2 px-4">{kamar.nomor_kamar}</td>
                <td className="py-2 px-4">{kamar.tipe_kamar}</td>
                <td className="py-2 px-4">
                  {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR'
                  }).format(kamar.harga_per_malam)}
                </td>
                <td className="py-2 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    kamar.status_kamar === 'tersedia' 
                      ? 'bg-[#09453E]/10 text-[#09453E]' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {kamar.status_kamar}
                  </span>
                </td>
                <td className="py-2 px-4">
                  {kamar.gambar_id && (
                    <img
                      src={`http://localhost:5000/uploads/${gambarList.find(g => g.id === parseInt(kamar.gambar_id))?.gambar_preview}`}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}
                </td>
                <td className="py-2 px-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(kamar)}
                      className="text-[#09453E] hover:text-[#0D5E54] transition-colors"
                    >
                      <HiPencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(kamar.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <HiTrash className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal dengan warna baru */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg w-full max-w-md mx-4">
            <div className="p-6">
              <h3 className="text-lg font-medium text-[#09453E] mb-4">
                {selectedKamar ? 'Edit Kamar' : 'Tambah Kamar'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#09453E]">
                    Nomor Kamar
                  </label>
                  <input
                    type="text"
                    name="nomor_kamar"
                    value={formData.nomor_kamar}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#09453E] focus:ring-[#09453E]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tipe Kamar
                  </label>
                  <select
                    name="tipe_kamar"
                    value={formData.tipe_kamar}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                    required
                  >
                    <option value="">Pilih Tipe Kamar</option>
                    <option value="standart">Standart</option>
                    <option value="premium">Premium</option>
                    <option value="luxury">Luxury</option>
                    <option value="vip">VIP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Harga per Malam
                  </label>
                  <input
                    type="text"
                    name="harga_per_malam"
                    value={formData.harga_per_malam}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status Kamar
                  </label>
                  <select
                    name="status_kamar"
                    value={formData.status_kamar}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                  >
                    <option value="tersedia">Tersedia</option>
                    <option value="dipesan">Dipesan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Gambar
                  </label>
                  <select
                    name="gambar_id"
                    value={formData.gambar_id}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                    required
                  >
                    <option value="">Pilih Gambar</option>
                    {gambarList.map((gambar) => (
                      <option key={gambar.id} value={gambar.id}>
                        ID: {gambar.id} - Preview: {gambar.gambar_preview}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#09453E] text-white rounded-lg hover:bg-[#0D5E54] transition-colors"
                  >
                    {selectedKamar ? 'Simpan Perubahan' : 'Tambah Kamar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KamarManagement;
