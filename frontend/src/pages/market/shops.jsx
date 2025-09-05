import React from "react";
import MarketNavBar from "./MarketNavBar";
import AddpostBar from "../../components/SearchBar";
import NavBar from "../../components/NavBar";
import eventBanner from "../../assets/angaadi.jpeg";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";

const shops = [
  {
    name: "The Madras Kadai",
    image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=600&h=400&fit=crop",
    whatsapp: "https://wa.me/xxxxxxxxxxx",
    instagram: "https://instagram.com/themadras",
  },
  {
    name: "Swagat Baker’s",
    image: "https://plus.unsplash.com/premium_photo-1665669263531-cdcbe18e7fe4?q=80&w=2725&auto=format&fit=crop",
    whatsapp: "https://wa.me/xxxxxxxxxxx",
    instagram: "https://instagram.com/swagatbakers",
  },
  {
    name: "Oosi Nool",
    image: "https://images.unsplash.com/photo-1474128670149-7082a8d370ea?q=80&w=1287&auto=format&fit=crop",
    whatsapp: "https://wa.me/xxxxxxxxxxx",
    instagram: "https://instagram.com/oosinool",
  },
];

const Shops = () => {
  return (
    <>
      <NavBar />

      <div className="bg-[#1a1a1a] min-h-screen flex flex-col items-center py-6 px-4 sm:px-6 md:px-12 gap-6">
        {/* Banner Image */}
        <div className="w-full max-w-[2050px] h-[280px] lg:h-[320px] rounded-t-2xl shadow-xl overflow-hidden">
          <img
            src={eventBanner}
            alt="Event Banner"
            className="w-full h-full object-cover"
          />
        </div>

        <MarketNavBar />
        <AddpostBar />

        {/* Shops Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-[1100px] mt-4">
          {shops.map((shop, index) => (
            <div
              key={index}
              className="bg-zinc-900 rounded-2xl shadow-md overflow-hidden group transition-all duration-300 hover:scale-[1.02]"
            >
              {/* Shop Image with Overlay */}
              <div className="relative w-full h-60 overflow-hidden">
                <img
                  src={shop.image}
                  alt={shop.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                <h2 className="absolute bottom-3 left-4 text-lg font-bold text-white tracking-wide">
                  {shop.name}
                </h2>
              </div>

              {/* Socials in Footer */}
              <div className="bg-zinc-800 flex justify-center gap-4 py-3">
                <a
                  href={shop.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-white text-green-600 hover:bg-[#f4a261] hover:text-black transition transform hover:scale-110"
                >
                  <FaWhatsapp size={20} />
                </a>
                <a
                  href={shop.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-white text-pink-600 hover:bg-[#f4a261] hover:text-black transition transform hover:scale-110"
                >
                  <FaInstagram size={20} />
                </a>
              </div>
            </div>
          ))}
        </div>

{/* Floating Add Item Button */}
<button className="fixed bottom-6 right-20 sm:right-6 w-14 h-14 rounded-full bg-[#f4a261] flex items-center justify-center text-black text-2xl font-bold shadow-lg hover:scale-110 transition">
  +
</button>
      </div>
    </>
  );
};

export default Shops;
