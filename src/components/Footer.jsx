import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { scrollToTop } from "../lib/lenis";
import { useSiteNav } from "../lib/useSiteNav";

const EASE = [0.22, 1, 0.36, 1];

const QUICK_LINKS = [
  { label: "Home", id: "home" },
  { label: "About", to: "/about" },
  { label: "Service", to: "/services" },
  { label: "Projects", to: "/projects" },
  { label: "Contact", to: "/contact" },
];
const SERVICES = ["Solar Energy", "Wind Energy", "Hydropower", "Energy Storage"];

const colWrap = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
const col = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

/* ---------- small pieces ---------- */
function FooterLink({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="group inline-flex items-center gap-0 text-left text-[13px] text-white/75 transition-all duration-300 hover:translate-x-1 hover:gap-2 hover:text-brand"
    >
      <span className="h-px w-0 bg-brand transition-all duration-300 group-hover:w-3" />
      {children}
    </button>
  );
}

function Icon({ children }) {
  return (
    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md bg-brand text-[#04122e] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
      <svg
        viewBox="0 0 24 24"
        className="h-3 w-3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </svg>
    </span>
  );
}

function ContactRow({ href, external, icon, children }) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className="group flex items-center gap-2.5 text-[13px] text-white/80 transition-colors duration-300 hover:text-brand"
    >
      <Icon>{icon}</Icon>
      {children}
    </a>
  );
}

/* ---------- footer ---------- */
export default function Footer() {
  const { goSection, goPage } = useSiteNav();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | error | loading | done
  const [toast, setToast] = useState(null);
  const [showTop, setShowTop] = useState(false);
  const toastTimer = useRef(null);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(toastTimer.current);
    };
  }, []);

  const subscribe = (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    /* hook up your newsletter API here */
    setTimeout(() => {
      setStatus("done");
      setEmail("");
    }, 800);
  };

  const soon = (label) => {
    clearTimeout(toastTimer.current);
    setToast(`${label} page is coming soon`);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  };

  return (
    <>
      <footer
        id="contact"
        className="relative overflow-hidden bg-[#08193a] px-5 pt-16 text-white sm:px-8"
      >
        {/* lime line that sweeps in across the top edge */}
        <motion.span
          aria-hidden
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: EASE }}
          className="absolute inset-x-0 top-0 h-px origin-left bg-gradient-to-r from-transparent via-brand to-transparent"
        />

        <motion.div
          variants={colWrap}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.9fr_0.9fr_1.2fr_1.6fr]"
        >
          {/* brand */}
          <motion.div variants={col}>
            <button
              onClick={() => goSection("home")}
              className="group flex items-center gap-2.5"
              aria-label="Green Power, back to top"
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-brand transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="#04122e">
                  <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
                </svg>
              </span>
              <span className="text-lg font-semibold tracking-tight">
                Green Power
              </span>
            </button>
            <p className="mt-5 max-w-[11rem] text-[13px] leading-relaxed text-white/80">
              Transforming Ideas into Clean Energy.
            </p>
          </motion.div>

          {/* quick links */}
          <motion.div variants={col}>
            <h4 className="text-[13px] font-semibold">Quick Links</h4>
            <ul className="mt-4 flex flex-col items-start gap-2.5">
              {QUICK_LINKS.map((l) => (
                <li key={l.label}>
                  <FooterLink
                    onClick={() => (l.to ? goPage(l.to) : goSection(l.id))}
                  >
                    {l.label}
                  </FooterLink>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* services */}
          <motion.div variants={col}>
            <h4 className="text-[13px] font-semibold">Our Services</h4>
            <ul className="mt-4 flex flex-col items-start gap-2.5">
              {SERVICES.map((s) => (
                <li key={s}>
                  <FooterLink onClick={() => goPage("/services")}>
                    {s}
                  </FooterLink>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* contact */}
          <motion.div variants={col}>
            <h4 className="text-[13px] font-semibold">Contact Us</h4>
            <div className="mt-4 flex flex-col gap-3">
              <ContactRow
                href="tel:+923331234567"
                icon={
                  <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
                }
              >
                +92 333 1234567
              </ContactRow>
              <ContactRow
                href="mailto:info@greenpower.com"
                icon={
                  <>
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                  </>
                }
              >
                info@greenpower.com
              </ContactRow>
              <ContactRow
                href="https://www.google.com/maps/search/?api=1&query=Karachi%2C+Pakistan"
                external
                icon={
                  <>
                    <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </>
                }
              >
                Karachi, Pakistan
              </ContactRow>
            </div>
          </motion.div>

          {/* newsletter */}
          <motion.div variants={col}>
            <h4 className="text-[13px] font-semibold">
              Subscribe to our newsletter
            </h4>
            <form onSubmit={subscribe} noValidate className="mt-4 flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status !== "idle") setStatus("idle");
                }}
                placeholder="Your email address"
                aria-label="Email address"
                className={`min-w-0 flex-1 rounded-xl border bg-white/5 px-4 py-3 text-[13px] text-white placeholder-white/50 outline-none transition focus:bg-white/10 ${
                  status === "error"
                    ? "border-red-400"
                    : "border-white/20 focus:border-brand"
                }`}
              />
              <motion.button
                type="submit"
                whileTap={{ scale: 0.92 }}
                aria-label="Subscribe"
                disabled={status === "loading"}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand text-[#04122e] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-8px_rgba(185,244,58,0.9)] disabled:opacity-70"
              >
                {status === "loading" ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#04122e]/30 border-t-[#04122e]" />
                ) : status === "done" ? (
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                )}
              </motion.button>
            </form>

            <div className="mt-2 h-4 text-xs" aria-live="polite">
              {status === "error" && (
                <span className="text-red-300">
                  Please enter a valid email address.
                </span>
              )}
              {status === "done" && (
                <span className="text-brand">Thanks, you're subscribed!</span>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* bottom bar */}
        <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-white/10 py-6 text-xs text-white/70 sm:flex-row">
          <p>© {new Date().getFullYear()} Green Power. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button
              onClick={() => soon("Privacy Policy")}
              className="transition-colors duration-300 hover:text-brand"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => soon("Terms of Service")}
              className="transition-colors duration-300 hover:text-brand"
            >
              Terms of Service
            </button>
          </div>
        </div>
      </footer>

      {/* "coming soon" toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="fixed bottom-6 left-1/2 z-[90] -translate-x-1/2 rounded-full border border-white/15 bg-[#0b2350]/95 px-5 py-3 text-sm text-white shadow-2xl backdrop-blur"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* back to top */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            whileHover={{ scale: 1.12, y: -3 }}
            whileTap={{ scale: 0.92 }}
            onClick={scrollToTop}
            aria-label="Back to top"
            className="fixed bottom-6 right-6 z-40 grid h-12 w-12 place-items-center rounded-full bg-brand text-[#04122e] shadow-[0_12px_30px_-8px_rgba(185,244,58,0.8)]"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 19V5M6 11l6-6 6 6" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}