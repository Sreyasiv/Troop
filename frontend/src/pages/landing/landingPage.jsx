// LandingPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import troop from "../../assets/troop.png";
import devPhoto from "../../assets/dev-photo.jpeg"; // replace path if needed
import AboutDevDrawer from "./Aboutdevdrawer"; // make sure filename + path match

import {
  Users,
  ShoppingBag,
  HelpCircle,
  Book,
  CalendarDays,
  Recycle,
  MessageSquare,
  Plus,
} from "lucide-react";

// Hero Section Component — now receives onOpenAbout and devPhotoSrc from parent
const HeroSection = ({ onOpenAbout, devPhotoSrc }) => {
  const navigate = useNavigate();
  const fallbackAvatar =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='128' height='128'><rect fill='%23FFA541' rx='16' width='100%' height='100%'/><text x='50%' y='55%' font-size='48' text-anchor='middle' fill='white' font-family='Verdana'>S</text></svg>`
    );

  return (
    <section
      className="relative flex flex-col items-center text-center"
      style={{ backgroundColor: "#FFA541", height: "400px" }}
    >
      {/* Top right about button */}
      <div className="absolute right-6 top-6 z-30">
        <button
          onClick={onOpenAbout}
          className="flex items-center gap-2 px-3 py-2 rounded-full bg-black text-white hover:bg-white hover:text-black transition-transform transform hover:-translate-y-0.5 hover:scale-105"
          aria-label="About the dev"
        >
          <img
            src={devPhotoSrc || fallbackAvatar}
            alt="dev avatar"
            className="w-8 h-8 rounded-full object-cover border-2 border-white"
            onError={(e) => (e.currentTarget.src = fallbackAvatar)}
          />
          <span className="hidden sm:inline">About the developer</span>
        </button>
      </div>

      {/* Heading */}
      <h1 className="text-5xl sm:text-6xl font-bold mt-20 mb-6 z-10" style={{ fontFamily: "Verdana" }}>
        Welcome to <span style={{ color: "#000000" }}>Troop</span>
      </h1>

      {/* Button */}
      <button
        onClick={() => navigate("/register")}
        className="px-6 py-3 rounded-full cursor-pointer font-semibold z-10 mb-4 bg-black text-white transition-colors duration-300 hover:bg-white hover:text-black transform hover:-translate-y-1"
      >
        Get Started
      </button>

      {/* Image fixed to bottom (kept as-is) */}
      <img
        src={troop}
        alt="Troop Characters"
        className="absolute bottom-0 w-[70%] max-w-md object-contain opacity-90"
      />
    </section>
  );
};

// Main Page data
const features = [
  { icon: MessageSquare, title: "Lounge", description: "Post and share thoughts" },
  { icon: ShoppingBag, title: "Angaadi", description: "Explore student-run shops" },
  { icon: Recycle, title: "Thrift", description: "Buy/sell pre-loved items" },
  { icon: HelpCircle, title: "Compa (AI Help)", description: "Chatbot for help" },
  { icon: Book, title: "Learn", description: "Study resources" },
  { icon: CalendarDays, title: "Events", description: "Campus events" },
  { icon: Users, title: "Clubs", description: "Join student clubs" },
  { icon: Plus, title: "More Coming", description: "Stay tuned!" },
];

const testimonials = [
  { quote: "Best way to build networks around college!", name: "Ahamed Meyan", course: "3rd Year, CS" },
  { quote: "Loved shopping on Angaadi!", name: "Varsha", course: "2nd Year, Design" },
  { quote: "Compa helped with directions and contacts!", name: "Oviya", course: "1st Year, Engg" },
];

const Index = () => {
  const navigate = useNavigate();
  const [aboutOpen, setAboutOpen] = useState(false);
  const devPhotoSrc = devPhoto; // fallback handled in drawer/HeroSection

  return (
    <div className="min-h-screen text-white font-sans" style={{ backgroundColor: "#1A1A1A" }}>
      {/* About Drawer (mounted at parent so it can be opened from anywhere) */}
      <AboutDevDrawer open={aboutOpen} onClose={() => setAboutOpen(false)} devPhotoSrc={devPhotoSrc} />

      {/* Hero */}
      <HeroSection onOpenAbout={() => setAboutOpen(true)} devPhotoSrc={devPhotoSrc} />

      {/* Features */}
      <section className="py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Everything you need</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((f, idx) => (
            <div
              key={idx}
              className={`relative p-6 rounded-2xl flex items-center justify-center flex-col transform transition-all duration-500 ease-out hover:scale-105 hover:-translate-y-2 group`}
              style={{
                backgroundColor: f.icon === Plus ? "#FFA541" : "#383535",
                height: "190px",
              }}
            >
              {/* Icon Wrapper */}
              <div
                className="flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
                style={{
                  backgroundColor: f.icon === Plus ? "transparent" : "#FFA541",
                  color: "white",
                  width: f.icon === Plus ? "64px" : "56px",
                  height: f.icon === Plus ? "64px" : "56px",
                  borderRadius: "0.75rem",
                }}
              >
                <f.icon size={f.icon === Plus ? 48 : 28} className="transition-transform duration-500 group-hover:scale-125" />
              </div>

              {/* Text */}
              {f.icon !== Plus && (
                <>
                  <h3 className="font-semibold mt-4 text-white transition-colors duration-500 group-hover:text-[#FFA541]">
                    {f.title}
                  </h3>
                  <p className="text-sm text-gray-400 text-center transition-opacity duration-500 group-hover:opacity-90">
                    {f.description}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4" style={{ backgroundColor: "#383535" }}>
        <h2 className="text-3xl font-bold text-center mb-8">Student Voices</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl group transition-transform duration-300 hover:scale-105"
              style={{ backgroundColor: "#1A1A1A" }}
            >
              <p className="italic text-gray-300 mb-4">"{t.quote}"</p>
              <p className="font-bold text-white transition-colors duration-300 group-hover:text-[#FFA541]">{t.name}</p>
              <p className="text-sm text-gray-400">{t.course}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 px-4 text-center">
        <h2 className="text-2xl font-bold mb-2">Questions? Suggestions?</h2>
        <p className="text-gray-400 mb-4">Reach us at:</p>
        <p className="text-white font-semibold mb-4">sreyasvkmr@gmail.com</p>
        <a
          href="https://mail.google.com/mail/u/0/?view=cm&fs=1&to=sreyasvkmr@gmail.com&su=Feedback%20for%20Troop"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 rounded-full inline-block"
          style={{ backgroundColor: "#FFA541", color: "white" }}
        >
          Email Us
        </a>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 text-center" style={{ backgroundColor: "#FFA541", color: "black" }}>
        <h2 className="text-3xl font-bold mb-4">Ready to join your campus community?</h2>
        <p className="mb-4">Connect, explore, and grow with Troop.</p>
        <button
          onClick={() => navigate("/register")}
          className="px-6 py-3 rounded-full cursor-pointer font-semibold z-10 mb-4 bg-black text-white transition-colors duration-300 hover:bg-white hover:text-black"
        >
          Get Started
        </button>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-sm" style={{ backgroundColor: "#1A1A1A", color: "#B0B0B0" }}>
        <p>© 2025 Troop. Built by students, for students.</p>
      </footer>
    </div>
  );
};

export default Index;
