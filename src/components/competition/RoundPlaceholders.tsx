import { motion } from "framer-motion";
import { Trophy, LogOut, Star, CheckCircle, PartyPopper, Wand2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";

// NOTE: FlowchartRound aur CodingRound yahan se hata diye gaye hain.
// Kyunki ab hum unke Real Components (FlowchartRound.tsx aur CodingRound.tsx) use kar rahe hain.

// --- COMPLETION PAGE ---
export const CompletionPage = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/games');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-8">

            {/* Animated Trophy */}
            <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="relative"
            >
                <div className="absolute inset-0 bg-yellow-500/20 blur-3xl rounded-full" />
                <div className="w-32 h-32 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full flex items-center justify-center border border-yellow-500/50 mb-8 relative z-10 shadow-[0_0_50px_rgba(234,179,8,0.3)]">
                    <Trophy className="w-16 h-16 text-yellow-400 drop-shadow-md" />
                </div>

                {/* Floating Stars */}
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute -top-2 -right-4"
                >
                    <Star className="w-8 h-8 text-yellow-200 fill-yellow-200" />
                </motion.div>
                <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }}
                    className="absolute top-10 -left-6"
                >
                    <PartyPopper className="w-6 h-6 text-orange-400" />
                </motion.div>
            </motion.div>

            {/* Text Content */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <h1 className="text-4xl md:text-5xl font-wizard tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-orange-500 mb-6 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]">
                    {/* YOU HAVE SUCCESS SELECTED A QUEST */}
                    You have successfully selected a quest
                </h1>

                <p className="text-zinc-400 text-lg max-w-xl mx-auto mb-8 font-sans italic leading-relaxed">
                    "The seal is placed, and the journey begins. You have <span className="text-[#FFD700] font-bold">15 hours</span> to manifest your vision into reality.
                    Create your MVP, deploy it to the ethereal realms, and secure your place in the Academy's history."
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-900/20 border border-green-500/30 rounded-full text-green-400 text-sm font-bold">
                        <CheckCircle className="w-4 h-4" /> All Rounds Submitted
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-900/20 border border-blue-500/30 rounded-full text-blue-400 text-sm font-bold">
                        <CheckCircle className="w-4 h-4" /> Session Secured
                    </div>
                </div>
            </motion.div>

            {/* Action Button */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-12"
            >
                <button
                    onClick={handleLogout}
                    className="group relative px-12 py-5 rounded-2xl font-wizard text-2xl tracking-[0.2em] transition-all duration-500 overflow-hidden flex items-center gap-4 bg-gradient-to-r from-[#3d2618] via-[#8b6e2e] to-[#3d2618] text-[#d4af37] border-2 border-[#d4af37]/40 shadow-[0_0_40px_rgba(212,175,55,0.25)] hover:scale-105 active:scale-95 mx-auto"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#d4af37]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <Wand2 className="w-6 h-6 text-[#d4af37] group-hover:rotate-12 transition-transform" />
                    <span className="relative z-10">Mischief Managed</span>
                </button>
            </motion.div>

        </div>
    );
};