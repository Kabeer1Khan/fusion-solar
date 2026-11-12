import Hero from "../components/Hero";
import About from "../components/About";
import Services from "../components/Services";
import Projects from "../components/Projects";
import CtaBanner from "../components/CtaBanner";
import Team from "../components/Team";

export default function Home({ onQuote }) {
  return (
    <>
      <Hero onQuote={onQuote} />
      <About />
      <Services onQuote={onQuote} />
      <Projects onQuote={onQuote} />
      <CtaBanner onQuote={onQuote} />
      <Team />
    </>
  );
}