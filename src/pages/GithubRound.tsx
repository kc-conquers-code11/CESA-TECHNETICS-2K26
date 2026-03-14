import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  CheckCircle2,
  Lock,
  LogOut,
  MonitorCheck,
  Github,
  ExternalLink,
  Send,
  Activity,
  Wifi,
  Code,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/technetics-head.svg";

const GithubRound = () => {
  const navigate = useNavigate();
  const [submissionLink, setSubmissionLink] = useState(() => {
    return localStorage.getItem("github_submission_link") || "";
  });

  // --- STRANGER TECH LOGIC: PERSISTENT TIMER ---
  const [timeLeft, setTimeLeft] = useState(() => {
    const savedEndTime = localStorage.getItem("github_end_time");
    if (savedEndTime) {
      const remaining = Math.max(
        0,
        Math.floor((parseInt(savedEndTime) - Date.now()) / 1000),
      );
      return remaining;
    }
    const duration = 60 * 60; // 60 minutes
    const newEndTime = Date.now() + duration * 1000;
    localStorage.setItem("github_end_time", newEndTime.toString());
    return duration;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- PERSISTENCE EFFECT ---
  useEffect(() => {
    localStorage.setItem("github_submission_link", submissionLink);
  }, [submissionLink]);

  // --- SUBMISSION LOGIC ---
  const handleSubmit = useCallback(() => {
    if (isSubmitting || !submissionLink) return;

    setError(null);

    // --- GITHUB VALIDATION ---
    const githubRegex =
      /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9._-]+(\/)?$/;
    if (!githubRegex.test(submissionLink.trim())) {
      setError(
        "Please enter a valid GitHub repository URL (e.g., https://github.com/user/repo)",
      );
      return;
    }

    setIsSubmitting(true);

    console.log("Submitting GitHub Round Link...", { submissionLink });

    // Simulating API call
    setTimeout(() => {
      localStorage.removeItem("github_end_time");
      localStorage.removeItem("github_submission_link");
      localStorage.removeItem("github_switches");
      localStorage.removeItem("github_frozen");
      navigate("/waiting-list?next=/hackathon-selection");
      setIsSubmitting(false);
    }, 1500);
  }, [isSubmitting, submissionLink, navigate]);

  // --- TIMER EFFECT (DRIFT-FREE) ---
  useEffect(() => {
    const timer = setInterval(() => {
      const endTimeStr = localStorage.getItem("github_end_time");
      if (endTimeStr) {
        const targetTime = parseInt(endTimeStr);
        const msRemaining = targetTime - Date.now();
        const secondsRemaining = Math.max(0, Math.floor(msRemaining / 1000));

        setTimeLeft((prev) => {
          if (secondsRemaining <= 0) {
            clearInterval(timer);
            if (prev > 0) handleSubmit();
            return 0;
          }
          return secondsRemaining;
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [handleSubmit]);

  // --- ANTI-CHEAT EFFECTS ---
  useEffect(() => {
    const blockAction = (e: Event) => {
      e.preventDefault();
      return false;
    };

    // We allow Copy/Paste for the link, but block context menu
    document.addEventListener("contextmenu", blockAction);

    return () => {
      document.removeEventListener("contextmenu", blockAction);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="h-screen bg-[#050b0b] text-white flex flex-col font-sans overflow-hidden">
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
              GitHub Sync Round
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
              title="Exit Arena"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-64 border-r border-[#d4af37]/10 bg-[#051112]/40 p-6 hidden lg:block">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#d4af37]/50 mb-8">
            Round Progress
          </h2>

          <div className="space-y-10 relative before:absolute before:left-4.75 before:top-2 before:bottom-2 before:w-px before:bg-[#d4af37]/10">
            {/* Rules (Completed) */}
            <div className="relative flex gap-4">
              <div className="z-10 w-10 h-10 rounded-full bg-green-900/30 border border-green-500/50 flex items-center justify-center text-green-500 shrink-0">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <h3 className="text-xs font-black text-green-500 uppercase tracking-wider mb-1">
                  Competition Rules
                </h3>
                <p className="text-[10px] text-gray-500">Completed</p>
              </div>
            </div>

            {/* Logic Flow (Completed) */}
            <div className="relative flex gap-4">
              <div className="z-10 w-10 h-10 rounded-full bg-green-900/30 border border-green-500/50 flex items-center justify-center text-green-500 shrink-0">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <h3 className="text-xs font-black text-green-500 uppercase tracking-wider mb-1">
                  Logic Flow
                </h3>
                <p className="text-[10px] text-gray-500">Completed</p>
              </div>
            </div>

            {/* GitHub Sync (Active) */}
            <div className="relative flex gap-4">
              <div className="z-10 w-10 h-10 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/60 flex items-center justify-center text-[#FFD700] shadow-[0_0_15px_rgba(212,175,55,0.3)] shrink-0">
                <Code size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xs font-black text-[#FFD700] uppercase tracking-wider">
                    GitHub Sync
                  </h3>
                  <span className="text-[8px] px-1.5 py-0.5 bg-[#d4af37]/20 text-[#FFD700] rounded font-bold uppercase tracking-tighter">
                    Active
                  </span>
                </div>
                <p className="text-[10px] text-gray-400">The Cursed Repo</p>
              </div>
            </div>

            {/* Final Round */}
            <div className="relative flex gap-4 opacity-40">
              <div className="z-10 w-10 h-10 rounded-full bg-gray-900 border border-gray-700 flex items-center justify-center text-gray-500 shrink-0">
                <Activity size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider">
                    15-Hour Hackathon
                  </h3>
                  <Lock size={10} />
                </div>
                <p className="text-[10px] text-gray-600">Locked</p>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 p-4 md:p-8 flex flex-col items-center justify-center overflow-hidden">
          <div className="w-full max-w-4xl h-full flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-[#1f2933] scrollbar-track-transparent">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 bg-[#051112] border border-[#d4af37]/20 rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col justify-center text-center"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />

              <h2 className="text-4xl md:text-5xl font-wizard tracking-widest text-[#FFD700] mb-6">
                The Cursed Repository
              </h2>

              <p className="text-gray-400 font-sans leading-relaxed mb-10 text-lg max-w-2xl mx-auto">
                The Ministry's archives have been tainted by dark magic. Clone
                the corrupted scrolls below, mend the broken logic, and manifest
                your solution in your own digital vault.
              </p>

              <div className="bg-black/40 border border-[#d4af37]/20 rounded-2xl p-6 mb-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-[#d4af37]/40 transition-all">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-xl bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37]">
                    <ExternalLink size={32} />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">
                      Requirement
                    </p>
                    <h3 className="text-white font-wizard text-sm tracking-widest pt-1 uppercase">
                      UI Preview
                    </h3>
                  </div>
                </div>
                <a
                  href="https://technetics-main.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] font-wizard hover:bg-[#d4af37]/20 transition-all flex items-center gap-2 shrink-0"
                >
                  <span>Open Preview</span>
                  <ExternalLink size={16} />
                </a>
              </div>

              {/* Challenge repositories for participants */}
              <div className="bg-black/40 border border-[#d4af37]/20 rounded-2xl p-6 mb-12 space-y-4 text-left max-w-2xl mx-auto border-t-2 border-t-[#d4af37]/40">
                <p className="text-[10px] font-black text-[#d4af37]/70 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Github size={14} /> Bug Hunt Challenge Repositories
                </p>
                <p className="text-[11px] text-gray-400 leading-relaxed italic">
                  Select the scroll appropriate for your mastery level. Clone the repo, mend the logic, and manifest your submission link below.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <a
                    href="https://github.com/sidd-gupta05/BUG_HUNT_HTML"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col gap-3 p-5 rounded-xl bg-black/40 border border-[#d4af37]/20 hover:border-[#d4af37]/60 hover:bg-black/60 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#d4af37]">
                        1st Year (HTML)
                      </span>
                      <ExternalLink size={14} className="text-[#d4af37] group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <h4 className="text-white font-wizard text-sm tracking-widest mb-1">BUG HUNT HTML</h4>
                      <p className="text-[10px] text-gray-500 truncate italic">github.com/sidd-gupta05/BUG_HUNT_HTML</p>
                    </div>
                  </a>

                  <a
                    href="https://github.com/sidd-gupta05/BUG_HUNT_REACT"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col gap-3 p-5 rounded-xl bg-black/40 border border-[#d4af37]/20 hover:border-[#d4af37]/60 hover:bg-black/60 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#d4af37]">
                        Others (React)
                      </span>
                      <ExternalLink size={14} className="text-[#d4af37] group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <h4 className="text-white font-wizard text-sm tracking-widest mb-1">BUG HUNT REACT</h4>
                      <p className="text-[10px] text-gray-500 truncate italic">github.com/sidd-gupta05/BUG_HUNT_REACT</p>
                    </div>
                  </a>
                </div>
              </div>

              <div className="space-y-5 text-left max-w-2xl mx-auto w-full">
                <label className="text-xs font-black text-[#d4af37]/70 uppercase tracking-[0.2em] ml-2">
                  {" "}
                  Manifest Your Fix (Solution Link)
                </label>
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
                <p className="text-[10px] text-gray-500 italic ml-2">
                  Ensure your repository is PUBLIC so the Ministry can verify
                  your scrolls.
                </p>
              </div>

              <div className="mt-14 flex justify-center">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !submissionLink}
                  className="flex items-center gap-4 px-12 py-4 rounded-2xl bg-linear-to-r from-[#8a6e2e] to-[#d4af37] text-black font-wizard font-bold text-2xl hover:from-[#d4af37] hover:to-[#FFD700] shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                >
                  <span>
                    {isSubmitting ? "Casting Spell..." : "Submit Solution"}
                  </span>
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-3 border-black/20 border-t-black" />
                  ) : (
                    <Send size={20} />
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </main>

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

            {/* Progress Section (Matching AptitudeRound style) */}
            <div>
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
                <span>Sync Progress</span>
                <span className="text-[#d4af37]">
                  {submissionLink ? "1" : "0"}/1
                </span>
              </div>
              <div className="h-1 w-full bg-black/40 rounded-full overflow-hidden border border-[#d4af37]/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: submissionLink ? "100%" : "0%" }}
                  className="h-full bg-linear-to-r from-[#8a6e2e] to-[#d4af37] shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                />
              </div>
            </div>

            {/* Round Objective */}
            <div className="pt-2">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">
                Round Objective
              </h3>
              <ul className="space-y-3">
                {[
                  "Clone the corrupted repository",
                  "Analyze and fix logic errors",
                  "Commit and push to your GitHub",
                  "Submit the public URL below",
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
                <Activity
                  size={18}
                  className="text-orange-500 shrink-0 mt-0.5"
                />
                <div>
                  <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">
                    Status
                  </p>
                  <p className="text-[10px] text-gray-500 leading-tight italic">
                    Synchronization in progress. Ensure your solution branch is
                    clean before manifestation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default GithubRound;
