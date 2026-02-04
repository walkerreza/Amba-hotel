// Import library yang dibutuhkan
// React untuk membuat komponen dan mengelola state
// HiPlus, HiPencil, HiTrash, HiCheck untuk ikon
// Axios untuk request HTTP
import React, { useState, useEffect } from 'react';
import { HiPlus, HiPencil, HiTrash, HiCheck, HiPrinter, HiDownload } from 'react-icons/hi';
import axios from 'axios';
import { FaCreditCard, FaMoneyBillWave } from 'react-icons/fa';
import { BsBank } from 'react-icons/bs';

// Route: /pembayaran-management
// Komponen untuk mengelola data pembayaran hotel
const PembayaranManagement = ({ searchQuery }) => {
  // State untuk menyimpan data
  const [payments, setPayments] = useState([]); // Daftar pembayaran
  const [reservations, setReservations] = useState([]); // Daftar reservasi
  const [showModal, setShowModal] = useState(false); // Kontrol tampilan modal
  const [selectedPayment, setSelectedPayment] = useState(null); // Pembayaran yang dipilih
  const [formData, setFormData] = useState({
    reservasi_id: '',
    jumlah: '',
    metode_pembayaran: '',
    status_pembayaran: 'pending',
    tanggal_pembayaran: new Date().toISOString().split('T')[0]
  }); // Data form input pembayaran
  const [editingPembayaran, setEditingPembayaran] = useState(null); // Pembayaran yang sedang diedit
  const [showEditModal, setShowEditModal] = useState(false); // Kontrol modal edit
  const [selectedStatus, setSelectedStatus] = useState(''); // Status pembayaran yang dipilih

  // Mengambil data pembayaran dan reservasi saat komponen dimuat
  useEffect(() => {
    fetchPayments();
    fetchReservations();
  }, [searchQuery]);

  // Fungsi untuk mengambil data pembayaran dari API
  // Route: GET /api/pembayaran
  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/pembayaran', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        let data = await response.json();
        console.log('Received payment data:', data); // Debugging
        
        // Filter data jika ada pencarian
        if (searchQuery) {
          data = data.filter(payment => 
            payment.metode_pembayaran.toLowerCase().includes(searchQuery.toLowerCase()) ||
            payment.status_pembayaran.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        setPayments(data);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  // Fungsi untuk mengambil data reservasi dari API
  // Route: GET /api/reservasi  
  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/reservasi', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Filter hanya reservasi yang belum selesai dan belum dibayar
        const activeReservations = data.filter(reservasi => 
          reservasi.status_reservasi !== 'selesai' && 
          (!reservasi.pembayaran || reservasi.pembayaran.status_pembayaran !== 'sukses')
        );
        setReservations(activeReservations);
      }
    } catch (error) {
      console.error('Error fetching reservations:', error);
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

  // Handler untuk perubahan input form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'jumlah') {
      // Format jumlah dengan pemisah ribuan
      const numericValue = value.replace(/[^0-9]/g, '');
      const formattedValue = formatRupiah(numericValue);
      setFormData({ ...formData, [name]: formattedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Fungsi untuk mengirim data pembayaran ke API
  // Route: POST /api/pembayaran (tambah)
  // Route: PUT /api/pembayaran/:id (edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      // Validasi input
      if (!formData.reservasi_id || !formData.jumlah || !formData.metode_pembayaran) {
        alert('Semua field harus diisi ya!');
        return;
      }

      // Format data sebelum dikirim
      const formattedData = {
        reservasi_ids: formData.reservasi_id, // Sesuaikan dengan format yang diharapkan backend
        metode_pembayaran: formData.metode_pembayaran,
        status_pembayaran: formData.status_pembayaran,
        tanggal_pembayaran: formData.tanggal_pembayaran
      };

      console.log('Sending data:', formattedData);

      let response;
      if (selectedPayment) {
        response = await fetch(`http://localhost:5000/api/pembayaran/${selectedPayment.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formattedData)
        });
      } else {
        response = await fetch('http://localhost:5000/api/pembayaran', {
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
        fetchPayments();
        setShowModal(false);
        resetForm();
        alert('Data pembayaran berhasil disimpan!');
      } else {
        alert(data.message || 'Terjadi kesalahan saat menyimpan data pembayaran');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat menyimpan data pembayaran');
    }
  };

  // Reset form ke nilai awal
  const resetForm = () => {
    setFormData({
      reservasi_id: '',
      jumlah: '',
      metode_pembayaran: '',
      status_pembayaran: 'pending',
      tanggal_pembayaran: new Date().toISOString().split('T')[0]
    });
    setSelectedPayment(null);
  };

  // Handler untuk edit pembayaran
  const handleEdit = (payment) => {
    setSelectedPayment(payment);
    setFormData({
      reservasi_id: payment.reservasi_id,
      jumlah: payment.jumlah,
      metode_pembayaran: payment.metode_pembayaran,
      status_pembayaran: payment.status_pembayaran,
      tanggal_pembayaran: new Date(payment.tanggal_pembayaran).toISOString().split('T')[0]
    });
    setShowModal(true);
  };

  // Fungsi untuk menghapus pembayaran
  // Route: DELETE /api/pembayaran/:id
  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pembayaran ini?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/pembayaran/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          fetchPayments();
        }
      } catch (error) {
        console.error('Error deleting payment:', error);
      }
    }
  };

  // Handler untuk klik tombol edit
  const handleEditClick = (pembayaran) => {
    setEditingPembayaran(pembayaran);
    setSelectedStatus(pembayaran.status_pembayaran);
    setShowEditModal(true);
  };

  // Fungsi untuk update status pembayaran
  // Route: PUT /api/pembayaran/:id/status
  const handleStatusUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/pembayaran/${editingPembayaran.id}/status`,
        { status: selectedStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      fetchPayments(); // Refresh data
      setShowEditModal(false);
      setEditingPembayaran(null);
      alert('Status pembayaran berhasil diupdate');
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert('Gagal mengupdate status pembayaran');
    }
  };

  // Fungsi untuk mengubah status pembayaran dan warna badge
  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'sudah bayar':
        return 'bg-green-100 text-green-800';
      case 'belum bayar':
        return 'bg-red-100 text-red-800';
      case 'tunggu':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Komponen modal untuk edit status pembayaran
  const EditModal = () => (
    <div className={`fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full ${showEditModal ? '' : 'hidden'}`}>
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Update Status Pembayaran</h3>
          <div className="mt-2 px-7 py-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500"
            >
              <option value="pending">Tunggu</option>
              <option value="sukses">Sudah Bayar</option>
              <option value="gagal">Belum Bayar</option>
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
                setEditingPembayaran(null);
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

  // Tambahkan fungsi untuk generate dan print bukti pembayaran
  const generateBuktiPembayaran = (payment) => {
    const user = payment.Reservasi?.User;
    const content = `
=================================
        BUKTI PEMBAYARAN         
=================================
ID Pembayaran: ${payment.id}
ID Reservasi : ${payment.reservasi_id}
Pembayar    : ${user ? user.username : 'Data user tidak ditemukan'}
Email       : ${user ? user.email : 'Data email tidak ditemukan'}
Tanggal     : ${new Date(payment.tanggal_pembayaran).toLocaleDateString('id-ID')}
Jumlah      : Rp ${parseFloat(payment.jumlah).toLocaleString('id-ID')}
Metode      : ${payment.metode_pembayaran}
Status      : ${payment.status_pembayaran}
=================================
        TERIMA KASIH             
=================================
  `;
    
    return content;
  };

  const printBuktiPembayaran = (payment) => {
    const content = generateBuktiPembayaran(payment);
    
    // Buat elemen temporary untuk printing
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Bukti Pembayaran</title>
          <style>
            body { font-family: monospace; white-space: pre; }
            @media print {
              body { margin: 0; padding: 20px; }
            }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  // Tambahkan fungsi untuk download bukti pembayaran sebagai txt
  const downloadBuktiPembayaran = (payment) => {
    const content = generateBuktiPembayaran(payment);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bukti_pembayaran_${payment.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Render komponen utama
  return (
    <div className="container mx-auto px-4 py-4">
      <div className="bg-gradient-to-r from-[#09453E]/10 via-[#09453E]/5 to-[#09453E]/10 p-6 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold text-[#09453E]">Manajemen Pembayaran</h2>
            <p className="text-[#09453E]/80 mt-1">Kelola data pembayaran hotel</p>
          </div>
          <button
            onClick={() => {
              setSelectedPayment(null);
              resetForm();
              setShowModal(true);
            }}
            className="bg-gradient-to-r from-[#09453E] to-[#0D5E54] text-white px-4 py-2 rounded-lg hover:from-[#0D5E54] hover:to-[#117A6C] transition-all duration-300 shadow-lg flex items-center gap-2"
          >
            <HiPlus className="w-5 h-5" />
            Tambah Pembayaran
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg">
          <thead className="bg-[#09453E] text-white">
            <tr>
              <th className="py-2 px-4 text-left">ID Reservasi</th>
              <th className="py-2 px-4 text-left">Pembayar</th>
              <th className="py-2 px-4 text-left">Jumlah</th>
              <th className="py-2 px-4 text-left">Metode Pembayaran</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Tanggal</th>
              <th className="py-2 px-4 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-[#09453E]/5">
                <td className="py-2 px-4">{payment.reservasi_id}</td>
                <td className="py-2 px-4">
                  {payment.Reservasi?.User ? (
                    <>
                      <span className="font-medium">
                        {payment.Reservasi.User.username}
                      </span>
                      <span className="text-gray-500 text-sm block">
                        {payment.Reservasi.User.email}
                      </span>
                    </>
                  ) : (
                    <span className="text-red-500">Data user tidak ditemukan</span>
                  )}
                </td>
                <td className="py-2 px-4">Rp {parseFloat(payment.jumlah || 0).toLocaleString('id-ID')}</td>
                <td className="py-2 px-4">
                  <div className="flex items-center">
                    {payment.metode_pembayaran === 'transfer' && <BsBank className="mr-2 text-blue-500" />}
                    {payment.metode_pembayaran === 'cash' && <FaMoneyBillWave className="mr-2 text-green-500" />}
                    {payment.metode_pembayaran === 'kartu kredit' && <FaCreditCard className="mr-2 text-purple-500" />}
                    {payment.metode_pembayaran}
                  </div>
                </td>
                <td className="py-2 px-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(payment.status_pembayaran === 'pending' ? 'Tunggu' :
                    payment.status_pembayaran === 'gagal' ? 'Belum Bayar' :
                    payment.status_pembayaran === 'sukses' ? 'Sudah Bayar' : 
                    payment.status_pembayaran)}`}>
                    {payment.status_pembayaran === 'pending' ? 'Tunggu' :
                     payment.status_pembayaran === 'gagal' ? 'Belum Bayar' :
                     payment.status_pembayaran === 'sukses' ? 'Sudah Bayar' : 
                     payment.status_pembayaran}
                  </span>
                </td>
                <td className="py-2 px-4">{new Date(payment.tanggal_pembayaran).toLocaleDateString('id-ID')}</td>
                <td className="py-2 px-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditClick(payment)}
                      className="text-[#09453E] hover:text-[#0D5E54] transition-colors duration-200"
                      title="Edit Status"
                    >
                      <HiPencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(payment.id)}
                      className="text-red-500 hover:text-red-700 transition-colors duration-200"
                      title="Hapus Pembayaran"
                    >
                      <HiTrash className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => printBuktiPembayaran(payment)}
                      className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                      title="Print Bukti"
                    >
                      <HiPrinter className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => downloadBuktiPembayaran(payment)}
                      className="text-green-500 hover:text-green-700 transition-colors duration-200"
                      title="Download Bukti"
                    >
                      <HiDownload className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-[#09453E]">
                {selectedPayment ? 'Edit Pembayaran' : 'Tambah Pembayaran'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Reservasi ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reservasi
                </label>
                <select
                  name="reservasi_id"
                  value={formData.reservasi_id}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#09453E] focus:ring-[#09453E]"
                  required
                >
                  <option value="">Pilih Reservasi</option>
                  {reservations
                    .filter(reservasi => reservasi.status_reservasi !== 'selesai') // Filter reservasi yang belum selesai
                    .map((reservasi) => (
                      <option key={reservasi.id} value={reservasi.id}>
                        {`${reservasi.user?.username || 'User'} - Kamar ${reservasi.kamar?.nomor_kamar || ''}`}
                      </option>
                    ))}
                </select>
              </div>

              {/* Jumlah Pembayaran */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jumlah Pembayaran
                </label>
                <input
                  type="text"
                  name="jumlah"
                  value={formData.jumlah}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#09453E] focus:ring-[#09453E]"
                  placeholder="Masukkan jumlah pembayaran"
                  required
                />
              </div>

              {/* Metode Pembayaran */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Metode Pembayaran
                </label>
                <select
                  name="metode_pembayaran"
                  value={formData.metode_pembayaran}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#09453E] focus:ring-[#09453E]"
                  required
                >
                  <option value="">Pilih Metode Pembayaran</option>
                  <option value="transfer">
                    <div className="flex items-center">
                      <BsBank className="mr-2" /> Transfer Bank
                    </div>
                  </option>
                  <option value="cash">
                    <div className="flex items-center">
                      <FaMoneyBillWave className="mr-2" /> Cash
                    </div>
                  </option>
                  <option value="kartu kredit">
                    <div className="flex items-center">
                      <FaCreditCard className="mr-2" /> Kartu Kredit
                    </div>
                  </option>
                </select>
              </div>

              {/* Status Pembayaran */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status Pembayaran
                </label>
                <select
                  name="status_pembayaran"
                  value={formData.status_pembayaran}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#09453E] focus:ring-[#09453E]"
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="sukses">Sukses</option>
                  <option value="gagal">Gagal</option>
                </select>
              </div>

              {/* Tombol Submit */}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#09453E] to-[#0D5E54] rounded-md hover:from-[#0D5E54] hover:to-[#117A6C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#09453E]"
                >
                  {selectedPayment ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {EditModal()}
    </div>
  );
};

export default PembayaranManagement;
