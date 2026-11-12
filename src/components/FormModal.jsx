import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { startScroll, stopScroll } from "../lib/lenis";

const COPY = {
  quote: {
    title: "Get a free quote",
    sub: "Tell us about your property and we'll send a custom solar estimate within 24 hours.",
    cta: "Request quote",
    done: "Quote requested",
    doneSub: "Our team will contact you within 24 hours.",
  },
  register: {
    title: "Create your account",
    sub: "Join 200+ satisfied clients and track your solar project in one place.",
    cta: "Register",
    done: "You're registered",
    doneSub: "Check your inbox to confirm your email.",
  },
};

const input =
  "w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 outline-none transition focus:border-brand focus:bg-white/15";

export default function FormModal({ mode, onClose }) {
  const open = Boolean(mode);
  const last = useRef(mode || "quote");
  if (mode) last.current = mode;
  const c = COPY[last.current];
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    if (!open) return;
    setStatus("idle");
    stopScroll();
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      startScroll();
    };
  }, [open, onClose]);

  const submit = (e) => {
    e.preventDefault();
    setStatus("loading");
    setTimeout(() => setStatus("done"), 1000);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md rounded-3xl border border-white/20 bg-[#0a3a8a]/90 p-7 shadow-2xl backdrop-blur-2xl"
            data-lenis-prevent
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/10 transition duration-300 hover:rotate-90 hover:bg-white/20"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>

            {status === "done" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center py-8 text-center"
              >
                <span className="grid h-16 w-16 place-items-center rounded-full bg-brand">
                  <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="#04122e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <motion.path
                      d="M5 12.5l4.5 4.5L19 7.5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.15 }}
                    />
                  </svg>
                </span>
                <h3 className="mt-5 text-xl font-semibold">{c.done}</h3>
                <p className="mt-1.5 text-sm text-white/75">{c.doneSub}</p>
                <button
                  onClick={onClose}
                  className="mt-6 rounded-full bg-white px-6 py-2.5 text-sm font-medium text-[#04122e] transition hover:bg-brand"
                >
                  Close
                </button>
              </motion.div>
            ) : (
              <>
                <h3 className="pr-10 text-2xl font-semibold tracking-tight">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75">{c.sub}</p>

                <form onSubmit={submit} className="mt-6 space-y-3">
                  <input required className={input} placeholder="Full name" />
                  <input required type="email" className={input} placeholder="Email address" />
                  <input required type="tel" className={input} placeholder="Phone number" />
                  {last.current === "quote" ? (
                    <select
                      required
                      defaultValue=""
                      className={`${input} [&>option]:text-black`}
                    >
                      <option value="" disabled>
                        Property type
                      </option>
                      <option>Home</option>
                      <option>Business</option>
                      <option>Industrial</option>
                    </select>
                  ) : (
                    <input required type="password" minLength={6} className={input} placeholder="Password (min. 6 characters)" />
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={status === "loading"}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3.5 text-sm font-semibold text-[#04122e] transition-opacity disabled:opacity-70"
                  >
                    {status === "loading" ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#04122e]/30 border-t-[#04122e]" />
                        Sending
                      </>
                    ) : (
                      c.cta
                    )}
                  </motion.button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}