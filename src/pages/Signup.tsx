import { useState } from "react";
import { signupApi } from "../lib/auth";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const STARS = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 1 + Math.random() * 2,
  duration: 2 + Math.random() * 3,
  delay: Math.random() * 5,
  color: (i % 3 === 0) ? '#B5FFF0' : (i % 2 === 0) ? '#ffffff' : '#d4af37',
}));

export default function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [verifying, setVerifying] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    class: "FE",
    division: "A",
    branch: "COMPS",
    isDarkMark: false,
    isObscure: false,
    teamName: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying(true);

    // Simulate a brief magic reveal
    setTimeout(() => {
      if (inviteCode === "TECHNETICS_26") {
        setIsVerified(true);
      } else {
        alert("The seal remains closed. Invalid Invitation Code.");
      }
      setVerifying(false);
    }, 800);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    // Basic Validation
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      await signupApi(form);
      alert("Signup successful! You can now login.");
      navigate("/games");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Signup failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-[#021516] flex items-center justify-center p-4 md:p-12 py-24 overflow-x-hidden overflow-y-auto">
      {/* ── TWINKLING STARS BACKGROUND ────────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {STARS.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              background: star.color,
              boxShadow: `0 0 10px 1px ${star.color}66`,
            }}
            animate={{ opacity: [0, 0.7, 0.2, 0.8, 0], scale: [0.5, 1, 0.8, 1.2, 0.5] }}
            transition={{ duration: star.duration, delay: star.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* SVG filter for rough deckled edges */}
      <svg className="absolute w-0 h-0" xmlns="http://www.w3.org/2000/svg">
        <filter id="deckle-edges">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" />
        </filter>
      </svg>

      {/* Ambient particles background */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#B5FFF0]/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#B5FFF0]/5 blur-[150px] rounded-full animate-pulse delay-1000" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative w-full max-w-2xl min-h-[70vh] flex flex-col group z-10"
      >
        {/* ── THE LEATHER BOOK COVER ── */}
        <div className="absolute inset-x-0 -inset-y-6 bg-[#1a0f08] rounded-[6px] shadow-[0_60px_100px_-20px_rgba(0,0,0,0.95)] border-r-8 border-b-8 border-black/50 transform scale-[1.01] -z-10" />

        <div className="flex-1 relative overflow-hidden flex flex-col p-8 md:p-12 rounded-sm">
          {/* ── PARCHMENT BACKGROUND LAYER (Isolated Filter) ── */}
          <div className="absolute inset-0 bg-[#f2e0b5] shadow-[inset_0_0_100px_rgba(139,115,85,0.4)] parchment-rough-edges -z-10" />
          {/* Complex Parchment Layering */}
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/rice-paper.png')]" />
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stained-paper.png')]" />

          {/* Inked Borders */}
          <div className="absolute inset-6 border border-[#3d2618]/10 pointer-events-none rounded-sm" />

          <motion.div
            key={isVerified ? "form" : "guard"}
            initial={{ opacity: 0, x: isVerified ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full flex-1 flex flex-col"
          >
            {!isVerified ? (
              /* ── INVITATION GUARD VIEW ── */
              <div className="flex-1 flex flex-col items-center justify-center text-center z-10 py-12">
                <div className="mb-8">
                  <h2 className="font-wizard text-3xl md:text-5xl ink-text tracking-tight mb-4">
                    ACCESS DENIED
                  </h2>
                  <p className="font-crimson italic text-lg text-[#3d2618] max-w-sm mx-auto">
                    "Only those with the sacred script may enter the Registry of Technetics."
                  </p>
                </div>

                <form onSubmit={handleVerify} className="w-full max-w-xs space-y-6">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter Invitation Script"
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value)}
                      required
                      className="w-full bg-[#1a0f08]/5 border-b-2 border-[#1a0f08]/30 focus:border-[#8b6e2e] py-3 px-2 text-[#1a0f08] placeholder:text-[#1a0f08]/30 outline-none transition-all font-crimson text-xl text-center tracking-widest uppercase"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: "#c4a04d" }}
                    whileTap={{ scale: 0.98 }}
                    disabled={verifying}
                    className="w-full py-4 bg-[#d4af37] text-[#1a0f08] font-wizard text-2xl rounded shadow-lg border border-[#1a0f08]/15 disabled:opacity-50"
                  >
                    {verifying ? "Unsealing..." : "Verify Intent"}
                  </motion.button>
                </form>

                <p className="mt-8 font-crimson text-[#3d2618]/60 italic">
                  Lost your script? Contact the Ministry.
                </p>
              </div>
            ) : (
              /* ── REGISTRATION FORM VIEW ── */
              <div className="w-full flex-1 flex flex-col">
                {/* Header */}
                <div className="text-center z-10 mb-8 mt-4">
                  <h2 className="font-wizard text-3xl md:text-5xl ink-text tracking-tight leading-[1.1]">
                    CREATE ACCOUNT
                  </h2>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSignup} className="relative z-10 space-y-6 w-full max-w-md mx-auto">
                  <div className="space-y-4">
                    <input
                      name="teamName"
                      placeholder="Team Name"
                      className="w-full bg-[#1a0f08]/5 border-b-2 border-[#1a0f08]/30 focus:border-[#8b6e2e] py-2 px-2 text-[#1a0f08] placeholder:text-[#1a0f08]/30 outline-none transition-all font-crimson text-lg"
                      onChange={handleChange}
                      value={form.teamName}
                    />

                    <div className="flex gap-4">
                      <input
                        name="firstName"
                        placeholder="First Name"
                        className="w-1/2 bg-[#1a0f08]/5 border-b-2 border-[#1a0f08]/30 focus:border-[#8b6e2e] py-2 px-2 text-[#1a0f08] placeholder:text-[#1a0f08]/30 outline-none transition-all font-crimson text-lg"
                        onChange={handleChange}
                        value={form.firstName}
                      />
                      <input
                        name="lastName"
                        placeholder="Last Name"
                        className="w-1/2 bg-[#1a0f08]/5 border-b-2 border-[#1a0f08]/30 focus:border-[#8b6e2e] py-2 px-2 text-[#1a0f08] placeholder:text-[#1a0f08]/30 outline-none transition-all font-crimson text-lg"
                        onChange={handleChange}
                        value={form.lastName}
                      />
                    </div>

                    <input
                      name="email"
                      type="email"
                      placeholder="Email Address"
                      className="w-full bg-[#1a0f08]/5 border-b-2 border-[#1a0f08]/30 focus:border-[#8b6e2e] py-2 px-2 text-[#1a0f08] placeholder:text-[#1a0f08]/30 outline-none transition-all font-crimson text-lg"
                      onChange={handleChange}
                      value={form.email}
                    />
                    <input
                      name="password"
                      type="password"
                      placeholder="Password (Min 6 chars)"
                      className="w-full bg-[#1a0f08]/5 border-b-2 border-[#1a0f08]/30 focus:border-[#8b6e2e] py-2 px-2 text-[#1a0f08] placeholder:text-[#1a0f08]/30 outline-none transition-all font-crimson text-lg"
                      onChange={handleChange}
                      value={form.password}
                    />
                  </div>

                  {/* Dropdowns */}
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.3em] text-[#3d2618]/50 font-bold mb-2 block">Class Details</label>
                    <div className="grid grid-cols-3 gap-3">
                      <select
                        name="class"
                        value={form.class}
                        className="bg-[#1a0f08]/5 border-b border-[#1a0f08]/20 focus:border-[#8b6e2e] p-2 text-[#1a0f08] font-crimson outline-none cursor-pointer"
                        onChange={handleChange}
                      >
                        <option>FE</option><option>SE</option><option>TE</option><option>BE</option>
                      </select>

                      <select
                        name="division"
                        value={form.division}
                        className="bg-[#1a0f08]/5 border-b border-[#1a0f08]/20 focus:border-[#8b6e2e] p-2 text-[#1a0f08] font-crimson outline-none cursor-pointer"
                        onChange={handleChange}
                      >
                        <option>A</option><option>B</option><option>C</option><option>D</option><option>E</option>
                      </select>

                      <select
                        name="branch"
                        value={form.branch}
                        className="bg-[#1a0f08]/5 border-b border-[#1a0f08]/20 focus:border-[#8b6e2e] p-2 text-[#1a0f08] font-crimson outline-none cursor-pointer"
                        onChange={handleChange}
                      >
                        <option>COMPS</option>
                        <option>IT</option>
                        <option>AIML</option>
                        <option>ECS</option>
                        <option>MECH</option>
                      </select>
                    </div>
                  </div>

                  {/* Registration Checkboxes */}
                  <div className="space-y-3 py-2">
                    <div className="flex items-center gap-3">
                      <input
                        id="isObscure"
                        name="isObscure"
                        type="checkbox"
                        checked={form.isObscure}
                        className="w-4 h-4 accent-[#8b6e2e] bg-[#1a0f08]/5 border-[#1a0f08]/30 rounded cursor-pointer"
                        onChange={(e) => setForm({ ...form, isObscure: e.target.checked })}
                      />
                      <label htmlFor="isObscure" className="text-sm font-crimson italic text-[#3d2618] cursor-pointer select-none">
                        Register for The Order of Obscure Code
                      </label>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        id="isDarkMark"
                        name="isDarkMark"
                        type="checkbox"
                        checked={form.isDarkMark}
                        className="w-4 h-4 accent-[#8b6e2e] bg-[#1a0f08]/5 border-[#1a0f08]/30 rounded cursor-pointer"
                        onChange={(e) => setForm({ ...form, isDarkMark: e.target.checked })}
                      />
                      <label htmlFor="isDarkMark" className="text-sm font-crimson italic text-[#3d2618] cursor-pointer select-none">
                        Register for Dark Mark Bounty
                      </label>
                    </div>
                  </div>

                  <div className="pt-4 pb-2">
                    <motion.button
                      whileHover={{
                        scale: 1.02,
                        backgroundColor: "#c4a04d",
                        boxShadow: "0 10px 20px -10px rgba(0,0,0,0.3)"
                      }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-[#d4af37] text-[#1a0f08] font-wizard text-3xl rounded shadow-lg transition-all border border-[#1a0f08]/15 tracking-wide flex items-center justify-center relative group/btn disabled:opacity-50"
                    >
                      <span>{loading ? "Registering..." : "Enter the Registry"}</span>
                      <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-10 transition-opacity bg-white/20 blur-md rounded" />
                    </motion.button>
                  </div>
                </form>
              </div>
            )}
          </motion.div>

          <p className="text-center z-10 mt-6 font-crimson text-[#3d2618]/70 italic">
            Part of a lineage?{" "}
            <Link to="/games" className="text-[#8b6e2e] hover:underline font-bold not-italic">Login instead</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}