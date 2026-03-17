// src/lib/logger.ts
import { supabase } from './supabaseClient';

export type LogAction = 'TAB_SWITCH' | 'FULLSCREEN_EXIT' | 'COPY_PASTE' | 'ROUND_START' | 'SUBMIT';

export const logActivity = async (action: LogAction, details: any = {}) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('activity_logs').insert({
      user_id: user.id,
      action_type: action,
      details: details,
      severity: action === 'TAB_SWITCH' || action === 'FULLSCREEN_EXIT' ? 'warning' : 'info',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
};