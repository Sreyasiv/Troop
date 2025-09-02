// src/components/NavBar.jsx
import React from "react";
import troopLogo from "../assets/logomain.png"; 
import { Link } from "react-router-dom"; 

const NavBar = () => {
  return  (
    <nav className="w-full bg-[#2c2c2c] px-6 py-3 flex items-center justify-between">
     
      <div className="flex items-center">
        <img src={troopLogo} alt="Troop Logo" className="h-12 w-auto object-contain" />
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-6 text-white font-medium text-sm">
      <Link to="/lounge" className="hover:text-[#D4852D]">Lounge</Link>
      <Link to="/events" className="hover:text-[#D4852D]">Events</Link>
      <Link to="/learn" className="hover:text-[#D4852D]">Learn</Link>
      <Link to="/clubs" className="hover:text-[#D4852D]">Clubs</Link>
        <Link to="/market-explore" className="hover:text-[#D4852D]">Market</Link>
        <Link to="/compa" className="hover:text-[#D4852D]">Help</Link>

        <Link to="/profile" className="hover:text-[#D4852D]">Profile</Link>
      </div>

      
    </nav>
  );
};

export default NavBar;

