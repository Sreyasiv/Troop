import React, { useState } from "react";
import logo from "../../assets/logo.jpeg";
import { useNavigate } from "react-router-dom";

const BusinessSetup = () => {
  const navigate = useNavigate();
  const [logoPic, setLogoPic] = useState(null);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1A1A1A] text-white relative px-4 overflow-hidden">
      {/* Logo */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-8 flex items-center">
        <img src={logo} alt="Troop Logo" className="h-14 sm:h-16 md:h-20" />
      </div>

      {/* Heading */}
      <div className="text-center mb-[5px] sm:mb-10 mt-12 sm:mt-0">
        <h2 className="text-xl sm:text-3xl md:text-4xl font-bold">
          Create Your Business
        </h2>
      </div>

      {/* Business Setup Box */}
      <div className="bg-[#2D2B2B] px-6 sm:px-8 md:px-10 py-6 sm:py-8 md:py-10 rounded-3xl shadow-lg w-full max-w-lg md:max-w-2xl flex flex-col gap-6 relative z-20">
        {/* Business Name */}
        <div>
          <label className="block font-semibold text-base sm:text-lg mb-2">
            Name of your Business <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter your business name"
            className="w-full bg-[#1A1A1A] text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4852D]"
          />
        </div>

        {/* Tagline */}
        <div>
          <label className="block font-semibold text-base sm:text-lg mb-2">
            Add a Tagline
          </label>
          <input
            type="text"
            placeholder="e.g., Creative solutions for you"
            className="w-full bg-[#1A1A1A] text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4852D]"
          />
        </div>

        {/* Logo Upload */}
        <div>
          <label className="block font-semibold text-base sm:text-lg mb-2">
            Upload your Business Logo
          </label>
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 group">
            <label
              htmlFor="logo-upload"
              className={`cursor-pointer w-full h-full rounded-full overflow-hidden border-2 border-[#D4852D] flex items-center justify-center transition-all duration-300 
              ${logoPic ? "" : "bg-orange-500/20 hover:bg-orange-500/40"}`}
            >
              {logoPic ? (
                <img
                  src={logoPic}
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white text-xs sm:text-sm">Upload</span>
              )}

              {/* Overlay + Trash */}
              {logoPic && (
                <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    type="button"
                    onClick={() => {
                      URL.revokeObjectURL(logoPic);
                      setLogoPic(null);
                    }}
                    className="p-2 rounded-full transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="white"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 7h12M9 7V4h6v3m2 0v13a2 2 0 01-2 2H9a2 2 0 01-2-2V7h10z"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </label>
            <input
              type="file"
              id="logo-upload"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  if (logoPic) URL.revokeObjectURL(logoPic);
                  setLogoPic(URL.createObjectURL(file));
                }
              }}
              className="hidden"
            />
          </div>
        </div>

        {/* Whatsapp Business */}
        <div>
          <label className="block font-semibold text-base sm:text-lg mb-2">
            Whatsapp Business
          </label>
          <input
            type="text"
            placeholder="Enter Whatsapp number"
            className="w-full bg-[#1A1A1A] text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4852D]"
          />
        </div>

        {/* Instagram Page */}
        <div>
          <label className="block font-semibold text-base sm:text-lg mb-2">
            Instagram Page Link
          </label>
          <input
            type="text"
            placeholder="https://instagram.com/yourpage"
            className="w-full bg-[#1A1A1A] text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4852D]"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={() => navigate("/lounge")}
          className="w-full bg-[#D4852D] text-white font-bold py-3 sm:py-4 rounded-lg text-lg sm:text-xl hover:bg-white hover:text-[#D4852D] transition-all duration-300"
        >
          SUBMIT
        </button>
      </div>
    </div>
  );
};

export default BusinessSetup;
