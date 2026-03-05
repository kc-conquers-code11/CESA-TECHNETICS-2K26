import { motion } from 'framer-motion';

const WhatIsTechnetics = () => (
  <div className="bg-[#021516] px-6 md:px-12 py-24 text-white">
    <motion.div
      id="about"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="max-w-7xl mx-auto"
    >
      <h2 className="text-4xl md:text-5xl text-[#d4af37] mb-10" style={{ fontFamily: "'Cinzel', serif" }}>
        What is Technetics?
      </h2>
      <div className="border border-[#d4af37]/20 rounded-2xl p-8 md:p-12 bg-gradient-to-br from-[#031d1f] to-[#021516] shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/5 rounded-full blur-3xl -mr-32 -mt-32 transition-all group-hover:bg-[#d4af37]/10" />
        <h3 className="text-2xl font-bold text-teal-100 mb-6 flex items-center gap-3">
          <span className="h-[1px] w-8 bg-teal-500" />
          An Arcane-Tech Convergence
        </h3>
        <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-4xl">
          Technetics 2K26 is the flagship technical festival of{' '}
          <span className="text-[#d4af37] font-semibold">VPPCOE&VA</span>. It is a mystical realm where
          the boundaries of technology and magic blur. Join us for three days of intense coding battles,
          hardware enchantments, and arcane design challenges. Whether you are a master sorcerer of code
          or a novice wizard looking to learn, Technetics has a trial waiting for you.
        </p>
      </div>
    </motion.div>
  </div>
);

export default WhatIsTechnetics;