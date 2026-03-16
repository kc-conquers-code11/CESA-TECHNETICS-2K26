import { useRef } from "react";
import type { MouseEvent } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown, SkipForward } from "lucide-react"; 

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

interface StrangerHeroProps {
  onComplete?: () => void;
}

export default function StrangerHero({ onComplete }: StrangerHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null); // Ref for particles container

  const strangerChars = useRef<HTMLSpanElement[]>([]);
  const thingsChars = useRef<HTMLSpanElement[]>([]);

  const textTop = "STRANGER";
  const textBottom = "TECH"; 

  useGSAP(() => {
    // 1. Scroll-Based Animation (Zoom & Fly Away)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=2000",
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        onLeave: () => {
          if (onComplete) onComplete();
        }
      },
    });

    tl.to(bgRef.current, { scale: 1.5, opacity: 0, ease: "power1.in", duration: 1 }, 0);
    tl.to(wrapperRef.current, { scale: 20, opacity: 0, ease: "power2.inOut", duration: 1 }, 0); // Note: scale is animated here
    tl.to(barRef.current, { scaleX: 5, opacity: 0, ease: "power2.in", duration: 0.8 }, 0);

    tl.to(strangerChars.current, {
      y: "-150vh", 
      x: (i) => ((i - (textTop.length - 1) / 2) * 500), 
      scale: 10, 
      rotate: (i) => (i - 3.5) * 20,
      ease: "power2.inOut",
      duration: 1
    }, 0);

    tl.to(thingsChars.current, {
      y: "150vh", 
      x: (i) => ((i - (textBottom.length - 1) / 2) * 500),
      scale: 10,
      rotate: (i) => (i - 1.5) * -20,
      ease: "power2.inOut",
      duration: 1
    }, 0);

    // 2. Anti-Gravity Particle System (Independent Animation)
    if (particlesRef.current) {
        const particles = particlesRef.current.children;
        Array.from(particles).forEach((particle) => {
            gsap.to(particle, {
                y: -100 - Math.random() * 200, // Move Upwards
                x: (Math.random() - 0.5) * 50, // Drift Sideways
                rotation: Math.random() * 360,
                opacity: 0,
                duration: 5 + Math.random() * 10,
                ease: "none",
                repeat: -1,
                delay: Math.random() * 5,
            });
        });
    }

    // 3. Subtle Text Levitation (Breathing Effect)
    // We animate a property that ISN'T controlled by the scrollTrigger to avoid conflicts.
    // Since 'scale' is controlled by scroll, we can use 'y' (vertical position) for a subtle hover
    // BUT 'wrapperRef' scale is controlled by scroll. To be safe, we can animate a wrapper inside wrapperRef or just be careful.
    // However, wrapperRef is zoomed dramatically. A better approach is to animate the *individual letter containers* slightly before scroll starts,
    // OR just let the particles do the work to avoid fighting the scroll scrub.
    // Let's stick to particles for the "atmosphere" to ensure zero regression on the main zoom.

  }, { scope: containerRef });

  const handleSkipClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); 
    e.preventDefault();
    if (onComplete) onComplete();
  };

  // Generate random particles
  const particles = Array.from({ length: 30 }).map((_, i) => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() * 4 + 1}px`,
      opacity: Math.random() * 0.5 + 0.2,
  }));

  return (
    <section 
      ref={containerRef} 
      className="relative w-full overflow-hidden bg-black flex flex-col items-center justify-center perspective-[1000px] z-50"
      style={{ height: "100vh" }}
    >
      
      {/* BACKGROUND */}
      <div ref={bgRef} className="absolute inset-0 z-0 pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1518066000714-58c45f1a2c0a?q=80&w=2560&auto=format&fit=crop" 
          alt="Forest"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000_90%)]" />
      </div>

      {/* PARTICLE SYSTEM (Magical Dust) */}
      <div ref={particlesRef} className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          {particles.map((p, i) => (
              <div 
                key={i}
                className="absolute bg-zinc-400 rounded-full blur-[1px]"
                style={{
                    left: p.left,
                    top: p.top,
                    width: p.size,
                    height: p.size,
                    opacity: p.opacity,
                }}
              />
          ))}
      </div>

      {/* SKIP BUTTON */}
      <div className="absolute top-8 right-8 z-[9999]">
        <button 
            onClick={handleSkipClick}
            className="flex items-center gap-2 px-5 py-2 border border-zinc-600 bg-black/60 hover:bg-red-600 hover:border-red-600 text-zinc-300 hover:text-white rounded-full transition-all duration-300 text-xs font-bold uppercase tracking-widest backdrop-blur-md shadow-lg cursor-pointer pointer-events-auto"
        >
            Skip Intro <SkipForward className="w-3 h-3" />
        </button>
      </div>

      {/* CONTENT WRAPPER */}
      <div 
        ref={wrapperRef}
        className="relative z-20 flex flex-col items-center justify-center will-change-transform pointer-events-none"
      >
        <h1 className="flex justify-center overflow-visible">
          {textTop.split("").map((char, i) => (
            <span
              key={i}
              ref={(el) => { if (el) strangerChars.current[i] = el; }}
              className="font-st st-glow font-black select-none leading-none inline-block origin-center will-change-transform tracking-tighter mx-[-2px] text-white"
              style={{ fontSize: "clamp(3rem, 9vw, 8rem)", textShadow: "0 0 20px rgba(255,0,0,0.5)" }}
            >
              {char}
            </span>
          ))}
        </h1>

        <div 
          ref={barRef}
          className="st-bar-glow w-[100%] h-[4px] md:h-[6px] my-4 rounded-full shadow-[0_0_30px_#ff1f1f] bg-red-600"
        />

        <h1 className="flex justify-center overflow-visible">
          {textBottom.split("").map((char, i) => (
            <span
              key={i}
              ref={(el) => { if (el) thingsChars.current[i] = el; }}
              className="font-st st-glow font-black select-none leading-none inline-block origin-center will-change-transform tracking-tighter mx-[-2px] text-white"
              style={{ fontSize: "clamp(3rem, 9vw, 8rem)", textShadow: "0 0 20px rgba(255,0,0,0.5)" }}
            >
              {char}
            </span>
          ))}
        </h1>
      </div>

      <div className="absolute bottom-10 z-20 animate-bounce flex flex-col items-center opacity-70 pointer-events-none">
        <span className="text-zinc-500 text-xs uppercase tracking-[0.2em] mb-2">Scroll to Enter</span>
        <ChevronDown className="text-red-600 w-6 h-6" />
      </div>

    </section>
  );
}