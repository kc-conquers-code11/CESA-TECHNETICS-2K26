import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// Import the video asset directly to ensure Vite handles the path correctly
import heroVideo from '../assets/hero.mp4'; 

const TARGET_DATE = new Date("2026-03-17T00:00:00").getTime();

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Logic to calculate the time remaining until the event start date
  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const difference = TARGET_DATE - now;

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    // Update the countdown timer every 1 second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Explicitly trigger play to handle potential browser autoplay restrictions
    if (videoRef.current) {
      videoRef.current.play().catch(err => console.error("Playback failed:", err));
    }

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden pt-20">
      
      {/* Background Video Section */}
      <div className="absolute inset-0 z-0 bg-black">
        <video 
          ref={videoRef}
          src={heroVideo}
          autoPlay 
          loop 
          muted 
          playsInline 
          preload="auto"
          // Removed mix-blend-overlay and adjusted opacity for better visibility
          className="w-full h-full object-cover opacity-70"
        />
        {/* Dark Gradient Overlay to ensure text readability */}
        <div className="absolute inset-0 z-20 bg-gradient-to-b from-[#021516]/80 via-[#021516]/40 to-[#021516]"></div>
      </div>

      <div className="relative z-30 text-center px-4 flex flex-col items-center">
        {/* Main Event Title */}
        <motion.h1 
          initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1 }}
          className="mb-2 drop-shadow-[0_0_30px_rgba(255,183,0,0.6)]"
          style={{
            fontFamily: "'Harry P', 'Cinzel', serif",
            fontWeight: 400,
            fontStyle: 'normal',
            fontSize: 'clamp(64px, 10vw, 128px)',
            lineHeight: '100%',
            letterSpacing: '0%',
            textAlign: 'center',
            background: 'linear-gradient(90deg, #FFE092 0%, #FFB702 26.68%, #FFC229 42.24%, #FFE6A8 56.25%, #FFD05A 70.39%, #FFB700 81.87%, #FFB804 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          TECHNETICS 2K26
        </motion.h1>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, delay: 0.2 }}
          style={{
            fontFamily: "'BlackChancery', serif",
            fontWeight: 5,
            fontStyle: 'normal',
            fontSize: '42px',
            lineHeight: '100%',
            letterSpacing: '0%',
            textAlign: 'center',
            color: '#B5FFF0',
          }}
          className="mb-6 drop-shadow-lg"
        >
          Where Code Meets Magic.
        </motion.p>

        {/* Professional Countdown Timer Display */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8, delay: 0.6 }}
          className="flex items-center gap-3 md:gap-6 mt-8"
        >
          {Object.entries(timeLeft).map(([unit, value]) => (
            <div key={unit} className="flex flex-col items-center group">
              <div className="relative w-24 h-28 md:w-32 md:h-36 rounded-xl flex items-center justify-center overflow-hidden border border-[#d4af37]/30 bg-[#021516]/60 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.6)] group-hover:border-[#d4af37]/80 group-hover:shadow-[0_0_40px_rgba(212,175,55,0.3)] transition-all duration-500">
                <span className="relative text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#fef08a] via-[#d4af37] to-[#b45309] drop-shadow-xl" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {String(value).padStart(2, '0')}
                </span>
              </div>
              <span className="text-teal-200 mt-4 font-bold text-sm md:text-base uppercase tracking-[0.2em] group-hover:text-[#d4af37] transition-colors">
                {unit}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;