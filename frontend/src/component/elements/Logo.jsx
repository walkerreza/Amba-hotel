import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({ className = '', size = 'normal' }) => {
  const sizes = {
    small: 'w-8 h-8',
    normal: 'w-10 h-10',
    large: 'w-16 h-16'
  };

  return (
    <Link to="/" className={`flex items-center space-x-3 ${className}`}>
      {/* Logo Icon */}
      <img src="/logo.png" alt="AMBA Hotel" className={`${sizes[size]} object-contain`} />
      
      {/* Logo Text */}
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-[#09453E]">
          AMBA
        </span>
        <span className="text-xs text-[#09453E]/60 tracking-widest -mt-1">
          LUXURY HOTEL
        </span>
      </div>
    </Link>
  );
};

export default Logo;
