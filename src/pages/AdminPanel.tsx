import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Leaderboard as LeaderboardTab } from '../components/competition/LeaderboardTab';
import ReactFlow, {
    Background,
    Controls,
    ReactFlowProvider,
    Handle,
    Position
} from 'reactflow';
import 'reactflow/dist/style.css';
import Editor from "@monaco-editor/react"; // Added for Inspection Modal

import {
    Shield, RefreshCw, Play, Ban, Search,
    Plus, Trash2, AlertTriangle, LogOut,
    Activity, Workflow, CheckCircle2, Code, Trophy,
    ListChecks, Settings, Save, Maximize2, BookOpen, Database,
    Cpu, X, Eye
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { cn } from '../lib/utils';
import { AnimatedBackground } from '../components/competition/AnimatedBackground';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'; // Added for Inspection Modal

// --- CONFIGURATION ---
const ADMIN_EMAILS = ["admin1@strangertech.in", "kc@strangertech.in", "admin@cesa.in"];

// --- FLOWCHART NODE TYPES ---
const StartNode = ({ data }: any) => (
    <div className="w-[100px] h-[50px] rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center text-xs font-bold text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
        {data.label}
        <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-green-500" />
    </div>
);

const EndNode = ({ data }: any) => (
    <div className="w-[100px] h-[50px] rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center text-xs font-bold text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
        <Handle type="target" position={Position.Top} className="w-2 h-2 bg-red-500" />
        {data.label}
    </div>
);

const ProcessNode = ({ data }: any) => (
    <div className="w-[120px] h-[60px] bg-blue-500/20 border-2 border-blue-500 rounded flex items-center justify-center text-xs font-bold text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
        <Handle type="target" position={Position.Top} className="w-2 h-2 bg-blue-500" />
        {data.label}
        <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-blue-500" />
    </div>
);

const DecisionNode = ({ data }: any) => (
    <div className="w-[100px] h-[100px] relative flex items-center justify-center">
        <div className="absolute inset-0 bg-yellow-500/20 border-2 border-yellow-500 rotate-45 rounded-sm shadow-[0_0_15px_rgba(234,179,8,0.3)]"></div>
        <div className="relative z-10 text-[10px] font-bold text-yellow-500 text-center px-2">{data.label}</div>
        <Handle type="target" position={Position.Top} className="w-2 h-2 bg-yellow-500 -mt-[50px]" />
        <Handle type="source" position={Position.Right} id="yes" className="w-2 h-2 bg-green-500 -mr-[50px]" />
        <Handle type="source" position={Position.Bottom} id="no" className="w-2 h-2 bg-red-500 -mb-[50px]" />
    </div>
);

const nodeTypes = {
    start: StartNode,
    end: EndNode,
    process: ProcessNode,
    decision: DecisionNode,
    default: ProcessNode
};

// --- TYPES ---
interface Participant {
    user_id: string;
    email: string;
    status: 'active' | 'frozen' | 'disqualified';
    current_round_slug: string;
    tab_switches: number;
    created_at: string;
    updated_at: string;
}

interface InspectionData {
    flowchart?: {
        nodes: any;
        edges: any;
        ai_score: number;
        ai_feedback: string;
        timestamp: string;
    } | null;
    mcq?: {
        score: number;
        answers: any;
        timestamp: string;
    } | null;
    coding?: {
        problem_set?: any[];
        total_score?: number;
        status?: string;
        timestamp: string;
    } | null;
}

// --- VISUAL FLOWCHART VIEWER ---
const FlowchartViewer = ({ nodes, edges }: { nodes: any[], edges: any[] }) => {
    return (
        <div className="h-[400px] w-full border border-zinc-700 rounded-xl bg-zinc-900 overflow-hidden relative">
            <ReactFlowProvider>
                <ReactFlow
                    nodes={nodes || []}
                    edges={edges || []}
                    nodeTypes={nodeTypes}
                    fitView
                    nodesDraggable={false}
                    nodesConnectable={false}
                    elementsSelectable={true}
                    zoomOnScroll={true}
                    panOnDrag={true}
                    attributionPosition="bottom-right"
                >
                    <Background color="#333" gap={16} />
                    <Controls className="bg-zinc-800 border-zinc-700 fill-white" />
                </ReactFlow>
            </ReactFlowProvider>
            <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-[10px] text-zinc-400 pointer-events-none border border-zinc-800">
                Read-Only Mode
            </div>
        </div>
    );
};

// --- INSPECTION MODAL (For Monitor Tab) ---
function InspectionModal({ user, loading, data, onClose }: { user: Participant; loading: boolean; data: InspectionData | null; onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-zinc-950 border border-zinc-800 w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl flex flex-col relative overflow-hidden">

                {/* Header */}
                <div className="p-6 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2"><Activity className="w-5 h-5 text-blue-500" /> Inspection Mode</h2>
                        <p className="text-zinc-400 text-sm mt-1 font-mono">{user.email} <span className="text-zinc-600">|</span> ID: {user.user_id.slice(0, 8)}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-zinc-800"><X className="w-6 h-6 text-zinc-400" /></Button>
                </div>

                {/* Content Layout */}
                <div className="flex-1 overflow-hidden flex flex-col md:flex-row">

                    {/* Left Sidebar */}
                    <div className="w-full md:w-64 bg-zinc-900/30 border-r border-zinc-800 p-4 space-y-6 overflow-y-auto shrink-0">
                        <div className="space-y-3">
                            <div className="bg-black/40 p-3 rounded-lg border border-zinc-800">
                                <p className="text-[10px] text-zinc-500 uppercase font-bold">Status</p>
                                <p className={cn("text-lg font-bold capitalize", user.status === 'frozen' ? 'text-orange-500' : 'text-green-500')}>{user.status}</p>
                            </div>
                            <div className="bg-black/40 p-3 rounded-lg border border-zinc-800">
                                <p className="text-[10px] text-zinc-500 uppercase font-bold">Tab Switches</p>
                                <p className="text-lg font-bold text-red-500">{user.tab_switches}</p>
                            </div>
                            <div className="bg-black/40 p-3 rounded-lg border border-zinc-800">
                                <p className="text-[10px] text-zinc-500 uppercase font-bold">Current Round</p>
                                <p className="text-lg font-bold text-blue-400 capitalize">{user.current_round_slug}</p>
                            </div>
                        </div>
                    </div>

                    {/* Main View Area */}
                    <div className="flex-1 overflow-y-auto p-6 bg-black/20 custom-scrollbar">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-full text-zinc-500"><RefreshCw className="w-10 h-10 animate-spin mb-4" /><p>Retrieving classified logs...</p></div>
                        ) : (
                            <Tabs defaultValue="coding" className="w-full h-full flex flex-col">
                                <TabsList className="bg-zinc-900 border border-zinc-800 w-fit mb-6">
                                    <TabsTrigger value="coding" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"><Code className="w-4 h-4 mr-2" /> Coding</TabsTrigger>
                                    <TabsTrigger value="flowchart" className="data-[state=active]:bg-yellow-600 data-[state=active]:text-black"><Workflow className="w-4 h-4 mr-2" /> Flowchart</TabsTrigger>
                                    <TabsTrigger value="mcq" className="data-[state=active]:bg-green-600 data-[state=active]:text-white"><ListChecks className="w-4 h-4 mr-2" /> MCQ</TabsTrigger>
                                </TabsList>

                                {/* CODING TAB */}
                                <TabsContent value="coding" className="space-y-6 flex-1">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800">
                                            <div className="text-zinc-500 text-xs uppercase font-bold tracking-wider mb-1">Coding Status</div>
                                            <div className={cn("text-lg font-bold capitalize", data?.coding?.status === 'completed' ? "text-green-400" : "text-yellow-500")}>
                                                {data?.coding?.status || "Not Started"}
                                            </div>
                                        </div>
                                        <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800">
                                            <div className="text-zinc-500 text-xs uppercase font-bold tracking-wider mb-1">Total Score</div>
                                            <div className="text-2xl font-mono font-bold text-white">
                                                {data?.coding?.problem_set
                                                    ? (data.coding.problem_set.reduce((acc: number, curr: any) => acc + (parseFloat(curr.runResult?.score) || 0), 0) / 2)
                                                    : (data?.coding?.total_score || 0)
                                                }
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        {data?.coding?.problem_set && Array.isArray(data.coding.problem_set) && data.coding.problem_set.length > 0 ? (
                                            data.coding.problem_set.map((prob: any, idx: number) => (
                                                <div key={idx} className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950">
                                                    <div className="bg-zinc-900/50 px-4 py-3 border-b border-zinc-800 flex justify-between items-center">
                                                        <span className="font-bold text-zinc-200">Problem {idx + 1}</span>
                                                        <div className="flex gap-2">
                                                            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded uppercase border border-indigo-500/30">{prob.language || 'N/A'}</span>
                                                            <span className={cn("text-[10px] px-2 py-1 rounded uppercase font-bold border", prob.runResult?.status === 'Accepted' ? "bg-green-500/10 text-green-400 border-green-500/30" : "bg-red-500/10 text-red-400 border-red-500/30")}>{prob.runResult?.status || 'Not Evaluated'}</span>
                                                        </div>
                                                    </div>
                                                    <div className="h-[300px] relative group">
                                                        <Editor height="100%" defaultLanguage="javascript" language={prob.language === 'c' || prob.language === 'cpp' ? 'cpp' : prob.language || 'javascript'} value={prob.code || "// No code submitted"} theme="vs-dark" options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13, scrollBeyondLastLine: false, domReadOnly: true }} />
                                                    </div>
                                                    <div className="bg-black p-4 border-t border-zinc-800 font-mono text-xs">
                                                        <div className="text-zinc-500 mb-1 uppercase tracking-wider">Execution Log:</div>
                                                        <div className="text-zinc-300 whitespace-pre-wrap">{prob.runResult?.output || "No output logs."}</div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center p-10 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/20 text-zinc-500">No Submission Data</div>
                                        )}
                                    </div>
                                </TabsContent>

                                {/* FLOWCHART TAB */}
                                <TabsContent value="flowchart" className="flex-1 space-y-4">
                                    <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6 flex flex-col md:flex-row gap-6">
                                        <div className="flex-1 bg-black/40 p-4 rounded-lg border border-zinc-800"><p className="text-xs text-zinc-500 uppercase font-bold mb-2">AI Score</p><div className="text-4xl font-bold text-blue-400">{data?.flowchart?.ai_score}<span className="text-lg text-zinc-600">/100</span></div></div>
                                        <div className="flex-[2] bg-black/40 p-4 rounded-lg border border-zinc-800"><p className="text-xs text-zinc-500 uppercase font-bold mb-2 flex items-center gap-2"><Cpu className="w-3 h-3" /> AI Feedback</p><p className="text-zinc-300 text-sm leading-relaxed">{data?.flowchart?.ai_feedback || "No feedback generated."}</p></div>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-xs text-zinc-500 uppercase font-bold flex items-center gap-2"><Maximize2 className="w-3 h-3" /> Visual Replica</p>
                                        <FlowchartViewer nodes={Array.isArray(data?.flowchart?.nodes) ? data.flowchart.nodes : []} edges={Array.isArray(data?.flowchart?.edges) ? data.flowchart.edges : []} />
                                    </div>
                                </TabsContent>

                                {/* MCQ TAB */}
                                <TabsContent value="mcq">
                                    <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
                                        <h3 className="text-lg font-bold text-white mb-4">MCQ Results</h3>
                                        <div className="text-4xl font-mono font-bold text-indigo-400">{data?.mcq?.score || 0} <span className="text-lg text-zinc-600">/ Total</span></div>
                                        <div className="mt-6 bg-black/40 p-4 rounded-lg border border-zinc-800 font-mono text-xs text-zinc-400 whitespace-pre-wrap max-h-[300px] overflow-auto">{JSON.stringify(data?.mcq?.answers, null, 2)}</div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- MAIN COMPONENT ---
export default function AdminPanel() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'monitor' | 'controls' | 'questions' | 'leaderboard' | 'settings'>('monitor');
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [questions, setQuestions] = useState<any[]>([]);
    const [flowchartProblems, setFlowchartProblems] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const [config, setConfig] = useState({ mcq: '15', flowchart: '30', coding: '45' });

    // Inspection State (For Monitor Tab)
    const [selectedUser, setSelectedUser] = useState<Participant | null>(null);
    const [inspectionData, setInspectionData] = useState<InspectionData | null>(null);
    const [loadingInspection, setLoadingInspection] = useState(false);

    const [questionsTab, setQuestionsTab] = useState<'mcq' | 'flowchart' | 'coding'>('mcq');

    const [newQ, setNewQ] = useState<any>({
        round_id: 'mcq',
        title: '',
        description: '',
        optionA: '', optionB: '', optionC: '', optionD: '',
        correct: '',
        difficulty: 'easy',
        code_snippet: '',
        example1_input: '', example1_output: '', example1_explanation: '',
        example2_input: '', example2_output: '', example2_explanation: '',
        constraint1: '', constraint2: '', constraint3: ''
    });

    const [newFlowchart, setNewFlowchart] = useState({
        title: '', description: '', req1: '', req2: '', req3: '', req4: ''
    });

    // Dynamic Counts
    const waitingCount = participants.filter(p => p.current_round_slug === 'waiting').length;
    const rulesCount = participants.filter(p => p.current_round_slug === 'rules').length;
    const mcqCount = participants.filter(p => p.current_round_slug === 'mcq').length;
    const waitingR2Count = participants.filter(p => p.current_round_slug === 'waiting_r2').length;
    const flowchartCount = participants.filter(p => p.current_round_slug === 'flowchart').length;
    const waitingR3Count = participants.filter(p => p.current_round_slug === 'waiting_r3').length;
    const codingCount = participants.filter(p => p.current_round_slug === 'coding').length;

    const fetchData = async () => {
        if (participants.length === 0) setLoading(true);

        try {
            // Fetch Users
            const { data: users } = await supabase.from('exam_sessions').select('*').order('tab_switches', { ascending: false });
            if (users) {
                const studentsOnly = users.filter(user => !ADMIN_EMAILS.includes(user.email));
                setParticipants(studentsOnly);
            }

            // Fetch Questions
            const { data: qData } = await supabase.from('questions').select('*').order('created_at', { ascending: false });
            if (qData) setQuestions(qData);

            const { data: fData } = await supabase.from('flowchart_problems').select('*').order('created_at', { ascending: false });
            if (fData) setFlowchartProblems(fData);

            const { data: cData } = await supabase.from('game_config').select('*');
            if (cData) {
                const newConfig = { ...config };
                cData.forEach((c: any) => {
                    if (c.key === 'mcq_duration') newConfig.mcq = c.value;
                    if (c.key === 'flowchart_duration') newConfig.flowchart = c.value;
                    if (c.key === 'coding_duration') newConfig.coding = c.value;
                });
                setConfig(newConfig);
            }

        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const channel = supabase.channel('admin-dashboard')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'exam_sessions' }, () => fetchData())
            .subscribe();
        return () => { supabase.removeChannel(channel); };
    }, []);

    const formatTime = (isoString: string | null | undefined) => {
        if (!isoString) return <span className="text-zinc-600">--:--:--</span>;
        try {
            const date = new Date(isoString);
            if (isNaN(date.getTime())) return <span className="text-red-900">Invalid</span>;
            return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
        } catch (e) { return <span className="text-zinc-600">--:--:--</span>; }
    };

    const handleLogout = async () => { await supabase.auth.signOut(); navigate('/login'); };

    const handleUserAction = async (action: 'freeze' | 'unfreeze' | 'dq', userId: string) => {
        const targetStatus = action === 'freeze' ? 'frozen' : action === 'unfreeze' ? 'active' : 'disqualified';
        setParticipants(prev => prev.map(p => p.user_id === userId ? { ...p, status: targetStatus } : p));
        const { error } = await supabase.from('exam_sessions').update({ status: targetStatus }).eq('user_id', userId);
        if (error) { toast.error("Action failed"); fetchData(); }
        else { toast.success(`User status updated to: ${targetStatus}`); }
    };

    const moveUserToRound = async (userId: string, round: 'mcq' | 'flowchart' | 'coding' | 'rules') => {
        if (!confirm(`⚠️ FORCE MOVE: Send user to ${round.toUpperCase()}?`)) return;
        setParticipants(prev => prev.map(p => p.user_id === userId ? { ...p, current_round_slug: round } : p));
        const { error } = await supabase.from('exam_sessions').update({ current_round_slug: round }).eq('user_id', userId);
        if (error) { toast.error("Move failed"); fetchData(); }
        else { toast.success(`Moved to ${round.toUpperCase()}`); }
    };

    const saveSettings = async () => {
        setLoading(true);
        const updates = [
            { key: 'mcq_duration', value: config.mcq },
            { key: 'flowchart_duration', value: config.flowchart },
            { key: 'coding_duration', value: config.coding }
        ];
        const { error } = await supabase.from('game_config').upsert(updates, { onConflict: 'key' });
        setLoading(false);
        if (error) toast.error("Failed to save settings");
        else toast.success("Game Settings Updated!");
    };

    const activateFlowchartProblem = async (id: string) => {
        await supabase.from('flowchart_problems').update({ is_active: false }).neq('id', id);
        await supabase.from('flowchart_problems').update({ is_active: true }).eq('id', id);
        toast.success("Problem Activated!");
        setFlowchartProblems(prev => prev.map(fp => ({ ...fp, is_active: fp.id === id })));
    };

    const inspectUser = async (user: Participant) => {
        setSelectedUser(user);
        setLoadingInspection(true);
        setInspectionData(null);

        try {
            const [codingRes, flowchartRes, mcqRes] = await Promise.all([
                supabase.from('coding_submissions').select('*').eq('user_id', user.user_id).maybeSingle(),
                supabase.from('flowchart_submissions').select('*').eq('user_id', user.user_id).maybeSingle(),
                supabase.from('mcq_submissions').select('*').eq('user_id', user.user_id).maybeSingle()
            ]);

            setInspectionData({
                coding: codingRes.data,
                flowchart: flowchartRes.data,
                mcq: mcqRes.data
            });
        } catch (e) {
            console.error("Inspection Error:", e);
            toast.error("Failed to load user data");
        } finally {
            setLoadingInspection(false);
        }
    };

    const closeInspection = () => { setSelectedUser(null); setInspectionData(null); };

    const consolidateSubmissions = async () => {
        if (!confirm("⚠️ SYNC FINAL SUBMISSIONS? This will aggregate data for users who finished all rounds into the 'submissions' table.")) return;
        setLoading(true);
        try {
            const { data: entries } = await supabase.from('leaderboard').select('*');
            if (!entries) throw new Error("No data");

            let count = 0;
            for (const entry of entries) {
                if (entry.round1_score !== null && entry.round2_score !== null && entry.round3_score !== null) {
                    await supabase.from('submissions').upsert({
                        user_id: entry.user_id,
                        total_score: entry.overall_score,
                        round1_score: entry.round1_score,
                        round2_score: entry.round2_score,
                        round3_score: entry.round3_score,
                        completed_at: new Date().toISOString()
                    }, { onConflict: 'user_id' });
                    count++;
                }
            }
            toast.success(`Synced ${count} records to Submissions Table.`);
        } catch (e) {
            console.error(e);
            toast.error("Sync failed.");
        } finally {
            setLoading(false);
        }
    };

    // --- ROUND CONTROLS (BULK) ---
    const startExam = async () => {
        if (!confirm("⚠️ START EXAM?")) return;
        const toastId = toast.loading("Starting Round 1...");
        setParticipants(prev => prev.map(p => (p.current_round_slug === 'waiting' || p.current_round_slug === 'rules') ? { ...p, current_round_slug: 'mcq', status: 'active' } : p));
        const { error } = await supabase.from('exam_sessions')
            .update({ current_round_slug: 'mcq', status: 'active' })
            .in('current_round_slug', ['waiting', 'rules'])
            .select();
        if (error) toast.error("Failed to start", { id: toastId }); else toast.success(`Round 1 Started!`, { id: toastId });
    };

    const startRound2 = async () => {
        if (!confirm("⚠️ START ROUND 2?")) return;
        const toastId = toast.loading("Starting Round 2...");
        setParticipants(prev => prev.map(p => p.current_round_slug === 'waiting_r2' ? { ...p, current_round_slug: 'flowchart', status: 'active' } : p));
        const { error } = await supabase.from('exam_sessions')
            .update({ current_round_slug: 'flowchart', status: 'active' })
            .eq('current_round_slug', 'waiting_r2')
            .select();
        if (error) toast.error("Failed to start", { id: toastId }); else toast.success(`Round 2 Started!`, { id: toastId });
    };

    const startRound3 = async () => {
        if (!confirm("⚠️ START ROUND 3?")) return;
        const toastId = toast.loading("Starting Round 3...");
        setParticipants(prev => prev.map(p => p.current_round_slug === 'waiting_r3' ? { ...p, current_round_slug: 'coding', status: 'active' } : p));
        const { error } = await supabase.from('exam_sessions')
            .update({ current_round_slug: 'coding', status: 'active' })
            .eq('current_round_slug', 'waiting_r3')
            .select();
        if (error) toast.error("Failed to start", { id: toastId }); else toast.success(`Round 3 Started!`, { id: toastId });
    };

    const resetAllToWaiting = async () => {
        if (!confirm("🛑 RESET ALL?")) return;
        setParticipants(prev => prev.map(p => ({ ...p, current_round_slug: 'waiting' })));
        await supabase.from('exam_sessions').update({ current_round_slug: 'waiting' }).neq('status', 'disqualified');
        toast.info("Reset Successful.");
    };

    const moveAllToRules = async () => {
        if (!confirm("⚠️ MOVE ALL TO RULES? Active/Waiting users will be redirected.")) return;
        const toastId = toast.loading("Redirecting to Rules...");
        setParticipants(prev => prev.map(p => p.status !== 'disqualified' ? { ...p, current_round_slug: 'rules' } : p));
        const { error } = await supabase.from('exam_sessions')
            .update({ current_round_slug: 'rules' })
            .neq('status', 'disqualified');
        if (error) toast.error("Action failed", { id: toastId });
        else toast.success("Everyone moved to Rules Page.", { id: toastId });
    };

    // --- QUESTION MANAGEMENT ---
    const handleAddQuestion = async () => {
        if (!newQ.title) return toast.error("Title required");
        const payload: any = { round_id: newQ.round_id, title: newQ.title, description: newQ.description, difficulty: newQ.difficulty };
        if (newQ.round_id === 'mcq') {
            payload.options = [newQ.optionA, newQ.optionB, newQ.optionC, newQ.optionD].filter((o: any) => o?.trim());
            payload.correct_answer = newQ.correct;
        } else if (newQ.round_id === 'coding') {
            payload.code_snippet = newQ.code_snippet;
            const examples = [];
            if (newQ.example1_input) examples.push({ input: newQ.example1_input, output: newQ.example1_output, explanation: newQ.example1_explanation });
            if (newQ.example2_input) examples.push({ input: newQ.example2_input, output: newQ.example2_output, explanation: newQ.example2_explanation });
            payload.examples = examples;
            payload.constraints = [newQ.constraint1, newQ.constraint2, newQ.constraint3].filter((c: any) => c?.trim());
        }
        const { error } = await supabase.from('questions').insert(payload);
        if (!error) {
            toast.success("Question Added");
            setNewQ({ round_id: 'mcq', title: '', description: '', optionA: '', optionB: '', optionC: '', optionD: '', correct: '', difficulty: 'easy', code_snippet: '', example1_input: '', example1_output: '', example1_explanation: '', example2_input: '', example2_output: '', example2_explanation: '', constraint1: '', constraint2: '', constraint3: '' });
        }
    };

    const handleAddFlowchart = async () => {
        if (!newFlowchart.title) return toast.error("Title required");
        const reqs = [newFlowchart.req1, newFlowchart.req2, newFlowchart.req3, newFlowchart.req4].filter((r: any) => r?.trim());
        if (reqs.length === 0) return toast.error("Add requirements");
        const { error } = await supabase.from('flowchart_problems').insert({ title: newFlowchart.title, description: newFlowchart.description, requirements: reqs, is_active: false });
        if (!error) {
            toast.success("Flowchart Added");
            setNewFlowchart({ title: '', description: '', req1: '', req2: '', req3: '', req4: '' });
        }
    };

    const deleteQuestion = async (id: string, table: 'questions' | 'flowchart_problems') => {
        if (confirm("Delete permanently?")) { await supabase.from(table).delete().eq('id', id); }
    };

    const filteredUsers = participants.filter(p => p.email?.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="min-h-screen bg-[#021516] text-[#e0e0e0] font-inter relative pb-20">
            <AnimatedBackground />

            <div className="relative z-10 container mx-auto px-4 py-8">

                {/* HEADER */}
                <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-[#0a1f20]/90 p-6 rounded-2xl border border-[#d4af37]/30 backdrop-blur-md shadow-[0_0_40px_rgba(0,128,128,0.15)]">
                    <div>
                        <h1 className="text-3xl font-wizard font-bold text-[#d4af37] tracking-wider flex items-center gap-3 drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]">
                            <Shield className="w-8 h-8" /> OVERSEER GRIMOIRE
                        </h1>
                        <p className="text-[#008080] font-manrope text-sm mt-1">Technetics 26 • Council Terminal</p>
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <div className="flex gap-2 bg-[#021516]/80 p-1.5 rounded-xl border border-[#008080]/30 font-manrope">
                            {['monitor', 'controls', 'questions', 'leaderboard', 'settings'].map((tab) => (
                                <button key={tab} onClick={() => setActiveTab(tab as any)} className={cn("px-4 py-2 rounded-lg text-sm font-bold transition-all capitalize tracking-wide", activeTab === tab ? "bg-[#008080] text-[#021516] shadow-[0_0_10px_rgba(0,128,128,0.5)]" : "text-[#00ffff]/60 hover:text-[#d4af37] hover:bg-[#04282a]")}>
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <Button onClick={handleLogout} variant="ghost" className="text-red-500 hover:bg-red-950/30"><LogOut className="w-4 h-4 mr-2" /> Server Link Sever</Button>
                    </div>
                </header>

                {/* ======================= MONITOR TAB ======================= */}
                {activeTab === 'monitor' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {/* Stats & Search */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {[{ label: 'Active', count: participants.filter(p => p.status === 'active').length, color: 'text-[#00ffff]' },
                            { label: 'Frozen', count: participants.filter(p => p.status === 'frozen').length, color: 'text-[#d4af37]' },
                            { label: 'Waiting (R1)', count: waitingCount, color: 'text-blue-500' },
                            { label: 'Waiting (R2)', count: waitingR2Count, color: 'text-blue-400' },
                            { label: 'Waiting (R3)', count: waitingR3Count, color: 'text-blue-300' },
                            { label: 'Expelled', count: participants.filter(p => p.status === 'disqualified').length, color: 'text-red-600' }
                            ].map((stat, i) => (
                                <div key={i} className="bg-[#0a1f20]/90 border border-[#008080]/30 p-4 rounded-xl">
                                    <div className="text-[#008080] text-[10px] font-bold uppercase tracking-wider mb-1">{stat.label}</div>
                                    <div className={`text-3xl font-wizard tracking-wider ${stat.color} drop-shadow-[0_0_5px_currentColor]`}>{stat.count}</div>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#008080] w-4 h-4" />
                                <Input className="pl-10 bg-[#0a1f20]/90 border-[#008080]/30 text-white focus:border-[#d4af37]" placeholder="Scry for Wizard..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                            </div>
                            <Button onClick={fetchData} variant="outline" className="border-[#008080]/50 bg-[#021516] hover:bg-[#04282a] text-[#d4af37]"><RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} /> Align Stars</Button>
                        </div>

                        {/* Monitor Table */}
                        <div className="bg-[#0a1f20]/80 border border-[#008080]/30 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(0,128,128,0.1)]">
                            <table className="w-full text-left text-sm text-[#008080]">
                                <thead className="bg-[#021516]/80 uppercase text-[11px] font-bold text-[#d4af37] border-b border-[#008080]/30 tracking-wider">
                                    <tr>
                                        <th className="p-4 pl-6">Wizard Candidate</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4">Trial</th>
                                        <th className="p-4">Activity Log</th>
                                        <th className="p-4 text-center text-red-500">Spell Interruption (Tabs)</th>
                                        <th className="p-4 text-right pr-6">Overseer Controls</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#008080]/20">
                                    {filteredUsers.map((p) => (
                                        <tr key={p.user_id} className="hover:bg-white/5 transition-colors group">
                                            <td className="p-4 pl-6 font-medium text-white">{p.email}<div className="text-[10px] text-[#008080] font-mono">ID: {p.user_id.slice(0, 8)}</div></td>
                                            <td className="p-4"><span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase border", p.status === 'active' ? "border-[#008080] bg-[#008080]/20 text-[#00ffff]" : p.status === 'frozen' ? "border-[#d4af37]/80 bg-[#d4af37]/20 text-[#d4af37] animate-pulse" : "border-red-800 bg-red-900/20 text-red-500")}>{p.status}</span></td>
                                            <td className="p-4 capitalize font-mono text-[#00ffff]">{p.current_round_slug}</td>
                                            <td className="p-4 text-xs font-mono">
                                                <div className="flex items-center gap-2 text-[#008080]"><Play className="w-3 h-3 text-[#d4af37]" /> Start: {formatTime(p.created_at)}</div>
                                                <div className="flex items-center gap-2 text-[#008080] mt-1"><Activity className="w-3 h-3 text-[#00ffff]" /> Last: {formatTime(p.updated_at)}</div>
                                            </td>
                                            <td className="p-4 text-center"><span className={cn("font-mono text-lg font-bold", p.tab_switches > 0 ? "text-red-500" : "text-[#008080]")}>{p.tab_switches}</span></td>
                                            <td className="p-4 pr-6 flex justify-end items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                                <div className="flex bg-[#021516] rounded-lg p-1 border border-[#008080]/30 mr-2">
                                                    <Button size="icon" variant="ghost" onClick={() => moveUserToRound(p.user_id, 'mcq')} className={cn("h-7 w-7", p.current_round_slug === 'mcq' ? "bg-green-600/20 text-green-400" : "text-[#008080] hover:text-green-400")} title="Move to MCQ"><ListChecks className="w-4 h-4" /></Button>
                                                    <Button size="icon" variant="ghost" onClick={() => moveUserToRound(p.user_id, 'flowchart')} className={cn("h-7 w-7", p.current_round_slug === 'flowchart' ? "bg-yellow-600/20 text-yellow-400" : "text-[#008080] hover:text-yellow-400")} title="Move to Flowchart"><Workflow className="w-4 h-4" /></Button>
                                                    <Button size="icon" variant="ghost" onClick={() => moveUserToRound(p.user_id, 'coding')} className={cn("h-7 w-7", p.current_round_slug === 'coding' ? "bg-purple-600/20 text-purple-400" : "text-[#008080] hover:text-purple-400")} title="Move to Coding"><Code className="w-4 h-4" /></Button>
                                                </div>

                                                {/* RESTORED: VIEW / INSPECT BUTTON */}
                                                <Button size="sm" variant="ghost" onClick={() => inspectUser(p)} className="h-8 w-8 p-0 text-[#00ffff] hover:text-white" title="Inspect">
                                                    <Eye className="w-4 h-4" />
                                                </Button>

                                                {p.status === 'frozen' ? (
                                                    <Button size="sm" onClick={() => handleUserAction('unfreeze', p.user_id)} className="bg-green-700/50 hover:bg-green-600 text-white h-8 text-xs font-bold border border-green-500">Resume</Button>
                                                ) : (
                                                    <Button size="sm" variant="outline" onClick={() => handleUserAction('freeze', p.user_id)} className="border-orange-600/50 text-[#d4af37] hover:bg-[#d4af37]/20 h-8 text-xs">Freeze</Button>
                                                )}
                                                <Button size="sm" variant="destructive" onClick={() => handleUserAction('dq', p.user_id)} className="h-8 w-8 p-0" title="Ban"><Ban className="w-3 h-3" /></Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ======================= SETTINGS TAB ======================= */}
                {activeTab === 'settings' && (
                    <div className="max-w-xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="bg-[#0a1f20]/90 border border-[#008080]/50 p-8 rounded-2xl shadow-[0_0_30px_rgba(0,128,128,0.2)]">
                            <h2 className="text-2xl font-wizard text-[#d4af37] mb-6 flex items-center gap-2"><Settings className="w-6 h-6 text-[#00ffff]" /> Realm Mechanics</h2>
                            <div className="space-y-4">
                                <div><label className="text-sm font-bold text-[#008080] mb-1 block uppercase tracking-wider">Incantation Trial (Minutes)</label><Input value={config.mcq} onChange={e => setConfig({ ...config, mcq: e.target.value })} className="bg-[#021516]/50 border-[#008080]/30" type="number" /></div>
                                <div><label className="text-sm font-bold text-[#008080] mb-1 block uppercase tracking-wider">Logic Array Trial (Minutes)</label><Input value={config.flowchart} onChange={e => setConfig({ ...config, flowchart: e.target.value })} className="bg-[#021516]/50 border-[#008080]/30" type="number" /></div>
                                <div><label className="text-sm font-bold text-[#008080] mb-1 block uppercase tracking-wider">Master Spellcraft (Minutes)</label><Input value={config.coding} onChange={e => setConfig({ ...config, coding: e.target.value })} className="bg-[#021516]/50 border-[#008080]/30" type="number" /></div>
                            </div>
                            <Button onClick={saveSettings} disabled={loading} className="w-full mt-8 bg-gradient-to-r from-[#d4af37] to-[#aa8c2c] hover:from-[#aa8c2c] hover:to-[#8b7324] text-[#021516] font-bold h-12 uppercase tracking-widest"><Save className="w-4 h-4 mr-2" /> Inscribe Configurations</Button>
                        </div>
                    </div>
                )}

                {/* ======================= CONTROLS TAB ======================= */}
                {activeTab === 'controls' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 font-inter">
                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Round Start Buttons */}
                            <div className="bg-[#0a1f20]/80 border border-[#008080]/30 p-6 rounded-2xl relative overflow-hidden group hover:border-[#00ffff]/50 transition-colors shadow-[0_0_15px_rgba(0,255,255,0.05)]">
                                <h3 className="text-lg font-bold text-[#00ffff] mb-2 flex items-center gap-2"><Play className="w-5 h-5 text-[#d4af37]" /> Ignite Trial 1</h3>
                                <p className="text-[#008080] mb-2 text-xs font-mono">Antechamber → Incantations</p>
                                <div className="flex items-center gap-4 mb-4 text-xs">
                                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500"></div><span className="text-[#008080] font-bold">Waiting:</span><span className="font-bold text-white">{waitingCount}</span></div>
                                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-purple-500"></div><span className="text-[#008080] font-bold">Oaths:</span><span className="font-bold text-white">{rulesCount}</span></div>
                                </div>
                                <Button onClick={startExam} disabled={loading} className="w-full bg-[#021516] hover:bg-[#00ffff]/10 border border-[#00ffff]/50 text-[#00ffff] font-bold h-10 text-xs tracking-widest uppercase">{loading ? "Channeling..." : "COMMENCE TRIAL 1"}</Button>
                            </div>

                            <div className="bg-[#0a1f20]/80 border border-[#d4af37]/30 p-6 rounded-2xl relative overflow-hidden group hover:border-[#d4af37]/80 transition-colors shadow-[0_0_15px_rgba(212,175,55,0.05)]">
                                <h3 className="text-lg font-bold text-[#d4af37] mb-2 flex items-center gap-2"><Workflow className="w-5 h-5 text-[#00ffff]" /> Ignite Trial 2</h3>
                                <p className="text-[#008080] mb-2 text-xs font-mono">Antechamber 2 → Logic Array</p>
                                <div className="flex items-center gap-4 mb-4 text-xs">
                                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#d4af37]"></div><span className="text-[#008080] font-bold">Wait T2:</span><span className="font-bold text-white">{waitingR2Count}</span></div>
                                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-yellow-500"></div><span className="text-[#008080] font-bold">Lines:</span><span className="font-bold text-white">{flowchartCount}</span></div>
                                </div>
                                <Button onClick={startRound2} disabled={loading} className="w-full bg-[#d4af37]/10 hover:bg-[#d4af37]/20 border border-[#d4af37] text-[#d4af37] font-bold h-10 text-xs tracking-widest uppercase">{loading ? "Channeling..." : "COMMENCE TRIAL 2"}</Button>
                            </div>

                            <div className="bg-[#0a1f20]/80 border border-purple-900/40 p-6 rounded-2xl relative overflow-hidden group hover:border-purple-500/60 transition-colors shadow-[0_0_15px_rgba(168,85,247,0.05)]">
                                <h3 className="text-lg font-bold text-purple-400 mb-2 flex items-center gap-2"><Code className="w-5 h-5 text-purple-300" /> Ignite Final Trial</h3>
                                <p className="text-[#008080] mb-2 text-xs font-mono">Antechamber 3 → Master Spellcraft</p>
                                <div className="flex items-center gap-4 mb-4 text-xs">
                                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-300"></div><span className="text-[#008080] font-bold">Wait T3:</span><span className="font-bold text-white">{waitingR3Count}</span></div>
                                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-purple-500"></div><span className="text-[#008080] font-bold">Craft:</span><span className="font-bold text-white">{codingCount}</span></div>
                                </div>
                                <Button onClick={startRound3} disabled={loading} className="w-full bg-purple-900/30 hover:bg-purple-900/50 border border-purple-500/50 text-purple-300 font-bold h-10 text-xs tracking-widest uppercase">{loading ? "Channeling..." : "COMMENCE FINAL TRIAL"}</Button>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6 pt-4 border-t border-[#008080]/20">
                            <div className="bg-[#021516]/80 border border-[#008080]/30 p-8 rounded-2xl relative overflow-hidden group hover:border-[#00ffff]/50 transition-colors">
                                <h3 className="text-xl font-wizard text-[#00ffff] mb-2 flex items-center gap-2"><BookOpen className="w-5 h-5" /> Retract to Oaths</h3>
                                <p className="text-[#008080] mb-6 text-sm font-manrope">Forces all active conjurers to the <strong>Oaths & Rules</strong> scroll.</p>
                                <Button onClick={moveAllToRules} disabled={loading} className="w-full h-12 bg-[#021516] hover:bg-[#00ffff]/10 border border-[#00ffff]/40 text-[#00ffff] font-bold tracking-widest uppercase text-xs">{loading ? "Shifting..." : "ENFORCE OATHS"}</Button>
                            </div>

                            <div className="bg-[#021516]/80 border border-[#d4af37]/30 p-8 rounded-2xl relative overflow-hidden group hover:border-[#d4af37]/60 transition-colors">
                                <h3 className="text-xl font-wizard text-[#d4af37] mb-2 flex items-center gap-2"><Database className="w-5 h-5" /> Seal The Grimoire</h3>
                                <p className="text-[#008080] mb-6 text-sm font-manrope">Synthesizes final magics into the <strong>Grand Ledger (Submissions Table)</strong>.</p>
                                <Button onClick={consolidateSubmissions} disabled={loading} className="w-full h-12 bg-[#021516] hover:bg-[#d4af37]/10 border border-[#d4af37]/40 text-[#d4af37] font-bold tracking-widest uppercase text-xs">{loading ? "Sealing..." : "SEAL FINAL LEDGER"}</Button>
                            </div>

                            <div className="bg-[#0a1f20]/90 border border-red-900/40 p-8 rounded-2xl relative overflow-hidden group hover:border-red-600/60 transition-colors">
                                <h3 className="text-xl font-wizard text-red-500 mb-2 flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> Cataclysm Reset</h3>
                                <p className="text-[#008080] mb-6 text-sm font-manrope">Banishes all conjurers back to the <strong>Primary Antechamber</strong>.</p>
                                <Button onClick={resetAllToWaiting} disabled={loading} className="w-full h-12 bg-red-950/40 hover:bg-red-900/60 border border-red-800 text-red-500 font-bold tracking-widest uppercase text-xs">{loading ? "Banishing..." : "RESET TO ANTECHAMBER"}</Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ======================= QUESTIONS TAB ======================= */}
                {activeTab === 'questions' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="flex gap-2 border-b border-zinc-800 pb-2">
                            <Button onClick={() => setQuestionsTab('mcq')} variant="ghost" className={cn("rounded-none border-b-2 transition-all", questionsTab === 'mcq' ? "border-blue-500 text-blue-400" : "border-transparent text-zinc-500 hover:text-zinc-300")}><CheckCircle2 className="w-4 h-4 mr-2" /> MCQ Round</Button>
                            <Button onClick={() => setQuestionsTab('flowchart')} variant="ghost" className={cn("rounded-none border-b-2 transition-all", questionsTab === 'flowchart' ? "border-yellow-500 text-yellow-500" : "border-transparent text-zinc-500 hover:text-zinc-300")}><Workflow className="w-4 h-4 mr-2" /> Flowchart Round</Button>
                            <Button onClick={() => setQuestionsTab('coding')} variant="ghost" className={cn("rounded-none border-b-2 transition-all", questionsTab === 'coding' ? "border-purple-500 text-purple-400" : "border-transparent text-zinc-500 hover:text-zinc-300")}><Code className="w-4 h-4 mr-2" /> Coding Round</Button>
                        </div>

                        {questionsTab === 'mcq' && (
                            <div className="grid md:grid-cols-[400px,1fr] gap-6">
                                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl h-fit">
                                    <h3 className="font-bold text-white mb-4 flex items-center gap-2 text-lg"><Plus className="w-5 h-5 text-blue-500" /> Add MCQ Question</h3>
                                    <div className="space-y-4">
                                        <Input placeholder="Title" className="bg-black border-zinc-700" value={newQ.title} onChange={e => setNewQ({ ...newQ, title: e.target.value, round_id: 'mcq' })} />
                                        <Textarea placeholder="Description" className="bg-black border-zinc-700 min-h-[80px]" value={newQ.description} onChange={e => setNewQ({ ...newQ, description: e.target.value })} />
                                        <div className="space-y-2 bg-zinc-950 p-3 rounded border border-zinc-800">
                                            {['A', 'B', 'C', 'D'].map(opt => (<Input key={opt} placeholder={`Option ${opt}`} className="h-8 bg-zinc-900 border-zinc-700" value={(newQ as any)[`option${opt}`]} onChange={e => setNewQ({ ...newQ, [`option${opt}`]: e.target.value })} />))}
                                            <Input placeholder="Correct Answer" className="h-8 bg-green-900/20 border-green-900 text-green-400" value={newQ.correct} onChange={e => setNewQ({ ...newQ, correct: e.target.value })} />
                                        </div>
                                        <Button onClick={handleAddQuestion} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold">Save MCQ</Button>
                                    </div>
                                </div>
                                <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl h-fit">
                                    <div className="space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar">
                                        {questions.filter(q => q.round_id === 'mcq').map(q => (
                                            <div key={q.id} className="bg-zinc-900/50 border border-zinc-800 p-3 rounded-lg flex justify-between items-center group hover:border-blue-500/30 transition-colors">
                                                <div><span className="text-sm font-bold text-zinc-300">{q.title}</span><p className="text-xs text-zinc-500 mt-0.5">{q.description.substring(0, 50)}...</p></div>
                                                <Button size="icon" variant="ghost" onClick={() => deleteQuestion(q.id, 'questions')}><Trash2 className="w-4 h-4 text-zinc-600 group-hover:text-red-500 transition-colors" /></Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {questionsTab === 'flowchart' && (
                            <div className="grid md:grid-cols-[400px,1fr] gap-6">
                                <div className="bg-zinc-900 border border-yellow-900/30 p-6 rounded-2xl shadow-xl h-fit">
                                    <h3 className="font-bold text-yellow-500 mb-4 flex items-center gap-2 text-lg"><Plus className="w-5 h-5" /> Add Flowchart Problem</h3>
                                    <div className="space-y-3">
                                        <Input placeholder="Problem Title" className="bg-zinc-900 border-zinc-700 text-sm" value={newFlowchart.title} onChange={e => setNewFlowchart({ ...newFlowchart, title: e.target.value })} />
                                        <Textarea placeholder="Problem Description" className="bg-zinc-900 border-zinc-700 text-sm min-h-[60px]" value={newFlowchart.description} onChange={e => setNewFlowchart({ ...newFlowchart, description: e.target.value })} />
                                        <div className="space-y-2">
                                            <p className="text-xs text-zinc-500">Requirements</p>
                                            {[1, 2, 3, 4].map(i => <Input key={i} placeholder={`Req ${i}`} className="h-8 bg-zinc-900 border-zinc-700 text-xs" value={(newFlowchart as any)[`req${i}`]} onChange={e => setNewFlowchart({ ...newFlowchart, [`req${i}`]: e.target.value })} />)}
                                        </div>
                                        <Button onClick={handleAddFlowchart} className="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-bold h-9">Add Flowchart Problem</Button>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    {flowchartProblems.map(fp => (
                                        <div key={fp.id} className={cn("p-4 rounded-xl border transition-all relative", fp.is_active ? "bg-yellow-900/20 border-yellow-500" : "bg-zinc-950 border-zinc-800")}>
                                            <div className="flex justify-between items-start gap-3">
                                                <div className="flex-1"><h4 className={cn("font-bold text-sm mb-1", fp.is_active ? "text-white" : "text-zinc-400")}>{fp.title}</h4><p className="text-xs text-zinc-500 mb-2">{fp.description}</p></div>
                                                <div className="flex gap-2 items-center">
                                                    {fp.is_active ? <span className="flex items-center gap-1 text-[10px] font-bold bg-yellow-500 text-black px-2 py-1 rounded"><CheckCircle2 className="w-3 h-3" /> ACTIVE</span> : <Button size="sm" onClick={() => activateFlowchartProblem(fp.id)} variant="outline" className="h-7 text-xs border-zinc-700">Activate</Button>}
                                                    <Button size="icon" variant="ghost" onClick={() => deleteQuestion(fp.id, 'flowchart_problems')} className="h-7 w-7"><Trash2 className="w-3.5 h-3.5 text-zinc-600 hover:text-red-500" /></Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {questionsTab === 'coding' && (
                            <div className="grid md:grid-cols-[400px,1fr] gap-6">
                                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl h-fit">
                                    <h3 className="font-bold text-white mb-4 flex items-center gap-2 text-lg"><Plus className="w-5 h-5 text-purple-500" /> Add Coding Question</h3>
                                    <div className="space-y-4">
                                        <Input placeholder="Title" className="bg-black border-zinc-700" value={newQ.title} onChange={e => setNewQ({ ...newQ, title: e.target.value, round_id: 'coding' })} />
                                        <Textarea placeholder="Description" className="bg-black border-zinc-700 min-h-[80px]" value={newQ.description} onChange={e => setNewQ({ ...newQ, description: e.target.value })} />
                                        <Button onClick={handleAddQuestion} className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold">Save Coding Problem</Button>
                                    </div>
                                </div>
                                <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl h-fit">
                                    <div className="space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar">
                                        {questions.filter(q => q.round_id === 'coding').map(q => (
                                            <div key={q.id} className="bg-zinc-900/50 border border-zinc-800 p-3 rounded-lg flex justify-between items-center group hover:border-purple-500/30 transition-colors">
                                                <div><span className="text-sm font-bold text-zinc-300">{q.title}</span><p className="text-xs text-zinc-500 mt-0.5">{q.description.substring(0, 50)}...</p></div>
                                                <Button size="icon" variant="ghost" onClick={() => deleteQuestion(q.id, 'questions')}><Trash2 className="w-4 h-4 text-zinc-600 group-hover:text-red-500 transition-colors" /></Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ======================= LEADERBOARD TAB (UPDATED) ======================= */}
                {activeTab === 'leaderboard' && (
                    <LeaderboardTab />
                )}

                {/* --- MONITOR TAB INSPECTION MODAL --- */}
                {selectedUser && (
                    <InspectionModal
                        user={selectedUser}
                        loading={loadingInspection}
                        data={inspectionData}
                        onClose={closeInspection}
                    />
                )}

            </div>
        </div>
    );
}