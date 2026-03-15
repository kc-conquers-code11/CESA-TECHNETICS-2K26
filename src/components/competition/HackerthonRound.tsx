import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock,
    CheckCircle2,
    Activity,
    ShieldCheck,
    AlertCircle,
    Code,
    MonitorCheck,
    ChevronDown,
    Wand2,
    Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabaseClient';
import { useCompetitionStore } from '@/store/competitionStore';
import { useAntiCheat } from '@/hooks/useAntiCheat';
import { CompetitionTimer } from './CompetitionTimer';
import { toast } from 'sonner';

const HackerthonRound = () => {
    // useAntiCheat(); // Anti-cheat disabled for this round
    const { completeRound, userId, email, teamName } = useCompetitionStore();
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [viewingProblem, setViewingProblem] = useState<any | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [solemnCheckboxes, setSolemnCheckboxes] = useState({
        collaborator: false,
        commit: false,
        originality: false
    });

    // --- ACADEMY LOGIC: PERSISTENT TIMER ---
    const [roundDuration, setRoundDuration] = useState(60 * 60);

    const problems = [
        {
            id: 1,
            domain: "Healthcare / Inclusive Innovation",
            title: "Healthcare Accessibility Intelligence Platform",
            shortDesc: "Build a digital platform helping individuals with disabilities discover accessible healthcare facilities based on infrastructure details.",
            background: "Access to healthcare remains a major challenge for persons with disabilities due to limited information about accessibility infrastructure in hospitals and clinics. Facilities often lack transparent details about features such as wheelchair access, accessible restrooms, sign language support, tactile navigation aids, or assistance services. As a result, individuals with disabilities may face significant barriers when seeking medical care, including physical inaccessibility, communication difficulties, and lack of appropriate support services. A centralized and reliable system that helps users identify accessible healthcare facilities can significantly improve healthcare inclusivity and patient experience.",
            problemStatement: "Build a digital platform that helps individuals with disabilities discover healthcare facilities based on accessibility features. The system should aggregate information about hospitals, clinics, and diagnostic centers, highlighting infrastructure and services designed for accessibility. It should allow users to search and filter facilities based on specific accessibility needs, provide location-based discovery, and enable community feedback to improve data accuracy and transparency.",
            directions: [
                "Accessibility Mapping: Create a structured database of healthcare facilities with details about accessibility features such as wheelchair ramps, elevators, tactile paths, accessible washrooms, and assistance services.",
                "Location Intelligence: Use geolocation to help users find nearby healthcare facilities that match their accessibility requirements.",
                "Community Contribution: Enable users to submit feedback, accessibility ratings, and updates about healthcare facility infrastructure.",
                "Accessibility Classification: Develop a standardized accessibility scoring system to help users quickly evaluate healthcare facilities.",
                "Inclusive Interface Design: Design the platform to support screen readers, voice navigation, high-contrast modes, and simplified UI for diverse accessibility needs."
            ],
            evaluation: ["Accessibility Coverage", "Data Reliability", "User Experience", "Inclusivity", "Scalability"]
        },
        {
            id: 2,
            domain: "AI for Digital Safety",
            title: "Real-Time Fake News Detection Engine",
            shortDesc: "Build an AI-powered fake news detection system that analyzes news, social media, and media to identify misinformation in real-time.",
            background: "Misinformation spreads rapidly across social media platforms, causing real-world harm: communal tensions, health misinformation, financial scams, and election interference. A single viral fake news post can reach millions within hours before fact-checkers can respond. Users lack tools to verify content authenticity in real-time, especially in regional languages where fact-checking resources are limited.",
            problemStatement: "Build an AI-powered fake news detection system that analyzes news articles, social media posts, images, and videos to identify misinformation in real-time. The system should provide credibility scores, identify manipulated media, cross-reference with verified sources, and explain its reasoning in simple language. It must work across multiple Indian languages and handle multimedia content.",
            directions: [
                "NLP: Multi-lingual text analysis for sensational language, source credibility, and claim verification.",
                "Computer Vision: Deepfake detection, image manipulation identification, and reverse image search.",
                "Knowledge Graphs: Cross-referencing claims with verified fact-checking databases and trusted sources.",
                "Explainability: Clear reasoning for credibility scores that users can understand and trust.",
                "Browser Extension: Real-time fact-checking while users browse social media."
            ],
            evaluation: ["Detection Accuracy", "Speed", "Multi-lingual Support", "User Trust"]
        },
        {
            id: 3,
            domain: "FinTech for MSME Growth",
            title: "Digital Lending Platform for MSMEs",
            shortDesc: "Design a digital lending platform that streamlines the MSME loan process from application to disbursement within 24-48 hours.",
            background: "Micro, Small, and Medium Enterprises contribute 30% to India's GDP but face a credit gap of over Rs 20 lakh crores. Traditional banks view them as high-risk due to lack of collateral and formal financial records. The loan application process takes weeks, requires extensive paperwork, and has high rejection rates. MSMEs need fast, hassle-free access to working capital to grow their businesses.",
            problemStatement: "Design a digital lending platform that streamlines the MSME loan process from application to disbursement within 24-48 hours. The system should use alternative data sources to assess creditworthiness, automate document verification, provide instant pre-approvals, and offer flexible repayment options. It must integrate with GST records, bank statements, and digital payment histories for comprehensive risk assessment.",
            directions: [
                "Automated Underwriting: AI models using GST data, bank statements, and business metrics for credit decisions.",
                "Document Processing: OCR and NLP for automatic invoice, tax return, and financial statement analysis.",
                "Risk Modeling: Cash flow prediction and business health scoring based on operational data.",
                "Digital Onboarding: Video KYC, e-signatures, and paperless loan agreements.",
                "Flexible Products: Invoice financing, purchase order financing, and revenue-based lending options."
            ],
            evaluation: ["Processing Speed", "Approval Accuracy", "User Experience", "Scalability"]
        },
        {
            id: 4,
            domain: "Open Innovation",
            title: "Open Innovation",
            shortDesc: "Share any innovative idea with a proper explanation, technical approach, and implementation plan.",
            background: "Innovation often comes from outside existing categories. This track is for visionaries who want to solve unique problems not covered by the other domains. It encourages absolute freedom of thought and creative problem-solving across any technological frontier.",
            problemStatement: "User can share any idea they want but with proper explanation. Present your own unique problem statement and solution. Ensure it has a clear background, target audience, technical approach, and potential impact.",
            directions: [
                "Define a clear problem you've observed in the real world.",
                "Outline a technical architecture for your solution.",
                "Explain how it leverages modern technology.",
                "Describe your implementation roadmap.",
                "Justify the societal or market impact of your proposal."
            ],
            evaluation: ["Originality", "Technical Feasibility", "Potential Impact", "Clarity of Vision"]
        }
    ];

    const handleConfirm = async () => {
        if (!selectedId || !userId) return;
        
        setIsSubmitting(true);
        const toastId = toast.loading("Manifesting Quest...");
        try {
            const { data: sessionData, error: sessionError } = await supabase
                .from('exam_sessions')
                .select('id')
                .eq('user_id', userId)
                .single();

            if (sessionError || !sessionData) throw new Error("Session not found");

            const sessionId = sessionData.id;

            const { error: dbError } = await supabase
                .from('ps_selection')
                .insert([{
                    team_name: teamName, 
                    email: email,
                    problem_id: selectedId,
                    selection_time: new Date().toISOString(),
                    user_id: sessionId 
                }]);

            if (dbError) {
                console.error("Submission Error:", dbError);
                toast.error("Failed to record your selection.", { id: toastId });
                setIsSubmitting(false);
                return;
            }

            setIsConfirmed(true);
            await completeRound('coding');
            toast.success("Quest Manifested Successfully!", { id: toastId });
        } catch (err) {
            console.error("Critical Error:", err);
            toast.error("Manifestation failed. The magic is unstable.", { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex gap-4 h-full w-full animate-in fade-in duration-500 overflow-hidden relative">
            <main className="flex-1 p-4 md:p-8 flex flex-col items-center justify-center overflow-hidden relative">
                <div className="w-full max-w-5xl h-full flex flex-col items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-10"
                    >
                        <h2 className="text-4xl md:text-5xl font-harry tracking-widest text-[#d4af37] mb-4">
                            Choose Your Quest
                        </h2>
                        <p className="text-[#f2e0b5]/60 max-w-2xl mx-auto italic font-crimson text-lg">
                            "The wand chooses the wizard, but the quest is chosen by the bold. You have one hour to manifest your decision."
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full h-auto p-2">
                        {problems.map((prob) => (
                            <motion.div
                                key={prob.id}
                                whileHover={{ scale: 1.02, borderColor: "rgba(212,175,55,0.6)" }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    if (!isConfirmed) {
                                        setViewingProblem(prob);
                                        setSelectedId(prob.id);
                                    }
                                }}
                                className={`relative p-6 rounded-2xl border-2 transition-all cursor-pointer bg-[#1a0f08]/80 backdrop-blur-md overflow-hidden group ${selectedId === prob.id
                                    ? 'border-[#d4af37] shadow-[0_0_30px_rgba(212,175,55,0.2)] bg-[#3d2618]/40'
                                    : 'border-[#8b6e2e]/20 hover:border-[#8b6e2e]/40'
                                    }`}
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold border transition-all ${selectedId === prob.id 
                                        ? 'bg-[#d4af37] text-black border-[#d4af37]' 
                                        : 'bg-[#3d2618]/30 text-[#d4af37] border-[#8b6e2e]/20'
                                        }`}>
                                        0{prob.id}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-[#d4af37]/60 uppercase tracking-widest mb-0.5">{prob.domain}</p>
                                        <h3 className="text-lg font-sans text-[#f2e0b5] leading-tight group-hover:text-[#d4af37] transition-colors">
                                            {prob.title}
                                        </h3>
                                    </div>
                                </div>
                                <p className="text-xs text-[#f2e0b5]/50 leading-relaxed font-crimson line-clamp-2 italic">
                                    {prob.shortDesc}
                                </p>

                                {selectedId === prob.id && (
                                    <motion.div
                                        layoutId="selected-glow"
                                        className="absolute inset-0 border-2 border-[#d4af37] pointer-events-none rounded-2xl"
                                    />
                                )}
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-12">
                        <button
                            onClick={() => selectedId && setShowConfirm(true)}
                            disabled={!selectedId || isConfirmed || isSubmitting}
                            className={cn(
                                "group relative px-16 py-4 rounded-xl font-harry text-2xl transition-all duration-500 overflow-hidden flex items-center gap-4",
                                selectedId && !isConfirmed ? "bg-gradient-to-r from-[#3d2618] via-[#8b6e2e] to-[#3d2618] text-[#d4af37] border-2 border-[#d4af37]/40 shadow-[0_0_40px_rgba(212,175,55,0.25)] hover:scale-105" : "bg-black/40 text-[#8b6e2e]/40 border-2 border-[#8b6e2e]/10 opacity-50 cursor-not-allowed"
                            )}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#d4af37]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            <Wand2 className={cn("w-6 h-6", selectedId ? "text-[#d4af37]" : "text-[#8b6e2e]/40")} />
                            <span className="tracking-[0.2em]">{isConfirmed ? 'QUEST SEALED' : 'LOCK SELECTION'}</span>
                            {isSubmitting && <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#d4af37]/20 border-t-[#d4af37]" />}
                        </button>
                    </div>
                </div>

                {/* PROBLEM DETAIL OVERLAY */}
                <AnimatePresence>
                    {viewingProblem && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 md:p-8"
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                                animate={{ scale: 1, y: 0, opacity: 1 }}
                                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                                className="bg-[#1a0f08] border-2 border-[#d4af37]/40 rounded-3xl p-6 md:p-10 max-w-4xl w-full h-full max-h-[85vh] overflow-y-auto relative custom-scrollbar shadow-[0_0_100px_rgba(0,0,0,1)]"
                            >
                                <button 
                                    onClick={() => setViewingProblem(null)}
                                    className="absolute top-6 right-6 text-[#d4af37]/60 hover:text-[#d4af37] transition-colors p-2 hover:bg-[#3d2618] rounded-full"
                                >
                                    <ChevronDown className="w-8 h-8 rotate-90" />
                                </button>

                                <div className="mb-8">
                                    <p className="text-[#d4af37] font-harry text-sm tracking-[0.3em] uppercase mb-2">{viewingProblem.domain}</p>
                                    <h3 className="text-3xl md:text-4xl font-harry tracking-widest text-[#f2e0b5]">PS 0{viewingProblem.id}: {viewingProblem.title}</h3>
                                    <div className="h-1 w-24 bg-gradient-to-r from-[#d4af37] to-transparent mt-4" />
                                </div>

                                <div className="space-y-8 font-sans">
                                    <section>
                                        <h4 className="text-[#d4af37] font-harry text-lg tracking-widest mb-3 uppercase flex items-center gap-2">
                                            <Sparkles className="w-4 h-4" /> Background
                                        </h4>
                                        <p className="text-[#f2e0b5]/80 leading-relaxed italic border-l-2 border-[#3d2618] pl-6 py-1">
                                            {viewingProblem.background}
                                        </p>
                                    </section>

                                    <section>
                                        <h4 className="text-[#d4af37] font-harry text-lg tracking-widest mb-3 uppercase flex items-center gap-2">
                                            <Sparkles className="w-4 h-4" /> Problem Statement
                                        </h4>
                                        <p className="text-[#f2e0b5] leading-relaxed text-lg font-medium">
                                            {viewingProblem.problemStatement}
                                        </p>
                                    </section>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        <section>
                                            <h4 className="text-[#d4af37] font-harry text-lg tracking-widest mb-4 uppercase">Directions to Explore</h4>
                                            <ul className="space-y-3">
                                                {viewingProblem.directions.map((dir: string, i: number) => (
                                                    <li key={i} className="flex gap-3 text-sm text-[#f2e0b5]/70">
                                                        <span className="text-[#d4af37] font-bold">✧</span>
                                                        <span className="leading-tight">{dir}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </section>

                                        <section>
                                            <h4 className="text-[#d4af37] font-harry text-lg tracking-widest mb-4 uppercase">Evaluation Criteria</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {viewingProblem.evaluation.map((crit: string, i: number) => (
                                                    <span key={i} className="px-3 py-1 bg-[#3d2618] text-[#d4af37] border border-[#d4af37]/20 rounded-full text-[10px] font-inter tracking-wider">
                                                        {crit}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="mt-8 p-6 bg-[#3d2618]/30 rounded-2xl border border-[#8b6e2e]/20">
                                                <p className="text-[#f2e0b5]/40 text-[10px] uppercase tracking-widest mb-4">Wand Status</p>
                                                <button 
                                                    onClick={() => { setViewingProblem(null); }}
                                                    className="w-full py-4 bg-[#d4af37] text-[#1a0f08] font-harry tracking-widest rounded-xl hover:bg-[#f2e0b5] transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                                                >
                                                    Select This Quest
                                                </button>
                                            </div>
                                        </section>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* MODALS */}
                <AnimatePresence>
                    {showConfirm && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="bg-[#1a0f08] border-2 border-[#d4af37]/40 rounded-3xl p-8 max-w-md w-full text-center shadow-[0_0_100px_rgba(0,0,0,0.8)] relative"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent" />
                                <div className="w-20 h-20 rounded-full bg-[#3d2618] border border-[#d4af37]/20 flex items-center justify-center text-[#d4af37] mx-auto mb-6 shadow-[0_0_20px_rgba(212,175,55,0.1)]">
                                    <AlertCircle size={40} />
                                </div>
                                <h3 className="text-3xl font-harry tracking-widest text-[#d4af37] mb-2 uppercase">I Solemnly Swear...</h3>
                                <p className="text-[#f2e0b5]/50 mb-6 font-crimson italic text-sm">
                                    "I solemnly swear that I am up to no good... and that I shall follow the Sacred Rules of the Technetics."
                                </p>

                                <div className="space-y-4 text-left mb-8">
                                    <label className="flex gap-4 cursor-pointer group/check">
                                        <div className="relative flex items-center justify-center shrink-0 mt-1">
                                            <input 
                                                type="checkbox" 
                                                checked={solemnCheckboxes.collaborator}
                                                onChange={(e) => setSolemnCheckboxes(prev => ({ ...prev, collaborator: e.target.checked }))}
                                                className="peer appearance-none w-5 h-5 border border-[#d4af37]/40 rounded bg-black/40 checked:bg-[#d4af37] checked:border-[#d4af37] transition-all"
                                            />
                                            <CheckCircle2 size={12} className="absolute text-black opacity-0 peer-checked:opacity-100 transition-opacity" />
                                        </div>
                                        <span className="text-xs text-[#f2e0b5]/70 leading-relaxed font-sans group-hover/check:text-[#f2e0b5] transition-colors">
                                            I must add an Event Head <a href="https://github.com/krrishmahar" target="_blank" rel="noopener noreferrer" className="text-[#d4af37] underline hover:text-[#f2e0b5]">@krrishmahar</a> as a collaborator on my GitHub repository.
                                        </span>
                                    </label>

                                    <label className="flex gap-4 cursor-pointer group/check">
                                        <div className="relative flex items-center justify-center shrink-0 mt-1">
                                            <input 
                                                type="checkbox" 
                                                checked={solemnCheckboxes.commit}
                                                onChange={(e) => setSolemnCheckboxes(prev => ({ ...prev, commit: e.target.checked }))}
                                                className="peer appearance-none w-5 h-5 border border-[#d4af37]/40 rounded bg-black/40 checked:bg-[#d4af37] checked:border-[#d4af37] transition-all"
                                            />
                                            <CheckCircle2 size={12} className="absolute text-black opacity-0 peer-checked:opacity-100 transition-opacity" />
                                        </div>
                                        <span className="text-xs text-[#f2e0b5]/70 leading-relaxed font-sans group-hover/check:text-[#f2e0b5] transition-colors">
                                            I must commit code progress to GitHub at least every 3 hours.
                                        </span>
                                    </label>

                                    <label className="flex gap-4 cursor-pointer group/check">
                                        <div className="relative flex items-center justify-center shrink-0 mt-1">
                                            <input 
                                                type="checkbox" 
                                                checked={solemnCheckboxes.originality}
                                                onChange={(e) => setSolemnCheckboxes(prev => ({ ...prev, originality: e.target.checked }))}
                                                className="peer appearance-none w-5 h-5 border border-[#d4af37]/40 rounded bg-black/40 checked:bg-[#d4af37] checked:border-[#d4af37] transition-all"
                                            />
                                            <CheckCircle2 size={12} className="absolute text-black opacity-0 peer-checked:opacity-100 transition-opacity" />
                                        </div>
                                        <span className="text-xs text-[#f2e0b5]/70 leading-relaxed font-sans group-hover/check:text-[#f2e0b5] transition-colors">
                                            I shall avoid any form of Plagiarism and sought originality in my quest.
                                        </span>
                                    </label>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => {
                                            setShowConfirm(false);
                                            setSolemnCheckboxes({ collaborator: false, commit: false, originality: false });
                                        }}
                                        className="flex-1 py-3 rounded-xl border border-[#8b6e2e]/30 text-[#8b6e2e] font-harry hover:bg-[#3d2618]/30 transition-all tracking-widest text-lg"
                                    >
                                        RETURN
                                    </button>
                                    <button
                                        onClick={() => { setShowConfirm(false); handleConfirm(); }}
                                        disabled={!solemnCheckboxes.collaborator || !solemnCheckboxes.commit || !solemnCheckboxes.originality}
                                        className={cn(
                                            "flex-1 py-3 rounded-xl font-bold font-harry transition-all tracking-widest text-lg shadow-[0_0_15px_rgba(212,175,55,0.3)]",
                                            (solemnCheckboxes.collaborator && solemnCheckboxes.commit && solemnCheckboxes.originality)
                                                ? "bg-[#d4af37] text-[#1a0f08] hover:bg-[#f2e0b5]"
                                                : "bg-[#3d2618] text-[#8b6e2e]/40 cursor-not-allowed opacity-50"
                                        )}
                                    >
                                        CONFIRM
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
                            className="absolute inset-0 z-[80] flex items-center justify-center bg-[#1a0f08]/90 backdrop-blur-md p-6"
                        >
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-center"
                            >
                                <div className="w-24 h-24 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] mx-auto mb-8 shadow-[0_0_40px_rgba(212,175,55,0.1)]">
                                    <ShieldCheck size={48} className="animate-pulse" />
                                </div>
                                <h3 className="text-5xl font-harry tracking-widest text-[#d4af37] mb-6">MANIFESTATION COMPLETE</h3>
                                <p className="text-xl text-[#f2e0b5]/60 font-crimson italic">
                                    All the best for the 15-Hour Hackathon! The arena awaits your magic.
                                </p>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <aside className="w-80 border-l border-[#8b6e2e]/20 bg-[#1a0f08]/80 p-5 hidden xl:flex flex-col gap-6 backdrop-blur-md">
                <div className="bg-[#3d2618]/40 rounded-xl p-4 border border-[#8b6e2e]/20 shadow-inner">
                    <CompetitionTimer totalSeconds={roundDuration} onTimeUp={handleConfirm} />
                </div>

                <div className="space-y-5">
                    <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em] text-[#8b6e2e]">
                            <span>Current Phase</span>
                            <span className="text-[#d4af37]">QUEST SELECTION</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em] text-[#8b6e2e]">
                            <span>Identity Check</span>
                            <span className="text-[#f2e0b5]">VERIFIED</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em] text-[#8b6e2e]">
                            <span>Identity</span>
                            <div className="flex items-center gap-1 text-[#d4af37] font-mono text-[9px]">
                                {email}
                            </div>
                        </div>
                    </div>

                    <hr className="border-[#8b6e2e]/20" />

                    <div>
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em] text-[#8b6e2e] mb-2">
                            <span>Manifestation Progress</span>
                            <span className="text-[#d4af37]">{selectedId ? '1' : '0'}/1</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#3d2618] rounded-full overflow-hidden border border-[#8b6e2e]/10">
                            <motion.div
                                animate={{ width: selectedId ? '100%' : '0%' }}
                                className="h-full bg-[#d4af37] shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8b6e2e] mb-4 border-b border-[#8b6e2e]/10 pb-1">Sacred Rules</h3>
                        <ul className="space-y-4">
                            {[
                                "You must add the designated Event Head as a collaborator on your GitHub repository.",
                                "You must commit your code progress to GitHub at least every 3 hours.",
                                "Plagiarism and disturbing others are strictly prohibited; originality is sacred."
                            ].map((step, i) => (
                                <li key={i} className="flex gap-3 text-[11px] text-[#f2e0b5]/50 font-crimson italic">
                                    <span className="text-[#d4af37] font-bold font-harry not-italic">{i + 1}.</span>
                                    <span className="leading-tight tracking-wide">{step}</span>
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

