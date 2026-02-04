// Import library yang dibutuhkan
// React untuk membuat komponen dan mengelola state
// HiPencil, HiTrash, HiPlus untuk ikon
// getAuthToken untuk mengambil token autentikasi
// axios untuk request HTTP
import React, { useState, useEffect } from 'react';
import { HiPencil, HiTrash, HiPlus } from 'react-icons/hi';
import { getAuthToken } from "../utils/auth";
import axios from 'axios';

// Route: /reservasi-management
// Komponen untuk mengelola data reservasi hotel
const ReservasiManagement = () => {
  // State untuk menyimpan data
  const [reservations, setReservations] = useState([]); // Daftar reservasi
  const [filteredReservations, setFilteredReservations] = useState([]); // Daftar reservasi yang difilter
  const [searchQuery, setSearchQuery] = useState({
    username: '',
    nomorKamar: ''
  }); // State untuk pencarian
  const [rooms, setRooms] = useState([]); // Daftar kamar
  const [showModal, setShowModal] = useState(false); // Kontrol tampilan modal
  const [selectedReservation, setSelectedReservation] = useState(null); // Reservasi yang dipilih
  const [formData, setFormData] = useState({
    user_id: '', // ID pengguna yang login
    kamar_id: '', // ID kamar yang dipilih
    tanggal_checkin: '', // Tanggal check in
    tanggal_checkout: '', // Tanggal check out 
    status_reservasi: 'dipesan' // Status reservasi default
  }); // Data form input reservasi
  const [editingReservasi, setEditingReservasi] = useState(null); // Reservasi yang sedang diedit
  const [showEditModal, setShowEditModal] = useState(false); // Kontrol modal edit
  const [selectedStatus, setSelectedStatus] = useState(''); // Status reservasi yang dipilih
  const [userList, setUserList] = useState([]); // Daftar pengguna
  const [kamarList, setKamarList] = useState([]); // Daftar kamar

  // Mengambil data reservasi dan kamar saat komponen dimuat atau pencarian berubah
  useEffect(() => {
    fetchReservations();
    fetchRooms();
    fetchUsers();
    fetchKamar();
  }, []);

  // Fungsi untuk menangani pencarian
  const handleSearch = (username, nomorKamar) => {
    const filtered = reservations.filter(reservation => {
      const matchUsername = username ? 
        (reservation.user?.username || '').toLowerCase().includes(username.toLowerCase()) : 
        true;
      const matchNomorKamar = nomorKamar ? 
        (reservation.kamar?.nomor_kamar || '').toLowerCase().includes(nomorKamar.toLowerCase()) : 
        true;
      return matchUsername && matchNomorKamar;
    });
    setFilteredReservations(filtered);
  };

  // Fungsi untuk mengambil data reservasi dari API
  // Route: GET /api/reservasi
  const fetchReservations = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch('http://localhost:5000/api/reservasi', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        let data = await response.json();
        setReservations(data);
        setFilteredReservations(data);
      }
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  // Fungsi untuk mengambil data kamar dari API
  // Route: GET /api/kamar
  const fetchRooms = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch('http://localhost:5000/api/kamar', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setRooms(data);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  // Fungsi untuk mengambil data pengguna dari API
  const fetchUsers = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch('http://localhost:5000/api/user/dropdown', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUserList(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Fungsi untuk mengambil data kamar dari API
  // Route: GET /api/kamar
  const fetchKamar = async () => {
    try {
      const token = getAuthToken();
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
      console.error('Error fetching kamar:', error);
    }
  };

  // Fungsi untuk menangani submit form reservasi
  // Route: POST /api/reservasi untuk tambah
  // Route: PUT /api/reservasi/:id untuk edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getAuthToken();
      const url = selectedReservation 
        ? `http://localhost:5000/api/reservasi/${selectedReservation.id}`
        : 'http://localhost:5000/api/reservasi';
      
      // Format tanggal ke ISO string
      const formattedData = {
        ...formData,
        tanggal_checkin: new Date(formData.tanggal_checkin).toISOString(),
        tanggal_checkout: new Date(formData.tanggal_checkout).toISOString()
      };
      
      console.log('Sending data:', formattedData); // Debug data yang dikirim
      
      const response = await fetch(url, {
        method: selectedReservation ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formattedData)
      });

      const data = await response.json();
      
      if (response.ok) {
        setShowModal(false);
        setSelectedReservation(null);
        setFormData({
          user_id: '',
          kamar_id: '',
          tanggal_checkin: '',
          tanggal_checkout: '',
          status_reservasi: 'dipesan'
        });
        fetchReservations();
      } else {
        // Tampilkan pesan error dari server
        alert(data.message || 'Terjadi kesalahan saat menyimpan reservasi');
      }
    } catch (error) {
      console.error('Error saving reservation:', error);
      alert('Terjadi kesalahan saat menyimpan reservasi');
    }
  };

  // Fungsi untuk menghapus reservasi
  // Route: DELETE /api/reservasi/:id
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this reservation?')) {
      try {
        const token = getAuthToken();
        const response = await fetch(`http://localhost:5000/api/reservasi/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          fetchReservations();
        }
      } catch (error) {
        console.error('Error deleting reservation:', error);
      }
    }
  };

  // Fungsi untuk menangani klik tombol edit
  const handleEditClick = (reservasi) => {
    setEditingReservasi(reservasi);
    setSelectedStatus(reservasi.status_reservasi);
    setShowEditModal(true);
  };

  // Fungsi untuk mengupdate status reservasi
  // Route: PUT /api/reservasi/:id/status
  const handleStatusUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/reservasi/${editingReservasi.id}/status`,
        { status: selectedStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      fetchReservations(); // Refresh daftar
      setShowEditModal(false);
      setEditingReservasi(null);
      alert('Status reservasi berhasil diupdate');
    } catch (error) {
      console.error('Error updating reservation status:', error);
      alert('Failed to update reservation status');
    }
  };

  // Komponen modal untuk edit status reservasi
  const EditModal = () => (
    <div className={`fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full ${showEditModal ? '' : 'hidden'}`}>
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Update Status Reservasi</h3>
          <div className="mt-2 px-7 py-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500"
            >
              <option value="dipesan">Dipesan</option>
              <option value="dibatalkan">Dibatalkan</option>
              <option value="selesai">Selesai</option>
            </select>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={handleStatusUpdate}
              className="px-4 py-2 bg-amber-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-300"
            >
              Update
            </button>
            <button
              onClick={() => {
                setShowEditModal(false);
                setEditingReservasi(null);
              }}
              className="px-4 py-2 bg-gray-200 text-gray-800 text-base font-medium rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render komponen utama
  return (
    <div className="container mx-auto px-4 py-4">
      {/* Header section */}
      <div className="bg-gradient-to-r from-[#09453E]/10 via-[#09453E]/5 to-[#09453E]/10 p-6 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold text-[#09453E]">Manajemen Reservasi</h2>
            <p className="text-[#09453E]/80 mt-1">Kelola data reservasi hotel</p>
          </div>
          <button
            onClick={() => {
              setSelectedReservation(null);
              setFormData({
                user_id: '',
                kamar_id: '',
                tanggal_checkin: '',
                tanggal_checkout: '',
                status_reservasi: 'dipesan'
              });
              setShowModal(true);
            }}
            className="bg-gradient-to-r from-[#09453E] to-[#0D5E54] text-white px-4 py-2 rounded-lg hover:from-[#0D5E54] hover:to-[#117A6C] transition-all duration-300 shadow-lg flex items-center gap-2"
          >
            <HiPlus className="w-5 h-5" />
            Tambah Reservasi
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="p-4">
        {/* Search bar */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Cari berdasarkan username..."
              value={searchQuery.username}
              onChange={(e) => {
                setSearchQuery(prev => ({...prev, username: e.target.value}));
                handleSearch(e.target.value, searchQuery.nomorKamar);
              }}
              className="px-4 py-2 border border-[#09453E]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09453E]/40"
            />
            <input
              type="text"
              placeholder="Cari berdasarkan nomor kamar..."
              value={searchQuery.nomorKamar}
              onChange={(e) => {
                setSearchQuery(prev => ({...prev, nomorKamar: e.target.value}));
                handleSearch(searchQuery.username, e.target.value);
              }}
              className="px-4 py-2 border border-[#09453E]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09453E]/40"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg">
            <thead className="bg-[#09453E] text-white">
              <tr>
                <th className="py-2 px-4 text-left">ID</th>
                <th className="py-2 px-4 text-left">User</th>
                <th className="py-2 px-4 text-left">Kamar</th>
                <th className="py-2 px-4 text-left">Check In</th>
                <th className="py-2 px-4 text-left">Check Out</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredReservations.map((reservation) => (
                <tr key={reservation.id} className="hover:bg-[#09453E]/5">
                  <td className="py-2 px-4">{reservation.id}</td>
                  <td className="py-2 px-4">{reservation.user?.username || 'N/A'}</td>
                  <td className="py-2 px-4">{reservation.kamar?.nomor_kamar || 'N/A'}</td>
                  <td className="py-2 px-4">
                    {new Date(reservation.tanggal_checkin).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="py-2 px-4">
                    {new Date(reservation.tanggal_checkout).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="py-2 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      reservation.status_reservasi === 'dipesan' ? 'bg-[#09453E]/10 text-[#09453E]' :
                      reservation.status_reservasi === 'selesai' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {reservation.status_reservasi.charAt(0).toUpperCase() + reservation.status_reservasi.slice(1)}
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditClick(reservation)}
                        className="text-[#09453E] hover:text-[#0D5E54] transition-colors duration-200"
                        title="Edit Status"
                      >
                        <HiPencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(reservation.id)}
                        className="text-red-500 hover:text-red-700 transition-colors duration-200"
                        title="Hapus Reservasi"
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

        {/* Modal tambah/edit reservasi */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg w-96">
              <h2 className="text-xl font-semibold mb-4">
                {selectedReservation ? 'Edit Reservasi' : 'Tambah Reservasi'}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">User</label>
                  <select
                    value={formData.user_id}
                    onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#09453E]"
                    required
                  >
                    <option value="">Pilih User</option>
                    {userList.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.username} - {user.email}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Kamar</label>
                  <select
                    value={formData.kamar_id}
                    onChange={(e) => setFormData({ ...formData, kamar_id: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#09453E]"
                    required
                  >
                    <option value="">Pilih Kamar</option>
                    {kamarList.map((kamar) => (
                      <option key={kamar.id} value={kamar.id}>
                        Kamar {kamar.nomor_kamar} - {kamar.tipe_kamar}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Tanggal Check-in</label>
                  <input
                    type="date"
                    value={formData.tanggal_checkin}
                    onChange={(e) => setFormData({ ...formData, tanggal_checkin: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#09453E]"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Tanggal Check-out</label>
                  <input
                    type="date"
                    value={formData.tanggal_checkout}
                    onChange={(e) => setFormData({ ...formData, tanggal_checkout: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#09453E]"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setSelectedReservation(null);
                      setFormData({
                        user_id: '',
                        kamar_id: '',
                        tanggal_checkin: '',
                        tanggal_checkout: '',
                        status_reservasi: 'dipesan'
                      });
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-[#09453E] to-[#0D5E54] text-white px-4 py-2 rounded-lg hover:from-[#0D5E54] hover:to-[#117A6C]"
                  >
                    {selectedReservation ? 'Update' : 'Simpan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {EditModal()}
      </div>
    </div>
  );
};

export default ReservasiManagement;
