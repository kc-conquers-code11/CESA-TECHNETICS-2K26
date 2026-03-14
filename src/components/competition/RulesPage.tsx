import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { 
    Shield, AlertTriangle, Loader2, 
    ListChecks, Workflow, Code, ChevronDown 
} from 'lucide-react';
import { useCompetitionStore } from '@/store/competitionStore';
import { supabase } from '@/lib/supabaseClient';
import { WaitingArea } from './WaitingArea';
import { cn } from '@/lib/utils';

// --- UTILITY: Highlight Important Words ---
const formatRuleText = (text: string) => {
    const dangerWords = ["immediate disqualification", "strictly prohibited", "instant elimination", "elimination", "disqualification"];
    const warningWords = ["No negative marking", "FCFS", "First Come, First Served", "Mandatory", "accuracy", "correctness", "plagiarism", "0 mark"];
    
    const parts = text.split(new RegExp(`(${dangerWords.concat(warningWords).join('|')})`, 'gi'));
    
    return (
        <span>
            {parts.map((part, i) => {
                if (dangerWords.some(w => w.toLowerCase() === part.toLowerCase())) {
                    return <span key={i} className="text-red-400 font-bold">{part}</span>;
                }
                if (warningWords.some(w => w.toLowerCase() === part.toLowerCase())) {
                    return <span key={i} className="text-yellow-500 font-semibold">{part}</span>;
                }
                return part;
            })}
        </span>
    );
};

export const RulesPage = () => {
    const [accepted, setAccepted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(true);
    const [groupedRules, setGroupedRules] = useState<any>({ mcq: [], flowchart: [], coding: [] });
    
    const { acceptRules, currentRound, userId, syncSession } = useCompetitionStore();

    // 1. SAFETY CHECK
    useEffect(() => {
        let isMounted = true;
        const checkRealStatus = async () => {
            if (!userId) {
                if (isMounted) setVerifying(false);
                return;
            }
            try {
                const { data, error } = await supabase
                    .from('exam_sessions')
                    .select('*')
                    .eq('user_id', userId)
                    .single();

                if (error) throw error;

                if (data && isMounted) {
                    if (data.current_round_slug !== 'rules') {
                        syncSession(data);
                        return;
                    }
                }
            } catch (err) {
                console.error("Check Failed:", err);
            } finally {
                if (isMounted) setVerifying(false);
            }
        };

        checkRealStatus();
        const safetyTimer = setTimeout(() => { if (isMounted && verifying) setVerifying(false); }, 5000);
        return () => { isMounted = false; clearTimeout(safetyTimer); };
    }, [userId, syncSession]);

    // 2. FETCH RULES
    useEffect(() => {
        const fetchRules = async () => {
            const { data } = await supabase
                .from('round_rules')
                .select('*')
                .order('order_index', { ascending: true });

            if (data && data.length > 0) {
                setGroupedRules({
                    mcq: data.filter(r => r.round_slug === 'mcq'),
                    flowchart: data.filter(r => r.round_slug === 'flowchart'),
                    coding: data.filter(r => r.round_slug === 'coding'),
                });
            } else {
                // FALLBACK
                setGroupedRules({
                    mcq: [
                        { rule_text: "The round consists of 10 MCQs which must be solved within the given time." },
                        { rule_text: "Tab switching will result in immediate disqualification." }
                    ],
                    flowchart: [{ rule_text: "Participants must draw a flowchart for the given problem." }],
                    coding: [{ rule_text: "Participants will be given two (2) coding problems to solve." }]
                });
            }
        };
        fetchRules();
    }, []);

    const handleAccept = async () => {
        setLoading(true);
        try {
            const elem = document.documentElement;
            if (elem.requestFullscreen) await elem.requestFullscreen();
            else if ((elem as any).webkitRequestFullscreen) await (elem as any).webkitRequestFullscreen();
        } catch (err) { console.log("Fullscreen denied"); }

        await acceptRules();
        setLoading(false);
    };

    if (currentRound === 'waiting') return <WaitingArea />;
    if (verifying) return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-red-600 w-10 h-10" /></div>;

    return (
        //  SCROLL FIX 2.0: 
        // 1. 'h-full' instead of absolute to respect flex parent.
        // 2. 'z-10' and 'relative' to ensure it sits on top for mouse events.
        // 3. 'pointer-events-auto' explicitly enables interactions.
        <div className="h-full w-full overflow-y-auto custom-scrollbar relative z-10 pointer-events-auto">
            <div className="max-w-4xl mx-auto p-4 md:p-8 text-white animate-in fade-in duration-700 pb-32">
                
                {/* HEADER */}
                <div className="text-center space-y-4 mb-10 mt-2">
                    <h1 className="text-4xl md:text-5xl font-bold font-display text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)] tracking-wide">
                        ACADEMY VERIFICATION
                    </h1>
                    <p className="text-zinc-400 max-w-2xl mx-auto font-medium">
                        Strict adherence to the following protocols is mandatory. <span className="text-red-400">Violations are monitored.</span>
                    </p>
                </div>

                {/* RULES SECTIONS */}
                <div className="space-y-5">
                    <RuleSection 
                        title="Round 1: Arithmancy (MCQ)" 
                        icon={<ListChecks className="w-5 h-5 text-blue-400" />}
                        rules={groupedRules.mcq}
                        color="blue"
                        defaultOpen={true}
                    />

                    <RuleSection 
                        title="Round 2: Ancient Runes (Flowchart)" 
                        icon={<Workflow className="w-5 h-5 text-yellow-400" />}
                        rules={groupedRules.flowchart}
                        color="yellow"
                    />

                    <RuleSection 
                        title="Round 3: Dark Code Defense (Coding)" 
                        icon={<Code className="w-5 h-5 text-purple-400" />}
                        rules={groupedRules.coding}
                        color="purple"
                    />
                </div>

                {/* WARNING */}
                <div className="mt-8 bg-red-950/20 border border-red-500/30 p-5 rounded-xl flex gap-4 items-start shadow-[0_0_20px_rgba(220,38,38,0.05)] backdrop-blur-sm">
                    <div className="p-2 bg-red-500/10 rounded-full shrink-0 mt-1">
                        <AlertTriangle className="text-red-500 w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                        <h4 className="text-red-400 font-bold mb-1 tracking-wide">STRICT PROCTORING ACTIVE</h4>
                        <p className="text-red-200/70 text-sm leading-relaxed">
                            Your Full-Screen Status, Tab Switches, and Mouse Activity are being logged. 
                            <strong className="block mt-1 text-red-100">Any attempt to minimize the browser or switch tabs will result in instant disqualification.</strong>
                        </p>
                    </div>
                </div>

                {/* ACTION AREA */}
                <div className="flex flex-col items-center gap-6 mt-10 pt-8 border-t border-zinc-800">
                    <div className="flex items-center gap-3 p-4 rounded-lg hover:bg-zinc-900/50 transition-colors cursor-pointer select-none" onClick={() => setAccepted(!accepted)}>
                        <Checkbox 
                            id="terms" 
                            checked={accepted} 
                            onCheckedChange={(c) => setAccepted(c === true)} 
                            className="border-zinc-500 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600 w-5 h-5 mt-0.5"
                        />
                        <label htmlFor="terms" className="text-sm md:text-base text-zinc-300 cursor-pointer font-medium">
                            I acknowledge the rules and agree to the monitoring protocols.
                        </label>
                    </div>

                    <Button 
                        disabled={!accepted || loading} 
                        onClick={handleAccept}
                        className="w-full md:w-80 bg-gradient-to-r from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 text-white font-bold h-14 text-lg rounded-xl shadow-lg shadow-red-900/20 transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin"/> INITIALIZING...</span>
                        ) : "ENTER WAITING AREA"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

// --- HELPER COMPONENT ---
const RuleSection = ({ title, icon, rules, color, defaultOpen = false }: { title: string, icon: any, rules: any[], color: 'blue' | 'yellow' | 'purple', defaultOpen?: boolean }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const colorClasses = {
        blue: "border-blue-500/20 hover:border-blue-500/40 bg-blue-900/5 hover:bg-blue-900/10",
        yellow: "border-yellow-500/20 hover:border-yellow-500/40 bg-yellow-900/5 hover:bg-yellow-900/10",
        purple: "border-purple-500/20 hover:border-purple-500/40 bg-purple-900/5 hover:bg-purple-900/10",
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`border rounded-xl overflow-hidden transition-all duration-300 ${colorClasses[color]} ${isOpen ? 'shadow-lg shadow-black/40 ring-1 ring-white/5' : ''}`}
        >
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-5 text-left transition-colors focus:outline-none"
            >
                <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-lg bg-${color}-500/10 border border-${color}-500/20`}>
                        {icon}
                    </div>
                    <h2 className="text-lg font-bold text-zinc-100 tracking-wide">{title}</h2>
                </div>
                <div className={`p-1 rounded-full transition-all duration-300 ${isOpen ? 'bg-white/10 rotate-180' : 'bg-transparent'}`}>
                    <ChevronDown className="w-5 h-5 text-zinc-400" />
                </div>
            </button>
            
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                    >
                        <div className="px-6 pb-6 pt-0">
                            <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-700 to-transparent mb-4" />
                            {rules && rules.length > 0 ? (
                                <ul className="space-y-3">
                                    {rules.map((rule, idx) => (
                                        <li key={idx} className="flex gap-4 text-[13px] md:text-sm text-zinc-300/90 leading-relaxed group">
                                            <span className={`text-${color}-500 font-bold mt-0.5 font-mono opacity-60 group-hover:opacity-100 transition-opacity`}>
                                                {String(idx + 1).padStart(2, '0')}.
                                            </span>
                                            <span>{formatRuleText(rule.rule_text)}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-zinc-600 italic text-sm mt-2 flex items-center gap-2">
                                    <Loader2 className="w-3 h-3 animate-spin"/> Loading rules...
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};