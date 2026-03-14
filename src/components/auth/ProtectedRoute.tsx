import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Loader2, AlertTriangle } from 'lucide-react';

export const ProtectedRoute = ({ children, requireAdmin = false }: { children: React.ReactNode, requireAdmin?: boolean }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // 1. Check Session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Agar login nahi hai -> Login page bhejo
        navigate('/login');
        return;
      }

      // 2. Optional: Admin Check (Agar admin route hai)
      if (requireAdmin) {
        const email = session.user.email;
        const ADMIN_EMAILS = ["admin1@strangertech.in", "kc@strangertech.in"];
        if (!email || !ADMIN_EMAILS.includes(email)) {
            alert("Access Denied: You are not an Admin.");
            navigate('/'); // Wapas home bhej do
            return;
        }
      }

      // Sab sahi hai
      setAuthorized(true);
      setLoading(false);
    };

    checkAuth();
  }, [navigate, requireAdmin]);

  // Loading Screen (Stranger Things Style)
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-red-600 space-y-4">
        <Loader2 className="w-10 h-10 animate-spin" />
        <p className="font-mono text-sm tracking-widest animate-pulse">VERIFYING CLEARANCE...</p>
      </div>
    );
  }

  // Agar authorized hai tabhi content dikhao, warna null
  return authorized ? <>{children}</> : null;
};