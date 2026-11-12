import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import PageHero from "../components/PageHero";
import heroImg from "../assets/about_img/about_hero.webp";
import whoImg from "../assets/about_img/about_img.webp";
import { startScroll, stopScroll } from "../lib/lenis";

const EASE = [0.22, 1, 0.36, 1];

/* ---------- variants ---------- */
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } },
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
/* the in-view trigger sits on the unclipped wrapper, children inherit it */
const imgWrap = { hidden: {}, show: {} };
const imgClip = {
  hidden: { clipPath: "inset(0 0 100% 0 round 28px)" },
  show: {
    clipPath: "inset(0 0 0% 0 round 28px)",
    transition: { duration: 1.3, ease: EASE },
  },
};
const imgZoom = {
  hidden: { scale: 1.12 },
  show: { scale: 1, transition: { duration: 1.8, ease: EASE } },
};
const statsWrap = {
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: EASE, staggerChildren: 0.15, delayChildren: 0.2 },
  },
};
const statIn = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

/* ---------- helpers ---------- */
function Words({ text }) {
  return text.split(" ").map((w, i) => (
    <span
      key={w + i}
      className="mr-[0.25em] inline-block overflow-hidden pb-[0.12em] align-bottom last:mr-0"
    >
      <motion.span variants={word} className="inline-block">
        {w}
      </motion.span>
    </span>
  ));
}

function CountUp({ to, suffix = "", delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [v, setV] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, {
      duration: 1.8,
      delay,
      ease: "easeOut",
      onUpdate: setV,
    });
    return () => c.stop();
  }, [inView, to, delay]);

  return (
    <span ref={ref}>
      {Math.round(v)}
      {suffix}
    </span>
  );
}

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

const iconProps = {
  viewBox: "0 0 24 24",
  className: "h-9 w-9",
  fill: "currentColor",
  fillOpacity: 0.18,
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};
const LeafIcon = () => (
  <svg {...iconProps}>
    <path d="M5 19c0-9 5-14 15-14 0 10-5 15-14 15" />
    <path d="M5 19c3-5 6-8 11-10" fill="none" />
  </svg>
);
const PeopleIcon = () => (
  <svg {...iconProps}>
    <circle cx="12" cy="8" r="3" />
    <circle cx="5.5" cy="9.5" r="2.2" />
    <circle cx="18.5" cy="9.5" r="2.2" />
    <path d="M6.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5z" />
    <path d="M1.5 17c0-2 1.5-3.500 4-3.500M22.500 17c0-2-1.500-3.500-4-3.500" fill="none" />
  </svg>
);
const BoltIcon = () => (
  <svg {...iconProps}>
    <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
  </svg>
);

const STATS = [
  { to: 10, suffix: "+", label: "Years Experience", icon: <LeafIcon /> },
  { to: 5, suffix: "K+", label: "Happy Clients", icon: <PeopleIcon /> },
  { to: 100, suffix: "+", label: "Projects Completed", icon: <BoltIcon /> },
];

const PILLARS = [
  { t: "Accessible", d: "Clean energy within reach of every home and business." },
  { t: "Affordable", d: "Honest pricing and smart options that fit your budget." },
  { t: "Reliable", d: "Systems built and maintained to perform year after year." },
];

/* ---------- Who we are ---------- */
function WhoWeAre({ onMission }) {
  /* mouse-driven depth on the photo */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 110, damping: 18 });
  const sy = useSpring(my, { stiffness: 110, damping: 18 });
  const rotY = useTransform(sx, [-0.5, 0.5], [-7, 7]);
  const rotX = useTransform(sy, [-0.5, 0.5], [6, -6]);
  const frameX = useTransform(sx, [-0.5, 0.5], [14, -14]);
  const frameY = useTransform(sy, [-0.5, 0.5], [12, -12]);

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <section className="relative z-20 -mt-8 overflow-hidden rounded-t-[2.5rem] bg-gradient-to-b from-white via-[#f7fbff] to-[#f3f8ff] px-5 pb-20 pt-20 shadow-[0_-24px_60px_-24px_rgba(0,30,90,0.45)] sm:-mt-10 sm:rounded-t-[3rem] sm:px-8 sm:pb-24 sm:pt-28">
      <motion.div
        aria-hidden
        animate={{ x: [0, 30, 0], y: [0, 24, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-brand/25 blur-3xl"
      />

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2 lg:gap-20">
        {/* copy */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="max-w-lg"
        >
          <motion.h2
            variants={words}
            className="text-3xl font-semibold tracking-tight text-[#0b1a2c] sm:text-4xl"
          >
            <Words text="Who We Are" />
          </motion.h2>

          <motion.p
            variants={rise}
            className="mt-6 text-[15px] leading-relaxed text-slate-600"
          >
            Green Power is a leading renewable energy company, dedicated to
            creating a sustainable future through innovative solar, wind, and
            clean energy solutions.
          </motion.p>
          <motion.p
            variants={rise}
            className="mt-5 text-[15px] leading-relaxed text-slate-600"
          >
            Our mission is to make clean energy accessible, affordable, and
            reliable for everyone, everywhere.
          </motion.p>

          <motion.div variants={rise} className="mt-9">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onMission}
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-brand px-7 py-3.5 text-sm font-medium text-[#04122e] shadow-[0_12px_30px_-12px_rgba(130,190,10,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-12px_rgba(130,190,10,1)]"
            >
              <span className="pointer-events-none absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-white/55 transition-all duration-700 group-hover:left-[160%]" />
              <span className="relative">Our Mission</span>
              <Arrow className="relative group-hover:translate-x-1.5" />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* photo */}
        <div
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          style={{ perspective: 1100 }}
          className="relative mx-auto w-full max-w-[440px] lg:ml-auto lg:mr-0"
        >
          <motion.div
            variants={imgWrap}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            style={{ rotateX: rotX, rotateY: rotY }}
            className="relative aspect-[3/4] w-full"
          >
            {/* outline frame that drifts the opposite way */}
            <motion.span
              aria-hidden
              style={{ x: frameX, y: frameY }}
              className="absolute -bottom-4 -right-4 h-full w-full rounded-[28px] border-2 border-brand/70"
            />
            <motion.div
              variants={imgClip}
              className="group relative h-full w-full overflow-hidden rounded-[28px] bg-[#cfe6ff] shadow-[0_30px_70px_-25px_rgba(10,50,120,0.55)]"
            >
              <div className="h-full w-full transition-transform duration-700 group-hover:scale-105">
                <motion.img
                  src={whoImg}
                  alt="Solar panels in a field at sunset"
                  variants={imgZoom}
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ---------- stats ---------- */
function Stats() {
  return (
    <section className="bg-[#f3f8ff] px-5 pb-24 sm:px-8 sm:pb-28">
      <motion.div
        variants={statsWrap}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="mx-auto grid max-w-6xl divide-y divide-[#d6e4f4] overflow-hidden rounded-3xl border border-white bg-gradient-to-b from-[#e7f1fd] to-[#f4f9ff] shadow-[0_24px_60px_-36px_rgba(10,60,140,0.45)] sm:grid-cols-3 sm:divide-x sm:divide-y-0"
      >
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            variants={statIn}
            whileHover="hover"
            className="flex flex-col items-center px-6 py-10 text-center transition-colors duration-300 hover:bg-white/60"
          >
            <motion.span
              variants={{
                hover: {
                  y: -8,
                  scale: 1.18,
                  rotate: [0, -10, 10, 0],
                  transition: { type: "spring", stiffness: 300, damping: 12 },
                },
              }}
              className="text-[#7cc20f]"
            >
              {s.icon}
            </motion.span>
            <p className="mt-4 text-3xl font-semibold tracking-tight text-[#0b1a2c] sm:text-4xl">
              <CountUp to={s.to} suffix={s.suffix} delay={0.4 + i * 0.15} />
            </p>
            <p className="mt-1.5 text-sm text-slate-500">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

/* ---------- mission pop-up ---------- */
function MissionModal({ open, onClose, onQuote }) {
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
            aria-label="Our mission"
            data-lenis-prevent
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-7 shadow-2xl sm:p-9"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-slate-100 transition duration-300 hover:rotate-90 hover:bg-brand"
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
              Our Mission
            </span>
            <h3 className="mt-4 pr-8 text-2xl font-semibold leading-snug tracking-tight text-[#0b1a2c]">
              Clean energy for everyone, everywhere.
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              We make clean energy accessible, affordable, and reliable, so
              every home and business can be part of a sustainable future.
            </p>

            <ul className="mt-6 space-y-3">
              {PILLARS.map((p, i) => (
                <motion.li
                  key={p.t}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.1, duration: 0.5, ease: EASE }}
                  className="flex gap-3 rounded-2xl bg-[#f3f8ff] p-4 transition-colors duration-300 hover:bg-[#e8f2ff]"
                >
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand text-[#04122e]">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-3.5 w-3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12.5l4.5 4.5L19 7.5" />
                    </svg>
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-[#0b1a2c]">
                      {p.t}
                    </span>
                    <span className="mt-0.5 block text-[13px] leading-snug text-slate-600">
                      {p.d}
                    </span>
                  </span>
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- page ---------- */
export default function AboutPage({ onQuote }) {
  const [mission, setMission] = useState(false);

  return (
    <>
      <PageHero
        title="About Us"
        subtitle="Powering a Greener Tomorrow"
        image={heroImg}
        alt="Wind turbines in a green landscape"
      />
      <WhoWeAre onMission={() => setMission(true)} />
      <Stats />
      <MissionModal
        open={mission}
        onClose={() => setMission(false)}
        onQuote={() => {
          setMission(false);
          onQuote();
        }}
      />
    </>
  );
}