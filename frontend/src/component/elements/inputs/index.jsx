// Komponen Input untuk form
// Route: Digunakan di berbagai halaman yang memiliki form, seperti login, registrasi, dll.

const Input = ({ label, type = "text", name, placeholder, error, validation, ...props }) => {
  // Gaya dasar untuk input
  const baseInputStyle = "w-full px-4 py-2 border rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2";
  
  // Gaya untuk input yang sudah divalidasi
  const validationStyle = validation ? "border-green-500 focus:ring-green-200" : "";
  
  // Gaya untuk input dengan error
  const errorStyle = error ? "border-red-500 focus:ring-red-200 animate-shake" : "border-gray-300 focus:ring-blue-200";
  
  // Gaya untuk label
  const labelStyle = "block text-sm font-medium mb-1 transition-colors duration-300";
  
  // Warna label berdasarkan status input
  const labelColor = error ? "text-red-500" : validation ? "text-green-600" : "text-gray-700";

  return (
    <div className="mb-4 relative group">
      {/* Tampilkan label jika ada */}
      {label && (
        <label htmlFor={name} className={`${labelStyle} ${labelColor}`}>
          {label}
        </label>
      )}
      <div className="relative">
        {/* Input field */}
        <input
          type={type}
          name={name}
          id={name}
          className={`${baseInputStyle} ${error ? errorStyle : validationStyle}`}
          placeholder={placeholder}
          {...props}
        />
        {/* Ikon centang jika input valid */}
        {validation && (
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </span>
        )}
      </div>
      {/* Pesan error jika ada */}
      {error && (
        <p className="mt-1 text-sm text-red-500 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
