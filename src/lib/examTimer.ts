// src/lib/examTimer.ts
import { supabase } from './supabaseClient';

export const startRoundTimer = async (userId: string, round: 'mcq' | 'flowchart' | 'coding') => {
  try {
    // 1. Check if start time already exists
    const { data, error } = await supabase
      .from('exam_sessions')
      .select(`${round}_start_time`)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    // 2. Only update if it is NULL
    // @ts-ignore
    if (!data || !data[`${round}_start_time`]) {
      console.log(`Starting Timer for ${round}...`);
      await supabase
        .from('exam_sessions')
        .upsert({ 
            user_id: userId, 
            [`${round}_start_time`]: new Date().toISOString() 
        }, { onConflict: 'user_id' });
    } else {
      console.log(`${round} timer already running.`);
    }
  } catch (err) {
    console.error(`Failed to start ${round} timer:`, err);
  }
};

export const endRoundTimer = async (userId: string, round: 'mcq' | 'flowchart' | 'coding') => {
  try {
    const endTime = new Date().toISOString();
    
    // 1. Fetch Start Time to calculate duration
    const { data } = await supabase
        .from('exam_sessions')
        .select(`${round}_start_time`)
        .eq('user_id', userId)
        .single();

    let duration = 0;
    // @ts-ignore
    if (data && data[`${round}_start_time`]) {
        // @ts-ignore
        const start = new Date(data[`${round}_start_time`]).getTime();
        const end = new Date(endTime).getTime();
        duration = Math.floor((end - start) / 1000); // Seconds
    }

    // 2. Update End Time & Duration
    console.log(`Ending Timer for ${round}. Duration: ${duration}s`);
    await supabase
      .from('exam_sessions')
      .update({ 
          [`${round}_end_time`]: endTime,
          [`${round}_duration_seconds`]: duration
      })
      .eq('user_id', userId);

  } catch (err) {
    console.error(`Failed to end ${round} timer:`, err);
  }
};