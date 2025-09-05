import React from "react";
import logo from "../../assets/logo.jpeg";
import plane from "../../assets/plane.png";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#1A1A1A] text-white relative px-4 overflow-hidden">
      {/* Logo */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-8 flex items-center">
        <img src={logo} alt="Troop Logo" className="h-16 sm:h-20 md:h-24" />
      </div>

      {/* Plane Illustration - Responsive */}
      <div
        className="absolute bottom-0 right-0 md:right-[8%] lg:right-[10%] xl:right-[0%] 
                   z-10 w-[75%] sm:w-[65%] md:w-[55%] lg:w-[65%] xl:w-[45%] opacity-90"
      >
        <img
          src={plane}
          alt="Plane"
          className="
            w-full h-auto object-contain object-bottom
            translate-y-[60px] sm:translate-y-[100px] md:translate-y-[140px] lg:translate-y-[190px]
            sm:translate-x-[-20px] md:translate-x-[-40px] lg:translate-x-[-70px]
          "
        />
      </div>

      {/* Heading */}
      <div className="text-center mb-6 sm:mb-8 relative z-20 px-2">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
          Create an account
        </h2>
      </div>

      {/* Register Box */}
      <div className="bg-[#2D2B2B] px-6 sm:px-10 md:px-12 py-8 sm:py-10 md:py-12 rounded-3xl shadow-lg w-full max-w-lg md:max-w-2xl text-center flex flex-col items-center relative z-20">
        {/* Email */}
        <div className="mb-6 w-full text-left">
          <label className="block font-semibold text-lg sm:text-xl md:text-2xl">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            className="w-full p-3 sm:p-4 md:p-5 rounded-lg bg-[#D9D9D9] text-black border-none focus:outline-none text-lg sm:text-xl md:text-2xl"
          />
        </div>

        {/* Register Button */}
        <button
          onClick={() => navigate("/create-account")}
          className="w-full bg-[#D4852D] text-white font-bold py-3 sm:py-4 md:py-5 rounded-lg text-xl sm:text-2xl md:text-3xl hover:bg-white hover:text-[#D4852D] transition-all duration-300"
        >
          NEXT
        </button>

        {/* Create Account Link */}
        <p className="text-gray-400 text-sm sm:text-base md:text-lg mt-6 text-center">
          <button
            onClick={() => navigate("/login")}
            className="relative pb-1 text-gray-400 hover:text-[#D4852D] 
                       after:block after:h-[2px] after:bg-[#D4852D] after:w-0 
                       after:transition-all after:duration-300 hover:after:w-full"
          >
            Already have one?
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
