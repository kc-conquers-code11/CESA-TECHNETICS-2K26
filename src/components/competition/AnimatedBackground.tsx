import { motion } from 'framer-motion';

export const AnimatedBackground = () => {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none bg-[#021516]">

            {/* 1. Static Gradients */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#021516] via-[#021516] to-[#010a0a]" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#008080]/10 via-[#008080]/5 to-transparent" />
            <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-[#d4af37]/5 to-transparent" />

            {/* 3. Floating Orbs */}
            {/* Gold Orb */}
            <motion.div
                className="absolute w-[500px] h-[500px] rounded-full"
                style={{
                    top: '5%',
                    left: '5%',
                    background: 'radial-gradient(circle, rgba(212,175,55,0.1) 0%, rgba(212,175,55,0) 70%)',
                    willChange: 'transform',
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

            {/* Teal Orb */}
            <motion.div
                className="absolute w-[400px] h-[400px] rounded-full"
                style={{
                    top: '40%',
                    right: '5%',
                    background: 'radial-gradient(circle, rgba(0,128,128,0.1) 0%, rgba(0,128,128,0) 70%)',
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

            {/* Cyan Portal Orb */}
            <motion.div
                className="absolute w-[600px] h-[600px] rounded-full"
                style={{
                    bottom: '-10%',
                    left: '30%',
                    background: 'radial-gradient(circle, rgba(0,255,255,0.06) 0%, rgba(0,255,255,0) 70%)',
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

            {/* 4. Flickering Lights (Fireflies in forest/wizard theme) */}
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1.5 h-1.5 rounded-full bg-[#d4af37]"
                    style={{
                        top: `${15 + (i * 15)}%`,
                        left: `${10 + (i * 14)}%`,
                        boxShadow: '0 0 8px 2px rgba(212,175,55, 0.6)',
                        willChange: 'opacity',
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

            {/* 7. Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />
        </div>
    );
};
