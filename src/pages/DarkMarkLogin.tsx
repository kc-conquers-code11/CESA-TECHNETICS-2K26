import { useState, useEffect } from "react";
import { loginApi } from "../lib/auth";
import { useNavigate } from "react-router-dom";
import { useCompetitionStore } from "@/store/competitionStore";
import { toast } from "sonner";
import { Shield, Lock } from "lucide-react";

export default function DarkMarkLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { initializeUser } = useCompetitionStore();

  const DARK_MARK_START_TIME = new Date("2026-03-17T06:00:00+05:30").getTime();
  const [currentTime, setCurrentTime] = useState(Date.now());
  const isEnabled = currentTime >= DARK_MARK_START_TIME;

  useEffect(() => {
    if (isEnabled) return;
    const interval = setInterval(() => {
      const now = Date.now();
      setCurrentTime(now);
      if (now >= DARK_MARK_START_TIME) {
        clearInterval(interval);
      }
    }, 1000 * 60); // Check every minute
    return () => clearInterval(interval);
  }, [isEnabled, DARK_MARK_START_TIME]);

  const handleLogin = async () => {
    if (!isEnabled) return;
    setLoading(true);
    try {
      const res = await loginApi({ email, password });

      // Store Token
      localStorage.setItem("token", res.session?.access_token || "");

      // Initialize Zustand Store
      if (res.user) {
        await initializeUser(res.user.id, res.user.email || "");

        // RE-FETCH to get is_dark_mark (already handled in initializeUser, but let's check state)
        const state = useCompetitionStore.getState();

        if (!state.isDarkMark && !res.isAdmin) {
          toast.error("Access Denied: You are not registered for the Dark Mark Bounty.");
          setLoading(false);
          return;
        }

        // REDIRECT LOGIC
        if (res.isAdmin) {
          navigate("/admin");
        } else {
          navigate("/"); // Goes to CompetitionLayout which handles waiting
        }
      }

    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-black text-white p-4 transition-all duration-1000 ${!isEnabled ? "grayscale opacity-80" : ""}`}>
      <div className={`w-full max-w-[420px] p-8 rounded-2xl border ${!isEnabled ? "border-zinc-800 bg-zinc-950/50" : "border-red-900/50 bg-zinc-950"} shadow-[0_0_50px_rgba(153,27,27,0.3)] relative overflow-hidden`}>
        {!isEnabled && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] z-50 flex flex-col items-center justify-center text-center p-6 pointer-events-none">
            <Lock className="w-12 h-12 text-zinc-600 mb-4 animate-pulse" />
            <p className="text-zinc-400 font-wizard tracking-widest uppercase text-sm">Seal of the Dark Mark</p>
            <p className="text-zinc-600 text-[10px] mt-2 tracking-widest">Unlocks: March 17, 06:00 AM</p>
          </div>
        )}

        <div className={`flex flex-col items-center mb-8 ${!isEnabled ? "opacity-30" : ""}`}>
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 border ${!isEnabled ? "bg-zinc-900 border-zinc-700" : "bg-red-900/20 border-red-500/30"}`}>
            <Shield className={`w-8 h-8 ${!isEnabled ? "text-zinc-700" : "text-red-600"}`} />
          </div>
          <h2 className={`text-2xl font-bold tracking-widest font-display text-center uppercase ${!isEnabled ? "text-zinc-700" : "text-red-500"}`}>
            Dark Mark Access
          </h2>
          <p className="text-zinc-500 text-xs mt-2 uppercase tracking-tighter">Authorized Personnel Only</p>
        </div>

        <div className={`space-y-4 ${!isEnabled ? "pointer-events-none opacity-20" : ""}`}>
          <div>
            <label className="text-xs text-zinc-500 uppercase font-bold mb-1 block ml-1">Secure Email</label>
            <input
              className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded focus:outline-none focus:border-red-600 text-white placeholder:text-zinc-600 transition-all"
              placeholder="agent@strangertech.in"
              disabled={!isEnabled}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs text-zinc-500 uppercase font-bold mb-1 block ml-1">Access Phrase</label>
            <input
              className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded focus:outline-none focus:border-red-600 text-white placeholder:text-zinc-600 transition-all font-mono"
              type="password"
              placeholder="••••••••"
              disabled={!isEnabled}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading || !isEnabled}
            className={`w-full transition-all py-3 rounded-lg font-bold tracking-widest text-white shadow-lg ${!isEnabled ? "bg-zinc-800 text-zinc-600 cursor-not-allowed shadow-none" : "bg-red-700 hover:bg-red-600 shadow-red-900/20"}`}
          >
            {!isEnabled ? "ACCESS SEALED" : loading ? "AUTHENTICATING..." : "VERIFY IDENTITY"}
          </button>
        </div>
      </div>
    </div>
  );
}
