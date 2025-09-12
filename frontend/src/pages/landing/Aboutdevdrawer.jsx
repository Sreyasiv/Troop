import React, { useEffect, useRef } from "react";
import { X, Linkedin, Github,MailOpen, Wifi } from "lucide-react";

// This is a drop-in replacement for the AboutDev drawer in LandingPage.jsx.
// Usage: <AboutDevDrawer open={open} onClose={() => setOpen(false)} devPhotoSrc={devPhotoSrc} />

export default function AboutDevDrawer({ open, onClose, devPhotoSrc }) {
  const fallbackAvatar =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><rect fill='%23FFA541' rx='20' width='100%' height='100%'/><text x='50%' y='56%' font-size='64' text-anchor='middle' fill='white' font-family='Verdana'>S</text></svg>`
    );

  const drawerRef = useRef(null);

  // lock scroll + handle Escape key + focus
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setTimeout(() => drawerRef.current?.focus(), 80);
    } else {
      document.body.style.overflow = "";
    }
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <div
      aria-hidden={!open}
      className={`fixed inset-0 z-[100000] pointer-events-none`}>

      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        ref={drawerRef}
        tabIndex={-1}
        className={`absolute top-0 right-0 h-full text-white transform transition-transform duration-400 ${
          open ? "translate-x-0 pointer-events-auto" : "translate-x-full pointer-events-none"
        } w-full md:w-[420px] flex flex-col overflow-y-auto p-6 bg-gradient-to-b from-[#0b1220] via-[#0f1720] to-[#0b0b0b] shadow-2xl`}
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-extrabold tracking-tight">Hi there!</h3>
            <p className="text-sm text-gray-300 mt-1">Sreya Sivakumar — MERN • AI • Campus tools</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-white/8 transition focus:outline-none focus:ring-2 focus:ring-[#FFA541]"
            aria-label="Close about panel"
          >
            <X />
          </button>
        </div>

        {/* Profile + highlight */}
        <div className="mt-6 flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#FFB66B] via-[#FFA541] to-[#FF8A3D] filter blur-xl opacity-60 animate-pulse" />
            <img
              src={devPhotoSrc || fallbackAvatar}
              alt="Sreya profile"
              onError={(e) => (e.currentTarget.src = fallbackAvatar)}
              className="relative w-36 h-36 rounded-full object-cover border-4 border-[#0b0b0b] shadow-xl"
            />
          </div>

          <div className="text-center">
            <h4 className="font-semibold text-lg">Sreya Sivakumar</h4>
            <p className="text-sm text-gray-300">MERN developer • Student • AI enthusiast</p>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <a
              href="https://www.linkedin.com/in/sreya-sivakumar-84b853319/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-white/6 hover:bg-white/10 transition"
              aria-label="LinkedIn"
            >
              <Linkedin />
              <span className="text-sm">LinkedIn</span>
            </a>

            <a
              href="https://github.com/Sreyasiv"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-white/6 hover:bg-white/10 transition"
              aria-label="GitHub"
            >
              <Github />
              <span className="text-sm">GitHub</span>
            </a>
          </div>
        </div>

        {/* Bio + stats */}
        <div className="mt-6 space-y-4">
          <p className="text-sm text-gray-200 leading-relaxed">
            Troop was built with the idea of making campus life connected, accessible,less chaotic and obviously more fun.
            Put in way too much grind for this,if it breaks, just pretend it's a
            feature. 
          </p>

          <p className="text-sm text-gray-200 leading-relaxed">
            Got ideas? Drop me a mail,I respond quicker than Vel's Wi-Fi..
          </p>

          
        </div>

        {/* Skills / mini portfolio */}
       

        {/* CTA area */}
        <div className="mt-6">
          <h5 className="text-sm font-semibold text-gray-300">Support / contact</h5>
          <div className="mt-3 flex flex-col gap-3">
            <a
              href="mailto:sreyasvkmr@gmail.com"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-[#FFA541] text-white font-semibold hover:scale-105 transition"
            >
              <MailOpen />
              <span>Mail</span>
            </a>

            <div className="flex gap-2">
              <a
                href="https://www.buymeacoffee.com/sreyasiv"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-[#FFA541] font-semibold hover:scale-105 transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Wifi />
                <span>Fund my hotspot</span>
              </a>

            </div>
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-white/10 text-xs text-gray-400">
          <p>Buit with ❤️ by Sreya</p>
        </div>
      </aside>
    </div>
  );
}
