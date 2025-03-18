import React from "react";
import logo from "../assets/logo.jpeg";
import plane from "../assets/plane.png";
import { useNavigate } from "react-router-dom";

const SettingUp = () => {
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
        <h2 className="text-5xl font-bold">Setting Up</h2>
      </div>

      {/* Register2 Box */}
      <div className="bg-[#2D2B2B] p-16 rounded-3xl shadow-lg w-full max-w-3xl text-center flex flex-col items-center relative z-20">
        {/* Email */}
        <div className="mb-8 w-full text-left">
          <label className="block font-semibold text-2xl">
            Username <span className="text-red-500">*</span>
          </label>
          <input type="email" className="w-full p-5 rounded-lg bg-[#D9D9D9] text-black border-none focus:outline-none text-2xl" />
        </div>

        {/* Password */}
        <div className="mb-8 w-full text-left">
          <label className="block font-semibold text-2xl">
            Set password <span className="text-red-500">*</span>
          </label>
          <input type="password" className="w-full p-5 rounded-lg bg-[#D9D9D9] text-black border-none focus:outline-none text-2xl" />
        </div>
        {/* Confirm Password */}
        <div className="mb-8 w-full text-left">
          <label className="block font-semibold text-2xl">
            Confirm password <span className="text-red-500">*</span>
          </label>
          <input type="password" className="w-full p-5 rounded-lg bg-[#D9D9D9] text-black border-none focus:outline-none text-2xl" />
        </div>

        {/* Login Button */}
        <button className="w-full bg-[#D4852D] text-white font-bold py-5 rounded-lg text-3xl hover:bg-orange-300 transition-all duration-300">
          LETS GO!
        </button>
        <button onClick={()=>navigate("/register")}
        className=" text-white font-bold py-5 rounded-lg text-2xl transition-all duration-300">

          Back
        </button>

        

      </div>
    </div>
  );
};
export default SettingUp;