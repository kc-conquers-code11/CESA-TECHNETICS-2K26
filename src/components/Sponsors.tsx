import { motion } from 'framer-motion';

// ── HOUSE COLOURS & CRESTS ────────────────────────────────────────────────────
const houses = [
  {
    name: 'Gryffindor',
    primary: '#740001',
    secondary: '#D3A625',
    glow: 'rgba(212,166,37,0.4)',
    border: 'rgba(212,166,37,0.6)',
    houseLogo: '/sponsors/amazon-dark.svg',
    sponsor: { name: 'Amazon' },
  },
  {
    name: 'Slytherin',
    primary: '#1A472A',
    secondary: '#D3A625',
    glow: 'rgba(45,180,100,0.35)',
    border: 'rgba(45,180,100,0.55)',
    houseLogo: '/sponsors/Monginis_idcA6FOLoC_2.svg',
    sponsor: { name: 'Monginis' },
  },
  {
    name: 'Ravenclaw',
    primary: '#0E1A40',
    secondary: '#D3A625',
    glow: 'rgba(0,150,255,0.35)',
    border: 'rgba(0,150,255,0.55)',
    houseLogo: '/sponsors/raymond-1.svg',
    sponsor: { name: 'Raymond' },
  },
  {
    name: 'Hufflepuff',
    primary: '#ECB939',
    secondary: '#D3A625',
    glow: 'rgba(236,185,57,0.4)',
    border: 'rgba(236,185,57,0.6)',
    houseLogo: '/sponsors/pepsi-logo-svgrepo-com.svg',
    sponsor: { name: 'Pepsi' },
  },
];

// ── SCROLLING SPONSORS ────────────────────────────────────────────────────────
const scrollingSponsors = [
  { name: 'AlphaCode',   logo: '/sponsors/toyota-1-logo-svgrepo-com.svg'  },
  { name: 'ByteForge',   logo: '/sponsors/punjab-national-bank.svg'  },
  { name: 'NexGen',      logo: '/sponsors/bharat-petroleum-logo.svg'  },
  { name: 'PixelMind',   logo: '/sponsors/gatsby-logo.svg'  },
  { name: 'QuantumLeap', logo: '/sponsors/baskin.jpeg'  },
  { name: 'SkyBridge',   logo: '/sponsors/imperal.jpeg'  },
  { name: 'ArcLight',    logo: '/sponsors/lic.jpeg'  },
  { name: 'DeepRoot',    logo: '/sponsors/music.jpeg'  },
  { name: 'VectorX',     logo: '/sponsors/ONGC.jpeg'  },
  { name: 'HyperNode',   logo: '/sponsors/waffle.jpeg' },
  { name: 'ZeroAxis',    logo: '/sponsors/bata.jpg' },
  { name: 'CorePulse',   logo: '/sponsors/netflix.jpg' },
];

const specialSponsors = [
  { name: 'Quick Rentals',   logo: '/sponsors/QuickRentals_Logo.png' },
];

// Duplicate for seamless infinite scroll
const allScrolling = [...scrollingSponsors, ...scrollingSponsors];

// ── HOUSE SPONSOR CARD ────────────────────────────────────────────────────────
const HouseSponsorCard = ({ house, index }: { house: typeof houses[0]; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="relative flex flex-col items-center group"
    style={{ perspective: '800px' }}
  >
    {/* House frame card */}
    <div
      className="relative w-full rounded-2xl overflow-hidden flex flex-col items-center py-8 px-6 transition-all duration-500 group-hover:-translate-y-2"
      style={{
        background: `linear-gradient(135deg, ${house.primary}cc, #021516)`,
        border: `2px solid ${house.border}`,
        boxShadow: `0 0 30px ${house.glow}, inset 0 0 40px rgba(0,0,0,0.4)`,
      }}
    >
      {/* Corner ornaments */}
      {['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2'].map((pos, i) => (
        <div
          key={i}
          className={`absolute ${pos} w-4 h-4 pointer-events-none`}
          style={{
            borderTop: i < 2 ? `2px solid ${house.secondary}` : 'none',
            borderBottom: i >= 2 ? `2px solid ${house.secondary}` : 'none',
            borderLeft: i % 2 === 0 ? `2px solid ${house.secondary}` : 'none',
            borderRight: i % 2 === 1 ? `2px solid ${house.secondary}` : 'none',
          }}
        />
      ))}

      {/* Glow pulse on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ boxShadow: `inset 0 0 60px ${house.glow}` }}
      />

      {/* House SVG image */}
      <div
        className="w-28 h-28 mb-4 transition-transform duration-500 group-hover:scale-110"
        style={{ filter: `drop-shadow(0 0 12px ${house.glow})` }}
      >
        <img src={house.houseLogo} alt={house.name} className="w-full h-full object-contain" />
      </div>

      {/* Divider */}
      <div className="w-full h-px mb-4" style={{ background: `linear-gradient(90deg, transparent, ${house.secondary}80, transparent)` }} />

      {/* Sponsor name — text only */}
      <div
        className="w-full h-14 rounded-lg flex items-center justify-center"
        style={{
          background: 'rgba(0,0,0,0.35)',
          border: `1px solid ${house.border}`,
        }}
      >
        <p
          className="font-black text-base tracking-widest uppercase"
          style={{ color: house.secondary, fontFamily: "'Cinzel', serif" }}
        >
          {house.sponsor.name}
        </p>
      </div>

      {/* TITLE SPONSOR badge */}
      <div
        className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[9px] font-black tracking-widest uppercase"
        style={{
          background: house.secondary,
          color: house.primary,
        }}
      >
        Title Sponsor
      </div>
    </div>
  </motion.div>
);

// ── SPECIAL SPONSOR CARD ──────────────────────────────────────────────────────
const SpecialSponsorCard = ({ sponsor, index }: { sponsor: typeof specialSponsors[0]; index: number }) => {
  const theme = {
    primary: '#1e1b4b', // Deep Midnight Indigo
    secondary: '#a855f7', // Radiant Purple
    glow: 'rgba(168, 85, 247, 0.4)',
    border: 'rgba(168, 85, 247, 0.6)',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.1 }}
      className="relative flex flex-col items-center group max-w-sm w-full h-auto"
      style={{ perspective: '1200px' }}
    >
      {/* Premium frame card - More rectangular, reduced size */}
      <div
        className="relative w-full rounded-xl flex flex-col items-center py-6 px-5 transition-all duration-700 group-hover:-translate-y-2 border-2"
        style={{
          background: `linear-gradient(135deg, ${theme.primary}ee, #021516)`,
          borderColor: theme.border,
          boxShadow: `0 0 40px ${theme.glow}, inset 0 0 60px rgba(0,0,0,0.6)`,
        }}
      >
        {/* Elite Badge - Now inside the moving container so it animates with it */}
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase shadow-xl z-30 whitespace-nowrap"
          style={{
            background: theme.secondary,
            color: '#021516',
          }}
        >
          Elite Gaming Partner
        </div>

        {/* Shine Overlay - Contained within a separate absolute div to prevent badge clipping */}
        <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none z-20">
           <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            <div className="absolute -inset-full h-full w-1/2 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shine" />
          </div>
        </div>

        {/* Ornate corner pieces - Smaller and tighter */}
        {['top-3 left-3', 'top-3 right-3', 'bottom-3 left-3', 'bottom-3 right-3'].map((pos, i) => (
          <div
            key={i}
            className={`absolute ${pos} w-4 h-4 pointer-events-none z-30`}
            style={{
              borderTop: i < 2 ? `2px solid ${theme.secondary}` : 'none',
              borderBottom: i >= 2 ? `2px solid ${theme.secondary}` : 'none',
              borderLeft: i % 2 === 0 ? `2px solid ${theme.secondary}` : 'none',
              borderRight: i % 2 === 1 ? `2px solid ${theme.secondary}` : 'none',
            }}
          />
        ))}

        {/* Sponsor Logo — Maximized size in the rectangle */}
        <div
          className="w-full h-32 md:h-44 mb-4 transition-all duration-700 group-hover:scale-105 flex items-center justify-center relative z-10"
          style={{ filter: `drop-shadow(0 0 20px ${theme.glow})` }}
        >
          <img 
            src={sponsor.logo} 
            alt={sponsor.name} 
            className="w-full h-full object-contain p-2" 
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).nextElementSibling?.removeAttribute('style');
            }}
          />
        </div>

        {/* Divider */}
        <div className="w-full h-px mb-4" style={{ background: `linear-gradient(90deg, transparent, ${theme.secondary}, transparent)` }} />

        {/* Sponsor Name Badge — Compact and clean */}
        <div
          className="w-full h-12 rounded-lg flex items-center justify-center"
          style={{
            background: 'rgba(0,0,0,0.4)',
            border: `1px solid ${theme.border}`,
          }}
        >
          <p
            className="font-black text-sm md:text-lg tracking-widest uppercase"
            style={{ color: theme.secondary, fontFamily: "'Cinzel', serif" }}
          >
            {sponsor.name}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// ── SPONSORS SECTION ──────────────────────────────────────────────────────────
const Sponsors = () => (
  <section id="sponsors" className="bg-[#021516] px-4 md:px-12 py-24 text-white overflow-hidden">
    <div className="max-w-7xl mx-auto">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16 text-center md:text-left"
      >
        <h2 className="text-5xl md:text-6xl text-[#d4af37] mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
          Our Sponsors
        </h2>
        <div className="h-1 w-32 bg-[#d4af37]/50 rounded-full mx-auto md:mx-0" />
        <p className="text-gray-500 text-sm mt-4 uppercase tracking-widest">
          The noble houses that power the magic
        </p>
      </motion.div>

      {/* 4 House Sponsor Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
        {houses.map((house, i) => (
          <HouseSponsorCard key={house.name} house={house} index={i} />
        ))}
      </div>

       {/* Divider */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 h-px bg-[#d4af37]/20" />
        <span className="text-[#d4af37]/50 text-xs uppercase tracking-widest font-bold">Our Gaming Partners</span>
        <div className="flex-1 h-px bg-[#d4af37]/20" />
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 mb-16 px-6 overflow-visible">
        {/* Left Golden Strip */}
        <div className="hidden md:block flex-1 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-[#d4af37]/60 shadow-[0_0_15px_rgba(212,175,55,0.3)]" />
        
        <div className="flex flex-wrap justify-center gap-8 w-full md:w-auto">
          {specialSponsors.map((sponsor, i) => (
            <SpecialSponsorCard key={sponsor.name} sponsor={sponsor} index={i} />
          ))}
        </div>

        {/* Right Golden Strip */}
        <div className="hidden md:block flex-1 h-[2px] bg-gradient-to-l from-transparent via-[#d4af37] to-[#d4af37]/60 shadow-[0_0_15px_rgba(212,175,55,0.3)]" />
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 mb-10">
        <div className="flex-1 h-px bg-[#d4af37]/20" />
        <span className="text-[#d4af37]/50 text-xs uppercase tracking-widest font-bold">Associate Sponsors</span>
        <div className="flex-1 h-px bg-[#d4af37]/20" />
      </div>

      {/* Scrolling ticker — right to left, no gaps */}
      <div className="relative overflow-hidden border-t border-b border-[#d4af37]/20">
        {/* Left fade */}
        <div className="absolute left-0 top-0 h-full w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, #021516, transparent)' }} />
        {/* Right fade */}
        <div className="absolute right-0 top-0 h-full w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(270deg, #021516, transparent)' }} />

        <motion.div
          className="flex w-max"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        >
          {allScrolling.map((sponsor, i) => (
  <div
    key={i}
    className="shrink-0 h-28 w-44 flex items-center justify-center border-r border-[#d4af37]/15 bg-[#031d1f]/60 hover:bg-[#0B3D2E]/80 transition-all cursor-pointer group"
  >
    <img
      src={sponsor.logo}
      alt={sponsor.name}
      className="w-full h-full object-contain p-3 opacity-70 group-hover:opacity-100 transition-opacity"
      onError={(e) => {
        (e.target as HTMLImageElement).style.display = 'none';
        (e.target as HTMLImageElement).nextElementSibling?.removeAttribute('style');
      }}
    />
    <span
      className="text-sm font-bold text-gray-400 group-hover:text-[#d4af37] uppercase tracking-widest transition-colors whitespace-nowrap"
      style={{ display: 'none' }}
    >
      {sponsor.name}
    </span>
  </div>
))}
        </motion.div>
      </div>
    </div>
  </section>
);

export default Sponsors;