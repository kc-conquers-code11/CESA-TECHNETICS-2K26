import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Dialog, DialogContent } from '../ui/dialog';
import Editor from "@monaco-editor/react";
import { Loader2, X, Cpu, AlertTriangle, Eye, Trophy, RefreshCw, Clock, FastForward, Workflow, Code, ListChecks, Maximize2, Timer } from 'lucide-react';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';
import ReactFlow, { Background, Controls, ReactFlowProvider, Handle, Position } from 'reactflow';
import 'reactflow/dist/style.css';

// --- FLOWCHART NODE COMPONENTS (Visualizer) ---
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

// --- FLOWCHART VIEWER WRAPPER ---
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

// --- HELPERS ---
const formatTime = (isoString: string) => {
    if (!isoString) return "--:--";
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDuration = (seconds: any) => {
    if (!seconds || isNaN(seconds)) return "0s";
    const sec = parseInt(seconds);
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;

    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
};

// --- MAIN LEADERBOARD COMPONENT ---
export const Leaderboard = () => {
    const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Inspection State
    const [inspectorOpen, setInspectorOpen] = useState(false);
    const [inspectedUser, setInspectedUser] = useState<any>(null);
    const [inspectionLoading, setInspectionLoading] = useState(false);

    // --- 1. FETCH DATA ---
    const fetchData = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('leaderboard')
                .select('*')
                .order('overall_score', { ascending: false });

            if (error) throw error;
            setLeaderboardData(data || []);
        } catch (error: any) {
            toast.error("Failed to load leaderboard");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const channel = supabase.channel('lb_updates')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'leaderboard' }, () => fetchData())
            .subscribe();
        return () => { supabase.removeChannel(channel); };
    }, []);

    // --- 2. INSPECT USER ---
    const inspectUser = async (userId: string) => {
        setInspectorOpen(true);
        setInspectionLoading(true);

        try {
            const [codingRes, flowchartRes, mcqRes, profileRes] = await Promise.all([
                supabase.from('coding_submissions').select('*').eq('user_id', userId).maybeSingle(),
                supabase.from('flowchart_submissions').select('*').eq('user_id', userId).maybeSingle(),
                supabase.from('mcq_submissions').select('*').eq('user_id', userId).maybeSingle(),
                supabase.from('profiles').select('*').eq('id', userId).single()
            ]);

            setInspectedUser({
                profile: profileRes.data,
                coding: codingRes.data,
                flowchart: flowchartRes.data,
                mcq: mcqRes.data
            });
        } catch (e) {
            console.error("Inspection Error:", e);
            toast.error("Failed to load user data");
        } finally {
            setInspectionLoading(false);
        }
    };

    return (
        <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-wizard font-bold text-[#d4af37] flex items-center gap-3 drop-shadow-[0_0_8px_rgba(212,175,55,0.5)] tracking-wider">
                    <Trophy className="w-8 h-8 text-[#00ffff]" /> Grand Grimoire
                </h2>
                <Button onClick={fetchData} variant="outline" size="sm" className="h-9 gap-2 bg-[#0a1f20] border-[#008080]/50 hover:bg-[#021516] text-[#d4af37]">
                    <RefreshCw className={cn("w-4 h-4 text-[#00ffff]", loading && "animate-spin")} /> Update Ledger
                </Button>
            </div>

            {/* LEADERBOARD TABLE */}
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
                <table className="w-full text-left text-sm text-zinc-400">
                    <thead className="bg-black/40 uppercase text-[11px] font-bold text-zinc-500 border-b border-zinc-800 tracking-wider">
                        <tr>
                            <th className="p-4 pl-6">Rank</th>
                            <th className="p-4">Participant Details</th>
                            <th className="p-4 text-center">R1 (MCQ)</th>
                            <th className="p-4 text-center">R2 (Flow)</th>
                            <th className="p-4 text-center">R3 (Code)</th>
                            <th className="p-4 text-right pr-6">Total / Time</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                        {leaderboardData.map((entry, i) => (
                            <tr key={entry.user_id || i} className="hover:bg-white/5 transition-colors group">

                                {/* RANK */}
                                <td className="p-4 pl-6">
                                    <span className={cn(
                                        "text-xs w-6 h-6 flex items-center justify-center rounded-full font-bold",
                                        i < 3 ? "bg-yellow-500 text-black shadow-[0_0_10px_rgba(234,179,8,0.5)]" : "bg-zinc-800 text-zinc-500"
                                    )}>
                                        {i + 1}
                                    </span>
                                </td>

                                {/* DETAILS */}
                                <td className="p-4">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-base font-bold text-white group-hover:text-red-400 transition-colors">
                                            {entry.full_name || "Unknown User"}
                                        </span>
                                        <span className="text-xs text-zinc-500 flex items-center gap-1">
                                            {entry.user_email}
                                        </span>
                                        <span className="inline-flex mt-1 self-start items-center px-2 py-0.5 rounded text-[10px] font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wide">
                                            {entry.team_name || "NO TEAM"}
                                        </span>
                                    </div>
                                </td>

                                {/* ROUND 1 SCORE */}
                                <td className="p-4 text-center">
                                    <div className="font-mono text-zinc-300">{entry.round1_score}</div>
                                    <div className="text-[10px] text-zinc-600 flex items-center justify-center gap-1">
                                        <Clock className="w-2 h-2" /> {formatTime(entry.round1_time)}
                                    </div>
                                </td>

                                {/* ROUND 2 SCORE */}
                                <td className="p-4 text-center">
                                    <div className="font-mono text-zinc-300">{entry.round2_score}</div>
                                    <div className="text-[10px] text-zinc-600 flex items-center justify-center gap-1">
                                        <Clock className="w-2 h-2" /> {formatTime(entry.round2_time)}
                                    </div>
                                </td>

                                {/* ROUND 3 SCORE */}
                                <td className="p-4 text-center">
                                    <div className="font-mono text-zinc-300">{entry.round3_score}</div>
                                    <div className="text-[10px] text-zinc-600 flex items-center justify-center gap-1">
                                        <Clock className="w-2 h-2" /> {formatTime(entry.round3_time)}
                                    </div>
                                </td>

                                {/* TOTAL SCORE & TIME */}
                                <td className="p-4 text-right pr-6">
                                    <div className="flex flex-col items-end gap-0.5">
                                        <div className="font-mono font-bold text-green-400 text-lg leading-none">
                                            {entry.overall_score ?? 0}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-zinc-500" title="Total Time Taken">
                                            <FastForward className="w-3 h-3 text-zinc-600" />
                                            <span className="font-mono font-medium text-zinc-400">
                                                {formatDuration(entry.total_time_seconds)}
                                            </span>
                                        </div>
                                    </div>
                                </td>

                                {/* ACTIONS */}
                                <td className="p-4 text-right">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                                        onClick={() => inspectUser(entry.user_id)}
                                    >
                                        <Eye className="w-4 h-4" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        {leaderboardData.length === 0 && (
                            <tr><td colSpan={7} className="p-12 text-center text-zinc-500 italic">No scores recorded yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* --- ADMIN INSPECTION MODAL --- */}
            <Dialog open={inspectorOpen} onOpenChange={setInspectorOpen}>
                <DialogContent className="bg-[#021516] border-[#008080]/50 text-white max-w-5xl h-[85vh] flex flex-col overflow-hidden p-0 shadow-[0_0_40px_rgba(0,128,128,0.2)]">
                    <div className="p-6 border-b border-[#008080]/30 bg-[#0a1f20] flex justify-between items-center shrink-0">
                        <div>
                            <h2 className="text-xl font-wizard text-[#d4af37] flex items-center gap-2">
                                <span className="bg-[#008080]/20 text-[#00ffff] p-1.5 rounded border border-[#008080]/30"><Eye className="w-5 h-5" /></span> OMNSCIENT OBSERVATION
                            </h2>
                            <div className="text-sm text-[#008080] mt-1 font-mono uppercase tracking-widest">
                                SUBJECT ID: {inspectedUser?.profile?.id?.slice(0, 8)} | {inspectedUser?.profile?.email}
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setInspectorOpen(false)} className="text-[#008080] hover:text-red-400"><X className="w-5 h-5" /></Button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 bg-black/50 custom-scrollbar">
                        {inspectionLoading ? (
                            <div className="h-full flex flex-col items-center justify-center gap-2 text-zinc-500">
                                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                                <p>Fetching Submission Data...</p>
                            </div>
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
                                            <div className="text-zinc-500 text-xs uppercase font-bold tracking-wider mb-1">Status</div>
                                            <div className={cn("text-lg font-bold capitalize", inspectedUser?.coding?.status === 'completed' ? "text-green-400" : "text-yellow-500")}>
                                                {inspectedUser?.coding?.status || "Not Started"}
                                            </div>
                                        </div>
                                        <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800">
                                            <div className="text-zinc-500 text-xs uppercase font-bold tracking-wider mb-1">Score</div>
                                            <div className="text-2xl font-mono font-bold text-white">
                                                {inspectedUser?.coding?.problem_set
                                                    ? (inspectedUser.coding.problem_set.reduce((acc: number, curr: any) => acc + (parseFloat(curr.runResult?.score) || 0), 0) / 2)
                                                    : (inspectedUser?.coding?.total_score || 0)
                                                }
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        {/* CODING SOLUTIONS (Supports problem_set Array) */}
                                        {inspectedUser?.coding?.problem_set && Array.isArray(inspectedUser.coding.problem_set) && inspectedUser.coding.problem_set.length > 0 ? (
                                            inspectedUser.coding.problem_set.map((prob: any, idx: number) => (
                                                <div key={idx} className="border border-[#008080]/30 rounded-xl overflow-hidden bg-[#021516] shadow-[0_0_20px_rgba(0,128,128,0.1)]">
                                                    <div className="bg-[#0a1f20] px-4 py-3 border-b border-[#008080]/30 flex justify-between items-center">
                                                        <span className="font-wizard font-bold text-[#d4af37] tracking-wider">Spell {idx + 1}</span>
                                                        <div className="flex gap-2">
                                                            <span className="text-[10px] bg-[#008080]/20 text-[#00ffff] px-2 py-1 rounded uppercase border border-[#008080]/50 tracking-widest font-bold font-mono">
                                                                {prob.language || 'N/A'}
                                                            </span>
                                                            <span className={cn("text-[10px] px-2 py-1 rounded uppercase tracking-widest font-bold border font-mono",
                                                                prob.runResult?.status === 'Accepted' ? "bg-green-900/30 text-green-400 border-green-800" : "bg-red-900/30 text-red-500 border-red-800"
                                                            )}>
                                                                {prob.runResult?.status || 'Not Evaluated'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="h-[300px] relative group [&_.monaco-editor]:!bg-transparent [&_.margin]:!bg-transparent mt-2 px-2 border-b border-[#008080]/20">
                                                        <Editor
                                                            height="100%"
                                                            defaultLanguage="javascript"
                                                            language={prob.language === 'c' || prob.language === 'cpp' ? 'cpp' : prob.language || 'javascript'}
                                                            value={prob.code || "// No spell inscribed"}
                                                            theme="vs-dark"
                                                            options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13, scrollBeyondLastLine: false, domReadOnly: true }}
                                                        />
                                                    </div>
                                                    <div className="bg-[#010a0a] p-4 font-mono text-xs">
                                                        <div className="text-[#008080] mb-2 uppercase tracking-widest font-bold">Execution Grimoire Log:</div>
                                                        <div className="text-[#e0e0e0] whitespace-pre-wrap">
                                                            {prob.runResult?.output || "Silence... No vibrations detected."}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center p-10 border border-dashed border-[#008080]/30 rounded-xl bg-[#0a1f20]/50">
                                                <AlertTriangle className="w-10 h-10 text-[#d4af37] mx-auto mb-3 opacity-50" />
                                                <h3 className="text-xl font-wizard text-[#00ffff] drop-shadow-[0_0_5px_rgba(0,255,255,0.5)] tracking-wider">Empty Tome</h3>
                                                <p className="text-[#008080] text-sm font-manrope mt-2">The conjurer has not inscribed any spells yet, or the mystical data is misaligned.</p>
                                                <div className="mt-6 p-3 bg-black/80 rounded-lg text-left text-xs font-mono text-[#008080] overflow-auto max-h-32 border border-[#008080]/30 shadow-inner">
                                                    RAW: {JSON.stringify(inspectedUser?.coding || "NULL")}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </TabsContent>

                                {/* FLOWCHART TAB (WITH VISUALIZER) */}
                                <TabsContent value="flowchart" className="flex-1">
                                    <div className="space-y-4">
                                        <div className="bg-[#0a1f20]/50 rounded-xl border border-[#008080]/30 p-6 flex flex-col md:flex-row gap-6 shadow-[0_0_15px_rgba(0,128,128,0.05)]">
                                            <div className="flex-1 bg-[#010a0a] p-5 rounded-lg border border-[#008080]/30 shadow-inner"><p className="text-xs text-[#008080] uppercase tracking-widest font-bold mb-2">Oracle's Verdict (Score)</p><div className="text-5xl font-wizard tracking-wider font-bold text-[#d4af37] drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">{inspectedUser?.flowchart?.ai_score}<span className="text-xl text-[#008080] ml-1 font-mono">/100</span></div></div>
                                            <div className="flex-[2] bg-[#010a0a] p-5 rounded-lg border border-[#008080]/30 shadow-inner"><p className="text-xs text-[#008080] uppercase tracking-widest font-bold mb-3 flex items-center gap-2 relative"><Cpu className="w-4 h-4 text-[#00ffff]" /> Oracle's Reading</p><p className="text-[#e0e0e0] text-sm leading-relaxed font-manrope">{inspectedUser?.flowchart?.ai_feedback || "The Oracle remains silent."}</p></div>
                                        </div>
                                        <div className="space-y-2 relative">
                                            <p className="text-xs text-[#008080] uppercase tracking-widest font-bold flex items-center gap-2"><Maximize2 className="w-4 h-4 text-[#d4af37]" /> Vision Replica</p>
                                            <FlowchartViewer
                                                nodes={Array.isArray(inspectedUser?.flowchart?.nodes) ? inspectedUser.flowchart.nodes : []}
                                                edges={Array.isArray(inspectedUser?.flowchart?.edges) ? inspectedUser.flowchart.edges : []}
                                            />
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* MCQ TAB */}
                                <TabsContent value="mcq">
                                    <div className="bg-[#0a1f20]/80 p-6 rounded-xl border border-[#008080]/30 shadow-[0_0_20px_rgba(0,128,128,0.1)]">
                                        <h3 className="text-2xl font-wizard text-[#d4af37] mb-6 tracking-wider">Incantation Trial Potency</h3>
                                        <div className="text-6xl font-wizard font-bold text-[#00ffff] drop-shadow-[0_0_15px_rgba(0,255,255,0.4)]">
                                            {inspectedUser?.mcq?.score || 0} <span className="text-2xl text-[#008080] font-mono">/ Total</span>
                                        </div>
                                        <div className="mt-8 bg-[#010a0a] p-5 rounded-lg border border-[#008080]/30 font-mono text-sm text-[#008080] whitespace-pre-wrap max-h-[300px] overflow-auto shadow-inner">
                                            {JSON.stringify(inspectedUser?.mcq?.answers, null, 2)}
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};