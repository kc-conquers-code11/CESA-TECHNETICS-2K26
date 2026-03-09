import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { Loader2 } from 'lucide-react';

export const ProtectedRoute = ({ children, requireAdmin = false }: { children: React.ReactNode, requireAdmin?: boolean }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                navigate('/login');
                return;
            }

            if (requireAdmin) {
                const email = session.user.email;
                const ADMIN_EMAILS = ["admin1@strangertech.in", "kc@strangertech.in", "admin@cesa.in"];
                if (!email || !ADMIN_EMAILS.includes(email)) {
                    alert("Access Denied: You are not an Admin.");
                    navigate('/');
                    return;
                }
            }

            setAuthorized(true);
            setLoading(false);
        };

        checkAuth();
    }, [navigate, requireAdmin]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#021516] flex flex-col items-center justify-center text-[#d4af37] space-y-4 font-inter">
                <Loader2 className="w-10 h-10 animate-spin" />
                <p className="font-wizard text-xl tracking-widest animate-pulse">VERIFYING WIZARD CLEARENCE...</p>
            </div>
        );
    }

    return authorized ? <>{children}</> : null;
};
