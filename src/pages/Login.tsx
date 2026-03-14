import { useState } from "react";
import { loginApi } from "../lib/auth";
import { useNavigate, Link } from "react-router-dom";
import { useCompetitionStore } from "@/store/competitionStore"; // Store update karne ke liye

export default function Login() {
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
      
      // Initialize Zustand Store (Important for Exam Flow)
      if (res.user) {
        await initializeUser(res.user.id, res.user.email || "");
      }

      // REDIRECT LOGIC
      if (res.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/rules"); // Rules Page / Home
      }

    } catch (err: any) {
      alert(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
      <div className="w-full max-w-[900px] h-[500px] grid md:grid-cols-2 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(255,0,0,0.25)] border border-red-900/30">

        {/* LEFT — THEME SIDE */}
        <div className="hidden md:flex bg-gradient-to-br from-red-700 via-red-900 to-black p-10 flex-col justify-center relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
          <h1 className="text-4xl font-bold tracking-widest font-display z-10">CESA CodeArena</h1>
          <p className="mt-4 text-sm text-red-200 z-10">
            Enter the Forbidden Forest.<br />
            Prove your magical skills.
          </p>
        </div>

        {/* RIGHT — FORM */}
        <div className="bg-zinc-950 p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold mb-6 font-display text-red-500">Sign In</h2>

          <input
            className="mb-3 p-3 bg-zinc-900 border border-zinc-700 rounded focus:outline-none focus:border-red-500 text-white placeholder:text-zinc-500"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="mb-4 p-3 bg-zinc-900 border border-zinc-700 rounded focus:outline-none focus:border-red-500 text-white placeholder:text-zinc-500"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition p-3 rounded font-semibold tracking-wide"
          >
            {loading ? "Accessing..." : "LOGIN"}
          </button>

          {/* <p className="text-sm text-zinc-400 mt-4 text-center">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-red-500 hover:underline">
              Sign up
            </Link>
          </p> */}
        </div>
      </div>
    </div>
  );
}