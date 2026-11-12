import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PageHero from "../components/PageHero";
import heroImg from "../assets/about_img/about_hero.webp";

const EASE = [0.22, 1, 0.36, 1];

/* Change these to your real details */
const PHONE = "+92 333 1234567";
const PHONE_HREF = "tel:+923331234567";
const EMAIL = "info@greenpower.com";
const PLACE = "Karachi, Pakistan";
const MAP_EMBED =
  "https://www.google.com/maps?q=Karachi%2C%20Pakistan&output=embed";
const MAP_LINK =
  "https://www.google.com/maps/search/?api=1&query=Karachi%2C+Pakistan";

/* ---------- variants ---------- */
const rise = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};
const fromLeft = {
  hidden: { opacity: 0, x: -60 },
  show: { opacity: 1, x: 0, transition: { duration: 1, ease: EASE } },
};
const fromRight = {
  hidden: { opacity: 0, x: 60 },
  show: { opacity: 1, x: 0, transition: { duration: 1, ease: EASE } },
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

/* ---------- left: contact info ---------- */
function InfoRow({ href, external, icon, children }) {
  return (
    <motion.a
      variants={rise}
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className="group -mx-3 flex items-center gap-4 rounded-2xl p-3 transition-all duration-300 hover:translate-x-1.5 hover:bg-white/80 hover:shadow-sm"
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand text-[#04122e] transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
        <svg
          viewBox="0 0 24 24"
          className="h-[18px] w-[18px]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {icon}
        </svg>
      </span>
      <span className="text-[15px] text-slate-700 transition-colors duration-300 group-hover:text-[#0b1a2c]">
        {children}
      </span>
    </motion.a>
  );
}

function InfoCard() {
  return (
    <motion.div
      variants={{
        hidden: fromLeft.hidden,
        show: {
          ...fromLeft.show,
          transition: { ...fromLeft.show.transition, staggerChildren: 0.12, delayChildren: 0.35 },
        },
      }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      className="rounded-3xl border border-white bg-gradient-to-b from-[#e7f1fd] to-[#f4f9ff] p-7 shadow-[0_24px_60px_-36px_rgba(10,60,140,0.45)] sm:p-8"
    >
      <motion.h2
        variants={rise}
        className="text-xl font-semibold tracking-tight text-[#0b1a2c]"
      >
        Get in Touch
      </motion.h2>
      <motion.p
        variants={rise}
        className="mt-3 max-w-xs text-sm leading-relaxed text-slate-500"
      >
        Have questions or need support? Feel free to contact us anytime.
      </motion.p>

      <div className="mt-6 flex flex-col gap-1.5">
        <InfoRow
          href={PHONE_HREF}
          icon={
            <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
          }
        >
          {PHONE}
        </InfoRow>
        <InfoRow
          href={`mailto:${EMAIL}`}
          icon={
            <>
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </>
          }
        >
          {EMAIL}
        </InfoRow>
        <InfoRow
          href={MAP_LINK}
          external
          icon={
            <>
              <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" />
              <circle cx="12" cy="10" r="2.5" />
            </>
          }
        >
          {PLACE}
        </InfoRow>
      </div>
    </motion.div>
  );
}

/* ---------- right: message form ---------- */
function Field({ id, label, error, textarea, ...props }) {
  const Tag = textarea ? "textarea" : "input";
  return (
    <motion.div variants={rise}>
      <div
        className={`group rounded-xl border bg-white px-4 pb-3 pt-2.5 shadow-sm transition-all duration-300 focus-within:shadow-[0_0_0_4px_rgba(185,244,58,0.28)] ${
          error
            ? "border-red-300"
            : "border-slate-200 hover:border-slate-300 focus-within:border-brand"
        }`}
      >
        <label
          htmlFor={id}
          className="block text-[11px] font-medium text-slate-400 transition-colors duration-300 group-focus-within:text-[#5f8f00]"
        >
          {label}
        </label>
        <Tag
          id={id}
          {...props}
          className={`mt-1 w-full bg-transparent text-sm text-[#0b1a2c] placeholder-slate-300 outline-none ${
            textarea ? "min-h-[110px] resize-none" : ""
          }`}
        />
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden px-1 pt-1.5 text-xs text-red-500"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const EMPTY = { name: "", email: "", message: "" };

function validate(v) {
  const e = {};
  if (v.name.trim().length < 2) e.name = "Please enter your name.";
  if (!/^\S+@\S+\.\S+$/.test(v.email.trim()))
    e.email = "Please enter a valid email address.";
  if (v.message.trim().length < 10)
    e.message = "Please write at least 10 characters.";
  return e;
}

function MessageForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | done

  const set = (key) => (e) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const submit = (e) => {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setStatus("loading");
    /* connect your backend or email service here (Formspree, EmailJS, your API...) */
    setTimeout(() => setStatus("done"), 1100);
  };

  const reset = () => {
    setValues(EMPTY);
    setErrors({});
    setStatus("idle");
  };

  return (
    <motion.div
      variants={{
        hidden: fromRight.hidden,
        show: {
          ...fromRight.show,
          transition: { ...fromRight.show.transition, staggerChildren: 0.11, delayChildren: 0.4 },
        },
      }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.h2
        variants={rise}
        className="text-xl font-semibold tracking-tight text-[#0b1a2c]"
      >
        Send a Message
      </motion.h2>

      <AnimatePresence mode="wait">
        {status === "done" ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="mt-5 flex flex-col items-center rounded-3xl border border-white bg-gradient-to-b from-[#e7f1fd] to-[#f4f9ff] px-6 py-14 text-center shadow-[0_24px_60px_-36px_rgba(10,60,140,0.45)]"
          >
            <span className="grid h-16 w-16 place-items-center rounded-full bg-brand">
              <svg
                viewBox="0 0 24 24"
                className="h-8 w-8"
                fill="none"
                stroke="#04122e"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <motion.path
                  d="M5 12.5l4.5 4.5L19 7.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
              </svg>
            </span>
            <h3 className="mt-5 text-xl font-semibold text-[#0b1a2c]">
              Message sent!
            </h3>
            <p className="mt-2 max-w-xs text-sm text-slate-500">
              Thanks for reaching out. Our team will get back to you within 24
              hours.
            </p>
            <button
              onClick={reset}
              className="mt-6 rounded-full border border-slate-300 px-6 py-2.5 text-sm font-medium text-[#0b1a2c] transition-all duration-300 hover:border-transparent hover:bg-brand"
            >
              Send another message
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={submit}
            noValidate
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="mt-5 flex flex-col gap-4"
          >
            <Field
              id="c-name"
              label="Your Name"
              placeholder="Your Name"
              autoComplete="name"
              value={values.name}
              onChange={set("name")}
              error={errors.name}
            />
            <Field
              id="c-email"
              label="Your Email"
              type="email"
              placeholder="Your Email"
              autoComplete="email"
              value={values.email}
              onChange={set("email")}
              error={errors.email}
            />
            <Field
              id="c-message"
              label="Your Message"
              textarea
              placeholder="How can we help you?"
              value={values.message}
              onChange={set("message")}
              error={errors.message}
            />

            <motion.div variants={rise}>
              <motion.button
                type="submit"
                whileTap={{ scale: 0.95 }}
                disabled={status === "loading"}
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-brand px-7 py-3.5 text-sm font-medium text-[#04122e] shadow-[0_12px_30px_-12px_rgba(130,190,10,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-12px_rgba(130,190,10,1)] disabled:opacity-70"
              >
                <span className="pointer-events-none absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-white/55 transition-all duration-700 group-hover:left-[160%]" />
                {status === "loading" ? (
                  <>
                    <span className="relative h-4 w-4 animate-spin rounded-full border-2 border-[#04122e]/30 border-t-[#04122e]" />
                    <span className="relative">Sending</span>
                  </>
                ) : (
                  <>
                    <span className="relative">Send Message</span>
                    <Arrow className="relative group-hover:translate-x-1.5" />
                  </>
                )}
              </motion.button>
            </motion.div>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ---------- map ---------- */
function MapBlock() {
  /* the map only takes the mouse wheel after you click it,
     so it never traps the page scroll */
  const [active, setActive] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1.1, ease: EASE }}
      onMouseLeave={() => setActive(false)}
      className="group relative mt-14 h-[320px] overflow-hidden rounded-3xl border border-white bg-[#dbe7f5] shadow-[0_30px_70px_-36px_rgba(10,60,140,0.55)] sm:h-[400px]"
    >
      <iframe
        title="Green Power location on Google Maps"
        src={MAP_EMBED}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-full w-full border-0"
      />

      {!active && (
        <button
          onClick={() => setActive(true)}
          aria-label="Click to interact with the map"
          className="absolute inset-0 flex cursor-pointer items-end justify-center pb-5"
        >
          <span className="rounded-full bg-white/90 px-4 py-2 text-xs font-medium text-[#0b1a2c] shadow-lg backdrop-blur transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-brand">
            Click to explore the map
          </span>
        </button>
      )}

      <a
        href={MAP_LINK}
        target="_blank"
        rel="noreferrer"
        className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-medium text-[#0b1a2c] shadow-lg backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand"
      >
        Open in Google Maps
        <Arrow className="h-3 w-3 -rotate-45" />
      </a>
    </motion.div>
  );
}

/* ---------- page ---------- */
export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Contact Us"
        subtitle="Let’s Build a Greener Future Together"
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
          className="pointer-events-none absolute -right-24 top-1/4 h-80 w-80 rounded-full bg-sky-300/25 blur-3xl"
        />

        <div className="relative z-10 mx-auto max-w-5xl">
          <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-12">
            <InfoCard />
            <MessageForm />
          </div>
          <MapBlock />
        </div>
      </section>
    </>
  );
}