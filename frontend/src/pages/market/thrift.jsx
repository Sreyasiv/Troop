import React from "react";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";

import MarketNavBar from "./MarketNavBar";
import AddpostBar from "../../components/SearchBar";
import NavBar from "../../components/NavBar";
import eventBanner from "../../assets/angaadi.jpeg";

const thriftItems = [
  {
    name: "Dell Inspiron Laptop",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop",
    price: "₹20000",
    description: "8GB RAM, 512GB SSD, i5 11th Gen. Good condition.",
    whatsapp: "https://wa.me/xxxxxxxxxxx",
    instagram: "https://instagram.com/sellerprofile",
  },
  {
    name: "Second-hand Bicycle",
    image:
      "https://plus.unsplash.com/premium_photo-1677564626330-d68fabb71930?q=80&w=1335&auto=format&fit=crop",
    price: "₹5000",
    description: "Hero Sprint, barely used, perfect for campus rides.",
    whatsapp: "https://wa.me/xxxxxxxxxxx",
    instagram: "",
  },
];

const Thrift = () => {
  return (
    <>
      {/* Main NavBar */}
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

        {/* Market Navigation (Shops / Explore / Thrift) */}
        <MarketNavBar />

        {/* SearchBar */}
        <AddpostBar />

        

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-[1100px] mt-4">
          {thriftItems.map((item, index) => (
            <div
              key={index}
              className="bg-zinc-900 rounded-2xl shadow-md overflow-hidden transition hover:shadow-lg"
            >
              {/* Image */}
              <div className="relative w-full h-48">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                {/* Price Badge */}
                <span className="absolute top-3 right-3 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  Min: {item.price}
                </span>
              </div>

              {/* Content */}
              <div className="p-4">
                <h2 className="text-lg font-semibold text-white mb-1">
                  {item.name}
                </h2>
                <p className="text-sm text-gray-400 mb-4">{item.description}</p>

                {/* Socials */}
                <div className="flex gap-3">
                  {item.whatsapp && (
                    <a
                      href={item.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-white text-green-600 hover:bg-[#f4a261] hover:text-black transition transform hover:scale-110"
                    >
                      <FaWhatsapp size={18} />
                    </a>
                  )}
                  {item.instagram && (
                    <a
                      href={item.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-white text-pink-600 hover:bg-[#f4a261] hover:text-black transition transform hover:scale-110"
                    >
                      <FaInstagram size={18} />
                    </a>
                  )}
                </div>
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

export default Thrift;
