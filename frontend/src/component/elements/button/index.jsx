// Komponen Button yang dapat digunakan di seluruh aplikasi
// Rute: frontend/src/component/elements/button/index.jsx

// Mendefinisikan komponen Button dengan properti yang dapat disesuaikan
const Button = ({ type = "button", children, variant = "primary", ...props }) => {
  // Objek yang berisi gaya untuk setiap varian tombol
  const variants = {
    // Tombol utama dengan warna biru
    primary: "bg-[#09453E] hover:bg-[#0D5E54] text-white w-full py-2.5 rounded-lg transition-colors",
    // Tombol sekunder dengan warna abu-abu
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    // Tombol untuk aksi berbahaya dengan warna merah
    danger: "bg-red-600 hover:bg-red-700 text-white",
    // Tombol untuk aksi sukses dengan warna hijau
    success: "bg-green-600 hover:bg-green-700 text-white"
  };

  // Gaya dasar yang diterapkan ke semua tombol
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";

  // Mengembalikan elemen tombol dengan gaya yang sesuai
  return (
    <button
      type={type}
      // Menggabungkan gaya dasar, varian yang dipilih, dan kelas tambahan jika ada
      className={`${baseStyle} ${variants[variant]} ${props.className || ""}`}
      {...props} // Meneruskan properti tambahan ke elemen tombol
    >
      {children} {/* Menampilkan teks atau konten tombol */}
    </button>
  );
};

// Mengekspor komponen Button agar dapat digunakan di file lain
export default Button;
