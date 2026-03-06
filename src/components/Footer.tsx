import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Instagram } from 'lucide-react';

// ── FOOTPRINT SVG ─────────────────────────────────────────────────────────────
const FootprintSVG = ({ mirrored = false, color = '#5c3a10' }: { mirrored?: boolean; color?: string }) => (
  <svg
    width="16" height="22" viewBox="0 0 18 26" fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ transform: mirrored ? 'scaleX(-1)' : 'none' }}
  >
    <ellipse cx="9" cy="20" rx="5.5" ry="5" fill={color} opacity="0.85" />
    <ellipse cx="9" cy="11" rx="4.5" ry="5" fill={color} opacity="0.85" />
    <ellipse cx="5" cy="4" rx="2.2" ry="2.8" fill={color} opacity="0.75" />
    <ellipse cx="8" cy="2" rx="2" ry="2.5" fill={color} opacity="0.75" />
    <ellipse cx="11" cy="2" rx="2" ry="2.5" fill={color} opacity="0.75" />
    <ellipse cx="14" cy="4" rx="1.8" ry="2.3" fill={color} opacity="0.65" />
  </svg>
);

// ── WALKING FOOTPRINTS ────────────────────────────────────────────────────────
interface Footprint {
  id: number;
  x: number;
  y: number;
  angle: number;
  isRight: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const WalkingFootprints = () => {
  const [prints, setPrints] = useState<Footprint[]>([]);
  const counterRef = useRef(0);
  const posRef = useRef({ x: 10, y: 50 });
  const angleRef = useRef(15);
  const stepRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Continuously generate walking footprints across the footer
    intervalRef.current = setInterval(() => {
      const isRight = stepRef.current % 2 === 0;
      const sideways = isRight ? 3 : -3;
      const forward = 2.2 + Math.random() * 0.8;

      // Gently steer back toward center if drifting too far
      if (posRef.current.y < 20) angleRef.current = Math.min(angleRef.current + 3, 30);
      if (posRef.current.y > 80) angleRef.current = Math.max(angleRef.current - 3, -30);
      // Wander the angle slightly
      angleRef.current += (Math.random() - 0.5) * 6;
      angleRef.current = Math.max(-40, Math.min(40, angleRef.current));

      const rad = (angleRef.current * Math.PI) / 180;
      posRef.current = {
        x: posRef.current.x + forward * Math.cos(rad),
        y: posRef.current.y + sideways + forward * Math.sin(rad),
      };

      // Loop back when reaching the right edge
      if (posRef.current.x > 102) {
        posRef.current = { x: -2, y: 20 + Math.random() * 60 };
        angleRef.current = -10 + Math.random() * 20;
      }

      const newPrint: Footprint = {
        id: counterRef.current++,
        x: posRef.current.x,
        y: Math.max(5, Math.min(92, posRef.current.y)),
        angle: angleRef.current + (isRight ? -12 : 12),
        isRight,
      };

      setPrints(prev => [...prev.slice(-28), newPrint]);
      stepRef.current++;
    }, 320);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {prints.map((print) => (
          <motion.div
            key={print.id}
            className="absolute"
            style={{
              left: `${print.x}%`,
              top: `${print.y}%`,
              rotate: print.angle,
              translateX: '-50%',
              translateY: '-50%',
            }}
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: [0, 0.85, 0.7, 0.4] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3.5, ease: 'easeOut', times: [0, 0.1, 0.5, 1] }}
          >
            <FootprintSVG mirrored={!print.isRight} color="#5c3a10" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// ── FOOTER ────────────────────────────────────────────────────────────────────
const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  
  const socialLinks = [
  {
    label: "Mail",
    icon: (
      <a href="mailto:cesaxcsi@gmail.com">
        <Mail className="w-5 h-5 text-gray-600 hover:text-blue-500 transition-colors" />
      </a>
    ),
  },
  {
    label: "Instagram",
    icon: (
      <a href="https://www.instagram.com/cesa.csi/" target="_blank" rel="noopener noreferrer">
        <Instagram className="w-5 h-5 text-gray-600 hover:text-pink-500 transition-colors" />
      </a>
    ),
  },
  {
    label: "Discord",
    icon: (
      <a href="https://discord.gg/k6QYC64N" target="_blank" rel="noopener noreferrer">
        <img src="/discord.svg" alt="Discord" className="w-5 h-5 text-gray-600 hover:text-indigo-500 transition-colors" />
      </a>
    ),
  },
];

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden text-[#3b1f05] py-14 px-6 md:px-12"
    >
      {/* Video background */}
      <video
        autoPlay loop muted playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="/footer.mp4"
      />

      {/* Parchment overlay on top of video */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          backgroundImage: `url('https://www.transparenttextures.com/patterns/old-map.png'), url('https://www.transparenttextures.com/patterns/paper-fibers.png')`,
          backgroundSize: '300px, 200px',
          backgroundColor: '#c4a265cc',
          backgroundBlendMode: 'multiply, multiply',
          opacity: 0.82,
        }}
      />
      {/* Parchment inner shadow */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_80px_rgba(92,58,16,0.35)] z-20" />

      {/* Dashed parchment border */}
      <div
        className="absolute inset-3 pointer-events-none rounded-sm z-20"
        style={{ border: '1.5px dashed rgba(92,58,16,0.35)' }}
      />

      {/* Walking footprints */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <WalkingFootprints />
      </div>

      {/* Content — sits above everything */}
      <div className="relative z-30 max-w-7xl mx-auto">

        {/* Top: Technetics title in map style */}
        <div className="text-center mb-10">
          <h2
            className="text-4xl md:text-5xl font-black tracking-widest"
            style={{
              fontFamily: "'Cinzel', serif",
              color: '#3b1f05',
              textShadow: '1px 1px 0 rgba(92,58,16,0.3)',
            }}
          >
            ✦ TECHNETICS 2K26 ✦
          </h2>
          <div
            className="h-px w-64 mx-auto mt-3"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(92,58,16,0.5), transparent)' }}
          />
        </div>

        {/* Links grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div>
            <h4
              className="font-black text-sm uppercase tracking-[0.25em] mb-4 flex items-center gap-2"
              style={{ fontFamily: "'Cinzel', serif", color: '#3b1f05' }}
            >
              <span>⚡</span> Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
  {[
    { name: "Home", href: "#home" },
    { name: "Events", href: "#events" },
    { name: "Sponsors", href: "#sponsors" }
  ].map((link) => (
    <li key={link.name}>
      <a
        href={link.href}
        className="transition-all duration-200 hover:font-bold"
        style={{ color: "#5c3a10", fontStyle: "italic" }}
      >
        — {link.name}
      </a>
    </li>
  ))}
</ul>
          </div>

          <div>
            <h4
              className="font-black text-sm uppercase tracking-[0.25em] mb-4 flex items-center gap-2"
              style={{ fontFamily: "'Cinzel', serif", color: '#3b1f05' }}
            >
              <span>🦉</span> Social
            </h4>
            <div className="flex gap-3">
              {socialLinks.map((s) => {
  const isDiscord = s.label.toLowerCase() === "discord";

  return (
    <div
  key={s.label}
  title={s.label}
  className={`
    flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-xs font-black transition-all hover:scale-110
    border-[1.5px] border-[#5c3a10]/50
    ${!isDiscord 
      ? "bg-[#5c3a10]/12 text-[#3b1f05]"
      : "bg-[#5c3a10]/12 text-[#3b1f05] hover:bg-[#5865F2]"
    }
  `}
>
  {s.icon}
</div>
  );
})}
            </div>
          </div>

          <div>
            <h4
              className="font-black text-sm uppercase tracking-[0.25em] mb-4 flex items-center gap-2"
              style={{ fontFamily: "'Cinzel', serif", color: '#3b1f05' }}
            >
              <span>🏰</span> Community
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'Discord Server', href: '#discord' },
                { label: 'Clubly Portal', href: '#clubly' },
              ].map(item => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="transition-all duration-200 hover:font-bold"
                    style={{ color: '#5c3a10', fontStyle: 'italic' }}
                  >
                    — {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs"
          style={{
            borderTop: '1px solid rgba(92,58,16,0.3)',
            color: '#7a4f1f',
            fontStyle: 'italic',
          }}
        >
          <p style={{ fontFamily: "'Georgia', serif" }}>
            © 2026 TECHNETICS · CESA × CSI · All rights reserved.
          </p>

          {/* Developer watermark */}
          <p
            style={{
              fontFamily: "'Georgia', serif",
              color: 'rgba(122,79,31,0.55)',
              fontSize: '0.68rem',
              letterSpacing: '0.04em',
              userSelect: 'none',
            }}
          >
            Developed by{' '}
            <a
              href="https://github.com/bhuvaneshrn"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'rgba(122,79,31,0.7)',
                textDecoration: 'none',
                borderBottom: '1px dotted rgba(212,175,55,0.35)',
                paddingBottom: '1px',
                transition: 'color 0.25s ease, text-shadow 0.25s ease, border-color 0.25s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget;
                el.style.color = '#d4af37';
                el.style.textShadow = '0 0 8px rgba(212,175,55,0.5)';
                el.style.borderBottomColor = '#d4af37';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget;
                el.style.color = 'rgba(122,79,31,0.7)';
                el.style.textShadow = 'none';
                el.style.borderBottomColor = 'rgba(212,175,55,0.35)';
              }}
            >
              Bhuvi
            </a>
          </p>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{
              border: '1.5px solid rgba(92,58,16,0.5)',
              background: 'rgba(92,58,16,0.12)',
              color: '#3b1f05',
              fontWeight: 'bold',
            }}
          >
            ↑
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
