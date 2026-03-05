import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const eventsList = [
  {
    title: "The Fallen Phoenix",
    shortDesc: "A high-stakes model-building race where wizards of data science compete using magical datasets.",
    fullDesc: "The Tri-Wizard Tournament is the ultimate test of AI/ML mastery. Participants will be given enchanted datasets shrouded in mystery and must build, train, and deploy the most powerful machine learning model within the time limit. Expect data wrangling challenges, feature engineering puzzles, and evaluation metrics that will push even the most seasoned data wizards to their limits. The champion who achieves the highest accuracy on the hidden test set claims the Tournament Cup and the glory of the Ministry.",
    rules: ["Team of 2–3 members", "Datasets provided on the day", "Submissions via Kaggle-style portal", "No pre-trained models allowed", "Judged on accuracy + creativity"],
    team: "2-3", prize: "₹8,000", tag: "AI/ML",
    image: '/events/1.png',
    registerLink: 'https://clubly-vppcoe.vercel.app/events/69a8845cf929e5d7bd887923',
  },
  {
    title: "The Grand Talent Concave",
    shortDesc: "Autonomous drones battle across arcane arenas in a test of engineering and real-time control.",
    fullDesc: "Dark forces have invaded the arena. Teams must program autonomous drones to navigate treacherous obstacle courses, locate targets, and eliminate rivals in real-time combat. This trial tests your skills in embedded systems, PID control, computer vision, and split-second decision-making. The drone that survives the longest and completes the most objectives claims the Dark Mark Bounty prize.",
    rules: ["Team of 1-2 members", "Drones must be autonomous", "Hardware provided or BYOD", "Safety gear mandatory", "Judged on task completion + survival time"],
    team: "1-2", prize: "₹15,000", tag: "ROBOTICS",
    image: '/events/2.png',
    registerLink: 'https://clubly-vppcoe.vercel.app/events/69a885ecf929e5d7bd88794e',
  },
  {
    title: "Filming the Forbidden",
    shortDesc: "Design spellbinding interfaces under pressure in a timed design duel.",
    fullDesc: "Armed only with your design tools and arcane creativity, you must conjure breathtaking user interfaces within a strict time limit. Themes will be revealed on the day — expect the unexpected. Your designs will be judged on usability, visual hierarchy, aesthetic appeal, and how well they solve the given problem. The Half Blood Prince left no annotations here — you are on your own.",
    rules: ["Team of 1-3 members", "Figma / Adobe XD allowed", "Theme revealed on event day", "60-minute design sprint", "Judged on UX + visual design"],
    team: "1-3", prize: "₹3,000", tag: "UI/UX",
    image: '/events/3.png',
    registerLink: 'https://clubly-vppcoe.vercel.app/events/69a91d6c9a02d9b1fb15497f',
  },
  {
    title: "The Last Horcrux",
    shortDesc: "Competitive coding under enchanted constraints and time pressure.",
    fullDesc: "Welcome to the most chaotic coding arena in the wizarding world. Problems will be algorithmically cursed — standard solutions won't work here. Expect twisted constraints, misdirection, and problems that seem simple but hide dark complexity. Speed, accuracy, and creative problem-solving will determine who stands atop the leaderboard when the clock strikes zero.",
    rules: ["Team of 2–4 members", "Any language allowed", "Online judge platform", "3-hour contest window", "Partial scoring enabled"],
    team: "2-4", prize: "₹15,000", tag: "CODING",
    image: '/events/4.png',
    registerLink: 'https://clubly-vppcoe.vercel.app/events/69a91e089a02d9b1fb15499e',
  },
  {
    title: "The Dark Mark Bounty",
    shortDesc: "A deep-web CTF challenge where only the most cunning survive.",
    fullDesc: "You have been summoned to the Chamber of Secrets. Hidden within its walls are flags encrypted with dark magic — only the sharpest cybersecurity minds can retrieve them. This Capture The Flag challenge covers web exploitation, reverse engineering, cryptography, steganography, and OSINT. The deeper you go, the darker the secrets. Can you survive the Chamber?",
    rules: ["Team of 2-3 members", "Jeopardy-style CTF", "No destructive attacks", "Hints available at point penalty", "Dynamic scoring based on solves"],
    team: "2-3", prize: "₹8,000", tag: "SECURITY",
    image: '/events/5.png',
    registerLink: 'https://clubly-vppcoe.vercel.app/events/69a91ce59a02d9b1fb15496d',
  },
  {
    title: "The Order of the Obscure Code",
    shortDesc: "Blend chemical engineering with IoT hardware magic.",
    fullDesc: "The Potions dungeon awaits. Teams must design and build an IoT-integrated hardware prototype that solves a real-world problem — the more innovative, the better. You will be evaluated on your circuit design, sensor integration, code quality, and the elegance of your final prototype. Impress the panel of master potion-makers and claim your rightful place at the top of the class.",
    rules: ["Team of 2-4 members", "Hardware kits provided", "Arduino / Raspberry Pi allowed", "8-hour build window", "Demo + viva evaluation"],
    team: "2-4", prize: "₹12,000", tag: "HARDWARE",
    image: '/events/6.png',
    registerLink: 'https://clubly-vppcoe.vercel.app/events/69a91ce59a02d9b1fb15496d',
  },
  {
    title: "The Philosopher's Palette",
    shortDesc: "AR/VR exploration of historical architecture and immersive experiences.",
    fullDesc: "Step into the Pensieve and relive the past through augmented and virtual reality. Teams must create an immersive AR/VR experience centred around historical architecture or cultural heritage. Your experience will be judged on immersion, technical complexity, storytelling, and user interaction design. Transport the judges to another time and another world.",
    rules: ["Team of 2 members", "Unity / Unreal / WebXR allowed", "Pre-built assets permitted", "5-minute demo required", "Judged on immersion + innovation"],
    team: "2", prize: "₹2,000", tag: "AR/VR",
    image: '/events/7.png',
    registerLink: 'https://clubly-vppcoe.vercel.app/events/69a8094f99bfd06ab681c561',
  },
  {
    title: "The Tri-Wizard Tournament",
    shortDesc: "A FinTech and Blockchain security challenge — break the vault.",
    fullDesc: "The most secure vault in the wizarding world has been breached — or has it? Teams must design a blockchain-based FinTech solution that addresses a real-world financial security problem. Think DeFi, smart contracts, NFT utility, or fraud detection on the chain. The goblin auditors will scrutinise every line of your smart contract. Only the most airtight solution will walk away with the gold.",
    rules: ["Team of 2-3 members", "Solidity / Rust / Move allowed", "Testnet deployment required", "10-minute pitch + demo", "Judged on security + innovation"],
    team: "2-3", prize: "₹12,000", tag: "BLOCKCHAIN",
    image: '/events/8.png',
    registerLink: 'https://clubly-vppcoe.vercel.app/events/69a922a59a02d9b1fb154a66',
  },
];

const tagColors: Record<string, string> = {
  "AI/ML":      "text-purple-300 bg-purple-900/30 border-purple-700/50",
  "ROBOTICS":   "text-orange-300 bg-orange-900/30 border-orange-700/50",
  "UI/UX":      "text-pink-300 bg-pink-900/30 border-pink-700/50",
  "CODING":     "text-blue-300 bg-blue-900/30 border-blue-700/50",
  "SECURITY":   "text-red-300 bg-red-900/30 border-red-700/50",
  "HARDWARE":   "text-green-300 bg-green-900/30 border-green-700/50",
  "AR/VR":      "text-cyan-300 bg-cyan-900/30 border-cyan-700/50",
  "BLOCKCHAIN": "text-yellow-300 bg-yellow-900/30 border-yellow-700/50",
};

type Event = typeof eventsList[0];

// ── TWINKLING STARS OVERLAY ─────────────────────────────────────────────────
const STARS = Array.from({ length: 35 }, (_, i) => ({
  id: i,
  x: 2 + Math.random() * 96,
  y: 2 + Math.random() * 96,
  size: 1 + Math.random() * 2.5,
  duration: 1.0 + Math.random() * 2.5,
  delay: Math.random() * 4,
  color: i % 5 === 0 ? '#B5FFF0' : i % 3 === 0 ? '#ffffff' : '#d4af37',
}));

const TwinkleOverlay = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl z-20">
    {STARS.map((star) => (
      <motion.div
        key={star.id}
        className="absolute rounded-full"
        style={{
          left: `${star.x}%`,
          top: `${star.y}%`,
          width:  `${star.size * 3}px`,
          height: `${star.size * 3}px`,
          background: star.color,
          boxShadow: `0 0 ${star.size * 5}px ${star.size * 2}px ${star.color}99`,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{ opacity: [0, 1, 0.2, 1, 0], scale: [0.2, 1.3, 0.6, 1.4, 0.2] }}
        transition={{ duration: star.duration, delay: star.delay, repeat: Infinity, ease: 'easeInOut' }}
      />
    ))}
  </div>
);

const EventModal = ({ event, onClose }: { event: Event; onClose: () => void }) => (
  <AnimatePresence>
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      />
      <motion.div
        className="relative z-10 w-full max-w-2xl bg-[#021c1e] border border-[#d4af37]/30 rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(212,175,55,0.15)]"
        initial={{ scale: 0.85, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 40 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      >
        <TwinkleOverlay />
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />

        <div className="relative w-full h-52 bg-gradient-to-br from-black/80 to-[#021516] flex items-center justify-center overflow-hidden">
          {event.image
            ? <img src={event.image} alt={event.title} className="w-full h-full object-cover opacity-70" />
            : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full border border-[#d4af37]/30 flex items-center justify-center text-3xl text-[#d4af37]/40">✦</div>
                <span className="text-[10px] text-gray-600 uppercase tracking-widest">Poster Coming Soon</span>
              </div>
            )
          }
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#021c1e] to-transparent" />
          <span className={`absolute top-4 left-4 text-[10px] font-bold tracking-widest px-3 py-1 rounded-full border ${tagColors[event.tag] ?? ''}`}>
            {event.tag}
          </span>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-all"
          >✕</button>
        </div>

        <div className="px-8 pb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#d4af37] mb-2 leading-tight" style={{ fontFamily: "'Cinzel', serif" }}>
            {event.title}
          </h2>
          <div className="h-px w-16 bg-[#d4af37]/40 mb-5" />
          <p className="text-gray-300 text-sm leading-relaxed mb-6">{event.fullDesc}</p>

          <div className="mb-6">
            <h4 className="text-xs font-black text-[#d4af37]/70 uppercase tracking-widest mb-3">Rules & Format</h4>
            <ul className="space-y-2">
              {event.rules.map((rule, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
                  <span className="text-[#d4af37] mt-0.5">⚡</span>
                  {rule}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between pt-5 border-t border-[#d4af37]/15">
            <div className="flex gap-8">
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Team Size</p>
                <p className="text-sm font-bold text-teal-100 mt-1">{event.team}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Prize Pool</p>
                <p className="text-sm font-bold text-[#d4af37] mt-1">{event.prize}</p>
              </div>
            </div>
            <button
              onClick={() => window.open(event.registerLink, '_blank')}
              className="px-6 py-3 bg-[#d4af37] text-[#021516] text-xs font-black uppercase tracking-widest rounded-xl hover:bg-[#ffd966] transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)]"
            >
              Register Now
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

const FlipCard = ({ event, index, onViewDetails }: { event: Event; index: number; onViewDetails: () => void }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="relative"
      style={{ perspective: '1200px', height: '420px' }}
    >
      <div
        onClick={() => setFlipped(!flipped)}
        className="relative w-full h-full cursor-pointer"
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 0.7s cubic-bezier(0.4, 0.2, 0.2, 1)',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* FRONT */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden border border-[#d4af37]/20 bg-[#031d1f]/60 backdrop-blur-sm shadow-xl flex flex-col"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span className={`absolute top-4 right-4 z-10 text-[10px] font-bold tracking-widest px-2 py-1 rounded border ${tagColors[event.tag] ?? ''}`}>
            {event.tag}
          </span>
          <div className="w-full flex-1 bg-gradient-to-br from-black/70 to-[#021516] flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[#d4af37]/5" />
            {event.image
              ? <img src={event.image} alt={event.title} className="w-full h-full object-cover opacity-80" />
              : (
                <div className="flex flex-col items-center gap-2 z-10">
                  <div className="w-14 h-14 rounded-full border border-[#d4af37]/30 flex items-center justify-center text-2xl text-[#d4af37]/40">✦</div>
                  <span className="text-[10px] text-gray-600 uppercase tracking-widest">Poster Coming Soon</span>
                </div>
              )
            }
          </div>
          <div className="p-5 flex flex-col gap-2 border-t border-[#d4af37]/10">
            <h3 className="text-base font-bold text-white leading-snug pr-10">{event.title}</h3>
            <p className="text-[10px] text-[#d4af37]/50 uppercase tracking-widest flex items-center gap-1">
              <span className="text-xs">↺</span> Tap to reveal details
            </p>
          </div>
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 rounded-2xl border border-[#d4af37]/30 bg-[#031d1f] shadow-2xl flex flex-col p-6"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <span className={`self-start text-[10px] font-bold tracking-widest px-2 py-1 rounded border mb-3 ${tagColors[event.tag] ?? ''}`}>
            {event.tag}
          </span>
          <h3 className="text-lg font-bold text-[#d4af37] mb-3 leading-snug" style={{ fontFamily: "'Cinzel', serif" }}>
            {event.title}
          </h3>
          <div className="h-px w-full bg-[#d4af37]/20 mb-4" />
          <p className="text-sm text-gray-300 leading-relaxed flex-grow">{event.shortDesc}</p>

          <div className="mt-4 pt-4 border-t border-[#d4af37]/15">
            <div className="flex justify-between items-center mb-4">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest">Team Size</span>
                <span className="text-sm font-bold text-teal-100 mt-1">{event.team}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest">Prize Pool</span>
                <span className="text-sm font-bold text-[#d4af37] mt-1">{event.prize}</span>
              </div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onViewDetails(); }}
              className="w-full py-3 text-xs font-black text-[#d4af37] border border-[#d4af37]/40 rounded-lg hover:bg-[#d4af37] hover:text-[#021516] transition-all duration-300 uppercase tracking-widest"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Events = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  return (
    <div className="py-24 px-6 md:px-12 bg-[#021516] min-h-screen" id="events">
      <motion.div
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
        className="max-w-7xl mx-auto mb-16 text-center md:text-left"
      >
        <h2 className="text-5xl md:text-6xl text-[#d4af37] mb-4" style={{ fontFamily: "'BlackChancery', serif" }}>
          The Eight Magical Trials
        </h2>
        <div className="h-1 w-32 bg-[#d4af37]/50 rounded-full mx-auto md:mx-0" />
        <p className="text-gray-500 text-sm mt-4 uppercase tracking-widest">Tap any card to reveal its secrets</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {eventsList.map((event, index) => (
          <FlipCard
            key={index}
            event={event}
            index={index}
            onViewDetails={() => setSelectedEvent(event)}
          />
        ))}
      </div>

      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
};

export default Events;