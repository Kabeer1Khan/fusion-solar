import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";

const EASE = [0.22, 1, 0.36, 1];

/* Must match the section background: the card "notch" is painted with it */
const BG = "#f3f8ff";
const NOTCH = 72; // px, size of the notch that holds the arrow button
const FILLET = 18; // px, radius of the rounded corners around the notch

/* Free Pexels photos. Swap any URL for your own image. */
const SERVICES = [
  {
    title: "Residential Solar",
    desc: "Rooftop systems that cut your home energy bills.",
    img: "https://images.pexels.com/photos/12224996/pexels-photo-12224996.jpeg?auto=compress&cs=tinysrgb&w=900&h=720&fit=crop",
    fallback: "from-sky-400 to-blue-900",
  },
  {
    title: "Hydropower System",
    desc: "Reliable clean power from flowing water.",
    img: "https://images.pexels.com/photos/10615221/pexels-photo-10615221.jpeg?auto=compress&cs=tinysrgb&w=900&h=720&fit=crop",
    fallback: "from-teal-400 to-emerald-900",
  },
  {
    title: "Wind Turbine",
    desc: "Steady wind power for homes and whole communities.",
    img: "https://images.pexels.com/photos/243137/pexels-photo-243137.jpeg?auto=compress&cs=tinysrgb&w=900&h=720&fit=crop",
    fallback: "from-sky-300 to-green-800",
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
const grid = { hidden: {}, show: { transition: { staggerChildren: 0.16 } } };
const cardIn = {
  hidden: { opacity: 0, y: 70 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE } },
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

/* ---------- one card ---------- */
function ServiceCard({ s, onOpen }) {
  const [failed, setFailed] = useState(false);

  /* cursor-follow light */
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const fillet = {
    width: FILLET,
    height: FILLET,
    background: `radial-gradient(circle at 0 0, transparent ${FILLET}px, ${BG} ${FILLET + 0.5}px)`,
  };

  return (
    <motion.div variants={cardIn}>
      <div
        role="button"
        tabIndex={0}
        aria-label={`Get a free quote for ${s.title}`}
        onClick={onOpen}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onOpen();
          }
        }}
        onMouseMove={onMove}
        className="group relative aspect-[5/4] w-full cursor-pointer overflow-hidden rounded-3xl bg-[#0b3a7a] transition-transform duration-500 ease-out hover:-translate-y-2 focus-visible:-translate-y-2"
      >
        {/* photo */}
        <div className="absolute inset-0 transition-transform duration-[1000ms] ease-out group-hover:scale-110">
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

        {/* shading + cursor light */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/15" />
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 [background:radial-gradient(240px_circle_at_var(--mx,50%)_var(--my,50%),rgba(255,255,255,0.22),transparent_65%)]" />

        {/* text */}
        <div
          className="absolute inset-x-0 bottom-0 p-5"
          style={{ paddingRight: NOTCH + 12 }}
        >
          <h3 className="text-lg font-semibold leading-tight text-white transition-transform duration-500 group-hover:-translate-y-0.5">
            {s.title}
          </h3>
          <p className="max-h-0 translate-y-2 overflow-hidden text-[13px] leading-snug text-white/85 opacity-0 transition-all duration-500 group-hover:mt-1.5 group-hover:max-h-16 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:mt-1.5 group-focus-visible:max-h-16 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 [@media(hover:none)]:mt-1.5 [@media(hover:none)]:max-h-16 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100">
            {s.desc}
          </p>
        </div>

        {/* notch cut into the bottom-right corner */}
        <span
          aria-hidden
          className="absolute bottom-0 right-0 rounded-tl-[28px]"
          style={{ width: NOTCH, height: NOTCH, backgroundColor: BG }}
        />
        <span
          aria-hidden
          className="absolute right-0"
          style={{ ...fillet, bottom: NOTCH }}
        />
        <span
          aria-hidden
          className="absolute bottom-0"
          style={{ ...fillet, right: NOTCH }}
        />

        {/* arrow button */}
        <span
          aria-hidden
          className="absolute bottom-[14px] right-[14px] z-10 grid h-11 w-11 place-items-center rounded-full bg-brand text-[#04122e] transition-all duration-500 group-hover:scale-110 group-hover:bg-[#04122e] group-hover:text-brand group-focus-visible:bg-[#04122e] group-focus-visible:text-brand"
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
    </motion.div>
  );
}

/* ---------- section ---------- */
export default function Services({ onQuote }) {
  const navigate = useNavigate();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 220]);

  return (
    <section
      id="service"
      ref={ref}
      style={{ backgroundColor: BG }}
      className="relative overflow-hidden px-5 pb-24 pt-4 sm:px-8 sm:pb-32"
    >
      {/* starburst that turns as you scroll */}
      <motion.svg
        aria-hidden
        style={{ rotate }}
        viewBox="0 0 200 200"
        className="pointer-events-none absolute -right-12 -top-8 h-64 w-64 sm:h-80 sm:w-80"
        fill="none"
        stroke="#d5e5f6"
        strokeWidth="14"
        strokeLinecap="round"
      >
        <path d="M100 10v180M10 100h180M36 36l128 128M164 36 36 164" />
      </motion.svg>

      <div className="relative z-10 mx-auto max-w-6xl">
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
              Service
            </motion.span>
            <motion.h2
              variants={words}
              className="mt-6 text-3xl font-semibold tracking-tight text-[#0b1a2c] sm:text-4xl"
            >
              {"Our Solar Solutions".split(" ").map((w) => (
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
            We believe in the power of solar energy to transform lives and
            communities.
          </motion.p>
        </motion.div>

        {/* cards */}
        <motion.div
          variants={grid}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {SERVICES.map((s) => (
            <ServiceCard key={s.title} s={s} onOpen={onQuote} />
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
            onClick={() => navigate("/services")}
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-brand px-7 py-3.5 text-sm font-medium text-[#04122e] shadow-[0_12px_30px_-12px_rgba(130,190,10,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-12px_rgba(130,190,10,1)]"
          >
            <span className="pointer-events-none absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-white/55 transition-all duration-700 group-hover:left-[160%]" />
            <Arrow className="relative group-hover:translate-x-1" />
            <span className="relative">View all services</span>
            <Arrow className="relative group-hover:translate-x-1.5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}