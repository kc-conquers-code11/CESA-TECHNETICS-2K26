import { motion } from 'framer-motion';

export const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none bg-black">
      
      {/* 1. Static Gradients (Fastest Layer) */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-black" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-primary/10 via-primary/5 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-accent/5 to-transparent" />

      {/* 2. Grid & Particles (Forced GPU) */}
      <div 
        className="absolute inset-0 grid-bg opacity-60" 
        style={{ transform: 'translateZ(0)' }} 
      />
      <div 
        className="absolute inset-0 particles opacity-40" 
        style={{ transform: 'translateZ(0)' }} 
      />

      {/* 3. Floating Orbs - Optimized with 'will-change' for GPU */}
      {/* Red Orb */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          top: '5%',
          left: '5%',
          background: 'radial-gradient(circle, hsla(0, 85%, 50%, 0.1) 0%, hsla(0, 85%, 50%, 0) 70%)',
          willChange: 'transform', // ⚡ Tells browser to use GPU
        }}
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Pink/Magenta Orb */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          top: '40%',
          right: '5%',
          background: 'radial-gradient(circle, hsla(330, 80%, 55%, 0.08) 0%, hsla(330, 80%, 55%, 0) 70%)',
          willChange: 'transform',
        }}
        animate={{
          x: [0, -30, 0],
          y: [0, 40, 0],
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Blue Portal Orb */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          bottom: '-10%',
          left: '30%',
          background: 'radial-gradient(circle, hsla(200, 80%, 50%, 0.06) 0%, hsla(200, 80%, 30%, 0) 70%)',
          willChange: 'transform',
        }}
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.3, 0.4, 0.3],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* 4. Flickering Lights - Optimized (Opacity only, No Box-Shadow animation) */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-primary"
          style={{
            top: `${15 + (i * 15)}%`,
            left: `${10 + (i * 14)}%`,
            boxShadow: '0 0 8px 2px hsla(0, 85%, 50%, 0.6)', // Static shadow is fine
            willChange: 'opacity', // ⚡ Only animate opacity
          }}
          animate={{
            opacity: [0.2, 0.8, 0.2, 0.5, 0.2], 
          }}
          transition={{
            duration: 3 + i * 0.5, 
            repeat: Infinity,
            ease: "easeInOut", 
            delay: i * 0.2,
          }}
        />
      ))}

      {/* 5. Vine-like tendrils - Simple SVG */}
      <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" style={{ willChange: 'opacity' }}>
        <motion.path
          d="M0,100 Q20,80 10,60 T20,20 T0,0"
          stroke="hsl(200 80% 50%)"
          strokeWidth="1"
          fill="none"
          initial={{ opacity: 0.1 }}
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M100,100 Q80,70 90,50 T80,30 T100,0"
          stroke="hsl(0 85% 50%)"
          strokeWidth="1"
          fill="none"
          initial={{ opacity: 0.1 }}
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </svg>

      {/* 6. Static Texture Overlays */}
      <div 
        className="absolute inset-0 scanlines opacity-20" 
        style={{ transform: 'translateZ(0)' }} 
      />
      
      {/* Noise Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          transform: 'translateZ(0)',
        }}
      />

      {/* 7. Vignette */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/80" />
    </div>
  );
};