// LandingPage.jsx
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger, MotionPathPlugin } from "gsap/all";
import loungecard from "../../assets/1loungecard.jpg";
import eventscard from "../../assets/2eventscard.jpg";
import clubcard from "../../assets/3clubcard.png";
import learncard from "../../assets/4learncard.jpg";
import compacard from "../../assets/6compacard.png";
import marketcard from "../../assets/5marketcard.png";
import peakImg from "../../assets/PEAK.png";
import shopImg from "../../assets/MONEY.png";
import studyImg from "../../assets/STUDY.png";
import shockImg from "../../assets/SHOCK.png";
import clubImg from "../../assets/CLUB.png";
import loveImg from "../../assets/LOVE.png";
import truckSrc from "../../assets/paperplane.png";
import giticon from "../../assets/giticon.png";
import logo from "../../assets/logomain.png";

import devPhoto from "../../assets/dev_photo.png";

import AboutDevDrawer from "./Aboutdevdrawer";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

/* ---------------- Card Component ---------------- */
const Card = ({ title, body, img, innerRef, reverse }) => (
  <div
    ref={innerRef}
    className="feature-card"
    style={{
      maxWidth: "1006px",
      width: "90%",
      minHeight: "400px",
      borderRadius: "clamp(15px, 3vw, 30px)",
      padding: "clamp(20px, 4vw, 40px)",
      background: "rgba(244, 172, 95, 0.92)",
      backdropFilter: "blur(6px)",
      boxShadow: "0px 12px 30px rgba(0,0,0,0.25)",
      display: "flex",
      flexDirection: reverse ? "row-reverse" : "row",
      alignItems: "center",
      justifyContent: "space-between",
      fontFamily: "'Anta', system-ui, sans-serif",
      position: "relative",
      zIndex: 2,
      gap: "20px",
    }}
  >
    <div style={{ flex: 1, textAlign: reverse ? "right" : "left", minWidth: 0 }}>
      <h3
        style={{
          fontSize: "clamp(20px, 3.5vw, 32px)",
          fontFamily: "'Alfa Slab One', cursive",
          margin: 0,
          color: "#111",
          lineHeight: 1.2,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          marginTop: "16px",
          fontSize: "clamp(14px, 2vw, 18px)",
          lineHeight: 1.6,
          color: "#111",
        }}
      >
        {body}
      </p>
    </div>

    <div
      style={{
        width: "clamp(200px, 40vw, 446px)",
        height: "clamp(180px, 35vw, 429px)",
        borderRadius: 18,
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      <img src={img} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.95 }} />
    </div>

    <style>{`
      @media (max-width: 768px) {
        .feature-card {
          flex-direction: column !important;
          text-align: center !important;
        }
        .feature-card > div:first-child {
          text-align: center !important;
        }
      }
    `}</style>
  </div>
);

/* ---------------- Catmull-Rom to Cubic Bezier ---------------- */
const catmullRomToBezier = (points, closed = false, tension = 0.5) => {
  if (!points?.length) return "";
  const p = [...points];
  if (!closed) {
    p.unshift(points[0]);
    p.push(points[points.length - 1], points[points.length - 1]);
  } else {
    p.push(points[0], points[1]);
  }

  let d = `M ${points[0].x},${points[0].y}`;
  for (let i = 1; i < p.length - 2; i++) {
    const [p0, p1, p2, p3] = [p[i - 1], p[i], p[i + 1], p[i + 2]];
    const bp1x = p1.x + ((p2.x - p0.x) / 6) * tension * 2;
    const bp1y = p1.y + ((p2.y - p0.y) / 6) * tension * 2;
    const bp2x = p2.x - ((p3.x - p1.x) / 6) * tension * 2;
    const bp2y = p2.y - ((p3.y - p1.y) / 6) * tension * 2;
    d += ` C ${bp1x},${bp1y} ${bp2x},${bp2y} ${p2.x},${p2.y}`;
  }
  return d;
};


const TruckRoadWithCards = ({ cards, startAnchorRef }) => {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const roadRef = useRef(null);
  const dashRef = useRef(null);
  const truckRef = useRef(null);
  const tweenRef = useRef(null);
  const stRef = useRef(null);
  const cardRefs = useRef([]);
  const [pathD, setPathD] = useState("");
  const [showMascots, setShowMascots] = useState(true);

  useEffect(() => {
    const handleResize = () => setShowMascots(window.innerWidth > 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const computePath = () => {
      const container = containerRef.current;
      if (!container) return;

      const points = cardRefs.current
        .map((el) => {
          if (!el) return null;
          const rect = el.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          return { x: rect.left - containerRect.left + rect.width / 2, y: rect.top - containerRect.top + rect.height / 2 };
        })
        .filter(Boolean);

      if (!points.length) return;

      const w = container.clientWidth;
      const startAnchor = startAnchorRef?.current;
      const start = startAnchor
        ? {
          x: startAnchor.getBoundingClientRect().left - container.getBoundingClientRect().left + startAnchor.offsetWidth / 2,
          y: startAnchor.getBoundingClientRect().top - container.getBoundingClientRect().top + startAnchor.offsetHeight / 2 + 60,
        }
        : { x: w / 2, y: Math.max(60, points[0].y - 220) };

      const maxWiggle = window.innerWidth > 768 ? Math.max(140, Math.min(w * 0.2, 320)) : 40;
      const nudged = points.map((p, i) => {
        const nx = Math.max(60, Math.min(w - 60, p.x + (i % 2 === 0 ? -1 : 1) * maxWiggle));
        return { x: nx, y: p.y };
      });

      const end = { x: w / 2, y: Math.min(Math.max(container.clientHeight, nudged[nudged.length - 1].y + 260), 10000) };
      setPathD(catmullRomToBezier([start, ...nudged, end], false, 0.5));
    };

    computePath();
    const ro = new ResizeObserver(computePath);
    containerRef.current && ro.observe(containerRef.current);
    window.addEventListener("load", computePath);
    window.addEventListener("resize", computePath);
    return () => {
      ro.disconnect();
      window.removeEventListener("load", computePath);
      window.removeEventListener("resize", computePath);
    };
  }, [cards, startAnchorRef]);

  useEffect(() => {
    if (!pathD) return;
    const [road, dash, truck, container] = [roadRef.current, dashRef.current, truckRef.current, containerRef.current];
    if (!road || !dash || !truck || !container) return;

    road.setAttribute("d", pathD);
    dash.setAttribute("d", pathD);

    const roadLength = Math.round(road.getTotalLength());
    const dashLength = Math.round(dash.getTotalLength());

    road.setAttribute("stroke-dasharray", roadLength);
    road.setAttribute("stroke-dashoffset", roadLength);
    dash.setAttribute("stroke-dasharray", dashLength);
    dash.setAttribute("stroke-dashoffset", dashLength);

    ScrollTrigger.getAll().forEach((st) => st.kill());
    tweenRef.current?.kill();
    stRef.current?.kill();

    tweenRef.current = gsap.to(truck, {
      motionPath: { path: road, align: road, alignOrigin: [0.5, 0.5], autoRotate: 280 },
      ease: "none",
      duration: 1,
      paused: true,
    });

    stRef.current = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom bottom",
      scrub: false,
      onUpdate: (self) => {
        const p = self.progress;
        tweenRef.current.progress(p);
        road.setAttribute("stroke-dashoffset", Math.round(roadLength * (1 - p)));
        dash.setAttribute("stroke-dashoffset", Math.round(dashLength * (1 - p)));
      },
    });

    gsap.set(truck, { autoAlpha: 1 });
    return () => {
      tweenRef.current?.kill();
      stRef.current?.kill();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [pathD]);

  const mascots = [peakImg, studyImg, clubImg, shockImg, shopImg, loveImg];
  const mascotPositions = [
    { src: peakImg, left: "calc(5% + 9px)", bottom: 20, width: "clamp(150px, 20vw, 350px)" },
    { src: studyImg, left: "calc(50% + 440px)", bottom: -40, width: "clamp(150px, 20vw, 300px)" },
    { src: clubImg, right: "calc(50% + 393px)", bottom: -30, width: "clamp(150px, 20vw, 350px)" },
    { src: shockImg, left: "calc(50% + 420px)", bottom: -40, width: "clamp(150px, 20vw, 300px)" },
    { src: shopImg, right: "calc(50% + 390px)", bottom: -20, width: "clamp(150px, 20vw, 300px)" },
    { src: loveImg, left: "calc(50% + 210px)", bottom: -125, width: "clamp(120px, 18vw, 250px)" },
  ];

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%", padding: "clamp(20px, 4vw, 40px) 20px" }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${containerRef.current?.clientWidth || 1400} ${containerRef.current?.clientHeight || 2400}`}
        style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", pointerEvents: "all", zIndex: 0 }}
        preserveAspectRatio="xMinYMin meet"
      >
        <path ref={roadRef} d={pathD || "M0,0"} fill="none" stroke="#111" strokeWidth="40" strokeLinecap="round" />
        <path ref={dashRef} d={pathD || "M0,0"} fill="none" stroke="#fff" strokeWidth="6" strokeDasharray="1 28" />
        <image ref={truckRef} href={truckSrc} width="120" height="150" x="-40" y="-40" />
      </svg>

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: "clamp(80px, 15vw, 180px)", alignItems: "center", paddingTop: "clamp(10px, 2vw, 20px)", paddingBottom: "clamp(30px, 5vw, 60px)" }}>
        {cards.map((c, i) => (
          <div key={i} style={{ width: "100%", display: "flex", justifyContent: "center", position: "relative" }}>
            <Card innerRef={(el) => (cardRefs.current[i] = el)} {...c} reverse={i % 2 === 1} />
            {showMascots && mascotPositions[i] && (
              <img
                src={mascotPositions[i].src}
                alt="mascot"
                style={{
                  position: "absolute",
                  zIndex: 10,
                  width: mascotPositions[i].width,
                  left: mascotPositions[i].left,
                  right: mascotPositions[i].right,
                  bottom: mascotPositions[i].bottom,
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const MovingStripe = () => (
  <div style={{ width: "100vw", height: "clamp(60px, 10vw, 90px)", backgroundColor: "#000", display: "flex", alignItems: "center", overflow: "hidden", whiteSpace: "nowrap" }}>
    <style>{`
      @keyframes troop-scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-100%); } }
      .scroll-text { display: inline-block; white-space: nowrap; animation: troop-scroll 15s linear infinite; }
    `}</style>
    {[...Array(2)].map((_, i) => (
      <div key={i} className="scroll-text" style={{ fontSize: "clamp(20px, 4vw, 32px)", fontWeight: 800, color: "#fff" }}>
        {Array(30).fill("TROOP").map((w, j) => <span key={j} style={{ paddingRight: "2rem" }}>{w}</span>)}
      </div>
    ))}
  </div>
);
export default function LandingPage() {
  const [showPlane, setShowPlane] = useState(true);
  const [devDrawerOpen, setDevDrawerOpen] = useState(false);
  const startAnchorRef = useRef(null);


  const devPhotoSrc = devPhoto;

  useEffect(() => {
    const checkScreen = () => setShowPlane(window.innerWidth > 768);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  useEffect(() => {
    document.body.style.overflow = devDrawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [devDrawerOpen]);


  const cards = [
    { title: "MEET YOUR PEOPLE. BUILD YOUR CONNECTIONS", body: "A space to talk, share, and be heard because campus conversations live here.", img: loungecard },
    { title: "DROP KNOWLEDGE. PICK KNOWLEDGE.", body: "Study materials that actually make sense - from real students.", img: learncard },
    { title: "FIND YOUR CLUBS AND YOUR EXTRACURRICULARS", body: "Explore campus clubs, sign up and connect with like-minded peers.", img: clubcard },
    { title: "KNOW THE EVENTS AROUND YOU", body: "Stay updated on campus happenings, from culturals to workshops to techfests", img: eventscard },
    { title: "BUY. SELL. THRIFT.", body: "A golden opportunity for student freelancers and businesses to reach their campus audience. Buy or sell pre-loved items.", img: marketcard },
    { title: "CAMPUS'S KNOW IT ALL", body: "Say hello to Compa, your compass inside campus. Get answers to all your campus-related queries.", img: compacard },
  ];

  return (
    <div style={{ background: `linear-gradient(180deg, #000000 12%, #D5760F 31%, #FF8605 57%)`, fontFamily: "'Anta', system-ui, sans-serif", minHeight: "100vh" }}>
      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <img
          src={logo}
          alt="Troop Logo"
          style={{
            marginLeft: '0px',

            height: 'clamp(40px, 5vw, 70px)',
            width: 'auto',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
          }}
        />

      </div>

      {/* ----------- FIXED BUTTON HERE ----------- */}
      <button
        onClick={() => setDevDrawerOpen(true)}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '8px 24px 8px 8px',
          borderRadius: '50px',
          backgroundColor: '#FFA500', // Default: Orange
          color: '#000000',           // Default: Black
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
          fontFamily: "'Anta', system-ui, sans-serif",
          fontSize: 'clamp(14px, 2vw, 18px)',
          fontWeight: 600,
          transition: 'background-color 0.3s, color 0.3s'
        }}

        // On HOVER (Mouse Enter): Change to WHITE
        onMouseEnter={e => {
          e.currentTarget.style.backgroundColor = '#FFFFFF';
          // Change image border to black (so it's visible on white bg)
          e.currentTarget.querySelector('div').style.borderColor = '#000';
        }}
        
        // On MOUSE LEAVE (Mouse Out): Change back to ORANGE
        onMouseLeave={e => {
          e.currentTarget.style.backgroundColor = '#FFA500';
          // Change image border back to white
          e.currentTarget.querySelector('div').style.borderColor = '#fff';
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '2px solid #fff', // Default: White border
            flexShrink: 0,
            transition: 'border-color 0.3s', // Added transition for the border
          }}
        >
          <img
            src={devPhotoSrc}
            alt="Developer"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        About the developer
      </button>
      {/* ------------------------------------------- */}


      <AboutDevDrawer
        open={devDrawerOpen}
        onClose={() => setDevDrawerOpen(false)}
        devPhotoSrc={devPhotoSrc}
      />

      <div
        aria-hidden={devDrawerOpen}
        style={{
          filter: devDrawerOpen ? 'blur(3px)' : 'none',
          transition: 'filter 0.3s ease-in-out',
          pointerEvents: devDrawerOpen ? 'none' : 'auto'
        }}
      >
        <div style={{ position: "relative", maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
          <header style={{
            paddingTop: "clamp(80px, 14vw, 120px)",
            paddingBottom: "clamp(20px, 3vw, 24px)",
            display: "flex",
            flexDirection: window.innerWidth <= 968 ? "column" : "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "40px"
          }}>
            <div style={{ flex: 1, maxWidth: "600px" }}>
              <h1 style={{ fontSize: "clamp(28px, 6vw, 48px)", fontFamily: "'Alfa Slab One', cursive", margin: 0, color: "#fff", lineHeight: 1.2 }}>YOUR UNIVERSITY BUT MAKE IT MORE FUN AND NO FOMO</h1>
              <p style={{ marginTop: 24, color: "#d1d1d1", fontSize: "clamp(16px, 2.5vw, 20px)", lineHeight: 1.6 }}>Troop is a college community platform that connects students, supports businesses and freelancers, shares learning resources, and provides campus updates in one place.</p>
              <a href="/login" style={{ display: "inline-block", marginTop: 22, background: "#E89F50", color: "#111", padding: "12px 20px", borderRadius: 12, fontFamily: "Alfa Slab One, cursive", fontWeight: 700, textDecoration: "none", fontSize: "clamp(14px, 2vw, 16px)" }}>Get Started</a>
            </div>

            {showPlane && (
              <div style={{ flex: 1, display: "flex", justifyContent: "flex-end", position: "relative", overflow: "visible", minHeight: "200px" }}>
                <img src={truckSrc} alt="paper-rocket" style={{ position: "absolute", top: "50%", right: "-150px", transform: "translateY(-50%) rotate(205deg) rotateZ(-5deg)", width: "clamp(400px, 60vw, 1000px)", height: "auto", zIndex: 9999, animation: "plane-wobble 2.5s ease-in-out infinite" }} />
                <style>{`@keyframes plane-wobble {0%{transform:translateY(-50%) rotate(205deg) rotateZ(-5deg) translateY(0);}50%{transform:translateY(-50%) rotate(205deg) rotateZ(-5deg) translateY(-8px);}100%{transform:translateY(-50%) rotate(205deg) rotateZ(-5deg) translateY(0);}}`}</style>
              </div>
            )}

          </header>
        </div>

        <TruckRoadWithCards cards={cards} startAnchorRef={startAnchorRef} />
        <div style={{ marginTop: "-4px" }}><MovingStripe /></div>
        <div style={{ height: "2px" }} />
        <br></br>
        <section
          style={{
            backgroundColor: "#000",
            padding: "clamp(60px, 8vw, 64px) 20px",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(20px, 4vw, 32px)",
              fontWeight: "bold",
              marginBottom: 8,
              color: "#fff",
            }}
          >
            Questions? Suggestions?
          </h2>

          <p
            style={{
              marginBottom: 16,
              color: "#9CA3AF",
              fontSize: "clamp(14px, 2vw, 16px)",
            }}
          >
            Reach us at:
          </p>

          <p
            style={{
              fontWeight: 600,
              marginBottom: 16,
              color: "#fff",
              fontSize: "clamp(14px, 2vw, 16px)",
              wordBreak: "break-all",
            }}
          >
            troopqueries2025@gmail.com
          </p>

          <a
            href="https://mail.google.com/mail/u/0/?view=cm&fs=1&to=troopqueries2025@gmail.com&su=Feedback%20for%20Troop"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "12px 24px",
              borderRadius: "9999px",
              display: "inline-block",
              backgroundColor: "#000",
              color: "#fff",
              border: "1px solid #444",
              textDecoration: "none",
              fontSize: "clamp(14px, 2vw, 16px)",
              marginBottom: "20px",
            }}
          >
            Email Us
          </a>

          <div style={{ marginTop: "16px" }}>
            <a
              href="https://github.com/Sreyasiv/Troop"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "#fff",
                color: "#111",
                padding: "12px 24px",
                borderRadius: "9999px",
                textDecoration: "none",
                fontSize: "clamp(17px, 2vw, 16px)",
                fontWeight: 600,
                border: "1px solid #ccc",
              }}
            >
              <img
                src={giticon}
                alt="GitHub"
                style={{ width: "54px", height: "34px" }}
              />
              View on GitHub
            </a>
          </div>
        </section>

      </div>
    </div>
  );
}