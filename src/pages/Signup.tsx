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
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSignup = async () => {
        if (!form.firstName || !form.lastName || !form.email || !form.password) {
            alert("Please provide all details to cast your spell");
            return;
        }

        setLoading(true);
        try {
            await signupApi(form);
            alert("Application accepted! You may now enter the realm.");
            navigate("/login");
        } catch (err: any) {
            console.error(err);
            alert(err.message || "Enchantment failed. Check console.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#021516] text-[#e0e0e0] p-4 font-inter relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#008080]/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-[100px]" />

            <div className="w-full max-w-[460px] p-8 rounded-2xl border border-[#d4af37]/40 bg-[#0a1f20]/90 backdrop-blur-md shadow-[0_0_40px_rgba(212,175,55,0.15)] z-10">

                <h2 className="text-3xl font-wizard text-center mb-6 tracking-widest text-[#d4af37] drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]">
                    ENROLL WIZARD
                </h2>

                {/* First + Last name */}
                <div className="flex gap-3 mb-3">
                    <input
                        name="firstName"
                        placeholder="First Name"
                        className="w-1/2 p-3 bg-[#021516]/50 border border-[#008080]/50 rounded text-white placeholder:text-[#008080] focus:outline-none focus:border-[#d4af37] transition-colors"
                        onChange={handleChange}
                    />
                    <input
                        name="lastName"
                        placeholder="Last Name"
                        className="w-1/2 p-3 bg-[#021516]/50 border border-[#008080]/50 rounded text-white placeholder:text-[#008080] focus:outline-none focus:border-[#d4af37] transition-colors"
                        onChange={handleChange}
                    />
                </div>

                <input
                    name="email"
                    type="email"
                    placeholder="Incantation (Email)"
                    className="w-full p-3 mb-3 bg-[#021516]/50 border border-[#008080]/50 rounded text-white placeholder:text-[#008080] focus:outline-none focus:border-[#d4af37] transition-colors"
                    onChange={handleChange}
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Secret Passphrase (Min 6 chars)"
                    className="w-full p-3 mb-4 bg-[#021516]/50 border border-[#008080]/50 rounded text-white placeholder:text-[#008080] focus:outline-none focus:border-[#d4af37] transition-colors"
                    onChange={handleChange}
                />

                {/* Dropdowns */}
                <label className="text-xs text-[#008080] mb-1 block font-bold tracking-wider uppercase">Wizarding House</label>
                <div className="grid grid-cols-3 gap-3 mb-8">
                    <select name="class" className="p-2 bg-[#021516]/80 border border-[#008080]/50 rounded focus:border-[#d4af37] outline-none text-[#e0e0e0]" onChange={handleChange}>
                        <option>FE</option><option>SE</option><option>TE</option><option>BE</option>
                    </select>

                    <select name="division" className="p-2 bg-[#021516]/80 border border-[#008080]/50 rounded focus:border-[#d4af37] outline-none text-[#e0e0e0]" onChange={handleChange}>
                        <option>A</option><option>B</option><option>C</option><option>D</option><option>E</option>
                    </select>

                    <select name="branch" className="p-2 bg-[#021516]/80 border border-[#008080]/50 rounded focus:border-[#d4af37] outline-none text-[#e0e0e0]" onChange={handleChange}>
                        <option>COMPS</option>
                        <option>IT</option>
                        <option>AIML</option>
                        <option>ECS</option>
                        <option>MECH</option>
                    </select>
                </div>

                <button
                    onClick={handleSignup}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-[#d4af37] to-[#aa8c2c] hover:from-[#aa8c2c] hover:to-[#8b7324] text-[#021516] disabled:opacity-50 disabled:cursor-not-allowed transition py-3 rounded-lg font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                >
                    {loading ? "ENROLLING..." : "DECLARE ALLEGIANCE"}
                </button>

                <p className="text-center text-sm text-[#008080] mt-6 font-manrope">
                    Already a sworn wizard?{" "}
                    <Link to="/login" className="text-[#d4af37] hover:underline font-bold">Return to Realm</Link>
                </p>
            </div>
        </div>
    );
}
