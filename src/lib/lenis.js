import Lenis from "lenis";

let lenis = null;

export function initLenis() {
  lenis = new Lenis({
    duration: 1.25,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  let id;
  const raf = (time) => {
    lenis?.raf(time);
    id = requestAnimationFrame(raf);
  };
  id = requestAnimationFrame(raf);

  return () => {
    cancelAnimationFrame(id);
    lenis?.destroy();
    lenis = null;
  };
}

/* smooth scroll to a section on the current page */
export function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { duration: 1.5 });
  else el.scrollIntoView({ behavior: "smooth" });
}

/* smooth scroll to the very top */
export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { duration: 1.5 });
  else window.scrollTo({ top: 0, behavior: "smooth" });
}

/* instant jumps, used while the page-transition curtain is covering the screen */
export function jumpToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  else window.scrollTo(0, 0);
}
export function jumpToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { immediate: true, force: true });
  else el.scrollIntoView();
}

export const stopScroll = () => lenis?.stop();
export const startScroll = () => lenis?.start();