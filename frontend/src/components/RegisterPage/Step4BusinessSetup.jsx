// BusinessSetup.jsx
import React, { useState, useEffect } from "react";
import logo from "../../assets/logo.jpeg";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../../firebase";

const BusinessSetup = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [whatsapp, setWhatsapp] = useState("");
  const [instagram, setInstagram] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // where we came from: 'signup' | 'shops' | undefined
  const from = location.state?.from;
  // optional explicit redirect (e.g. "/lounge")
  const redirectTo = location.state?.redirectTo;

  const uidFromState = location.state?.uid;
  const uid = uidFromState || (auth.currentUser && auth.currentUser.uid);

  useEffect(() => {
    if (!logoFile) {
      setLogoPreview(null);
      return;
    }
    const url = URL.createObjectURL(logoFile);
    setLogoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [logoFile]);

  const handleSubmit = async () => {
    if (!uid) {
      setError("User not authenticated.");
      return;
    }
    if (!name.trim()) {
      setError("Business name is required.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      let logoUrl = "";

      if (logoFile) {
        const fd = new FormData();
        fd.append("logo", logoFile);

        const uploadRes = await fetch(
          `${import.meta.env.VITE_API_URL}/api/users/upload-logo/${uid}`,
          {
            method: "POST",
            body: fd,
          }
        );

        if (!uploadRes.ok) {
          const err = await uploadRes.json().catch(() => ({}));
          throw new Error(err.error || "Logo upload failed");
        }

        const uploadData = await uploadRes.json();
        logoUrl = uploadData.url;
      }

      const patchRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/business/${uid}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            tagline,
            logo: logoUrl,
            whatsapp,
            instagram,
          }),
        }
      );

      if (!patchRes.ok) {
        const err = await patchRes.json().catch(() => ({}));
        throw new Error(err.error || "Failed to save business details");
      }

      const data = await patchRes.json();

      // prefer explicit business returned by backend, else build a normalized object
      const returnedBusiness =
        data?.business ??
        data?.user?.business ?? {
          id: data?.business?._id ?? null,
          name,
          tagline,
          logo: logoUrl,
          whatsapp,
          instagram,
          ownerUid: uid,
        };

      // save for signup flow (Shops will read this)
      try {
        sessionStorage.setItem("newBusiness", JSON.stringify(returnedBusiness));
      } catch (e) {
        console.warn("Could not write newBusiness to sessionStorage", e);
      }

      if (from === "signup") {
        // finish signup flow -> lounge (shops will pick up from sessionStorage)
        navigate("/lounge");
        return;
      }

      if (redirectTo) {
        navigate(redirectTo);
        return;
      }

      // default: user came from Shops (+) -> go back to shops with state for instant UI update
      navigate("/shops", { state: { newBusiness: returnedBusiness } });
    } catch (err) {
      console.error("Business setup error:", err);
      setError(err.message || "Failed to save business. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1A1A1A] text-white relative px-4 overflow-hidden">
      <div className="absolute top-4 left-4 sm:top-6 sm:left-8 flex items-center">
        <img src={logo} alt="Troop Logo" className="h-14 sm:h-16 md:h-20" />
      </div>

      <div className="text-center mb-[5px] sm:mb-10 mt-12 sm:mt-0">
        <h2 className="text-xl sm:text-3xl md:text-4xl font-bold">Create Your Business</h2>
      </div>

      <div className="bg-[#2D2B2B] px-6 sm:px-8 md:px-10 py-6 sm:py-8 md:py-10 rounded-3xl shadow-lg w-full max-w-lg md:max-w-2xl flex flex-col gap-6 relative z-20">
        {/* name */}
        <div>
          <label className="block font-semibold text-base sm:text-lg mb-2">
            Name of your Business <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your business name"
            className="w-full bg-[#1A1A1A] text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4852D]"
          />
        </div>

        {/* tagline */}
        <div>
          <label className="block font-semibold text-base sm:text-lg mb-2">
            Add a Tagline
          </label>
          <input
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            placeholder="e.g., Creative solutions for you"
            className="w-full bg-[#1A1A1A] text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4852D]"
          />
        </div>

        {/* logo upload */}
        <div>
          <label className="block font-semibold text-base sm:text-lg mb-2">
            Upload your Business Logo
          </label>
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 group">
            <label
              htmlFor="logo-upload"
              className={`cursor-pointer w-full h-full rounded-full overflow-hidden border-2 border-[#D4852D] flex items-center justify-center transition-all duration-300 
              ${logoPreview ? "" : "bg-orange-500/20 hover:bg-orange-500/40"}`}
            >
              {logoPreview ? (
                <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-xs sm:text-sm">Upload</span>
              )}

              {logoPreview && (
                <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    type="button"
                    onClick={() => {
                      URL.revokeObjectURL(logoPreview);
                      setLogoFile(null);
                      setLogoPreview(null);
                    }}
                    className="p-2 rounded-full transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M9 7V4h6v3m2 0v13a2 2 0 01-2 2H9a2 2 0 01-2-2V7h10z" />
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
                  if (logoPreview) URL.revokeObjectURL(logoPreview);
                  setLogoFile(file);
                }
              }}
              className="hidden"
            />
          </div>
        </div>

        {/* whatsapp */}
        <div>
          <label className="block font-semibold text-base sm:text-lg mb-2">Whatsapp Business</label>
          <input
            type="text"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="Enter Whatsapp number"
            className="w-full bg-[#1A1A1A] text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4852D]"
          />
        </div>

        {/* instagram */}
        <div>
          <label className="block font-semibold text-base sm:text-lg mb-2">Instagram Page Link</label>
          <input
            type="text"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            placeholder="https://instagram.com/yourpage"
            className="w-full bg-[#1A1A1A] text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4852D]"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-[#D4852D] text-white font-bold py-3 sm:py-4 rounded-lg text-lg sm:text-xl hover:bg-white hover:text-[#D4852D] transition-all duration-300 disabled:opacity-50"
        >
          {loading ? "Saving..." : "SUBMIT"}
        </button>

        {error && <div className="text-[#ffa600] text-center mt-2 text-sm sm:text-base font-semibold">{error}</div>}
      </div>
    </div>
  );
};

export default BusinessSetup;
