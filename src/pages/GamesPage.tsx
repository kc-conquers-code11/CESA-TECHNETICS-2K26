import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { eventsList, tagColors } from '../data/event';

const techTags = ['CODING', 'HACKERTHON', 'SECURITY'];
const techEventsList = eventsList.filter((event) => techTags.includes(event.tag));

const GamesPage = () => {
  const navigate = useNavigate();

  const handleEnter = (e: React.FormEvent, title: string) => {
    e.preventDefault();
    if (title === "The Order of the Obscure Code") {
      navigate('/aptitude-round');
    } else {
      navigate('/waiting-list');
    }
  };

  return (
    <div className="min-h-screen bg-[#021516] text-[#d4af37] p-8 pt-24">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-6xl md:text-7xl text-center mb-16 drop-shadow-[0_0_15px_rgba(212,175,55,0.8)] font-harry"
      >
        The Triwizard Challenges
      </motion.h1>
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${techEventsList.length} gap-10 max-w-7xl mx-auto`}>
        {techEventsList.map((event, index) => (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            key={index}
            className="bg-[#051112] border-2 border-[#d4af37] rounded-xl relative overflow-hidden group shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:shadow-[0_0_25px_rgba(212,175,55,0.6)] transition-all duration-500 flex flex-col h-full"
          >
            <div className="p-6 grow flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-3xl text-[#FFD700] font-wizard">{event.title}</h2>
                <span className={`text-xs font-bold px-2 py-1 rounded border backdrop-blur-sm ${tagColors[event.tag] || 'text-gray-300 border-gray-500'}`}>
                  {event.tag}
                </span>
              </div>
              <p className="text-sm text-gray-300 mb-6 font-sans leading-relaxed grow">{event.shortDesc}</p>

              <div className="flex justify-between items-center text-sm font-sans mb-2 border-t border-[#d4af37]/20 pt-4">
                <div className="flex flex-col">
                  <span className="text-[#d4af37]/70 text-xs uppercase tracking-wider">Team Size</span>
                  <span className="text-white font-semibold">{event.team} Members</span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-[#d4af37]/70 text-xs uppercase tracking-wider">Prize Pool</span>
                  <span className="text-[#FFD700] font-bold text-lg">{event.prize}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#021c1e] p-6 border-t border-[#d4af37]/30">
              <form onSubmit={(e) => handleEnter(e, event.title)} className="space-y-4 font-sans">
                <div>
                  <input
                    type="email"
                    placeholder="Leader email"
                    required
                    className="w-full bg-[#021516] border border-[#d4af37]/60 text-white px-4 py-2 rounded focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition-all placeholder:text-[#d4af37]/50"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    className="w-full bg-[#021516] border border-[#d4af37]/60 text-white px-4 py-2 rounded focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition-all placeholder:text-[#d4af37]/50"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0px 0px 15px rgba(255,215,0,0.6)" }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-linear-to-r from-[#8a6e2e] to-[#d4af37] text-black font-bold py-3 px-4 rounded hover:from-[#d4af37] hover:to-[#FFD700] transition-colors mt-6 text-2xl tracking-wide shadow-[0_0_10px_rgba(212,175,55,0.4)] font-wizard"
                >
                  Enter
                </motion.button>
              </form>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default GamesPage;
