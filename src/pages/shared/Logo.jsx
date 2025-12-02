import React from "react";
import { Link } from "react-router";

const Logo = () => {
  return (
    <Link to="/"> 
      <div className="flex items-center space-x-3 cursor-pointer group">
        {/* Icon part with enhanced design */}
        <div className="relative w-12 h-12 bg-linear-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:rotate-3">
          <span className="relative z-10">S</span>
          {/* Glow effect */}
          <div className="absolute inset-0 bg-linear-to-br from-indigo-400 via-purple-400 to-pink-400 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
        </div>
        
        {/* Text part with gradient */}
        <div className="flex flex-col">
          <span className="text-2xl font-extrabold bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            SkillSpace
          </span>
          <span className="text-xs text-gray-500 font-medium tracking-wide">
            Learn & Grow
          </span>
        </div>
      </div>
    </Link>
  );
};

export default Logo;