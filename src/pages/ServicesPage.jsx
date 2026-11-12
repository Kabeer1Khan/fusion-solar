import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PageHero from "../components/PageHero";
import heroImg from "../assets/about_img/about_hero.webp";
import { startScroll, stopScroll } from "../lib/lenis";

const EASE = [0.22, 1, 0.36, 1];

/* Free Pexels photos and sample copy. Replace with your own. */
const SERVICES = [
  {
    title: "Solar Energy",
    desc: "Harness the power of the sun with our advanced solar solutions.",
    long: "Custom rooftop and ground-mounted solar systems designed around how you use energy, from the first site visit to installation and monitoring.",
    points: [
      "Free site assessment and system design",
      "Quality panels and inverters",
      "Installation, monitoring and support",
    ],
    img: "https://images.pexels.com/photos/17965455/pexels-photo-17965455.jpeg?auto=compress&cs=tinysrgb&w=1000&h=620&fit=crop",
    fallback: "from-sky-400 to-blue-900",
  },
  {
    title: "Wind Energy",
    desc: "Clean and reliable wind energy for a greener future.",
    long: "Wind solutions for farms, businesses and communities, with careful site selection to capture steady wind all year round.",
    points: [
      "Wind resource and site studies",
      "Turbine selection and installation",
      "Ongoing maintenance and performance tracking",
    ],
    img: "https://images.pexels.com/photos/243137/pexels-photo-243137.jpeg?auto=compress&cs=tinysrgb&w=1000&h=620&fit=crop",
    fallback: "from-sky-300 to-green-800",
  },
  {
    title: "Hydropower",
    desc: "Reliable and sustainable hydropower solutions.",
    long: "Small and medium hydropower systems that turn flowing water into dependable, around-the-clock clean power.",
    points: [
      "Feasibility and water-flow studies",
      "Turbine and civil works planning",
      "Grid connection and long-term support",
    ],
    img: "https://images.pexels.com/photos/10615221/pexels-photo-10615221.jpeg?auto=compress&cs=tinysrgb&w=1000&h=620&fit=crop",
    fallback: "from-teal-400 to-emerald-900",
  },
  {
    title: "Energy Storage",
    desc: "Store clean energy for when you need it most.",
    long: "Battery storage that keeps your extra solar and wind power, so you have electricity at night, during outages and at peak prices.",
    points: [
      "Home and commercial battery systems",
      "Backup power during outages",
      "Smart controls that help cut energy costs",
    ],
    img: "https://images.pexels.com/photos/6876536/pexels-photo-6876536.jpeg?auto=compress&cs=tinysrgb&w=1000&h=620&fit=crop",
    fallback: "from-blue-400 to-emerald-900",
  },
];

/* ---------- variants ---------- */
const cardIn = {
  hidden: { opacity: 0, y: 70 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: EASE, delay: (i % 2) * 0.14 },
  }),
};
/* the in-view trigger is on the card; the photo inherits it */
const imgClip = {
  hidden: { clipPath: "inset(0 0 100% 0 round 16px)" },
  show: {
    clipPath: "inset(0 0 0% 0 round 16px)",
    transition: { duration: 1.2, ease: EASE, delay: 0.2 },
  },
};

function Arrow({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-3.5 w-3.5 transition-transform duration-300 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/* ---------- one service card ---------- */
function ServiceCard({ s, i, onOpen }) {
  const [failed, setFailed] = useState(false);

  /* cursor-follow light on the photo */
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <motion.div
      variants={cardIn}
      custom={i}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
    >
      <div
        role="button"
        tabIndex={0}
        aria-label={`Learn more about ${s.title}`}
        onClick={() => onOpen(i)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onOpen(i);
          }
        }}
        className="group cursor-pointer rounded-[22px] border border-white bg-gradient-to-b from-[#eaf3ff] to-[#f6faff] p-3 shadow-[0_18px_50px_-34px_rgba(10,60,140,0.5)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_34px_70px_-30px_rgba(10,60,140,0.6)] focus-visible:-translate-y-2"
      >
        {/* photo */}
        <motion.div
          variants={imgClip}
          onMouseMove={onMove}
          className="relative aspect-[1.65] overflow-hidden rounded-2xl bg-[#0b3a7a]"
        >
          <div className="h-full w-full transition-transform duration-[1100ms] ease-out group-hover:scale-110">
            {failed ? (
              <div className={`h-full w-full bg-gradient-to-br ${s.fallback}`} />
            ) : (
              <img
                src={s.img}
                alt={s.title}
                loading="lazy"
                draggable={false}
                onError={() => setFailed(true)}
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#04122e]/35 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 [background:radial-gradient(220px_circle_at_var(--mx,50%)_var(--my,50%),rgba(255,255,255,0.25),transparent_65%)]" />
        </motion.div>

        {/* title + arrow */}
        <div className="flex items-center justify-between gap-4 px-2 pt-5">
          <h3 className="text-xl font-semibold tracking-tight text-[#0b1a2c] transition-transform duration-500 group-hover:translate-x-1">
            {s.title}
          </h3>
          <span
            aria-hidden
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand text-[#04122e] transition-all duration-500 group-hover:scale-110 group-hover:bg-[#04122e] group-hover:text-brand"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 transition-transform duration-500 group-hover:-rotate-45"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </div>

        <p className="max-w-[24rem] px-2 pb-3 pt-2 text-sm leading-relaxed text-slate-500">
          {s.desc}
        </p>
      </div>
    </motion.div>
  );
}

/* ---------- detail pop-up ---------- */
function ServiceModal({ index, onClose, onQuote }) {
  const open = index !== null;
  const last = useRef(0);
  if (open) last.current = index;
  const s = SERVICES[last.current];

  useEffect(() => {
    if (!open) return;
    stopScroll();
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      startScroll();
    };
  }, [open, onClose]);

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
            className="absolute inset-0 bg-[#020b1f]/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={s.title}
            data-lenis-prevent
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="relative grid max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl md:grid-cols-[1fr_1.1fr] md:overflow-hidden"
          >
            <div className="relative h-52 bg-[#0b3a7a] md:h-auto md:min-h-[26rem]">
              <img
                src={s.img}
                alt={s.title}
                className="absolute inset-0 h-full w-full object-cover"
                draggable={false}
              />
            </div>

            <div className="p-7 sm:p-8">
              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/90 shadow transition duration-300 hover:rotate-90 hover:bg-brand"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  stroke="#0b1a2c"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>

              <span className="inline-block rounded-full bg-[#e6f8b0] px-3.5 py-1 text-xs font-medium uppercase tracking-wide text-[#2b3a12]">
                Service
              </span>
              <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[#0b1a2c]">
                {s.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {s.long}
              </p>

              <ul className="mt-5 space-y-2.5">
                {s.points.map((p, i) => (
                  <motion.li
                    key={p}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.1, duration: 0.5, ease: EASE }}
                    className="flex items-start gap-2.5 text-sm text-slate-700"
                  >
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand text-[#04122e]">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-3 w-3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12.5l4.5 4.5L19 7.5" />
                      </svg>
                    </span>
                    {p}
                  </motion.li>
                ))}
              </ul>

              <button
                onClick={onQuote}
                className="group relative mt-7 inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-brand px-6 py-3.5 text-sm font-medium text-[#04122e] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-12px_rgba(130,190,10,1)]"
              >
                <span className="pointer-events-none absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-white/55 transition-all duration-700 group-hover:left-[160%]" />
                <span className="relative">Get a free quote</span>
                <Arrow className="relative group-hover:translate-x-1.5" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- page ---------- */
export default function ServicesPage({ onQuote }) {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <>
      <PageHero
        title="Our Services"
        subtitle="Clean Energy Solutions for a Better Tomorrow"
        image={heroImg}
        alt="Wind turbines in a green landscape"
      />

      <section className="relative z-20 -mt-8 overflow-hidden rounded-t-[2.5rem] bg-gradient-to-b from-white via-[#f7fbff] to-[#f3f8ff] px-5 pb-24 pt-16 shadow-[0_-24px_60px_-24px_rgba(0,30,90,0.45)] sm:-mt-10 sm:rounded-t-[3rem] sm:px-8 sm:pb-32 sm:pt-24">
        <motion.div
          aria-hidden
          animate={{ x: [0, 30, 0], y: [0, 24, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-brand/20 blur-3xl"
        />
        <motion.div
          aria-hidden
          animate={{ x: [0, -30, 0], y: [0, -24, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-sky-300/25 blur-3xl"
        />

        <div className="relative z-10 mx-auto grid max-w-5xl gap-7 sm:grid-cols-2">
          {SERVICES.map((s, i) => (
            <ServiceCard key={s.title} s={s} i={i} onOpen={setOpenIdx} />
          ))}
        </div>
      </section>

      <ServiceModal
        index={openIdx}
        onClose={() => setOpenIdx(null)}
        onQuote={() => {
          setOpenIdx(null);
          onQuote();
        }}
      />
    </>
  );
}