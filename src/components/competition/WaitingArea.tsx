import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, ShieldCheck, Clock, RefreshCw, CheckCircle2, Hourglass } from 'lucide-react';
import { useCompetitionStore } from '@/store/competitionStore';
import { supabase } from '@/lib/supabaseClient';

export const WaitingArea = () => {
  const { email, userId, syncSession, currentRound } = useCompetitionStore();
  const [checking, setChecking] = useState(false);

  const handleManualRefresh = async () => {
    if (!userId) return;
    setChecking(true);
    try {
        const { data } = await supabase
            .from('exam_sessions')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (data) {
            console.log("Manual Refresh Sync:", data);
            syncSession(data);
        }
    } catch (e) {
        console.error("Refresh failed", e);
    }
    setTimeout(() => setChecking(false), 1000);
  };

  // Dynamic Content based on which waiting room we are in
  const getContent = () => {
    const { isDarkMark } = useCompetitionStore.getState();

    switch (currentRound) {
        case 'waiting':
            if (isDarkMark) {
                return {
                    title: "Authorized Access",
                    icon: <ShieldCheck className="w-12 h-12 text-red-500" />,
                    bg: "bg-red-500/10",
                    desc: "Identity verified. You are in the secure queue for the Dark Mark Bounty.",
                    status: "WAITING FOR EXTRACTION"
                };
            }
            return {
                title: "Rules Accepted",
                icon: <ShieldCheck className="w-12 h-12 text-green-500" />,
                bg: "bg-green-500/10",
                desc: "You are in the secure lobby. Round 1 will start shortly.",
                status: "WAITING FOR ROUND 1"
            };
        case 'waiting_r2':
            return {
                title: "Round 1 Submitted",
                icon: <CheckCircle2 className="w-12 h-12 text-blue-500" />,
                bg: "bg-blue-500/10",
                desc: "Your MCQ responses have been recorded. Please wait for the results processing.",
                status: "WAITING FOR ROUND 2"
            };
        case 'waiting_r3':
            return {
                title: "Flowchart Submitted",
                icon: <Hourglass className="w-12 h-12 text-yellow-500" />,
                bg: "bg-yellow-500/10",
                desc: "Your Logic design is saved. Get ready for the final coding challenge.",
                status: "WAITING FOR ROUND 3"
            };
        default:
            return {
                title: "Please Wait",
                icon: <Clock className="w-12 h-12 text-zinc-500" />,
                bg: "bg-zinc-500/10",
                desc: "Synchronizing with server status...",
                status: "CONNECTING..."
            };
    }
  };

  const content = getContent();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 p-4 relative overflow-hidden animate-in fade-in zoom-in duration-500">
      
      {/* Background Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] animate-pulse pointer-events-none" />

      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`relative z-10 w-24 h-24 ${content.bg} rounded-full flex items-center justify-center border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.1)]`}
      >
        {content.icon}
      </motion.div>

      <div className="space-y-4 max-w-lg relative z-10">
        <h2 className="text-3xl font-display font-bold text-white">{content.title}</h2>
        <p className="text-slate-400">
          Welcome, <span className="text-white font-bold">{email || 'Candidate'}</span>. 
          <br/>
          {content.desc}
        </p>
        
        <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-lg flex items-center gap-4 text-left backdrop-blur-sm">
            <div className="p-3 bg-zinc-800 rounded-full">
                <Clock className="w-6 h-6 text-zinc-400" />
            </div>
            <div>
                <p className="text-indigo-400 font-bold text-sm tracking-wide">{content.status}</p>
                <p className="text-xs text-zinc-500 mt-1">Do not close this tab or refresh manually.</p>
            </div>
        </div>
      </div>

      {/* Status & Controls */}
      <div className="space-y-4 relative z-10">
          <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
            <span className="animate-pulse">Live connection established</span>
          </div>

          <button 
            onClick={handleManualRefresh}
            disabled={checking}
            className="flex items-center gap-2 px-5 py-2 mx-auto bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-full transition-all text-xs font-bold text-zinc-400 hover:text-white"
          >
            <RefreshCw className={`w-3 h-3 ${checking ? "animate-spin" : ""}`} />
            {checking ? "Checking..." : "Refresh Status"}
          </button>
      </div>
    </div>
  );
};