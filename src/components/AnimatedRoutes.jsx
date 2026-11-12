import { useEffect, useRef, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Home from "../pages/Home";
import AboutPage from "../pages/AboutPage";
import ServicesPage from "../pages/ServicesPage";
import ProjectsPage from "../pages/ProjectsPage";
import ContactPage from "../pages/ContactPage";
import { jumpToId, jumpToTop, startScroll, stopScroll } from "../lib/lenis";

const CURVE = [0.76, 0, 0.24, 1];
const EASE = [0.22, 1, 0.36, 1];

/* timing (ms): the new page is swapped in once the curtain fully covers the screen */
const SWAP_MS = 800;
const DONE_MS = 1600;

/* lime panel leads, navy panel follows; on the way out navy leaves first */
const limePanel = {
  idle: { y: "100%", transition: { duration: 0 } },
  cover: { y: "0%", transition: { duration: 0.65, ease: CURVE } },
  reveal: { y: "-100%", transition: { duration: 0.65, delay: 0.12, ease: CURVE } },
};
const navyPanel = {
  idle: { y: "100%", transition: { duration: 0 } },
  cover: { y: "0%", transition: { duration: 0.65, delay: 0.12, ease: CURVE } },
  reveal: { y: "-100%", transition: { duration: 0.65, ease: CURVE } },
};
const logo = {
  idle: { opacity: 0, scale: 0.8, transition: { duration: 0 } },
  cover: { opacity: 1, scale: 1, transition: { duration: 0.45, delay: 0.45, ease: EASE } },
  reveal: { opacity: 0, scale: 1.1, transition: { duration: 0.25 } },
};

export default function AnimatedRoutes({ onQuote }) {
  const location = useLocation();
  const [display, setDisplay] = useState(location); // the page that is actually on screen
  const [phase, setPhase] = useState("idle"); // idle | cover | reveal
  const shown = useRef(location.pathname);

  /* when the URL changes: cover the screen, swap the page, uncover */
  useEffect(() => {
    if (location.pathname === shown.current) {
      setDisplay(location);
      return;
    }
    stopScroll();
    setPhase("cover");
    const swap = setTimeout(() => {
      shown.current = location.pathname;
      setDisplay(location);
      setPhase("reveal");
    }, SWAP_MS);
    const done = setTimeout(() => {
      setPhase("idle");
      startScroll();
    }, DONE_MS);
    return () => {
      clearTimeout(swap);
      clearTimeout(done);
    };
  }, [location]);

  /* new page: jump to the requested section, or to the top */
  useEffect(() => {
    const id = display.state?.scrollTo;
    if (id && id !== "home") {
      const t = setTimeout(() => jumpToId(id), 80);
      return () => clearTimeout(t);
    }
    jumpToTop();
  }, [display]);

  return (
    <>
      <Routes location={display}>
        <Route path="/" element={<Home onQuote={onQuote} />} />
        <Route path="/about" element={<AboutPage onQuote={onQuote} />} />
        <Route path="/services" element={<ServicesPage onQuote={onQuote} />} />
        <Route path="/projects" element={<ProjectsPage onQuote={onQuote} />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* page-transition curtain */}
      <div
        aria-hidden
        className={`fixed inset-0 z-[200] overflow-hidden ${
          phase === "idle" ? "pointer-events-none" : "pointer-events-auto"
        }`}
      >
        <motion.div
          variants={limePanel}
          initial="idle"
          animate={phase}
          className="absolute inset-0 bg-brand"
        />
        <motion.div
          variants={navyPanel}
          initial="idle"
          animate={phase}
          className="absolute inset-0 grid place-items-center bg-[#04122e]"
        >
          <motion.div
            variants={logo}
            className="flex items-center gap-3 text-white"
          >
            <span className="grid h-11 w-11 place-items-center rounded-full bg-brand">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="#04122e">
                <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
              </svg>
            </span>
            <span className="text-2xl font-semibold tracking-tight">
              Green Power
            </span>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}