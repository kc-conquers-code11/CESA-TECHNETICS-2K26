import { useLayoutEffect } from 'react';
import { ReactLenis } from 'lenis/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HomePage from '../components/HomePage'; 

gsap.registerPlugin(ScrollTrigger);

const Index = () => {
  
  // Reload fix: Always scroll to top
  useLayoutEffect(() => {
    if (window.history.scrollRestoration) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    setTimeout(() => ScrollTrigger.refresh(), 200);
  }, []);

  return (
    <ReactLenis root>
      <main className="w-full bg-black min-h-screen">
        
        {/* StrangerHero yahan se hata diya kyunki wo ab HomePage ke andar hai */}
        
        {/* SECTION: MAIN HOME PAGE (Handles Intro & Content internally) */}
        <HomePage />

      </main>
    </ReactLenis>
  );
};

export default Index;