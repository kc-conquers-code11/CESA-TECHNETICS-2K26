import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Send,
    Github,
    ExternalLink,
    Rocket,
    Trophy,
    CheckCircle2,
    AlertCircle,
    Info,
    Layout,
    Globe,
    Cpu,
    Shield,
    Terminal
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { HACKATHON_PROBLEMS } from "@/data/hackathonData";
import { toast } from "sonner";
import logo from "../assets/technetics-head.svg";

const HackathonSubmission = () => {
    const navigate = useNavigate();
    const [teamName, setTeamName] = useState("");
    const [deployLink, setDeployLink] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedPS, setSelectedPS] = useState<any>(null);
    const [isSearching, setIsSearching] = useState(false);

    // Debounced search for team name to find selected PS
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (teamName.trim().length > 2) {
                setIsSearching(true);
                try {
                    const { data, error } = await supabase
                        .from('exam_sessions')
                        .select('selected_ps_id')
                        .eq('team_name', teamName.trim())
                        .maybeSingle();

                    if (data?.selected_ps_id) {
                        const ps = HACKATHON_PROBLEMS.find(p => p.id === data.selected_ps_id);
                        setSelectedPS(ps);
                    } else {
                        setSelectedPS(null);
                    }
                } catch (err) {
                    console.error("Error fetching PS:", err);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSelectedPS(null);
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [teamName]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!teamName || !deployLink) {
            toast.error("Please fill in all required fields.");
            return;
        }

        setIsSubmitting(true);
        const toastId = toast.loading("Recording your manifestation...");

        try {
            const { error } = await supabase
                .from('github_submissions')
                .insert({
                    team_name: teamName.trim(),
                    deploy_link: deployLink.trim(),
                });

            if (error) throw error;

            toast.success("Submission Received! Our magic scribes are evaluating your work.", { id: toastId });
            setTimeout(() => navigate("/"), 2000);
        } catch (err) {
            toast.error("Failed to submit. The ethereal link is unstable.", { id: toastId });
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050b0b] text-white flex flex-col font-sans overflow-x-hidden pt-20">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 h-20 border-b border-[#d4af37]/20 bg-[#051112]/95 flex items-center justify-between px-6 md:px-12 z-[100] backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <img src={logo} alt="Technetics" className="h-12 w-auto" />
                    <div className="flex flex-col border-l border-[#d4af37]/20 pl-4 py-1">
                        <span className="text-2xl text-[#FFD700] font-wizard tracking-widest leading-none">
                            MANIFESTATION PORTAL
                        </span>
                        <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mt-1 opacity-70">
                            Hackathon MVP Submission
                        </span>
                    </div>
                </div>
                <button
                    onClick={() => navigate("/")}
                    className="px-6 py-2 rounded-xl border border-[#d4af37]/30 text-[#d4af37] font-wizard hover:bg-[#d4af37]/10 transition-all tracking-widest"
                >
                    Return to Hall
                </button>
            </header>

            <main className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-12 relative">
                {/* Background Glows */}
                <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#d4af37]/5 blur-[120px] rounded-full -z-10" />
                <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full -z-10" />

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                    {/* Left Column: Form */}
                    <div className="lg:col-span-3 space-y-10">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <h2 className="text-4xl md:text-5xl font-wizard text-[#FFD700] mb-4">Record Your Quest</h2>
                            <p className="text-gray-400 font-sans">
                                "Ideas are just ethereal vapor until manifested in code." Provide your team details and deployment link to finalize your contribution to the Technetics scrolls.
                            </p>
                        </motion.div>

                        <form onSubmit={handleSubmit} className="space-y-8 bg-[#051112]/60 border border-[#d4af37]/20 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden backdrop-blur-sm">
                            <div className="space-y-6">
                                {/* Team Name */}
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-[#d4af37] uppercase tracking-[0.3em] ml-2 flex items-center gap-2">
                                        <Trophy size={14} /> Team Name
                                    </label>
                                    <div className="relative group flex items-center">
                                        <input
                                            type="text"
                                            value={teamName}
                                            onChange={(e) => setTeamName(e.target.value)}
                                            placeholder="Enter your registered team name..."
                                            className="w-full bg-black/40 border-2 border-[#d4af37]/20 rounded-2xl px-6 py-5 text-lg text-white focus:border-[#d4af37]/60 focus:outline-none transition-all"
                                            required
                                        />
                                        {isSearching && (
                                            <div className="absolute right-6 animate-spin rounded-full h-5 w-5 border-2 border-[#d4af37]/20 border-t-[#d4af37]" />
                                        )}
                                    </div>
                                    <AnimatePresence>
                                        {selectedPS && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="p-4 bg-[#FFD700]/5 border border-[#FFD700]/20 rounded-xl mt-2 flex items-center gap-4"
                                            >
                                                <div className="w-10 h-10 rounded-lg bg-[#FFD700]/10 flex items-center justify-center text-[#FFD700] shrink-0">
                                                    <Layout size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] uppercase font-black text-[#FFD700]/50 tracking-widest">Confirmed Quest</p>
                                                    <p className="text-white font-wizard text-sm tracking-widest pt-1">{selectedPS.title}</p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Deployment Link */}
                                <div className="space-y-3 pt-2">
                                    <label className="text-xs font-black text-[#d4af37] uppercase tracking-[0.3em] ml-2 flex items-center gap-2">
                                        <Globe size={14} /> Deployment Link
                                    </label>
                                    <div className="relative group">
                                        <input
                                            type="url"
                                            value={deployLink}
                                            onChange={(e) => setDeployLink(e.target.value)}
                                            placeholder="https://your-mvp-link.vercel.app"
                                            className="w-full bg-black/40 border-2 border-[#d4af37]/20 rounded-2xl px-6 py-5 text-lg text-white focus:border-[#d4af37]/60 focus:outline-none transition-all"
                                            required
                                        />
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-600">
                                            <ExternalLink size={20} />
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-gray-500 italic ml-2">Ensure the link is public and accessible for testing.</p>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting || !selectedPS}
                                className="w-full py-5 rounded-2xl bg-linear-to-r from-[#8a6e2e] to-[#d4af37] text-black font-wizard font-bold text-2xl hover:from-[#d4af37] hover:to-[#FFD700] shadow-[0_0_50px_rgba(212,175,55,0.2)] transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:scale-[1.02] flex items-center justify-center gap-4 tracking-[0.2em]"
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="animate-pulse">MANIFESTING SUCCESS...</span>
                                        <Rocket className="animate-bounce" />
                                    </>
                                ) : (
                                    <>
                                        <span>SUBMIT MANIFESTATION</span>
                                        <Send size={24} />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Right Column: Sidebar */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Bonus Points Box */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-gradient-to-br from-[#1a0f08] to-[#051112] border-2 border-[#d4af37]/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <StarIcon size={80} className="text-[#d4af37]" />
                            </div>

                            <h3 className="text-2xl font-wizard text-[#FFD700] mb-6 flex items-center gap-3">
                                <Trophy size={24} /> Bonus Manifestations
                            </h3>

                            <div className="space-y-6">
                                <BonusItem
                                    icon={<CheckCircle2 size={18} />}
                                    title="Pristine Scrolls"
                                    desc="Completely correct linted project with zero warnings."
                                />
                                <BonusItem
                                    icon={<Cpu size={18} />}
                                    title="Docker Alchemy"
                                    desc="Dockerfile included in the root folder of your repository."
                                />
                                <BonusItem
                                    icon={<Globe size={18} />}
                                    title="Ethereal Image"
                                    desc="Docker image link provided in DockerHub in README section DOCKER IMAGE."
                                />
                                <BonusItem
                                    icon={<Shield size={18} />}
                                    title="Warded Security"
                                    desc="Implementation of rate-limiting or basic authentication for sensitive endpoints."
                                />
                                <BonusItem
                                    icon={<Terminal size={18} />}
                                    title="Ancient Scripts"
                                    desc="Included CI/CD workflow (GitHub Actions) for automatic manifestation (deployment)."
                                />
                            </div>
                        </motion.div>

                        {/* Note Box */}
                        <div className="bg-blue-900/10 border border-blue-500/20 rounded-2xl p-6 flex gap-4">
                            <Info className="text-blue-400 shrink-0 mt-1" />
                            <div>
                                <p className="text-[10px] font-black font-sans text-blue-400 uppercase tracking-widest mb-1">Session Integrity</p>
                                <p className="text-xs text-gray-400 leading-relaxed font-wizard italic">
                                    "Accuracy is the first step toward greatness." Please double-check your deployment link before submitting. The Council's evaluation is final once recorded.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

const BonusItem = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
    <div className="flex gap-4 group/item">
        <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37] shrink-0 border border-[#d4af37]/20 group-hover/item:bg-[#d4af37]/20 transition-colors shadow-lg shadow-black">
            {icon}
        </div>
        <div>
            <h4 className="font-wizard text-[#FFD700]/90 text-sm tracking-widest leading-none mb-1">{title}</h4>
            <p className="text-[11px] text-gray-500 leading-tight pr-4">{desc}</p>
        </div>
    </div>
);

const StarIcon = ({ size, className }: { size: number, className?: string }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
);

export default HackathonSubmission;
