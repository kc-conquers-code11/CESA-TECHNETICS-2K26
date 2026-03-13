import { useState } from "react";
import { signupApi } from "../lib/auth";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    class: "FE",
    division: "A",
    branch: "COMPS",
    isDarkMark: false,
    teamName: "",
    // phoneNumber: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    // Basic Validation
    if(!form.firstName || !form.lastName || !form.email || !form.password) {
        alert("Please fill all fields");
        return;
    }

    setLoading(true);
    try {
      await signupApi(form);
      alert("Signup successful! You can now login.");
      navigate("/login");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Signup failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
      <div className="w-full max-w-[420px] p-8 rounded-xl border border-red-600/50 bg-zinc-950 shadow-[0_0_40px_rgba(220,38,38,0.2)]">

        <h2 className="text-2xl font-bold text-center mb-6 tracking-widest font-display text-red-500">
          CREATE ACCOUNT
        </h2>

        <div className="space-y-3 mb-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <input 
                name="teamName" 
                placeholder="Team Name" 
                className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded focus:border-red-500 outline-none placeholder:text-white/60" 
                onChange={handleChange} 
            />
          </div>

        {/* First + Last name */}
        <div className="flex gap-3 mb-3">
          <input
            name="firstName"
            placeholder="First Name"
            className="w-1/2 p-3 bg-zinc-900 border border-zinc-700 rounded focus:border-red-500 outline-none"
            onChange={handleChange}
          />
          <input
            name="lastName"
            placeholder="Last Name"
            className="w-1/2 p-3 bg-zinc-900 border border-zinc-700 rounded focus:border-red-500 outline-none"
            onChange={handleChange}
          />
        </div>

        <input 
            name="email" 
            type="email" 
            placeholder="Email" 
            className="w-full p-3 mb-3 bg-zinc-900 border border-zinc-700 rounded focus:border-red-500 outline-none" 
            onChange={handleChange} 
        />
        <input 
            name="password" 
            type="password" 
            placeholder="Password (Min 6 chars)" 
            className="w-full p-3 mb-3 bg-zinc-900 border border-zinc-700 rounded focus:border-red-500 outline-none" 
            onChange={handleChange} 
        />
        {/* Dropdowns */}
        <label className="text-xs text-zinc-500 mb-1 block">Class Details</label>
        <div className="grid grid-cols-3 gap-3 mb-6">
          <select name="class" className="p-2 bg-zinc-900 border border-zinc-700 rounded focus:border-red-500 outline-none" onChange={handleChange}>
            <option>FE</option><option>SE</option><option>TE</option><option>BE</option>
          </select>

          <select name="division" className="p-2 bg-zinc-900 border border-zinc-700 rounded focus:border-red-500 outline-none" onChange={handleChange}>
            <option>A</option><option>B</option><option>C</option><option>D</option><option>E</option>
          </select>

          <select name="branch" className="p-2 bg-zinc-900 border border-zinc-700 rounded focus:border-red-500 outline-none" onChange={handleChange}>
            <option>COMPS</option>
            <option>IT</option>
            <option>AIML</option>
            <option>ECS</option>
            <option>MECH</option>
          </select>
        </div>

        {/* DARK MARK CHECKBOX */}
        <div className="flex items-center gap-3 mb-6 p-3 bg-red-950/20 border border-red-900/30 rounded-lg group hover:border-red-500/50 transition-colors">
          <input
            id="isDarkMark"
            name="isDarkMark"
            type="checkbox"
            className="w-5 h-5 accent-red-600 rounded bg-zinc-900 border-zinc-700 focus:ring-0 cursor-pointer"
            onChange={(e) => setForm({ ...form, isDarkMark: e.target.checked })}
          />
          <label htmlFor="isDarkMark" className="text-sm font-semibold text-red-200 cursor-pointer select-none">
            Register for Dark Mark Bounty Round
          </label>
        </div>

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 transition py-3 rounded-lg font-semibold tracking-wide text-white"
        >
          {loading ? "CREATING..." : "SIGN UP"}
        </button>

        <p className="text-center text-sm text-zinc-400 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-red-500 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}