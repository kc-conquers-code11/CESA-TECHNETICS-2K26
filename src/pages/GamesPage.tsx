import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { loginApi } from '../lib/auth';
import { useCompetitionStore } from '@/store/competitionStore';
import { toast } from 'sonner';

const STARS = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 1 + Math.random() * 2,
  duration: 2 + Math.random() * 3,
  delay: Math.random() * 5,
  color: (i % 3 === 0) ? '#B5FFF0' : (i % 2 === 0) ? '#ffffff' : '#d4af37',
}));

const GamesPage = () => {
  const navigate = useNavigate();

  // Determine initial page based on date
  // March 16 (or before) = 0, March 17 = 1
  const getInitialPage = () => {
    const today = new Date();
    // In JS months are 0-indexed. March is index 2.
    if (today.getMonth() === 2 && today.getDate() >= 17) return 1;
    return 0;
  };

  const [currentPage, setCurrentPage] = React.useState(getInitialPage());
  const [direction, setDirection] = React.useState(0);
  const [loadingIdx, setLoadingIdx] = React.useState<number | null>(null);

  const DARK_MARK_START_TIME = new Date("2026-03-17T06:00:00+05:30").getTime();
  const [currentTime, setCurrentTime] = React.useState(Date.now());
  
  const isDarkMarkLocked = React.useMemo(() => {
    return currentTime < DARK_MARK_START_TIME;
  }, [currentTime, DARK_MARK_START_TIME]);

  React.useEffect(() => {
    if (!isDarkMarkLocked) return;
    const interval = setInterval(() => {
      const now = Date.now();
      setCurrentTime(now);
      if (now >= DARK_MARK_START_TIME) {
        clearInterval(interval);
      }
    }, 1000 * 60);
    return () => clearInterval(interval);
  }, [isDarkMarkLocked, DARK_MARK_START_TIME]);

  const [formData, setFormData] = React.useState([
    { email: "", pass: "" },
    { email: "", pass: "" }
  ]);

  const { initializeUser } = useCompetitionStore();

  const handleLogin = async (e: React.FormEvent, idx: number, title: string) => {
    e.preventDefault();
    
    // Lock check for Dark Mark Bounty
    if (idx === 1 && isDarkMarkLocked) {
      toast.error("The Dark Mark is currently sealed until March 17th, 6 AM.");
      return;
    }

    setLoadingIdx(idx);
    const { email, pass } = formData[idx];

    try {
      const res = await loginApi({ email, password: pass });

      // Store Token
      localStorage.setItem("token", res.session?.access_token || "");

      // Initialize Zustand Store
      if (res.user) {
        await initializeUser(res.user.id, res.user.email || "");
      }

      const state = useCompetitionStore.getState();
      const { setActiveCompetition } = useCompetitionStore.getState();

      if (title === "The Order of the Obscure Code") {
        if (!state.isObscure && !res.isAdmin) {
          toast.error("Access Denied: You are not registered for The Order of Obscure.");
          setLoadingIdx(null);
          return;
        }
        setActiveCompetition('obscure');

        if (res.isAdmin) {
          navigate("/admin");
        } else {
          navigate('/rules');
        }
      } else {
        // Dark Mark Bounty Logic
        if (!state.isDarkMark && !res.isAdmin) {
          toast.error("Access Denied: You are not registered for the Dark Mark Bounty.");
          setLoadingIdx(null);
          return;
        }
        setActiveCompetition('darkmark');

        if (res.isAdmin) {
          navigate("/admin");
        } else {
          navigate('/rules');
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoadingIdx(null);
    }
  };

  const bookEvents = [
    {
      date: "March 16",
      title: "The Order of the Obscure Code",
      description: "A multi-round technical showdown culminating in a 15-hour online hackathon-style finale.",
      teamSize: "2-4 Members",
      prizePool: "₹12,000",
      id: 0
    },
    {
      date: "March 17",
      title: "The Dark Mark Bounty",
      description: "The ultimate hybrid Tech & Cybersecurity challenge where physical speed meets digital intellect.",
      teamSize: "2-3 Members",
      prizePool: "₹8,000",
      id: 1
    }
  ];

  const paginate = (newDirection: number) => {
    const nextPage = currentPage + newDirection;
    if (nextPage >= 0 && nextPage < bookEvents.length) {
      setDirection(newDirection);
      setCurrentPage(nextPage);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      rotateY: direction > 0 ? 90 : -90,
      opacity: 0,
    }),
    center: {
      rotateY: 0,
      opacity: 1,
      zIndex: 1,
    },
    exit: (direction: number) => ({
      rotateY: direction < 0 ? 90 : -90,
      opacity: 0,
      zIndex: 0,
    }),
  };

  const event = bookEvents[currentPage];

  return (
    <div className="min-h-screen relative bg-[#021516] flex items-center justify-center p-4 md:p-12 py-24 overflow-x-hidden overflow-y-auto">
      {/* ── TWINKLING STARS BACKGROUND ────────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {STARS.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              background: star.color,
              boxShadow: `0 0 10px 1px ${star.color}66`,
            }}
            animate={{ opacity: [0, 0.7, 0.2, 0.8, 0], scale: [0.5, 1, 0.8, 1.2, 0.5] }}
            transition={{ duration: star.duration, delay: star.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      <svg className="absolute w-0 h-0" xmlns="http://www.w3.org/2000/svg">
        <filter id="deckle-edges">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" />
        </filter>
      </svg>

      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#B5FFF0]/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#B5FFF0]/5 blur-[150px] rounded-full animate-pulse delay-1000" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative w-full max-w-2xl min-h-[85vh] flex group"
        style={{ perspective: "1500px" }}
      >
        {/* ── THE LEATHER BOOK COVER ── */}
        <div className="absolute inset-x-0 -inset-y-6 bg-[#1a0f08] rounded-[6px] shadow-[0_60px_100px_-20px_rgba(0,0,0,0.95)] border-r-8 border-b-8 border-black/50 transform scale-[1.01] -z-10" />

        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentPage}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              rotateY: { type: "spring", stiffness: 100, damping: 20 },
              opacity: { duration: 0.3 }
            }}
            className="flex-1 min-h-full relative overflow-hidden flex flex-col p-8 md:p-12 md:pb-14"
            style={{ transformOrigin: direction >= 0 ? "left center" : "right center" }}
          >
            {/* ── PARCHMENT BACKGROUND LAYER (Isolated Filter) ── */}
            <div
              className={`absolute inset-0 shadow-[inset_0_0_100px_rgba(139,115,85,0.4)] parchment-rough-edges -z-10 transition-all duration-1000 ${currentPage === 1 && isDarkMarkLocked ? "grayscale opacity-80" : ""}`}
              style={{
                background: `linear-gradient(${currentPage === 0 ? 'to right' : 'to left'}, #f2e0b5, #e8d19e)`
              }}
            />

            {/* Complex Parchment Layering */}
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/rice-paper.png')]" />
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stained-paper.png')]" />

            <div className="absolute inset-6 border border-[#3d2618]/10 pointer-events-none rounded-sm" />

            {/* Date (Script - Top Right) */}
            <div className="text-right z-10 mb-4 md:mb-6">
              <span className="font-script text-2xl md:text-3xl text-[#3d2618]/70 block transform -rotate-2">
                {event.date}
              </span>
            </div>

            <div className="flex-1 flex flex-col items-center justify-start text-center z-10">
              <h2 className="font-wizard text-3xl md:text-4xl lg:text-5xl ink-text mb-4 lg:mb-5 tracking-tight leading-[1.1]">
                {event.title}
              </h2>

              <p className="font-crimson italic text-base md:text-lg text-[#3d2618] mb-6 md:mb-8 max-w-[90%] opacity-90 leading-relaxed px-4">
                "{event.description}"
              </p>

              <div className="grid grid-cols-1 gap-4 md:gap-6 mb-8 w-full max-w-[280px]">
                <div className="flex flex-col items-center group/stat">
                  <span className="text-[9px] uppercase tracking-[0.4em] text-[#3d2618]/40 font-bold mb-1">Team Size</span>
                  <span className="font-crimson text-xl text-[#1a0f08] font-bold border-b border-[#3d2618]/20 pb-0.5 w-full">{event.teamSize}</span>
                </div>
                <div className="flex flex-col items-center group/stat">
                  <span className="text-[9px] uppercase tracking-[0.4em] text-[#3d2618]/40 font-bold mb-1">Prize Pool</span>
                  <span className="font-wizard text-2xl text-[#8b6e2e]">{event.prizePool}</span>
                </div>
              </div>

              <div className="w-full max-w-[300px] mt-auto">
                <form onSubmit={(e) => handleLogin(e, currentPage, event.title)} className="space-y-4 md:space-y-5">
                  <div className="relative">
                    <input
                      id={`email-${currentPage}`}
                      name={`email-${currentPage}`}
                      type="email"
                      placeholder="Leader email"
                      required
                      value={formData[currentPage].email}
                      onChange={(e) => setFormData(prev => {
                        const newForm = [...prev];
                        newForm[currentPage] = { ...newForm[currentPage], email: e.target.value };
                        return newForm;
                      })}
                      className="w-full bg-[#1a0f08]/5 border-b-2 border-[#1a0f08]/30 focus:border-[#8b6e2e] py-2 px-2 text-[#1a0f08] placeholder:text-[#1a0f08]/30 outline-none transition-all font-crimson text-base md:text-lg"
                    />
                  </div>
                  <div className="relative">
                    <input
                      id={`pass-${currentPage}`}
                      name={`pass-${currentPage}`}
                      type="password"
                      placeholder="Password"
                      required
                      value={formData[currentPage].pass}
                      onChange={(e) => setFormData(prev => {
                        const newForm = [...prev];
                        newForm[currentPage] = { ...newForm[currentPage], pass: e.target.value };
                        return newForm;
                      })}
                      className="w-full bg-[#1a0f08]/5 border-b-2 border-[#1a0f08]/30 focus:border-[#8b6e2e] py-2 px-2 text-[#1a0f08] placeholder:text-[#1a0f08]/30 outline-none transition-all font-crimson text-base md:text-lg"
                    />
                  </div>

                  <div className="pt-2 flex flex-col gap-3">
                    <motion.button
                      whileHover={!(currentPage === 1 && isDarkMarkLocked) ? { scale: 1.02, backgroundColor: "#c4a04d" } : {}}
                      whileTap={!(currentPage === 1 && isDarkMarkLocked) ? { scale: 0.98 } : {}}
                      type="submit"
                      disabled={loadingIdx !== null || (currentPage === 1 && isDarkMarkLocked)}
                      className={`w-full py-3 md:py-4 transition-all rounded shadow-lg border border-[#1a0f08]/15 tracking-wide flex items-center justify-center relative group/btn ${currentPage === 1 && isDarkMarkLocked
                        ? "bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-50 grayscale"
                        : "bg-[#d4af37] text-[#1a0f08] font-wizard text-2xl md:text-3xl font-bold"
                        }`}
                    >
                      <span>
                        {currentPage === 1 && isDarkMarkLocked
                          ? "SEALED"
                          : loadingIdx === currentPage
                            ? "Verifying..."
                            : "Enter"}
                      </span>
                    </motion.button>
                    <div className="text-center">
                      <Link to="/signup" className="font-crimson italic text-[#3d2618]/60 hover:text-[#8b6e2e] transition-colors text-sm md:text-base border-b border-[#3d2618]/10 hover:border-[#8b6e2e]">
                        New to the Realm? Register Your Intent
                      </Link>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── BOOK NAVIGATION ARROWS ── */}
        <button
          onClick={() => paginate(-1)}
          disabled={currentPage === 0}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full pr-4 z-50 text-[#d4af37] hover:scale-110 transition-all disabled:opacity-0 p-4"
          aria-label="Previous Page"
        >
          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>

        <button
          onClick={() => paginate(1)}
          disabled={currentPage === bookEvents.length - 1}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full pl-4 z-50 text-[#d4af37] hover:scale-110 transition-all disabled:opacity-0 p-4"
          aria-label="Next Page"
        >
          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Sticky Note - Dynamic Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ rotate: 15, x: 200, opacity: 0 }}
            animate={{ rotate: 3, x: 0, opacity: 1 }}
            exit={{ x: -200, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="hidden lg:block absolute -bottom-10 right-10 w-44 h-44 bg-[#f8f1c6] p-4 shadow-2xl border border-[#3d2618]/10 z-50 overflow-hidden"
            style={{ clipPath: "polygon(0% 0%, 100% 0%, 95% 95%, 0% 100%)" }}
          >
            <div className={`w-4 h-4 rounded-full mx-auto mb-3 shadow-[0_2px_4px_rgba(0,0,0,0.5)] ${currentPage === 1 && isDarkMarkLocked ? "bg-zinc-800" : "bg-red-800"}`} />
            <p className="font-crimson text-sm text-[#3d2618] text-center leading-tight">
              {currentPage === 1 && isDarkMarkLocked ? (
                <>
                  <span className="font-bold text-zinc-900 uppercase">Access Denied:</span><br /> 
                  It's not the time yet. The Mark remains dormant.
                </>
              ) : (
                <>
                  <span className="font-bold text-red-900 uppercase">MANDATORY:</span><br /> 
                  Complete each seal carefully. The Registry is absolute.
                </>
              )}
            </p>
            <div className="absolute bottom-1 right-1 font-script text-[8px] text-[#3d2618]/30 uppercase">Ministry of Code</div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default GamesPage;