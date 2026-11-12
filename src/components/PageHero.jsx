import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

/* Shared hero for inner pages: photo with parallax, big title, subtitle.
   `position` = which part of the photo stays visible when the screen crops it
   (try "center bottom" or "center 50%" if something gets cut off). */
export default function PageHero({
  title,
  subtitle,
  image,
  alt = "",
  position = "center 75%",
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative h-[62vh] min-h-[440px] w-full overflow-hidden bg-[#0b4fb8]"
    >
      <motion.div style={{ y: bgY }} className="absolute inset-0">
        <motion.img
          src={image}
          alt={alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: EASE }}
          style={{ objectPosition: position }}
          className="h-full w-full object-cover"
          draggable={false}
        />
      </motion.div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#05306f]/35 via-transparent to-[#03204f]/30" />

      <motion.div
        style={{ y: textY, opacity: fade }}
        className="relative z-10 flex h-full flex-col items-center justify-center px-5 pb-10 pt-16 text-center"
      >
        <motion.h1
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1, delayChildren: 0.9 } },
          }}
          className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl"
        >
          {title.split(" ").map((w, i) => (
            <span
              key={w + i}
              className="mr-[0.25em] inline-block overflow-hidden pb-[0.12em] align-bottom last:mr-0"
            >
              <motion.span
                className="inline-block"
                variants={{
                  hidden: { y: "115%" },
                  show: { y: 0, transition: { duration: 0.9, ease: EASE } },
                }}
              >
                {w}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 1.3 }}
          className="mt-4 max-w-xl text-base text-white/90 sm:text-lg"
        >
          {subtitle}
        </motion.p>

        <motion.span
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, ease: EASE, delay: 1.6 }}
          className="mt-6 h-1 w-16 origin-center rounded-full bg-brand"
        />
      </motion.div>
    </section>
  );
}