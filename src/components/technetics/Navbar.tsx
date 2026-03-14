import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Wand2, LogOut } from 'lucide-react';
import logo from '../../assets/technetics-head.svg';

// Import your audio file
import bgMusic from '../../assets/bgscore.ogg';
import { useNavigate } from 'react-router-dom';

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Events", href: "#events" },
  { label: "Clubly", href: "#clubly" },
  { label: "Discord", href: "#discord" },
  { label: "Sponsors", href: "#sponsors" },
  { label: "Contact Us", href: "#contact" },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Audio States
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Scroll Handler
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // NEW: 40-Second Autoplay Handler
  useEffect(() => {
    let stopTimer: ReturnType<typeof setTimeout> | null = null;

    const attemptAutoPlay = async () => {
      if (audioRef.current) {
        try {
          audioRef.current.volume = 0.5; // Set a nice background volume (50%)

          // Attempt to play the audio
          await audioRef.current.play();
          setIsPlaying(true);

          // If play is successful, set a timer to stop it after 40 seconds (40000 ms)
          stopTimer = setTimeout(() => {
            if (audioRef.current) {
              audioRef.current.pause();
              setIsPlaying(false);
            }
          }, 40000);

        } catch {
          // If the browser blocks autoplay because the user hasn't clicked the page yet,
          // it catches the error here instead of crashing your app.
          console.warn("Autoplay prevented by browser. User must interact first.");
          setIsPlaying(false);
        }
      }
    };

    attemptAutoPlay();

    // Cleanup the timer if the user leaves the page before 40 seconds
    return () => {
      if (stopTimer) clearTimeout(stopTimer);
    };
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Toggle Audio Function (Manual override)
  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => console.error("Audio play failed:", err));
        audioRef.current.volume = 0.5;
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled
          ? 'bg-[#1a0f08]/95 backdrop-blur-md border-b-2 border-[#8b6e2e]/30 shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
          : 'bg-transparent'
        }`}
    >
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">

        {/* Hidden Audio Element - Notice loop is removed since we only want 40s! */}
        <audio ref={audioRef} src={bgMusic} preload="auto" onEnded={() => setIsPlaying(false)} onPause={() => setIsPlaying(false)} onPlay={() => setIsPlaying(true)} />

        {/* Branding (Matching CompetitionHeader) */}
        <div
          className="flex items-center gap-4 cursor-pointer group"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-tr from-[#3d2618] to-[#8b6e2e] border-2 border-[#d4af37] flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-transform group-hover:scale-110">
            <Wand2 className="w-5 h-5 md:w-6 md:h-6 text-[#d4af37]" />
          </div>
          <div className="hidden sm:block">
            <h1 className="font-wizard text-xl md:text-2xl text-[#d4af37] tracking-widest leading-none">
              TECH<span className="text-[#f2e0b5]">NETICS</span>
            </h1>
            <p className="text-[8px] text-[#f2e0b5]/60 font-crimson italic tracking-[0.2em] uppercase mt-1">
              Ministry of Coding
            </p>
          </div>
        </div>

        {/* Desktop Nav Links (Themed) */}
        <div className="hidden lg:flex items-center space-x-1 px-4 py-1.5 rounded-full bg-[#3d2618]/40 backdrop-blur-md border border-[#8b6e2e]/20 shadow-inner">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="px-4 py-2 text-[10px] font-bold tracking-[0.2em] text-[#f2e0b5]/70 hover:text-[#d4af37] transition-all duration-300 relative group uppercase font-crimson"
            >
              {link.label}
              <span className="absolute inset-x-4 bottom-1 h-px bg-[#d4af37] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
            </a>
          ))}
        </div>

        {/* Controls: Audio Toggle, Portal Button, Mobile Menu */}
        <div className="flex items-center gap-3 md:gap-4 pl-4 border-l border-[#8b6e2e]/20">
          <div className="relative flex flex-col items-center">
            {/* Audio Button */}
            <motion.button
              onClick={toggleAudio}
              className="relative z-10 text-[#d4af37] hover:text-[#FFD05A] p-2 transition-colors outline-none cursor-pointer rounded-full hover:bg-[#8b6e2e]/20 border border-[#8b6e2e]/10"
              title={isPlaying ? "Mute Background Music" : "Play Background Music"}
              animate={!isPlaying ? { rotate: [0, -10, 10, -10, 10, 0] } : { rotate: 0 }}
              transition={!isPlaying ? { duration: 0.5, repeat: Infinity, repeatDelay: 4 } : {}}
            >
              {!isPlaying && (
                <motion.span
                  animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                  className="absolute inset-0 rounded-full bg-[#d4af37]/40 -z-10"
                />
              )}
              {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </motion.button>

            {/* Tooltip */}
            <AnimatePresence>
              {!isPlaying && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -5, scale: 0.9 }}
                  className="absolute top-12 px-3 py-1.5 bg-[#d4af37] text-black text-[9px] font-bold rounded-md shadow-[0_0_15px_rgba(212,175,55,0.4)] whitespace-nowrap pointer-events-none z-20 font-crimson tracking-widest"
                >
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#d4af37] rotate-45" />
                  TAP FOR MUSIC
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => navigate('/games')}
            className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-tr from-[#3d2618] to-[#8b6e2e] text-[#d4af37] text-[10px] font-bold tracking-[0.2em] rounded-lg cursor-pointer hover:from-[#8b6e2e] hover:to-[#3d2618] transition-all uppercase border border-[#d4af37]/30 shadow-lg font-wizard"
          >
            Portal
          </button>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-[#d4af37] hover:bg-[#8b6e2e]/20 p-2 rounded-lg transition-colors border border-[#8b6e2e]/10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M3 12h18m-18 6h18" />
                }
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 w-full bg-[#1a0f08]/98 backdrop-blur-xl border-b border-[#8b6e2e]/30 flex flex-col items-center py-8 gap-6 md:hidden overflow-hidden shadow-2xl"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-xs font-bold tracking-[0.3em] text-[#f2e0b5]/80 hover:text-[#d4af37] transition-all uppercase font-crimson"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => navigate('/games')}
              className="mt-4 px-8 py-3 bg-[#d4af37] text-black text-[10px] font-bold tracking-[0.2em] rounded-lg transition-all uppercase font-wizard shadow-lg active:scale-95"
            >
              Enter Great Hall
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;