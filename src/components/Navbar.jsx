import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSiteNav } from "../lib/useSiteNav";

/* `to` = opens a page, `id` = scrolls to a section on the Home page */
const LINKS = [
  { label: "Home", id: "home" },
  { label: "About", to: "/about" },
  { label: "Service", to: "/services" },
  { label: "Projects", to: "/projects" },
  { label: "Contact", to: "/contact" },
];

/* sections of the Home page that can light up in the navbar while scrolling */
const WATCHED = ["home", "service", "projects"];

function Logo({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-2.5 text-white"
      aria-label="Green Power home"
    >
      <span className="grid h-8 w-8 place-items-center rounded-full bg-brand transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="#04122e">
          <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
        </svg>
      </span>
      <span className="text-lg font-semibold tracking-tight">Green Power</span>
    </button>
  );
}

export default function Navbar({ onRegister }) {
  const { pathname, goSection, goPage } = useSiteNav();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState("home");

  /* glass background + which Home section is in view */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      if (pathname !== "/") return;
      const mid = window.innerHeight * 0.45;
      let cur = "home";
      for (const id of WATCHED) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= mid) cur = id;
      }
      setSeen(cur);
    };
    onScroll();
    const t = setTimeout(onScroll, 1000); // after the page transition has swapped the page
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  const keyOf = (l) => l.to ?? l.id;
  /* on Home, the Services / Projects preview sections also light up their link */
  const PAGES = ["/about", "/services", "/projects", "/contact"];
  const active = PAGES.includes(pathname)
    ? pathname
    : seen === "service"
    ? "/services"
    : seen === "projects"
    ? "/projects"
    : seen;

  const go = (l) => {
    setOpen(false);
    if (l.to) goPage(l.to);
    else goSection(l.id);
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#06306e]/60 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl"
          : "bg-transparent py-5"
      }`}
    >
      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8">
        <Logo
          onClick={() => {
            setOpen(false);
            goSection("home");
          }}
        />

        {/* Desktop links */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex">
          {LINKS.map((l) => (
            <button
              key={keyOf(l)}
              onClick={() => go(l)}
              className={`relative py-1 text-sm font-medium transition-colors duration-300 ${
                active === keyOf(l)
                  ? "text-white"
                  : "text-white/80 hover:text-white"
              }`}
            >
              {l.label}
              {active === keyOf(l) && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-brand"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
            </button>
          ))}
        </nav>

        {/* Desktop buttons */}
        <div className="hidden items-center gap-3 lg:flex">
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => goPage("/contact")}
            className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-[#04122e] shadow-lg transition-colors duration-300 hover:bg-brand"
          >
            Contact Us
          </motion.button>
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={onRegister}
            className="rounded-full border border-white/50 px-5 py-2.5 text-sm font-medium text-white transition-colors duration-300 hover:border-white hover:bg-white hover:text-[#04122e]"
          >
            Registration
          </motion.button>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="relative z-10 grid h-10 w-10 place-items-center rounded-full border border-white/40 lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span className="relative block h-3 w-5">
            <span
              className={`absolute left-0 h-0.5 w-5 rounded bg-white transition-all duration-300 ${
                open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 top-1/2 h-0.5 w-5 -translate-y-1/2 rounded bg-white transition-all duration-300 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 h-0.5 w-5 rounded bg-white transition-all duration-300 ${
                open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"
              }`}
            />
          </span>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mx-4 mt-3 overflow-hidden rounded-3xl border border-white/20 bg-[#06306e]/80 backdrop-blur-2xl lg:hidden"
          >
            <div className="flex flex-col gap-1 p-4">
              {LINKS.map((l, i) => (
                <motion.button
                  key={keyOf(l)}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.07 * i + 0.1 }}
                  onClick={() => go(l)}
                  className={`rounded-xl px-4 py-3 text-left text-base font-medium transition-colors hover:bg-white/10 ${
                    active === keyOf(l) ? "text-brand" : "text-white"
                  }`}
                >
                  {l.label}
                </motion.button>
              ))}
              <div className="mt-2 flex gap-3">
                <button
                  onClick={() => {
                    setOpen(false);
                    goPage("/contact");
                  }}
                  className="flex-1 rounded-full bg-white py-3 text-sm font-medium text-[#04122e]"
                >
                  Contact Us
                </button>
                <button
                  onClick={() => {
                    setOpen(false);
                    onRegister();
                  }}
                  className="flex-1 rounded-full border border-white/50 py-3 text-sm font-medium text-white"
                >
                  Registration
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}