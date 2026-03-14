// src/hooks/useAntiCheat.ts
import { useEffect } from 'react';
import { logActivity } from '@/lib/logger';

export const useAntiCheat = () => {
  useEffect(() => {
    // 1. Detect Tab Switching
    const handleVisibilityChange = () => {
      if (document.hidden) {
        logActivity('TAB_SWITCH', { message: 'User switched tabs/minimized window' });
        // Optional: Trigger Warning UI here
      }
    };

    // 2. Detect Fullscreen Exit (Agar fullscreen force karwana hai)
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        logActivity('FULLSCREEN_EXIT', { message: 'User exited fullscreen mode' });
      }
    };

    // 3. Detect Copy/Paste
    const handleCopy = () => logActivity('COPY_PASTE', { type: 'copy' });
    const handlePaste = () => logActivity('COPY_PASTE', { type: 'paste' });

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
    };
  }, []);
};