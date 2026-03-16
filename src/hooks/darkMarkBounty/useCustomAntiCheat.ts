import { useEffect } from 'react';
import { logActivity } from '@/lib/logger';

export const useCustomAntiCheat = () => {
    useEffect(() => {
        // 1. Detect Tab Switching
        const handleVisibilityChange = () => {
            if (document.hidden) {
                logActivity('TAB_SWITCH', { message: 'User switched tabs/minimized window during active game' });
            }
        };

        // 2. Detect Copy/Paste
        const handleCopy = () => logActivity('COPY_PASTE', { type: 'copy' });
        const handlePaste = () => logActivity('COPY_PASTE', { type: 'paste' });

        document.addEventListener('visibilitychange', handleVisibilityChange);
        document.addEventListener('copy', handleCopy);
        document.addEventListener('paste', handlePaste);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            document.removeEventListener('copy', handleCopy);
            document.removeEventListener('paste', handlePaste);
        };
    }, []);
};
