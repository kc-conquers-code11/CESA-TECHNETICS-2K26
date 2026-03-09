import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const WaitingListPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isDarkMarkBounty = location.state?.event === "dark-mark-bounty";

  useEffect(() => {
    if (isDarkMarkBounty) {
      const timer = setTimeout(() => {
        navigate("/dark-mark-bounty");
      }, 5000); // 5 second timeout for Dark Mark Bounty

      return () => clearTimeout(timer);
    }
  }, [isDarkMarkBounty, navigate]);

  return (
    <div className="min-h-screen bg-[#021516] flex flex-col items-center justify-center text-[#d4af37] p-4 relative overflow-hidden">
      {/* Magical background sparkles */}
      <div className="absolute inset-0 opacity-10 mix-blend-screen pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center max-w-3xl bg-[#051112]/90 p-12 lg:p-16 border-2 border-[#d4af37] rounded-xl shadow-[0_0_40px_rgba(212,175,55,0.3)] backdrop-blur-sm z-10"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-6xl md:text-8xl mb-8 drop-shadow-[0_0_15px_rgba(212,175,55,0.8)] font-harry"
        >
          Waiting List
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="text-xl md:text-2xl text-gray-300 font-sans mb-12 leading-relaxed"
        >
          The Sorting Hat is considering your application.
          <br />
          {isDarkMarkBounty
            ? "Preparing the Dark Mark Bounty challenge..."
            : "Please wait for further owls with your instructions..."}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex justify-center mb-12"
        >
          {/* Simple magic ring loader */}
          <div className="w-20 h-20 relative">
            <div className="absolute inset-0 border-4 border-[#d4af37]/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-4 border-[#FFD700] border-b-transparent rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>
          </div>
        </motion.div>

        {isDarkMarkBounty && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="text-[#d4af37] mb-4"
          >
            You will be redirected to the challenge in 5 seconds...
          </motion.p>
        )}

        <motion.button
          whileHover={{
            scale: 1.05,
            backgroundColor: "#d4af37",
            color: "black",
            boxShadow: "0 0 20px rgba(212,175,55,0.6)",
          }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          onClick={() => navigate("/games")}
          className="bg-transparent border-2 border-[#d4af37] text-[#d4af37] px-8 py-3 rounded-lg transition-colors font-bold tracking-wider font-wizard text-xl"
        >
          Return to Games
        </motion.button>
      </motion.div>
    </div>
  );
};

export default WaitingListPage;
