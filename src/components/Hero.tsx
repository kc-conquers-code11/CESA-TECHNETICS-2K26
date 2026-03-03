import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  // Simple Countdown Logic
  const [timeLeft, setTimeLeft] = useState({ days: 105, hours: 3, minutes: 27, seconds: 6 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else { seconds = 59; if (minutes > 0) minutes--; else { minutes = 59; if (hours > 0) hours--; else { hours = 23; days--; } } }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden pt-20">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img src="/hogwarts-bg.svg" alt="Background" className="w-full h-full object-cover opacity-60 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#021516]/80 via-[#021516]/60 to-[#021516]"></div>
      </div>

      <div className="relative z-10 text-center px-4 flex flex-col items-center">
        {/* Main Title */}
        <motion.h1
          initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1 }}
          className="text-6xl md:text-8xl font-black text-[#d4af37] mb-2 drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          TECHNETICS 2K26
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, delay: 0.2 }}
          className="text-2xl md:text-3xl text-teal-100 font-semibold mb-6"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          Where Code Meets Magic.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.4 }}
          className="text-sm md:text-base text-gray-300 mb-12 max-w-3xl"
        >
          April 17-19, 2026 • Vasantdada Patil Pratishthan's College of Engineering & Visual Arts, Sion
        </motion.p>

        {/* Countdown Timer */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8, delay: 0.6 }}
          className="flex items-center gap-4 md:gap-8"
        >
          {Object.entries(timeLeft).map(([unit, value]) => (
            <div key={unit} className="flex flex-col items-center">
              <div className="w-20 h-24 md:w-28 md:h-32 bg-[#fffdf5] rounded-md flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.2)] border border-[#d4af37]/50 relative">
                {/* Vintage Corner Accents */}
                <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-[#d4af37]"></div>
                <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-[#d4af37]"></div>
                <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-[#d4af37]"></div>
                <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-[#d4af37]"></div>

                <span className="text-4xl md:text-5xl font-bold text-black">{String(value).padStart(2, '0')}</span>
              </div>
              <span className="text-[#d4af37] mt-3 font-serif capitalize tracking-widest">{unit}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;