import NavBar from "../../components/NavBar";
import React, { useState } from "react";
import clubs from "../../assets/clubs.jpeg";
import resonance from "../../assets/resonance.png";
import code from "../../assets/code.png";
import photo from "../../assets/photo.png";
import aesthetica from "../../assets/aesthetica.jpeg";
import thirai from "../../assets/thirai.jpeg";
import SearchBar from "../../components/SearchBar";
import ClubNavBar from "./clubNavbar";

const clubData = [
  { id: "resonance", keywords: "resonance music", img: resonance },
  { id: "aesthetica", keywords: "aesthetica art drawing", img: aesthetica },
  { id: "shutterscape", keywords: "shutterscape photography ", img: photo },
  { id: "codeforge", keywords: "codeforge coding ", img: code },
  { id: "thirai", keywords: "thirai theatre drama", img: thirai },
];

const Clubs = () => {
  const [searchText, setSearchText] = useState("");

  const handleSearch = (text) => {
    setSearchText(text.toLowerCase());
  };

  const filteredClubs = clubData.filter((club) =>
    club.keywords.toLowerCase().includes(searchText)
  );

  return (
    <>
      <NavBar />
      <div className="bg-[#1a1a1a] min-h-screen flex flex-col items-center py-6 px-4 sm:px-6 md:px-12 gap-6">
        {/* Top Banner */}
        <div className="w-full max-w-[2050px] lg:h-[420px] rounded-[12px] shadow-xl overflow-hidden">
          <img src={clubs} alt="Event Banner" className="w-full h-full object-cover" />
        </div>
        <ClubNavBar />
        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} />

        {/* Club Banners */}
        {filteredClubs.map((club) => (
          <div key={club.id} className="w-full max-w-[1284px] lg:h-[194px] rounded-xl shadow-xl overflow-hidden">
            <img src={club.img} alt={club.id} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </>
  );
};

export default Clubs;
