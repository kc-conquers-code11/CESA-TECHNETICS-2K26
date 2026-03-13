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
import { useCompetitionStore } from '@/store/competitionStore';
import { useAntiCheat } from '@/hooks/useAntiCheat';
import { CompetitionTimer } from './CompetitionTimer';
import { toast } from 'sonner';

const GithubRound = () => {
    useAntiCheat();
    const { completeRound, email, userId } = useCompetitionStore();
    
    const [submissionLink, setSubmissionLink] = useState(() => {
        return localStorage.getItem('github_submission_link') || '';
    });

    // --- STRANGER TECH LOGIC: PERSISTENT TIMER ---
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

        // --- GITHUB VALIDATION ---
        const githubRegex = /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9._-]+(\/)?$/;
        if (!githubRegex.test(submissionLink.trim())) {
            setError("Please enter a valid GitHub repository URL (e.g., https://github.com/user/repo)");
            return;
        }

        setIsSubmitting(true);
        const toastId = toast.loading("Submitting GitHub Round Link...");

        try {
            // Simulating API call or DB update if needed
            // For now, we follow the original logic of navigating, which we replace with completeRound
            localStorage.removeItem('github_end_time');
            localStorage.removeItem('github_submission_link');
            localStorage.removeItem('github_switches');
            localStorage.removeItem('github_frozen');
            
            await completeRound('flowchart');
            toast.success("Solution Submitted", { id: toastId });
        } catch (err) {
            toast.error("Failed to submit", { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    }, [isSubmitting, submissionLink, completeRound]);

    return (
        <div className="flex gap-4 h-full w-full animate-in fade-in duration-500 overflow-hidden">
            {/* MAIN CONTENT */}
            <div className="flex-1 bg-[#051112]/40 border border-[#d4af37]/20 rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col justify-center text-center">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />

                <h2 className="text-4xl md:text-5xl font-wizard tracking-widest text-[#FFD700] mb-6">
                    The Cursed Repository
                </h2>

                <p className="text-gray-400 font-sans leading-relaxed mb-10 text-lg max-w-2xl mx-auto">
                    The Ministry's archives have been tainted by dark magic. Clone the corrupted scrolls below, mend the broken logic, and manifest your solution in your own digital vault.
                </p>

                <div className="bg-black/40 border border-[#d4af37]/20 rounded-2xl p-6 mb-12 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-[#d4af37]/40 transition-all">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-xl bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37]">
                            <Github size={32} />
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Source Repository</p>
                            <p className="text-white font-code text-sm break-all tracking-tight">github.com/kc-conquers-code11/CESA-TECHNETICS-2K26</p>
                        </div>
                    </div>
                    <a
                        href="https://github.com/kc-conquers-code11/CESA-TECHNETICS-2K26.git"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] font-wizard hover:bg-[#d4af37]/20 transition-all flex items-center gap-2 shrink-0"
                    >
                        <span>Clone Repository</span>
                        <ExternalLink size={16} />
                    </a>
                </div>

                <div className="space-y-5 text-left max-w-2xl mx-auto w-full">
                    <label className="text-xs font-black text-[#d4af37]/70 uppercase tracking-[0.2em] ml-2"> Manifest Your Fix (Solution Link)</label>
                    <div className="relative group">
                        <input
                            type="text"
                            value={submissionLink}
                            onChange={(e) => setSubmissionLink(e.target.value)}
                            placeholder="Paste your fixed repository URL here..."
                            className="w-full bg-black/60 border-2 border-[#d4af37]/20 rounded-2xl px-6 py-5 text-white placeholder:text-gray-600 focus:border-[#d4af37]/60 focus:outline-none transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] group-hover:border-[#d4af37]/30"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#d4af37]/30 group-hover:text-[#d4af37]/60 transition-colors">
                            <ExternalLink size={20} />
                        </div>
                    </div>
                    {error && (
                        <motion.p
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-red-500 text-[11px] font-bold uppercase tracking-wider ml-2"
                        >
                            {error}
                        </motion.p>
                    )}
                    <p className="text-[10px] text-gray-500 italic ml-2">Ensure your repository is PUBLIC so the Ministry can verify your scrolls.</p>
                </div>

                <div className="mt-14 flex justify-center">
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !submissionLink}
                        className="flex items-center gap-4 px-12 py-4 rounded-2xl bg-linear-to-r from-[#8a6e2e] to-[#d4af37] text-black font-wizard font-bold text-2xl hover:from-[#d4af37] hover:to-[#FFD700] shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 active:scale-95"

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
