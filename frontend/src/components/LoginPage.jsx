import React from "react";
import logo from "../assets/logo.jpeg";
import plane from "../assets/plane.png";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1A1A1A] text-white relative px-4">
      {/* Logo */}
      <div className="absolute top-6 left-8 flex items-center">
        <img src={logo} alt="Troop Logo" className="h-24" />
      </div>

      {/* Plane Illustration - Adjusted Position & Size */}
      <div className="absolute -bottom-[220px] right-[20px] z-30 w-[450px] md:w-[650px] lg:w-[850px]">
        <img src={plane} alt="Plane" className="w-full opacity-90" />
      </div>


      {/* Heading */}
      <div className="text-center mb-8 relative z-20">
        <h2 className="text-5xl font-bold">Welcome Back!</h2>
        <p className="text-gray-400 text-xl ">We're so excited to see you again!</p>
      </div>

      {/* Login Box */}
      <div className="bg-[#2D2B2B] p-16 rounded-3xl shadow-lg w-full max-w-3xl text-center flex flex-col items-center relative z-20">
        {/* Email */}
        <div className="mb-8 w-full text-left">
          <label className="block font-semibold text-2xl">
            Email <span className="text-red-500">*</span>
          </label>
          <input type="email" className="w-full p-5 rounded-lg bg-[#D9D9D9] text-black border-none focus:outline-none text-2xl" />
        </div>

        {/* Password */}
        <div className="mb-8 w-full text-left">
          <label className="block font-semibold text-2xl">
            Password <span className="text-red-500">*</span>
          </label>
          <input type="password" className="w-full p-5 rounded-lg bg-[#D9D9D9] text-black border-none focus:outline-none text-2xl" />
        </div>

        {/* Forgot Password */}
        <div className="text-left w-full mb-8">
          <a href="#" className="text-gray-400 text-lg relative pb-1 hover:border-b-2 hover:border-gray-400 transition-all duration-300">
            Forgot your password?
          </a>
        </div>

        {/* Login Button */}
        <button className="w-full bg-[#D4852D] text-white font-bold py-5 rounded-lg text-3xl hover:bg-orange-300 transition-all duration-300">
          LOG IN
        </button>

        <p className="text-gray-400 text-lg mt-6 text-center">
          <button 
            onClick={() => navigate("/register")} 
            className="relative pb-1 hover:border-b-2 hover:border-gray-400 transition-all duration-300"
          >
            Create an account
          </button>
        </p>

      </div>
    </div>
  );
};

export default LoginPage;