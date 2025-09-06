// frontend/src/components/Auth/LoginPage.jsx
import React, { useState, useRef, useEffect } from "react";
import logo from "../assets/logomain.png";
import plane from "../assets/plane.png";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  fetchSignInMethodsForEmail,
} from "firebase/auth";

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const base = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

  // small helper: fetch user progress from backend
  const fetchUserProgress = async (uid, emailToCheck) => {
    try {
      // preferred endpoint
      const res = await fetch(`${base}/api/users/progress/${uid}`);
      if (res.ok) return await res.json();
    } catch (e) {
      /* ignore */
    }
    try {
      const res = await fetch(
        `${base}/api/users/by-email?email=${encodeURIComponent(emailToCheck)}`
      );
      if (res.ok) return await res.json();
    } catch (e) {
      /* ignore */
    }
    return null;
  };

  const redirectBasedOnProgress = (progress, uid) => {
    const step = Number(progress?.step) || 0;
    const ownsBusiness =
      progress?.ownsBusiness === true || progress?.ownsBusiness === "true";

    if (step === 2 || step === 0) {
      navigate("/account-setup", { state: { uid, email } });
      return;
    }
    if (step === 3) {
      if (ownsBusiness) {
        navigate("/business-setup", { state: { uid, email } });
      } else {
        navigate("/lounge");
      }
      return;
    }
    navigate("/lounge");
  };

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

      const progress = await fetchUserProgress(uid, email);
      if (progress) {
        redirectBasedOnProgress(progress, uid);
      } else {
        navigate("/account-setup", { state: { uid, email } });
      }
    } catch (err) {
      console.error("Login error:", err);
      const msg = err?.code ?? err?.message ?? String(err);

      if (msg.includes("auth/user-not-found")) {
        setError("No account found for this email.");
      } else if (msg.includes("auth/wrong-password")) {
        setError("Incorrect password.");
      } else if (msg.includes("auth/too-many-requests")) {
        setError("Too many attempts. Try again later.");
      } else if (msg.includes("auth/email-already-in-use")) {
        // already in use during signup, fetch progress & redirect
        try {
          const methods = await fetchSignInMethodsForEmail(auth, email);
          console.log("Sign-in methods:", methods);

          const backendUser = await fetchUserProgress(null, email);
          if (backendUser) {
            redirectBasedOnProgress(backendUser, backendUser.uid);
            return;
          }
          setError("This email is already in use. Please sign in.");
        } catch (inner) {
          setError("This email is already in use.");
        }
      } else {
        setError("Failed to sign in. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#1A1A1A] text-white relative px-4 overflow-hidden">
      {/* Logo */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-8 flex items-center">
        <img src={logo} alt="Troop Logo" className="h-16 sm:h-20 md:h-24" />
      </div>

      {/* Plane Illustration */}
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
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
          Welcome Back!
        </h2>
        <p className="text-gray-400 text-base sm:text-lg md:text-xl">
          We're so excited to see you again!
        </p>
      </div>

      {/* Login Box */}
      <div className="bg-[#2D2B2B] px-6 sm:px-10 md:px-16 py-10 sm:py-12 rounded-3xl shadow-lg w-full max-w-lg md:max-w-3xl text-center flex flex-col items-center relative z-20">
        {/* Email */}
        <div className="mb-6 w-full text-left">
          <label className="block font-semibold text-lg sm:text-xl md:text-2xl">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 sm:p-4 md:p-5 rounded-lg bg-[#D9D9D9] text-black border-none focus:outline-none text-lg sm:text-xl md:text-2xl"
          />
        </div>

        {/* Password */}
        <div className="mb-6 w-full text-left">
          <label className="block font-semibold text-lg sm:text-xl md:text-2xl">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 sm:p-4 md:p-5 rounded-lg bg-[#D9D9D9] text-black border-none focus:outline-none text-lg sm:text-xl md:text-2xl"
          />
        </div>

        {/* Forgot Password */}
        <div className="text-left w-full mb-6">
          <a
            href="#"
            className="inline-block text-gray-400 text-sm sm:text-base md:text-lg relative pb-1 hover:text-[#D4852D] 
                       after:block after:h-[2px] after:bg-[#D4852D] after:w-0 
                       after:transition-all after:duration-300 hover:after:w-full"
          >
            Forgot your password?
          </a>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-[#D4852D] text-white font-bold py-3 sm:py-4 md:py-5 rounded-lg text-xl sm:text-2xl md:text-3xl hover:bg-white hover:text-[#D4852D] transition-all duration-300 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "LOG IN"}
        </button>

        {error && (
          <p className="text-red-400 text-sm sm:text-base mt-3">{error}</p>
        )}

        <p className="text-gray-400 text-sm sm:text-base md:text-lg mt-6 text-center">
          <button
            onClick={() => navigate("/register")}
            className="relative pb-1 text-gray-400 hover:text-[#D4852D] 
                       after:block after:h-[2px] after:bg-[#D4852D] after:w-0 
                       after:transition-all after:duration-300 hover:after:w-full"
          >
            Create an account
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
