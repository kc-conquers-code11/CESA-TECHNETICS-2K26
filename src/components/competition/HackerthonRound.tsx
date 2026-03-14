import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock,
    CheckCircle2,
    Activity,
    ShieldCheck,
    AlertCircle,
    Code,
    MonitorCheck
} from 'lucide-react';
import { useCompetitionStore } from '@/store/competitionStore';
import { useAntiCheat } from '@/hooks/useAntiCheat';
import { CompetitionTimer } from './CompetitionTimer';
import { toast } from 'sonner';

const HackerthonRound = () => {
    // useAntiCheat(); // Anti-cheat disabled for this round
    const { completeRound } = useCompetitionStore();
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);

    // --- ACADEMY LOGIC: PERSISTENT TIMER ---
    const [roundDuration, setRoundDuration] = useState(60 * 60);

    const problems = [
        {
            id: 1,
            title: "The Arithmancy Algorithm",
            description: "Build a high-performance predictive engine to calculate variance in magical outcomes using recursive spell-casting patterns."
        },
        {
            id: 2,
            title: "The Marauder's Map API",
            description: "Develop a real-time tracking system for mythical entities within a sanctuary, implementing complex geolocation and obfuscation logic."
        },
        {
            id: 3,
            title: "The Patronus Protocol",
            description: "Implement a secure, encrypted messaging framework using ethereal light signatures and decentralized trust nodes."
        },
        {
            id: 4,
            title: "The Triwizard Tracker",
            description: "Create a tamper-proof distributed ledger system for tournament scoring, ensuring integrity across multiple magical venues."
        }
    ];

    const handleConfirm = async () => {
        setIsConfirmed(true);
        const toastId = toast.loading("Manifesting Quest...");
        try {
            // After confirmation, we complete the round
            // In the original it just stayed on the page, but for the flow we likely want to move to completed
            await completeRound('coding');
            toast.success("Quest Manifested", { id: toastId });
        } catch (err) {
            toast.error("Failed to manifest quest", { id: toastId });
        }
    };

    return (
        <div className="flex gap-4 h-full w-full animate-in fade-in duration-500 overflow-hidden relative">
            <main className="flex-1 p-4 md:p-8 flex flex-col items-center justify-center overflow-hidden relative">
                <div className="w-full max-w-4xl h-full flex flex-col items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl md:text-5xl font-wizard tracking-widest text-[#FFD700] mb-4">
                            Choose Your Quest
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto italic">
                            "The wand chooses the wizard, but the quest is chosen by the bold. You have one hour to manifest your decision."
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full h-auto p-2">
                        {problems.map((prob) => (
                            <motion.div
                                key={prob.id}
                                whileHover={{ scale: 1.02, borderColor: "rgba(212,175,55,0.6)" }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => !isConfirmed && setSelectedId(prob.id)}
                                className={`relative p-6 rounded-2xl border-2 transition-all cursor-pointer bg-[#051112] overflow-hidden group ${selectedId === prob.id
                                    ? 'border-[#FFD700] shadow-[0_0_30px_rgba(212,175,55,0.2)]'
                                    : 'border-[#d4af37]/20 hover:border-[#d4af37]/40'
                                    }`}
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold border ${selectedId === prob.id ? 'bg-[#FFD700] text-black border-[#FFD700]' : 'bg-[#d4af37]/10 text-[#d4af37] border-[#d4af37]/20'
                                        }`}>
                                        0{prob.id}
                                    </div>
                                    <h3 className="text-xl font-wizard text-white leading-tight group-hover:text-[#FFD700] transition-colors pt-1">
                                        {prob.title}
                                    </h3>
                                </div>
                                <p className="text-xs text-gray-400 leading-relaxed font-sans mb-2">
                                    {prob.description}
                                </p>

                                {selectedId === prob.id && (
                                    <motion.div
                                        layoutId="selected-border"
                                        className="absolute inset-0 border-2 border-[#FFD700] pointer-events-none rounded-2xl"
                                    />
                                )}
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-12">
                        <button
                            onClick={() => selectedId && setShowConfirm(true)}
                            disabled={!selectedId || isConfirmed}
                            className="px-16 py-4 rounded-2xl bg-linear-to-r from-[#8a6e2e] to-[#d4af37] text-black font-wizard text-2xl hover:from-[#d4af37] hover:to-[#FFD700] shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 active:scale-95 tracking-widest"

                        >
                            {isConfirmed ? 'Quest Manifested' : 'Lock Selection'}
                        </button>
                    </div>
                </div>

                <AnimatePresence>
                    {showConfirm && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="bg-[#051112] border-2 border-[#d4af37] rounded-3xl p-8 max-w-md w-full text-center shadow-[0_0_100px_rgba(212,175,55,0.2)]"
                            >
                                <div className="w-20 h-20 rounded-full bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37] mx-auto mb-6">
                                    <AlertCircle size={40} />
                                </div>
                                <h3 className="text-3xl font-wizard tracking-widest text-[#FFD700] mb-4">Confirm Your Choice</h3>
                                <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                                    Are you certain you wish to manifest <span className="text-white font-bold">"{problems.find(p => p.id === selectedId)?.title}"</span>? Once the seal is placed, your quest cannot be altered.
                                </p>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setShowConfirm(false)}
                                        className="flex-1 py-3 rounded-xl border border-[#d4af37]/30 text-[#d4af37] font-wizard hover:bg-[#d4af37]/10 transition-all tracking-widest text-xl"
                                    >
                                        Return
                                    </button>
                                    <button
                                        onClick={() => { setShowConfirm(false); handleConfirm(); }}
                                        className="flex-1 py-3 rounded-xl bg-[#d4af37] text-black font-wizard hover:bg-[#FFD700] transition-all tracking-widest text-xl"
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {isConfirmed && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-6"
                        >
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-center"
                            >
                                <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 mx-auto mb-8">
                                    <ShieldCheck size={48} />
                                </div>
                                <h3 className="text-5xl font-wizard tracking-widest text-[#FFD700] mb-6">Manifestation Complete</h3>
                                <p className="text-xl text-gray-400 font-wizard italic">
                                    All the best for the 15-Hour Hackathon! The arena awaits.
                                </p>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <aside className="w-80 border-l border-[#d4af37]/10 bg-[#051112]/40 p-5 hidden xl:flex flex-col gap-6">
                <div className="bg-black/40 rounded-xl p-4 border border-[#d4af37]/10 flex items-center justify-between">
                    <CompetitionTimer totalSeconds={roundDuration} onTimeUp={handleConfirm} />
                </div>

                <div className="space-y-5">
                    <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500">
                            <span>Current Phase</span>
                            <span className="text-[#FFD700]">HACKATHON SELECTION</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500">
                            <span>Selection Limit</span>
                            <span className="text-white">1 PROBLEM</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500">
                            <span>Proctored</span>
                            <div className="flex items-center gap-1 text-gray-500">
                                <MonitorCheck size={12} />
                                <span>Inactive</span>
                            </div>
                        </div>
                    </div>

                    <hr className="border-[#d4af37]/10" />

                    <div>
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
                            <span>Decision Progress</span>
                            <span className="text-[#d4af37]">{selectedId ? '1' : '0'}/1</span>
                        </div>
                        <div className="h-1 w-full bg-black/40 rounded-full overflow-hidden border border-[#d4af37]/5">
                            <motion.div
                                animate={{ width: selectedId ? '100%' : '0%' }}
                                className="h-full bg-linear-to-r from-[#8a6e2e] to-[#d4af37]"
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">Quest Rules</h3>
                        <ul className="space-y-3">
                            {[
                                "Review each problem statement carefully",
                                "Once selected, the choice is permanent",
                                "Hackathon environment launches next"
                            ].map((step, i) => (
                                <li key={i} className="flex gap-3 text-[11px] text-gray-400">
                                    <span className="text-[#d4af37] font-bold">{i + 1}.</span>
                                    <span className="leading-tight">{step}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </aside>
        </div>
    );
};

export default HackerthonRound;
