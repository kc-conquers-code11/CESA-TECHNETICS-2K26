import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

const MaraudersMapOverlay = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [cursor, setCursor] = useState({ x: 50, y: 50 });
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current!.getBoundingClientRect();
    setCursor({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div
      ref={ref}
      className="h-[450px] w-full rounded-3xl overflow-hidden border-2 border-[#d4af37]/30 shadow-[0_0_40px_rgba(212,175,55,0.15)] relative cursor-crosshair"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.3022145235736!2d72.87585417568701!3d19.050445682148894!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c8c7fb7cb41d%3A0xd2376785df725550!2sVasantdada%20Patil%20Pratishthan&#39;s%20College%20of%20Engineering%20and%20visual%20arts!5e0!3m2!1sen!2sin!4v1772768989337!5m2!1sen!2sin" width="800" height="600" style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(75%) contrast(120%)', pointerEvents: isHovered ? 'none' : 'auto' }} 
        allowFullScreen loading="lazy" className="absolute inset-0" ></iframe>

      <div
        className="absolute inset-0 pointer-events-none transition-none"
        style={{
          backgroundImage: `url('https://www.transparenttextures.com/patterns/old-map.png'), url('https://www.transparenttextures.com/patterns/paper-fibers.png')`,
          backgroundSize: '300px, 200px',
          backgroundColor: '#c4a265',
          backgroundBlendMode: 'multiply, multiply',
          filter: 'sepia(60%) contrast(105%)',
          WebkitMaskImage: isHovered ? `radial-gradient(circle 200px at ${cursor.x}% ${cursor.y}%, transparent 0%, transparent 40%, black 85%)` : 'none',
          maskImage: isHovered ? `radial-gradient(circle 200px at ${cursor.x}% ${cursor.y}%, transparent 0%, transparent 40%, black 85%)` : 'none',
        }}
      />

      <motion.div
        animate={{ opacity: isHovered ? 0 : 1 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center gap-4"
        style={{
          backgroundImage: `url('https://www.transparenttextures.com/patterns/old-map.png'), url('https://www.transparenttextures.com/patterns/paper-fibers.png')`,
          backgroundSize: '300px, 200px',
          backgroundColor: '#c4a265',
          backgroundBlendMode: 'multiply, multiply',
          filter: 'sepia(60%) contrast(105%)',
        }}
      >
        <img
          src="/h.jpg" alt="Hogwarts Castle"
          className="w-48 h-32 object-cover rounded-xl border-2 border-[#d4af37]/40 shadow-[0_0_20px_rgba(101,63,15,0.6)]"
          style={{ filter: 'sepia(20%) contrast(110%)' }}
        />
        <div
          className="px-8 py-3 text-center relative"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(101,63,15,0.5) 20%, rgba(101,63,15,0.5) 80%, transparent)',
            borderTop: '1px solid rgba(101,63,15,0.6)',
            borderBottom: '1px solid rgba(101,63,15,0.6)',
          }}
        >
          <p className="text-[#3b1f05] font-bold text-base italic" style={{ fontFamily: "'Cinzel', serif" }}>
            Vasantdada Patil Pratishthan's
          </p>
          <p className="text-[#3b1f05] font-bold text-sm italic" style={{ fontFamily: "'Cinzel', serif" }}>
            College of Engineering
          </p>
        </div>
        <p className="text-[#5c3a10]/70 text-[10px] tracking-[0.4em] uppercase mt-2" style={{ fontFamily: "'Georgia', serif" }}>
          Hover to reveal the map
        </p>
        <div className="flex gap-2 mt-1">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#5c3a10]/40 animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
          ))}
        </div>
        <div className="absolute inset-3 rounded-2xl pointer-events-none" style={{ border: '1.5px dashed rgba(92,58,16,0.4)' }} />
      </motion.div>

      {isHovered && (
        <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{ boxShadow: 'inset 0 0 60px rgba(212,175,55,0.12), 0 0 60px rgba(212,175,55,0.15)' }} />
      )}
      <div className="absolute inset-0 pointer-events-none border-10 border-[#021516] rounded-3xl" />
    </div>
  );
};

const ApparateHere = () => {
const handleMapRedirect = () => {
  window.open(
    "https://maps.app.goo.gl/etGCvsK98hgU1NLE6",
    "_blank",
    "noopener,noreferrer"
  );
};

  return (
    <section id="apparate" className="bg-[#021516] px-6 md:px-12 py-24 text-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16"
        >
          <div className="flex flex-col justify-center">
            <h2 className="text-5xl md:text-6xl text-[#d4af37] mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
              Apparate Here
            </h2>
            <div className="h-1 w-32 bg-[#d4af37]/50 rounded-full mb-8" />
            <h3 className="text-2xl font-bold text-white mb-6">
              Vasantdada Patil Pratishthan's College of Engineering & Visual Arts
            </h3>
            <p className="text-gray-400 text-lg leading-relaxed mb-8 border-l-4 border-[#d4af37]/30 pl-6">
              Vasantdada Patil Educational Complex, Eastern Express Highway, Sion-Chunabhatti, Mumbai 400022
            </p>
            <div className="bg-teal-900/20 border border-teal-800/50 p-6 rounded-2xl mb-8">
              <p className="text-teal-300 font-bold flex items-center gap-3 italic">
                <span className="text-2xl">🏰</span> Arrival window: March 16-18, 2026
              </p>
            </div>
            <button
              onClick={handleMapRedirect}
              className="w-fit px-8 py-4 border-2 border-teal-500 text-teal-300 hover:bg-teal-500 hover:text-black rounded-xl transition-all font-black uppercase tracking-widest text-sm"
            >
              Open in Maps
            </button>
          </div>

          <MaraudersMapOverlay />
        </motion.div>
      </div>
    </section>
  );
};

export default ApparateHere;