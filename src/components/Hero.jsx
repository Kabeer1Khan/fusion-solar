import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";
import heroImg from "../assets/hero_img/hero page.webp";
import { scrollToId } from "../lib/lenis";

const EASE = [0.22, 1, 0.36, 1];

/* Headline: each word slides up from behind a mask */
function Line({ text, start }) {
  return (
    <span className="block">
      {text.split(" ").map((w, i) => (
        <span
          key={w + i}
          className="mr-[0.25em] inline-block overflow-hidden pb-[0.12em] align-bottom last:mr-0"
        >
          <motion.span
            className="inline-block"
            initial={{ y: "115%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.95, ease: EASE, delay: start + i * 0.08 }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

function CountUp({ to, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 2,
      delay,
      ease: "easeOut",
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to, delay]);

  return <span ref={ref}>{val}+</span>;
}

/* Self-contained thumbnail (swap for a real <img> any time) */
function SolarThumb() {
  return (
    <svg viewBox="0 0 120 104" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7cc3ff" />
          <stop offset="1" stopColor="#1f5fd0" />
        </linearGradient>
        <linearGradient id="panel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2a56b8" />
          <stop offset="1" stopColor="#0d2a6b" />
        </linearGradient>
      </defs>
      <rect width="120" height="104" fill="url(#sky)" />
      <polygon points="0,38 76,24 76,104 0,104" fill="url(#panel)" />
      <g stroke="#9cc4ff" strokeOpacity=".55" strokeWidth=".8">
        <path d="M0 58 76 48M0 80 76 74M19 34v70M38 30v74M57 27v77" />
      </g>
      <circle cx="82" cy="40" r="9" fill="#f2c9a0" />
      <path d="M72 38a10 10 0 0 1 20 0z" fill="#f4d321" />
      <rect x="70" y="36" width="24" height="3" rx="1.5" fill="#f4d321" />
      <path d="M66 104c0-16 7-26 16-26s16 10 16 26z" fill="#f4d321" />
      <path d="M78 80h8v24h-8z" fill="#e8e8e8" opacity=".85" />
    </svg>
  );
}

/* Sky colour sampled from the top edge of hero page.webp. On desktop the
   image is shown at full width (no crop, no zoom), sits at the bottom of the
   hero, and this gradient fills the space above it so the hero can be
   full-screen with no seam. If you change the image, re-pick these colours. */
const SKY =
  "linear-gradient(to right, rgb(2,58,146), rgb(0,64,159) 25%, rgb(1,67,163) 50%, rgb(0,69,164) 75%, rgb(0,71,165))";
/* Only used on phones/tablets, where the image has to be cropped to fit */
const BG_POSITION = "center bottom";

/* Free Pexels photo: solar technician in hard hat (Los Muertos Crew) */
const WORKER_IMG =
  "https://images.pexels.com/photos/8853540/pexels-photo-8853540.jpeg?auto=compress&cs=tinysrgb&w=400&h=360&fit=crop";

const AVATARS = [
  { i: "AK", c: "from-amber-400 to-orange-600", src: "https://i.pravatar.cc/80?img=47" },
  { i: "SR", c: "from-emerald-400 to-teal-700", src: "https://i.pravatar.cc/80?img=12" },
  { i: "MH", c: "from-sky-400 to-indigo-600", src: "https://i.pravatar.cc/80?img=32" },
];

/* Photo with a graceful fallback if it can't load */
function WorkerPhoto() {
  const [failed, setFailed] = useState(false);
  if (failed) return <SolarThumb />;
  return (
    <img
      src={WORKER_IMG}
      alt="Solar technician installing panels"
      loading="eager"
      onError={() => setFailed(true)}
      className="h-full w-full object-cover transition-transform duration-700 group-hover/card:scale-110"
    />
  );
}

function Avatar({ a, first }) {
  const [failed, setFailed] = useState(false);
  return (
    <span
      className={`grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br text-[10px] font-semibold text-white ring-2 ring-white/70 ${a.c} ${
        first ? "" : "-ml-2"
      }`}
    >
      {failed ? (
        a.i
      ) : (
        <img
          src={a.src}
          alt=""
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      )}
    </span>
  );
}

export default function Hero({ onQuote }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section
      id="home"
      ref={ref}
      style={{ background: SKY }}
      className="relative h-[100svh] min-h-[680px] w-full overflow-hidden"
    >
      {/* Background: fades in, light parallax on scroll (no zoom) */}
      <motion.div style={{ y: bgY }} className="absolute inset-0">
        <motion.img
          src={heroImg}
          alt="Wind turbines over a calm blue waterway"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: EASE }}
          style={{ objectPosition: BG_POSITION }}
          className="absolute bottom-0 left-0 h-full w-full object-cover lg:h-auto lg:[-webkit-mask-image:linear-gradient(to_bottom,transparent,black_3%)] lg:[mask-image:linear-gradient(to_bottom,transparent,black_3%)]"
          draggable={false}
        />
      </motion.div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#05306f]/30 via-transparent to-[#03204f]/35" />

      {/* Copy */}
      <motion.div
        style={{ y: textY, opacity: fade }}
        className="relative z-10 mx-auto flex h-full max-w-4xl flex-col items-center px-5 pt-[24vh] text-center sm:pt-[26vh]"
      >
        <h1 className="text-[2.15rem] font-medium leading-[1.15] tracking-tight text-white sm:text-5xl lg:text-[3.4rem]">
          <Line text="Creating a Sustainable Future with" start={0.45} />
          <Line text="Renewable Energy Solutions." start={0.85} />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 1.35 }}
          className="mt-5 max-w-sm text-sm leading-relaxed text-white/90 sm:text-[15px]"
        >
          Discover the amazing ways solar energy can transform your home or
          business.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: EASE, delay: 1.55 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          onClick={onQuote}
          className="group relative mt-8 flex items-center gap-2.5 overflow-hidden rounded-full bg-brand px-6 py-3.5 text-sm font-medium text-[#04122e] shadow-[0_10px_40px_-8px_rgba(185,244,58,0.7)] transition-shadow duration-300 hover:shadow-[0_14px_50px_-6px_rgba(185,244,58,0.95)]"
        >
          <span className="pointer-events-none absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-white/50 transition-all duration-700 group-hover:left-[160%]" />
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
          <span className="relative">Get A Free Quote</span>
        </motion.button>
      </motion.div>

      {/* Glass cards */}
      <div className="absolute inset-x-0 bottom-6 z-10 flex flex-wrap items-end justify-center gap-4 px-4 sm:bottom-12">
        {/* Card 1 */}
        <motion.div
          initial={{ opacity: 0, y: 70 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 1.8 }}
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.button
              whileHover={{ y: -6, scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => scrollToId("service")}
              className="group/card flex w-[300px] items-center gap-3.5 rounded-2xl border border-white/30 bg-white/20 p-3 text-left shadow-[0_20px_50px_-15px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-colors duration-300 hover:bg-white/30"
            >
              <span className="block h-[96px] w-[112px] shrink-0 overflow-hidden rounded-xl bg-[#1f5fd0]">
                <WorkerPhoto />
              </span>
              <span>
                <span className="block text-base font-semibold leading-tight text-white">
                  Alternative Energy
                </span>
                <span className="mt-1.5 block text-xs leading-snug text-white/85">
                  Discover the amazing ways solar energy can transform.
                </span>
              </span>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Card 2 */}
        <motion.div
          initial={{ opacity: 0, y: 70 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 2 }}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.button
              whileHover={{ y: -6, scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => scrollToId("about")}
              className="relative flex h-[120px] w-[200px] flex-col justify-between rounded-2xl border border-white/30 bg-white/20 p-4 text-left shadow-[0_20px_50px_-15px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-colors duration-300 hover:bg-white/30"
            >
              <span className="flex items-center">
                {AVATARS.map((a, idx) => (
                  <Avatar key={a.i} a={a} first={idx === 0} />
                ))}
                <span className="-ml-2 grid h-8 w-8 place-items-center rounded-full bg-white text-[10px] font-semibold text-[#04122e] ring-2 ring-white/70">
                  80+
                </span>
              </span>
              <span className="max-w-[120px] text-sm font-medium leading-snug text-white">
                Our <CountUp to={200} delay={2.2} /> satisfied clients world wide
              </span>
              <motion.svg
                viewBox="0 0 40 40"
                className="absolute bottom-3 right-3 h-8 w-8"
                animate={{ rotate: 360 }}
                transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
              >
                <g stroke="#b9f43a" strokeWidth="3.2" strokeLinecap="round">
                  <path d="M20 3v34M3 20h34M8 8l24 24M32 8 8 32" />
                </g>
              </motion.svg>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}