import { useState } from "react";
import { loginApi } from "../lib/auth";
import { useNavigate } from "react-router-dom";
import { useCompetitionStore } from "@/store/competitionStore";
import { toast } from "sonner";
import { Shield } from "lucide-react";

export default function DarkMarkLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { initializeUser } = useCompetitionStore();

  const handleLogin = async () => {
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
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
      <div className="w-full max-w-[420px] p-8 rounded-2xl border border-red-900/50 bg-zinc-950 shadow-[0_0_50px_rgba(153,27,27,0.3)]">
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mb-4 border border-red-500/30">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold tracking-widest font-display text-red-500 text-center uppercase">
            Dark Mark Access
          </h2>
          <p className="text-zinc-500 text-xs mt-2 uppercase tracking-tighter">Authorized Personnel Only</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-zinc-500 uppercase font-bold mb-1 block ml-1">Secure Email</label>
            <input
              className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded focus:outline-none focus:border-red-600 text-white placeholder:text-zinc-600 transition-all"
              placeholder="agent@strangertech.in"
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-red-700 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all py-3 rounded-lg font-bold tracking-widest text-white shadow-lg shadow-red-900/20"
          >
            {loading ? "AUTHENTICATING..." : "VERIFY IDENTITY"}
          </button>
        </div>
      </div>
    </div>
  );
}
