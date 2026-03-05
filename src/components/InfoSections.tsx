import { motion } from 'framer-motion';
import Sponsors from './Sponsors';

const InfoSections = () => {
  const handleRegistration = () => {
    window.open("https://clubly-vppcoe.vercel.app/events", "_blank");
  };

  const handleDiscord = () => {
    window.open("https://discord.gg/k6QYC64N", "_blank");
  };

  return (
    <div className="bg-[#021516] px-6 md:px-12 py-24 text-white font-inter space-y-32">
      
      {/* 2. Official Registration Portal (Clubly) */}
      <motion.div
        id="clubly"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto border-2 border-teal-500/30 rounded-3xl p-8 md:p-16 bg-[#021b1c] relative overflow-hidden text-center md:text-left"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-500 to-transparent"></div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex-1">
            <div className="inline-block px-4 py-1 bg-teal-900/40 text-teal-300 border border-teal-700 rounded-full text-[10px] font-black tracking-[0.3em] mb-6">
              POWERED BY CLUBLY
            </div>

            <h2
              className="text-4xl md:text-5xl mb-6"
              style={{
                fontFamily: "BlackChancery",
                color: "#EFD290",
                fontWeight: "normal"
              }}
            >
              Secure Your Seat in the Ministry of Magic
            </h2>

            <p className="text-[#BFE7DD] max-w-xl text-base md:text-lg mb-8 leading-relaxed">
              Clubly is our official all-in-one digital gateway. Manage your team, track trial progress,
              and download your enchanted certificates through the portal developed by Shaan Edroos.
            </p>

            <button
              onClick={handleRegistration}
              className="px-10 py-4 bg-teal-500 text-black hover:bg-teal-400 rounded-xl transition-all font-black text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(20,184,166,0.3)]"
            >
              Register on Clubly
            </button>
          </div>

          <div className="hidden lg:block w-1/3 opacity-20">
            {/* Optional decoration */}
          </div>
        </div>
      </motion.div>

      {/* 3. Discord Section */}
      <div className="max-w-7xl mx-auto space-y-32">
        <div id="discord" className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2
              className="text-4xl text-[#d4af37] mb-8"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Join The Owl Network
            </h2>

            <div className="space-y-6 mb-10">
              {[
                'Instant Trial Q&A',
                '24/7 Arcane Bot Support',
                'Live Ministry Announcements',
                'Direct Organizer Interaction'
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 group">
                  <div className="h-2 w-2 rounded-full bg-[#d4af37] group-hover:scale-150 transition-transform"></div>
                  <span className="text-gray-300 text-lg">{item}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleDiscord}
              className="px-8 py-4 border-2 border-indigo-500 text-indigo-300 hover:bg-indigo-900/40 hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] rounded-xl transition-all font-bold uppercase tracking-widest text-sm"
            >
              Join Discord Server
            </button>
          </motion.div>

          {/* Discord Visual */}
          <div className="h-80 bg-gradient-to-br from-[#042a2b] to-[#021516] border border-[#d4af37]/20 rounded-2xl flex items-center justify-center shadow-2xl relative overflow-hidden group">

            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>

            <div className="text-center z-10 transition-transform group-hover:scale-110 duration-500">

              <img
                src="/Discord.png"
                alt="Wizard Discord Logo"
                className="w-40 md:w-56 mx-auto mb-4 drop-shadow-[0_0_25px_rgba(239,210,144,0.6)]"
              />

              <p
                className="text-xs tracking-[0.5em] uppercase"
                style={{
                  color: "#EFD290",
                  fontFamily: "BlackChancery"
                }}
              >
                Owl Signal Active
              </p>

            </div>

            <div className="absolute -bottom-10 w-64 h-20 bg-teal-500/20 rounded-[100%] blur-[60px]"></div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default InfoSections;