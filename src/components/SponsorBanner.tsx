import { motion } from "framer-motion"
import { Download } from "lucide-react"

export default function SponsorBanner() {
  return (
    <section className="relative w-full py-10 px-6 flex justify-center brightness-75 hover:brightness-100 transition-all duration-500 hover:shadow-[0_0_40px_rgba(11,61,46,0.9)] ">

      {/* Magical background */}
      <div className="absolute inset-0 bg-linear-to-r from-[#0B3D2E] via-[#07241b] to-[#0B3D2E] opacity-95"></div>

      {/* Glow border */}
      <div className="absolute inset-0 border-y border-[#00FFB3]/40 shadow-[0_0_40px_rgba(0,255,179,0.4)]"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative max-w-6xl w-full flex flex-col md:flex-row items-center justify-between gap-6"
      >

        {/* Text */}
        <div className="text-center md:text-left">
          <h2
            className="text-3xl md:text-4xl"
            style={{
              fontFamily: "'Cinzel', serif",
              background:
                "linear-gradient(90deg,#FFE092,#FFB702,#FFE6A8,#FFD05A,#FFB700)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Become a Sponsor of Technetics 2K26
          </h2>

          <p className="text-emerald-200 mt-2 text-sm md:text-base">
            Partner with one of the most magical tech fests and showcase your
            brand to thousands of innovators.
          </p>
        </div>

        {/* Download Button */}
        <a
          href="/sponsors/brochure.pdf"
          download="Technetics_Sponsor_Brochure.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 px-6 py-3 rounded-xl
          bg-linear-to-r from-[#FFB702] to-[#FFD05A]
          text-black font-semibold shadow-[0_0_20px_rgba(255,183,0,0.6)]
          hover:scale-105 transition-all duration-300"
        >
          <Download size={18} />
          Download Sponsor Brochure
        </a>

      </motion.div>

      {/* Magical particles */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-size-[30px_30px] opacity-10"></div>

    </section>
  )
}