import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Wand2, Users2, ShieldHalf, LogOut, Zap, ZapOff } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useCompetitionStore } from '@/store/competitionStore';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const CompetitionHeader = () => {
  const navigate = useNavigate();
  const { email, userId } = useCompetitionStore();
  
  // Local State for Realtime Features
  const [onlineCount, setOnlineCount] = useState(1);
  const [isNetworkOnline, setIsNetworkOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsNetworkOnline(true);
    const handleOffline = () => setIsNetworkOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!userId) return;

    const channel = supabase.channel('online-users', {
      config: {
        presence: {
          key: userId,
        },
      },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState();
        setOnlineCount(Object.keys(newState).length);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            online_at: new Date().toISOString(),
            user: email,
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, email]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/games');
  };

  return (
    <header className="bg-[#1a0f08]/95 backdrop-blur-md border-b-2 border-[#8b6e2e]/30 sticky top-0 z-50 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        
        {/* MAGICAL BRANDING */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#3d2618] to-[#8b6e2e] border-2 border-[#d4af37] flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.3)]">
            <Wand2 className="w-6 h-6 text-[#d4af37]" />
          </div>
          <div>
            <h1 className="font-wizard text-2xl md:text-3xl text-[#d4af37] tracking-widest leading-none">
              TECH<span className="text-[#f2e0b5]">NETICS</span>
            </h1>
            <p className="text-[10px] text-[#f2e0b5]/60 font-crimson italic tracking-[0.2em] uppercase mt-1">
              Ministry of Coding & Wizardry
            </p>
          </div>
        </motion.div>

        {/* ENCHANTED INDICATORS */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4 md:gap-8"
        >
          {/* Wizard Count */}
          <div className="hidden md:flex items-center gap-2 text-[#f2e0b5] bg-[#3d2618]/40 px-4 py-2 rounded-lg border border-[#8b6e2e]/20 shadow-inner">
            <Users2 className="w-4 h-4 text-[#d4af37]" />
            <span className="font-wizard text-lg">{onlineCount}</span>
            <span className="text-[10px] uppercase tracking-wider font-crimson font-bold opacity-70">Wizards Online</span>
          </div>

          {/* Connection Magic */}
          <div className={cn(
            "hidden md:flex items-center gap-2 text-sm px-4 py-2 rounded-lg border transition-all duration-500",
            isNetworkOnline 
                ? "text-[#d4af37] border-[#8b6e2e]/30 bg-[#8b6e2e]/10 shadow-[0_0_10px_rgba(212,175,55,0.1)]" 
                : "text-red-400 border-red-900/50 bg-red-950/20 animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.2)]"
          )}>
            {isNetworkOnline ? <Zap className="w-4 h-4 fill-current" /> : <ZapOff className="w-4 h-4" />}
            <span className="text-[10px] font-bold uppercase tracking-widest font-crimson">
              {isNetworkOnline ? 'Mana Steady' : 'Magic Disrupted'}
            </span>
          </div>

          {/* Wizard Profile & Departure */}
          <div className="flex items-center gap-5 pl-5 border-l border-[#8b6e2e]/20">
            <div className="hidden lg:block text-right">
                <p className="text-[10px] text-[#d4af37] uppercase font-bold tracking-widest font-crimson opacity-60">Identity Verified</p>
                <p className="text-sm text-[#f2e0b5] font-script tracking-wide truncate max-w-[180px]">{email}</p>
            </div>
            
            <Button 
                onClick={handleLogout} 
                variant="ghost" 
                size="icon" 
                className="text-[#d4af37]/60 hover:text-[#d4af37] hover:bg-[#8b6e2e]/20 border border-[#8b6e2e]/10 hover:border-[#d4af37]/40 transition-all rounded-full p-2"
                title="Depart the Great Hall"
            >
                <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>
      </div>
      
      {/* Scroll-like bottom shadow element */}
      <div className="h-1 bg-gradient-to-b from-[#8b6e2e]/20 to-transparent pointer-events-none" />
    </header>
  );
};