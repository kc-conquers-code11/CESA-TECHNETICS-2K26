import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import React from 'react';

// Import the video asset directly to ensure Vite handles the path correctly
import heroVideo from '../assets/video/optimized_hero.webm'; 
import heroVideoMobile from '../assets/video/optimized_hero_mobile.webm'; 

const TARGET_DATE = new Date("2026-03-16T00:00:00").getTime();

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // State to control when the text and timer appear
  const [showContent, setShowContent] = useState(false);

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

  // Handle the video loop and content reveal
  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const video = videoRef.current;
      
      const loopStartTime = video.duration - 5; 
      const revealTime = 12; 
      
      // 1. Reveal content when we hit the reveal time
      if (video.currentTime >= revealTime && !showContent) {
        setShowContent(true);
      }

      // 2. Loop logic: if we reach the end of the video, jump back 5 seconds
      if (video.currentTime >= video.duration - 0.1) {
        video.currentTime = loopStartTime;
      }
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden pt-20">
      
      {/* Background Video Section */}
      <div className="absolute inset-0 z-0 bg-black">
        <video 
          ref={videoRef}
          autoPlay 
          muted 
          playsInline 
          preload="auto"
          onTimeUpdate={handleTimeUpdate}
          className="w-full h-full object-cover opacity-70"
        >
          <source src={heroVideoMobile} type="video/webm" media="(max-width: 768px)" />
          <source src={heroVideo} type="video/webm" />
        </video>
        <div className="absolute inset-0 z-20 bg-linear-to-b from-[#021516]/80 via-[#021516]/40 to-[#021516]"></div>
      </div>

      {/* We use pointer-events-none when hidden so users can't accidentally click 
        invisible buttons or select invisible text before it reveals.
      */}
      <div className={`relative z-30 text-center px-4 flex flex-col items-center ${showContent ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        
        {/* Main Event Title */}
        <motion.h1 
          initial={{ y: 30, opacity: 0 }} 
          animate={{ y: showContent ? 0 : 30, opacity: showContent ? 1 : 0 }} 
          transition={{ duration: 1 }}
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
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: showContent ? 0 : 20, opacity: showContent ? 1 : 0 }} 
          transition={{ duration: 1, delay: showContent ? 0.2 : 0 }}
          style={{
            fontFamily: "'BlackChancery', serif",
            fontWeight: 5,
            fontStyle: 'normal',
            fontSize: 'clamp(24px, 6vw, 42px)',
            lineHeight: '100%',
            letterSpacing: '0%',
            textAlign: 'center',
            color: '#B5FFF0',
          }}
          className="mb-6 drop-shadow-lg"
        >
          Where Code Meets Magic.
        </motion.p>

        <motion.p 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: showContent ? 0 : 20, opacity: showContent ? 1 : 0 }} 
          transition={{ duration: 1, delay: showContent ? 0.2 : 0 }}
          className="text-2xl md:text-3xl text-teal-100 mb-6 drop-shadow-lg font-manrope font-medium"
        >
          March 16-18, 2026  •  Vasantdada Patil Pratishthan’s College of Engineering & Visual Arts, Sion
        </motion.p>

        {/* Professional Countdown Timer Display */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: showContent ? 1 : 0.9, opacity: showContent ? 1 : 0 }} 
          transition={{ duration: 0.8, delay: showContent ? 0.6 : 0 }}
          className="flex items-center justify-center w-full mt-8 md:mt-12"
        >
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 md:gap-10">
            {Object.entries(timeLeft).map(([unit, value], index) => (
              <React.Fragment key={unit}>

                {/* CARD */}
                <div className="relative w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 flex items-center justify-center">

                  {/* GOLD CORNERS */}
                  <span className="absolute top-0 left-0 w-3 sm:w-4 h-3 sm:h-4 border-t-2 border-l-2 border-[#d4af37]" />
                  <span className="absolute top-0 right-0 w-3 sm:w-4 h-3 sm:h-4 border-t-2 border-r-2 border-[#d4af37]" />
                  <span className="absolute bottom-0 left-0 w-3 sm:w-4 h-3 sm:h-4 border-b-2 border-l-2 border-[#d4af37]" />
                  <span className="absolute bottom-0 right-0 w-3 sm:w-4 h-3 sm:h-4 border-b-2 border-r-2 border-[#d4af37]" />

                  {/* INNER BOX */}
                  <div className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-[#F5E6C8] rounded-sm flex flex-col items-center justify-center text-center border-2 border-[#d4af37] shadow-[0_10px_25px_rgba(0,0,0,0.4)]">

                    {/* NUMBER */}
                    <span className="tracking-tight leading-none text-2xl sm:text-4xl md:text-5xl font-bold text-[#2d1f14] drop-shadow-[0_3px_2px_rgba(0,0,0,0.4)]">
                      {String(value).padStart(2, "0")}
                    </span>

                    {/* UNIT */}
                    <span className="leading-none mt-1 sm:mt-[6px] text-xs sm:text-lg md:text-xl text-[#6b4f2a] tracking-wide font-medium" style={{ fontFamily: "'BlackChancery', serif"}}>
                      {unit.charAt(0).toUpperCase() + unit.slice(1)}
                    </span>

                  </div>
                </div>

                {/* STAR */}
                {index < Object.keys(timeLeft).length - 1 && (
                  <span className="text-[#d4af37] text-2xl sm:text-4xl md:text-5xl select-none hidden sm:block">
                    ✦
                  </span>
                )}

              </React.Fragment>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
