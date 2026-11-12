import { useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

/* Sample people and portraits (randomuser.me). Replace with your real team. */
const TEAM = [
  {
    name: "Ahsan Raza",
    role: "CEO & Founder",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
    email: "ahsan@greenpower.com",
  },
  {
    name: "Sara Khan",
    role: "Solar Specialist",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
    email: "sara@greenpower.com",
  },
  {
    name: "Usman Tariq",
    role: "Energy Consultant",
    img: "https://randomuser.me/api/portraits/men/75.jpg",
    email: "usman@greenpower.com",
  },
  {
    name: "Hina Malik",
    role: "Project Manager",
    img: "https://randomuser.me/api/portraits/women/65.jpg",
    email: "hina@greenpower.com",
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
  hidden: { opacity: 0, y: 70 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE } },
};
const portraitIn = {
  hidden: { opacity: 0, scale: 0.5 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 180, damping: 14, delay: 0.25 },
  },
};

function initials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("");
}

/* ---------- one member ---------- */
function TeamCard({ m }) {
  const [failed, setFailed] = useState(false);

  /* 3D tilt that follows the cursor */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 150, damping: 18 });
  const sy = useSpring(my, { stiffness: 150, damping: 18 });
  const rotY = useTransform(sx, [-0.5, 0.5], [-8, 8]);
  const rotX = useTransform(sy, [-0.5, 0.5], [7, -7]);

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
    <motion.div variants={cardIn}>
      <motion.div
        style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 900 }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-gradient-to-b from-white to-[#eaf2fc] p-6 pb-7 text-center transition-shadow duration-500 hover:shadow-[0_28px_60px_-28px_rgba(10,60,140,0.45)]"
      >
        {/* lime wash on hover */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand/0 to-brand/25 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* portrait */}
        <motion.div
          variants={portraitIn}
          className="relative mx-auto h-24 w-24"
        >
          <span className="absolute -inset-1.5 scale-90 rounded-full border-2 border-brand opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100" />
          <div className="h-full w-full overflow-hidden rounded-full bg-gradient-to-br from-sky-400 to-blue-700 shadow-lg ring-4 ring-white transition-transform duration-500 group-hover:scale-105">
            {failed ? (
              <span className="grid h-full w-full place-items-center text-xl font-semibold text-white">
                {initials(m.name)}
              </span>
            ) : (
              <img
                src={m.img}
                alt={m.name}
                loading="lazy"
                draggable={false}
                onError={() => setFailed(true)}
                className="h-full w-full object-cover"
              />
            )}
          </div>
        </motion.div>

        <h3 className="relative mt-4 text-base font-semibold text-[#0b1a2c]">
          {m.name}
        </h3>
        <p className="relative mt-0.5 text-xs text-slate-500">{m.role}</p>

        <a
          href={`mailto:${m.email}?subject=${encodeURIComponent(
            `Meeting with ${m.name}`
          )}`}
          aria-label={`Email ${m.name}`}
          className="relative mx-auto mt-5 grid h-8 w-8 place-items-center rounded-full bg-brand text-[#04122e] transition-all duration-300 hover:scale-125 hover:bg-[#04122e] hover:text-brand active:scale-95"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-rotate-45"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </a>
      </motion.div>
    </motion.div>
  );
}

/* ---------- section ---------- */
export default function Team() {
  return (
    <section
      id="team"
      className="bg-[#f3f8ff] px-5 pb-24 sm:px-8 sm:pb-28"
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
              Our Team
            </motion.span>
            <motion.h2
              variants={words}
              className="mt-6 text-3xl font-semibold tracking-tight text-[#0b1a2c] sm:text-4xl"
            >
              {"Meet Our Expert Team".split(" ").map((w) => (
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
            className="max-w-[19rem] text-sm leading-relaxed text-slate-600 md:pb-1 md:text-right"
          >
            Our team of experts is committed to providing the best renewable
            energy solutions.
          </motion.p>
        </motion.div>

        {/* cards */}
        <motion.div
          variants={row}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {TEAM.map((m) => (
            <TeamCard key={m.name} m={m} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}