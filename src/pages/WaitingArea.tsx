import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, ShieldCheck, Clock, RefreshCw, CheckCircle2, Hourglass } from 'lucide-react';
import { useCompetitionStore } from '../store/competitionStore';
import { supabase } from '../lib/supabaseClient';

export default function WaitingArea() {
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
                syncSession(data);
            }
        } catch (e) {
            console.error("Refresh failed", e);
        }
        setTimeout(() => setChecking(false), 1000);
    };

    const getContent = () => {
        switch (currentRound) {
            case 'waiting':
                return {
                    title: "Oathtaking Complete",
                    icon: <ShieldCheck className="w-12 h-12 text-[#d4af37]" />,
                    bg: "bg-[#d4af37]/10 border-[#d4af37]/30",
                    desc: "You are currently in the antechamber. The first trial will commence shortly.",
                    status: "AWAITING ROUND 1 MAGICS"
                };
            case 'waiting_r2':
                return {
                    title: "Trial 1 Documented",
                    icon: <CheckCircle2 className="w-12 h-12 text-[#00ffff]" />,
                    bg: "bg-[#00ffff]/10 border-[#00ffff]/30",
                    desc: "The scrolls have received your answers. The scribes are reviewing your fate.",
                    status: "AWAITING ROUND 2 MAGICS"
                };
            case 'waiting_r3':
                return {
                    title: "Logic Array Woven",
                    icon: <Hourglass className="w-12 h-12 text-[#d4af37]" />,
                    bg: "bg-[#d4af37]/10 border-[#d4af37]/30",
                    desc: "Your design spells have been recorded. Prepare for the ultimate incantation code test.",
                    status: "AWAITING FINAL MAGICS"
                };
            default:
                return {
                    title: "Synchronizing",
                    icon: <Clock className="w-12 h-12 text-[#008080]" />,
                    bg: "bg-[#008080]/10 border-[#008080]/30",
                    desc: "Connecting your wand to the main crystal server...",
                    status: "CALIBRATING AURA..."
                };
        }
    };

    const content = getContent();

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8 p-4 relative overflow-hidden animate-in fade-in zoom-in duration-500 font-inter">

            {/* Background Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#00ffff]/10 rounded-full blur-[80px] animate-pulse pointer-events-none" />

            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`relative z-10 w-28 h-28 ${content.bg} rounded-full flex items-center justify-center border shadow-[0_0_30px_rgba(0,255,255,0.05)]`}
            >
                {content.icon}
            </motion.div>

            <div className="space-y-4 max-w-lg relative z-10">
                <h2 className="text-4xl font-wizard text-[#d4af37] tracking-wider">{content.title}</h2>
                <p className="text-[#008080] text-lg font-manrope">
                    Greetings, <span className="text-white font-bold">{email || 'Unknown Wizard'}</span>.
                    <br /><br />
                    {content.desc}
                </p>

                <div className="bg-[#0a1f20]/80 border border-[#008080]/30 p-5 rounded-lg flex items-center gap-4 text-left backdrop-blur-sm mt-6 shadow-inner">
                    <div className="p-3 bg-[#021516] rounded-full border border-[#008080]/30">
                        <Clock className="w-6 h-6 text-[#d4af37]" />
                    </div>
                    <div>
                        <p className="text-[#00ffff] font-bold text-sm tracking-widest uppercase">{content.status}</p>
                        <p className="text-xs text-[#008080] mt-1 font-mono">Closing this grimoire (tab) may break your connection.</p>
                    </div>
                </div>
            </div>

            {/* Status & Controls */}
            <div className="space-y-5 relative z-10 pt-4">
                <div className="flex items-center justify-center gap-2 text-[#008080] text-sm font-mono">
                    <Loader2 className="w-4 h-4 animate-spin text-[#d4af37]" />
                    <span className="animate-pulse">Ethereal connection maintained</span>
                </div>

                <button
                    onClick={handleManualRefresh}
                    disabled={checking}
                    className="flex items-center gap-2 px-6 py-2.5 mx-auto bg-[#021516] hover:bg-[#04282a] border border-[#d4af37]/30 hover:border-[#d4af37]/80 rounded-full transition-all text-xs font-bold tracking-widest uppercase text-[#d4af37]"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${checking ? "animate-spin" : ""}`} />
                    {checking ? "Channeling..." : "Resync Crystal"}
                </button>
            </div>
        </div>
    );
}
