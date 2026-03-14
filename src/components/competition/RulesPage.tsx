import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Shield,
  AlertTriangle,
  Loader2,
  ListChecks,
  Workflow,
  Code,
  ChevronDown,
} from "lucide-react";
import { useCompetitionStore } from "@/store/competitionStore";
import { supabase } from "@/lib/supabaseClient";
import { WaitingArea } from "./WaitingArea";

// ─── Highlight dangerous / warning keywords ───────────────────────────────────
const formatRuleText = (text: string) => {
  const dangerWords = [
    "immediate disqualification",
    "strictly prohibited",
    "instant elimination",
    "elimination",
    "disqualification",
  ];
  const warningWords = [
    "No negative marking",
    "FCFS",
    "First Come, First Served",
    "Mandatory",
    "accuracy",
    "correctness",
    "plagiarism",
    "0 mark",
  ];
  const parts = text.split(
    new RegExp(`(${dangerWords.concat(warningWords).join("|")})`, "gi"),
  );
  return (
    <span>
      {parts.map((part, i) => {
        if (dangerWords.some((w) => w.toLowerCase() === part.toLowerCase()))
          return (
            <span key={i} className="text-red-700 font-extrabold">
              {part}
            </span>
          );
        if (warningWords.some((w) => w.toLowerCase() === part.toLowerCase()))
          return (
            <span key={i} className="text-amber-700 font-bold">
              {part}
            </span>
          );
        return part;
      })}
    </span>
  );
};

// ─── Wooden roller ─────────────────────────────────────────────────────────────
const ScrollRoller = ({ position }: { position: "top" | "bottom" }) => (
  <div
    className={`relative w-full z-20 select-none pointer-events-none ${position === "top" ? "" : ""}`}
    style={{ height: 44 }}
  >
    {/* Main rod */}
    <div
      className="absolute inset-x-0 top-1/2 -translate-y-1/2"
      style={{
        height: 28,
        borderRadius: 6,
        background:
          "linear-gradient(to bottom, #c68642 0%, #8B5513 18%, #5C3317 38%, #3B1F0A 50%, #5C3317 62%, #8B5513 82%, #c68642 100%)",
        boxShadow:
          position === "top"
            ? "0 6px 20px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,220,130,0.25)"
            : "0 -6px 20px rgba(0,0,0,0.55), inset 0 -1px 0 rgba(255,220,130,0.15)",
      }}
    />
    {/* Left end cap */}
    <div
      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1"
      style={{
        width: 18,
        height: 34,
        borderRadius: "50% / 30%",
        background:
          "radial-gradient(ellipse at 60% 50%, #b07030, #5C3317 60%, #3B1F0A)",
        boxShadow: "-2px 0 8px rgba(0,0,0,0.4)",
      }}
    />
    {/* Right end cap */}
    <div
      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1"
      style={{
        width: 18,
        height: 34,
        borderRadius: "50% / 30%",
        background:
          "radial-gradient(ellipse at 40% 50%, #b07030, #5C3317 60%, #3B1F0A)",
        boxShadow: "2px 0 8px rgba(0,0,0,0.4)",
      }}
    />
    {/* Grain lines on rod */}
    {[20, 35, 50, 65, 80].map((pct) => (
      <div
        key={pct}
        className="absolute top-1/2 -translate-y-1/2"
        style={{
          left: `${pct}%`,
          width: 1,
          height: 22,
          background: "rgba(0,0,0,0.18)",
          borderRadius: 1,
        }}
      />
    ))}
    {/* Curl shadow under top roller / above bottom roller */}
    {position === "top" && (
      <div
        className="absolute bottom-0 inset-x-0 h-8 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(139,85,19,0.18) 0%, transparent 100%)",
        }}
      />
    )}
    {position === "bottom" && (
      <div
        className="absolute top-0 inset-x-0 h-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(139,85,19,0.22) 0%, transparent 100%)",
        }}
      />
    )}
  </div>
);

// ─── Decorative divider ────────────────────────────────────────────────────────
const ParchmentDivider = () => (
  <div className="flex items-center gap-3 my-6 opacity-40">
    <div
      className="flex-1 h-px"
      style={{ background: "linear-gradient(to right, transparent, #7c5c2a)" }}
    />
    <span className="text-amber-900 text-xs">✦</span>
    <div
      className="flex-1 h-px"
      style={{ background: "linear-gradient(to left, transparent, #7c5c2a)" }}
    />
  </div>
);

// ─── Rule section accordion ────────────────────────────────────────────────────
interface Rule {
  rule_text: string;
}

interface RuleSectionProps {
  title: string;
  icon: React.ReactNode;
  rules: Rule[];
  color: "blue" | "red" | "amber";
  defaultOpen?: boolean;
}

const RuleSection = ({
  title,
  icon,
  rules,
  color,
  defaultOpen = false,
}: RuleSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const palette = {
    blue: {
      border: "#1e3a5f",
      bg: "rgba(30,58,95,0.08)",
      accent: "#3b82f6",
      num: "#60a5fa",
    },
    red: {
      border: "#5f1e1e",
      bg: "rgba(95,30,30,0.08)",
      accent: "#ef4444",
      num: "#f87171",
    },
    amber: {
      border: "#5f4a1e",
      bg: "rgba(95,74,30,0.08)",
      accent: "#f59e0b",
      num: "#fbbf24",
    },
  }[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      style={{
        border: `1px solid ${palette.border}`,
        background: isOpen ? palette.bg : "transparent",
        borderRadius: 12,
        overflow: "hidden",
        transition: "background 0.3s",
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
      >
        <div className="flex items-center gap-4">
          <div
            style={{
              padding: 10,
              borderRadius: 8,
              background: `${palette.accent}18`,
              border: `1px solid ${palette.accent}30`,
              color: palette.accent,
            }}
          >
            {icon}
          </div>
          <h2
            className="text-base font-bold tracking-wide"
            style={{ color: "#2c1810", fontFamily: "Georgia, serif" }}
          >
            {title}
          </h2>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-5 h-5" style={{ color: "#7c5c2a" }} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <div className="px-6 pb-6 pt-0">
              <div
                className="h-px w-full mb-4"
                style={{
                  background: `linear-gradient(to right, transparent, ${palette.accent}40, transparent)`,
                }}
              />
              {rules?.length > 0 ? (
                <ul className="space-y-3">
                  {rules.map((rule, idx) => (
                    <li
                      key={idx}
                      className="flex gap-4 text-sm leading-relaxed"
                      style={{ color: "#3d2410" }}
                    >
                      <span
                        className="font-mono font-bold mt-0.5 shrink-0"
                        style={{
                          color: palette.num,
                          opacity: 0.7,
                          minWidth: 24,
                        }}
                      >
                        {String(idx + 1).padStart(2, "0")}.
                      </span>
                      <span>{formatRuleText(rule.rule_text)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div
                  className="flex items-center gap-2 text-sm italic"
                  style={{ color: "#8B7355" }}
                >
                  <Loader2 className="w-3 h-3 animate-spin" /> Loading rules...
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Main component ────────────────────────────────────────────────────────────
export const RulesPage = () => {
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [groupedRules, setGroupedRules] = useState<{
    mcq: Rule[];
    flowchart: Rule[];
    coding: Rule[];
  }>({
    mcq: [],
    flowchart: [],
    coding: [],
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollPct, setScrollPct] = useState(0);

  const { acceptRules, currentRound, userId, syncSession } =
    useCompetitionStore();

  // Track scroll progress for subtle roller shadow depth
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const max = scrollHeight - clientHeight;
      setScrollPct(max > 0 ? scrollTop / max : 0);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Safety check
  useEffect(() => {
    let mounted = true;
    const check = async () => {
      if (!userId) {
        if (mounted) setVerifying(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from("exam_sessions")
          .select("*")
          .eq("user_id", userId)
          .single();
        if (error) throw error;
        if (data && mounted && data.current_round_slug !== "rules")
          syncSession(data);
      } catch (err) {
        console.error("Check Failed:", err);
      } finally {
        if (mounted) setVerifying(false);
      }
    };
    check();
    const t = setTimeout(() => {
      if (mounted && verifying) setVerifying(false);
    }, 5000);
    return () => {
      mounted = false;
      clearTimeout(t);
    };
  }, [userId, syncSession, verifying]);

  // Fetch rules
  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("round_rules")
        .select("*")
        .order("order_index", { ascending: true });
      if (data?.length) {
        setGroupedRules({
          mcq: data.filter(
            (r: Rule & { round_slug: string }) => r.round_slug === "mcq",
          ),
          flowchart: data.filter(
            (r: Rule & { round_slug: string }) => r.round_slug === "flowchart",
          ),
          coding: data.filter(
            (r: Rule & { round_slug: string }) => r.round_slug === "coding",
          ),
        });
      } else {
        setGroupedRules({
          mcq: [
            {
              rule_text:
                "The round consists of 10 MCQs which must be solved within the given time.",
            },
            {
              rule_text:
                "Tab switching will result in immediate disqualification.",
            },
          ],
          flowchart: [
            {
              rule_text:
                "Participants must debug given code under the time limit.",
            },
          ],
          coding: [
            {
              rule_text:
                "Participants will be given four (4) problem statements to work.",
            },
          ],
        });
      }
    };
    fetch();
  }, []);

  const handleAccept = async () => {
    setLoading(true);
    try {
      const el = document.documentElement as HTMLElement & {
        webkitRequestFullscreen?: () => Promise<void>;
      };
      if (el.requestFullscreen) await el.requestFullscreen();
      else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
    } catch (err) {
      console.error("Fullscreen request failed:", err);
    }
    await acceptRules();
    setLoading(false);
  };

  if (currentRound === "waiting") return <WaitingArea />;
  if (verifying)
    return (
      <div
        className="h-full flex items-center justify-center"
        style={{ background: "#1a0e05" }}
      >
        <Loader2
          className="animate-spin w-10 h-10"
          style={{ color: "#8B5513" }}
        />
      </div>
    );

  return (
    // ── Outer shell — dark aged-wood backdrop ────────────────────────────
    <div
      className="h-full w-full flex items-stretch justify-center relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 50% 40%, #2a1505 0%, #0d0600 100%)",
      }}
    >
      {/* Ambient dust particles — pure CSS */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle, #c8860a 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
          mask: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        }}
      />

      {/* ── Scroll column ───────────────────────────────────────────── */}
      <div
        className="relative w-full max-w-3xl flex flex-col"
        style={{
          // Outer parchment edge shadow
          filter:
            "drop-shadow(0 0 40px rgba(180,100,20,0.25)) drop-shadow(0 8px 60px rgba(0,0,0,0.8))",
        }}
      >
        {/* TOP ROLLER — sticky */}
        <div className="sticky top-0 z-30 px-2">
          <ScrollRoller position="top" />
        </div>

        {/* PARCHMENT BODY */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto relative"
          style={{
            // Parchment texture
            background: `
                            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E"),
                            linear-gradient(160deg, #f7e8c4 0%, #eedda0 20%, #f2e4b0 40%, #e8d490 55%, #f0dfa8 70%, #ecdaa2 85%, #f5e6c0 100%)
                        `,
            // Worn edges via box-shadow inset
            boxShadow:
              "inset 6px 0 18px rgba(100,60,10,0.18), inset -6px 0 18px rgba(100,60,10,0.18)",
            scrollbarWidth: "thin",
            scrollbarColor: "#a07030 transparent",
          }}
        >
          {/* Left & right torn-edge decoration */}
          <div
            className="absolute inset-y-0 left-0 w-5 pointer-events-none"
            style={{
              background:
                "linear-gradient(to right, rgba(120,70,15,0.22), transparent)",
            }}
          />
          <div
            className="absolute inset-y-0 right-0 w-5 pointer-events-none"
            style={{
              background:
                "linear-gradient(to left, rgba(120,70,15,0.22), transparent)",
            }}
          />

          {/* CONTENT */}
          <div className="relative z-10 px-10 py-8 pb-20 max-w-2xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-center mb-8"
            >
              {/* Wax seal icon */}
              <div
                className="mx-auto mb-4 w-14 h-14 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "radial-gradient(circle at 40% 35%, #dc2626, #7f1d1d)",
                  boxShadow:
                    "0 4px 16px rgba(185,28,28,0.5), inset 0 1px 0 rgba(255,150,150,0.2)",
                }}
              >
                <Shield className="w-7 h-7 text-red-100" />
              </div>

              <h1
                style={{
                  fontFamily:
                    '"Palatino Linotype", "Book Antiqua", Palatino, Georgia, serif',
                  fontSize: "2rem",
                  fontWeight: 900,
                  color: "#5c1010",
                  letterSpacing: "0.08em",
                  textShadow: "0 1px 0 rgba(255,200,120,0.4)",
                  lineHeight: 1.2,
                }}
              >
                PROTOCOL VERIFICATION
              </h1>
              <p
                className="mt-2 text-sm"
                style={{
                  color: "#6b4c1e",
                  fontFamily: "Georgia, serif",
                  fontStyle: "italic",
                }}
              >
                Strict adherence to the following protocols is mandatory.{" "}
                <span style={{ color: "#991b1b", fontWeight: 600 }}>
                  Violations are monitored.
                </span>
              </p>
            </motion.div>

            <ParchmentDivider />

            {/* Rule Sections */}
            <div className="space-y-4">
              <RuleSection
                title="Round I — Aptitude (MCQ)"
                icon={<ListChecks className="w-5 h-5" />}
                rules={groupedRules.mcq}
                color="blue"
                defaultOpen
              />
              <RuleSection
                title="Round II — Bug Quest (DEBUGGING)"
                icon={<Workflow className="w-5 h-5" />}
                rules={groupedRules.flowchart}
                color="amber"
              />
              <RuleSection
                title="Round III — Obscure Codes (HACKERTHON)"
                icon={<Code className="w-5 h-5" />}
                rules={groupedRules.coding}
                color="red"
              />
            </div>

            <ParchmentDivider />

            {/* Warning banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="mt-2 mb-8 p-5 rounded-xl flex gap-4 items-start"
              style={{
                background: "rgba(127,29,29,0.08)",
                border: "1px solid rgba(185,28,28,0.3)",
                boxShadow: "inset 0 0 20px rgba(185,28,28,0.04)",
              }}
            >
              <div
                className="p-2 rounded-full shrink-0 mt-0.5"
                style={{ background: "rgba(185,28,28,0.12)" }}
              >
                <AlertTriangle
                  className="w-6 h-6 animate-pulse"
                  style={{ color: "#991b1b" }}
                />
              </div>
              <div>
                <h4
                  className="font-extrabold mb-1 tracking-widest text-sm"
                  style={{ color: "#7f1d1d", fontFamily: "Georgia, serif" }}
                >
                  STRICT PROCTORING ENABLED
                </h4>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "#78350f" }}
                >
                  Your full-screen status, tab switches, and mouse activity are
                  being logged.
                  <strong className="block mt-1" style={{ color: "#991b1b" }}>
                    Any attempt to minimize the browser or switch tabs will
                    result in instant disqualification.
                  </strong>
                </p>
              </div>
            </motion.div>

            {/* Accept + CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center gap-5 pt-6"
              style={{ borderTop: "1px solid rgba(120,80,20,0.25)" }}
            >
              {/* Checkbox row */}
              <div
                className="flex items-center gap-3 px-5 py-3 rounded-lg cursor-pointer select-none transition-colors"
                style={{
                  background: accepted ? "rgba(120,60,10,0.1)" : "transparent",
                }}
                onClick={() => setAccepted((v) => !v)}
              >
                <Checkbox
                  id="terms"
                  checked={accepted}
                  onCheckedChange={(c: boolean) => setAccepted(c === true)}
                  className="border-amber-700 data-[state=checked]:bg-amber-700 data-[state=checked]:border-amber-700 w-5 h-5 mt-0.5"
                />
                <label
                  htmlFor="terms"
                  className="text-sm cursor-pointer font-medium"
                  style={{ color: "#5c3a0e", fontFamily: "Georgia, serif" }}
                >
                  I acknowledge the rules and agree to the monitoring protocols.
                </label>
              </div>

              {/* CTA button */}
              <button
                disabled={!accepted || loading}
                onClick={handleAccept}
                className="relative overflow-hidden rounded-xl font-bold h-14 px-12 text-base tracking-widest transition-all"
                style={{
                  background:
                    accepted && !loading
                      ? "linear-gradient(135deg, #7f1d1d 0%, #991b1b 50%, #b91c1c 100%)"
                      : "linear-gradient(135deg, #4a3520 0%, #3d2c1a 100%)",
                  color: accepted ? "#fef2f2" : "#7c6040",
                  border: `1px solid ${accepted ? "rgba(220,38,38,0.5)" : "rgba(100,70,30,0.3)"}`,
                  boxShadow: accepted
                    ? "0 4px 24px rgba(185,28,28,0.35)"
                    : "none",
                  cursor: accepted && !loading ? "pointer" : "not-allowed",
                  transform: accepted && !loading ? undefined : "none",
                  fontFamily: '"Palatino Linotype", Georgia, serif',
                  letterSpacing: "0.15em",
                  transition: "all 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  if (accepted && !loading)
                    (e.currentTarget as HTMLButtonElement).style.transform =
                      "scale(1.03)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "scale(1)";
                }}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" /> INITIALIZING…
                  </span>
                ) : (
                  "ENTER WAITING AREA"
                )}
              </button>
            </motion.div>

            {/* Bottom spacing so content clears bottom roller */}
            <div style={{ height: 32 }} />
          </div>

          {/* Fade-to-parchment at bottom edge (simulates still-rolled portion) */}
          <div
            className="sticky bottom-0 left-0 right-0 h-14 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, #dfc880 0%, #e8d490 40%, transparent 100%)",
              opacity: scrollPct > 0.97 ? 0 : 1,
              transition: "opacity 0.4s",
            }}
          />
        </div>

        {/* BOTTOM ROLLER — sticky */}
        <div className="sticky bottom-0 z-30 px-2">
          <ScrollRoller position="bottom" />
        </div>
      </div>
    </div>
  );
};