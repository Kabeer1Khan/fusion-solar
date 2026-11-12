import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

/* Free Pexels photo (solar park). Swap for your own image if you like. */
const BANNER_IMG =
  "https://images.pexels.com/photos/4320473/pexels-photo-4320473.jpeg?auto=compress&cs=tinysrgb&w=1100&h=700&fit=crop";

const textStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.35 } },
};
const rise = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

export default function CtaBanner({ onQuote }) {
  const ref = useRef(null);
  const [failed, setFailed] = useState(false);

  /* photo drifts while you scroll past */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  /* cursor-follow glow */
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const fade =
    "[-webkit-mask-image:linear-gradient(to_bottom,black_35%,transparent)] [mask-image:linear-gradient(to_bottom,black_35%,transparent)] md:[-webkit-mask-image:linear-gradient(to_right,black_40%,transparent)] md:[mask-image:linear-gradient(to_right,black_40%,transparent)]";

  return (
    <section className="bg-[#f3f8ff] px-5 pb-20 sm:px-8 sm:pb-24">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.1, ease: EASE }}
        onMouseMove={onMove}
        className="group relative mx-auto flex max-w-6xl flex-col overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#0a2c63] to-[#04122e] md:min-h-[210px] md:flex-row md:items-center"
      >
        {/* photo, fading into the navy */}
        <div
          className={`relative h-44 w-full md:absolute md:inset-y-0 md:left-0 md:h-auto md:w-[52%] ${fade}`}
        >
          <motion.div
            style={{ y }}
            className="absolute inset-x-0 -top-[10%] h-[120%]"
          >
            <div className="h-full w-full transition-transform duration-[1400ms] ease-out group-hover:scale-105">
              {failed ? (
                <div className="h-full w-full bg-gradient-to-br from-sky-500 to-emerald-800" />
              ) : (
                <img
                  src={BANNER_IMG}
                  alt="Solar panels in a green field"
                  loading="lazy"
                  draggable={false}
                  onError={() => setFailed(true)}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
          </motion.div>
        </div>

        {/* lime glow that follows the cursor */}
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 [background:radial-gradient(420px_circle_at_var(--mx,70%)_var(--my,50%),rgba(185,244,58,0.14),transparent_60%)]" />

        {/* copy + button */}
        <motion.div
          variants={textStagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="relative z-10 flex w-full flex-col items-center gap-6 px-6 pb-9 pt-2 text-center md:ml-[36%] md:w-auto md:flex-1 md:flex-row md:items-center md:justify-between md:gap-8 md:px-10 md:py-10 md:text-left"
        >
          <div>
            <motion.h2
              variants={rise}
              className="text-2xl font-semibold tracking-tight text-white sm:text-[1.7rem]"
            >
              Ready to Switch to Clean Energy?
            </motion.h2>
            <motion.p
              variants={rise}
              className="mt-2 text-sm text-white/80"
            >
              Join the green revolution today and make a difference.
            </motion.p>
          </div>

          <motion.button
            variants={rise}
            whileTap={{ scale: 0.95 }}
            onClick={onQuote}
            className="group/btn relative inline-flex shrink-0 items-center gap-2.5 overflow-hidden rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-[#04122e] shadow-[0_12px_34px_-10px_rgba(185,244,58,0.7)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_44px_-10px_rgba(185,244,58,0.95)]"
          >
            <span className="pointer-events-none absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-white/55 transition-all duration-700 group-hover/btn:left-[160%]" />
            <span className="relative">Get A Free Quote</span>
            <svg
              viewBox="0 0 24 24"
              className="relative h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-1.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
}