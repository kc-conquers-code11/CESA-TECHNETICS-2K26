import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── HP CHARACTER IMAGE AVATARS ────────────────────────────────────────────────
const HarryAvatar    = () => <img src="/character/harry.png"     alt="Harry"     className="w-full h-full object-contain" />;
const HermioneAvatar = () => <img src="/character/hermione.png"  alt="Hermione"  className="w-full h-full object-contain" />;
const RonAvatar      = () => <img src="/character/ron.png"       alt="Ron"       className="w-full h-full object-contain" />;
const SnappeAvatar   = () => <img src="/character/snape.png"     alt="Snape"     className="w-full h-full object-contain" />;
const DumbledoreAvatar = () => <img src="/character/dumbledore.png" alt="Dumbledore" className="w-full h-full object-contain" />;
const HagridAvatar   = () => <img src="/character/hagrid.png"    alt="Hagrid"    className="w-full h-full object-contain" />;

const faqs = [
  {
    q: "When will problem statements be released?",
    a: "Problem statements will be released on April 15th and shared with all registered participants via the WhatsApp group and Clubly portal.",
    character: <HarryAvatar />,
    glowColor: "#4fc3f7",
    borderColor: "#0288d1",
  },
  {
    q: "Do projects need to be submitted on a platform?",
    a: "Yes! All submissions must be uploaded to the Clubly portal before the deadline. Physical demos are also required at presentation time.",
    character: <HermioneAvatar />,
    glowColor: "#f48fb1",
    borderColor: "#e91e8c",
  },
  {
    q: "Will teams be allowed to call upon mentors?",
    a: "Mentors will be available during designated Q&A slots. You may approach them during these windows but not during the active build phase.",
    character: <RonAvatar />,
    glowColor: "#ef9a9a",
    borderColor: "#c0392b",
  },
  {
    q: "Is the use of pre-existing code allowed?",
    a: "Open-source libraries and frameworks are permitted. However, submitting a previously built project as your own is strictly prohibited.",
    character: <SnappeAvatar />,
    glowColor: "#ce93d8",
    borderColor: "#7b1fa2",
  },
  {
    q: "What are the judging criteria?",
    a: "Projects are judged on Innovation (30%), Technical Complexity (30%), Presentation (20%), and Real-world Impact (20%).",
    character: <DumbledoreAvatar />,
    glowColor: "#a5d6a7",
    borderColor: "#2e7d32",
  },
  {
    q: "What is the duration of each event?",
    a: "Most events run for 3–8 hours depending on the trial. Refer to the schedule released on Clubly for exact timings per event.",
    character: <HagridAvatar />,
    glowColor: "#ffe082",
    borderColor: "#f9a825",
  },
];

// ── FAQ CARD ─────────────────────────────────────────────────────────────────
const FAQCard = ({ faq, index }: { faq: typeof faqs[0]; index: number }) => {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      onClick={() => setOpen(!open)}
      className="relative rounded-2xl cursor-pointer overflow-hidden"
      style={{
        background: '#0d1b1c',
        border: `2px solid ${open ? faq.borderColor : 'rgba(255,255,255,0.08)'}`,
        boxShadow: open
          ? `0 0 24px 4px ${faq.glowColor}55, inset 0 0 30px ${faq.glowColor}11`
          : '0 2px 12px rgba(0,0,0,0.4)',
        transition: 'all 0.4s ease',
      }}
    >
      {/* Animated border glow on open */}
      {open && (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            boxShadow: `inset 0 0 40px ${faq.glowColor}22`,
            border: `1px solid ${faq.glowColor}44`,
            borderRadius: '1rem',
          }}
        />
      )}

      <div className="flex items-center justify-between p-5 gap-4">
        <div className="flex-1">
          <p
            className="font-bold text-base leading-snug mb-0"
            style={{
              fontFamily: "'Cinzel', serif",
              color: open ? faq.glowColor : 'white',
              transition: 'color 0.3s ease',
              fontStyle: 'italic',
            }}
          >
            {faq.q}
          </p>

          <AnimatePresence>
            {open && (
              <motion.p
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.35 }}
                className="text-sm text-gray-300 leading-relaxed overflow-hidden"
                style={{ fontStyle: 'italic' }}
              >
                {faq.a}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Character avatar with glow on open */}
        <div
          className="flex-shrink-0 w-16 h-16 rounded-full overflow-hidden"
          style={{
            filter: open
              ? `drop-shadow(0 0 10px ${faq.glowColor}) drop-shadow(0 0 20px ${faq.glowColor}88)`
              : 'none',
            transition: 'filter 0.4s ease',
          }}
        >
          {faq.character}
        </div>
      </div>
    </motion.div>
  );
};

// ── CONTACT FORM ─────────────────────────────────────────────────────────────
const ContactForm = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (form.name && form.email && form.subject && form.message) {
      const to = 'technetics2k26@gmail.com'; // 👈 replace with your Gmail
      const subject = encodeURIComponent(`[Technetics Ticket] ${form.subject}`);
      const body = encodeURIComponent(
        `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
      );
      window.open(`mailto:${to}?subject=${subject}&body=${body}`, '_blank');
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
      setForm({ name: '', email: '', subject: '', message: '' });
    }
  };

  const inputClass = "w-full bg-[#0d1b1c] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#d4af37]/60 focus:ring-1 focus:ring-[#d4af37]/30 transition-all";

  return (
    <div className="bg-[#0d1b1c] border border-white/10 rounded-2xl p-8">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">📬</span>
        <h3 className="text-xl font-bold text-white">Raise a Ticket</h3>
      </div>
      <p className="text-gray-500 text-sm mb-7">Have a question? Send an owl our way. We usually respond within 4 hours.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
          <input
            type="text"
            placeholder="John Doe"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
          <input
            type="email"
            placeholder="john@example.com"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2">Subject</label>
        <input
          type="text"
          placeholder="e.g. Issue with Event Registration"
          value={form.subject}
          onChange={e => setForm({ ...form, subject: e.target.value })}
          className={inputClass}
        />
      </div>

      <div className="mb-6">
        <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2">Message</label>
        <textarea
          rows={5}
          placeholder="Describe your issue or question in detail..."
          value={form.message}
          onChange={e => setForm({ ...form, message: e.target.value })}
          className={`${inputClass} resize-none`}
        />
      </div>

      <button
        disabled
        title="Backend integration coming soon!"
        className="flex items-center gap-2 px-7 py-3 bg-[#d4af37]/50 text-[#021516] text-sm font-black uppercase tracking-widest rounded-xl cursor-not-allowed opacity-60 select-none"
      >
        <span>🪄</span> Send Owl
      </button>

      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 px-4 py-3 bg-teal-900/40 border border-teal-500/40 rounded-xl text-teal-300 text-sm"
          >
            ✓ Your owl has been dispatched! We'll respond shortly.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── COMMON QUESTIONS SIDEBAR ──────────────────────────────────────────────────
const commonQuestions = [
  { q: "Registration not working?", a: "Try clearing your browser cache and logging in again on Clubly." },
  { q: "Team size mismatch?", a: "Ensure all members are registered before forming a team on Clubly." },
  { q: "Certificate not received?", a: "Certificates are issued 7–10 days after the event via email." },
  { q: "Payment query?", a: "All events are free to participate. No payment is required." },
  { q: "Schedule not visible?", a: "Full schedule will be published on Clubly 48 hours before the event." },
];

const SidebarFAQ = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <div className="space-y-3">
      {commonQuestions.map((item, i) => (
        <div
          key={i}
          className="border border-white/8 rounded-xl overflow-hidden cursor-pointer"
          onClick={() => setOpenIdx(openIdx === i ? null : i)}
        >
          <div className="flex items-center justify-between px-4 py-3 bg-[#0d1b1c] hover:bg-[#112224] transition-colors">
            <span className="text-sm font-semibold text-white">{item.q}</span>
            <motion.span
              animate={{ rotate: openIdx === i ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-gray-400 text-xs ml-2 flex-shrink-0"
            >
              ▼
            </motion.span>
          </div>
          <AnimatePresence>
            {openIdx === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="px-4 py-3 bg-[#091415] text-gray-400 text-sm border-t border-white/5">
                  {item.a}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}

      {/* Business Hours */}
      <div className="mt-4 p-4 bg-[#0d1b1c] border border-[#d4af37]/20 rounded-xl">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[#d4af37]">⏰</span>
          <h4 className="text-[#d4af37] font-bold text-sm">Response Hours</h4>
        </div>
        <p className="text-gray-400 text-xs">Mon – Sat: 9:00 AM – 8:00 PM</p>
        <p className="text-gray-400 text-xs mt-1">Average response time: <span className="text-white font-bold">2–4 hours</span></p>
      </div>
    </div>
  );
};

// ── MAIN CONTACT US SECTION ───────────────────────────────────────────────────
const ContactUs = () => {
  return (
    <section id="contact" className="bg-[#021516] px-6 md:px-12 py-24 text-white">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center md:text-left"
        >
          <h2 className="text-5xl md:text-6xl text-[#d4af37] mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
            Contact Us
          </h2>
          <div className="h-1 w-32 bg-[#d4af37]/50 rounded-full mx-auto md:mx-0" />
        </motion.div>

        {/* Raise a Ticket + Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24"
        >
          <div className="lg:col-span-2">
            <ContactForm />
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <span>📖</span> Common Questions
            </h4>
            <SidebarFAQ />
          </div>
        </motion.div>

        {/* FAQs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <h2 className="text-4xl md:text-5xl text-[#d4af37] mb-3" style={{ fontFamily: "'Cinzel', serif" }}>
            FAQs
          </h2>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto mb-2" />
          <p className="text-gray-500 text-sm uppercase tracking-widest">Click a card to reveal the answer</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {faqs.map((faq, i) => (
            <FAQCard key={i} faq={faq} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default ContactUs;