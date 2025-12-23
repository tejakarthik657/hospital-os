import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

/**
 * Sends real-time notifications to the UI (Image 7)
 */
export async function sendInstantNotification(userId, message, type) {
  const { data, error } = await supabase
    .from('notifications')
    .insert([{ user_id: userId, message, type }]);

  if (error) console.error("Supabase Notify Error:", error);
  return data;
}