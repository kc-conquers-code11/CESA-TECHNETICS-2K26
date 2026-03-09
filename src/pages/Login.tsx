import { useState } from "react";
import { loginApi } from "../lib/auth";
import { useNavigate, Link } from "react-router-dom";
import { useCompetitionStore } from "../store/competitionStore";

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

            localStorage.setItem("token", res.session?.access_token || "");

            if (res.user) {
                await initializeUser(res.user.id, res.user.email || "");
            }

            if (res.isAdmin) {
                navigate("/admin");
            } else {
                navigate("/waiting-area");
            }

        } catch (err: any) {
            alert(err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#021516] text-[#e0e0e0] p-4 font-inter relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#008080]/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-[100px]" />

            <div className="w-full max-w-[900px] h-[550px] grid md:grid-cols-2 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(212,175,55,0.15)] border border-[#d4af37]/30 z-10 bg-[#0a1f20]/90 backdrop-blur-md">

                {/* LEFT — THEME SIDE */}
                <div className="hidden md:flex flex-col justify-center items-center p-10 relative bg-gradient-to-br from-[#021516] to-[#04282a]">
                    <h1 className="text-5xl font-wizard text-[#d4af37] text-center mb-4 tracking-wider drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]">
                        Technetics 26
                    </h1>
                    <p className="text-[#00ffff] font-harry text-2xl text-center bg-clip-text">
                        Enter the Wizarding World<br />
                        of Code and Logic
                    </p>
                </div>

                {/* RIGHT — FORM */}
                <div className="p-10 flex flex-col justify-center">
                    <h2 className="text-3xl font-wizard mb-8 text-[#d4af37] tracking-widest text-center">Magical Access</h2>

                    <div className="space-y-4">
                        <div>
                            <input
                                className="w-full p-3 bg-[#021516]/50 border border-[#008080]/50 rounded text-white placeholder:text-[#008080] focus:outline-none focus:border-[#d4af37] transition-colors"
                                placeholder="Incantation (Email)"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <input
                                className="w-full p-3 bg-[#021516]/50 border border-[#008080]/50 rounded text-white placeholder:text-[#008080] focus:outline-none focus:border-[#d4af37] transition-colors"
                                type="password"
                                placeholder="Secret Passphrase"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                            />
                        </div>

                        <button
                            onClick={handleLogin}
                            disabled={loading}
                            className="w-full mt-4 bg-gradient-to-r from-[#d4af37] to-[#aa8c2c] hover:from-[#aa8c2c] hover:to-[#8b7324] text-[#021516] disabled:opacity-50 disabled:cursor-not-allowed transition p-3 rounded font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                        >
                            {loading ? "Casting Spell..." : "Enter Realm"}
                        </button>

                        <p className="text-sm text-[#008080] mt-6 text-center font-manrope">
                            Not a registered wizard?{" "}
                            <Link to="/signup" className="text-[#d4af37] hover:underline font-bold">
                                Apply here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
