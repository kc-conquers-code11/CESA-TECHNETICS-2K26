import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const eventsList = [
  {
    title: "The Fallen Phoenix",
    shortDesc: "A wizarding murder mystery where logic, observation, and teamwork will decide who uncovers the truth.",
    fullDesc: "A powerful figure has fallen, and the truth lies hidden within clues, secrets, and contradictions. Step into the role of investigators and unravel a magical conspiracy before time runs out. Work in teams to analyze clues, letters, and evidence, decode hidden messages, and connect timelines, suspects, and motives. This challenge is a true test of deduction and sharp thinking.",
    rules: ["Team of 2–3 members", "Analyze clues, letters, and evidence", "Decode hidden messages", "Registration Fee: ₹150"],
    team: "2-3", prize: "₹8,000", tag: "FUN/MYSTERY",
    image: '/events/1.png',
    registerLink: 'https://clubly-vppcoe.vercel.app/events/69a8845cf929e5d7bd887923',
  },
  {
    title: "The Grand Talent Concave",
    shortDesc: "A high-energy talent showcase where creativity, confidence, and entertainment take center stage.",
    fullDesc: "Whether it's singing, dancing, music, rap, crowd work, stand-up comedy, acting, storytelling, or any talent — this is your moment to shine under the spotlight. The stage will also feature fun audience interactions, mini-games, and lively conversations that make the experience entertaining for everyone. Step onto the stage, entertain the live audience, and own the spotlight.",
    rules: ["Solo or Team Performers", "Open to all talents (comedy, music, dance, etc.)", "Registration Fee: ₹80 (Performers)", "Audience Ticket: ₹30"],
    team: "1-2", prize: "₹15,000", tag: "TALENT",
    image: '/events/2.png',
    registerLink: 'https://clubly-vppcoe.vercel.app/events/69a885ecf929e5d7bd88794e',
  },
  {
    title: "Filming the Forbidden",
    shortDesc: "A short film-making challenge where creativity pushes boundaries and storytelling unveils the unseen.",
    fullDesc: "Step behind the camera and transform a given theme into a powerful cinematic experience. From concept development to final edit, your team will craft a compelling short film within the allotted time. Interpret the revealed theme creatively, demonstrate direction, cinematography, and storytelling, and deliver a film that captivates both judges and audience.",
    rules: ["Team of 1-3 members", "Theme revealed on 16th March", "Script, shoot, and edit your short film", "Registration Fee: ₹80"],
    team: "1-3", prize: "₹3,000", tag: "FILM-MAKING",
    image: '/events/3.png',
    registerLink: 'https://clubly-vppcoe.vercel.app/events/69a91d6c9a02d9b1fb15497f',
  },
  {
    title: "The Last Horcrux",
    shortDesc: "An immersive treasure hunt where intelligence, strategy, and teamwork determine who survives the quest.",
    fullDesc: "Inspired by the magical universe of Harry Potter, this challenge will test your logic, decoding skills, and ability to think under pressure. Participants will navigate through multiple thrilling rounds, decode mysterious clues and encrypted messages, and solve logic-based and technical puzzles. Race against time to unlock the final Horcrux and outsmart the competition.",
    rules: ["Team of 2-4 members", "Decode clues and encrypted messages", "Solve logic and technical puzzles", "Registration Fee: ₹200"],
    team: "2-4", prize: "₹15,000", tag: "TREASURE HUNT",
    image: '/events/4.png',
    registerLink: 'https://clubly-vppcoe.vercel.app/events/69a91e089a02d9b1fb15499e',
  },
  {
    title: "The Dark Mark Bounty",
    shortDesc: "The ultimate hybrid Tech & Cybersecurity challenge where physical speed meets digital intellect.",
    fullDesc: "The Dark Mark is hovering over the servers of the Wizarding World. Step into a high-energy physical envelope hunt linked to a real-time digital scoring portal. Crack ciphers, debug broken spell-scripts, and solve algorithmic puzzles before time runs out. Top teams advance to a grueling Capture The Flag finale to extract flags from stego-images, bypass vulnerable logins, and reverse-engineer cursed artifacts.",
    rules: ["Team of 2-3 members", "Bring your laptop and favorite IDE", "Basic knowledge of coding/ciphers/web vulns needed", "Registration Fee: ₹100"],
    team: "2-3", prize: "₹8,000", tag: "SECURITY",
    image: '/events/5.png',
    registerLink: 'https://clubly-vppcoe.vercel.app/events/69a91ce59a02d9b1fb15496d',
  },
  {
    title: "The Order of the Obscure Code",
    shortDesc: "A multi-round technical showdown culminating in a 15-hour online hackathon.",
    fullDesc: "In a world where ancient systems run on forgotten logic and corrupted spells of code, only the sharpest minds can restore balance. This is a legacy-driven arena where creativity, logic, and precision collide. The quest reaches its peak with a 15-hour online hackathon—the ultimate final showdown where teams brainstorm, build, and deploy complete solutions in a high-intensity sprint.",
    rules: ["Team of 2-4 members", "Multi-round technical showdown", "15-hour online hackathon finale", "Registration Fee: ₹150"],
    team: "2-4", prize: "₹12,000", tag: "HACKERTHON",
    image: '/events/6.png',
    registerLink: 'https://clubly-vppcoe.vercel.app/events/69a91ce59a02d9b1fb15496d',
  },
  {
    title: "The Philosopher's Palette",
    shortDesc: "A collaborative Canva design duel where two minds must merge visions to create a visual masterpiece.",
    fullDesc: "Just as the Philosopher’s Stone was said to create gold, creativity can transform ideas into visual masterpieces. In this unique poster-design challenge, collaboration is the ultimate spell. Teams of two must work together: the first designer sets the direction halfway, and the second must complete the vision while adapting to unexpected magical surprises.",
    rules: ["Strictly 2 members per team", "Halfway handover of design", "Adapt to 'magical surprises' mid-round", "Registration Fee: ₹60"],
    team: "2", prize: "₹2,000", tag: "DESIGN",
    image: '/events/7.png',
    registerLink: 'https://clubly-vppcoe.vercel.app/events/69a8094f99bfd06ab681c561',
  },
  {
    title: "The Tri-Wizard Tournament",
    shortDesc: "A grueling multi-stage trial testing three core strengths: Logic, Creativity, and Teamwork.",
    fullDesc: "In a realm where courage meets intelligence, only the most balanced teams survive. This is the ultimate trial of adaptability. Face off in mind-bending puzzles and rapid-fire rounds that demand flawless coordination. You must delegate responsibilities wisely and think under pressure to outplay the competition and claim the title of Champion.",
    rules: ["Team of 2–3 participants", "Dynamic puzzle rounds", "Rapid-fire strategic challenges", "Registration Fee: ₹150"],
    team: "2-3", prize: "₹12,000", tag: "CODING",
    image: '/events/8.png',
    registerLink: 'https://clubly-vppcoe.vercel.app/events/69a922a59a02d9b1fb154a66',
  },
];

const tagColors: Record<string, string> = {
  "FUN/MYSTERY":      "text-purple-300 bg-purple-900/30 border-purple-700/50",
  "TALENT":   "text-orange-300 bg-orange-900/30 border-orange-700/50",
  "FILM-MAKING":      "text-pink-300 bg-pink-900/30 border-pink-700/50",
  "CODING":     "text-blue-300 bg-blue-900/30 border-blue-700/50",
  "SECURITY":   "text-red-300 bg-red-900/30 border-red-700/50",
  "HACKERTHON":   "text-green-300 bg-green-900/30 border-green-700/50",
  "TREASURE HUNT":      "text-cyan-300 bg-cyan-900/30 border-cyan-700/50",
  "DESIGN": "text-yellow-300 bg-yellow-900/30 border-yellow-700/50",
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
      className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-8"
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
        <div className="h-1 w-full bg-linear-to-r from-transparent via-[#d4af37] to-transparent" />

        <div className="relative w-full h-52 bg-linear-to-br from-black/80 to-[#021516] flex items-center justify-center overflow-hidden">
          {event.image
            ? <img src={event.image} alt={event.title} className="w-full h-full object-cover opacity-70" />
            : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full border border-[#d4af37]/30 flex items-center justify-center text-3xl text-[#d4af37]/40">✦</div>
                <span className="text-[10px] text-gray-600 uppercase tracking-widest">Poster Coming Soon</span>
              </div>
            )
          }
          <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-[#021c1e] to-transparent" />
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
          <div className="w-full flex-1 bg-linear-to-br from-black/70 to-[#021516] flex items-center justify-center relative overflow-hidden">
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
          <p className="text-sm text-gray-300 leading-relaxed grow">{event.shortDesc}</p>

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