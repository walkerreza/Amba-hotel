import React, { useState } from 'react';
import { FaMapMarkedAlt, FaStreetView, FaCompass, FaMapPin } from 'react-icons/fa';

const VirtualTour = () => {
  const [activeView, setActiveView] = useState('street');

  const viewData = {
    street: {
      title: "Tampak Depan Hotel",
      description: "Jelajahi area sekitar Hotel AMBA melalui Street View",
      embedUrl: "https://www.google.com/maps/embed?pb=!4v1734269943388!6m8!1m7!1sffjsbTp0Pc5cMz2mbdQs4A!2m2!1d25.04943069747825!2d121.5802151259358!3f110.67512473474812!4f22.24665226303027!5f0.7820865974627469",
      icon: <FaStreetView className="w-6 h-6" />
    },
    aerial: {
      title: "Tampak Atas Hotel",
      description: "Lihat lokasi strategis Hotel AMBA dari udara",
      embedUrl: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d500!2d121.5802151259358!3d25.04943069747825!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442ab5fd6b18c6d%3A0x40f0f0e91f1bf0e1!2sGrand%20Hyatt%20Taipei!5e1!3m2!1sid!2sid!4v1702646486447!5m2!1sid!2sid",
      icon: <FaMapMarkedAlt className="w-6 h-6" />
    }
  };

  return (
    <div className="w-full">
      {/* Header dengan dekorasi */}
      <div className="relative mb-8">
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
          <FaCompass className="text-[#09453D]/20 w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold text-center text-[#09453D] relative">
          Jelajahi Lokasi Kami
          <div className="absolute w-24 h-1 bg-[#09453D] bottom-0 left-1/2 transform -translate-x-1/2 mt-2"></div>
        </h2>
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
          <FaMapPin className="text-[#09453D]/20 w-12 h-12" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Left side: Map with decorative frame */}
        <div className="w-full md:w-2/3">
          <div className="rounded-lg overflow-hidden shadow-lg bg-white p-2 relative">
            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#09453D]"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#09453D]"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#09453D]"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#09453D]"></div>
            
            <iframe
              src={viewData[activeView].embedUrl}
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full rounded-lg"
            />
          </div>
        </div>

        {/* Right side: Controls & Info */}
        <div className="w-full md:w-1/3 space-y-6">
          {/* View Selection with icons */}
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 text-[#09453D] flex items-center gap-2">
              <FaMapMarkedAlt className="w-5 h-5" />
              Pilih Tampilan
            </h3>
            <div className="flex flex-col gap-3">
              {Object.keys(viewData).map((viewType) => (
                <button
                  key={viewType}
                  onClick={() => setActiveView(viewType)}
                  className={`px-4 py-3 rounded-lg w-full text-left flex items-center gap-3 ${
                    activeView === viewType
                      ? 'bg-[#09453D] text-white'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                  } transition-all duration-200 transform hover:scale-[1.02]`}
                >
                  {viewData[viewType].icon}
                  <span className="font-medium">{viewData[viewType].title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Description with styled box */}
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
            <div className="relative">
              <div className="absolute -top-3 -left-3 w-6 h-6 bg-[#09453D]/10 rounded-full"></div>
              <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-[#09453D]/10 rounded-full"></div>
              <h3 className="text-lg font-semibold mb-2 text-[#09453D]">{viewData[activeView].title}</h3>
              <p className="text-gray-600 leading-relaxed">{viewData[activeView].description}</p>
            </div>
          </div>

          {/* Additional Info Box */}
          <div className="bg-[#09453D]/5 p-6 rounded-lg border border-[#09453D]/10">
            <p className="text-sm text-gray-600 italic">
              Gunakan kontrol pada peta untuk menjelajahi area sekitar hotel. 
              Anda dapat menggeser, zoom, dan memutar tampilan untuk pengalaman yang lebih baik.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualTour;
