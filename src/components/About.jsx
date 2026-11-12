import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import aboutImg from "../assets/hero_img/about_img.webp";
import { useNavigate } from "react-router-dom";

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
const words = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};
const word = {
  hidden: { y: "115%" },
  show: { y: 0, transition: { duration: 0.9, ease: EASE } },
};

/* Image reveal. The in-view trigger lives on the (unclipped) wrapper and the
   children inherit it, because an element that is fully clipped never counts
   as "in view" and would stay invisible forever. */
const imgWrap = { hidden: {}, show: {} };
const imgClip = {
  hidden: { clipPath: "inset(0 0 100% 0 round 24px)" },
  show: {
    clipPath: "inset(0 0 0% 0 round 24px)",
    transition: { duration: 1.3, ease: EASE },
  },
};
const imgZoom = {
  hidden: { scale: 1.12 },
  show: { scale: 1, transition: { duration: 1.8, ease: EASE } },
};

/* ---------- helpers ---------- */
function CountUp({ to, suffix = "", pad = 0, delay = 0 }) {
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
      {String(Math.round(v)).padStart(pad, "0")}
      {suffix}
    </span>
  );
}

const REVIEWERS = [
  { i: "AK", src: "https://i.pravatar.cc/80?img=5", c: "from-amber-400 to-orange-600" },
  { i: "SR", src: "https://i.pravatar.cc/80?img=15", c: "from-emerald-400 to-teal-700" },
  { i: "MH", src: "https://i.pravatar.cc/80?img=22", c: "from-sky-400 to-indigo-600" },
];

function Reviewer({ r, first }) {
  const [failed, setFailed] = useState(false);
  return (
    <span
      className={`relative grid h-8 w-8 place-items-center overflow-hidden rounded-full bg-gradient-to-br text-[10px] font-semibold text-white ring-2 ring-white transition-transform duration-300 hover:z-10 hover:-translate-y-1 hover:scale-110 ${r.c} ${
        first ? "" : "-ml-2.5"
      }`}
    >
      {failed ? (
        r.i
      ) : (
        <img
          src={r.src}
          alt=""
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      )}
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

/* ---------- section ---------- */
export default function About() {
  const navigate = useNavigate();
  /* Mouse-driven depth: image tilts, the two cards drift at different depths */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 110, damping: 18 });
  const sy = useSpring(my, { stiffness: 110, damping: 18 });

  const rotY = useTransform(sx, [-0.5, 0.5], [-7, 7]);
  const rotX = useTransform(sy, [-0.5, 0.5], [6, -6]);
  const c1x = useTransform(sx, [-0.5, 0.5], [-16, 16]);
  const c1y = useTransform(sy, [-0.5, 0.5], [-12, 12]);
  const c2x = useTransform(sx, [-0.5, 0.5], [14, -14]);
  const c2y = useTransform(sy, [-0.5, 0.5], [10, -10]);

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
    <section
      id="about"
      className="relative z-20 -mt-5 overflow-hidden rounded-t-[2rem] bg-gradient-to-b from-white via-[#f7fbff] to-[#f3f8ff] px-5 py-20 shadow-[0_-24px_60px_-24px_rgba(0,30,90,0.45)] sm:-mt-8 sm:rounded-t-[3rem] sm:px-8 sm:py-28"
    >
      {/* soft background glows */}
      <motion.div
        aria-hidden
        animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-brand/25 blur-3xl"
      />
      <motion.div
        aria-hidden
        animate={{ x: [0, -30, 0], y: [0, -24, 0] }}
        transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -right-24 bottom-28 h-80 w-80 rounded-full bg-sky-300/30 blur-3xl"
      />

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-10">
        {/* ---------- Left: copy ---------- */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="max-w-xl"
        >
          <motion.span
            variants={rise}
            className="inline-block rounded-full bg-[#e6f8b0] px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-[#2b3a12]"
          >
            About us
          </motion.span>

          <motion.h2
            variants={words}
            className="mt-6 text-3xl font-semibold tracking-tight text-[#0b1a2c] sm:text-4xl"
          >
            {"The Green Power".split(" ").map((w) => (
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

          <motion.p
            variants={rise}
            className="mt-5 max-w-md text-[15px] leading-relaxed text-slate-600"
          >
            Green Power is a leading provider of solar energy solutions,
            dedicated to empowering individuals and businesses with clean,
            renewable energy. We believe in the power of solar energy to
            transform lives and build a sustainable future.
          </motion.p>

          <motion.div
            variants={rise}
            className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3 text-sm text-slate-700"
          >
            <span className="group flex items-center gap-2">
              <motion.svg
                viewBox="0 0 24 24"
                className="h-5 w-5 fill-[#f5b50a]"
                whileHover={{ rotate: 72, scale: 1.25 }}
                transition={{ type: "spring", stiffness: 300, damping: 12 }}
              >
                <path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" />
              </motion.svg>
              <span>Excellent 4.8 / 5</span>
            </span>

            <span className="hidden h-5 w-px bg-slate-300 sm:block" />

            <span className="flex items-center gap-2.5">
              <span className="flex items-center">
                {REVIEWERS.map((r, i) => (
                  <Reviewer key={r.i} r={r} first={i === 0} />
                ))}
              </span>
              <span>
                Reviews <CountUp to={530} suffix="+" delay={0.6} />
              </span>
            </span>
          </motion.div>

          <motion.div variants={rise} className="mt-8">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/about")}
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-brand px-7 py-3.5 text-sm font-medium text-[#04122e] shadow-[0_12px_30px_-12px_rgba(130,190,10,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-12px_rgba(130,190,10,1)]"
            >
              <span className="pointer-events-none absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-white/55 transition-all duration-700 group-hover:left-[160%]" />
              <Arrow className="relative group-hover:translate-x-1" />
              <span className="relative">Learn more</span>
              <Arrow className="relative group-hover:translate-x-1.5" />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* ---------- Right: image + stat cards ---------- */}
        <div
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          style={{ perspective: 1100 }}
          className="relative mx-auto w-full max-w-[560px] sm:aspect-[1.3] lg:mx-0 lg:ml-auto"
        >
          {/* Image */}
          <motion.div
            variants={imgWrap}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            style={{ rotateX: rotX, rotateY: rotY }}
            className="relative aspect-[4/3] w-full sm:absolute sm:left-0 sm:top-0 sm:aspect-auto sm:h-full sm:w-[58%]"
          >
            <motion.div
              variants={imgClip}
              className="group h-full w-full overflow-hidden rounded-3xl bg-[#cfe6ff] shadow-[0_30px_70px_-25px_rgba(10,50,120,0.55)]"
            >
              <div className="h-full w-full transition-transform duration-700 group-hover:scale-105">
                <motion.img
                  src={aboutImg}
                  alt="Green Power engineer standing next to solar panels"
                  variants={imgZoom}
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Card 1: 87% */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease: EASE, delay: 0.7 }}
            className="mt-4 sm:absolute sm:right-0 sm:top-0 sm:mt-0 sm:w-[42%]"
          >
            <motion.div style={{ x: c1x, y: c1y }}>
              <motion.div
                animate={{ y: [0, -7, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="rounded-2xl border border-white bg-gradient-to-br from-[#e3f1ff] to-[#f3f9ff] p-5 shadow-[0_20px_50px_-22px_rgba(20,80,160,0.45)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-20px_rgba(20,80,160,0.55)]">
                  <p className="flex items-baseline gap-2">
                    <span className="text-4xl font-semibold tracking-tight text-[#0b1a2c]">
                      <CountUp to={87} suffix="%" delay={1.1} />
                    </span>
                    <span className="text-sm text-slate-600">Success</span>
                  </p>
                  <p className="mt-3 text-[11.5px] leading-relaxed text-slate-500">
                    Green Power is dedicated to empowering individuals and
                    businesses with clean, renewable energy.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Card 2: 05+ */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease: EASE, delay: 0.95 }}
            className="mt-4 sm:absolute sm:left-[41%] sm:top-[52%] sm:mt-0 sm:w-[46%]"
          >
            <motion.div style={{ x: c2x, y: c2y }}>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="rounded-2xl border border-white/80 bg-[#e1f3fb]/85 p-5 shadow-[0_20px_50px_-22px_rgba(20,80,160,0.5)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:bg-[#e1f3fb] hover:shadow-[0_28px_60px_-20px_rgba(20,80,160,0.6)]">
                  <p className="flex items-baseline gap-2">
                    <span className="text-4xl font-semibold tracking-tight text-[#0b1a2c]">
                      <CountUp to={5} pad={2} suffix="+" delay={1.3} />
                    </span>
                    <span className="text-sm text-slate-600">Experience</span>
                  </p>
                  <p className="mt-3 text-[11.5px] leading-relaxed text-slate-500">
                    Our team is here to provide the best solutions, from solar
                    panels to energy storage. Together for a greener tomorrow.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}