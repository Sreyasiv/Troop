// frontend/src/components/Auth/LoginPage.jsx
import React, { useState, useEffect, useRef } from "react";
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

  // fallback when env var isn't set
  const base = import.meta.env.VITE_API_URL;

  // navigation guard to avoid double redirects
  const didNavigateRef = useRef(false);

  // ---- safe navigate that prevents duplicates ----
  const safeNavigate = (to, opts) => {
    if (didNavigateRef.current) {
      console.warn("[safeNavigate] blocked duplicate navigation to", to);
      return;
    }
    didNavigateRef.current = true;
    console.log("[safeNavigate] navigating to", to, opts);
    navigate(to, opts);
  };

  // ---- robust fetchUserProgress + normalization ----
  const fetchUserProgress = async (uid, emailToCheck) => {
    const endpoints = [];
    if (uid) endpoints.push({ url: `${base}/api/users/progress/${uid}`, name: "by-uid" });
    if (emailToCheck) endpoints.push({ url: `${base}/api/users/by-email?email=${encodeURIComponent(emailToCheck)}`, name: "by-email" });

    let lastResponse = null;

    for (const ep of endpoints) {
      try {
        console.log(`[fetchUserProgress] [${ep.name}] trying ${ep.url}`);
        const res = await fetch(ep.url);
        console.log(`[fetchUserProgress] [${ep.name}] status ${res.status} ${res.statusText}`);
        const text = await res.text();
        lastResponse = { status: res.status, bodyText: text, name: ep.name };

        let json = null;
        try {
          json = text ? JSON.parse(text) : null;
        } catch (e) {
          console.warn(`[fetchUserProgress] [${ep.name}] response not JSON`, text);
        }

        if (!res.ok) {
          console.log(`[fetchUserProgress] [${ep.name}] not ok (status ${res.status}), continuing`);
          continue;
        }

        const payload = json ?? {};
        const maybeUser =
          payload?.step !== undefined ? payload :
          payload?.user ??
          payload?.data ??
          payload?.raw ??
          payload;

        const deeper =
          (maybeUser && typeof maybeUser === "object" && !("step" in maybeUser))
            ? (maybeUser.user ?? maybeUser.data ?? maybeUser.raw ?? maybeUser)
            : maybeUser;

        const finalUser = deeper ?? maybeUser ?? null;
        if (!finalUser) {
          console.log(`[fetchUserProgress] [${ep.name}] parsed empty finalUser, continuing`);
          continue;
        }

        const step = finalUser.step ?? finalUser.profileStep ?? finalUser.progress ?? null;

        let ownsBusiness = finalUser.ownsBusiness ?? finalUser.businessOwner ?? false;
        if (!ownsBusiness && finalUser.business && Object.keys(finalUser.business).length > 0) {
          ownsBusiness = true;
        }
        if (typeof ownsBusiness === "string") {
          ownsBusiness = ownsBusiness === "true" || ownsBusiness === "yes" || ownsBusiness === "1";
        }

        const isSetupComplete = finalUser.isSetupComplete === true || finalUser?.raw?.isSetupComplete === true;

        const finalUid = finalUser.uid ?? finalUser._id ?? finalUser.id ?? null;

        const normalized = {
          step,
          ownsBusiness,
          isSetupComplete,
          uid: finalUid,
          raw: finalUser,
          source: ep.name,
        };

        console.log("[fetchUserProgress] normalized ->", normalized);
        return normalized;
      } catch (err) {
        console.warn(`[fetchUserProgress] request failed for ${ep.name}`, err);
        // try next
      }
    }

    console.log("[fetchUserProgress] all endpoints tried, none returned user. lastResponse:", lastResponse);
    return null;
  };

  // ---- redirect logic using normalized progress (sends to next incomplete step) ----
  const redirectBasedOnProgress = (progress, uidParam) => {
    const step = Number(progress?.step) || 0;
    const ownsBusiness = Boolean(progress?.ownsBusiness);
    const isSetupComplete = Boolean(progress?.isSetupComplete);

    console.log("[redirectBasedOnProgress] received:", { step, ownsBusiness, isSetupComplete, uidParam, raw: progress?.raw });

    if (step < 2) {
      safeNavigate("/account-setup", { state: { uid: uidParam, email } });
      return;
    }
    if (step === 2) {
      safeNavigate("/account-setup", { state: { uid: uidParam, email } });
      return;
    }
    if (step === 3) {
      if (isSetupComplete) {
        safeNavigate("/lounge");
        return;
      }
      if (ownsBusiness) {
        safeNavigate("/business-setup", { state: { uid: uidParam, email } });
        return;
      }
      safeNavigate("/account-setup", { state: { uid: uidParam, email } });
      return;
    }
    if (step >= 4) {
      safeNavigate("/lounge");
      return;
    }
    // fallback
    safeNavigate("/account-setup", { state: { uid: uidParam, email } });
  };

  // ---- handleLogin (used by the Login button) ----
  const handleLogin = async () => {
    setError("");
    setLoading(true);
    didNavigateRef.current = false; // reset guard for this flow
    try {
      console.log("[handleLogin] attempting firebase signin for", email);
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;
      console.log("[handleLogin] firebase login success uid:", uid);

      const progress = await fetchUserProgress(uid, email);
      console.log("[handleLogin] fetchUserProgress result:", progress);

      if (progress) {
        redirectBasedOnProgress(progress, progress.uid ?? uid);
      } else {
        console.log("[handleLogin] no backend progress found -> account-setup fallback");
        safeNavigate("/account-setup", { state: { uid, email } });
      }
    } catch (err) {
      console.error("[handleLogin] error:", err);
      const msg = err?.code ?? err?.message ?? String(err);
      if (msg.includes("auth/user-not-found")) setError("No account found for this email.");
      else if (msg.includes("auth/wrong-password")) setError("Incorrect password.");
      else if (msg.includes("auth/too-many-requests")) setError("Too many attempts. Try again later.");
      else {
        // try the "email already in use" fallback which can happen during weird flows
        if (msg.includes("auth/email-already-in-use")) {
          try {
            const methods = await fetchSignInMethodsForEmail(auth, email);
            console.log("[handleLogin] sign-in methods:", methods);
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
      }
    } finally {
      setLoading(false);
    }
  };

  // ---- on-mount check for already authenticated user (auto-redirect to next incomplete step) ----
  useEffect(() => {
    let mounted = true;
    const checkAndRedirect = async () => {
      const current = auth?.currentUser;
      if (!current) return;
      const uid = current.uid;
      const emailFromAuth = current.email || email;
      console.log("[LoginPage] found currentUser on mount:", { uid, email: emailFromAuth });

      // reset the guard so the auto-redirect can run once
      didNavigateRef.current = false;

      const progress = await fetchUserProgress(uid, emailFromAuth);
      if (!mounted) return;

      if (progress) {
        const backendUid = progress.uid ?? uid;
        redirectBasedOnProgress(progress, backendUid);
      } else {
        safeNavigate("/account-setup", { state: { uid, email: emailFromAuth } });
      }
    };

    checkAndRedirect();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- UI ----
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
