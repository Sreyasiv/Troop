import React, { useState, useEffect } from "react";
import logo from "../../assets/logo.jpeg";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";

const Setup = () => {
  const navigate = useNavigate();

  const [selectedCourse, setSelectedCourse] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedClubs, setSelectedClubs] = useState([]);
  const [profilePicFile, setProfilePicFile] = useState(null); // File object
  const [profilePicPreview, setProfilePicPreview] = useState(null); // preview URL
  const [bio, setBio] = useState("");
  const [ownsBusiness, setOwnsBusiness] = useState(""); // "yes" / "no"
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  // create preview and clean up previous URL
  useEffect(() => {
    if (!profilePicFile) {
      setProfilePicPreview(null);
      return;
    }
    const url = URL.createObjectURL(profilePicFile);
    setProfilePicPreview(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [profilePicFile]);

  const toggleClub = (club) => {
    setSelectedClubs((prev) => (prev.includes(club) ? prev.filter((c) => c !== club) : [...prev, club]));
  };

  // delete profile pic helper
  const deleteProfilePic = () => {
    if (profilePicPreview) URL.revokeObjectURL(profilePicPreview);
    setProfilePicFile(null);
    setProfilePicPreview(null);
    // also clear the input element if you want (handled by key change or form reset)
  };

  const handleNext = async () => {
    if (!ownsBusiness) {
      setError("Please answer the last question.");
      return;
    }
    setError("");

    const user = auth.currentUser;
    if (!user) {
      setError("User not authenticated.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("course", selectedCourse);
      formData.append("bio", bio);
      formData.append("ownsBusiness", ownsBusiness === "yes" ? "true" : "false");
      selectedClubs.forEach((club) => formData.append("clubs", club));
      if (profilePicFile) formData.append("profilePic", profilePicFile);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/setup/${user.uid}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to save setup");
      }

      const data = await res.json();
      console.log("Setup saved:", data);

      // If backend hints next route, use it. Else use ownsBusiness flag.
      if (data.next === "business" || ownsBusiness === "yes") {
        navigate("/business-setup", { state: { uid: user.uid } });
      } else {
        navigate("/lounge");
      }
    } catch (err) {
      console.error("Error saving setup:", err);
      setError(err.message || "Failed to save setup. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1A1A1A] text-white relative px-4 overflow-hidden">
      <div className="absolute top-4 left-4 flex items-center">
        <img src={logo} alt="Troop Logo" className="h-14 sm:h-16 md:h-20" />
      </div>

      <div className="text-center mb-[-20px] sm:mb-8 relative z-20 mt-16 sm:mt-0">
        <h2 className="text-lg sm:text-3xl md:text-4xl font-bold">Setup your account</h2>
      </div>

      <div className="bg-[#2D2B2B] px-6 sm:px-8 md:px-10 py-6 sm:py-8 md:py-10 rounded-3xl shadow-lg w-full max-w-lg md:max-w-2xl flex flex-col gap-5 relative z-20 mt-6 sm:mt-0">
        {/* Course Dropdown */}
        <div className="relative w-full" onMouseLeave={() => setDropdownOpen(false)}>
          <button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="w-full bg-[#1A1A1A] text-white border border-gray-600 rounded-lg px-4 py-2 flex justify-between items-center focus:ring-2 focus:ring-[#D4852D]"
          >
            {selectedCourse || "Select a course"}
            <svg className="w-5 h-5 text-[#D4852D]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

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
          <label className="block font-semibold text-base sm:text-lg mb-2">Club/Clubs you are in</label>
          <div className="flex flex-col gap-2">
            {clubOptions.map((club, index) => (
              <label key={index} className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  value={club}
                  checked={selectedClubs.includes(club)}
                  onChange={() => toggleClub(club)}
                  className="h-5 w-5 rounded-md border-gray-500 bg-[#2D2B2B] accent-[#D4852D] focus:ring-[#D4852D]"
                />
                <span className="text-sm sm:text-base">{club}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Profile Pic with delete overlay */}
        <div>
          <label className="block font-semibold text-base sm:text-lg mb-2">Add your Profile picture</label>
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 group">
              <label
                htmlFor="profile-upload"
                className={`cursor-pointer w-full h-full rounded-full overflow-hidden border-2 border-[#D4852D] flex items-center justify-center transition-all duration-300 ${
                  profilePicPreview ? "" : "bg-orange-500/20 hover:bg-orange-500/40"
                }`}
              >
                {profilePicPreview ? (
                  <img src={profilePicPreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white text-xs sm:text-sm">Upload</span>
                )}

                {/* Overlay + Trash */}
                {profilePicPreview && (
                  <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      type="button"
                      onClick={deleteProfilePic}
                      aria-label="Delete profile picture"
                      className="p-2 rounded-full transition-colors bg-transparent hover:bg-white/10"
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
                id="profile-upload"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  // revoke previous preview (cleanup handled by effect but revoke here to be safe)
                  if (profilePicPreview) URL.revokeObjectURL(profilePicPreview);
                  setProfilePicFile(file);
                }}
                className="hidden"
              />
            </div>

            <div className="text-sm text-gray-200">
              {profilePicFile ? (
                <div className="break-all max-w-xs">{profilePicFile.name}</div>
              ) : (
                <div className="text-gray-300">PNG, JPG, GIF - max 5MB</div>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block font-semibold text-base sm:text-lg mb-2">Add a short bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="e.g., Passionate about art & code"
            className="bg-[#1A1A1A] text-white border border-gray-600 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-[#D4852D] focus:outline-none"
          />
        </div>

        {/* Business Question */}
        <div>
          <label className="block font-semibold text-base sm:text-lg mb-2">Do you own a business or freelance?</label>
          <div className="flex gap-4">
            <button
              onClick={() => setOwnsBusiness("yes")}
              className={`px-5 py-2 rounded-full border transition-all ${
                ownsBusiness === "yes" ? "bg-[#D4852D] text-white border-[#D4852D]" : "bg-[#1A1A1A] text-white border-gray-600 hover:border-[#D4852D]"
              }`}
            >
              Yes
            </button>
            <button
              onClick={() => setOwnsBusiness("no")}
              className={`px-5 py-2 rounded-full border transition-all ${
                ownsBusiness === "no" ? "bg-[#D4852D] text-white border-[#D4852D]" : "bg-[#1A1A1A] text-white border-gray-600 hover:border-[#D4852D]"
              }`}
            >
              No
            </button>
          </div>
        </div>

        {/* NEXT Button */}
        <button
          onClick={handleNext}
          disabled={loading}
          className="w-full bg-[#D4852D] text-white font-bold py-3 sm:py-4 rounded-lg text-lg sm:text-xl hover:bg-white hover:text-[#D4852D] transition-all duration-300 disabled:opacity-50"
        >
          {loading ? "Saving..." : "NEXT"}
        </button>

        {error && <div className="text-[#ffa600] text-center mt-2 text-sm sm:text-base font-semibold">{error}</div>}
      </div>
    </div>
  );
};

export default Setup;