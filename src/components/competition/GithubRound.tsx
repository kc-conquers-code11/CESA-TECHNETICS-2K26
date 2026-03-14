import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    Clock,
    CheckCircle2,
    Lock,
    MonitorCheck,
    Github,
    ExternalLink,
    Send,
    Activity,
    Code
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useCompetitionStore } from '@/store/competitionStore';
import { useAntiCheat } from '@/hooks/useAntiCheat';
import { CompetitionTimer } from './CompetitionTimer';
import { toast } from 'sonner';

const GithubRound = () => {
    // useAntiCheat(); // Anti-cheat disabled for this round
    const { completeRound, email, userId } = useCompetitionStore();
      const buttonStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem', // 2 units
  padding: '0.75rem 1.5rem', // py-3 px-6
  borderRadius: '0.75rem', // rounded-xl
  background: 'linear-gradient(to right, #FFB702, #FFD05A)',
  color: 'black',
  fontWeight: 600, // font-semibold
  boxShadow: '0 0 20px rgba(255, 183, 0, 0.6)',
  transition: 'all 0.3s ease', // duration-300
  cursor: 'pointer',
};
    
    const [submissionLink, setSubmissionLink] = useState(() => {
        return localStorage.getItem('github_submission_link') || '';
    });

    // --- ACADEMY LOGIC: PERSISTENT TIMER ---
    const [roundDuration, setRoundDuration] = useState(60 * 60);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // --- PERSISTENCE EFFECT ---
    useEffect(() => {
        localStorage.setItem('github_submission_link', submissionLink);
    }, [submissionLink]);

    // --- SUBMISSION LOGIC ---
    const handleSubmit = useCallback(async () => {
        if (isSubmitting || !submissionLink) return;

        setError(null);

        if (!submissionLink) {
            setError("Please enter your deployment link");
            return;
        }

        setIsSubmitting(true);
        const toastId = toast.loading("Submitting GitHub Round Link...");

        try {

        // 1. Get the actual Session ID from exam_sessions using the Auth User ID
        const { data: sessionData, error: sessionError } = await supabase
            .from('exam_sessions')
            .select('id')
            .eq('user_id', userId)
            .single();

        if (sessionError || !sessionData) {
            throw new Error("Session not found");
        }

        const sessionId = sessionData.id;

            // 📝 Log to github_submissions table (As requested by user)
            const { error: dbError } = await supabase
                .from('github_submissions')
                .insert([{
                    team_name: email, 
                    deploy_link: submissionLink.trim(),
                    github_end_time: new Date().toISOString(),
                    user_id: sessionId // Assuming userId is available from useCompetitionStore
                }]);

            if (dbError) {
                console.error("Submission Error:", dbError);
                toast.error("Failed to commit to the magical scrolls.", { id: toastId });
                setIsSubmitting(false);
                return;
            }

            // Clear local storage items after successful submission
            localStorage.removeItem('github_end_time');
            localStorage.removeItem('github_submission_link');
            localStorage.removeItem('github_switches');
            localStorage.removeItem('github_frozen');
            
            await completeRound('flowchart');
            toast.success("Ancient Runes manifested successfully!", { id: toastId });
        } catch (err) {
            console.error("Critical Error:", err);
            toast.error("Manifestation failed. The magic is unstable.", { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    }, [isSubmitting, submissionLink, completeRound, email, userId]); // Added email and userId to dependencies

    return (
        <div className="flex gap-4 h-full w-full animate-in fade-in duration-500 overflow-hidden">
            {/* MAIN CONTENT */}
            <div className="flex-1 bg-[#051112]/40 border border-[#d4af37]/20 rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col justify-center text-center">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />

                <h2 className="text-4xl md:text-5xl font-wizard tracking-widest text-[#FFD700] mb-6">
                    The Enchanted Link
                </h2>

                <p className="text-gray-400 font-sans leading-relaxed mb-10 text-lg max-w-2xl mx-auto">
                    The Ancient Runes are ready for manifestation. Deploy your solution to the magical cloud and submit the enchanted portal link below.
                </p>

                <div className="bg-black/60 border border-[#d4af37]/30 rounded-2xl p-8 mb-12 flex flex-col md:flex-row items-center justify-between gap-8 hover:border-[#d4af37]/60 transition-all shadow-2xl relative group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#d4af37]/5 to-transparent pointer-events-none" />
                    <div className="flex items-center gap-6 relative z-10">
                        <a 
                            href="https://technetics-main.vercel.app/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-16 h-16 rounded-2xl bg-[#d4af37]/15 flex items-center justify-center text-[#d4af37] border border-[#d4af37]/30 hover:bg-[#d4af37]/25 hover:scale-105 transition-all shadow-[0_0_20px_rgba(212,175,55,0.1)] group/ext"
                        >
                            <ExternalLink size={36} className="group-hover/ext:rotate-12 transition-transform" />
                        </a>
                        <div className="text-left">
                            <p className="text-xs font-harry tracking-[0.2em] text-[#d4af37] mb-2 uppercase opacity-80">Reference Scroll</p>
                            <h3 className="text-xl md:text-2xl font-wizard text-white tracking-widest mb-1">Requirement UI Preview</h3>
                            <a 
                                href="https://technetics-main.vercel.app/" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm font-code text-gray-400 hover:text-[#d4af37] transition-colors flex items-center gap-2"
                            >
                                technetics-main.vercel.app <Activity size={12} className="text-green-500 animate-pulse" />
                            </a>
                        </div>
                    </div>
                    <div className="hidden md:block h-12 w-px bg-gradient-to-b from-transparent via-[#d4af37]/30 to-transparent mx-4" />
                    <div className="text-right hidden md:block">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Manifestation Target</p>
                        <p className="text-[#d4af37] font-code text-xs">Vercel Cloud • SSL Secured</p>
                    </div>
                </div>

                <div className="space-y-6 text-left max-w-2xl mx-auto w-full relative">
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-semibold tracking-[0.3em] text-[#d4af37] uppercase opacity-90 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
                            Manifest Your Portal
                        </label>
                        {submissionLink && (
                            <motion.span 
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }}
                                className="text-[10px] font-black text-green-500 uppercase tracking-widest"
                            >
                                Connection Established
                            </motion.span>
                        )}
                    </div>
                    
                    <div className="relative group/input">
                        <input
                            type="text"
                            value={submissionLink}
                            onChange={(e) => setSubmissionLink(e.target.value)}
                            placeholder="https://your-enchanted-app.vercel.app"
                            className="w-full bg-black/80 border-2 border-[#d4af37]/20 rounded-2xl px-6 py-6 text-white text-lg placeholder:text-gray-700 focus:border-[#d4af37]/80 focus:outline-none transition-all shadow-[inset_0_4px_20px_rgba(0,0,0,0.8)] group-hover/input:border-[#d4af37]/40 font-code"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
                            {submissionLink ? (
                                <a 
                                    href={submissionLink.startsWith('http') ? submissionLink : `https://${submissionLink}`}
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="p-3 bg-[#d4af37]/10 rounded-xl text-[#d4af37] hover:bg-[#d4af37]/20 hover:scale-110 transition-all border border-[#d4af37]/20 shadow-lg group/preview"
                                    title="Preview Manifestation"
                                >
                                    <ExternalLink size={22} className="group-hover/preview:rotate-12 transition-transform" />
                                </a>
                            ) : (
                                <div className="p-3 text-gray-700">
                                    <Lock size={22} className="opacity-40" />
                                </div>
                            )}
                        </div>
                    </div>
                    {error && (
                        <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-[11px] font-bold uppercase tracking-widest flex items-center gap-2"
                        >
                            <Activity size={12} /> {error}
                        </motion.p>
                    )}
                    <div className="flex items-center gap-3 p-4 bg-[#d4af37]/5 rounded-xl border border-[#d4af37]/10">
                        <div className="w-2 h-2 rounded-full bg-[#d4af37]/40" />
                        <p className="text-[11px] text-gray-500 leading-relaxed font-harry text-red-500 tracking-wider opacity-80 uppercase pt-0.5">
                            The Ministry will verify this link for plagiarism and magical integrity.
                        </p>
                    </div>
                </div>

                <div className="mt-14 flex justify-center">
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !submissionLink}
                        className="flex items-center gap-4 px-12 py-4 rounded-2xl bg-linear-to-r from-[#8a6e2e] to-[#d4af37] text-black font-wizard font-bold text-2xl hover:from-[#d4af37] hover:to-[#FFD700] shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                        style={buttonStyle}

                    >
                        <span>{isSubmitting ? 'Casting Spell...' : 'Submit Solution'}</span>
                        {isSubmitting ? <div className="animate-spin rounded-full h-5 w-5 border-3 border-black/20 border-t-black" /> : <Send size={20} />}
                    </button>
                </div>
            </div>

            {/* SIDEBAR */}
            <aside className="w-80 border-l border-[#d4af37]/10 bg-[#051112]/40 p-5 hidden xl:flex flex-col gap-6">
                <div className="bg-black/40 rounded-xl p-4 border border-[#d4af37]/10">
                    <CompetitionTimer totalSeconds={roundDuration} onTimeUp={handleSubmit} />
                </div>

                <div className="space-y-5">
                    {/* Round Metadata */}
                    <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500">
                            <span>Current Phase</span>
                            <span className="text-[#FFD700]">GITHUB SYNC</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500">
                            <span>Proctored</span>
                            <div className="flex items-center gap-1 text-green-500">
                                <MonitorCheck size={12} />
                                <span>Active</span>
                            </div>
                        </div>
                    </div>

                    <hr className="border-[#d4af37]/10" />

                    {/* Progress Section */}
                    <div>
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
                            <span>Sync Progress</span>
                            <span className="text-[#d4af37]">{submissionLink ? '1' : '0'}/1</span>
                        </div>
                        <div className="h-1 w-full bg-black/40 rounded-full overflow-hidden border border-[#d4af37]/5">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: submissionLink ? '100%' : '0%' }}
                                className="h-full bg-linear-to-r from-[#8a6e2e] to-[#d4af37] shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                            />
                        </div>
                    </div>

                    {/* Round Objective */}
                    <div className="pt-2">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">Round Objective</h3>
                        <ul className="space-y-3">
                            {[
                                "Clone the corrupted repository",
                                "Analyze and fix logic errors",
                                "Commit and push to your GitHub",
                                "Submit the public URL below"
                            ].map((step, i) => (
                                <li key={i} className="flex gap-3 text-[11px] text-gray-400">
                                    <span className="text-[#d4af37] font-bold">{i + 1}.</span>
                                    <span className="leading-tight">{step}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Warnings/Status */}
                    <div className="pt-2">
                        <div className="p-4 bg-orange-900/10 rounded-xl border border-orange-500/20 flex items-start gap-3">
                            <Activity size={18} className="text-orange-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">Status</p>
                                <p className="text-[10px] text-gray-500 leading-tight italic">Synchronization in progress. Ensure your solution branch is clean before manifestation.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    );
};

export default GithubRound;
