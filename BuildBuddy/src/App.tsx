import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Lenis from '@studio-freight/lenis';
import Header from './components/Header';
import BeachSection from './components/sections/BeachSection';
import CitySection from './components/sections/CitySection';
import CTASection from './components/sections/CTASection';
import MountainSection from './components/sections/MountainSection';
import './index.css';

// Extend Window interface to include our custom scrollToSection function
declare global {
  interface Window {
    scrollToSection?: (section: string) => void;
  }
}

export default function App() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const mountainSectionRef = useRef<HTMLDivElement>(null);
  const beachSectionRef = useRef<HTMLDivElement>(null);
  const citySectionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      smoothWheel: true
    });

    // Use RAF with timestamp for better performance
    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);
    
    // Add ResizeObserver to handle layout changes gracefully
    const resizeObserver = new ResizeObserver(() => {
      lenis.resize();
    });
    
    if (scrollRef.current) {
      resizeObserver.observe(scrollRef.current);
    }

    // Function to scroll to sections
    window.scrollToSection = (section: string) => {
      // Use setTimeout to ensure the DOM is fully rendered
      setTimeout(() => {
        if (section === 'mountains' && mountainSectionRef.current) {
          // Get the element position and scroll with offset
          const mountainElement = mountainSectionRef.current;
          const offset = mountainElement.getBoundingClientRect().top + window.scrollY;
          lenis.scrollTo(offset, { offset: 0 });
        } else if (section === 'beaches' && beachSectionRef.current) {
          // Get the element position and scroll with offset
          const beachElement = beachSectionRef.current;
          const offset = beachElement.getBoundingClientRect().top + window.scrollY;
          lenis.scrollTo(offset, { offset: 0 });
        } else if (section === 'cities' && citySectionRef.current) {
          // Get the element position and scroll with offset
          const cityElement = citySectionRef.current;
          const offset = cityElement.getBoundingClientRect().top + window.scrollY;
          lenis.scrollTo(offset, { offset: 0 });
        }
      }, 100); // Short delay to ensure layout calculations are complete
    };

    return () => {
      // Properly clean up the animation frame to prevent memory leaks
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.scrollToSection = undefined;
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className="relative overflow-hidden font-inter" ref={scrollRef}>
      <div ref={mountainSectionRef} id="mountains-section">
        <MountainSection />
      </div>
      <Header />

      {/* Add Start Planning Button */}
      <div className="fixed top-4 right-4 z-50">
        <motion.button
          onClick={() => navigate('/setup')}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-full
                   shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2
                   hover:scale-105 active:scale-95 font-medium"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)' }}
        >
          Start Planning
        </motion.button>
      </div>

      <main className="relative">
        <AnimatePresence>
          <div className="relative scroll-smooth">
            <div ref={beachSectionRef} id="beaches-section">
              <BeachSection />
            </div>
            <div ref={citySectionRef} id="cities-section">
              <CitySection />
            </div>
            <CTASection />
          </div>
        </AnimatePresence>
      </main>
    </div>
  );
}
