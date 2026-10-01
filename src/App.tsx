import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Experience } from "./components/Experience";
import { Skills } from "./components/Skills";
import { Projects } from "./components/Projects";
import { Certifications } from "./components/Certifications";
import { Footer } from "./components/Footer";
import { BackToTop } from "./components/BackToTop";
import { ErrorBoundary } from "./components/ErrorBoundary";

export default function App() {
  return (
    <div className="relative min-h-screen grain">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-pill focus:bg-accent focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:font-medium focus:text-surface"
      >
        Skip to content
      </a>
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_-5%,rgba(231,169,80,0.05),transparent)]" />
      <Navbar />
      <main id="main" tabIndex={-1} className="relative z-10">
        <ErrorBoundary>
          <Hero />
          <About />
          <Experience />
          <Skills />
          <Projects />
          <Certifications />
        </ErrorBoundary>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
