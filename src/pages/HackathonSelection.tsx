import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  CheckCircle2,
  LogOut,
  Activity,
  Wifi,
  ShieldCheck,
  AlertCircle,
  Code,
  MonitorCheck,
  X,
  ChevronRight,
  Compass,
  BarChart2,
  Layers,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/technetics-head.svg";

const HackathonSelection = () => {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const [timeLeft, setTimeLeft] = useState(() => {
    const savedEndTime = localStorage.getItem("hackathon_selection_end_time");
    if (savedEndTime) {
      const remaining = Math.max(
        0,
        Math.floor((parseInt(savedEndTime) - Date.now()) / 1000),
      );
      return remaining;
    }
    const duration = 60 * 60;
    const newEndTime = Date.now() + duration * 1000;
    localStorage.setItem("hackathon_selection_end_time", newEndTime.toString());
    return duration;
  });

  const problems = [
    {
      id: 1,
      domain: "AI for Digital Safety",
      title: "Real-Time Fake News Detection Engine",
      description:
        "Build an AI-powered system to detect misinformation across news articles, social media posts, images, and videos in real-time across multiple Indian languages.",
      background:
        "Misinformation spreads rapidly across social media platforms, causing communal tensions, health misinformation, financial scams, and election interference. A single viral fake news post can reach millions within hours before fact-checkers can respond.",
      tags: ["NLP", "Computer Vision", "Knowledge Graphs"],
      difficulty: "Hard",
      directions: [
        {
          icon: "🧠",
          label: "NLP",
          detail:
            "Multi-lingual text analysis for sensational language, source credibility, and claim verification.",
        },
        {
          icon: "👁️",
          label: "Computer Vision",
          detail:
            "Deepfake detection, image manipulation identification, and reverse image search.",
        },
        {
          icon: "🕸️",
          label: "Knowledge Graphs",
          detail:
            "Cross-referencing claims with verified fact-checking databases and trusted sources.",
        },
        {
          icon: "💬",
          label: "Explainability",
          detail:
            "Clear reasoning for credibility scores that users can understand and trust.",
        },
        {
          icon: "🔌",
          label: "Browser Extension",
          detail: "Real-time fact-checking while users browse social media.",
        },
      ],
      criteria: [
        {
          label: "Detection Accuracy",
          detail: "Precision and recall on labeled fake news datasets.",
        },
        {
          label: "Speed",
          detail: "Real-time analysis with results available within seconds.",
        },
        {
          label: "Multi-lingual Support",
          detail:
            "Coverage of Hindi, English, and at least two regional languages.",
        },
        {
          label: "User Trust",
          detail: "Explainability and transparency of credibility assessments.",
        },
      ],
    },
    {
      id: 2,
      domain: "FinTech for MSME Growth",
      title: "Digital Lending Platform for MSMEs",
      description:
        "Design a digital lending platform that streamlines the MSME loan process from application to disbursement within 24–48 hours using alternative data sources and automated underwriting.",
      background:
        "MSMEs contribute 30% to India's GDP but face a credit gap of over ₹20 lakh crores. Traditional banks view them as high-risk due to lack of collateral and formal financial records, causing high rejection rates and weeks-long delays.",
      tags: ["AI Underwriting", "OCR/NLP", "Risk Modeling"],
      difficulty: "Medium",
      directions: [
        {
          icon: "🤖",
          label: "Automated Underwriting",
          detail:
            "AI models using GST data, bank statements, and business metrics for credit decisions.",
        },
        {
          icon: "📄",
          label: "Document Processing",
          detail:
            "OCR and NLP for automatic invoice, tax return, and financial statement analysis.",
        },
        {
          icon: "📊",
          label: "Risk Modeling",
          detail:
            "Cash flow prediction and business health scoring based on operational data.",
        },
        {
          icon: "🪪",
          label: "Digital Onboarding",
          detail: "Video KYC, e-signatures, and paperless loan agreements.",
        },
        {
          icon: "💳",
          label: "Flexible Products",
          detail:
            "Invoice financing, purchase order financing, and revenue-based lending options.",
        },
      ],
      criteria: [
        {
          label: "Processing Speed",
          detail:
            "Time from application to disbursement (target under 48 hours).",
        },
        {
          label: "Approval Accuracy",
          detail: "Balance between approval rates and default risk management.",
        },
        {
          label: "User Experience",
          detail:
            "Simplicity of application process and documentation requirements.",
        },
        {
          label: "Scalability",
          detail:
            "Handle thousands of applications daily with consistent performance.",
        },
      ],
    },
    {
      id: 3,
      domain: "HealthTech & Hospital Operations",
      title: "AI-Powered Healthcare Triage & Patient Flow Management",
      description:
        "Design an AI-powered patient triage and hospital flow management platform that prioritizes cases based on severity, medical history, and real-time hospital capacity.",
      background:
        "Indian hospitals face severe overcrowding in emergency and OPD departments. Manual triage systems are slow and error-prone. With increasing patient loads and limited medical staff, intelligent prioritization and resource allocation is critical.",
      tags: ["AI Triage", "Predictive Analytics", "EHR Integration"],
      difficulty: "Expert",
      directions: [
        {
          icon: "🏥",
          label: "AI Triage System",
          detail:
            "ML models classifying patient severity using symptoms, vitals, and medical history.",
        },
        {
          icon: "🔄",
          label: "Patient Flow Optimization",
          detail:
            "Real-time allocation of doctors, diagnostic equipment, and hospital beds.",
        },
        {
          icon: "📱",
          label: "Digital Check-in",
          detail:
            "Mobile-based symptom reporting and queue token generation before arriving.",
        },
        {
          icon: "📈",
          label: "Predictive Analytics",
          detail:
            "Forecast patient load and emergency surges using historical hospital data.",
        },
        {
          icon: "🔗",
          label: "Integration",
          detail:
            "Connect with EHR systems, diagnostic tools, and ambulance services.",
        },
      ],
      criteria: [
        {
          label: "Response Time",
          detail: "Speed of patient triage and queue allocation.",
        },
        {
          label: "Accuracy",
          detail:
            "Correct prioritization of emergency vs non-emergency patients.",
        },
        {
          label: "Operational Efficiency",
          detail: "Reduction in waiting time and resource utilization.",
        },
        {
          label: "Scalability",
          detail: "Support large hospital networks and emergency spikes.",
        },
      ],
    },
    {
      id: 4,
      domain: "Smart Cities & Sustainability",
      title: "Smart Waste Management & Recycling Optimization Platform",
      description:
        "Design a smart waste management platform using IoT sensors, data analytics, and predictive routing to optimize collection, segregation, and recycling across urban India.",
      background:
        "Urban India generates over 160,000 tonnes of waste daily. Municipal waste collection operates on fixed schedules, causing overflow and inefficiency. Smart technology can optimize logistics, improve recycling rates, and enable data-driven waste management.",
      tags: ["IoT", "Route Optimization", "Computer Vision"],
      difficulty: "Medium",
      directions: [
        {
          icon: "📡",
          label: "IoT Smart Bins",
          detail:
            "Sensors monitoring fill levels and sending real-time alerts to municipal systems.",
        },
        {
          icon: "🗺️",
          label: "Route Optimization",
          detail:
            "AI-based route planning for garbage trucks to reduce fuel consumption and time.",
        },
        {
          icon: "♻️",
          label: "Waste Segregation",
          detail:
            "Computer vision to classify recyclable and non-recyclable waste at source.",
        },
        {
          icon: "🏆",
          label: "Citizen Engagement App",
          detail:
            "Reward-based system encouraging residents to segregate and recycle waste.",
        },
        {
          icon: "📊",
          label: "Analytics Dashboard",
          detail:
            "Real-time monitoring showing waste volumes, recycling rates, and operational efficiency.",
        },
      ],
      criteria: [
        {
          label: "Collection Efficiency",
          detail: "Reduction in fuel usage and collection time.",
        },
        {
          label: "Segregation Accuracy",
          detail: "Improvement in recycling and reduced landfill waste.",
        },
        {
          label: "Environmental Impact",
          detail: "Measurable reduction in pollution and overflow incidents.",
        },
        {
          label: "Scalability",
          detail: "Ability to deploy across multiple smart cities.",
        },
      ],
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      const endTimeStr = localStorage.getItem("hackathon_selection_end_time");
      if (endTimeStr) {
        const targetTime = parseInt(endTimeStr);
        const remaining = Math.max(
          0,
          Math.floor((targetTime - Date.now()) / 1000),
        );
        setTimeLeft(() => {
          if (remaining <= 0) {
            clearInterval(timer);
            return 0;
          }
          return remaining;
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const handleConfirm = () => setIsConfirmed(true);

  const difficultyColor: Record<string, string> = {
    Medium: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
    Hard: "text-orange-400 border-orange-400/30 bg-orange-400/10",
    Expert: "text-red-400 border-red-400/30 bg-red-400/10",
  };

  // Stagger variants
  const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
  };
  const fadeSlide = {
    hidden: { opacity: 0, y: 14, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { type: "spring" as const, stiffness: 300, damping: 28 },
    },
  };

  return (
    <div className="h-screen bg-[#050b0b] text-white flex flex-col font-sans overflow-hidden">
      {/* HEADER */}
      <header className="h-16 border-b border-[#d4af37]/20 bg-[#051112]/90 flex items-center justify-between px-6 z-10 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-4">
          <div
            className="shrink-0 cursor-pointer group"
            onClick={() => navigate("/")}
          >
            <img
              src={logo}
              alt="Technetics"
              className="h-10 w-auto transition-transform group-hover:scale-110"
            />
          </div>
          <div className="flex flex-col border-l border-[#d4af37]/20 pl-4 py-1">
            <span className="text-xl text-[#d4af37] font-wizard leading-none">
              The Order of the Obscure Code
            </span>
            <span className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em] mt-1 opacity-70">
              Problem Statement Selection
            </span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-black/40 rounded-full border border-[#d4af37]/10">
            <Activity size={14} className="text-[#15803d]" />
            <span className="text-xs font-bold text-gray-400">1 Online</span>
          </div>
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-900/20 rounded-full border border-green-700/30">
            <Wifi size={14} className="text-green-500" />
            <span className="text-[10px] font-black uppercase text-green-500 tracking-wider">
              Connected
            </span>
          </div>
          <div className="flex items-center gap-3 pl-4 border-l border-[#d4af37]/20">
            <div className="text-right flex flex-col">
              <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest leading-none mb-1">
                Logged in as
              </span>
              <span className="text-sm text-white font-bold leading-none">
                user@technetics.com
              </span>
            </div>
            <button
              onClick={() => navigate("/games")}
              className="p-2 hover:bg-red-900/20 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* LEFT SIDEBAR */}
        <aside className="w-64 border-r border-[#d4af37]/10 bg-[#051112]/40 p-6 hidden lg:block">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#d4af37]/50 mb-8">
            Round Progress
          </h2>
          <div className="space-y-10 relative before:absolute before:left-4.75 before:top-2 before:bottom-2 before:w-px before:bg-[#d4af37]/10">
            {["Competition Rules", "Logic Flow", "GitHub Sync"].map((label) => (
              <div key={label} className="relative flex gap-4">
                <div className="z-10 w-10 h-10 rounded-full bg-green-900/30 border border-green-500/50 flex items-center justify-center text-green-500 shrink-0">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h3 className="text-xs font-black text-green-500 uppercase tracking-wider mb-1">
                    {label}
                  </h3>
                  <p className="text-[10px] text-gray-500">Completed</p>
                </div>
              </div>
            ))}
            <div className="relative flex gap-4">
              <div className="z-10 w-10 h-10 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/60 flex items-center justify-center text-[#FFD700] shadow-[0_0_15px_rgba(212,175,55,0.3)] shrink-0">
                <Code size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xs font-black text-[#FFD700] uppercase tracking-wider">
                    15-Hour Hackathon
                  </h3>
                  <span className="text-[8px] px-1.5 py-0.5 bg-[#d4af37]/20 text-[#FFD700] rounded font-bold uppercase tracking-tighter">
                    Selection
                  </span>
                </div>
                <p className="text-[10px] text-gray-400">Final Phase</p>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN */}
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
                "The wand chooses the wizard, but the quest is chosen by the
                bold. You have one hour to manifest your decision."
              </p>
            </motion.div>

            {/* CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full p-2">
              {problems.map((prob) => {
                const isSelected = selectedId === prob.id;
                return (
                  <motion.div
                    key={prob.id}
                    animate={{
                      y: isSelected ? -10 : 0,
                      scale: isSelected ? 1.025 : 1,
                    }}
                    whileHover={!isSelected ? { scale: 1.02, y: -5 } : {}}
                    whileTap={!isSelected ? { scale: 0.98 } : {}}
                    transition={{ type: "spring", stiffness: 320, damping: 26 }}
                    onClick={() => !isConfirmed && setSelectedId(prob.id)}
                    className={`relative p-6 rounded-2xl border-2 cursor-pointer bg-[#051112] overflow-hidden group ${isSelected ? "border-[#FFD700] shadow-[0_12px_40px_rgba(212,175,55,0.22)]" : "border-[#d4af37]/20 hover:border-[#d4af37]/40"}`}
                  >
                    {/* Domain badge */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[9px] font-black uppercase tracking-[0.18em] text-[#d4af37]/50 px-2 py-0.5 rounded-full border border-[#d4af37]/15 bg-[#d4af37]/5">
                        {prob.domain}
                      </span>
                    </div>

                    <div className="flex items-start gap-3 mb-4">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold border shrink-0 mt-0.5 ${isSelected ? "bg-[#FFD700] text-black border-[#FFD700]" : "bg-[#d4af37]/10 text-[#d4af37] border-[#d4af37]/20"}`}
                      >
                        0{prob.id}
                      </div>
                      <h3 className="text-lg font-wizard text-white leading-tight group-hover:text-[#FFD700] transition-colors">
                        {prob.title}
                      </h3>
                    </div>

                    <p className="text-xs text-gray-400 leading-relaxed font-sans mb-4">
                      {prob.description}
                    </p>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedId(prob.id);
                      }}
                      className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#d4af37]/60 hover:text-[#FFD700] transition-colors group/btn"
                    >
                      <span>View Details</span>
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        className="opacity-60 group-hover/btn:opacity-100 transition-opacity"
                      >
                        <path
                          d="M1 1 L9 1 L9 9"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M1 9 L9 1"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>

                    {isSelected && (
                      <motion.div
                        layoutId="selected-border"
                        className="absolute inset-0 border-2 border-[#FFD700] pointer-events-none rounded-2xl"
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-12">
              <button
                onClick={() => selectedId && setShowConfirm(true)}
                disabled={!selectedId || isConfirmed}
                className="px-16 py-4 rounded-2xl bg-linear-to-r from-[#8a6e2e] to-[#d4af37] text-black font-wizard text-2xl hover:from-[#d4af37] hover:to-[#FFD700] shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 active:scale-95 tracking-widest"
              >
                {isConfirmed ? "Quest Manifested" : "Lock Selection"}
              </button>
            </div>
          </div>

          {/* ── DIAGONAL EXPANSION OVERLAY ── */}
          <AnimatePresence>
            {expandedId !== null &&
              (() => {
                const prob = problems.find((p) => p.id === expandedId)!;
                return (
                  <>
                    <motion.div
                      key="backdrop"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => setExpandedId(null)}
                      className="absolute inset-0 z-40 bg-black/65 backdrop-blur-sm"
                    />

                    <motion.div
                      key={`expanded-${expandedId}`}
                      initial={{
                        top: "12%",
                        left: "2%",
                        width: "44%",
                        height: "28%",
                        opacity: 0.4,
                      }}
                      animate={{
                        top: "4%",
                        left: "2%",
                        width: "94%",
                        height: "90%",
                        opacity: 1,
                      }}
                      exit={{
                        top: "12%",
                        left: "2%",
                        width: "44%",
                        height: "28%",
                        opacity: 0,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 230,
                        damping: 30,
                        opacity: { duration: 0.15 },
                      }}
                      style={{
                        transformOrigin: "top left",
                        position: "absolute",
                        borderRadius: "20px",
                      }}
                      className="z-50 bg-[#060e0e] border-2 border-[#FFD700] shadow-[0_0_80px_rgba(212,175,55,0.2)] overflow-hidden flex flex-col"
                    >
                      {/* Panel Header */}
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.22 }}
                        className="flex items-center justify-between px-8 pt-6 pb-5 border-b border-[#d4af37]/15 shrink-0"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-xl bg-[#FFD700] text-black flex items-center justify-center font-black text-sm shrink-0">
                            0{prob.id}
                          </div>
                          <div>
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#d4af37]/60 mb-1">
                              {prob.domain}
                            </p>
                            <h3 className="text-xl font-wizard text-[#FFD700] tracking-widest leading-none">
                              {prob.title}
                            </h3>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${difficultyColor[prob.difficulty]}`}
                          >
                            {prob.difficulty}
                          </span>
                          <div className="hidden xl:flex gap-1.5">
                            {prob.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-[9px] px-2.5 py-1 rounded-full border border-[#d4af37]/20 bg-[#d4af37]/5 text-[#d4af37] font-bold tracking-wide"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <button
                            onClick={() => setExpandedId(null)}
                            className="p-2 hover:bg-white/5 text-gray-500 hover:text-white rounded-lg transition-colors ml-2"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </motion.div>

                      {/* Body — 3 columns */}
                      <div className="flex-1 overflow-y-auto">
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-0 h-full">
                          {/* Col 1: Background */}
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.28, duration: 0.4 }}
                            className="px-8 py-7 border-r border-[#d4af37]/10"
                          >
                            <div className="flex items-center gap-2 mb-5">
                              <Layers size={13} className="text-[#d4af37]/50" />
                              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#d4af37]/50">
                                Background
                              </p>
                            </div>
                            <p className="text-sm text-gray-300 leading-relaxed">
                              {prob.background}
                            </p>
                          </motion.div>

                          {/* Col 2: Directions Worth Exploring */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.32, duration: 0.4 }}
                            className="px-8 py-7 border-r border-[#d4af37]/10"
                          >
                            <div className="flex items-center gap-2 mb-5">
                              <Compass
                                size={13}
                                className="text-[#d4af37]/50"
                              />
                              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#d4af37]/50">
                                Directions Worth Exploring
                              </p>
                            </div>
                            <motion.div
                              variants={stagger}
                              initial="hidden"
                              animate="visible"
                              className="flex flex-col gap-4"
                            >
                              {prob.directions.map((d) => (
                                <motion.div
                                  key={d.label}
                                  variants={fadeSlide}
                                  className="flex gap-3"
                                >
                                  <span className="text-lg leading-none mt-0.5 shrink-0">
                                    {d.icon}
                                  </span>
                                  <div>
                                    <p className="text-xs font-black text-white tracking-wide mb-0.5">
                                      {d.label}
                                    </p>
                                    <p className="text-[11px] text-gray-400 leading-relaxed">
                                      {d.detail}
                                    </p>
                                  </div>
                                </motion.div>
                              ))}
                            </motion.div>
                          </motion.div>

                          {/* Col 3: Evaluation Criteria */}
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.36, duration: 0.4 }}
                            className="px-8 py-7"
                          >
                            <div className="flex items-center gap-2 mb-5">
                              <BarChart2
                                size={13}
                                className="text-[#d4af37]/50"
                              />
                              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#d4af37]/50">
                                Evaluation Criteria
                              </p>
                            </div>
                            <motion.div
                              variants={stagger}
                              initial="hidden"
                              animate="visible"
                              className="flex flex-col gap-4"
                            >
                              {prob.criteria.map((c, i) => (
                                <motion.div
                                  key={c.label}
                                  variants={fadeSlide}
                                  className="flex gap-3 items-start"
                                >
                                  {/* Numbered badge */}
                                  <div className="w-6 h-6 rounded-md bg-[#d4af37]/10 border border-[#d4af37]/20 flex items-center justify-center text-[10px] font-black text-[#FFD700] shrink-0 mt-0.5">
                                    {i + 1}
                                  </div>
                                  <div>
                                    <p className="text-xs font-black text-white tracking-wide mb-0.5">
                                      {c.label}
                                    </p>
                                    <p className="text-[11px] text-gray-400 leading-relaxed">
                                      {c.detail}
                                    </p>
                                  </div>
                                </motion.div>
                              ))}
                            </motion.div>
                          </motion.div>
                        </div>
                      </div>

                      {/* Footer */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.65 }}
                        className="px-8 py-5 border-t border-[#d4af37]/10 flex items-center justify-between shrink-0"
                      >
                        <p className="text-xs text-gray-500 italic">
                          "The bold choose, the rest wonder."
                        </p>
                        <button
                          onClick={() => {
                            if (!isConfirmed) setSelectedId(prob.id);
                            setExpandedId(null);
                          }}
                          disabled={isConfirmed}
                          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#d4af37] text-black font-wizard text-lg hover:bg-[#FFD700] transition-all disabled:opacity-40 disabled:cursor-not-allowed tracking-widest"
                        >
                          <span>Select This Quest</span>
                          <ChevronRight size={16} />
                        </button>
                      </motion.div>
                    </motion.div>
                  </>
                );
              })()}
          </AnimatePresence>

          {/* CONFIRM MODAL */}
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
                  <h3 className="text-3xl font-wizard tracking-widest text-[#FFD700] mb-4">
                    Confirm Your Choice
                  </h3>
                  <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                    Are you certain you wish to manifest{" "}
                    <span className="text-white font-bold">
                      "{problems.find((p) => p.id === selectedId)?.title}"
                    </span>
                    ? Once the seal is placed, your quest cannot be altered.
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setShowConfirm(false)}
                      className="flex-1 py-3 rounded-xl border border-[#d4af37]/30 text-[#d4af37] font-wizard hover:bg-[#d4af37]/10 transition-all tracking-widest text-xl"
                    >
                      Return
                    </button>
                    <button
                      onClick={() => {
                        setShowConfirm(false);
                        handleConfirm();
                      }}
                      className="flex-1 py-3 rounded-xl bg-[#d4af37] text-black font-wizard hover:bg-[#FFD700] transition-all tracking-widest text-xl"
                    >
                      Confirm
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CONFIRMED OVERLAY */}
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
                  <h3 className="text-5xl font-wizard tracking-widest text-[#FFD700] mb-6">
                    Manifestation Complete
                  </h3>
                  <p className="text-xl text-gray-400 font-wizard italic">
                    All the best for the 15-Hour Hackathon! The arena awaits.
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* RIGHT SIDEBAR */}
        <aside className="w-80 border-l border-[#d4af37]/10 bg-[#051112]/40 p-5 hidden xl:block">
          <div className="mb-6 bg-black/40 rounded-xl p-4 border border-[#d4af37]/10 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">
                Time Remaining
              </span>
              <span
                className={`text-xl font-black ${timeLeft < 300 ? "text-red-500 animate-pulse" : "text-[#FFD700]"}`}
              >
                {formatTime(timeLeft)}
              </span>
            </div>
            <div className="p-2.5 bg-[#d4af37]/10 rounded-lg text-[#d4af37]">
              <Clock size={20} />
            </div>
          </div>
          <div className="space-y-5">
            <div className="flex flex-col gap-3">
              {[
                ["Current Phase", "HACKATHON SELECTION", "text-[#FFD700]"],
                ["Selection Limit", "1 PROBLEM", "text-white"],
              ].map(([l, v, c]) => (
                <div
                  key={l}
                  className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500"
                >
                  <span>{l}</span>
                  <span className={c}>{v}</span>
                </div>
              ))}
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500">
                <span>Proctored</span>
                <div className="flex items-center gap-1 text-green-500">
                  <MonitorCheck size={12} />
                  <span>Active</span>
                </div>
              </div>
            </div>
            <hr className="border-[#d4af37]/10" />
            <div>
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
                <span>Decision Progress</span>
                <span className="text-[#d4af37]">
                  {selectedId ? "1" : "0"}/1
                </span>
              </div>
              <div className="h-1 w-full bg-black/40 rounded-full overflow-hidden border border-[#d4af37]/5">
                <motion.div
                  animate={{ width: selectedId ? "100%" : "0%" }}
                  className="h-full bg-linear-to-r from-[#8a6e2e] to-[#d4af37]"
                />
              </div>
            </div>
            <div className="pt-2">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">
                Quest Rules
              </h3>
              <ul className="space-y-3">
                {[
                  "Review each problem statement carefully",
                  "Once selected, the choice is permanent",
                  "Hackathon environment launches next",
                ].map((s, i) => (
                  <li key={i} className="flex gap-3 text-[11px] text-gray-400">
                    <span className="text-[#d4af37] font-bold">{i + 1}.</span>
                    <span className="leading-tight">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default HackathonSelection;
