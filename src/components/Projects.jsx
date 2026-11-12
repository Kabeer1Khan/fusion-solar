import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { startScroll, stopScroll } from "../lib/lenis";

const EASE = [0.22, 1, 0.36, 1];

/* Sample data and free Pexels photos. Replace with your real projects. */
const PROJECTS = [
  {
    title: "Ground-Mounted Solar",
    tag: "Solar",
    capacity: "2.4 MW",
    desc: "Tilted panel arrays built for steady, high-yield output on open land.",
    img: "https://images.pexels.com/photos/16586163/pexels-photo-16586163.jpeg?auto=compress&cs=tinysrgb&w=1000&h=1100&fit=crop",
    fallback: "from-sky-400 to-blue-900",
  },
  {
    title: "Hilltop Wind Farm",
    tag: "Wind",
    capacity: "6.0 MW",
    desc: "Turbines placed along the ridge to catch consistent wind all year.",
    img: "https://images.pexels.com/photos/31277037/pexels-photo-31277037.jpeg?auto=compress&cs=tinysrgb&w=1000&h=1100&fit=crop",
    fallback: "from-sky-300 to-green-800",
  },
  {
    title: "Residential Rooftop",
    tag: "Residential",
    capacity: "8 kW",
    desc: "A complete rooftop system sized for the way a family uses power.",
    img: "https://images.pexels.com/photos/17965455/pexels-photo-17965455.jpeg?auto=compress&cs=tinysrgb&w=1000&h=1100&fit=crop",
    fallback: "from-orange-300 to-blue-800",
  },
  {
    title: "Solar Power Plant",
    tag: "Utility",
    capacity: "12 MW",
    desc: "Long rows of panels delivering clean power to the local grid.",
    img: "https://images.pexels.com/photos/4320481/pexels-photo-4320481.jpeg?auto=compress&cs=tinysrgb&w=1000&h=1100&fit=crop",
    fallback: "from-blue-400 to-emerald-900",
  },
];

/* ---------- variants ---------- */
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};
const rise = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};
const words = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } };
const word = {
  hidden: { y: "115%" },
  show: { y: 0, transition: { duration: 0.9, ease: EASE } },
};
const row = { hidden: {}, show: { transition: { staggerChildren: 0.14 } } };
const cardIn = {
  hidden: { opacity: 0, y: 70, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 1, ease: EASE },
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

/* ---------- one gallery card ---------- */
function ProjectCard({ p, i, active, setActive, onOpen }) {
  const ref = useRef(null);
  const [failed, setFailed] = useState(false);

  /* photo drifts slowly while you scroll past */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  const dimmed = active !== null && active !== i;

  return (
    /* flex item: grows when active (desktop accordion) */
    <div
      className="min-w-0 transition-[flex-grow] duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] md:basis-0"
      style={{ flexGrow: active === i ? 2.4 : 1 }}
    >
      <motion.div variants={cardIn} className="h-full">
        <div
          ref={ref}
          role="button"
          tabIndex={0}
          aria-label={`View project: ${p.title}`}
          onClick={() => onOpen(i)}
          onMouseEnter={() => setActive(i)}
          onFocus={() => setActive(i)}
          onBlur={() => setActive(null)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onOpen(i);
            }
          }}
          className="group relative h-64 w-full cursor-pointer overflow-hidden rounded-2xl bg-[#0b3a7a] sm:h-72 md:h-full"
        >
          {/* photo (parallax wrapper > hover zoom wrapper > image) */}
          <motion.div
            style={{ y }}
            className="absolute inset-x-0 -top-[8%] h-[116%]"
          >
            <div className="h-full w-full transition-transform duration-[1100ms] ease-out group-hover:scale-105">
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
          </motion.div>

          {/* shading */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#04122e]/85 via-[#04122e]/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-100" />
          {/* neighbours go a little darker so the active card stands out */}
          <div
            className={`pointer-events-none absolute inset-0 bg-[#04122e]/40 transition-opacity duration-500 ${
              dimmed ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* tag */}
          <span className="absolute left-3 top-3 -translate-y-2 rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-[#0b1a2c] opacity-0 backdrop-blur transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100">
            {p.tag}
          </span>

          {/* expand icon */}
          <span
            aria-hidden
            className="absolute right-3 top-3 grid h-9 w-9 scale-75 place-items-center rounded-full bg-brand text-[#04122e] opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100 [@media(hover:none)]:scale-100 [@media(hover:none)]:opacity-100"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 17 17 7M9 7h8v8" />
            </svg>
          </span>

          {/* title + capacity */}
          <div className="absolute inset-x-0 bottom-0 translate-y-3 p-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100">
            <h3 className="truncate text-base font-semibold text-white">
              {p.title}
            </h3>
            <p className="mt-0.5 truncate text-xs text-white/80">
              Capacity {p.capacity}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ---------- lightbox ---------- */
function Lightbox({ index, onClose, onNav, onQuote }) {
  const open = index !== null;
  const last = useRef(0);
  if (open) last.current = index;
  const p = PROJECTS[last.current];

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
            className="relative grid max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-[1.4fr_1fr]"
          >
            {/* photo */}
            <div className="relative h-60 overflow-hidden bg-[#0b3a7a] sm:h-80 md:h-[30rem]">
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

            {/* details */}
            <div className="flex flex-col p-6 sm:p-8">
              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/90 shadow transition duration-300 hover:rotate-90 hover:bg-brand md:bg-slate-100"
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
                  className="md:mt-6"
                >
                  <span className="inline-block rounded-full bg-[#e6f8b0] px-3.5 py-1 text-xs font-medium text-[#2b3a12]">
                    {p.tag}
                  </span>
                  <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[#0b1a2c]">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
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
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 rotate-180"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>
                <button
                  onClick={() => onNav(1)}
                  aria-label="Next project"
                  className={circle}
                >
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
                </button>
                <span className="ml-1 text-sm text-slate-500">
                  {last.current + 1} / {PROJECTS.length}
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

/* ---------- section ---------- */
export default function Projects({ onQuote }) {
  const navigate = useNavigate();
  const [active, setActive] = useState(null); // hovered card (desktop accordion)
  const [openIdx, setOpenIdx] = useState(null); // lightbox

  const close = useCallback(() => setOpenIdx(null), []);
  const nav = useCallback(
    (d) =>
      setOpenIdx((i) =>
        i === null ? i : (i + d + PROJECTS.length) % PROJECTS.length
      ),
    []
  );
  const quote = () => {
    setOpenIdx(null);
    onQuote();
  };

  return (
    <section
      id="projects"
      style={{ backgroundColor: "#f3f8ff" }}
      className="relative overflow-hidden px-5 pb-24 pt-0 sm:px-8 sm:pb-32"
    >
      <div className="mx-auto max-w-6xl">
        {/* header */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <motion.span
              variants={rise}
              className="inline-block rounded-full bg-[#e6f8b0] px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-[#2b3a12]"
            >
              Projects
            </motion.span>
            <motion.h2
              variants={words}
              className="mt-6 text-3xl font-semibold tracking-tight text-[#0b1a2c] sm:text-4xl"
            >
              {"Our Recent Projects".split(" ").map((w) => (
                <span
                  key={w}
                  className="mr-[0.25em] inline-block overflow-hidden pb-[0.12em] align-bottom last:mr-0"
                >
                  <motion.span variants={word} className="inline-block">
                    {w}
                  </motion.span>
                </span>
              ))}
            </motion.h2>
          </div>

          <motion.p
            variants={rise}
            className="max-w-[17rem] text-sm leading-relaxed text-slate-600 md:pb-1"
          >
            Explore some of our latest renewable energy projects around the
            world.
          </motion.p>
        </motion.div>

        {/* gallery: 2x2 on phones/tablets, expanding row on desktop */}
        <motion.div
          variants={row}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          onMouseLeave={() => setActive(null)}
          className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 md:flex md:h-[340px] md:gap-4"
        >
          {PROJECTS.map((p, i) => (
            <ProjectCard
              key={p.title}
              p={p}
              i={i}
              active={active}
              setActive={setActive}
              onOpen={setOpenIdx}
            />
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="mt-12 flex justify-center"
        >
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/projects")}
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-brand px-7 py-3.5 text-sm font-medium text-[#04122e] shadow-[0_12px_30px_-12px_rgba(130,190,10,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-12px_rgba(130,190,10,1)]"
          >
            <span className="pointer-events-none absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-white/55 transition-all duration-700 group-hover:left-[160%]" />
            <Arrow className="relative group-hover:translate-x-1" />
            <span className="relative">View all projects</span>
            <Arrow className="relative group-hover:translate-x-1.5" />
          </motion.button>
        </motion.div>
      </div>

      <Lightbox index={openIdx} onClose={close} onNav={nav} onQuote={quote} />
    </section>
  );
}