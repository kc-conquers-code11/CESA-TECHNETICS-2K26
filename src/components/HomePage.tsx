import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient'; 
import { Lock, LogOut, Info, HelpCircle, Users, MapPin, AlertTriangle, Video, BrainCircuit, Mic2, Key, Terminal } from 'lucide-react';
import StrangerHero from './StrangerHero'; 
import { CompetitionLayout } from './competition/CompetitionLayout';
import { useCompetitionStore } from '@/store/competitionStore';

// --- ANIMATED TITLE COMPONENT ---
const StrangerTypewriter = ({ text, className = "text-5xl md:text-7xl" }: { text: string, className?: string }) => {
  const letters = text.split("");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.5 }
    }
  };

  const letterVariants = {
    hidden: { opacity: 0, textShadow: "0 0 0px rgba(220,38,38,0)" },
    visible: { 
      opacity: 1,
      textShadow: [
        "0 0 10px rgba(220,38,38,0.8)", 
        "0 0 20px rgba(220,38,38,0)", 
        "0 0 10px rgba(220,38,38,0.8)"
      ],
      transition: { duration: 0.1, repeat: Infinity, repeatDelay: 5, repeatType: "reverse" as const }
    }
  };

  return (
    <motion.div 
      className={`font-st font-black text-red-600 tracking-wider relative z-10 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {letters.map((char, index) => (
        <motion.span key={index} variants={letterVariants}>
          {char}
        </motion.span>
      ))}
    </motion.div>
  );
};

// --- SUB-COMPONENTS ---

const LockedRules = () => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6 border border-zinc-800 bg-zinc-900/50 rounded-2xl p-8 backdrop-blur-sm animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-red-900/20 rounded-full flex items-center justify-center border border-red-500/30 shadow-[0_0_30px_rgba(220,38,38,0.2)] animate-pulse">
                <Lock className="w-10 h-10 text-red-500" />
            </div>
            <div className="space-y-2">
                <h3 className="text-2xl font-st font-bold text-white tracking-wide">RESTRICTED ACCESS</h3>
                <p className="text-zinc-400 max-w-md mx-auto leading-relaxed">
                    The competition protocols are classified. You must identify yourself to access the <span className="text-red-500 font-bold glow-text">Forbidden Forest</span> rules.
                </p>
            </div>
            <button onClick={() => navigate('/login')} className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg tracking-wider transition-all shadow-lg hover:shadow-red-900/50">
                LOGIN TO UNLOCK
            </button>
        </div>
    );
};

const AboutContent = () => (
  <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
    
    {/* Intro Section */}
    <div className="text-center space-y-6">
        <div className="relative inline-block">
            <div className="absolute inset-0 bg-red-600/20 blur-[50px] rounded-full pointer-events-none" />
            <StrangerTypewriter text="TECHNETICS" className="text-5xl md:text-7xl" />
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-3 text-zinc-400 font-mono text-sm md:text-base">
            <span className="bg-red-950/30 border border-red-900/50 px-4 py-1.5 rounded-full text-red-400 shadow-[0_0_10px_rgba(220,38,38,0.2)]">FEB 9 - 10, 2026</span>
            <span className="hidden md:inline">•</span>
            <span className="text-zinc-300 tracking-wide">HOSTED BY CESA CSI, VPPCOE & VA</span>
        </div>

        <div className="max-w-4xl mx-auto bg-zinc-900/40 border-l-4 border-red-600 p-6 rounded-r-xl backdrop-blur-sm text-left shadow-2xl">
            <p className="text-lg text-zinc-300 leading-relaxed font-light">
                <strong className="text-white">Technetics</strong> is a flagship event hosted by <span className="text-red-400">CESA CSI</span>. 
                It combines technical challenges with wizarding tasks and creative problem-solving, aiming to bridge technical skills with magical experiences and provide a gateway to the professional tech industry.
            </p>
        </div>
    </div>

    {/* Flagship Contests Grid */}
    <div className="grid md:grid-cols-2 gap-6">
        
        {/* Frame Rush */}
        <div className="bg-zinc-900/60 border border-zinc-800 p-6 rounded-xl hover:border-red-600/50 transition-all duration-300 group hover:shadow-[0_0_20px_rgba(220,38,38,0.1)]">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-red-900/20 rounded-lg group-hover:bg-red-600 group-hover:text-black transition-colors text-red-500"><Video className="w-6 h-6" /></div>
                <h3 className="text-2xl font-bold text-white group-hover:text-red-500 transition-colors font-st tracking-wide">Daily Prophet Reel</h3>
            </div>
            <p className="text-red-400/80 text-sm mb-4 font-mono uppercase tracking-wider">Reel Making Competition</p>
            <ul className="space-y-2 text-zinc-300 text-sm list-none">
                <li className="flex gap-2"><span className="text-red-600">›</span> An individual video storytelling challenge with a Harry Potter theme.</li>
                <li className="flex gap-2"><span className="text-red-600">›</span> Participants shoot visuals and record live academy footage, focusing on creative framing.</li>
                <li className="flex gap-2"><span className="text-red-600">›</span> Reels are edited with attention to cuts, transitions, and magical sync.</li>
                <li className="flex gap-2"><span className="text-red-600">›</span> <strong>No AI allowed.</strong> Submission via Drive link on Day 2.</li>
            </ul>
        </div>

        {/* Gatekeeper's Protocol */}
        <div className="bg-zinc-900/60 border border-zinc-800 p-6 rounded-xl hover:border-blue-600/50 transition-all duration-300 group hover:shadow-[0_0_20px_rgba(37,99,235,0.1)]">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-900/20 rounded-lg group-hover:bg-blue-600 group-hover:text-black transition-colors text-blue-500"><BrainCircuit className="w-6 h-6" /></div>
                <h3 className="text-2xl font-bold text-white group-hover:text-blue-500 transition-colors font-st tracking-wide">The Order of Obscure code</h3>
            </div>
            <p className="text-blue-400/80 text-sm mb-4 font-mono uppercase tracking-wider">Technical Challenge (2-3 Members)</p>
            <ul className="space-y-2 text-zinc-300 text-sm list-none">
                <li className="flex gap-2"><span className="text-blue-600">›</span> <strong>Round 1:</strong> Aptitude and logical reasoning.</li>
                <li className="flex gap-2"><span className="text-blue-600">›</span> <strong>Round 2:</strong> Flowchart design, testing structured thinking.</li>
                <li className="flex gap-2"><span className="text-blue-600">›</span> <strong>Round 3:</strong> Coding round with DSA problems.</li>
                <li className="flex gap-2"><span className="text-blue-600">›</span> <span className="text-red-400">Strict Rules:</span> AI tools, mobile phones, and tab switching are prohibited.</li>
            </ul>
        </div>

        {/* Battle of Starcourt */}
        <div className="bg-zinc-900/60 border border-zinc-800 p-6 rounded-xl hover:border-yellow-600/50 transition-all duration-300 group hover:shadow-[0_0_20px_rgba(202,138,4,0.1)]">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-yellow-900/20 rounded-lg group-hover:bg-yellow-600 group-hover:text-black transition-colors text-yellow-500"><Mic2 className="w-6 h-6" /></div>
                <h3 className="text-2xl font-bold text-white group-hover:text-yellow-500 transition-colors font-st tracking-wide">Battle of Starcourt</h3>
            </div>
            <p className="text-yellow-400/80 text-sm mb-4 font-mono uppercase tracking-wider">Pitching & Debate</p>
            <ul className="space-y-2 text-zinc-300 text-sm list-none">
                <li className="flex gap-2"><span className="text-yellow-600">›</span> <strong>Round 1:</strong> Product pitching in a "Shark Tank" style.</li>
                <li className="flex gap-2"><span className="text-yellow-600">›</span> <strong>Round 2:</strong> Debate on assigned topics requiring logical arguments.</li>
                <li className="flex gap-2"><span className="text-yellow-600">›</span> Judges' scores determine the final results.</li>
                <li className="flex gap-2"><span className="text-yellow-600">›</span> Cross-talking is not allowed. Silence is mandatory when not speaking.</li>
            </ul>
        </div>

        {/* Escape from Camazotz */}
        <div className="bg-zinc-900/60 border border-zinc-800 p-6 rounded-xl hover:border-green-600/50 transition-all duration-300 group hover:shadow-[0_0_20px_rgba(22,163,74,0.1)]">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-green-900/20 rounded-lg group-hover:bg-green-600 group-hover:text-black transition-colors text-green-500"><Key className="w-6 h-6" /></div>
                <h3 className="text-2xl font-bold text-white group-hover:text-green-500 transition-colors font-st tracking-wide">Escape from Camazotz</h3>
            </div>
            <p className="text-green-400/80 text-sm mb-4 font-mono uppercase tracking-wider">Technical Escape Room</p>
            <ul className="space-y-2 text-zinc-300 text-sm list-none">
                <li className="flex gap-2"><span className="text-green-600">›</span> A team-based, real-life escape room challenge.</li>
                <li className="flex gap-2"><span className="text-green-600">›</span> Solve clues and complete tasks to unlock multiple rooms.</li>
                <li className="flex gap-2"><span className="text-green-600">›</span> Time-bound challenge on the <strong>3rd Floor</strong>.</li>
                <li className="flex gap-2"><span className="text-green-600">›</span> <strong>Electronic devices prohibited.</strong> Discipline is mandatory.</li>
            </ul>
        </div>
    </div>

    {/* Event Heads */}
    <div className="border-t border-zinc-800 pt-10">
        <h3 className="text-xl font-bold text-zinc-500 uppercase tracking-[0.2em] mb-8 text-center">Event Heads</h3>
        <div className="flex flex-wrap justify-center gap-6">
            {[
                { name: "Gauri Kautkar", role: "Creative Head, CESA" },
                { name: "Vedanth Gali", role: "Technical Head, CESA" },
                { name: "Diksha Deware", role: "Joint Secretary, CESA" }
            ].map((head, i) => (
                <div key={i} className="flex items-center gap-4 bg-zinc-950 px-6 py-4 rounded-xl border border-zinc-800 hover:border-red-900/50 transition-all hover:scale-105">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-700 to-black rounded-full flex items-center justify-center text-lg font-bold text-white shadow-lg">
                        {head.name.charAt(0)}
                    </div>
                    <div>
                        <div className="text-white font-bold text-base">{head.name}</div>
                        <div className="text-zinc-500 text-xs uppercase tracking-wide">{head.role}</div>
                    </div>
                </div>
            ))}
        </div>
    </div>

    {/*  DEVELOPER FOOTER */}
    <div className="mt-16 pt-6 border-t border-zinc-900 flex justify-center">
        <a 
            href="https://www.linkedin.com/in/kc-thedev/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-2 text-xs font-mono text-zinc-600 transition-colors duration-300 hover:text-red-500"
        >
            <span className="opacity-50 group-hover:opacity-100 transition-opacity font-bold">&lt;/&gt;</span>
            <span className="relative">
                Designed & Developed by KC
                {/* Underline Animation */}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-red-600 transition-all duration-300 group-hover:w-full group-hover:shadow-[0_0_10px_rgba(220,38,38,1)]"></span>
            </span>
        </a>
    </div>

  </div>
);

const HelpContent = () => (
  <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
    <h2 className="text-4xl font-st text-red-600 mb-8 text-center drop-shadow-md tracking-wider">Support & Protocols</h2>
    
    <div className="grid md:grid-cols-2 gap-6">
        {/* Emergency Contact */}
        <div className="bg-zinc-900/50 border border-red-900/30 p-6 rounded-xl backdrop-blur-md hover:bg-zinc-900/80 transition-colors">
            <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                <AlertTriangle className="text-red-500" /> Immediate Assistance
            </h3>
            <p className="text-zinc-400 text-sm mb-4">
                If you face technical glitches (screen freeze, submission errors) or witness rule violations:
            </p>
            <div className="bg-red-950/20 p-4 rounded border border-red-900/50 text-red-200 font-mono text-sm flex gap-3 items-start">
                <Users className="w-5 h-5 shrink-0 mt-0.5" />
                <span>RAISE YOUR HAND immediately. Do not leave your seat. An invigilator will attend to you.</span>
            </div>
        </div>

        {/* Venue Info */}
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl backdrop-blur-md hover:bg-zinc-900/80 transition-colors">
            <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                <MapPin className="text-blue-500" /> Key Locations
            </h3>
            <ul className="space-y-3 text-zinc-300 text-sm">
                <li className="flex justify-between border-b border-zinc-800 pb-2">
                    <span>Gatekeeper's Protocol (Labs)</span>
                    <span className="text-blue-400 font-mono font-bold">2nd Floor Labs</span>
                </li>
                <li className="flex justify-between border-b border-zinc-800 pb-2">
                    <span>Escape from Camazotz</span>
                    <span className="text-green-400 font-mono font-bold">3rd Floor</span>
                </li>
                <li className="flex justify-between border-b border-zinc-800 pb-2">
                    <span>Battle of Starcourt</span>
                    <span className="text-yellow-400 font-mono font-bold">Seminar Hall</span>
                </li>
                <li className="flex justify-between">
                    <span>Control Room</span>
                    <span className="text-red-500 font-mono font-bold">Room 204</span>
                </li>
            </ul>
        </div>

        {/* FAQ */}
        <div className="md:col-span-2 bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl backdrop-blur-md">
            <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                <HelpCircle className="text-purple-500" /> Frequently Asked Questions
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <h4 className="font-bold text-zinc-200 text-sm flex items-center gap-2"><Terminal className="w-4 h-4 text-zinc-500"/> Can I use my phone?</h4>
                    <p className="text-zinc-500 text-xs leading-relaxed pl-6">
                        Strictly <strong className="text-red-500">NO</strong>. Mobile phones must be switched off or submitted during the Gatekeeper's Protocol and Escape Room. Discovery leads to immediate disqualification.
                    </p>
                </div>
                <div className="space-y-2">
                    <h4 className="font-bold text-zinc-200 text-sm flex items-center gap-2"><Terminal className="w-4 h-4 text-zinc-500"/> What if I switch tabs?</h4>
                    <p className="text-zinc-500 text-xs leading-relaxed pl-6">
                        The system logs every tab switch. <strong className="text-orange-500">2 warnings</strong> are issued, after which your account freezes automatically.
                    </p>
                </div>
                <div className="space-y-2">
                    <h4 className="font-bold text-zinc-200 text-sm flex items-center gap-2"><Terminal className="w-4 h-4 text-zinc-500"/> How do I submit my Reel?</h4>
                    <p className="text-zinc-500 text-xs leading-relaxed pl-6">
                        Upload your edited reel to the Google Drive link provided by volunteers on Day 2 (Feb 10) before 4:00 PM.
                    </p>
                </div>
                <div className="space-y-2">
                    <h4 className="font-bold text-zinc-200 text-sm flex items-center gap-2"><Terminal className="w-4 h-4 text-zinc-500"/> Cross-talking in Debate?</h4>
                    <p className="text-zinc-500 text-xs leading-relaxed pl-6">
                        No. You must maintain silence while the opponent is speaking. Judges mark negatively for interruptions.
                    </p>
                </div>
            </div>
        </div>
    </div>
  </div>
);

// --- MAIN PAGE ---
const HomePage = () => {
  const [activeTab, setActiveTab] = useState<'rules' | 'about' | 'help'>('rules');
  const [session, setSession] = useState<any>(null);
  const [showIntro, setShowIntro] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  //  GET ROUND STATUS
  const { currentRound } = useCompetitionStore();
  
  const ADMIN_EMAILS = ["admin1@strangertech.in", "kc@strangertech.in"];

  const enterFullScreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(err => {
        console.log("Fullscreen request denied or not interaction-based:", err);
      });
    }
  };

  const handleIntroFinish = () => {
    window.scrollTo(0, 0);
    enterFullScreen();
    setShowIntro(false);
  };

  useEffect(() => {
    const checkUser = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            
            if (session) {
                setShowIntro(false);
                if (session.user.email && ADMIN_EMAILS.includes(session.user.email)) {
                    navigate('/admin');
                }
            } else {
                setShowIntro(true);
            }
        } catch (err) {
            console.error("Session check failed:", err);
            setSession(null);
            setShowIntro(true);
        } finally {
            setLoading(false);
        }
    };

    checkUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
          setShowIntro(false);
          if (session.user.email && ADMIN_EMAILS.includes(session.user.email)) {
              navigate('/admin');
          }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowIntro(true);
    navigate('/login');
  };

  if (loading) return <div className="min-h-screen bg-black" />;

  //  LOGIC: Navbar only shows if not logged in OR if still on 'rules' page
  // Once user accepts rules (waiting/mcq etc), Navbar disappears.
  const showNavbar = !session || (session && currentRound === 'rules');

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      
      {showIntro ? (
          <StrangerHero onComplete={handleIntroFinish} />
      ) : (
          <div className="min-h-screen bg-black text-white pb-20 animate-in fade-in duration-1000">
            
            {/*  CONDITIONAL NAVBAR */}
            {showNavbar && (
                <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-red-900/30 px-6 py-4 transition-all duration-500">
                    <div className="container mx-auto flex flex-wrap justify-between items-center">
                    
                    {/*  ANIMATED NAVBAR TITLE */}
                    <div className="cursor-pointer" onClick={() => setActiveTab('rules')}>
                        <StrangerTypewriter text="STRANGER TECH" className="text-2xl md:text-3xl" />
                    </div>

                    <ul className="flex items-center space-x-2 md:space-x-6 text-sm font-medium">
                        {['rules', 'about', 'help'].map((tab) => (
                        <li key={tab}>
                            <button onClick={() => setActiveTab(tab as any)} className={`px-3 py-2 rounded-md transition-all capitalize ${activeTab === tab ? 'text-red-500 bg-red-950/30 border border-red-900/50' : 'text-zinc-400 hover:text-red-400'}`}>
                            {tab === 'rules' && !session && <Lock className="w-3 h-3 inline mr-1 mb-0.5" />} {tab}
                            </button>
                        </li>
                        ))}
                    </ul>
                    <div className="ml-4">
                        {session ? (
                            <div className="flex items-center gap-4">
                                <span className="hidden md:block text-zinc-400 text-sm">{session.user.email}</span>
                                <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 border border-zinc-700 hover:border-red-600 rounded text-sm transition-colors">
                                    <LogOut className="w-4 h-4" /> Logout
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => navigate('/login')} className="px-5 py-2 bg-gradient-to-r from-red-700 to-red-900 hover:from-red-600 text-white font-bold rounded-md shadow-lg">LOGIN / SIGNUP</button>
                        )}
                    </div>
                    </div>
                </nav>
            )}

            {/*  DYNAMIC CONTENT CONTAINER */}
            <main className={showNavbar ? "container mx-auto px-6 py-12 md:py-20 relative z-10" : "w-full h-full relative z-10"}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="w-full"
                    >
                        {activeTab === 'rules' && (session ? <CompetitionLayout /> : <LockedRules />)}
                        {activeTab === 'about' && <AboutContent />}
                        {activeTab === 'help' && <HelpContent />}
                    </motion.div>
                </AnimatePresence>
            </main>
          </div>
      )}
      <div className="fixed bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-red-900/10 to-transparent pointer-events-none z-0" />
    </div>
  );
};

export default HomePage;