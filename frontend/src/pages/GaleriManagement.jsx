// Import library yang dibutuhkan
// React untuk membuat komponen
// useState untuk mengelola state
// useEffect untuk efek samping
// HiPlus, HiPencil, HiTrash untuk ikon
import React, { useState, useEffect } from 'react';
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi';

// Route: /galeri-management
// Komponen utama untuk manajemen galeri
const GaleriManagement = () => {
  // State untuk menyimpan data
  const [gambarList, setGambarList] = useState([]); // Menyimpan daftar gambar
  const [showModal, setShowModal] = useState(false); // Mengontrol tampilan modal
  const [selectedGambar, setSelectedGambar] = useState(null); // Menyimpan gambar yang dipilih untuk diedit
  const [formData, setFormData] = useState({
    gambar_preview: null,
    gambar_kamar: null, 
    gambar_fasilitas: null,
    gambar_lokasi: null
  }); // State untuk form input gambar
  const [previewUrls, setPreviewUrls] = useState({
    gambar_preview: '',
    gambar_kamar: '',
    gambar_fasilitas: '',
    gambar_lokasi: ''
  }); // State untuk preview gambar

  // Mengambil data gambar saat komponen dimuat
  useEffect(() => {
    fetchGambar();
  }, []);

  // Mengambil token autentikasi dari localStorage
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // Fungsi untuk mengambil data gambar dari API
  // Route: GET /api/gambar
  const fetchGambar = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/gambar', {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      
      console.log('Raw data from API:', data); // Debug log

      // Transform data untuk memastikan URL lengkap
      const transformedData = data.map(item => {
        const transformed = {
          ...item,
          gambar_preview: `http://localhost:5000/uploads/${item.gambar_preview}`,
          gambar_kamar: `http://localhost:5000/uploads/${item.gambar_kamar}`,
          gambar_fasilitas: `http://localhost:5000/uploads/${item.gambar_fasilitas}`,
          gambar_lokasi: `http://localhost:5000/uploads/${item.gambar_lokasi}`
        };
        console.log('Transformed item:', transformed); // Debug log per item
        return transformed;
      });

      setGambarList(transformedData);
    } catch (error) {
      console.error('Error fetching gambar:', error);
    }
  };

  // Fungsi untuk menangani perubahan file gambar
  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      // Buat URL preview untuk file yang dipilih
      const objectUrl = URL.createObjectURL(file);
      
      setPreviewUrls(prev => ({
        ...prev,
        [field]: objectUrl
      }));
      
      setFormData(prev => ({
        ...prev,
        [field]: file
      }));

      // Cleanup URL saat komponen unmount
      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  // Fungsi untuk mengirim data form ke API
  // Route: POST /api/gambar (tambah)
  // Route: PUT /api/gambar/:id (edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    
    Object.keys(formData).forEach(key => {
      if (formData[key]) {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const url = selectedGambar 
        ? `http://localhost:5000/api/gambar/${selectedGambar.id}`
        : 'http://localhost:5000/api/gambar';
      
      const method = selectedGambar ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        body: formDataToSend,
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to save' }));
        throw new Error(errorData.message || 'Failed to save');
      }

      const responseData = await response.json();
      
      // Transform response data untuk menambahkan base URL
      const transformedData = {
        ...responseData,
        gambar_preview: `http://localhost:5000/uploads/${responseData.gambar_preview}`,
        gambar_kamar: `http://localhost:5000/uploads/${responseData.gambar_kamar}`,
        gambar_fasilitas: `http://localhost:5000/uploads/${responseData.gambar_fasilitas}`,
        gambar_lokasi: `http://localhost:5000/uploads/${responseData.gambar_lokasi}`
      };

      // Update state gambarList
      if (selectedGambar) {
        setGambarList(prevList => 
          prevList.map(item => 
            item.id === selectedGambar.id ? transformedData : item
          )
        );
      } else {
        setGambarList(prevList => [...prevList, transformedData]);
      }

      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving gambar:', error);
      alert(error.message || 'Error saving gambar. Please try again.');
    }
  };

  // Fungsi untuk menghapus gambar
  // Route: DELETE /api/gambar/:id
  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus gambar ini?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/gambar/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`
          }
        });

        if (!response.ok) throw new Error('Failed to delete');
        fetchGambar();
      } catch (error) {
        console.error('Error deleting gambar:', error);
        alert('Error deleting gambar. Please try again.');
      }
    }
  };

  // Fungsi untuk mereset form
  const resetForm = () => {
    setSelectedGambar(null);
    setFormData({
      gambar_preview: null,
      gambar_kamar: null,
      gambar_fasilitas: null,
      gambar_lokasi: null
    });
    setPreviewUrls({
      gambar_preview: '',
      gambar_kamar: '',
      gambar_fasilitas: '',
      gambar_lokasi: ''
    });
  };

  // Fungsi untuk menangani error gambar
  const handleImageError = (e, field) => {
    const imgElement = e.target;
    console.log(`Error loading image for ${field}:`, {
      src: imgElement.src,
      naturalWidth: imgElement.naturalWidth,
      naturalHeight: imgElement.naturalHeight,
      complete: imgElement.complete
    });

    // Coba load ulang dengan path yang benar
    const originalSrc = imgElement.src;
    const fileName = originalSrc.split('/').pop();
    const newSrc = `http://localhost:5000/uploads/${fileName}`;
    
    if (originalSrc !== newSrc) {
      imgElement.src = newSrc;
    } else {
      // Jika masih error, gunakan gambar yang sudah kita tahu ada
      imgElement.src = 'http://localhost:5000/uploads/gambar_kamar-1734447990526-139997565.jpg';
    }
  };

  // Fungsi untuk mengedit gambar
  const handleEdit = (gambar) => {
    setSelectedGambar(gambar);
    // Pastikan URL gambar lengkap
    setPreviewUrls({
      gambar_preview: gambar.gambar_preview.startsWith('http') 
        ? gambar.gambar_preview 
        : `http://localhost:5000/uploads/${gambar.gambar_preview}`,
      gambar_kamar: gambar.gambar_kamar.startsWith('http')
        ? gambar.gambar_kamar
        : `http://localhost:5000/uploads/${gambar.gambar_kamar}`,
      gambar_fasilitas: gambar.gambar_fasilitas.startsWith('http')
        ? gambar.gambar_fasilitas
        : `http://localhost:5000/uploads/${gambar.gambar_fasilitas}`,
      gambar_lokasi: gambar.gambar_lokasi.startsWith('http')
        ? gambar.gambar_lokasi
        : `http://localhost:5000/uploads/${gambar.gambar_lokasi}`
    });
    setShowModal(true);
  };

  // Komponen untuk menampilkan item galeri
  const renderGalleryItem = (gambar) => {
    // Helper function untuk mendapatkan full URL
    const getFullImageUrl = (path) => {
      return path?.startsWith('http') 
        ? path 
        : `http://localhost:5000/uploads/${path}`;
    };

    return (
    <div key={gambar.id} className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative aspect-w-16 aspect-h-9">
        <img
          src={getFullImageUrl(gambar.gambar_preview)}
          alt="Preview"
          className="w-full h-64 object-cover"
          onError={(e) => handleImageError(e, 'gambar_preview')}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-opacity flex items-center justify-center opacity-0 hover:opacity-100">
          <div className="flex space-x-2">
            <button
              onClick={() => handleEdit(gambar)}
              className="p-2 bg-[#09453E] text-white rounded-full hover:bg-[#0D5E54] transition-colors"
            >
              <HiPencil className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleDelete(gambar.id)}
              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <HiTrash className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="aspect-w-16 aspect-h-9">
            <img
              src={getFullImageUrl(gambar.gambar_kamar)}
              alt="Kamar"
              className="w-full h-32 object-cover rounded-lg"
              onError={(e) => handleImageError(e, 'gambar_kamar')}
            />
            <p className="mt-1 text-sm text-[#09453E]/80 text-center">Kamar</p>
          </div>
          <div className="aspect-w-16 aspect-h-9">
            <img
              src={getFullImageUrl(gambar.gambar_fasilitas)}
              alt="Fasilitas"
              className="w-full h-32 object-cover rounded-lg"
              onError={(e) => handleImageError(e, 'gambar_fasilitas')}
            />
            <p className="mt-1 text-sm text-[#09453E]/80 text-center">Fasilitas</p>
          </div>
          <div className="aspect-w-16 aspect-h-9">
            <img
              src={getFullImageUrl(gambar.gambar_lokasi)}
              alt="Lokasi"
              className="w-full h-32 object-cover rounded-lg"
              onError={(e) => handleImageError(e, 'gambar_lokasi')}
            />
            <p className="mt-1 text-sm text-[#09453E]/80 text-center">Lokasi</p>
          </div>
        </div>
        <div className="mt-4 text-right">
          <span className="text-sm text-[#09453E]/60">
            ID: {gambar.id}
          </span>
        </div>
      </div>
    </div>
    );
  };

  // Tambahkan useEffect untuk debugging
  useEffect(() => {
    console.log('Current gambarList:', gambarList);
  }, [gambarList]);

  // Render utama komponen
  return (
    <div className="container mx-auto px-4 py-4">
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#09453E]">Manajemen Galeri</h2>
          <button
            onClick={() => {
              setSelectedGambar(null);
              setShowModal(true);
            }}
            className="bg-gradient-to-r from-[#09453E] to-[#0D5E54] text-white px-4 py-2 rounded-lg hover:from-[#0D5E54] hover:to-[#117A6C] transition-all duration-300 shadow-lg flex items-center gap-2"
          >
            <HiPlus className="w-5 h-5 mr-2" />
            Tambah Gambar
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gambarList.map((gambar) => renderGalleryItem(gambar))}
        </div>

        {/* Modal untuk tambah/edit gambar */}
        {showModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
            <div className="relative bg-white rounded-lg w-full max-w-4xl mx-4 my-8">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-[#09453E]">
                    {selectedGambar ? 'Edit Gambar' : 'Tambah Gambar'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    {/* Preview Section */}
                    <div className="space-y-6">
                      <div className="bg-white p-4 rounded-lg border-2 border-dashed border-amber-300 hover:border-amber-400 transition-colors">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-amber-700">
                            Gambar Preview
                          </label>
                          <div className="relative group">
                            {(previewUrls.gambar_preview || selectedGambar?.gambar_preview) && (
                              <img
                                src={previewUrls.gambar_preview || selectedGambar.gambar_preview}
                                alt="Preview"
                                className="w-full h-48 object-cover rounded-t-lg"
                              />
                            )}
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <label className="cursor-pointer bg-white text-amber-600 px-4 py-2 rounded-lg hover:bg-amber-50">
                                {previewUrls.gambar_preview ? 'Ganti Gambar' : 'Pilih Gambar'}
                                <input
                                  type="file"
                                  onChange={(e) => handleFileChange(e, 'gambar_preview')}
                                  className="hidden"
                                  accept="image/*"
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Gambar Kamar */}
                      <div className="bg-white p-4 rounded-lg border-2 border-dashed border-amber-300 hover:border-amber-400 transition-colors">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-amber-700">
                            Gambar Kamar
                          </label>
                          <div className="relative group">
                            {(previewUrls.gambar_kamar || selectedGambar?.gambar_kamar) && (
                              <img
                                src={previewUrls.gambar_kamar || selectedGambar.gambar_kamar}
                                alt="Kamar"
                                className="w-full h-48 object-cover"
                              />
                            )}
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <label className="cursor-pointer bg-white text-amber-600 px-4 py-2 rounded-lg hover:bg-amber-50">
                                {previewUrls.gambar_kamar ? 'Ganti Gambar' : 'Pilih Gambar'}
                                <input
                                  type="file"
                                  onChange={(e) => handleFileChange(e, 'gambar_kamar')}
                                  className="hidden"
                                  accept="image/*"
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Second Column */}
                    <div className="space-y-6">
                      {/* Gambar Fasilitas */}
                      <div className="bg-white p-4 rounded-lg border-2 border-dashed border-amber-300 hover:border-amber-400 transition-colors">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-amber-700">
                            Gambar Fasilitas
                          </label>
                          <div className="relative group">
                            {(previewUrls.gambar_fasilitas || selectedGambar?.gambar_fasilitas) && (
                              <img
                                src={previewUrls.gambar_fasilitas || selectedGambar.gambar_fasilitas}
                                alt="Fasilitas"
                                className="w-full h-48 object-cover"
                              />
                            )}
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <label className="cursor-pointer bg-white text-amber-600 px-4 py-2 rounded-lg hover:bg-amber-50">
                                {previewUrls.gambar_fasilitas ? 'Ganti Gambar' : 'Pilih Gambar'}
                                <input
                                  type="file"
                                  onChange={(e) => handleFileChange(e, 'gambar_fasilitas')}
                                  className="hidden"
                                  accept="image/*"
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Gambar Lokasi */}
                      <div className="bg-white p-4 rounded-lg border-2 border-dashed border-amber-300 hover:border-amber-400 transition-colors">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-amber-700">
                            Gambar Lokasi
                          </label>
                          <div className="relative group">
                            {(previewUrls.gambar_lokasi || selectedGambar?.gambar_lokasi) && (
                              <img
                                src={previewUrls.gambar_lokasi || selectedGambar.gambar_lokasi}
                                alt="Lokasi"
                                className="w-full h-48 object-cover"
                              />
                            )}
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <label className="cursor-pointer bg-white text-amber-600 px-4 py-2 rounded-lg hover:bg-amber-50">
                                {previewUrls.gambar_lokasi ? 'Ganti Gambar' : 'Pilih Gambar'}
                                <input
                                  type="file"
                                  onChange={(e) => handleFileChange(e, 'gambar_lokasi')}
                                  className="hidden"
                                  accept="image/*"
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        resetForm();
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#09453E] text-white rounded-lg hover:bg-[#0D5E54] transition-colors"
                    >
                      {selectedGambar ? 'Simpan Perubahan' : 'Tambah Gambar'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GaleriManagement;
