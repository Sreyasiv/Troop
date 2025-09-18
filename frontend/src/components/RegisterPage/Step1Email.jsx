
import React, { useState, useEffect } from "react";
import logo from "../../assets/logo.jpeg";
import plane from "../../assets/plane.png";
import { useNavigate } from "react-router-dom";
import { fetchSignInMethodsForEmail, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const db = getFirestore();

const RegisterPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [emailTaken, setEmailTaken] = useState(false);

  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setAuthUser(user || null);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    let mounted = true;
    const fetchProfile = async () => {
      if (!authUser || !authUser.uid) {
        setProfile(null);
        return;
      }

      setProfileLoading(true);
      try {
        const ref = doc(db, "users", authUser.uid);
        const snap = await getDoc(ref);
        if (!mounted) return;
        setProfile(snap.exists() ? snap.data() : null);
      } catch (err) {
        console.error("Failed fetching user profile:", err);
        setProfile(null);
      } finally {
        if (mounted) setProfileLoading(false);
      }
    };

    fetchProfile();
    return () => { mounted = false; };
  }, [authUser]);

  const getNextRoute = (userProfile) => {
    if (!userProfile) return "/account-setup";
    const { isSetupComplete, accountSetupComplete, businessSetupComplete, ownsBusiness } = userProfile || {};
    if (!accountSetupComplete) return "/account-setup";
    if (ownsBusiness && !businessSetupComplete) return "/business-setup";
    if (!isSetupComplete) return "/create-account";
    return "/lounge";
  };

  const checkEmail = async (candidateEmail) => {
    setEmailTaken(false);
    setError("");

    if (!candidateEmail.trim()) return { valid: false, message: "Email is required" };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidateEmail)) return { valid: false, message: "Enter a valid email address" };
    if (!(candidateEmail.endsWith("@vistas.ac.in") || candidateEmail.endsWith("@kalvium.community"))) {
      return { valid: false, message: "Email must be from Vistas or Kalvium" };
    }
    if (authUser && authUser.email && authUser.email !== candidateEmail) {
      return { valid: false, message: `You're currently signed in as ${authUser.email}. Logout to sign up with a different email.` };
    }

    try {
      setChecking(true);
      const methods = await fetchSignInMethodsForEmail(auth, candidateEmail);
      if (methods.length > 0) {
        setEmailTaken(true);
        return { valid: false, message: "Email already registered. Try logging in instead." };
      }
      return { valid: true, message: "Email is valid" };
    } catch (err) {
      console.error("Firebase email check error:", err);
      return { valid: false, message: "Something went wrong, try again" };
    } finally {
      setChecking(false);
    }
  };

  const handleNext = async () => {
    setError("");
    const result = await checkEmail(email);
    if (!result.valid) {
      setError(result.message);
      return;
    }
    navigate("/create-account", { state: { email } });
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setAuthUser(null);
      setProfile(null);
      setError("");
    } catch (err) {
      console.error("Logout failed", err);
      setError("Failed to logout. Try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#1A1A1A] text-white relative px-4 overflow-hidden">
      {/* Logo */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-8 flex items-center">
        <img src={logo} alt="Troop Logo" className="h-16 sm:h-20 md:h-24" />
      </div>

      {/* Plane */}
      <div
        className="absolute bottom-0 right-0 md:right-[8%] lg:right-[10%] xl:right-[0%] 
                      z-10 w-[75%] sm:w-[65%] md:w-[55%] lg:w-[65%] xl:w-[45%] opacity-90"
      >
        <img
          src={plane}
          alt="Plane"
          className="w-full h-auto object-contain object-bottom
                     translate-y-[60px] sm:translate-y-[100px] md:translate-y-[140px] lg:translate-y-[190px]
                     sm:translate-x-[-20px] md:translate-x-[-40px] lg:translate-x-[-70px]"
        />
      </div>

      {/* Heading */}
      <div className="text-center mb-6 sm:mb-8 relative z-20 px-2">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">Create an account</h2>
      </div>

      
      {authUser && (
        <div className="mb-4 w-full max-w-lg md:max-w-2xl bg-[#2b2b2b] border border-yellow-500 p-4 rounded-xl text-left z-20">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-semibold">You're already signed in</p>
              <p className="text-sm text-gray-300">Signed in as <span className="font-medium text-white">{authUser.email}</span>.</p>
              <p className="text-sm text-gray-400 mt-1">If you want to create a new account, logout first.</p>
            </div>

            <div className="flex flex-col gap-2">
              {/* Now requires an explicit click to navigate */}
              <button
                onClick={() => {
                  if (!profileLoading) {
                    const next = getNextRoute(profile);
                    navigate(next);
                  }
                }}
                className={`px-3 py-2 rounded bg-[#D4852D] text-black font-semibold ${
                  profileLoading ? "opacity-60 cursor-wait" : ""
                }`}
              >
                {profileLoading ? "Checking next step…" : "Take me to next step"}
              </button>

              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded border border-gray-400 text-gray-200"
              >
                Logout & Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Register Box */}
      <div className="bg-[#2D2B2B] px-6 sm:px-10 md:px-12 py-8 sm:py-10 md:py-12 rounded-3xl shadow-lg w-full max-w-lg md:max-w-2xl text-center flex flex-col items-center relative z-20">
        {/* Email */}
        <div className="mb-6 w-full text-left">
          <label className="block font-semibold text-lg sm:text-xl md:text-2xl">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
              setEmailTaken(false);
            }}
            className="w-full p-3 sm:p-4 md:p-5 rounded-lg bg-[#D9D9D9] text-black border-none focus:outline-none text-lg sm:text-xl md:text-2xl"
            placeholder="Enter your email"
            disabled={!!authUser}
          />
        </div>

        {/* Status line */}
        {checking && <p className="text-sm text-gray-300 mb-2">Checking email...</p>}
        {emailTaken && <p className="text-sm text-red-400 mb-2">This email is already registered. Try logging in.</p>}

        {/* Error */}
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={!!authUser || checking}
          className={`w-full ${!!authUser || checking ? "opacity-50 cursor-not-allowed" : ""} bg-[#D4852D] text-white font-bold py-3 sm:py-4 md:py-5 rounded-lg text-xl sm:text-2xl md:text-3xl hover:bg-white hover:text-[#D4852D] transition-all duration-300`}
        >
          NEXT
        </button>

        {/* Already have account - DISABLED when authUser is present */}
        <p className="text-gray-400 text-sm sm:text-base md:text-lg mt-6 text-center">
          <button
            onClick={() => !authUser && navigate("/login")}
            disabled={!!authUser}
            className={`relative pb-1 ${authUser ? "text-gray-600 cursor-not-allowed" : "text-gray-400 hover:text-[#D4852D]"} 
                       after:block after:h-[2px] after:bg-[#D4852D] after:w-0 
                       after:transition-all after:duration-300 hover:after:w-full`}
          >
            Already have one?
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
