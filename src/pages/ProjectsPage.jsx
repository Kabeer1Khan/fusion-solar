import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PageHero from "../components/PageHero";
import heroImg from "../assets/about_img/about_hero.webp";
import { startScroll, stopScroll } from "../lib/lenis";

const EASE = [0.22, 1, 0.36, 1];
const FIRST_BATCH = 4;

/* Sample projects and free Pexels photos. Replace with your real work.
   The first 4 show at once, the rest appear when "View More Projects" is clicked. */
const PROJECTS = [
  {
    title: "Solar Farm",
    location: "Karachi, Pakistan",
    tag: "Solar",
    capacity: "12 MW",
    desc: "Long rows of panels delivering clean power to the local grid.",
    img: "https://images.pexels.com/photos/4320481/pexels-photo-4320481.jpeg?auto=compress&cs=tinysrgb&w=1000&h=620&fit=crop",
    fallback: "from-blue-400 to-emerald-900",
  },
  {
    title: "Wind Farm",
    location: "Sindh, Pakistan",
    tag: "Wind",
    capacity: "6.0 MW",
    desc: "Turbines placed to catch steady wind across open farmland.",
    img: "https://images.pexels.com/photos/31277037/pexels-photo-31277037.jpeg?auto=compress&cs=tinysrgb&w=1000&h=620&fit=crop",
    fallback: "from-sky-300 to-green-800",
  },
  {
    title: "Green Homes",
    location: "Pakistan",
    tag: "Residential",
    capacity: "8 kW per home",
    desc: "Rooftop solar for a whole neighbourhood of modern homes.",
    img: "https://images.pexels.com/photos/12224996/pexels-photo-12224996.jpeg?auto=compress&cs=tinysrgb&w=1000&h=620&fit=crop",
    fallback: "from-orange-300 to-blue-800",
  },
  {
    title: "Solar Park",
    location: "Balochistan, Pakistan",
    tag: "Solar",
    capacity: "5 MW",
    desc: "Tilted ground-mounted arrays built for high yield on open land.",
    img: "https://images.pexels.com/photos/16586163/pexels-photo-16586163.jpeg?auto=compress&cs=tinysrgb&w=1000&h=620&fit=crop",
    fallback: "from-sky-400 to-blue-900",
  },
  {
    title: "Rooftop Solar Hub",
    location: "Lahore, Pakistan",
    tag: "Commercial",
    capacity: "900 kW",
    desc: "Rooftop systems that cut daily power costs for local businesses.",
    img: "https://images.pexels.com/photos/17965455/pexels-photo-17965455.jpeg?auto=compress&cs=tinysrgb&w=1000&h=620&fit=crop",
    fallback: "from-sky-400 to-indigo-900",
  },
  {
    title: "Coastal Wind Project",
    location: "Gharo, Sindh",
    tag: "Wind",
    capacity: "9 MW",
    desc: "Coastal turbines taking advantage of strong, reliable sea winds.",
    img: "https://images.pexels.com/photos/243137/pexels-photo-243137.jpeg?auto=compress&cs=tinysrgb&w=1000&h=620&fit=crop",
    fallback: "from-sky-300 to-teal-800",
  },
  {
    title: "Hydropower Plant",
    location: "Swat, Khyber Pakhtunkhwa",
    tag: "Hydro",
    capacity: "4 MW",
    desc: "Run-of-river power that turns flowing water into steady energy.",
    img: "https://images.pexels.com/photos/10615221/pexels-photo-10615221.jpeg?auto=compress&cs=tinysrgb&w=1000&h=620&fit=crop",
    fallback: "from-teal-400 to-emerald-900",
  },
  {
    title: "Energy Storage Hub",
    location: "Islamabad, Pakistan",
    tag: "Storage",
    capacity: "20 MWh",
    desc: "Large battery storage that keeps clean power ready for peak hours.",
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

function Pin({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-3.5 w-3.5 shrink-0 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

/* ---------- one project card ---------- */
function ProjectCard({ p, i, onOpen }) {
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
      custom={i % FIRST_BATCH}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
    >
      <div
        role="button"
        tabIndex={0}
        aria-label={`View project: ${p.title}, ${p.location}`}
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
              <div className={`h-full w-full bg-gradient-to-br ${p.fallback}`} />
            ) : (
              <img
                src={p.img}
                alt={p.title}
                loading="lazy"
                draggable={false}
                onError={() => setFailed(true)}
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#04122e]/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 [background:radial-gradient(220px_circle_at_var(--mx,50%)_var(--my,50%),rgba(255,255,255,0.25),transparent_65%)]" />

          {/* tag */}
          <span className="absolute left-3 top-3 -translate-y-2 rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-[#0b1a2c] opacity-0 backdrop-blur transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100">
            {p.tag}
          </span>
        </motion.div>

        {/* title + location + arrow */}
        <div className="flex items-center justify-between gap-4 px-2 pb-3 pt-5">
          <div className="min-w-0 transition-transform duration-500 group-hover:translate-x-1">
            <h3 className="truncate text-xl font-semibold tracking-tight text-[#0b1a2c]">
              {p.title}
            </h3>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
              <Pin className="text-[#7cc20f]" />
              <span className="truncate">{p.location}</span>
            </p>
          </div>
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
      </div>
    </motion.div>
  );
}

/* ---------- detail pop-up with previous / next ---------- */
function ProjectModal({ index, list, onClose, onNav, onQuote }) {
  const open = index !== null;
  const last = useRef(0);
  if (open) last.current = Math.min(index, list.length - 1);
  const p = list[last.current];

  useEffect(() => {
    if (!open) return;
    stopScroll();
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNav(1);
      if (e.key === "ArrowLeft") onNav(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      startScroll();
    };
  }, [open, onClose, onNav]);

  const circle =
    "grid h-11 w-11 place-items-center rounded-full border border-slate-200 text-[#0b1a2c] transition-all duration-300 hover:border-transparent hover:bg-brand active:scale-90";

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
            className="absolute inset-0 bg-[#020b1f]/75 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={p.title}
            data-lenis-prevent
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="relative grid max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl md:grid-cols-[1.3fr_1fr] md:overflow-hidden"
          >
            <div className="relative h-56 overflow-hidden bg-[#0b3a7a] sm:h-72 md:h-auto md:min-h-[28rem]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.img
                  key={last.current}
                  src={p.img}
                  alt={p.title}
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="absolute inset-0 h-full w-full object-cover"
                  draggable={false}
                />
              </AnimatePresence>
            </div>

            <div className="flex flex-col p-6 sm:p-8">
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

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={last.current}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="md:mt-4"
                >
                  <span className="inline-block rounded-full bg-[#e6f8b0] px-3.5 py-1 text-xs font-medium text-[#2b3a12]">
                    {p.tag}
                  </span>
                  <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[#0b1a2c]">
                    {p.title}
                  </h3>
                  <p className="mt-1.5 flex items-center gap-1.5 text-sm text-slate-500">
                    <Pin className="text-[#7cc20f]" />
                    {p.location}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-slate-600">
                    {p.desc}
                  </p>
                  <dl className="mt-5 flex gap-8 border-t border-slate-200 pt-5 text-sm">
                    <div>
                      <dt className="text-slate-500">Capacity</dt>
                      <dd className="mt-0.5 text-lg font-semibold text-[#0b1a2c]">
                        {p.capacity}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Type</dt>
                      <dd className="mt-0.5 text-lg font-semibold text-[#0b1a2c]">
                        {p.tag}
                      </dd>
                    </div>
                  </dl>
                </motion.div>
              </AnimatePresence>

              <div className="mt-6 flex items-center gap-3 md:mt-auto md:pt-6">
                <button
                  onClick={() => onNav(-1)}
                  aria-label="Previous project"
                  className={circle}
                >
                  <Arrow className="h-4 w-4 rotate-180" />
                </button>
                <button
                  onClick={() => onNav(1)}
                  aria-label="Next project"
                  className={circle}
                >
                  <Arrow className="h-4 w-4" />
                </button>
                <span className="ml-1 text-sm text-slate-500">
                  {last.current + 1} / {list.length}
                </span>
              </div>

              <button
                onClick={onQuote}
                className="group relative mt-5 inline-flex items-center justify-center gap-3 overflow-hidden rounded-full bg-brand px-6 py-3.5 text-sm font-medium text-[#04122e] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-12px_rgba(130,190,10,1)]"
              >
                <span className="pointer-events-none absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-white/55 transition-all duration-700 group-hover:left-[160%]" />
                <span className="relative">Get a similar quote</span>
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
export default function ProjectsPage({ onQuote }) {
  const [showAll, setShowAll] = useState(false);
  const [openIdx, setOpenIdx] = useState(null);

  const list = showAll ? PROJECTS : PROJECTS.slice(0, FIRST_BATCH);

  const close = useCallback(() => setOpenIdx(null), []);
  const nav = useCallback(
    (d) =>
      setOpenIdx((i) =>
        i === null ? i : (i + d + list.length) % list.length
      ),
    [list.length]
  );

  return (
    <>
      <PageHero
        title="Our Projects"
        subtitle="Innovation in Action"
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

        <div className="relative z-10 mx-auto max-w-5xl">
          <div className="grid gap-7 sm:grid-cols-2">
            {list.map((p, i) => (
              <ProjectCard key={p.title} p={p} i={i} onOpen={setOpenIdx} />
            ))}
          </div>

          {/* load more / start a project */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="mt-14 flex justify-center"
          >
            <motion.button
              key={showAll ? "start" : "more"}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: EASE }}
              whileTap={{ scale: 0.95 }}
              onClick={showAll ? onQuote : () => setShowAll(true)}
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-brand px-7 py-3.5 text-sm font-medium text-[#04122e] shadow-[0_12px_30px_-12px_rgba(130,190,10,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-12px_rgba(130,190,10,1)]"
            >
              <span className="pointer-events-none absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-white/55 transition-all duration-700 group-hover:left-[160%]" />
              <Arrow className="relative group-hover:translate-x-1" />
              <span className="relative">
                {showAll ? "Start Your Project" : "View More Projects"}
              </span>
              <Arrow className="relative group-hover:translate-x-1.5" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      <ProjectModal
        index={openIdx}
        list={list}
        onClose={close}
        onNav={nav}
        onQuote={() => {
          setOpenIdx(null);
          onQuote();
        }}
      />
    </>
  );
}