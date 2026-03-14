import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  const [loadingIdx, setLoadingIdx] = React.useState<number | null>(null);
  const [formData, setFormData] = React.useState([
    { email: "", pass: "" },
    { email: "", pass: "" }
  ]);

  const { initializeUser } = useCompetitionStore();

  const handleLogin = async (e: React.FormEvent, idx: number, title: string) => {
    e.preventDefault();
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

      if (title === "The Order of the Obscure Code") {
        if (res.isAdmin) {
          navigate("/admin");
        } else {
          navigate('/rules');
        }
      } else {
        // Dark Mark Bounty Logic
        const state = useCompetitionStore.getState();
        if (!state.isDarkMark && !res.isAdmin) {
          toast.error("Access Denied: You are not registered for the Dark Mark Bounty.");
          setLoadingIdx(null);
          return;
        }

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
      description: "A multi-round technical showdown culminating in a 15-hour online hackathon.",
      teamSize: "2-4 Members",
      prizePool: "₹12,000",
      isLeft: true
    },
    {
      date: "March 17",
      title: "The Dark Mark Bounty",
      description: "The ultimate hybrid Tech & Cybersecurity challenge where physical speed meets digital intellect.",
      teamSize: "2-3 Members",
      prizePool: "₹8,000",
      isLeft: false
    }
  ];

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

      {/* SVG filter for rough deckled edges */}
      <svg className="absolute w-0 h-0" xmlns="http://www.w3.org/2000/svg">
        <filter id="deckle-edges">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" />
        </filter>
      </svg>

      {/* Ambient particles background (Teal theme to match landing page) */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#B5FFF0]/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#B5FFF0]/5 blur-[150px] rounded-full animate-pulse delay-1000" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative w-full max-w-7xl min-h-[85vh] flex flex-col md:flex-row group"
      >
        {/* ── THE LEATHER BOOK COVER ── */}
        <div className="absolute inset-x-0 -inset-y-6 bg-[#1a0f08] rounded-[6px] shadow-[0_60px_100px_-20px_rgba(0,0,0,0.95)] border-r-8 border-b-8 border-black/50 transform scale-[1.01] -z-10" />

        {/* ── SUBTLE CENTER FOLD (Ribbon Marker) ── */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 z-40 bg-black/40 shadow-[0_0_12px_rgba(0,0,0,0.3)]" />

        {/* Central Gutter Overlay (Organic Shadow for the fold) */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-48 -translate-x-1/2 z-30 pointer-events-none bg-linear-to-r from-transparent via-black/15 to-transparent blur-2xl opacity-80" />

        <div className="flex-1 flex flex-col md:flex-row w-full h-full relative z-10">
          {bookEvents.map((event, idx) => (
            <motion.div
              key={idx}
              className={`flex-1 min-h-full relative overflow-hidden flex flex-col p-8 md:p-12 md:pb-14
                ${event.isLeft ? 'md:pr-14' : 'md:pl-14'}
                bg-[#f2e0b5]
                shadow-[inset_0_0_100px_rgba(139,115,85,0.4)]
                parchment-rough-edges
              `}
              style={{
                background: `linear-gradient(${event.isLeft ? 'to right' : 'to left'}, #f2e0b5, #e8d19e)`
              }}
            >
              {/* Complex Parchment Layering */}
              <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/rice-paper.png')]" />
              <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stained-paper.png')]" />

              {/* Subtle Page Fold Shadow (Non-linear transition) */}
              <div 
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  width: '8rem',
                  zIndex: 20,
                  pointerEvents: 'none',
                  filter: 'blur(4px)',
                  ...(event.isLeft ? {
                    right: 0,
                    background: 'linear-gradient(to left, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.05), transparent)'
                  } : {
                    left: 0,
                    background: 'linear-gradient(to right, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.05), transparent)'
                  })
                }} 
              />

              {/* Inked Borders */}
              <div className="absolute inset-6 border border-[#3d2618]/10 pointer-events-none rounded-sm" />

              {/* Date (Script - Top Right) */}
              <div className="text-right z-10 mb-4 md:mb-6">
                <span className="font-script text-2xl md:text-3xl text-[#3d2618]/70 block transform -rotate-2">
                  {event.date}
                </span>
              </div>

              {/* Content Center (Main Focus Area) */}
              <div className="flex-1 flex flex-col items-center justify-start text-center z-10">
                <h2 className="font-wizard text-3xl md:text-4xl lg:text-5xl ink-text mb-4 lg:mb-5 tracking-tight leading-[1.1]">
                  {event.title}
                </h2>

                <p className="font-crimson italic text-base md:text-lg text-[#3d2618] mb-6 md:mb-8 max-w-[90%] opacity-90 leading-relaxed px-4">
                  "{event.description}"
                </p>

                {/* Stats Grid - Centered & Premium Selection */}
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

                {/* Login Interaction */}
                <div className="w-full max-w-[300px] mt-auto">
                  <form onSubmit={(e) => handleLogin(e, idx, event.title)} className="space-y-4 md:space-y-5">
                    <div className="relative">
                      <input
                        id={`email-${idx}`}
                        name={`email-${idx}`}
                        type="email"
                        placeholder="Leader email"
                        required
                        value={formData[idx].email}
                        onChange={(e) => setFormData(prev => {
                          const newForm = [...prev];
                          newForm[idx] = { ...newForm[idx], email: e.target.value };
                          return newForm;
                        })}
                        className="w-full bg-[#1a0f08]/5 border-b-2 border-[#1a0f08]/30 focus:border-[#8b6e2e] py-2 px-2 text-[#1a0f08] placeholder:text-[#1a0f08]/30 outline-none transition-all font-crimson text-base md:text-lg"
                      />
                    </div>
                    <div className="relative">
                      <input
                        id={`pass-${idx}`}
                        name={`pass-${idx}`}
                        type="password"
                        placeholder="Password"
                        required
                        value={formData[idx].pass}
                        onChange={(e) => setFormData(prev => {
                          const newForm = [...prev];
                          newForm[idx] = { ...newForm[idx], pass: e.target.value };
                          return newForm;
                        })}
                        className="w-full bg-[#1a0f08]/5 border-b-2 border-[#1a0f08]/30 focus:border-[#8b6e2e] py-2 px-2 text-[#1a0f08] placeholder:text-[#1a0f08]/30 outline-none transition-all font-crimson text-base md:text-lg"
                      />
                    </div>

                    <div className="pt-2 flex flex-col gap-3">
                      <motion.button
                        whileHover={{
                          scale: 1.02,
                          backgroundColor: "#c4a04d",
                          boxShadow: "0 10px 20px -10px rgba(0,0,0,0.3)"
                        }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loadingIdx !== null}
                        className="w-full py-3 md:py-4 bg-[#d4af37] text-[#1a0f08] font-wizard text-2xl md:text-3xl rounded shadow-lg transition-all border border-[#1a0f08]/15 tracking-wide flex items-center justify-center relative group/btn disabled:opacity-50"
                      >
                        <span>{loadingIdx === idx ? "Verifying..." : "Enter"}</span>
                        <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-10 transition-opacity bg-white/20 blur-md rounded" />
                      </motion.button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Rusty/Torn Edge Visuals */}
              {event.isLeft ? (
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-linear-to-r from-transparent to-black/10 z-10" />
              ) : (
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-linear-to-l from-transparent to-black/10 z-10" />
              )}
            </motion.div>
          ))}
        </div>

        {/* Decorative elements - floating like real notes */}
        <motion.div
          initial={{ rotate: 15, x: 200, opacity: 0 }}
          animate={{ rotate: 3, x: 0, opacity: 1 }}
          transition={{ delay: 1.5, type: "spring" }}
          className="hidden lg:block absolute -bottom-10 right-10 w-44 h-44 bg-[#f8f1c6] p-4 shadow-2xl border border-[#3d2618]/10 z-50 overflow-hidden"
          style={{ clipPath: "polygon(0% 0%, 100% 0%, 95% 95%, 0% 100%)" }}
        >
          <div className="w-4 h-4 rounded-full bg-red-800 mx-auto mb-3 shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
          <p className="font-crimson text-sm text-[#3d2618] text-center leading-tight selection:bg-red-200">
            <span className="font-bold text-red-900">MANDATORY:</span><br /> Complete each seal carefully. The Registry is absolute.
          </p>
          <div className="absolute bottom-1 right-1 font-script text-[8px] text-[#3d2618]/30 uppercase">Ministry of Code</div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default GamesPage;