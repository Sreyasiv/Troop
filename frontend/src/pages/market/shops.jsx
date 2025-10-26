// Shops.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MarketNavBar from "./MarketNavBar";
import AddpostBar from "../../components/SearchBar";
import NavBar from "../../components/NavBar";
import eventBanner from "../../assets/angaadi.jpeg";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import { auth } from "../../firebase"; // adjust this path if needed

const normalizeName = (n) => (typeof n === "string" ? n.trim().toLowerCase() : "");

const Shops = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // dedupe helper: prefer ownerUid, then id, then normalized name
  const dedupeShops = (arr) => {
    const map = new Map();
    for (const s of arr) {
      const key = s.ownerUid ?? s.id ?? normalizeName(s.name) ?? JSON.stringify(s);
      if (!map.has(key)) map.set(key, s);
    }
    return Array.from(map.values());
  };

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        const base = import.meta?.env?.VITE_API_URL ?? "";
        const headers = {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        };

        // derive uid from possible sources
        const uidFromState = location.state?.uid ?? null;
        const uidFromAuth =
          auth && auth.currentUser && auth.currentUser.uid
            ? auth.currentUser.uid
            : null;
        const uidFromStorage =
          typeof window !== "undefined" ? localStorage.getItem("uid") : null;
        const uid = uidFromState || uidFromAuth || uidFromStorage || null;

        const bizUrl = base + "/api/users/businesses";

        let pRes = null,
          bRes = null,
          pData = null,
          bData = null;

        if (uid) {
          const profileUrl = `${base}/api/users/profile?uid=${encodeURIComponent(
            uid
          )}`;
          [pRes, bRes] = await Promise.all([
            fetch(profileUrl, { method: "GET", headers, cache: "no-store" }),
            fetch(bizUrl, { method: "GET", headers, cache: "no-store" }),
          ]);
          pData = await pRes.json().catch(() => null);
          bData = await bRes.json().catch(() => null);
        } else {
          bRes = await fetch(bizUrl, {
            method: "GET",
            headers,
            cache: "no-store",
          });
          bData = await bRes.json().catch(() => null);
        }

        if (!mounted) return;

        // set user if profile returned
        if (pRes && pRes.ok) {
          setUser(pData?.user ?? null);
        } else {
          setUser(null);
        }

        const serverBusinesses = (bData && bData.businesses) || [];

        // Normalize server cards
        const serverCards = serverBusinesses.map((b) => ({
          id: b.id ?? null,
          ownerUid: b.ownerUid ?? null,
          name: b.name || "Unnamed Business",
          tagline: b.tagline || "",
          image:
            b.image ||
            "https://via.placeholder.com/600x400?text=Business+Logo",
          whatsapp: b.whatsapp || "#",
          instagram: b.instagram || "#",
          isMine: uid ? (b.ownerUid ?? b.id) === uid : false,
        }));

        // If profile returned a business, normalize it
        let userBusinessCard = null;
        const profileBusiness =
          pData?.business ?? pData?.user?.business ?? null;
        if (profileBusiness) {
          const ownerIdFromProfile =
            profileBusiness.ownerUid ??
            pData?.user?.uid ??
            pData?.user?._id ??
            null;
          userBusinessCard = {
            id: profileBusiness.id ?? profileBusiness._id ?? ownerIdFromProfile ?? null,
            ownerUid: ownerIdFromProfile,
            name: profileBusiness.name ?? "My Business",
            tagline: profileBusiness.tagline || "",
            image:
              profileBusiness.logo && profileBusiness.logo.length > 0
                ? profileBusiness.logo
                : "https://via.placeholder.com/600x400?text=Business+Logo",
            whatsapp: profileBusiness.whatsapp || "#",
            instagram: profileBusiness.instagram || "#",
            isMine: true,
          };
        }

        // Merge but avoid duplication using ownerUid and normalized name fallback
        let merged;
        if (userBusinessCard) {
          const filteredServerCards = serverCards.filter((s) => {
            const sameOwner = s.ownerUid && userBusinessCard.ownerUid && s.ownerUid === userBusinessCard.ownerUid;
            const sameName = normalizeName(s.name) && normalizeName(userBusinessCard.name) && normalizeName(s.name) === normalizeName(userBusinessCard.name);
            return !sameOwner && !sameName;
          });
          merged = [userBusinessCard, ...filteredServerCards];
        } else {
          merged = [...serverCards];
        }

        // BEFORE setting shops, check sessionStorage for any newBusiness saved by signup flow
        try {
          const maybeNew = sessionStorage.getItem("newBusiness");
          if (maybeNew) {
            const parsed = JSON.parse(maybeNew);
            const parsedNormName = normalizeName(parsed.name);
            const already = merged.some((m) => {
              const ownerMatch = parsed.ownerUid && m.ownerUid === parsed.ownerUid;
              const idMatch = parsed.id && m.id === parsed.id;
              const nameMatch = parsedNormName && normalizeName(m.name) === parsedNormName;
              return ownerMatch || idMatch || nameMatch;
            });
            if (!already) {
              merged = [parsed, ...merged];
            }
            sessionStorage.removeItem("newBusiness");
            try {
              window.history.replaceState(null, document.title, window.location.pathname);
            } catch (e) {}
          }
        } catch (e) {
          console.warn("Could not read newBusiness from sessionStorage", e);
        }

        setShops(dedupeShops(merged));
      } catch (err) {
        console.error("[Shops] load error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [token, location.state]);

  // Accept a new business passed in navigation state for instant UI update (e.g. from "+" flow)
  useEffect(() => {
    const passed = location.state?.newBusiness;
    if (!passed) return;

    const businessCard = {
      id: passed.id ?? passed._id ?? null,
      ownerUid: passed.ownerUid ?? null,
      name: passed.name || "My Business",
      tagline: passed.tagline || "",
      image:
        passed.logo ||
        passed.image ||
        "https://via.placeholder.com/600x400?text=Business+Logo",
      whatsapp: passed.whatsapp || "#",
      instagram: passed.instagram || "#",
      isMine: true,
    };

    setShops((prev) => {
      const combined = [businessCard, ...prev];
      const map = new Map();
      for (const s of combined) {
        const key = s.ownerUid ?? s.id ?? normalizeName(s.name);
        if (!map.has(key)) map.set(key, s);
      }
      return Array.from(map.values());
    });

    // clear navigation state so refresh/back doesn't duplicate
    try {
      window.history.replaceState(null, document.title, window.location.pathname);
    } catch (e) {}
  }, [location.state]);

  const openBusinessSetupPage = () => {
    // pass "from" so BusinessSetup knows how it was opened
    navigate("/business-setup", { state: { from: "shops" } });
  };

  return (
    <>
      <NavBar />

      <div className="bg-[#1a1a1a] min-h-screen flex flex-col items-center py-6 px-4 sm:px-6 md:px-12 gap-6">
        <div className="w-full max-w-[2050px] h-[280px] lg:h-[320px] rounded-t-2xl shadow-xl overflow-hidden">
          <img
            src={eventBanner}
            alt="Event Banner"
            className="w-full h-full object-cover"
          />
        </div>

        <MarketNavBar />
        <AddpostBar />

        <div className="w-full max-w-[1100px] mt-4">
          {loading ? (
            <div className="text-center text-gray-400">Loading...</div>
          ) : shops.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-12 bg-zinc-900 rounded-2xl shadow-md">
              <div className="text-xl font-semibold text-white">
                No businesses found
              </div>
              <div className="text-sm text-gray-300 max-w-xl text-center">
                Looks like there are no shops listed yet. You can be the first
                to add one.
              </div>
              <button
                onClick={openBusinessSetupPage}
                className="mt-4 px-6 py-2 rounded-lg bg-[#f4a261] text-black font-semibold hover:scale-105 transition"
              >
                Add your business
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {shops.map((shop, index) => (
                <div
                  key={shop.ownerUid ?? shop.id ?? `${shop.name}-${index}`}
                  className={`bg-zinc-900 rounded-2xl shadow-md overflow-hidden group transition-all duration-300 hover:scale-[1.02] ${
                    shop.isMine ? "ring-2 ring-orange-400" : ""
                  }`}
                >
                  <div className="relative w-full h-60 overflow-hidden">
                    <img
                      src={shop.image}
                      alt={shop.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                    <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-1">
                      <h2 className="text-lg font-bold text-white tracking-wide leading-tight">
                        {shop.name}
                      </h2>
                      {shop.tagline && (
                        <div
                          className="text-sm text-gray-300 font-normal truncate max-w-full"
                          title={shop.tagline}
                        >
                          {shop.tagline}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-zinc-800 flex justify-center gap-4 py-3">
                    <a
                      href={shop.whatsapp || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-full bg-white text-green-600 hover:bg-[#f4a261] hover:text-black transition transform hover:scale-110"
                    >
                      <FaWhatsapp size={20} />
                    </a>
                    <a
                      href={shop.instagram || "#"}
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
          )}
        </div>

        <button
          onClick={openBusinessSetupPage}
          className="fixed bottom-6 right-20 sm:right-6 w-14 h-14 rounded-full bg-[#f4a261] flex items-center justify-center text-black text-2xl font-bold shadow-lg hover:scale-110 transition"
          aria-label="Add business"
        >
          +
        </button>
      </div>
    </>
  );
};

export default Shops;
