import React, { useState } from "react";
import logo from "../../assets/logo.jpeg";
import { useNavigate } from "react-router-dom";

const Setup = () => {
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedClubs, setSelectedClubs] = useState([]);
  const [profilePic, setProfilePic] = useState(null);
  const [bio, setBio] = useState("");
  const [ownsBusiness, setOwnsBusiness] = useState();
  const [error, setError] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const courseOptions = [
    "BSc Computer Science",
    "BCom Finance",
    "BA English",
    "B-Tech CSE-SPE-WIP",
    "B-Tech CSE-AI&FT-WIP",
  ];

  const clubOptions = [
    "Aesthetica-(Art)",
    "Resonance-(Music)",
    "ShutterStack-(Photography)",
    "CodeForge-(Coding)",
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1A1A1A] text-white relative px-4 overflow-hidden">
      {/* Logo */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-8 flex items-center">
        <img src={logo} alt="Troop Logo" className="h-14 sm:h-16 md:h-20" />
      </div>

      {/* Heading */}
      <div className="text-center mb-[-20px] sm:mb-8 relative z-20 mt-16 sm:mt-0">
        <h2 className="text-lg sm:text-3xl md:text-4xl font-bold">
          Setup your account
        </h2>
      </div>

      {/* Setup Box */}
      <div className="bg-[#2D2B2B] px-6 sm:px-8 md:px-10 py-6 sm:py-8 md:py-10 rounded-3xl shadow-lg w-full max-w-lg md:max-w-2xl flex flex-col gap-5 overflow-hidden relative z-20 mt-6 sm:mt-0">
        {/* Course */}
        <div className="relative w-full" onMouseLeave={() => setDropdownOpen(false)}>
  {/* Button */}
  <button
    type="button"
    onClick={() => setDropdownOpen((prev) => !prev)}
    className="w-full bg-[#1A1A1A] text-white border border-gray-600 rounded-lg px-4 py-2 flex justify-between items-center focus:ring-2 focus:ring-[#D4852D]"
  >
    {selectedCourse || "Select a course"}
    <svg
      className="w-5 h-5 text-[#D4852D]"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </button>

  {/* Dropdown */}
  {dropdownOpen && (
    <ul className="absolute top-full left-0 z-50 w-full bg-[#2D2B2B] border border-gray-600 rounded-b-lg max-h-60 overflow-auto">
      {courseOptions.map((course, idx) => (
        <li
          key={idx}
          onClick={() => {
            setSelectedCourse(course);
            setDropdownOpen(false);
          }}
          className="px-4 py-2 hover:bg-[#D4852D] hover:text-white cursor-pointer"
        >
          {course}
        </li>
      ))}
    </ul>
  )}
</div>



        {/* Clubs */}
        <div>
          <label className="block font-semibold text-base sm:text-lg mb-2">
            Club/Clubs you are in
          </label>
          <div className="flex flex-col gap-2">
            {clubOptions.map((club, index) => (
              <label
                key={index}
                className="inline-flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  value={club}
                  checked={selectedClubs.includes(club)}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (selectedClubs.includes(value)) {
                      setSelectedClubs(
                        selectedClubs.filter((item) => item !== value)
                      );
                    } else {
                      setSelectedClubs([...selectedClubs, value]);
                    }
                  }}
                  className="h-5 w-5 rounded-md border-gray-500 bg-[#2D2B2B] accent-[#D4852D] focus:ring-[#D4852D]"
                />
                <span className="text-sm sm:text-base">{club}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Profile Pic */}
{/* Profile Pic */}
<div>
  <label className="block font-semibold text-base sm:text-lg mb-2">
    Add your Profile picture
  </label>
  <div className="relative w-20 h-20 sm:w-24 sm:h-24 group">
    {/* Upload area */}
    <label
      htmlFor="profile-upload"
      className={`cursor-pointer w-full h-full rounded-full overflow-hidden border-2 border-[#D4852D] flex items-center justify-center transition-all duration-300 
        ${profilePic ? "" : "bg-orange-500/20 hover:bg-orange-500/40"}`}
    >
      {profilePic ? (
        <img
          src={profilePic}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-white text-xs sm:text-sm">Upload</span>
      )}

      {/* Overlay + Trash */}
      {profilePic && (
        <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            type="button"
            onClick={() => {
              URL.revokeObjectURL(profilePic); // fix 1: revoke old URL
              setProfilePic(null);
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

    {/* Hidden input */}
    <input
      type="file"
      id="profile-upload"
      accept="image/*"
      onChange={(e) => {
        const file = e.target.files[0];
        if (file) {
          // fix 2: revoke previous URL before creating new
          if (profilePic) URL.revokeObjectURL(profilePic);
          setProfilePic(URL.createObjectURL(file));
        }
      }}
      className="hidden"
    />
  </div>
</div>




        {/* Bio */}
        <div>
          <label className="block font-semibold text-base sm:text-lg mb-2">
            Add a short bio
          </label>
          <textarea
            type="text"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="e.g., Passionate about art & code"
            className="bg-[#1A1A1A] text-white border border-gray-600 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-[#D4852D] focus:outline-none"
          />
        </div>

        {/* Business Question */}
        <div>
          <label className="block font-semibold text-base sm:text-lg mb-2">
            Do you own a business or freelance?
          </label>
          <div className="flex gap-4">
            <button
              onClick={() => setOwnsBusiness("yes")}
              className={`px-5 py-2 rounded-full border transition-all ${
                ownsBusiness === "yes"
                  ? "bg-[#D4852D] text-white border-[#D4852D]"
                  : "bg-[#1A1A1A] text-white border-gray-600 hover:border-[#D4852D]"
              }`}
            >
              Yes
            </button>
            <button
              onClick={() => setOwnsBusiness("no")}
              className={`px-5 py-2 rounded-full border transition-all ${
                ownsBusiness === "no"
                  ? "bg-[#D4852D] text-white border-[#D4852D]"
                  : "bg-[#1A1A1A] text-white border-gray-600 hover:border-[#D4852D]"
              }`}
            >
              No
            </button>
          </div>
        </div>

        {/* NEXT Button */}
        <button
          onClick={() => {
            if (!ownsBusiness) {
              setError("Please answer the last question.");
            } else {
              setError("");
              if (ownsBusiness === "yes") {
                navigate("/business-setup");
              } else {
                navigate("/lounge");
              }
            }
          }}
          className="w-full bg-[#D4852D] text-white font-bold py-3 sm:py-4 rounded-lg text-lg sm:text-xl hover:bg-white hover:text-[#D4852D] transition-all duration-300"
        >
          NEXT
        </button>
        {error && (
          <div className="text-[#ffa600] text-center mt-2 text-sm sm:text-base font-semibold">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default Setup;
