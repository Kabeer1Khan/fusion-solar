import { useCallback, useEffect, useState } from "react";
import { MotionConfig, motion, useScroll, useSpring } from "framer-motion";
import Navbar from "./components/Navbar";
import AnimatedRoutes from "./components/AnimatedRoutes";
import Footer from "./components/Footer";
import FormModal from "./components/FormModal";
import { initLenis } from "./lib/lenis";

export default function App() {
  const [modal, setModal] = useState(null); // "quote" | "register" | null
  const closeModal = useCallback(() => setModal(null), []);
  const openQuote = useCallback(() => setModal("quote"), []);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });

  useEffect(() => initLenis(), []);

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-brand"
      />

      <Navbar onRegister={() => setModal("register")} />

      <main>
        <AnimatedRoutes onQuote={openQuote} />
      </main>

      <Footer />

      <FormModal mode={modal} onClose={closeModal} />
    </MotionConfig>
  );
}